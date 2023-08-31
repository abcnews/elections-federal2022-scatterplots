import { sum, range, min, max } from 'd3';
import { regressionLog, regressionLinear } from 'd3-regression';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS, MAJOR_PARTY_CODES } from '../constants';
import PARTIES from '../party.json';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';

export const determineXAxisLabel = (xAxisLabelOverride, xAxisFields) => {
  if (xAxisLabelOverride) {
    return xAxisLabelOverride;
  }

  if (xAxisFields.length === 1) {
    return xAxisFields[0];
  }

  return 'X Axis Label Override Needed!';
};

export const determineYAxisLabel = (yAxisLabelOverride, yAxisMethod) => {
  if (yAxisLabelOverride) {
    return yAxisLabelOverride;
  }

  const method = Y_AXIS_METHODS.find(method => method.id === yAxisMethod);
  return method?.label || '';
};

//
// Combine election results data with demographic data
//
export const calcScatterData = (
  results: any,
  demographics: any,
  graph: any,
) => {
  const {
    xAxisFields,
    yAxisMethod,
    colourBy,
    xAxisInverse,
    heldByFilters,
    closenessFilters,
    geoFilters,
    onlyCalledElectorates,
    electorateHighlights,
    combineStates,
  } = graph;

  const isZeroX = xAxisFields.length === 1 && xAxisFields[0] === 'zero';

  if (!results || !demographics || !xAxisFields || xAxisFields.length === 0) {
    console.log('here');
    return [];
  }

  // Special case to wrap data up into states
  if (combineStates) {
    const states = {};

    results.forEach(result => {
      const state = result.state.toUpperCase();
      const combinedStateData = states[state] || {
        yesVotes: 0,
        noVotes: 0,
        electorates: [],
      };

      // TODO: Fix this!
      combinedStateData.yesVotes += result.afterPrefs[0].simple.votes;
      combinedStateData.noVotes += result.afterPrefs[1].simple.votes;
      combinedStateData.electorates.push(result.name);

      states[state] = combinedStateData;
    });

    let i = 0;
    return Object.keys(states).map(state => {
      // TODO: set based on yes/no probably
      let colour = isDM => COLOURS(isDM).PRIMARY;
      let labelColour = isDM => COLOURS(isDM).TEXT;

      if (colourBy === 'result') {
        colour = isDM => (yesVotes / (noVotes + yesVotes)) < 0.5 ? COLOURS(isDM).FOCUS : COLOURS(isDM).PRIMARY;
      }

      const { yesVotes, noVotes } = states[state];

      let x = i++;
      if (isZeroX) {
        x = 0;
      }

      return {
        x,
        y: (yesVotes / (noVotes + yesVotes)) * 100,
        r: 5,

        electorate: state,
        colour,
        labelColour,
      };
    });
  }

  const electorates = results.map(result => {
    // Get the demographic data for the electorate
    const demo = demographics.find(d => d.Electorate === result.name);
    // Get the categories for the electorate
    const categories = ELECTORATE_CATEGORIES.find(c => c.Electorate === result.name);

    let winningParty = PARTIES.find(p => p.Electorate === result.name)?.Party;
    // LNP in QLD maps to LIB for our purposes
    if (winningParty === 'LNP') {
      winningParty = 'LIB';
    }

    // If not major party (incl. greens), set it to OTH
    //
    // This will catch IND, UAP, ONP, CA
    if (winningParty && MAJOR_PARTY_CODES.indexOf(winningParty) === -1) {
      winningParty = 'OTH';
    }

    // Ignore electorates with incomplete data
    if (!demo || xAxisFields.length === 0 || !categories || !winningParty) {
      console.log('Filtered (incomplete data):', result.name);
      // console.log(demo, xAxisFields, categories, winningParty);
      return null;
    }

    if (heldByFilters.length > 0) {
      if (heldByFilters.indexOf(winningParty) === -1) {
        // console.log('Held By Filtered:', result.name);
        return null;
      }
    }
    if (closenessFilters.length > 0) {
      if (closenessFilters.indexOf(categories['Closeness']) === -1) {
        // console.log('Closeness Filtered:', result.name);
        return null;
      }
    }
    if (geoFilters.length > 0) {
      if (geoFilters.indexOf(categories['Geo']) === -1) {
        // console.log('Geo Filtered:', result.name);
        return null;
      }
    }

    let colour = isDM => COLOURS(isDM).PRIMARY;
    let labelColour = isDM => COLOURS(isDM).TEXT;

    // Party colours
    if (colourBy === 'party') {
      colour = isDM => COLOURS(isDM).PARTIES[winningParty as string];
      labelColour = isDM => COLOURS(isDM).PARTY_LABELS[winningParty as string];
    }

    // Highlight colours
    if (colourBy === 'highlight') {
      const isHighlighted = electorateHighlights.indexOf(result.name) > -1;

      colour = isDM => isHighlighted ? COLOURS(isDM).FOCUS : COLOURS(isDM).PRIMARY;
      labelColour = isDM => COLOURS(isDM).TEXT;
    }

    return {
      x: xAxis(demo, xAxisFields),
      y: yAxis(result, yAxisMethod),
      r: 3,
      electorate: result.name,
      colour,
      labelColour,
    };
  });

  return electorates
    // .filter(e => !!e && e.y !== null);
    .filter(e => !!e);
};

