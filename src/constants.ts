export const DATASETS = [
  {
    id: 'religion',
    label: 'Religious Affiliation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'education',
    label: 'Level of Highest Educational Achievement',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'age',
    label: 'Age in Ten Year Groups',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'engagement',
    label: 'Engagement in Employment, Education and Training',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'income',
    label: 'Total Personal Income',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'languages',
    label: 'Language Spoken At Home',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'occupation',
    label: 'Occupation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: 'unpaiddomesticwork',
    label: 'Unpaid Domestic Work',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
    unit: '%',
  },
  {
    id: '2019results',
    label: '2019 Federal Election Results',
    sourceLabel: '',
    unit: '%',
  },
  {
    id: 'geo',
    label: 'Geographic Features',
    sourceLabel: '',
    unit: 'km',
  },
  {
    id: 'housingstress',
    label: 'Rental and Mortgage Stress (Do not use)',
    sourceLabel: 'Digital Finance Analytics',
    unit: '%',
  },
  {
    id: 'votecompass',
    label: 'Vote Compass',
    sourceLabel: 'ABC Vote Compass',
    unit: '%',
  },
];

export const Y_AXIS_METHODS = [
  {
    id: 'swing-from-lnp',
    label: 'Swing away from Coalition',
  },
  {
    id: 'swing-to-lnp',
    label: 'Swing to Coalition',
  },
  {
    id: '2cp-vote-lnp',
    label: 'Two-Candidate-Preferred Vote for Coalition',
  },
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
const DEFAULT_PRIMARY_COLOUR = '#664CB3'; // purple
const TEXT_COLOUR = 'black';

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
const DEFAULT_PRIMARY_COLOUR_DM = '#AB96EB'; // purple
const TEXT_COLOUR_DM = 'white';

const AXIS_COLOUR_DM = '#838FA0';
const GRID_COLOUR_DM = '#31363C';

export const COLOURS = (isDarkMode?: boolean) => ({
  PARTIES: isDarkMode ? PARTY_COLOURS_DM : PARTY_COLOURS,
  PRIMARY: isDarkMode ? DEFAULT_PRIMARY_COLOUR_DM : DEFAULT_PRIMARY_COLOUR,
  TEXT: isDarkMode ? TEXT_COLOUR_DM : TEXT_COLOUR,
  AXIS: isDarkMode ? AXIS_COLOUR_DM : AXIS_COLOUR,
  GRID: isDarkMode ? GRID_COLOUR_DM : GRID_COLOUR,
});
