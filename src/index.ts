import cluster from "node:cluster";
import {
  IncomingMessage,
  Server,
  ServerResponse,
  createServer,
} from "node:http";
import { availableParallelism } from "node:os";
import { bodyToJson } from "./request";
import { responseToJson } from "./response";
import { RouterTree } from "./routerTree";
import { Handler, request, response } from "./types";

const routeTreeAll = new RouterTree();
const routeTreeGet = new RouterTree();
const routeTreePost = new RouterTree();
const routeTreePut = new RouterTree();
const routeTreePatch = new RouterTree();
const routeTreeDelete = new RouterTree();

const newAllRoute = (endpoint: string, fn: Handler) =>
  routeTreeAll.addRoute(endpoint, fn);
const newGetRoute = (endpoint: string, fn: Handler) =>
  routeTreeGet.addRoute(endpoint, fn);
const newPostRoute = (endpoint: string, fn: Handler) =>
  routeTreePost.addRoute(endpoint, fn);
const newPutRoute = (endpoint: string, fn: Handler) =>
  routeTreePut.addRoute(endpoint, fn);
const newPatchRoute = (endpoint: string, fn: Handler) =>
  routeTreePatch.addRoute(endpoint, fn);
const newDeleteRoute = (endpoint: string, fn: Handler) =>
  routeTreeDelete.addRoute(endpoint, fn);

async function execute(req: request, res: response) {
  res.toJson = responseToJson;
  req.json = bodyToJson;

  const routeInfo = await getRouteBy(req.url, req.method);
  if (routeInfo && routeInfo.handler) {
    req.params = routeInfo.params;
    req.searchParams = routeInfo.searchParams;
    return await routeInfo.handler(req, res);
  }

  res.statusCode = 404;
  res.end("Not Found");
}

async function getRouteBy(path?: string, method?: string) {
  const route = routeTreeAll.findRoute(path);
  if (route) return route;

  if (method === "GET") return routeTreeGet.findRoute(path);

  if (method === "POST") return routeTreePost.findRoute(path);

  if (method === "PUT") return routeTreePut.findRoute(path);

  if (method === "PATCH") return routeTreePatch.findRoute(path);

  if (method === "DELETE") return routeTreeDelete.findRoute(path);

  return;
}

const middlewares: Handler[] = [];
const newMiddleware = (handler: any) => {
  middlewares.push(handler);
};

const servers: Server<typeof IncomingMessage, typeof ServerResponse>[] = [];

const listen = (
  hostname: string,
  port: number,
  handler?: () => Promise<void> | void,
): Promise<void> => {
  const server = createServer(async (req, res) => {
    try {
      console.log("debug");
      for (const middleware of middlewares) {
        await middleware(req as request, res as response);
      }
      await execute(req as request, res as response);
    } catch (err) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });
  servers.push(server);
  return new Promise((resolve) => {
    server.listen(port, hostname, async () => {
      if (handler) await handler();
      resolve();
    });
  });
};

const start = async (
  opts: {
    hostname: string;
    port: number;
  },
  handler?: () => Promise<void> | void,
) => {
  await listen(opts.hostname, opts.port, handler);
};

const close = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  return new Promise((resolve) => {
    server.closeAllConnections();
    server.close(resolve);
  });
};

const finish = async () => {
  for (const server of servers) {
    await close(server);
  }
};

const startWithCluster = async (
  opts: {
    hostname: string;
    port: number;
    numCPUs: number;
  },
  handler: () => Promise<void> | void,
) => {
  opts.numCPUs = opts.numCPUs || availableParallelism();

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < opts.numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    await start(opts, handler);
    console.log(`Worker ${process.pid} started`);
  }
};

const app = {
  get: newGetRoute,
  post: newPostRoute,
  put: newPutRoute,
  patch: newPatchRoute,
  delete: newDeleteRoute,
  all: newAllRoute,
  use: newMiddleware,
  execute,
  start,
  startWithCluster,
  finish,
};

export { app };
