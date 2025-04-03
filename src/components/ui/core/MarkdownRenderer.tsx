// src/components/ui/core/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  return (
    <ReactMarkdown
      className={`prose dark:prose-invert prose-headings:mb-3 prose-headings:mt-6 prose-p:my-2 max-w-none ${className}`}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mb-3 mt-5" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold mb-2 mt-4" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-semibold mb-2 mt-4" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 my-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 my-3 italic"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code
            className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm"
            {...props}
          />
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto font-mono text-sm my-4"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-4 border-gray-300 dark:border-gray-700" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th
            className="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td
            className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;