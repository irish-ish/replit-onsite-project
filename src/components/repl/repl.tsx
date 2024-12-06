'use client';
import { useReducer, useState } from 'react';

import { ConsoleOutput } from '@/components/repl/console-output';
import { resultReducer } from '@/components/repl/result-reducer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useEvaluate } from '@/hooks/queries/use-evaluate';

export const REPL = () => {
  const [code, setCode] = useState('');
  const [state, dispatch] = useReducer(resultReducer, { results: [] });
  const [sessionId, setSessionId] = useState(self.crypto.randomUUID()); // Replace with a dynamic sessionId if needed.

  const { mutate } = useEvaluate();

  const handleClearSession = () => {
    setSessionId(self.crypto.randomUUID());
    // setOutput([]);
    dispatch({ type: 'CLEAR_RESULTS' });
  };

  // const handleRunCode = () => {
  //   mutate(
  //     { code, sessionId },
  //     {
  //       onSuccess: (data) => {
  //         const result = JSON.stringify(data, null, 2);
  //         setCode('');
  //         setOutput((prev) => [...prev, result]);
  //       },
  //       onError: (error) => {
  //         setOutput((prev) => [...prev, `Error: ${error.message}`]);
  //       },
  //     }
  //   );
  // };

  const handleRunCode = () => {
    mutate(
      { code, sessionId },
      {
        onSuccess: (data) => {
          dispatch({
            type: 'ADD_RESULT',
            payload: {
              id: Date.now(),
              output: data,
            },
          });
        },
        // onError: (error) => {
        //   dispatch({
        //     type: 'ADD_RESULT',
        //     payload: { id: Date.now(), output: `Error: ${error.message}` },
        //   });
        // },
      }
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="border h-64 overflow-y-auto rounded">
        {state.results.map(({ id, output }) => (
          <div key={id} className="text-sm my-2 mx-4">
            <ConsoleOutput data={output} />
            <Separator />
          </div>
        ))}
      </div>
      <Textarea
        className="w-full h-20 p-2 border rounded"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder=">"
      />
      <div className="flex align-center space-x-4 justify-end">
        <Button variant="outline" size="sm" onClick={handleClearSession}>
          Clear session
        </Button>
        <Button className="px-4 py-2" size="sm" onClick={handleRunCode}>
          Run
        </Button>
      </div>
    </div>
  );
};
