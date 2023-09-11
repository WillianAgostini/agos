import app from "../src/index";
import { get, post } from "nordus";

describe("start", () => {
  const port = 2000;

  beforeEach(async () => {
    await app.start("localhost", port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  });

  afterEach(() => {
    app.finish();
  });

  it("create server and return data from get request", async () => {
    app.get("/test/:id", (req, res) => {
      res.toJson({ id: req.params.id });
    });

    const response = await get(`http://localhost:${port}/test/1`);
    expect(response.data).toEqual({ id: "1" });
  });

  it("create server and return data from get request", async () => {
    app.post("/test/:id", async (req, res) => {
      const data = await req.json();
      res.toJson({ id: data.id });
    });

    const response = await post(`http://localhost:${port}/test/1`, { id: "1" });
    expect(response.data).toEqual({ id: "1" });
  });
});
