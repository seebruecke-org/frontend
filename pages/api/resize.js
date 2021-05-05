import sharp from 'sharp';

export default async function handler(req, res) {
  const { query } = req;
  const URL =
    'https://seeb.uber.space/uploads/Bildschirmfoto_2021_05_04_um_12_47_10_ccb4580224.png';

  const imageBuffer = await fetch(URL).then((res) => res.arrayBuffer());

  const image = await sharp(Buffer.from(imageBuffer))
    .resize(1200, 600)
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.status(200).send(image);
}
