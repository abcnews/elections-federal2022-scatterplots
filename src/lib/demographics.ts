import Papa from 'papaparse';
import { point, centroid, distance, nearestPoint, featureCollection } from '@turf/turf';
import ELECTORATE_CATEGORIES from '../electorate_categories.json';
import regeneratorRuntime from 'regenerator-runtime';

import { Y_AXIS_METHODS } from '../constants';
import { fetchLiveResultsElectorates } from './results';
import { yAxis } from './model';

const datasets: Record<string, any> = {};

export const fetchDemographicData = async (dataset: string) => {
  if (dataset === '2019results') {
    return fetchErads('2019');
  }
  if (dataset === '2022results') {
    return fetchErads('2022');
  }

  if (dataset === 'geo') {
    return fetchGeo();
  }

  if (dataset === 'campaignvisits') {
    return fetchCampaignVisits();
  }

  return fetchAbsData(dataset);
};

export const fetchTaxData = async (dataset: string) => {
  if (datasets[dataset]) {
    return datasets[dataset];
  }

  const raw = await fetch(`${__webpack_public_path__ || '/'}${dataset}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  const normalised = parsed.map(row => {
    const res = { Electorate: row.Electorate, name: row.Electorate, };
    return Object.keys(row)
      .filter(k => k !== 'Electorate' && k !== 'Total')
      .reduce((acc, k) => ({ ...acc, [k]: (100 * parseFloat(row[k])) / 17700 }), res);
  });

  datasets[dataset] = normalised;
  return normalised;
};

const fetchAbsData = async (dataset: string) => {
  if (datasets[dataset]) {
    return datasets[dataset];
  }

  const raw = await fetch(`${__webpack_public_path__ || '/'}${dataset}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  const normalised = parsed.map(row => {
    const res = { Electorate: row.Electorate };
    return Object.keys(row)
      .filter(k => k !== 'Electorate' && k !== 'Total')
      .reduce((acc, k) => ({ ...acc, [k]: (100 * row[k]) / row.Total }), res);
  });

  datasets[dataset] = normalised;
  return normalised;
};

// Data from:
//
// https://github.com/abcnews/elections-federal2022-campaign-heatmap/blob/master/src/components/App/index.tsx
const fetchCampaignVisits = async () => {
  if (datasets.visits) {
    return datasets.visits;
  }

  const parties = [
    { id: 'LNP', name: 'Coalition', colour: 'ptyblue', leaders: ['Scott Morrison', 'Barnaby Joyce'] },
    { id: 'ALP', name: 'Labor', colour: 'ptyred', leaders: ['Anthony Albanese', 'Richard Marles'] }
  ];
  const ZERO_VISITS = {
    'Visits by Labor': 0,
    'Visits by Coalition': 0,
    'Visits by Anthony Albanese': 0,
    'Visits by Scott Morrison': 0,
    'Visits by Barnaby Joyce': 0,
    'Visits by Richard Marles': 0
  };

  const raw = await fetch(`${__webpack_public_path__ || '/'}campaignvisits.txt`).then(r => r.text());
  const rows = raw
    .trim()
    .split('\n')
    .map(line => line.split('\t'));

  const visits = rows.reduce((acc, row) => {
    if (row.length !== 3) {
      return acc;
    }

    const [date, leader, electorate] = row;
    const party = parties.find(party => party.leaders.includes(leader))?.name;

    acc[electorate] = acc[electorate] || { ...ZERO_VISITS };
    acc[electorate][`Visits by ${party}`] += 1;
    acc[electorate][`Visits by ${leader}`] += 1;
    return acc;
  }, {});

  datasets.visits = ELECTORATE_CATEGORIES.map(({ Electorate }) => ({
    Electorate,
    ...ZERO_VISITS,
    ...visits[Electorate]
  }));
  return datasets.visits;
};

const fetchErads = async (year: string) => {
  if (datasets[year]) {
    return datasets[year];
  }

  const rawResults = await fetchLiveResultsElectorates(year);

  // Convert results to a normalised form so it can be used as an x-axis dataset
  datasets[year] = rawResults.map(e => {
    const lnpSwingLabel = Y_AXIS_METHODS.find(m => m.id === 'swingtolnp')?.label || '';
    const laborSwingLabel = Y_AXIS_METHODS.find(m => m.id === 'swingtolabor')?.label || '';
    const lnpVoteLabel = Y_AXIS_METHODS.find(m => m.id === '2cpvotelnp')?.label || '';
    const laborVoteLabel = Y_AXIS_METHODS.find(m => m.id === '2cpvotelabor')?.label || '';
    const lnpPVoteLabel = Y_AXIS_METHODS.find(m => m.id === 'lnpprimary')?.label || '';
    const laborPVoteLabel = Y_AXIS_METHODS.find(m => m.id === 'laborprimary')?.label || '';

    return {
      Electorate: e.name,
      [lnpSwingLabel]: yAxis(e, 'swingtolnp'),
      [laborSwingLabel]: yAxis(e, 'swingtolabor'),
      [lnpVoteLabel]: yAxis(e, '2cpvotelnp'),
      [laborVoteLabel]: yAxis(e, '2cpvotelabor'),
      [lnpPVoteLabel]: yAxis(e, 'lnpprimary'),
      [laborPVoteLabel]: yAxis(e, 'laborprimary')
    };
  });

  return datasets[year];
};

const CAPITAL_CITIES = [
  point([-33.865, 151.2094].reverse()),
  point([-37.8136, 144.9631].reverse()),
  point([-27.4678, 153.0281].reverse()),
  point([-31.9522, 115.8589].reverse()),
  point([-34.9289, 138.6011].reverse()),
  point([-35.2931, 149.1269].reverse()),
  point([-42.8806, 147.325].reverse()),
  point([-12.4381, 130.8411].reverse())
];

const fetchGeo = async () => {
  if (datasets.geo) {
    return datasets.geo;
  }

  const rawRes = await fetch(`${__webpack_public_path__ || '/'}electorate_geo.json`);
  const rawData = await rawRes.json();
  datasets.geo = rawData.features.map(e => {
    const electorateCenter = centroid(e.geometry);
    const nearestCity = nearestPoint(electorateCenter, featureCollection(CAPITAL_CITIES));
    const distanceToCity = Math.max(1, distance(electorateCenter, nearestCity));

    return {
      Electorate: e.properties.Elect_div,
      Area: e.properties.Area_SqKm,
      'Distance from Nearest Capital': distanceToCity
    };
  });
  return datasets.geo;
};
