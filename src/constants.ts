import ELECTORATES from './electorate_categories.json';

export const MOBILE_BREAKPOINT = 480;

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
  {
    id: 'campaignvisits',
    label: 'ABC: Campaign Visits',
    sourceLabel: '', // TODO: Anything special to put here?
    canCombine: false,
    unit: '',
  },
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
    id: 'covid',
    label: 'COVID: Cases',
    sourceLabel: 'https://covidlive.com.au',
    canCombine: false,
    unit: '',
  },
  {
    id: 'vaccinations',
    label: 'COVID: Vaccinations',
    sourceLabel: 'Federal Department of Health',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'ancestry',
    label: 'ABS: Ancestry 1st Response',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'parentscountryofbirth',
    label: 'ABS: Country of Birth of Parents',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
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
    id: 'irsd',
    label: 'ABS: Socio-Economic Disadvantage (SA1 Level - Pop-based)',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'irsad',
    label: 'ABS: Socio-Economic Advantage and Disadvantage (SA1 Level - Pop-based)',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'religion',
    label: 'ABS: Religious Affiliation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'education',
    label: 'ABS: Level of Highest Educational Achievement',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'age',
    label: 'ABS: Age in Ten Year Groups',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'engagement',
    label: 'ABS: Engagement in Employment, Education and Training',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'income',
    label: 'ABS: Total Personal Income',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'languages',
    label: 'ABS: Language Spoken At Home',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'occupation',
    label: 'ABS: Occupation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
    unit: '%',
  },
  {
    id: 'unpaiddomesticwork',
    label: 'ABS: Unpaid Domestic Work',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: true,
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
    id: 'state',
    label: 'State',
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

//
// From ABC Datawrapper darkmode colour palette
//
const PARTY_COLOURS_DM = {
  LIB: '#166EF3',
  NAT: '#166EF3',
  ALP: '#E11F30',
  GRN: '#51A802',
  OTH: '#757575',
};
const PARTY_LABEL_COLOURS_DM = {
  ...PARTY_COLOURS_DM,
};

const DEFAULT_PRIMARY_COLOUR_DM = '#0092ED'; // light blue
const DEFAULT_FOCUS_COLOUR_DM = '#FF571A'; // orange
const TEXT_COLOUR_DM = 'white';
const BG_COLOUR_DM = 'black';

const AXIS_COLOUR_DM = '#838FA0';
const GRID_COLOUR_DM = '#31363C';

//
// Allow consumer to flip between palette based on DM setting
//
export const COLOURS = (isDarkMode?: boolean) => ({
  PARTIES: isDarkMode ? PARTY_COLOURS_DM : PARTY_COLOURS,
  PARTY_LABELS: isDarkMode ? PARTY_LABEL_COLOURS_DM : PARTY_LABEL_COLOURS,
  PRIMARY: isDarkMode ? DEFAULT_PRIMARY_COLOUR_DM : DEFAULT_PRIMARY_COLOUR,
  FOCUS: isDarkMode ? DEFAULT_FOCUS_COLOUR_DM : DEFAULT_FOCUS_COLOUR,
  TEXT: isDarkMode ? TEXT_COLOUR_DM : TEXT_COLOUR,
  BG: isDarkMode ? BG_COLOUR_DM : BG_COLOUR,
  AXIS: isDarkMode ? AXIS_COLOUR_DM : AXIS_COLOUR,
  GRID: isDarkMode ? GRID_COLOUR_DM : GRID_COLOUR,
});
