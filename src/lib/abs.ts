import Papa from 'papaparse';

const datasets = {};

export const fetchAbsData = async (dataset: string) => {
  if (datasets[dataset]) {
    return datasets[dataset];
  }

  const raw = await fetch(`${dataset}.csv`).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;
  datasets[dataset] = parsed;
  return parsed;
};

