// import type { ElectorateID } from './constants';
// import { Allocation } from './constants';

const LIVE_RESULTS_URL_PREFIX =
  'https://www.abc.net.au/news-web/api/loader/channelrefetch?name=ElectionElectorateList&props=';

const FEDERAL_2019_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2019',
    state: 'federal',
    remoteContentPath: 'https:%2F%2Fwww.abc.net.au%2Fdat%2Fnews%2Felections%2Ffederal%2F2019'
  }
};

const SA_2022_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2022',
    state: 'sa',
    useV3: true
  }
};

const FEDERAL_2022_LIVE_RESULTS_PROPS = {
  meta: {
    year: '2022',
    state: 'federal',
    useV3: true
  }
};

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
    url = `${LIVE_RESULTS_URL_PREFIX}${JSON.stringify(FEDERAL_2019_LIVE_RESULTS_PROPS)}`;
  } else if (year === '2022') {
    url = `${LIVE_RESULTS_URL_PREFIX}${JSON.stringify(FEDERAL_2019_LIVE_RESULTS_PROPS)}`;
  } else if (year === '2019-local') {
    url = `${__webpack_public_path__ || '/'}results2019.json`;
  }

  if (!liveResultsElectoratesPromises[url]) {
    liveResultsElectoratesPromises[url] = fetch(url)
      .then(response => response.json())
      .then(({ results }) => results.electorates as LiveResultsElectorate[])
      .then(electorates => electorates.map(e => ({ ...e, name: e.name.replace(/[^a-z \-']/gi, '').trim() })));
  }

  return liveResultsElectoratesPromises[url];
};
