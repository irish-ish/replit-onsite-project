'use client';
import { useReducer, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ConsoleOutput } from '@/components/repl/console-output';
import {
  initialResultState,
  resultReducer,
} from '@/components/repl/result-reducer';
import { SessionSelect } from '@/components/repl/session-select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useEvaluate } from '@/hooks/queries/use-evaluate';

export const REPL = () => {
  const [code, setCode] = useState('');
  const [state, dispatch] = useReducer(resultReducer, initialResultState);
  const { mutate } = useEvaluate();

  const currentSession = state.sessions.find(
    (session) => session.sessionId === state.currentSessionId
  );

  const handleRunCode = () => {
    mutate(
      { code, sessionId: state.currentSessionId },
      {
        onSuccess: (data) => {
          dispatch({
            type: 'ADD_RESULT',
            payload: {
              sessionId: state.currentSessionId,
              id: Date.now(),
              input: code,
              output: data,
            },
          });
          setCode('');
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

  const handleNewSession = () => {
    const newSessionId = uuidv4();
    dispatch({
      type: 'CREATE_NEW_SESSION',
      payload: { sessionId: newSessionId },
    });
  };

  const handleSwitchSession = (sessionId: string) => {
    dispatch({
      type: 'SWITCH_SESSION',
      payload: { sessionId: sessionId },
    });
  };

  const handleClearResults = () => {
    setCode('');
    dispatch({
      type: 'CLEAR_RESULTS',
      payload: { sessionId: state.currentSessionId },
    });
  };

  const sessionIds = state.sessions.map((session) => session.sessionId);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-end space-x-4">
        <SessionSelect
          currentSession={state.currentSessionId}
          sessions={sessionIds}
          onValueChange={handleSwitchSession}
        />
        <Button size="sm" onClick={handleNewSession}>
          New session
        </Button>
      </div>
      <div className="border py-5 h-64 overflow-y-auto overflow-x-auto rounded ">
        {currentSession?.results.map(({ id, input, output }) => (
          <div key={id} className="text-sm my-2 mx-4">
            <div className="text-gray-400">
              <span className="pr-2">&gt;</span>
              <span>{input}</span>
            </div>
            <Separator />
            <div className="text-gray-400 whitespace-pre-wrap break-all">
              <span className="pr-2">&lt;</span>
              <ConsoleOutput data={output} />
            </div>
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
        <Button variant="outline" size="sm" onClick={handleClearResults}>
          Clear
        </Button>
        <Button className="px-4 py-2" size="sm" onClick={handleRunCode}>
          Run
        </Button>
      </div>
    </div>
  );
};
