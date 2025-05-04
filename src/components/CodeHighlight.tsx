
import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);

interface CodeHighlightProps {
  code: string;
  language?: string;
  fileName?: string;
  lineNumbers?: boolean;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  language = 'javascript',
  fileName,
  lineNumbers = true
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');
  
  return (
    <div className="code-container rounded-md overflow-hidden bg-muted dark:bg-muted/50">
      {fileName && (
        <div className="px-4 py-2 bg-muted/70 dark:bg-black/30 text-xs font-medium border-b border-border">
          {fileName}
        </div>
      )}
      <div className="relative">
        {lineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 pt-4 px-2 text-right text-xs text-muted-foreground select-none w-8 bg-muted/50 dark:bg-black/20 border-r border-border">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <pre className={`p-4 ${lineNumbers ? 'pl-12' : ''} overflow-x-auto`}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeHighlight;
