
export type EvalRequestBody = {
  code: string;
  sessionId: string;
};

export type SerializedResponse = {
  root: string;
  serialized: Record<string, any>;
};
