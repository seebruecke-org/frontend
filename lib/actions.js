import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

import { fetchAPI } from './api';
import { createUri as createCityUri } from './city';
import { toMapboxCoordinates } from './coordinates';

export function buildGraphQLQuery(fields, filter = [], limit) {
  const fieldsObject = fields.reduce((acc, name) => {
    acc[name] = true;
    return acc;
  }, {});
  const filterObject = filter.reduce((acc, { connect_via, value, key }) => {
    switch (connect_via) {
      case 'or':
        if (!acc['_or']) {
          acc['_or'] = {};
        }

        acc['_or'][key] = value;

        break;

      default:
        acc[key] = value;
    }

    return acc;
  }, {});

  return jsonToGraphQLQuery({
    query: {
      actions: {
        ...fieldsObject,

        __args: {
          where: {
            ...filterObject,
            end_gte: new Date().toISOString()
          },
          limit: limit === 0 ? 100 : limit
        }
      }
    }
  });
}

export async function fetchAllActions() {
  const { actions } = await fetchAPI(`
    query {
      actions {
        id
        title
        intro
        start
        slug
        location
        location_detail
        coordinates
      }
    }
  `);

  return actions.reduce((acc, action) => {
    const { start, coordinates } = action;
    const key = format(new Date(start), 'dd. LLLL yyyy', { locale: de });

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      ...action,
      coordinates: toMapboxCoordinates(coordinates)
    });

    return acc;
  }, {});
}

export async function fetchActionBySlug(slug) {
  const { actions } = await fetchAPI(`
    query {
      actions(where: { slug: "${slug}"}) {
        title
        intro
        start
        end
        content {
          __typename
          ${getFragments({
            exclude: [
              'SubNavigation',
              'StageLarge',
              'StageMedium',
              'Actions',
              'MediaGallery',
              'Newsletter',
              'Fundraisingbox'
            ]
          })}
        }

        location
        location_detail

        group {
          city {
            name
            slug
          }
        }

        metadata {
          ${METADATA_FRAGMENT}
        }
      }
    }
  `);

  const action = actions && actions[0];

  if (action && action?.group?.city?.name) {
    action.group.city.uri = await createCityUri(action.group.city.slug);
  }

  return {
    data: {
      ...action
    }
  };
}

export async function fetchAllActionPaths() {
  const { actions } = await fetchAPI(`
    query {
      actions {
        slug
      }
    }
  `);

  return actions.map(({ slug }) => ({
    locale: 'de',
    params: {
      slug: [slug]
    }
  }));
}
