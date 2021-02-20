import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { getFragments } from '@/components/Blocks';

import { fetchAPI } from './api';
import { createUri as createCityUri } from './city';

export async function fetchAllActions() {
  const { actions } = await fetchAPI(`
    query {
      actions {
        title
        intro
        start
        slug
        location
        location_detail
      }
    }
  `);

  return actions.reduce((acc, action) => {
    const { start } = action;
    const key = format(new Date(start), 'dd. LLLL yyyy', { locale: de });

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(action);

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
            exclude: ['SubNavigation', 'StageLarge', 'StageMedium']
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
