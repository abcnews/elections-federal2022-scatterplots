import Papa from 'papaparse';
import { point, centroid, distance, nearestPoint, featureCollection } from '@turf/turf';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';

import { Y_AXIS_METHODS } from '../constants';
import { fetchErads } from './results';
import { yAxis } from './model';

const datasets: Record<string, any> = {};

export const fetchDemographicData = async (year: string, dataset: string) => {
  if (dataset === '2022results') {
    return fetchErads('2022');
  }

  if (dataset === 'geo') {
    return fetchGeo(year);
  }

  if (dataset === 'zero') {
    datasets.zero = ELECTORATE_CATEGORIES.map(e => ({
      Electorate: e.Electorate,
      zero: 50,
    }));
    return datasets.zero;
  }

  if (dataset === 'yougov-feb') {
    return fetchPoll('feb', 'yougov');
  }

  // Only have 2022 data so far... Someone may track this...
  // if (dataset === 'campaignvisits') {
  //   return fetchCampaignVisits();
  // }

  return fetchAbsData(year, dataset);
};

const fetchPoll = async (month: string, dataset: string) => {
  if (datasets[`${month}/${dataset}`]) {
    return datasets[`${month}/${dataset}`];
  }

  const raw = await fetch(`${__webpack_public_path__ || '/'}poll/${dataset}-${month}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  const normalised = parsed.map(row => {
    const res = { Electorate: row.Electorate };
    return Object.keys(row)
      .filter(k => k !== 'Electorate' && k !== 'Total')
      .reduce((acc, k) => ({ ...acc, [k]: row[k] }), res);
  });

  datasets[`${month}/${dataset}`] = normalised;
  return normalised;
};

const fetchAbsData = async (year: string, dataset: string) => {
  if (datasets[`${year}/${dataset}`]) {
    return datasets[`${year}/${dataset}`];
  }

  // const raw = await fetch(`${__webpack_public_path__ || '/'}demographics/${year}/${dataset}.csv`).then(r => r.text());
  const raw = await fetch(`${__webpack_public_path__ || '/'}demographics/2025/${dataset}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  const normalised = parsed.map(row => {
    const res = { Electorate: row.Electorate };
    return Object.keys(row)
      .filter(k => k !== 'Electorate' && k !== 'Total')
      .reduce((acc, k) => ({ ...acc, [k]: (100 * row[k]) / row.Total }), res);
  });

  datasets[`${year}/${dataset}`] = normalised;
  return normalised;
};

// Data from:
//
// https://github.com/abcnews/elections-federal2022-campaign-heatmap/blob/master/src/components/App/index.tsx
// const fetchCampaignVisits = async () => {
//   if (datasets.visits) {
//     return datasets.visits;
//   }
//
//   const parties = [
//     { id: 'LNP', name: 'Coalition', colour: 'ptyblue', leaders: ['Scott Morrison', 'Barnaby Joyce'] },
//     { id: 'ALP', name: 'Labor', colour: 'ptyred', leaders: ['Anthony Albanese', 'Richard Marles'] }
//   ];
//   const ZERO_VISITS = {
//     'Visits by Labor': 0,
//     'Visits by Coalition': 0,
//     'Visits by Anthony Albanese': 0,
//     'Visits by Scott Morrison': 0,
//     'Visits by Barnaby Joyce': 0,
//     'Visits by Richard Marles': 0
//   };
//
//   const raw = await fetch(`${__webpack_public_path__ || '/'}campaignvisits.txt`).then(r => r.text());
//   const rows = raw
//     .trim()
//     .split('\n')
//     .map(line => line.split('\t'));
//
//   const visits = rows.reduce((acc, row) => {
//     if (row.length !== 3) {
//       return acc;
//     }
//
//     const [date, leader, electorate] = row;
//     const party = parties.find(party => party.leaders.includes(leader))?.name;
//
//     acc[electorate] = acc[electorate] || { ...ZERO_VISITS };
//     acc[electorate][`Visits by ${party}`] += 1;
//     acc[electorate][`Visits by ${leader}`] += 1;
//     return acc;
//   }, {});
//
//   datasets.visits = ELECTORATE_CATEGORIES.map(({ Electorate }) => ({
//     Electorate,
//     ...ZERO_VISITS,
//     ...visits[Electorate]
//   }));
//   return datasets.visits;
// };

const CANBERRA = point([-35.2931, 149.1269].reverse());
const CAPITAL_CITIES = [
  point([-33.865, 151.2094].reverse()),
  point([-37.8136, 144.9631].reverse()),
  point([-27.4678, 153.0281].reverse()),
  point([-31.9522, 115.8589].reverse()),
  point([-34.9289, 138.6011].reverse()),
  CANBERRA,
  point([-42.8806, 147.325].reverse()),
  point([-12.4381, 130.8411].reverse())
];

const fetchGeo = async (year) => {
  if (datasets[`${year}-geo`]) {
    return datasets[`${year}-geo`];
  }

  const rawRes = await fetch(`${__webpack_public_path__ || '/'}geographics/${year}.json`);
  const rawData = await rawRes.json();
  datasets[`${year}-geo`] = rawData.features.map(e => {
    const electorateCenter = centroid(e.geometry);
    const nearestCity = nearestPoint(electorateCenter, featureCollection(CAPITAL_CITIES));
    const distanceToCity = Math.max(1, distance(electorateCenter, nearestCity));
    const distanceToCanberra = Math.max(1, distance(electorateCenter, CANBERRA));

    return {
      Electorate: e.properties.Elect_div,
      Area: e.properties.Area_SqKm,
      'Distance from Nearest Capital': distanceToCity,
      'Distance from Canberra': distanceToCanberra
    };
  });
  return datasets[`${year}-geo`];
};
