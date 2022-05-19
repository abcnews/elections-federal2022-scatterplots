import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface Graph {
  title: string;
  description: string;
  chartAuthor: string;

  resultsYear: string;
  dataset: string;

  yAxisMethod: string;

  xAxisFields: string[];
  xAxisInverse: boolean;
  xAxisLabelOverride: null | string;
  xAxisUseLog: boolean;

  partyColours: boolean;
  grid: boolean;

  trendlineEnabled: boolean;
  smoothingBandwidth: number;

  heldByFilters: string[];
  closenessFilters: string[];
  categoryFilters: string[];

  darkModePreview: boolean;

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
  title: '',
  description: '',
  chartAuthor: '',

  resultsYear: '2019-local',
  dataset: 'religion',

  yAxisMethod: 'swing-from-lnp',

  xAxisFields: [],
  xAxisInverse: false,
  xAxisLabelOverride: null,
  xAxisUseLog: false,

  darkModePreview: false,

  partyColours: false,
  grid: true,

  trendlineEnabled: true,
  smoothingBandwidth: 2,

  heldByFilters: [],
  closenessFilters: [],
  categoryFilters: [],

  electorateHighlights: []
};

export const ENCODED_FIELDS = [
  'xAxisFields',
  'heldByFilters',
  'closenessFilters',
  'categoryFilters',
  'electorateHighlights',
  'title',
  'description',
  'xAxisLabelOverride',
  'chartAuthor',
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
