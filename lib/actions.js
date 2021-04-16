import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { point } from '@turf/helpers';

import { getFragments } from '@/components/Blocks';
import { FRAGMENT as METADATA_FRAGMENT } from '@/components/SEO';

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
        coordinates
      }
    }
  `);

  return actions.reduce((acc, action) => {
    const { start, coordinates } = action;
    const key = format(new Date(start), 'dd. LLLL yyyy', { locale: de });
    const [lat, lng] = coordinates ? coordinates.split(',') : [null, null];

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      ...action,
      coordinates: lat && lng && point([parseFloat(lng), parseFloat(lat)])
    });

    return acc;
  }, {});
}

export async function fetchActionBySlug(slug) {
  const { actions } = await fetchAPI(`
    query {
      actions(where: { slug: "${slug}"}) {
        id
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
