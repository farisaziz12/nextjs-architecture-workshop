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
 * Exercise: Extending Basic Prefetching with Query Criticality Syntax
 * 
 * Start with the basic prefetch functionality, then implement:
 * 1. Critical queries - required for a page to render properly
 * 2. Optional queries - enhance the page but aren't required
 *
 * @example When completed:
 * const queryClient = new QueryClient()
 * const prefetch = createPrefetch(queryClient)
 *
 * // Critical query will throw if it fails
 * prefetch.criticalQuery('MyCriticalQuery', () => fetch(..))
 *
 * // Optional query will return null if it fails
 * prefetch.optionalQuery('MyOptionalQuery', () => fetch(..))
 */
export const createPrefetch = (queryClient: QueryClient, timeoutDuration = 5000) => {
  /**
   * Basic prefetch implementation with error handling and timeout
   */
  const prefetch = async <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Promise<PrefetchResult<TData>> => {
    // TODO: when migrating to use critical and optional queries, switch from
    // `prefetchQuery` to `fetchQuery` so that the error is thrown and not swallowed. We want to handle the error ourselves.
    const fetchPromise = queryClient.fetchQuery({
      queryKey,
      queryFn,
      ...options,
    });

    const data = (await Promise.race([
      fetchPromise,
      timeout(timeoutDuration),
    ])) as TData;

    return {
      type: "data",
      data,
    };

    // TODO: Add try-catch block around this function to:
    // 1. Capture exceptions with captureException(error)
    // 2. Return { type: "error", error: error instanceof Error ? error : new Error(`Request failed.`) }
  };

  /**
   * TODO 1: Implement criticalQuery function
   * 
   * This function should:
   * - Use the prefetch function to fetch data
   * - If the result is successful, return the data
   * - If the result has an error, throw the error so it can be handled by error boundaries
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
    // TODO: Implement this function using the prefetch function
    // Hint: For critical queries, you'll want to throw the error if prefetch fails
    
    // This is a placeholder implementation that always resolves
    // Replace it with your implementation
    return prefetch(queryKey, queryFn, options).then(result => {
      if (result.type === "error") {
        throw result.error;
      }
      return result.data;
    });
  };

  /**
   * TODO 2: Implement optionalQuery function
   * 
   * This function should:
   * - Use the prefetch function to fetch data
   * - If the result is successful, return the data
   * - If the result has an error, return null instead of throwing
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
    // TODO: Implement this function using the prefetch function
    // Hint: For optional queries, you'll want to return null if prefetch fails
    
    // This is a placeholder implementation that always returns null on error
    // Replace it with your implementation
    return prefetch(queryKey, queryFn, options).then(result => {
      if (result.type === "error") {
        return null;
      }
      return result.data;
    });
  };

  const dehydrate = () => {
    return reactQueryDehydrate(queryClient);
  };

  return {
    prefetch,
    criticalQuery,
    optionalQuery,
    dehydrate,
  };
};

export type Prefetch = ReturnType<typeof createPrefetch>;