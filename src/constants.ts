export const RESULTS_SOURCE_LABEL = 'Australian Electoral Commission (AEC)';
export const DATASETS = [
  {
    id: 'religion',
    source: 'ABS',
    label: 'Religious Affiliation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'education',
    source: 'ABS',
    label: 'Level of Highest Educational Achievement',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'age',
    source: 'ABS',
    label: 'Age in Ten Year Groups',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'engagement',
    source: 'ABS',
    label: 'Engagement in Employment, Education and Training',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'income',
    source: 'ABS',
    label: 'Total Personal Income',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'languages',
    source: 'ABS',
    label: 'Language Spoken At Home',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'occupation',
    source: 'ABS',
    label: 'Occupation',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'unpaid_domestic_work',
    source: 'ABS',
    label: 'Unpaid Domestic Work',
    sourceLabel: 'Census of Population and Housing, 2016, TableBuilder',
  },
  {
    id: 'vote_compass',
    source: 'Vote Compass',
    label: 'Vote Compass',
    sourceLabel: 'ABC Vote Compass',
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
export const PARTY_COLOURS = {
  LIB: '#0A52BF',
  NAT: '#0A52BF',
  ALP: '#E11F30',
  GRN: '#51A802',
  OTH: '#757575',
};
// export const DEFAULT_PRIMARY_COLOUR = '#007BC7'; // blue
export const DEFAULT_PRIMARY_COLOUR = '#664CB3'; // purple
export const FOCUS_ORANGE = '#E52A00';

export const AXIS_COLOUR = '#69788C';
export const GRID_COLOUR = '#D6DDE4';
