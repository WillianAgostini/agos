import { get } from "nordus";
import { app } from "../src/index";
import { request, response } from "../src/types";

type requestWithText = request & {
  text: string;
};

describe("routerTree", () => {
  const port = 2002;

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

  afterEach(async () => {
    await app.finish();
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
