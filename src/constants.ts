import ELECTORATES from './electorate_categories.json';

export const MOBILE_BREAKPOINT = 480;

export const MAJOR_PARTY_CODES = ['LIB', 'LNP', 'NAT', 'ALP', 'CLP', 'GRN'];
export const DATASETS = [
  {
    id: 'zero',
    label: 'Zero',
    sourceLabel: '',
    canCombine: false,
    unit: '',
  },
  {
    id: '2025results',
    label: 'AEC: 2025 Federal Election Results',
    sourceLabel: '',
    canCombine: false,
    unit: '%',
  },
  {
    id: '2022results',
    label: 'AEC: 2022 Federal Election Results',
    sourceLabel: '',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'geo',
    label: 'AEC: Geographic Features',
    sourceLabel: '',
    canCombine: false,
    unit: 'km',
  },
  // {
  //   id: 'campaignvisits',
  //   label: 'ABC: Campaign Visits',
  //   sourceLabel: '', // TODO: Anything special to put here?
  //   canCombine: false,
  //   unit: '',
  // },
  {
    id: 'votecompass2',
    label: 'ABC: Most Important Issue (Vote Compass)',
    sourceLabel: 'ABC Vote Compass',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'votecompass',
    label: 'ABC: Progressiveness (Vote Compass)',
    sourceLabel: 'ABC Vote Compass',
    canCombine: false,
    unit: '',
  },
  {
    id: 'ancestry',
    label: 'ABS: Ancestry',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'indigenousstatus',
    label: 'ABS: Indigenous Status',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'religion',
    label: 'ABS: Religious Affiliation',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'education',
    label: 'ABS: Level of Highest Educational Achievement',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'age',
    label: 'ABS: Age in Ten Year Groups',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'income',
    label: 'ABS: Total Personal Income',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'arrival',
    label: 'ABS: Year of Arrival in Australia',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'children',
    label: 'ABS: Number of children',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'rentalaffordability',
    label: 'ABS: Rental affordability',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'mortgageaffordability',
    label: 'ABS: Mortgage affordability',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'tenuretype',
    label: 'ABS: Housing tenure type',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'yougovfeb',
    label: 'YouGov: Feburary 2025 MRP Poll',
    sourceLabel: 'YouGov Feburary 2025 MRP Poll',
    unit: '%',
  },
];

export const Y_AXIS_METHODS = [
   {
    id: 'zero',
    isSwing: false,
    label: '',
  },

  //
  // COALITION
  //
  {
    id: null,
    label: '--COALITION--',
  },
  {
    id: '2cpvotelnp',
    isSwing: false,
    label: 'Coalition 2CP vote',
  },
  {
    id: 'swingtolnp',
    isSwing: true,
    label: 'Change in Coalition 2CP vote',
  },
  {
    id: 'lnpprimary',
    isSwing: false,
    label: 'Coalition primary vote',
  },
  {
    id: 'lnpprimaryswing',
    isSwing: true,
    label: 'Change in Coalition primary vote',
  },

  //
  // LABOR
  //
  {
    id: null,
    label: '--LABOR--',
  },
  {
    id: '2cpvotelabor',
    isSwing: false,
    label: 'Labor 2CP vote',
  },
  {
    id: 'swingtolabor',
    isSwing: true,
    label: 'Change in Labor 2CP vote',
  },
  {
    id: 'laborprimary',
    isSwing: false,
    label: 'Labor primary vote',
  },
  {
    id: 'laborprimaryswing',
    isSwing: true,
    label: 'Change in Labor primary vote',
  },

  //
  // MINORS
  //
  {
    id: null,
    label: '--MINORS--',
  },
  {
    id: 'minorprimary',
    isSwing: false,
    label: 'Primary vote for combined minor parties (incl. Greens)',
  },
  {
    id: '2cpminor',
    isSwing: false,
    label: '2CP vote for combined minor parties (incl. Greens)',
  },
  {
    id: 'minorprimaryswing',
    isSwing: true,
    label: 'Change in combined primary vote for minor parties (incl. Greens)',
  },
  {
    id: 'bestminorprimary',
    isSwing: false,
    label: 'Primary vote for highest placing minor party (incl. Greens)',
  },
  {
    id: 'bestminorprimaryswing',
    isSwing: true,
    label: 'Change in primary vote for highest placing minor party (incl. Greens)',
  },
];

export const COLOUR_METHODS = [
  {
    id: '',
    label: 'Basic',
  },
  {
    id: 'party',
    label: 'Party',
  },
  {
    id: 'highlight',
    label: 'Highlight',
  },
  // {
  //   id: 'state-result',
  //   label: 'State Result',
  // },
  // {
  //   id: 'result',
  //   label: 'Electorate Result',
  // },
];

//
// Filter Options
//
export const ELECTORATE_GEO = [
  'Inner Metro',
  'Outer Metro',
  'Regional Seats',
  'Rural',
];
export const ELECTORATE_CLOSENESS = [
  'Marginal',
  'Safe',
  'Very Safe',
];
export const ELECTORATE_HELD_BY = [
  'LIB',
  'ALP',
  'GRN',
  'OTH'
];

//
// From ABC Datawrapper colour palette
//
const PARTY_COLOURS = {
  LIB: '#0A52BF',
  // CLP: '#0A52BF',
  NAT: '#007056',
  ALP: '#E11F30',
  GRN: '#51A802',
  OTH: '#757575',
};

// Some parties need supplementary colours when used as labels
const PARTY_LABEL_COLOURS = {
  ...PARTY_COLOURS,
  GRN: '#508423',
};

const DEFAULT_PRIMARY_COLOUR = '#664cb3'; // purple
const DEFAULT_FOCUS_COLOUR = '#E52A00'; // orange
const TEXT_COLOUR = 'black';
const BG_COLOUR = 'white';

const AXIS_COLOUR = '#69788C';
const GRID_COLOUR = '#D6DDE4';

export const COLOURS = {
  PARTIES: PARTY_COLOURS,
  PARTY_LABELS: PARTY_LABEL_COLOURS,
  PRIMARY: DEFAULT_PRIMARY_COLOUR,
  FOCUS: DEFAULT_FOCUS_COLOUR,
  TEXT: TEXT_COLOUR,
  BG: BG_COLOUR,
  AXIS: AXIS_COLOUR,
  GRID: GRID_COLOUR,
};

//
// Electorate highlight opts
//
export const HIGHLIGHT_OPTS = [...ELECTORATES.map(e => e.Electorate)];

