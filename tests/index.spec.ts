import app from "../src/index";
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

  it("Find route by path with params", async () => {
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
});
