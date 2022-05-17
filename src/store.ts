import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface Graph {
  dataset: string;

  yAxisMethod: string,

  xAxisFields: string[];
  xAxisInverse: boolean;
  xAxisLabelOverride: null | string,

  partyColours: boolean;
  grid: boolean;

  trendline: boolean;
  smoothingBandwidth: number;

  heldByFilters: string[];
  closenessFilters: string[];
  categoryFilters: string[];
}

export interface GraphStore extends Writable<Graph> {
  reset: () => void;
  resetToInitial: () => void;
  set: (inputs: Graph) => void;
  subscribe: (run: Subscriber<Graph>) => Unsubscriber;
  updateOne: (input: Partial<Graph>) => void;
}

const INITIAL_GRAPH = {
  dataset: 'religion',

  yAxisMethod: 'swing-from-lnp',

  xAxisFields: [],
  xAxisInverse: false,
  xAxisLabelOverride: null,

  partyColours: false,
  grid: true,

  trendline: true,
  smoothingBandwidth: 2,

  heldByFilters: [],
  closenessFilters: [],
  categoryFilters: [],
};

export function createGraphStore(initial: Partial<Graph> = {}) {
  const { subscribe, set, update } = writable<Graph>({ ...INITIAL_GRAPH, ...initial });

  const updateOne = (input: Partial<Graph>) =>
    update(
      g => ({ ...g, ...input })
    );

  return {
    reset: () => set({ ...INITIAL_GRAPH }),
    resetToInitial: () => set({ ...INITIAL_GRAPH }),
    set: (graph: Graph) => set({ ...graph }),
    subscribe,
    updateOne,
  } as GraphStore;
}
