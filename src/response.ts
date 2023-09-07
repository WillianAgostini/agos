import { response } from "./types";

export function responseToJson(this: response, document: object) {
  this.setHeader("Content-Type", "application/json");
  this.end(JSON.stringify(document));
}
