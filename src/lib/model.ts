import { sum, range, min, max } from 'd3';
import { regressionLog, regressionLinear } from 'd3-regression';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS, MAJOR_PARTY_CODES } from '../constants';
import PARTIES from '../party.json';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';

// TODO: This is fake data!
// https://www.abc.net.au/news/2023-06-25/voice-no-campaign-strategy-facebook-ad-spend/102510194
const META_AD_SPEND = {
  NSW: 24,
  QLD: 43,
  VIC: 25,
  NT: 11,
  ACT: 11,
  TAS: 41,
  WA: 35,
  SA: 54
};

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
    return [];
  }

  // Special case to wrap data up into states
  const states = {};

  results.forEach(result => {
    const state = result.state.toUpperCase();
    const combinedStateData = states[state] || {
      yesVotes: 0,
      noVotes: 0,
      electorates: [],
    };

    combinedStateData.yesVotes += result.swingDial.find(s => s.name === 'Yes').predicted2CP.votes;
    combinedStateData.noVotes += result.swingDial.find(s => s.name === 'No').predicted2CP.votes;
    combinedStateData.electorates.push(result.name);

    states[state] = combinedStateData;
  });

  let i = 0;
  const stateResults = Object.keys(states).map(state => {
    let colour = COLOURS.PRIMARY;
    let labelColour = COLOURS.TEXT;

    const { yesVotes, noVotes } = states[state];

    if (colourBy === 'result' || colourBy === 'state-result') {
      colour = (yesVotes / (noVotes + yesVotes)) < 0.5 ? COLOURS.NO : COLOURS.YES;
      labelColour = (yesVotes / (noVotes + yesVotes)) < 0.5 ? COLOURS.NO_TEXT : COLOURS.YES;
    }

    let x = 0;
    if (isZeroX) {
      x = 0;
    }
    if (xAxisFields[0] === 'meta-ad-spend') {
      x = META_AD_SPEND[state];
    }
    if (xAxisFields[0] === 'ranked') {
      x = i++;
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

  if (combineStates) {
    return stateResults;
  }

  const rejectedStates = stateResults.filter(s => s.y > 50).map(s => s.electorate);

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

    let colour = COLOURS.PRIMARY;
    let labelColour = COLOURS.TEXT;

    // Party colours
    if (colourBy === 'party') {
      colour = COLOURS.PARTIES[winningParty as string];
      labelColour = COLOURS.PARTY_LABELS[winningParty as string];
    }

    // Highlight colours
    if (colourBy === 'highlight') {
      const isHighlighted = electorateHighlights.indexOf(result.name) > -1;

      colour = isHighlighted ? COLOURS.FOCUS : COLOURS.PRIMARY;
      labelColour = COLOURS.TEXT;
    }

    if (colourBy === 'state-result') {
      const state = result.state.toUpperCase();

      colour = rejectedStates.indexOf(state) > -1 ? COLOURS.NO : COLOURS.YES;
      labelColour = rejectedStates.indexOf(state) > -1 ? COLOURS.NO_TEXT : COLOURS.YES;
    }

    if (colourBy === 'result') {
      const state = result.state.toUpperCase();

      // TODO
      colour = rejectedStates.indexOf(state) > -1 ? COLOURS.NO : COLOURS.YES;
      labelColour = rejectedStates.indexOf(state) > -1 ? COLOURS.NO_TEXT : COLOURS.YES;
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
    .filter(e => !!e && e.y !== null && e.x !== null);
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
  if (method === 'yesvote') {
    return result.swingDial.find(s => s.name === 'Yes').predicted2CP.pct;
  }
  if (method === 'novote') {
    return result.swingDial.find(s => s.name === 'No').predicted2CP.pct;
  }

  return null;
}

//
// Calculate the chosen demographic as a % of the total population of the electorate
//
const xAxis = (demo: any, xAxisFields: string[]): number | null => {
  const values = xAxisFields.map(field => demo[field]);
  if (values.findIndex(v => v == null) > -1) {
    return null;
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
