import { IncomingMessage, ServerResponse } from "http";

export type response = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
} & {
  toJson: (document: object) => void;
};

export type request = IncomingMessage & {
  json: () => Promise<any>;
  params: any;
  searchParams: URLSearchParams;
};

export type fn = {
  handler?: Handler;
};

export type Handler = (
  req: request | any,
  res: response | any,
) => Promise<void> | void;
