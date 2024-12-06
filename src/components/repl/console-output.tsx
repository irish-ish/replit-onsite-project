import React, { JSX, useState } from 'react';

type ConsoleOutputProps = {
  data: any; // The processed data to display.
};

const ExpandableObject: React.FC<{ value: Record<string, any> }> = ({
  value,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pl-2">
      <span
        className="cursor-pointer text-blue-500"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▼ Object' : '▶ Object'}
      </span>
      {expanded && (
        <div className="pl-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex">
              <span className="text-yellow-500">{key}: </span>
              <ConsoleOutput data={val} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpandableArray: React.FC<{ value: any[] }> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pl-2">
      <span
        className="cursor-pointer text-blue-500"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? `▼ Array(${value.length})` : `▶ Array(${value.length})`}
      </span>
      {expanded && (
        <div className="pl-2">
          {value.map((item, index) => (
            <div key={index} className="flex">
              <span className="text-gray-500">{index}: </span>
              <ConsoleOutput data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpandableSet: React.FC<{ value: Set<any> }> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pl-4">
      <span
        className="cursor-pointer text-blue-500"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? `▼ Set(${value.size})` : `▶ Set(${value.size})`}
      </span>
      {expanded && (
        <div className="pl-4">
          {[...value].map((item, index) => (
            <div key={index}>
              <ConsoleOutput data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpandableMap: React.FC<{ value: Map<any, any> }> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pl-4">
      <span
        className="cursor-pointer text-blue-500"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? `▼ Map(${value.size})` : `▶ Map(${value.size})`}
      </span>
      {expanded && (
        <div className="pl-4">
          {[...value.entries()].map(([key, val], index) => (
            <div key={index} className="flex">
              <ConsoleOutput data={key} />
              <span className="px-2">→</span>
              <ConsoleOutput data={val} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ data }) => {
  const renderValue = (value: any): JSX.Element => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined)
      return <span className="text-gray-500">undefined</span>;
    if (typeof value === 'string')
      return <span className="text-green-500">&quot;{value}&quot;</span>;
    if (typeof value === 'number')
      return <span className="text-blue-500">{value}</span>;
    if (typeof value === 'bigint')
      return <span className="text-orange-500">{value.toString()}n</span>;
    if (typeof value === 'boolean')
      return <span className="text-purple-500">{value.toString()}</span>;
    if (typeof value === 'symbol')
      return <span className="text-teal-500">Symbol({value.description})</span>;
    if (value instanceof Date)
      return <span className="text-pink-500">{value.toISOString()}</span>;
    if (value instanceof RegExp)
      return (
        <span className="text-red-500">
          /{value.source}/{value.flags}
        </span>
      );
    if (value instanceof Error)
      return (
        <span className="text-red-500">
          {value.name}: {value.message}
        </span>
      );
    if (value instanceof ArrayBuffer)
      return <span className="text-yellow-500">ArrayBuffer</span>;
    if (ArrayBuffer.isView(value))
      return <span className="text-yellow-500">TypedArray</span>;
    if (value instanceof Set) return <ExpandableSet value={value} />;
    if (value instanceof Map) return <ExpandableMap value={value} />;
    if (Array.isArray(value)) return <ExpandableArray value={value} />;
    // Render function
    if (value && value.body && typeof value.body === 'string') {
      return (
        <span className="text-blue-500">
          f {value.name}(){' '}
          <span className="text-gray-500">
            {'{'} {value.body.trim()} {'}'}
          </span>
        </span>
      );
    }
    if (typeof value === 'object') return <ExpandableObject value={value} />;

    return <span>{String(value)}</span>;
  };

  return <div className="text-wrap">{renderValue(data)}</div>;
};
