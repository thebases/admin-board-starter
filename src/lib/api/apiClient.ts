import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import backendApi from './backend_api.json';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface RequestOptions<TBody = any> {
  /** Path params, e.g. { id: 123 } for /devices/{id} */
  path?: Record<string, string | number>;
  /** Query string params */
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Request body (JSON or FormData) */
  body?: TBody;
  /** Extra headers (Authorization, custom headers, etc.) */
  headers?: Record<string, string>;
  /** Extra Axios config (timeout, etc.) */
  config?: AxiosRequestConfig;
}

// ------------------------
// Axios instance
// ------------------------

const BASE_URL =
  import.meta.env.VITE_MDM_API_BASE_URL ??
  `http://${backendApi.host}${backendApi.basePath ?? ''}`;

export const mdmAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ------------------------
// Helpers
// ------------------------

/**
 * Replace {id} style params in path.
 */
function buildPath(
  rawPath: string,
  pathParams?: Record<string, string | number>,
): string {
  let path = rawPath;
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }
  return path;
}

/**
 * Low-level request executor using Axios.
 */
async function request<TResponse = unknown, TBody = any>(
  method: HttpMethod,
  rawPath: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { path, query, body, headers = {}, config } = options;

  const url = buildPath(rawPath, path);

  // merge explicit headers with config.headers
  const finalHeaders: Record<string, any> = {
    ...headers,
    ...(config?.headers ?? {}),
  };

  const hasContentType =
    finalHeaders['Content-Type'] !== undefined ||
    finalHeaders['content-type'] !== undefined;

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    if (!hasContentType) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  const res = await mdmAxios.request<TResponse>({
    method,
    url,
    params: query,
    data: body,
    ...config,
    headers: finalHeaders,
  });

  return res.data;
}

// ------------------------
// API tree types
// ------------------------

/**
 * Callable API function, generic over response and body.
 *
 * Usage:
 *   api.auth.me.get<MeResponse>({ headers: { Authorization: `Bearer ${token}` } })
 */
export interface ApiFn {
  <TResponse = unknown, TBody = any>(options?: RequestOptions<TBody>): Promise<TResponse>;
}

type ApiNodeMethods = {
  get: ApiFn;
  post: ApiFn;
  put: ApiFn;
  delete: ApiFn;
  patch: ApiFn;
  options: ApiFn;
  head: ApiFn;
};

/**
 * Node in the API tree:
 * - any dynamic segment (auth, token, '8', devices, etc.) is another ApiNode
 * - each node has HTTP methods (get/post/...) as callable functions
 *
 * NOTE: Types say all HTTP methods exist; in reality only the ones present
 * in backend_api.json are attached at runtime. Call only what you know exists.
 */
export type ApiNode = {
  [segment: string]: ApiNode;
} & ApiNodeMethods;

/**
 * Root generated API object.
 */
export const api = {} as ApiNode;

// ------------------------
// Build API tree from backend_api.json
// ------------------------

function attachEndpoint(path: string, method: HttpMethod) {
  const segments = path.replace(/^\//, '').split('/');

  let node: ApiNode = api;

  segments.forEach((seg, index) => {
    const isLast = index === segments.length - 1;

    if (!(node as any)[seg]) {
      (node as any)[seg] = {} as ApiNode;
    }

    const current: ApiNode = (node as any)[seg];

    if (isLast) {
      // Attach a callable ApiFn with generics
      (current as any)[method] = (<TResponse = unknown, TBody = any>(
        options?: RequestOptions<TBody>,
      ) => request<TResponse, TBody>(method, path, options ?? {})) as ApiFn;
    } else {
      node = current;
    }
  });
}

// Iterate swagger paths and methods to generate tree
Object.entries(backendApi.paths as Record<string, any>).forEach(([path, methods]) => {
  Object.keys(methods).forEach((methodKey) => {
    const lower = methodKey.toLowerCase() as HttpMethod;
    if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(lower)) {
      attachEndpoint(path, lower);
    }
  });
});

// Optional helper: call by raw path+method if you prefer this style
export function callByPath<TResponse = unknown, TBody = any>(
  method: HttpMethod,
  path: string,
  options?: RequestOptions<TBody>,
) {
  return request<TResponse, TBody>(method, path, options ?? {});
}
