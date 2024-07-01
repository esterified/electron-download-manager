import { protocol, nativeImage } from "electron";

export function initProtocols() {
  protocol.handle("media", async function (req) {
    const pathToMedia = new URL(req.url).pathname;
    // console.log(decodeURIComponent);
    // for streaming video
    // return net.fetch(`file://${pathToMedia}`);
    const image = await nativeImage.createThumbnailFromPath(
      decodeURIComponent(pathToMedia),
      {
        width: 200,
        height: 200,
      },
    );
    return new Response(image.toPNG(), {
      headers: { "content-type": "image/png" },
    });
  });
}
