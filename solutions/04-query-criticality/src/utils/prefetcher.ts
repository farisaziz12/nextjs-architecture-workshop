import { captureException } from "@sentry/nextjs";
import {
  dehydrate as reactQueryDehydrate,
  FetchQueryOptions,
  QueryClient,
  QueryFunction,
  QueryKey,
} from "@tanstack/react-query";

type PrefetchSuccess<TData> = {
  type: "data";
  data: TData;
};

type PrefetchError = {
  type: "error";
  error: Error;
};

export type PrefetchResult<TData> = PrefetchSuccess<TData> | PrefetchError;

// Timeout function
const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

/**
 * Provides prefetching mechanism for critical and non-critical queries
 * with built-in error handling and reporting to Sentry.
 *
 * @example
 * const queryClient = new QueryClient()
 * const prefetch = createPrefetch()
 *
 * If a "critical" query fails it will throw an error.
 * prefetch.criticalQuery('MyCriticalQuery', () => fetch(..))
 *
 * If an "optional" query fails it will not throw an error
 * but just returns a `null`.
 * prefetch.optionalQuery('MyOptionalQuery', () => fetch(..))
 */
export const createPrefetch = (queryClient: QueryClient, timeoutDuration = 5000) => {
  const prefetchWithErrorBoundary = async <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Promise<PrefetchResult<TData>> => {
    let result: PrefetchResult<TData>;

    try {
      // We are using `fetchQuery` instead of `prefetchQuery` because
      // `prefetchQuery` swallows the error if thrown, so even it fails
      // it won't throw. We need the error.
      const fetchPromise = queryClient.fetchQuery({
        queryKey,
        queryFn,
        ...options,
      });

      const data = (await Promise.race([
        fetchPromise,
        timeout(timeoutDuration),
      ])) as TData;

      result = {
        type: "data",
        data,
      };
    } catch (error) {
      // For every failed prefetch we want to capture the exception
      // and send to Sentry. Even non-critical fetch errors should be
      // sent to investigate the issue.
      captureException(error);

      result = {
        type: "error",
        error: error instanceof Error ? error : new Error(`Request failed.`),
      };
    }

    return result;
  };

  /**
   * Prefetch a query that is required for a page to render.
   * - If a query is successful it returns query response.
   * - If a query fails this method will re-throw an error from a query call.
   */
  const criticalQuery = async <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Promise<TData> => {
    const result = await prefetchWithErrorBoundary(queryKey, queryFn, options);

    if (result.type === "error") {
      // If a critical fetch fails we want to re-throw the error
      // so it can be handled separately, for example by redirecting
      // user to the error page.
      throw result.error;
    }

    return result.data;
  };

  /**
   * Prefetch a query that is not required for page to render.
   * - If a query is successful it returns query response.
   * - If a query fails this method returns `null`.
   */
  const optionalQuery = async <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Promise<TData | null> => {
    const result = await prefetchWithErrorBoundary(queryKey, queryFn, options);

    if (result.type === "error") {
      return null;
    }

    return result.data;
  };

  const dehydrate = () => {
    return reactQueryDehydrate(queryClient);
  };

  return {
    criticalQuery,
    optionalQuery,
    dehydrate,
  };
};

export type Prefetch = ReturnType<typeof createPrefetch>;