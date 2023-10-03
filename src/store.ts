import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface Graph {
  chartTitle: string;
  chartDescription: string;
  chartAuthor: string;
  chartNotes: string,

  dataset: string;

  yAxisMethod: string;
  yAxisLabelOverride: null | string,

  xAxisFields: string[];
  xAxisInverse: boolean;
  xAxisLabelOverride: null | string;
  xAxisUseLog: boolean;
  xAxisUnitOverride: null | string;

  combineStates: boolean;
  sizeByPopulation: boolean;
  colourBy: string;
  grid: boolean;

  showSource: boolean;
  trendlineEnabled: boolean;
  trendlineMethod: string;
  smoothingBandwidth: number;

  heldByFilters: string[];
  closenessFilters: string[];
  geoFilters: string[];
  stateFilters: string[];
  onlyCalledElectorates: boolean;

  darkModePreview: boolean;
  pearsonCoefficientPreview: boolean;

  electorateHighlights: string[];
}

export interface GraphStore extends Writable<Graph> {
  reset: () => void;
  resetToInitial: () => void;
  set: (inputs: Graph) => void;
  subscribe: (run: Subscriber<Graph>) => Unsubscriber;
  updateMany: (input: Partial<Graph>) => void;
}

export const INITIAL_GRAPH = {
  chartTitle: '',
  chartDescription: '',
  chartAuthor: '',
  chartNotes: '',

  dataset: 'votecompass',

  yAxisMethod: 'yesvote',
  yAxisLabelOverride: null,

  xAxisFields: [],
  xAxisInverse: false,
  xAxisLabelOverride: null,
  xAxisUseLog: false,
  xAxisUnitOverride: null,

  darkModePreview: false,
  pearsonCoefficientPreview: false,

  combineStates: false,
  sizeByPopulation: false,
  colourBy: '',
  grid: true,

  showSource: false,
  trendlineEnabled: true,
  trendlineMethod: 'linear',
  smoothingBandwidth: 2,

  heldByFilters: [],
  stateFilters: [],
  closenessFilters: [],
  geoFilters: [],
  onlyCalledElectorates: false,

  electorateHighlights: []
};

export const BOOL_FIELDS = [
  'darkModePreview',
  'pearsonCoefficientPreview',

  'xAxisUseLog',
  'xAxisInverse',
  'grid',
  'combineStates',
  'sizeByPopulation',
  'trendlineEnabled',
  'onlyCalledElectorates',
  'showSource',
];

export const ARRAY_FIELDS = [
  'heldByFilters',
  'closenessFilters',
  'stateFilters',
  'geoFilters',

  'xAxisFields',

  'electorateHighlights',
];

export const ENCODED_FIELDS = [
  'heldByFilters',
  'closenessFilters',
  'geoFilters',
  'stateFilters',

  'electorateHighlights',
  'yAxisLabelOverride',

  'xAxisFields',
  'xAxisLabelOverride',
  'xAxisUnitOverride',

  'chartAuthor',
  'chartTitle',
  'chartDescription',
  'chartNotes',
];

// These are excluded from acto markers (but not sharable URLs)
export const PREVIEW_FIELDS = [
  'darkModePreview',
  'pearsonCoefficientPreview',
];

export function createGraphStore(initial: Partial<Graph> = {}) {
  const { subscribe, set, update } = writable<Graph>({ ...INITIAL_GRAPH, ...initial });

  const updateMany = (input: Partial<Graph>) => update(g => ({ ...g, ...input }));

  return {
    reset: () => set({ ...INITIAL_GRAPH }),
    resetToInitial: () => set({ ...INITIAL_GRAPH }),
    set: (graph: Graph) => set({ ...graph }),
    subscribe,
    updateMany,
  } as GraphStore;
}

export const NAMES_TO_ACTO_KEYS = Object.keys(INITIAL_GRAPH).reduce(
  (memo, key) => ({
    ...memo,
    [key]: [
      key.charAt(0),
      ...(key
        .split('_')[0]
        .replace(/O2|Of|With/g, '')
        .match(/[A-Z]/g) || [])
    ]
      .join('')
      .toLowerCase()
  }),
  {}
);
export const ACTO_KEYS_TO_NAMES = Object.keys(NAMES_TO_ACTO_KEYS).reduce(
  (memo, key) => ({
    ...memo,
    [NAMES_TO_ACTO_KEYS[key]]: key
  }),
  {}
);
export const ACTO_KEYS = Object.keys(ACTO_KEYS_TO_NAMES);
