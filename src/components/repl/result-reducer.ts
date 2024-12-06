import { SerializedResponse } from '@/types/types'; // Define SerializedResponse to match the response structure.

export type ResultState = {
  results: {
    id: number;
    output: any;
  }[];
};

type Action =
  | { type: 'ADD_RESULT'; payload: { id: number; output: SerializedResponse } }
  | { type: 'CLEAR_RESULTS' };

const processSerializedResponse = (data: SerializedResponse): any => {
  const cache = new Map<string, any>();

  const resolveValue = (id: string): any => {
    if (cache.has(id)) {
      return cache.get(id); // Return cached value to handle circular references.
    }

    const serialized = data.serialized[id];

    switch (serialized.type) {
      case 'number':
      case 'string':
      case 'boolean':
      case 'undefined':
      case 'null':
        return serialized.value;

      case 'object': {
        const obj: Record<string, any> = {};
        cache.set(id, obj); // Temporarily cache to handle circular references.
        serialized.value.forEach(({ key, value }: any) => {
          obj[resolveValue(key)] = resolveValue(value);
        });
        return obj;
      }

      case 'array': {
        const arr: any[] = [];
        cache.set(id, arr); // Temporarily cache to handle circular references.
        serialized.value.forEach((itemId: string) => {
          arr.push(resolveValue(itemId));
        });
        return arr;
      }

      case 'error':
        return `Error: ${serialized.value.message}`;

      default:
        return 'Unsupported Type';
    }
  };

  return resolveValue(data.root);
};

export const resultReducer = (
  state: ResultState,
  action: Action
): ResultState => {
  switch (action.type) {
    case 'ADD_RESULT':
      return {
        ...state,
        results: [
          ...state.results,
          {
            id: action.payload.id,
            output: processSerializedResponse(action.payload.output),
          },
        ],
      };

    case 'CLEAR_RESULTS':
      return { ...state, results: [] };

    default:
      return state;
  }
};
