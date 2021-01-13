import NextLink from 'next/link';
import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import isRelativeUrl from 'is-relative-url';

const HTML = ({ html }) => {
  const parseOptions = {
    replace: (node) => {
      const defaultTransforms = {
        a: ({ attribs, children }) => {
          let { href } = attribs;

          // TODO: check if the url pattern matches the frontend
          // e.g. /cities/sachsen/ -> /mach-mit/sachsen/
          if (!isRelativeUrl(href)) {
            href = href.replace(/^(?:\/\/|[^/]+)*\//, '');
          }

          return (
            <NextLink href={`/${href}`}>
              <a className="underline">{domToReact(children, parseOptions)}</a>
            </NextLink>
          );
        }
      };

      if (node.type === 'tag' && defaultTransforms[node.name]) {
        return defaultTransforms[node.name](node);
      }

      return undefined;
    }
  };

  return parse(html || '', parseOptions);
};

export default HTML;
