
import React, { useState } from 'react';

interface CopyableBlockProps {
  content: string;
  title: string;
  isStatic?: boolean;
}

const CopyableBlock: React.FC<CopyableBlockProps> = ({ content, title, isStatic = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div className="mt-4 bg-gray-900/70 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold text-yellow-300 uppercase tracking-wider">{title}</p>
        {!isStatic && (
          <button
            onClick={handleCopy}
            className={`px-3 py-1 text-xs font-bold rounded ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            } transition-colors`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-black/20 p-3 rounded">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export default CopyableBlock;