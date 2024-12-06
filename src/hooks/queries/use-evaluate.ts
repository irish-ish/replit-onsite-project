import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
type EvalRequestBody = {
  code: string;
  sessionId: string;
};

type SerializedResponse = {
  root: string;
  serialized: Record<string, any>;
};

const flatvalURL =
  'https://b7841eef-c709-4b07-9263-e8bfa1c71a1b-00-1p7bpjpl8f0qj.picard.replit.dev';
const evalEndpoint = flatvalURL + '/eval'; // Update with the correct API URL if hosted externally.

const postEval = async (data: EvalRequestBody): Promise<SerializedResponse> => {
  const response = await axios.post(evalEndpoint, data);
  return response.data;
};

export function useEvaluate() {
  return useMutation({
    mutationFn: postEval,
    onSuccess() {
      // return queryClient.invalidateQueries({
      //   queryKey: evalQueryKey(),
      // });
    },
  });
}
