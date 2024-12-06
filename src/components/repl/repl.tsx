'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useEvaluate } from '@/hooks/queries/use-evaluate';

export const REPL = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const sessionId = 'hardcoded-session-id'; // Replace with a dynamic sessionId if needed.

  const { mutate } = useEvaluate();

  const handleRunCode = () => {
    mutate(
      { code, sessionId },
      {
        onSuccess: (data) => {
          const result = JSON.stringify(data, null, 2);
          setOutput((prev) => [...prev, result]);
        },
        onError: (error) => {
          setOutput((prev) => [...prev, `Error: ${error.message}`]);
        },
      }
    );
  };
  return (
    <div className="p-4 space-y-4">
      <textarea
        className="w-full h-20 p-2 border rounded"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder=">"
      />
      <Button className="px-4 py-2" onClick={handleRunCode}>
        Run
      </Button>
      <div className="border p-2 h-64 overflow-y-auto">
        Temp output:
        {output.map((out: string, index: number) => (
          <pre key={index} className="text-sm">
            {out}
          </pre>
        ))}
      </div>
    </div>
  );
};
