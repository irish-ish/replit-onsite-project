import { v4 as uuidv4 } from 'uuid';

import { SerializedResponse } from '@/types/types';

// types for session and result state
type Session = {
  sessionId: string;
  results: {
    id: number;
    input: string;
    output: any;
  }[];
};

export type ResultState = {
  sessions: Session[];
  currentSessionId: string;
};

// Define actions
type Action =
  | {
      type: 'ADD_RESULT';
      payload: { sessionId: string; id: number; input: string; output: any };
    }
  | { type: 'CREATE_NEW_SESSION'; payload: { sessionId: string } }
  | { type: 'SWITCH_SESSION'; payload: { sessionId: string } }
  | { type: 'CLEAR_RESULTS'; payload: { sessionId: string } };

const initialSessionId = uuidv4();
export const initialResultState: ResultState = {
  sessions: [{ sessionId: initialSessionId, results: [] }],
  currentSessionId: initialSessionId,
};

export const resultReducer = (
  state: ResultState,
  action: Action
): ResultState => {
  switch (action.type) {
    case 'ADD_RESULT':
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.sessionId === action.payload.sessionId
            ? {
                ...session,
                results: [
                  ...session.results,
                  {
                    id: action.payload.id,
                    input: action.payload.input,
                    output: processSerializedResponse(action.payload.output),
                  },
                ],
              }
            : session
        ),
      };

    case 'CREATE_NEW_SESSION':
      return {
        ...state,
        sessions: [
          ...state.sessions,
          { sessionId: action.payload.sessionId, results: [] },
        ],
        currentSessionId: action.payload.sessionId,
      };

    case 'SWITCH_SESSION':
      return {
        ...state,
        currentSessionId: action.payload.sessionId,
      };

    case 'CLEAR_RESULTS':
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.sessionId === action.payload.sessionId
            ? { ...session, results: [] }
            : session
        ),
      };

    default:
      return state;
  }
};

const processSerializedResponse = (data: SerializedResponse): any => {
  const cache = new Map<string, any>();

  const resolveValue = (id: string): any => {
    if (cache.has(id)) {
      return cache.get(id); // Handle circular references
    }

    const serialized = data.serialized[id];

    switch (serialized.type) {
      case 'undefined':
        return undefined;
      case 'null':
        return null;

      case 'string':
      case 'number':
      case 'boolean':
        return serialized.value;

      case 'bigint':
        return BigInt(serialized.value);

      case 'symbol':
        return Symbol(serialized.value);

      case 'function': {
        const funcRepresentation = {
          name: serialized.value.name || '(anonymous)',
          body: serialized.value.body,
        };
        cache.set(id, funcRepresentation);
        return funcRepresentation;
      }

      case 'object': {
        const obj: Record<string, any> = {};
        cache.set(id, obj);
        serialized.value.forEach(({ key, value }: any) => {
          obj[resolveValue(key)] = resolveValue(value);
        });
        return obj;
      }

      case 'array': {
        const arr: any[] = [];
        cache.set(id, arr);
        serialized.value.forEach((itemId: string) => {
          arr.push(resolveValue(itemId));
        });
        return arr;
      }

      case 'date':
        return new Date(serialized.value);

      case 'regexp':
        return new RegExp(serialized.value.src, serialized.value.flags);

      case 'error':
        const err = new Error(serialized.value.message);
        err.name = serialized.value.name;
        err.stack = serialized.value.stack;
        return err;

      case 'arraybuffer':
        return new Uint8Array(serialized.value).buffer;

      case 'typedarray': {
        const { ctor, viewArr } = serialized.value;
        // @ts-ignore
        const TypedArrayConstructor = globalThis[ctor];
        return new TypedArrayConstructor(viewArr);
      }

      case 'map': {
        const map = new Map();
        cache.set(id, map);
        serialized.value.forEach(({ key, value }: any) => {
          map.set(resolveValue(key), resolveValue(value));
        });
        return map;
      }

      case 'set': {
        const set = new Set();
        cache.set(id, set);
        serialized.value.forEach(({ key }: any) => {
          set.add(resolveValue(key));
        });
        return set;
      }

      case 'nan':
        return NaN;

      case 'infinity':
        return serialized.value === '+' ? Infinity : -Infinity;

      case 'neg0':
        return -0;

      default:
        return 'Unsupported Type';
    }
  };

  return resolveValue(data.root);
};
