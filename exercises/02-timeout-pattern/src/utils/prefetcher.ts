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

/**
 * Creates a promise that resolves after the specified time with a timeout error
 * @param ms Time in milliseconds after which the promise will resolve
 * @returns A promise that resolves with a timeout error after the specified time
 */
const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

/**
 * Provides basic prefetching mechanism
 * @example
 * const queryClient = new QueryClient()
 * const prefetcher = createPrefetch(queryClient)
 *
 * const result = await prefetcher.prefetch('MyQuery', () => fetch(..))
 * if (result.type === "data") {
 *   // Handle success
 * } else {
 *   // Handle error
 * }
 */
export const createPrefetch = (queryClient: QueryClient, timeoutDuration = 5000) => {
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
    try {
      // We are using `fetchQuery` instead of `prefetchQuery` because
      // `prefetchQuery` swallows the error if thrown, so even it fails
      // it won't throw. We need the error.
      const fetchPromise = queryClient.fetchQuery({
        queryKey,
        queryFn,
        ...options,
      });

      // Implement timeout pattern using Promise.race
      // If the fetchPromise resolves before the timeout, we'll get the data
      // If the timeout resolves first, it will throw an error that we'll catch
      const data = await Promise.race([
        fetchPromise,
        createTimeout(timeoutDuration)
      ]) as TData;

      return {
        type: "data",
        data,
      };
    } catch (error) {
      // For every failed prefetch we want to capture the exception
      // and send to Sentry.
      captureException(error);

      return {
        type: "error",
        error: error instanceof Error ? error : new Error(`Request failed.`),
      };
    }
  };

  const dehydrate = () => {
    return reactQueryDehydrate(queryClient);
  };

  return {
    prefetch,
    dehydrate,
  };
};

export type Prefetch = ReturnType<typeof createPrefetch>;
