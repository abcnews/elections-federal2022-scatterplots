import { sum, range, min, max } from 'd3';
import { regressionLog, regressionLinear } from 'd3-regression';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS, MAJOR_PARTY_CODES } from '../constants';
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
  onlyCalledElectorates: boolean,
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
      return null;
    }

    // Apply filters
    if (heldByFilters.length > 0) {
      if (heldByFilters.indexOf(categories['Held By']) === -1) {
        // console.log('Held By Filtered:', result.name);
        return null;
      }

      // Special case to handle "LNP" in data
      if (heldByFilters.indexOf('Liberal') > -1 && categories['Held By'] === 'LNP') {
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

    const hasBeenCalled = result.predicted?.gainretain === 'gain' || result.predicted?.gainretain === 'retain';
    if (!hasBeenCalled && onlyCalledElectorates) {
      // console.log('Called Filtered:', result.name);
      return null;
    }

    let winningParty = result.leadingCandidate?.party.code;
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

    return {
      x: xAxis(demo, xAxisFields),
      y: yAxis(result, yAxisMethod),
      hasBeenCalled,
      electorate: result.name,
      colour: isDM =>
        partyColours ? COLOURS(isDM).PARTIES[winningParty] : COLOURS(isDM).PRIMARY,
      labelColour: isDM =>
        partyColours ? COLOURS(isDM).PARTY_LABELS[winningParty] : COLOURS(isDM).PRIMARY
    };
  });

  return electorates.filter(e => !!e && e.y !== null);
};

const swing = (res) => {
  if (!res) {
    return null;
  }

  return parseFloat(res.predicted2CP.swing);
};

const twoCP = (res) => {
  if (!res) {
    return null;
  }

  return parseFloat(res.predicted2CP.swing);
};

const primarySwing = (runners) => {
  if (runners.length === 0) {
    return null;
  }

  return sum(runners.map(r => parseFloat(r.predicted.swing)));
};
const primary = (runners) => {
  if (runners.length === 0) {
    return null;
  }

  return sum(runners.map(r => parseFloat(r.predicted.pct)));
};

//
// Calculate the vote measure for the Y Axis
//
export const yAxis = (result: any, method: string): number | null => {
  const coalitionRes = result.swingDial.find(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP'
  );
  const coalitionRunners = (result.runners || []).filter(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP'
  );

  const laborRes = result.swingDial.find(p => p.party.code === 'ALP');
  const laborRunners = (result.runners || []).filter(
    p => p.party.code === 'ALP'
  );

  // Greens included as "non-major" for this measure
  const minorRunners = (result.runners || []).filter(
    p => MAJOR_PARTY_CODES.indexOf(p.party.code) === -1 || p.party.code === 'GRN'
  );

  //
  // LABOR
  //
  if (method === 'laborprimary') {
    return primary(laborRunners);
  }
  if (method === 'laborprimaryswing') {
    return primarySwing(laborRunners);
  }
  if (method === 'swingtolabor') {
    return swing(laborRes);
  }
  if (method === '2cpvotelabor') {
    return twoCP(laborRes);
  }

  //
  // COALITION
  //
  if (method === 'lnpprimary') {
    return primary(coalitionRunners);
  }
  if (method === 'lnpprimaryswing') {
    return primarySwing(coalitionRunners);
  }
  if (method === 'swingtolnp') {
    return swing(coalitionRes);
  }
  if (method === '2cpvotelnp') {
    return twoCP(coalitionRes);
  }

  //
  // MINORS
  //
  if (method === 'minorprimary') {
    return primary(minorRunners);
  }
  if (method === 'minorprimaryswing') {
    return primarySwing(minorRunners);
  }
  if (method === 'bestminorprimary') {
    if (minorRunners.length === 0) {
      return null;
    }
    return max(minorRunners.map(r => parseFloat(r.predicted.pct)));
  }
  if (method === 'bestminorprimaryswing') {
    if (minorRunners.length === 0) {
      return null;
    }
    const highestPrimary = max(minorRunners.map(r => parseFloat(r.predicted.pct)));
    const bestInd = minorRunners.find(r => parseFloat(r.predicted.pct) === highestPrimary);
    return parseFloat(bestInd?.predicted.swing);
  }

  return null;
};

//
// Calculate the chosen demographic as a % of the total population of the electorate
//
const xAxis = (demo: any, xAxisFields: string[]): number => {
  return sum(xAxisFields.map(field => parseFloat(demo[field])));
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
