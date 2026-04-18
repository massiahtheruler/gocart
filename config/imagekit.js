import ImageKit from "@imagekit/nodejs";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  throw new Error(
    "ImageKit env vars are missing. Expected IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.",
  );
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export const buildImageKitUrl = (src, transformations = []) => {
  return imagekit.helper.buildSrc({
    urlEndpoint,
    src,
    transformation: transformations,
  });
};

export default imagekit;
