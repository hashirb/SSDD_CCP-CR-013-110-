import { useEffect, useRef } from 'react';
import { useAuth } from '../auth.jsx';

/**
 * INTENTIONAL_VULN_XSS — vulnerable path assigns raw HTML to the DOM (stored XSS).
 * Fixed build renders escaped text only.
 */
function RawHtmlSink({ html, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html;
    }
  }, [html]);
  return <div ref={ref} className={className} />;
}

export function NoteBody({ body, className = '' }) {
  const { vulnerableMode } = useAuth();
  if (vulnerableMode === true) {
    return <RawHtmlSink html={body} className={`prose prose-invert max-w-none ${className}`} />;
  }
  return <div className={`whitespace-pre-wrap break-words ${className}`}>{body}</div>;
}
