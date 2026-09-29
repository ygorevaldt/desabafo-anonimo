import { createServer } from "node:http";
import supertest from "supertest";
import { NextRequest } from "next/server";

type RouteHandlerModule = {
  GET?: (req: NextRequest, ctx: any) => Promise<Response>;
  POST?: (req: NextRequest, ctx: any) => Promise<Response>;
  PUT?: (req: NextRequest, ctx: any) => Promise<Response>;
  DELETE?: (req: NextRequest, ctx: any) => Promise<Response>;
  PATCH?: (req: NextRequest, ctx: any) => Promise<Response>;
};

export function testClient(
  handlerModule: RouteHandlerModule,
  params: Record<string, string> = {},
) {
  const server = createServer(async (req, res) => {
    try {
      const method = req.method?.toUpperCase() || "GET";
      const handler = (handlerModule as any)[method];

      if (!handler) {
        res.statusCode = 405;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
        return;
      }

      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const rawBody = Buffer.concat(chunks);

      const url = `http://${req.headers.host || "localhost:3000"}${req.url}`;

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, value);
          }
        }
      }

      const hasBody =
        ["POST", "PUT", "PATCH"].includes(method) && rawBody.length > 0;

      const nextRequest = new NextRequest(url, {
        method,
        headers,
        body: hasBody ? rawBody : undefined,
      });

      const response: Response = await handler(nextRequest, {
        params: Promise.resolve(params),
      });

      res.statusCode = response.status;
      response.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const responseBuffer = Buffer.from(await response.arrayBuffer());
      res.end(responseBuffer);
    } catch (err: any) {
      if (!res.headersSent) {
        res.statusCode = err.status || 500;
      }
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({ message: err.message || "Internal Server Error" }),
      );
    }
  });

  return supertest(server);
}