export const swing = (res) => {
  if (!res) {
    return null;
  }

  return parseFloat(res.predicted2CP.swing);
};

export const twoCP = (res) => {
  if (!res) {
    return null;
  }

  return parseFloat(res.predicted2CP.pct);
};

export const primarySwing = (runners) => {
  if (runners.length === 0) {
    return null;
  }

  return sum(runners.map(r => parseFloat(r.predicted.swing)));
};

export const primary = (runners) => {
  if (runners.length === 0) {
    return null;
  }

  return sum(runners.map(r => parseFloat(r.predicted.pct)));
};

//
// Calculate the vote measure for the Y Axis
//
export const yAxis = (result: any, method: string): number | null => {
  if (method === 'zero') {
    return 0;
  }

  //
  // Yes/No vote
  //
  // TODO: calc vote % when we have test data
  const laborRunners = (result.runners || []).filter(
    p => p.party.code === 'ALP'
  );
  if (method === 'yesvote') {
    return primary(laborRunners);
  }
  if (method === 'novote') {
    return 1 - primary(laborRunners);
  }

  return null;
}

//
// Calculate the chosen demographic as a % of the total population of the electorate
//
const xAxis = (demo: any, xAxisFields: string[]): number | null => {
  const values = xAxisFields.map(field => demo[field]);
  if (values.findIndex(v => v == null) > -1) {
    return 0;
  }
  return sum(values.map(v => parseFloat(v)));
};

//
// Trendline calculation
//
// Compute estimated value at each target x coordinate using the
// source particles (the samples).
export const calcSmoothedLine = (data, bandwidth: number, method: string) => {
  if (method === 'log') {
    const regressionGenerator = regressionLog()
      .x(d => d.x)
      .y(d => d.y);

    return regressionGenerator(data).map(([x, y]) => ({ x, y }));
  }

  if (method === 'linear') {
    const regressionGenerator = regressionLinear()
      .x(d => d.x)
      .y(d => d.y);

    return regressionGenerator(data).map(([x, y]) => ({ x, y }));
  }

  if (method === 'gaussian') {
    const targets = range(
      min(data, s => s.x),
      max(data, s => s.x),
      0.5
    );
    return targets.map(x => {
      const numerator = sum(data, s => gaussian(s.x, x, bandwidth) * s.y);
      const denominator = sum(data, s => gaussian(s.x, x, bandwidth));

      return {
        x,
        y: numerator / denominator
      };
    });
  }
};

// https://bl.ocks.org/rpgove/073d6cb996d7de1d52935790139c4240
const gaussian = (target: number, source: number, bandwidth: number) => {
  return Math.exp(-Math.pow(target - source, 2) / (2 * bandwidth * bandwidth));
};
