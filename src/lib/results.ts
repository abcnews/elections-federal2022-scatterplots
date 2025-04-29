import { primary, swing, twoCP, yAxis } from './model';
import Papa from 'papaparse';

export interface LiveResultsElectorate {
  name: string;
  code: string;
  counted: string;
  leadingCandidate?: {
    party: {
      code: string;
    };
  };
  predicted?: {
    predictionString?: string;
  };
  updated: string;
}

const liveResultsElectoratesPromises: {
  [key: string]: Promise<LiveResultsElectorate[]>;
} = {};

export const fetchLiveResultsElectorates = (year: string) => {
  let props;
  let url;
  if (year === '2022') {
    // Static version of live endpoint saved on 21/06/22 to avoid breakage if news-web change things
    // url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2022';
    // url = `${__webpack_public_path__ || '/'}results/2022.json`;

    // 20/02/24 - generated a ERADS-like payload using AEC redistribution data
    url = `${__webpack_public_path__ || '/'}results/2022-redistributed.json`;
  } else if (year === '2025') {
    // url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2025';
    // TODO: Use 2025 data when we have it!
    url = `${__webpack_public_path__ || '/'}results/2025-preview.json`;
  }

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ data }) => data.electorates as LiveResultsElectorate[])
      .then(electorates => sortByName(
        electorates.map(e => ({
          ...e,
          name: e.name.replace(/[^a-z \-']/gi, '').trim()
        }))
      ));
  }

  return liveResultsElectoratesPromises[url];
};

const sortByName = x => x.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

const datasets = {};

export const fetchErads = async (year: string) => {
  if (datasets[year]) {
    return datasets[year];
  }

  const rawResults = await fetchLiveResultsElectorates(year);

  // Convert results to a normalised form so it can be used as an x-axis dataset
  datasets[year] = rawResults.map(e => {
    return {
      Electorate: e.name,
      'Change in Coalition 2CP Vote': yAxis(e, 'swingtolnp'),
      'Coalition 2CP Vote': yAxis(e, '2cpvotelnp'),

      'Change in Labor 2CP Vote': yAxis(e, 'swingtolabor'),
      'Labor 2CP Vote': yAxis(e, '2cpvotelabor'),

      'Minor parties 2CP Vote': yAxis(e, '2cpminor'),
    };
  });

  return datasets[year];
};
