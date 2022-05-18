import Papa from 'papaparse';
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
