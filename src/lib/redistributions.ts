import Papa from 'papaparse';

const PARTIES = {
  LIB: {
    colour: 'ptyblue',
    code: 'LIB',
    name: 'Liberal Party',
    short: 'Liberal'
  },
  ALP: {
    colour: 'ptyred',
    code: 'ALP',
    name: 'Labor Party',
    short: 'Labor'
  },
  NAT: {
    colour: 'ptygreen',
    code: 'NAT',
    name: 'The Nationals',
    short: 'National'
  },
  GRN: {
    colour: 'ptylightgreen',
    code: 'GRN',
    name: 'Greens',
    short: 'Greens'
  },
  IND: {
    colour: 'ptyblack',
    code: 'IND',
    name: 'Independent',
    short: 'Independent'
  }
};

const fetch2022Redistributed = async () => {
  const url = `${__webpack_public_path__ || '/'}2022-redistributed.csv`;
  const raw = await fetch(url).then(r => r.text());
  const parsed = Papa.parse(raw, { header: true }).data;

  const url2 = `${__webpack_public_path__ || '/'}2022-redistributed-primary.csv`;
  const raw2 = await fetch(url2).then(r => r.text());
  const parsedPrimary = Papa.parse(raw2, { header: true }).data;

  const url3 = `${__webpack_public_path__ || '/'}2022-redistributed-tcp.csv`;
  const raw3 = await fetch(url3).then(r => r.text());
  const parsed2CP = Papa.parse(raw3, { header: true }).data;

  const result = parsed.map(
    ({ Electorate, TwoParty, TwoPartyMargin, TwoCandidate, TwoCandidateMargin, TwoCandidateLoser }) => {
      // Normalise the party codes
      const candidates = parsedPrimary
        .filter(({ DivisionName }) => DivisionName === Electorate)
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'LP' ? 'LIB' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'LNP' ? 'LIB' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'NP' ? 'NAT' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'CLP' ? 'LIB' : a.PartyAb }));

      const candidates2CP = parsed2CP
        .filter(({ DivisionName }) => DivisionName === Electorate)
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'LP' ? 'LIB' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'LNP' ? 'LIB' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'NP' ? 'NAT' : a.PartyAb }))
        .map(a => ({ ...a, PartyAb: a.PartyAb === 'CLP' ? 'LIB' : a.PartyAb }));

      const totalVotes = candidates.reduce((acc, next) => acc + parseInt(next.Votes), 0);
      const maxVotes = Math.max(...candidates.map(c => parseInt(c.Votes)));

      const winningCandidate = candidates.find(({ PartyAb, Votes }) => parseInt(Votes) === maxVotes);
      const winningCandidate2CP = candidates2CP.find(({ PartyAb }) => winningCandidate.PartyAb === PartyAb);

      const runnerUpCandidate2CP = candidates2CP.find(({ PartyAb }) => PartyAb !== winningCandidate2CP.PartyAb);
      const runnerUpCandidate = candidates.find(({ PartyAb }) => PartyAb === runnerUpCandidate2CP.PartyAb);

      const winner = {
        party: { ...PARTIES[winningCandidate.PartyAb] },
        predicted2CP: {
          votes: winningCandidate2CP.PreferenceVotes,
          pct: String((winningCandidate2CP.PreferenceVotes / totalVotes) * 100)
        },
        predicted: {
          votes: winningCandidate.Votes,
          pct: String((winningCandidate.Votes / totalVotes) * 100)
        }
      };

      const loser = {
        party: { ...PARTIES[runnerUpCandidate.PartyAb] },
        predicted2CP: {
          votes: runnerUpCandidate2CP.PreferenceVotes,
          pct: String((runnerUpCandidate2CP.PreferenceVotes / totalVotes) * 100)
        },
        predicted: {
          votes: runnerUpCandidate.Votes,
          pct: String((runnerUpCandidate.Votes / totalVotes) * 100)
        }
      };

      const runners = candidates.map(c => {
        const c2CP = candidates2CP.find(c2 => c2.PartyAb === c.PartyAb);
        return {
          party: PARTIES[c.PartyAb] ? { ...PARTIES[c.PartyAb] } : { code: c.PartyAb || 'IND' },
          predicted2CP: c2CP
            ? {
                votes: c2CP.PreferenceVotes,
                pct: String((c2CP.PreferenceVotes / totalVotes) * 100)
              }
            : null,
          predicted: {
            votes: c.Votes,
            pct: String((c.Votes / totalVotes) * 100)
          }
        };
      });

      return {
        name: Electorate,
        swingDial: [winner, loser],
        runners
      };
    }
  );

  console.log(JSON.stringify({ data: { electorates: result } }, null, 2));

  return result;
};
