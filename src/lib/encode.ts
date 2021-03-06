import acto from '@abcnews/alternating-case-to-object';
import {
  ACTO_KEYS_TO_NAMES,
  NAMES_TO_ACTO_KEYS,
  INITIAL_GRAPH,
  ENCODED_FIELDS,
  PREVIEW_FIELDS,
  ARRAY_FIELDS,
  BOOL_FIELDS,
} from '../store';
import type { Graph } from '../store';

const encode = x => bytesToHex(stringToUTF8Bytes(x));
const decode = x => UTF8BytesToString(hexToBytes(x));

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i !== bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}
function bytesToHex(bytes: Uint8Array) {
  return Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, "0")
  ).join("");
}

function stringToUTF8Bytes(string) {
  return new TextEncoder().encode(string);
}
function UTF8BytesToString(bytes) {
  return new TextDecoder().decode(bytes);
}

export const actoObjectToPartialGraph = (actoObject: any): Partial<Graph> =>
  Object.keys(actoObject).reduce((graph, actoKey) => {
    const inputName = ACTO_KEYS_TO_NAMES[actoKey];

    // Ignore unknown properties, preview fields and empty string values
    if (!inputName || PREVIEW_FIELDS.indexOf(inputName) > -1) {
      return graph;
    }

    if (ARRAY_FIELDS.indexOf(inputName) > -1) {
      graph[inputName] = decode(actoObject[actoKey]).split(',');
    } else if (ENCODED_FIELDS.indexOf(inputName) > -1) {
      graph[inputName] = decode(actoObject[actoKey]);
    } else if (BOOL_FIELDS.indexOf(inputName) > -1) {
      graph[inputName] = actoObject[actoKey];
    } else {
      graph[inputName] = String(actoObject[actoKey]);
    }

    return graph;
  }, { ...INITIAL_GRAPH } as Partial<Graph>);

export const alternatingCaseToPartialGraph = (alternatingCase: string): Partial<Graph> =>
  actoObjectToPartialGraph(acto(alternatingCase));

export const graphToAlternatingCase = (graph: Graph): string =>
  Object.keys(graph).reduce((alternatingCase, inputName) => {
    const value = graph[inputName];

    // Dont export defaults, preview settings or empty values
    if (
      String(INITIAL_GRAPH[inputName]) === String(value) ||
      PREVIEW_FIELDS.indexOf(inputName) > -1 ||
      String(value) === ''
    ) {
      return alternatingCase;
    }

    alternatingCase += NAMES_TO_ACTO_KEYS[inputName].toUpperCase();

    if (ENCODED_FIELDS.indexOf(inputName) > -1) {
      alternatingCase += encode(value);
    } else {
      alternatingCase += value;
    }

    return alternatingCase;
  }, '');

export const urlQueryToPartialGraph = (urlQuery: string): Partial<Graph> => {
  const partialGraph = {} as Partial<Graph>;

  if (urlQuery.length < 2) {
    return partialGraph;
  }

  const parsedUrlQuery = JSON.parse(
    '{"' + urlQuery.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    (key, value) => (key === '' ? value : decodeURIComponent(value))
  );


  return Object.keys(parsedUrlQuery).reduce((graph, inputName) => {
    if (inputName in INITIAL_GRAPH) {
      if (ARRAY_FIELDS.indexOf(inputName) > -1) {
        graph[inputName] = decode(parsedUrlQuery[inputName]).split(',');
      } else if (ENCODED_FIELDS.indexOf(inputName) > -1) {
        graph[inputName] = decode(parsedUrlQuery[inputName]);
      } else if (BOOL_FIELDS.indexOf(inputName) > -1) {
        graph[inputName] = parsedUrlQuery[inputName] === 'true';
      } else {
        graph[inputName] = parsedUrlQuery[inputName];
      }
    }

    return graph;
  }, partialGraph);
};

export const graphToUrlQuery = (graph: Graph, existingUrlQuery?: string): string =>
  Object.keys(graph).reduce((urlQuery, inputName) => {
    const value = graph[inputName];

    // We never export defaults
    if (String(INITIAL_GRAPH[inputName]) === String(value) || String(value) === '') {
      return urlQuery;
    }

    urlQuery += (urlQuery.length > 0 ? '&' : '?') + inputName + '=';
    if (ENCODED_FIELDS.indexOf(inputName) > -1) {
      urlQuery += encode(value);
    } else {
      urlQuery += value; // will encode numbers, strings, bools and nulls
    }
    return urlQuery;
  }, existingUrlQuery || '');

