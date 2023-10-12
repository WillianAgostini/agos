import { app } from "../../src/index";
import { HttpServer } from "../../src/types";

const servers: HttpServer[] = [];

export async function startHTTPServer(port: number) {
  const server = await app.start(
    {
      hostname: "localhost",
      port,
    },
    () => {
      console.log(`Server running at http://localhost:${port}/`);
    },
  );
  servers.push(server);
}

export async function finishHTTPServer() {
  for (const server of servers) {
    await app.close(server);
  }
}
