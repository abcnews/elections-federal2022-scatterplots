import { sum, range, min, max, scaleLinear, extent } from 'd3';
import { regressionLog, regressionLinear } from 'd3-regression';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, COLOURS, MAJOR_PARTY_CODES } from '../constants';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';
import PARTIES from '../party.json';

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
  resultsYear: string,
  demographics: any,
  xAxisFields,
  yAxisMethod,
  colourBy,
  onlyCalledElectorates,
  electorateHighlights,
  filters: any,
) => {

  const {
    heldByFilters,
    closenessFilters,
    geoFilters,
    stateFilters,
  } = filters;

  const isZeroX = xAxisFields.length === 1 && xAxisFields[0] === 'zero';

  if (!results || !demographics || !xAxisFields || xAxisFields.length === 0) {
    return [];
  }

  let i = 0;

  const electorates = results.map(result => {

    // Get the demographic data for the electorate
    const demo = demographics.find(d => d.Electorate === result.name);
    // Get the categories for the electorate
    const categories = ELECTORATE_CATEGORIES.find(c => c.Electorate === result.name);

    // Ignore electorates with incomplete data
    if (!demo || xAxisFields.length === 0 || !categories) {
      return null;
    }

    let winningParty = PARTIES.find(p => p.Electorate === result.name)?.Party || '';
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

    // Apply filters
    let filtered = false;
    if (heldByFilters?.length > 0) {
      if (heldByFilters.indexOf(winningParty) === -1) {
        filtered = true;
      }
    }
    if (closenessFilters?.length > 0) {
      if (closenessFilters.indexOf(categories['Closeness']) === -1) {
        filtered = true;
      }
    }
    if (geoFilters?.length > 0) {
      if (geoFilters.indexOf(categories['Geo']) === -1) {
        filtered = true;
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

    return {
      x: (xAxisFields.indexOf('zero') > -1 || xAxisFields[0] === '') ? 0 : xAxis(demo, xAxisFields),
      y: yAxis(result, yAxisMethod),
      electorate: result.name,
      filtered,
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

  const coalitionRes = result.swingDial.find(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP' || p.party.code === 'CLP'
  );
  const coalitionRunners = (result.runners || []).filter(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP' || p.party.code === 'CLP'
  );

  const laborRes = result.swingDial.find(p => p.party.code === 'ALP');
  const laborRunners = (result.runners || []).filter(
    p => p.party.code === 'ALP'
  );

  // Greens included as "non-major" for this measure
  const minorRes = result.swingDial.find(
    p => MAJOR_PARTY_CODES.indexOf(p.party.code) === -1 || p.party.code === 'GRN'
  );
  const minorRunners = (result.runners || []).filter(
    p => MAJOR_PARTY_CODES.indexOf(p.party.code) === -1 || p.party.code === 'GRN'
  );

  if (method === 'zero') {
    return 0;
  }

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
  if (method === '2cpminor') {
    return twoCP(minorRes);
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
export const calcSmoothedLine = (data) => {
  const regressionGenerator = regressionLinear()
    .x(d => d.x)
    .y(d => d.y);

  return regressionGenerator(data).map(([x, y]) => ({ x, y }));
};
