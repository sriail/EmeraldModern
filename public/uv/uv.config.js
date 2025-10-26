self.__uv$config = {
  prefix: "/~/uv/",
  bare: "/w/",
  encodeUrl: Ultraviolet.codec.plain.encode,
  decodeUrl: Ultraviolet.codec.plain.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
  
  // Inject popup interception script into all pages
  inject: [{
    host: '*',
    html: '<script src="/uv/uv-inject.js"></script>'
  }]
};
