import { RouterTree } from "../src/routerTree";

describe("routerTree", () => {
  it("Find route by path with params", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/test/:id", () => {});

    const routerInfo = routeTree.findRoute("/test/1");
    expect(routerInfo?.params?.id).toEqual("1");
  });

  it("Find route by path with multiple params", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/test/:id/:another", () => {});

    const routerInfo = routeTree.findRoute("/test/1/2");
    expect(routerInfo?.params?.id).toEqual("1");
    expect(routerInfo?.params?.another).toEqual("2");
  });

  it("Find route by path with multiple params", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/state/:id/city/:another", () => {});

    const routerInfo = routeTree.findRoute("/state/1/city/2");
    expect(routerInfo?.params?.id).toEqual("1");
    expect(routerInfo?.params?.another).toEqual("2");
  });

  it("Find undefined route", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/state/:id/city/:another", () => {});

    const routerInfo = routeTree.findRoute("/state/");
    expect(routerInfo?.handler).toBeFalsy();
  });

  it("Find route by path with searchParams", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/state", () => {});

    const routerInfo = routeTree.findRoute("/state?id=1");
    expect(routerInfo?.searchParams.get("id")).toBe("1");
  });

  it("Not found route", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/state", () => {});

    const routerInfo = routeTree.findRoute("/not-found");
    expect(routerInfo?.handler).toBeFalsy();
  });

  it("Not found route for empty path", async () => {
    const routeTree = new RouterTree();
    routeTree.addRoute("/state", () => {});

    const routerInfo = routeTree.findRoute();
    expect(routerInfo?.handler).toBeFalsy();
  });
});
