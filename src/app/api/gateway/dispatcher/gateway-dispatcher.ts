import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "@/app/api/constants/http-status-code";

import {
  GET as getUnburden,
  POST as postUnburden,
} from "@/app/api/v1/unburden/route";
import { GET as getUnburdenById } from "@/app/api/v1/unburden/[id]/route";
import { POST as postReport } from "@/app/api/v1/unburden/[id]/report/route";
import {
  GET as getComment,
  POST as postComment,
} from "@/app/api/v1/comment/route";
import { POST as postSupport } from "@/app/api/v1/support/route";
import { GET as getStatus } from "@/app/api/v1/status/route";

export enum ApiVersion {
  V1 = "v1",
}

export enum GatewayDomain {
  UNBURDEN = "unburden",
  COMMENT = "comment",
  SUPPORT = "support",
  STATUS = "status",
}

export const SUPPORTED_API_VERSIONS: readonly string[] =
  Object.values(ApiVersion);
export const VALID_GATEWAY_DOMAINS: readonly string[] =
  Object.values(GatewayDomain);

const MUTATIVE_HTTP_METHODS: readonly string[] = [
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
];

type RouteHandler = (
  request: NextRequest,
  subpath: string[],
) => Promise<NextResponse> | NextResponse;

type MethodHandlers = Record<string, RouteHandler>;
type DomainRouteMap = Record<number, MethodHandlers>;
type VersionRouteRegistry = Record<
  ApiVersion,
  Partial<Record<GatewayDomain, DomainRouteMap>>
>;

const ROUTE_REGISTRY: VersionRouteRegistry = {
  [ApiVersion.V1]: {
    [GatewayDomain.UNBURDEN]: {
      1: {
        GET: (request) => getUnburden(request),
        POST: (request) => postUnburden(request),
      },
      2: {
        GET: (request, subpath) =>
          getUnburdenById(request, {
            params: Promise.resolve({ id: subpath[1] }),
          }),
      },
      3: {
        POST: (request, subpath) =>
          postReport(request, {
            params: Promise.resolve({ id: subpath[1] }),
          }),
      },
    },
    [GatewayDomain.COMMENT]: {
      1: {
        GET: (request) => getComment(request),
        POST: (request) => postComment(request),
      },
    },
    [GatewayDomain.SUPPORT]: {
      1: {
        POST: (request) => postSupport(request),
      },
    },
    [GatewayDomain.STATUS]: {
      1: {
        GET: () => getStatus(),
      },
    },
  },
};

export class GatewayDispatcher {
  public static parseVersionAndPath(pathParts: string[]): {
    version: string;
    domain: string;
    subpath: string[];
  } {
    const firstPart = pathParts[0]?.toLowerCase() || "";
    const isVersion = /^v\d+$/.test(firstPart);

    const version = isVersion ? firstPart : ApiVersion.V1;
    const subpath = isVersion ? pathParts.slice(1) : pathParts;
    const domain = subpath[0]?.toLowerCase() || "";

    return {
      version,
      domain,
      subpath,
    };
  }

  public static resolveDomain(pathParts: string[]): GatewayDomain | null {
    const { domain } = this.parseVersionAndPath(pathParts);
    if (VALID_GATEWAY_DOMAINS.includes(domain)) {
      return domain as GatewayDomain;
    }
    return null;
  }

  public static isMutative(method: string): boolean {
    return MUTATIVE_HTTP_METHODS.includes(method.toUpperCase());
  }

  public async dispatch(
    pathParts: string[],
    request: NextRequest,
  ): Promise<NextResponse> {
    const { version, domain, subpath } =
      GatewayDispatcher.parseVersionAndPath(pathParts);

    if (!SUPPORTED_API_VERSIONS.includes(version)) {
      return NextResponse.json(
        {
          message: "Versão da API não suportada.",
          code: "VERSION_NOT_SUPPORTED",
        },
        { status: HttpStatusCode.NOT_FOUND },
      );
    }

    const versionKey = version as ApiVersion;
    const domainKey = domain as GatewayDomain;

    const domainRoutes = ROUTE_REGISTRY[versionKey]?.[domainKey];
    if (!domainRoutes) {
      return NextResponse.json(
        {
          message: "Recurso não encontrado no gateway.",
          code: "ROUTE_NOT_FOUND",
        },
        { status: HttpStatusCode.NOT_FOUND },
      );
    }

    const methodHandlers = domainRoutes[subpath.length];
    if (!methodHandlers) {
      return NextResponse.json(
        {
          message: "Recurso não encontrado no gateway.",
          code: "ROUTE_NOT_FOUND",
        },
        { status: HttpStatusCode.NOT_FOUND },
      );
    }

    const method = request.method.toUpperCase();
    const handler = methodHandlers[method];

    if (!handler) {
      return NextResponse.json(
        { message: "Método não permitido.", code: "METHOD_NOT_ALLOWED" },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    return await handler(request, subpath);
  }
}
