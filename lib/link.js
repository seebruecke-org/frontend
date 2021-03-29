import { fetchAPI } from './api';

export async function fetchLink(link) {
  try {
    const data = JSON.parse(link);
    const { contentType, id } = data;

    if (contentType && id) {
      const content = await fetchAPI(`
        query {
          ${contentType}(id: ${id}) {
            slug
            title

            parent {
              slug
            }
          }
        }
      `);

      if (content?.page?.parent) {
        return {
          ...data,
          label: link.label || content?.page?.title,
          url: `/${content?.page?.parent?.slug}/${content?.page?.slug}`
        };
      }

      if (content?.page?.slug) {
        return {
          ...data,
          label: link.label || content?.page?.title,
          url: `/${content?.page?.slug}`
        };
      }

      return data;
    }

    return data;
  } catch (err) {
    console.log(err);
    return link;
  }
}
