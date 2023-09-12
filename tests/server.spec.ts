import { app } from "../src/index";
import { get, post } from "nordus";
import { request, response } from "../src/types";

describe("start", () => {
  const port = 2000;

  beforeEach(async () => {
    await app.start(
      {
        hostname: "localhost",
        port,
      },
      () => {
        console.log(`Server running at http://localhost:${port}/`);
      },
    );
  });

  afterEach(() => {
    app.finish();
  });

  it("create server and return data from get request", async () => {
    app.get("/test/:id", (req: request, res: response) => {
      res.toJson({ id: req.params.id });
    });

    const response = await get(`http://localhost:${port}/test/1`);
    expect(response.data).toEqual({ id: "1" });
  });

  it("create server and return data from get request", async () => {
    app.post("/test/:id", async (req: request, res: response) => {
      const data = await req.json();
      res.toJson({ id: data.id });
    });

    const response = await post(`http://localhost:${port}/test/1`, { id: "1" });
    expect(response.data).toEqual({ id: "1" });
  });

  it("create server with all endpoins", async () => {
    app.all("/test", async (req: request, res: response) => {
      const data = await req.json();
      res.toJson({ id: data.id });
    });

    const response = await post(`http://localhost:${port}/test`, { id: "1" });
    expect(response.data).toEqual({ id: "1" });
  });
});
