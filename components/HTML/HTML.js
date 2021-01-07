import NextLink from 'next/link';
import React from 'react';
import parse, { domToReact } from 'html-react-parser';

const HTML = ({ html }) => {
  const parseOptions = {
    replace: (node) => {
      const defaultTransforms = {
        a: ({ attribs, children }) => {
          const { href, ...props } = attribs;

          return (
            <NextLink href={href} {...props}>
              <a className="underline">
                {domToReact(children, parseOptions)}
              </a>
            </NextLink>
          );
        },
      };

      if (node.type === 'tag' && defaultTransforms[node.name]) {
        return defaultTransforms[node.name](node);
      }

      return undefined;
    },
  };

  return parse(html || '', parseOptions);
};

export default HTML;
