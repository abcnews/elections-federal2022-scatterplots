import { sum, range, min, max } from 'd3';
import { regressionLog, regressionLinear } from 'd3-regression';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS } from '../constants';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';

export const determineXAxisLabel = (opts: Graph) => {
  if (opts.xAxisLabelOverride) {
    return opts.xAxisLabelOverride;
  }

  if (opts.xAxisFields.length === 1 && !opts.xAxisInverse) {
    return opts.xAxisFields[0];
  }

  return 'X Axis Label Override Needed!';
};

export const determineYAxisLabel = (opts: Graph) => {
  if (opts.yAxisLabelOverride) {
    return opts.yAxisLabelOverride;
  }

  const method = Y_AXIS_METHODS.find(method => method.id === opts.yAxisMethod);
  return method?.label || '';
};

//
// Combine election results data with demographic data
//
export const calcScatterData = (
  results: any,
  demographics: any,
  xAxisFields: string[],
  yAxisMethod: string,
  partyColours: boolean,
  xAxisInverse: boolean,
  heldByFilters: string[],
  closenessFilters: string[],
  geoFilters: string[],
) => {
  if (!results || !demographics || !xAxisFields || xAxisFields.length === 0) {
    return [];
  }

  const electorates = results.map(result => {
    // Get the demographic data for the electorate
    const demo = demographics.find(d => d.Electorate === result.name);
    // Get the categories for the electorate
    const categories = ELECTORATE_CATEGORIES.find(c => c.Electorate === result.name);

    // Ignore electorates with incomplete data
    if (!demo || xAxisFields.length === 0 || !categories) {
      if (xAxisFields.length > 0) {
        console.log('Incomplete data:', result.name);
      }
      return null;
    }

    // Apply filters
    if (heldByFilters.length > 0) {
      if (heldByFilters.indexOf(categories["Held By"]) === -1) {
        console.log('Held By Filtered:', result.name);
        return null;
      }

      // Special case to handle "LNP" in data
      if (heldByFilters.indexOf("Liberal") > -1 && categories["Held By"] === "LNP") {
        console.log('Held By Filtered:', result.name);
        return null;
      }
    }
    if (closenessFilters.length > 0) {
      if (closenessFilters.indexOf(categories["Closeness"]) === -1) {
        console.log('Closeness Filtered:', result.name);
        return null;
      }
    }
    if (geoFilters.length > 0) {
      if (geoFilters.indexOf(categories["Geo"]) === -1) {
        console.log('Geo Filtered:', result.name);
        return null;
      }
    }

    const winningParty = result.leadingCandidate?.party.code === 'LNP' ? 'LIB' : result.leadingCandidate?.party.code;

    return {
      x: xAxis(demo, xAxisFields),
      y: yAxis(result, yAxisMethod),
      electorate: result.name,
      colour: (isDM) => partyColours ? COLOURS(isDM).PARTIES[winningParty] || COLOURS(isDM).PARTIES.OTH : COLOURS(isDM).PRIMARY,
      labelColour: (isDM) => partyColours ? COLOURS(isDM).PARTY_LABELS[winningParty] || COLOURS(isDM).PARTY_LABELS.OTH : COLOURS(isDM).TEXT,
    };
  });

  return electorates.filter(e => !!e && e.y !== null);
};

//
// Calculate the vote measure for the Y Axis
//
export const yAxis = (result: any, method: string): number | null => {
  const coalitionRes = result.swingDial.find(p => p.contestantType === 'GOVERNMENT');
  const laborRes = result.swingDial.find(p => p.contestantType === 'OPPOSITION');
  const minorRes = result.swingDial.find(p => p.contestantType === 'NONE');

  if (method === 'swingfromlabor') {
    if (!laborRes) {
      return null;
    }

    // positive means away from Labor
    const swing = -1 * parseFloat(laborRes.predicted2CP.swing);
    return swing;
  }

  if (method === 'swingtolabor') {
    if (!laborRes) {
      return null;
    }

    // positive means to Labor
    const swing = parseFloat(laborRes.predicted2CP.swing);
    return swing;
  }

  if (method === '2cpvotelabor') {
    if (!laborRes) {
      return null;
    }

    const pct = parseFloat(laborRes.predicted2CP.pct);
    return pct;
  }

  if (method === 'swingfromlnp') {
    if (!coalitionRes) {
      return null;
    }

    // positive means away from LNP
    const swing = -1 * parseFloat(coalitionRes.predicted2CP.swing);
    return swing;
  }

  if (method === 'swingtolnp') {
    if (!coalitionRes) {
      return null;
    }

    // positive means to LNP
    const swing = parseFloat(coalitionRes.predicted2CP.swing);
    return swing;
  }

  if (method === '2cpvotelnp') {
    if (!coalitionRes) {
      return null;
    }

    const pct = parseFloat(coalitionRes.predicted2CP.pct);
    return pct;
  }

  if (method === 'swingtominors') {
    if (!minorRes) {
      return null;
    }

    // positive means to minor party
    const swing = parseFloat(minorRes.predicted2CP.swing);
    return swing;
  }

  return null;
};

//
// Calculate the demographic as a % of the total population of the electorate
//
const xAxis = (demo: any, xAxisFields: string[]): number => {
  const selectedValues = xAxisFields.reduce(
    (acc, field) => acc + parseFloat(demo[field]),
    0
  );

  return selectedValues;
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

    return regressionGenerator(data).map(([x, y]) => ({ x, y}));
  }

  if (method === 'linear') {
    const regressionGenerator = regressionLinear()
      .x(d => d.x)
      .y(d => d.y);

    return regressionGenerator(data).map(([x, y]) => ({ x, y}));
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

const logScale = (x: number, maxVal: number): number => {
  // The result should be between 100 an 10000000
  var minX = Math.log(0.01);
  var maxX = Math.log(maxVal);

  // calculate adjustment factor
  var scale = (maxX-minX) / 100;
  return (Math.log(x)-minX) / scale;
};
