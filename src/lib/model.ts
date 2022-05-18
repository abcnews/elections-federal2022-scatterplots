import { sum, range, min, max } from 'd3';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS } from '../constants';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';

export const determineXAxisLabel = (opts: Graph) => {
  if (opts.xAxisLabelOverride) {
    return opts.xAxisLabelOverride;
  }

  if (opts.xAxisFields.length === 1 && !opts.xAxisInverse) {
    return `${opts.xAxisFields[0]} (% of electorate)`;
  }

  return 'X Axis Label Override Needed!';
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
  categoryFilters: string[],
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
        console.log('Filtered:', result.name);
        return null;
      }

      // Special case to handle "LNP" in data
      if (heldByFilters.indexOf("Liberal") > -1 && categories["Held By"] === "LNP") {
        console.log('Filtered:', result.name);
        return null;
      }
    }
    if (closenessFilters.length > 0) {
      if (closenessFilters.indexOf(categories["Closeness"]) === -1) {
        console.log('Filtered:', result.name);
        return null;
      }
    }
    if (categoryFilters.length > 0) {
      if (categoryFilters.indexOf(categories["Category"]) === -1) {
        console.log('Filtered:', result.name);
        return null;
      }
    }

    // const isSafe = result.predicted?.predictionString?.startsWith('SAFE');
    // Ignore electorates that haven't been called
    // if (!isSafe) {
    //   return null;
    // }

    const winningParty = result.leadingCandidate?.party.code;

    return {
      x: xAxis(demo, xAxisFields, xAxisInverse),
      y: yAxis(result, yAxisMethod),
      electorate: result.name,
      colour: partyColours ? COLOURS().PARTIES[winningParty] || COLOURS().PARTIES.OTH : COLOURS().PRIMARY,
    };
  });

  return electorates.filter(e => !!e && e.y !== null);
};

//
// Calculate the vote measure for the Y Axis
//
const yAxis = (result: any, method: string): number | null => {
  const coalitionRes = result.swingDial.find(p => p.contestantType === 'GOVERNMENT');

  if (method === 'swing-from-lnp') {
    // TODO: What do we do when there's no Gov candidate involved?
    if (!coalitionRes) {
      return null;
    }

    // positive means away from LNP
    const swing = -1 * parseFloat(coalitionRes.predicted2CP.swing);
    return swing;
  }

  if (method === 'swing-to-lnp') {
    // TODO: What do we do when there's no Gov candidate involved?
    if (!coalitionRes) {
      return null;
    }

    // positive means to LNP
    const swing = parseFloat(coalitionRes.predicted2CP.swing);
    return swing;
  }

  if (method === '2cp-vote-lnp') {
    if (!coalitionRes) {
      return null;
    }

    const pct = parseFloat(coalitionRes.predicted2CP.pct);
    return pct;
  }

  return null;
};

//
// Calculate the demographic as a % of the total population of the electorate
//
const xAxis = (demo: any, xAxisFields: string[], inverse: boolean): number => {
  const selectedValues = xAxisFields.reduce(
    (acc, field) => acc + parseInt(demo[field]),
    0
  );

  let val = (100 * selectedValues) / demo.Total;
  if (inverse) {
    val = 100 - val;
  }
  return val;
};

//
// Trendline calculation
//
// Compute estimated value at each target x coordinate using the
// source particles (the samples).
export const calcSmoothedLine = (data, bandwidth: number) => {
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
};

// https://bl.ocks.org/rpgove/073d6cb996d7de1d52935790139c4240
const gaussian = (target: number, source: number, bandwidth: number) => {
  return Math.exp(-Math.pow(target - source, 2) / (2 * bandwidth * bandwidth));
};
