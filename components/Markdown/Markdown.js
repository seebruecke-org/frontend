import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';

export default function Markdown({ children, plugins = [], ...props }) {
  // `remark-breaks` turns a single newline (one Enter in Strapi) into a <br>,
  // so line breaks entered by editors show up on the site.
  return (
    <ReactMarkdown plugins={[breaks, ...plugins]} {...props}>
      {children}
    </ReactMarkdown>
  );
}
