import Papa from 'papaparse';
import { point, centroid, distance, nearestPoint, featureCollection } from '@turf/turf'

import { fetchLiveResultsElectorates } from './results';
import { yAxis } from './model';

const datasets: Record<string, any> = {};

export const fetchAbsData = async (dataset: string) => {
  if (datasets[dataset]) {
    return datasets[dataset];
  }

  if (dataset === '2019_results') {
    return fetchErads();
  }

  if (dataset === 'geo') {
    return fetchGeo();
  }

  const raw = await fetch(`${__webpack_public_path__ || '/'}${dataset}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  datasets[dataset] = parsed;
  return parsed;
};


export const fetchErads = async () => {
  if (datasets.erads) {
    return datasets.erads;
  }

  const rawResults = await fetchLiveResultsElectorates('2019-local');
  // Convert 2019 results to a normalised form so it can be used as an x-axis dataset
  return rawResults.map(e => {
    return {
      Electorate: e.name,
      'Swing Away From Coalition': yAxis(e, 'swing-from-lnp'),
      'Swing To Coalition': yAxis(e, 'swing-to-lnp'),
      'Coalition 2CP Vote': yAxis(e, '2cp-vote-lnp'),
      Total: 100,
    };
  });
};

const CAPITAL_CITIES = [
  point([-33.865, 151.2094].reverse()),
  point([-37.8136, 144.9631].reverse()),
  point([-27.4678, 153.0281].reverse()),
  point([-31.9522, 115.8589].reverse()),
  point([-34.9289, 138.6011].reverse()),
  point([-35.2931, 149.1269].reverse()),
  point([-42.8806, 147.325].reverse()),
  point([-12.4381, 130.8411].reverse()),
];
const MAX_SIZE = 1383954; // Durack
const MAX_DISTANCE = 1440; // Leichhardt

const logScale = (x: number, maxVal: number): number => {
  // The result should be between 100 an 10000000
  var minX = Math.log(0.01);
  var maxX = Math.log(maxVal);

  // calculate adjustment factor
  var scale = (maxX-minX) / 100;
  return (Math.log(x)-minX) / scale;
}


export const fetchGeo = async () => {
  if (datasets.geo) {
    return datasets.geo;
  }

  const rawRes = await fetch(`${__webpack_public_path__ || '/'}electorate_geo.json`);
  const rawData = await rawRes.json();
  return rawData.features.map(e => {
    const electorateCenter = centroid(e.geometry);
    const nearestCity = nearestPoint(electorateCenter, featureCollection(CAPITAL_CITIES));
    const distanceToCity = distance(electorateCenter, nearestCity);
    // TODO: how to present as not a percentage 

    return {
      Electorate: e.properties.Elect_div,
      "Area (Sq/km)": e.properties.Area_SqKm / MAX_SIZE * 100,
      "Distance from Nearest Capital (km)": distanceToCity / MAX_DISTANCE * 100,
      "Area (Sq/km) (log scale)": logScale(e.properties.Area_SqKm, MAX_SIZE) ,
      "Distance from Nearest Capital (km) (log scale)": logScale(distanceToCity, MAX_DISTANCE),
      Total: 100,
    };
  });
};
