import { getMiddlewares, newMiddleware } from "./middleware";
import { bodyToJson } from "./request";
import { responseToJson } from "./response";
import {
  getRouteBy,
  newAllRoute,
  newDeleteRoute,
  newGetRoute,
  newPatchRoute,
  newPostRoute,
  newPutRoute,
} from "./routes";
import { close, start, startWithCluster } from "./server";
import { request, response } from "./types";

export async function execute(req: request, res: response) {
  res.toJson = responseToJson;
  req.json = bodyToJson;

  for (const middleware of getMiddlewares()) {
    await middleware(req as request, res as response);
  }

  const routeInfo = await getRouteBy(req.url, req.method);
  if (routeInfo && routeInfo.handler) {
    req.params = routeInfo.params;
    req.searchParams = routeInfo.searchParams;
    return await routeInfo.handler(req, res);
  }

  res.statusCode = 404;
  res.end("Not Found");
}

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
  close,
};

export { app };
