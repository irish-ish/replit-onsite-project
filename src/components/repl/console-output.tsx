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

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ data }) => {
  const renderValue = (value: any): JSX.Element => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'undefined')
      return <span className="text-gray-500">undefined</span>;
    if (typeof value === 'string')
      return <span className="text-green-500">&quot;{value}&quot;</span>;
    if (typeof value === 'number')
      return <span className="text-blue-500">{value}</span>;
    if (typeof value === 'boolean')
      return <span className="text-purple-500">{value.toString()}</span>;

    if (Array.isArray(value)) {
      return <ExpandableArray value={value} />;
    }

    if (typeof value === 'object') {
      return <ExpandableObject value={value} />;
    }

    return <span>{String(value)}</span>;
  };

  return <div>{renderValue(data)}</div>;
};
