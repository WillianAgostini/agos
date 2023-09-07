import { request } from "./types";

export function bodyToJson(this: request) {
  return new Promise((resolve, reject) => {
    const body: Buffer[] = [];
    this.on("error", (err: any) => {
      reject(err);
    })
      .on("data", (chunk: Buffer) => {
        body.push(chunk);
      })
      .on("end", () => {
        const str = Buffer.concat(body).toString();
        try {
          const json = JSON.parse(str);
          resolve(json);
        } catch (error) {
          resolve(str);
        }
      });
  });
}
