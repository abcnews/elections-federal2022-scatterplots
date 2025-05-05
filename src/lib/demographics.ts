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
  if (dataset === '2025results') {
    return fetchErads('2025');
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

  if (dataset === 'yougovfeb') {
    return fetchPoll('feb', 'yougov');
  }

  return fetchAbsData(year, dataset);
};

const fetchPoll = async (month: string, dataset: string) => {
  if (datasets[`${month}/${dataset}`]) {
    return datasets[`${month}/${dataset}`];
  }

  const raw = await fetch(`${__webpack_public_path__ || '/'}poll/${dataset}${month}.csv`).then(r => r.text());
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
      .reduce((acc, k) => ({ ...acc, [k]: (100 * row[k]) / (row.Total || 100) }), res);
  });

  datasets[`${year}/${dataset}`] = normalised;
  return normalised;
};


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
    let distanceToCity = Math.max(1, distance(electorateCenter, nearestCity));
    if (e.properties.Elect_div === 'Sydney') {
      distanceToCity = 1;
    }
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
