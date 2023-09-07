export function responseToJson(document: object) {
  this.setHeader("Content-Type", "application/json");
  this.end(JSON.stringify(document));
}
