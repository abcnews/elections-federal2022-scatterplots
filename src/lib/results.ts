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
  if (year === '2019') {
    // Static version of live endpoint saved on 21/06/22 to avoid breakage if news-web change things
    // url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2019';
    url = `${__webpack_public_path__ || '/'}2019results.json`;
  } else if (year === '2022') {
    // Static version of live endpoint saved on 21/06/22 to avoid breakage if news-web change things
    // url = 'https://www.abc.net.au/news-web/api/syndicate/storylab/elections/federal/2022';
    url = `${__webpack_public_path__ || '/'}2022results.json`;
  }

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ data }) => data.electorates as LiveResultsElectorate[])
      .then(electorates => electorates.map(e => ({ ...e, name: e.name.replace(/[^a-z \-']/gi, '').trim() })));
  }

  return liveResultsElectoratesPromises[url];
};
