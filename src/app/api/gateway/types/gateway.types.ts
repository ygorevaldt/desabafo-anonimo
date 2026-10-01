export type GatewayHttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH";

export type GatewayDomain = "unburden" | "comment" | "support" | "status";

export type GatewayRequest = {
  method: GatewayHttpMethod;
  targetPath: string;
  subpathParts: string[];
  clientIp: string;
  headers: Headers;
  queryParams: URLSearchParams;
  body?: unknown;
};

export type GatewayResponse = {
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
};

export type GatewayErrorPayload = {
  message: string;
  code: string;
  retryAfterSeconds?: number;
};
