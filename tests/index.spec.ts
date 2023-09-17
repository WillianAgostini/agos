import { app } from "../src/index";
import httpMocks from "node-mocks-http";

describe("routerTree", () => {
  it("Find route by path with params", async () => {
    let value = false;

    app.get("/test/:id", () => {
      value = true;
    });

    const request = httpMocks.createRequest({
      method: "GET",
      url: "/test/1",
      params: {
        id: 42,
      },
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(value).toBe(true);
  });

  it("post: Find route by path with params", async () => {
    let params: any = {};
    app.post("/test/:id", (req) => {
      params = req.params;
    });

    const request = httpMocks.createRequest({
      method: "POST",
      url: "/test/1",
      params: {
        id: 42,
      },
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(params?.id).toBe("1");
  });

  it("put: Find route by path with params", async () => {
    let params: any = {};
    app.put("/test/:id", (req) => {
      params = req.params;
    });

    const request = httpMocks.createRequest({
      method: "PUT",
      url: "/test/1",
      params: {
        id: 42,
      },
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(params?.id).toBe("1");
  });

  it("patch: Find route by path with params", async () => {
    let params: any = {};
    app.patch("/test/:id", (req) => {
      params = req.params;
    });

    const request = httpMocks.createRequest({
      method: "PATCH",
      url: "/test/1",
      params: {
        id: 42,
      },
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(params?.id).toBe("1");
  });

  it("delete: Find route by path with params", async () => {
    let params: any = {};
    app.delete("/test/:id", (req) => {
      params = req.params;
    });

    const request = httpMocks.createRequest({
      method: "DELETE",
      url: "/test/1",
      params: {
        id: 42,
      },
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(params?.id).toBe("1");
  });

  it("Not found route", async () => {
    app.post("/test/:id", () => {});

    const request = httpMocks.createRequest({
      method: "POST",
      url: "/test",
    });

    const response = httpMocks.createResponse();
    await app.execute(request, response);
    expect(response.statusCode).toBe(404);
    expect(response._isEndCalled()).toBe(true);
  });
});
