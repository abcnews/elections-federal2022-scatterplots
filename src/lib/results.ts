import { primary, swing, twoCP } from './model';

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

export const calcMeasure = (result: any, method: string): number | null => {
  //
  //  Used for intepreting old ERADS election results for x-axis
  //
  const coalitionRes = result.swingDial.find(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP'
  );
  const coalitionRunners = (result.runners || []).filter(
    p => p.party.code === 'LIB' || p.party.code === 'NAT' || p.party.code === 'LNP'
  );

  const laborRes = result.swingDial.find(p => p.party.code === 'ALP');
  const laborRunners = (result.runners || []).filter(
    p => p.party.code === 'ALP'
  );

  if (method === 'laborprimary') {
    return primary(laborRunners);
  }
  if (method === 'swingtolabor') {
    return swing(laborRes);
  }
  if (method === '2cpvotelabor') {
    return twoCP(laborRes);
  }
  if (method === 'lnpprimary') {
    return primary(coalitionRunners);
  }
  if (method === 'swingtolnp') {
    return swing(coalitionRes);
  }
  if (method === '2cpvotelnp') {
    return twoCP(coalitionRes);
  }

  return null;
};

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
      'Change in Coalition 2CP Vote': calcMeasure(e, 'swingtolnp'),
      'Change in Labor 2CP Vote': calcMeasure(e, 'swingtolabor'),
      'Coalition 2CP Vote': calcMeasure(e, '2cpvotelnp'),
      'Labor 2CP Vote': calcMeasure(e, '2cpvotelabor')
    };
  });

  return datasets[year];
};

