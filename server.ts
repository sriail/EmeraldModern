import "dotenv/config";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { createServer } from "http";
import wisp from "wisp-server-node";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import { load } from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Sponser = {
  title: string;
  icon: string;
  url: string;
  discord: string;
};

let sponserFile: Sponser[] = [];
if (fs.existsSync(path.join(__dirname, "sponsers.json"))) {
  sponserFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "sponsers.json"), "utf8")
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serverFactory = (handler, _) => {
  return createServer()
    .on("request", (req, res) => {
      handler(req, res);
    })
    .on("upgrade", (req, socket, head) => {
      // @ts-expect-error          VVVVVV
      wisp.routeRequest(req, socket, head);
    });
};

const app = fastify({ logger: false, serverFactory });

app.get("/api/search", async (req, res) => {
  const { query } = req.query as { query: string };
  try {
    const response = await fetch(
      `https://duckduckgo.com/ac/?q=${query}&format=list`
    ).then((apiRes) => apiRes.json());
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get("/api/sponser", async (req, res) => {
  if (sponserFile.length > 0) {
    res.send(sponserFile[Math.floor(Math.random() * sponserFile.length)]);
  } else {
    res.send([]);
  }
});

app.get("/api/title", async (req, res) => {
  const { url } = req.query as { url: string };
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);
    res.send({
      title: $("title").text(),
    });
  } catch (error) {
    res.send({
      success: false,
      error: error,
    });
  }
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
  serve: true,
  wildcard: true,
});

app.setNotFoundHandler((req, res) => {
  res.sendFile("index.html");
});

app.listen({ port: parseInt(process.env.PORT || "3000") }, (err, address) => {
  if (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});
