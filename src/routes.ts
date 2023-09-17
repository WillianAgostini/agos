import { RouterTree } from "./routerTree";
import { Handler } from "./types";

const routeTreeAll = new RouterTree();
const routeTreeGet = new RouterTree();
const routeTreePost = new RouterTree();
const routeTreePut = new RouterTree();
const routeTreePatch = new RouterTree();
const routeTreeDelete = new RouterTree();

export const newAllRoute = (endpoint: string, fn: Handler) =>
  routeTreeAll.addRoute(endpoint, fn);
export const newGetRoute = (endpoint: string, fn: Handler) =>
  routeTreeGet.addRoute(endpoint, fn);
export const newPostRoute = (endpoint: string, fn: Handler) =>
  routeTreePost.addRoute(endpoint, fn);
export const newPutRoute = (endpoint: string, fn: Handler) =>
  routeTreePut.addRoute(endpoint, fn);
export const newPatchRoute = (endpoint: string, fn: Handler) =>
  routeTreePatch.addRoute(endpoint, fn);
export const newDeleteRoute = (endpoint: string, fn: Handler) =>
  routeTreeDelete.addRoute(endpoint, fn);

export async function getRouteBy(path?: string, method?: string) {
  const route = routeTreeAll.findRoute(path);
  if (route) return route;

  if (method === "GET") return routeTreeGet.findRoute(path);

  if (method === "POST") return routeTreePost.findRoute(path);

  if (method === "PUT") return routeTreePut.findRoute(path);

  if (method === "PATCH") return routeTreePatch.findRoute(path);

  if (method === "DELETE") return routeTreeDelete.findRoute(path);

  return;
}
