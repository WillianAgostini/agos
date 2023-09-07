import { Handler, fn } from "./types";

export class RouterTree {
  tree: fn = {};

  addRoute(path: string, handler: Handler) {
    const segments = path.split("/").filter(Boolean);
    let currentNode: any = this.tree;

    for (const segment of segments) {
      if (!currentNode[segment]) {
        currentNode[segment] = {};
      }
      currentNode = currentNode[segment];
    }

    currentNode.handler = handler;
  }

  findRoute(path?: string) {
    if (!path) return null;

    const url = new URL(path, "http://localhost");
    const segments = url.pathname.split("/").filter(Boolean);
    const searchParams = url.searchParams;

    let currentNode: any = this.tree;
    const params: any = {};
    for (const segment of segments) {
      if (currentNode[segment]) {
        currentNode = currentNode[segment];
        continue;
      }

      const variable = Object.keys(currentNode)?.find((key) =>
        key.includes(":"),
      );
      if (variable) {
        currentNode = currentNode[variable];
        const clearVariable = variable.replace(":", "");
        params[clearVariable] = segment;
        continue;
      }

      return null;
    }

    return {
      searchParams,
      params,
      handler: currentNode?.handler,
    };
  }
}
