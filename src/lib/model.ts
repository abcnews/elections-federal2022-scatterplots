import { sum, range, min, max } from 'd3';

import type { Graph } from '../store';
import { Y_AXIS_METHODS, PARTY_COLOURS, DEFAULT_PRIMARY_COLOUR } from '../constants';

//
// Combine election results data with demographic data
//
export const calcScatterData = (
  results: any,
  demographics: any,
  targetField: string,
  yAxisMethod: string,
  partyColours: boolean
) => {
  if (!results || !demographics) {
    return [];
  }

  const electorates = results.map(result => {
    // Get the demographic data for the electorate
    const demo = demographics.find(d => d.Electorate === result.name);
    // Ignore electorates with incomplete data
    if (!demo || !targetField) {
      return null;
    }

    // const isSafe = result.predicted?.predictionString?.startsWith('SAFE');
    // Ignore electorates that haven't been called
    // if (!isSafe) {
    //   return null;
    // }

    const winningParty = result.leadingCandidate?.party.code;

    return {
      x: xAxis(demo, targetField),
      y: yAxis(result, yAxisMethod),
      electorate: result.name,
      colour: partyColours ? PARTY_COLOURS[winningParty] || PARTY_COLOURS.OTH : DEFAULT_PRIMARY_COLOUR
    };
  });

  return electorates.filter(e => !!e && e.y !== null);
};

//
// Calculate the vote measure for the Y Axis
//
const yAxis = (result: any, method: string): number | null => {
  if (method === 'margin') {
    return parseFloat(result.margin);
  } else if (method === 'swing') {
    const coalitionRes = result.swingDial.find(p => p.contestantType === 'GOVERNMENT');

    // TODO: What do we do when there's no Gov candidate involved?
    if (!coalitionRes) {
      return null;
    }

    // positive means away from gov
    const swing = -1 * parseFloat(coalitionRes.predicted2CP.swing);
    return swing;
  }

  return null;
};

//
// Calculate the demographic as a % of the total population of the electorate
//
// TODO: Handle multiple target fields?
const xAxis = (demo: any, targetField: string): number => {
  return (100 * demo[targetField]) / demo.Total;
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
