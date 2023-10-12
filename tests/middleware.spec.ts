import { get } from "nordus";
import { app } from "../src/index";
import { request, response } from "../src/types";
import { finishHTTPServer, startHTTPServer } from "./utils/server";

type requestWithText = request & {
  text: string;
};

describe("routerTree", () => {
  const port = 2002;

  beforeEach(async () => {
    await startHTTPServer(port);
  });

  afterEach(async () => {
    await finishHTTPServer();
  });

  it("Add middleware from request", async () => {
    let value = "";

    const sayHi = function (req: requestWithText) {
      req.text = "Hi";
    };
    app.use(sayHi);

    app.get("/test", (req: requestWithText, res: response) => {
      value = req.text;
      res.toJson({ value: value });
    });

    await get(`http://localhost:${port}/test`);
    expect(value).toBe("Hi");
  });
});
