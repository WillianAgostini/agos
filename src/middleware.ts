import { Handler } from "./types";

const middlewares: Handler[] = [];
export const newMiddleware = (handler: any) => {
  middlewares.push(handler);
};

export const getMiddlewares = () => middlewares;
