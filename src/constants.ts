export const MOBILE_BREAKPOINT = 480;
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
    id: 'votecompass',
    label: 'ABC: Vote Compass',
    sourceLabel: 'ABC Vote Compass',
    canCombine: false,
    unit: '%',
  },
  {
    id: 'indigenousstatus',
    label: 'ABS: Indigenous Status',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    canCombine: false,
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
  {
    id: 'housingstress',
    label: 'DFA: Rental and Mortgage Stress (Do not use)',
    sourceLabel: 'Digital Finance Analytics',
    canCombine: false,
    unit: '%',
  },
];

export const Y_AXIS_METHODS = [
  // LNP
  {
    id: 'swingfromlnp',
    forcePrefix: true,
    label: 'Change in Coalition 2PP vote (flipped)',
  },
  {
    id: 'swingtolnp',
    forcePrefix: true,
    label: 'Change in Coalition 2PP vote',
  },
  {
    id: '2cpvotelnp',
    forcePrefix: false,
    label: 'Coalition 2CP Vote',
  },
  {
    id: 'lnpprimary',
    forcePrefix: false,
    label: 'Coalition primary vote',
  },
  {
    id: 'lnpprimaryswing',
    forcePrefix: true,
    label: 'Change in Coalition primary vote',
  },

  // LABOR
  {
    id: 'swingfromlabor',
    forcePrefix: true,
    label: 'Change in Labor 2PP vote (flipped)',
  },
  {
    id: 'swingtolabor',
    forcePrefix: true,
    label: 'Change in Labor 2PP vote',
  },
  {
    id: '2cpvotelabor',
    forcePrefix: false,
    label: 'Labor 2CP Vote',
  },
  {
    id: 'laborprimary',
    forcePrefix: false,
    label: 'Labor primary vote',
  },
  {
    id: 'laborprimaryswing',
    forcePrefix: true,
    label: 'Change in Labor primary vote',
  },

  // MINORS
  {
    id: 'swingtominors',
    forcePrefix: true,
    label: 'Change in minor parties (incl. Greens) 2PP vote',
  },

  {
    id: 'minorprimary',
    forcePrefix: false,
    label: 'Primary vote for combined minor parties (incl. Greens)',
  },
  {
    id: 'bestminorprimary',
    forcePrefix: false,
    label: 'Primary vote for highest placing minor party (incl. Greens)',
  },

  {
    id: 'minorprimaryswing',
    forcePrefix: true,
    label: 'Change in combined primary vote for minor parties (incl. Greens)',
  },
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
  'Liberal',
  'Labor',
];
export const MAJOR_PARTY_CODES = ['LIB', 'LNP', 'NAT', 'ALP', 'GRN'];

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

const DEFAULT_PRIMARY_COLOUR = '#664CB3'; // purple
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
const DEFAULT_PRIMARY_COLOUR_DM = '#AB96EB'; // purple
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
  TEXT: isDarkMode ? TEXT_COLOUR_DM : TEXT_COLOUR,
  BG: isDarkMode ? BG_COLOUR_DM : BG_COLOUR,
  AXIS: isDarkMode ? AXIS_COLOUR_DM : AXIS_COLOUR,
  GRID: isDarkMode ? GRID_COLOUR_DM : GRID_COLOUR,
});
