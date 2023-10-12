import { app } from "../src/index";
import { get, post } from "nordus";
import { request, response } from "../src/types";
import { finishHTTPServer, startHTTPServer } from "./utils/server";

describe("start", () => {
  const port = 2000;

  beforeEach(async () => {
    await startHTTPServer(port);
  });

  afterEach(async () => {
    await finishHTTPServer();
  });

  it("create server and return data from get request", async () => {
    app.get("/test/:id", (req: request, res: response) => {
      res.toJson({ id: req.params.id });
    });

    const response = await get(`http://localhost:${port}/test/1`);
    expect(response.data).toEqual({ id: "1" });
  });

  it("create server and return data from get request", async () => {
    app.post("/req", async (req: request, res: response) => {
      const data = await req.json();
      res.toJson({ id: data.id });
    });

    const response = await post<{ id: number }>(
      `http://localhost:${port}/req`,
      { id: 1 },
    );
    expect(response.data?.id).toEqual(1);
  });

  it("create server with all endpoins", async () => {
    app.all("/test", async (req: request, res: response) => {
      const data = await req.json();
      res.toJson({ id: data.id });
    });

    const response = await post(`http://localhost:${port}/test`, { id: "1" });
    expect(response.data).toEqual({ id: "1" });
  });

  it("Throw error", async () => {
    app.all("/test", async () => {
      throw new Error("Error");
    });

    try {
      await post(`http://localhost:${port}/test`, { id: "1" });
    } catch (error) {
      expect(error.message).toEqual("Internal Server Error");
    }
  });
});
