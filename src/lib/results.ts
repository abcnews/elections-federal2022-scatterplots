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

export const fetchLiveResultsElectorates = async (year: string) => {
  let props;
  let url;
  if (year === '2019') {
    url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2019';
  } else if (year === '2022') {
    url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2022';
  } else if (year === '2019local') {
    url = `${__webpack_public_path__ || '/'}res2019.json`;
  } else if (year === '2022local') {
    url = `${__webpack_public_path__ || '/'}res2022.json`;
  }

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ data }) => data.electorates as LiveResultsElectorate[])
      .then(electorates => electorates.map(e => ({ ...e, name: e.name.replace(/[^a-z \-']/gi, '').trim() })));
  }

  return liveResultsElectoratesPromises[url];
};
