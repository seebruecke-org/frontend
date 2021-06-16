import { format, utcToZonedTime } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';

import { getFragments } from '@/components/Blocks';
import METADATA_FRAGMENT from '@/components/SEO/fragment';

import { mergeMetadata } from '@/lib/metadata';
import { fetchAPI } from './api';
import { createUri as createCityUri } from './city';
import { toMapboxCoordinates } from './coordinates';

import translations from '@/locales/de/common.json';

function getDateWithFixedTZ(dateStr) {
  return utcToZonedTime(parseISO(dateStr), 'Europe/Berlin');
}

export function formatStartAndEnd(start, end) {
  const startDate = getDateWithFixedTZ(start);
  const endDate = getDateWithFixedTZ(end);
  const startEndIsSameDay = isSameDay(startDate, endDate);

  const formattedStart =
    start &&
    format(
      startDate,
      `${translations.action.dateFormat}, ${translations.action.timeFormat}`,
      { locale: de }
    );

  const formattedEnd =
    end &&
    format(
      endDate,
      `${startEndIsSameDay ? '' : `${translations.action.dateFormat},`} ${
        translations.action.timeFormat
      }`,
      { locale: de }
    );

  return `${formattedStart} — ${formattedEnd} ${translations.action.timePostfix}`;
}

export function formatTime(date) {
  if (!date) {
    return null;
  }

  return format(
    getDateWithFixedTZ(date),
    `${translations.action.dateFormat}, ${translations.action.timeFormat}`,
    { locale: de }
  );
}

export function buildGraphQLQuery(fields, filter = [], limit) {
  const fieldsObject = fields.reduce((acc, name) => {
    acc[name] = true;
    return acc;
  }, {});

  const filterObject = filter.reduce((acc, { connect_via, value, key }) => {
    let normalizedValue = value;

    if (typeof normalizedValue === 'object') {
      normalizedValue = {
        [normalizedValue.key]: normalizedValue.value
      };
    }

    switch (key) {
      case 'campaign':
        normalizedValue = {
          slug: value
        };
    }

    switch (connect_via) {
      case 'or':
        if (!acc['_or']) {
          acc['_or'] = {};
        }

        acc['_or'][key] = normalizedValue;

        break;

      default:
        acc[key] = normalizedValue;
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
          sort: 'start:asc',
          limit: !limit || limit === 0 ? 100 : limit
        }
      }
    }
  });
}

export async function fetchAllActions() {
  const query = buildGraphQLQuery([
    'id',
    'title',
    'intro',
    'start',
    'slug',
    'location',
    'location_detail',
    'coordinates'
  ]);
  const { actions } = await fetchAPI(query);

  return actions.reduce((acc, action) => {
    const { start, end, coordinates } = action;
    const key = format(getDateWithFixedTZ(start), 'dd. LLLL yyyy', {
      locale: de
    });

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      ...action,
      start: formatTime(start),
      end: formatTime(end),
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

  if (action) {
    action.metadata = mergeMetadata(action.metadata, {
      title: action?.title
    });

    action.formattedDateRange = formatStartAndEnd(action.start, action.end);
  }

  return {
    data: {
      ...action
    }
  };
}

export async function fetchAllActionPaths(locale) {
  const { actions } = await fetchAPI(`
    query {
      actions {
        slug
      }
    }
  `);

  return actions.map(({ slug }) => ({
    locale,
    params: {
      slug: [slug]
    }
  }));
}
