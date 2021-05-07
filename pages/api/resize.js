import { serializeError } from 'serialize-error';
import path from 'path';
import sharp from 'sharp';

import { isValidSeebrueckeUrl } from '@/lib/url';

const SIZES = {
  twitter: [1200, 600],
  facebook: [1200, 628]
};

function getSize(name) {
  return SIZES[name];
}

function isValidSize(name) {
  return !!SIZES[name];
}

async function resizeImage(url, size) {
  const imageBuffer = await fetch(url).then((res) => res.arrayBuffer());
  const parsedUrl = new URL(url);
  const filename = path.extname(parsedUrl.pathname);
  const filenameWithoutDot = filename.split('.').pop();

  return await sharp(Buffer.from(imageBuffer))
    .resize(...getSize(size), {
      fit: 'contain',
      background: { r: 245, g: 85, b: 17 }
    })
    .toFormat(filenameWithoutDot)
    .toBuffer();
}

export default async function handler(req, res) {
  const { query } = req;

  if (query.url && isValidSeebrueckeUrl(query.url)) {
    const { url, size } = query;

    if (size && isValidSize(size)) {
      const image = await resizeImage(url, size);

      res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24}`);
      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(image);
    } else {
      res
        .status(500)
        .send(
          process.env.NODE_ENV !== 'production'
            ? JSON.stringify(
                serializeError(
                  new Error('You must provide a valid size param.')
                )
              )
            : ''
        );
    }
  } else {
    res
      .status(500)
      .send(
        process.env.NODE_ENV !== 'production'
          ? JSON.stringify(
              serializeError(
                new Error('You must provide a valid Seebrücke hostname.')
              )
            )
          : ''
      );
  }
}