import ELECTORATES from './electorate_categories.json';

export const MOBILE_BREAKPOINT = 480;

export const STATE_X_AXIS_OPTS = ['zero', 'ranked', 'meta-ad-spend'];
export const MAJOR_PARTY_CODES = ['LIB', 'LNP', 'NAT', 'ALP', 'GRN'];
export const DATASETS = [
  {
    id: '2019results',
    label: 'AEC: 2019 Federal Election Results',
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
    id: 'zero',
    label: 'Zero',
    sourceLabel: '',
    canCombine: false,
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
  // {
  //   id: 'covid',
  //   label: 'COVID: Cases',
  //   sourceLabel: 'https://covidlive.com.au',
  //   canCombine: false,
  //   unit: '',
  // },
  // {
  //   id: 'vaccinations',
  //   label: 'COVID: Vaccinations',
  //   sourceLabel: 'Federal Department of Health',
  //   canCombine: false,
  //   unit: '%',
  // },
  {
    id: 'ancestry',
    label: 'ABS: Ancestry 1st Response',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: false,
    unit: '%',
  },
  // {
  //   id: 'parentscountryofbirth',
  //   label: 'ABS: Country of Birth of Parents',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: false,
  //   unit: '%',
  // },
  {
    id: 'indigenousstatus',
    label: 'ABS: Indigenous Status',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  // {
  //   id: 'irsd',
  //   label: 'ABS: Socio-Economic Disadvantage (SA1 Level - Pop-based)',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: true,
  //   unit: '%',
  // },
  // {
  //   id: 'irsad',
  //   label: 'ABS: Socio-Economic Advantage and Disadvantage (SA1 Level - Pop-based)',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: true,
  //   unit: '%',
  // },
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
  // {
  //   id: 'engagement',
  //   label: 'ABS: Engagement in Employment, Education and Training',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: true,
  //   unit: '%',
  // },
  {
    id: 'income',
    label: 'ABS: Total Personal Income',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'languages',
    label: 'ABS: Language Spoken At Home',
    sourceLabel: 'Census of Population and Housing, 2021, TableBuilder',
    canCombine: false,
    unit: '%',
  },
  // {
  //   id: 'occupation',
  //   label: 'ABS: Occupation',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: true,
  //   unit: '%',
  // },
  // {
  //   id: 'unpaiddomesticwork',
  //   label: 'ABS: Unpaid Domestic Work',
  //   sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  //   canCombine: true,
  //   unit: '%',
  // },
];

export const Y_AXIS_METHODS = [
  {
    id: 'zero',
    isSwing: false,
    label: '',
  },

  //
  // Voice referendum
  //
  {
    id: 'yesvote',
    isSwing: false,
    label: 'Yes vote (%)',
  },
  {
    id: 'novote',
    isSwing: false,
    label: 'No Vote (%)',
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
  {
    id: 'state-result',
    label: 'State Result',
  },
  {
    id: 'result',
    label: 'Result',
  },
  {
    id: 'endorsement',
    label: 'MP endorsement',
  },
];

//
// Electorate / State highlight opts
//
export const HIGHLIGHT_OPTS = [...ELECTORATES.map(e => e.Electorate), 'QLD', 'NSW', 'VIC', 'TAS', 'SA', 'WA', 'NT', 'ACT'];

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
  NAT: '#0A52BF',
  ALP: '#E11F30',
  GRN: '#51A802',
  OTH: '#757575',
};

// Some parties need supplementary colours when used as labels
const PARTY_LABEL_COLOURS = {
  ...PARTY_COLOURS,
  GRN: '#508423',
};

const DEFAULT_PRIMARY_COLOUR = '#007BC7'; // light blue
const DEFAULT_FOCUS_COLOUR = '#E52A00'; // orange
const TEXT_COLOUR = 'black';
const BG_COLOUR = 'white';

const AXIS_COLOUR = '#69788C';
const GRID_COLOUR = '#D6DDE4';

const YES_COLOUR = '#523178'; // purple
const NO_COLOUR = '#EF5C06'; // orange
const NO_TEXT_COLOUR = '#CC4E00';


export const COLOURS = {
  PARTIES: PARTY_COLOURS,
  PARTY_LABELS: PARTY_LABEL_COLOURS,
  PRIMARY: DEFAULT_PRIMARY_COLOUR,
  FOCUS: DEFAULT_FOCUS_COLOUR,
  TEXT: TEXT_COLOUR,
  BG: BG_COLOUR,
  AXIS: AXIS_COLOUR,
  GRID: GRID_COLOUR,

  YES: YES_COLOUR,
  NO: NO_COLOUR,
  NO_TEXT: NO_TEXT_COLOUR,
};
