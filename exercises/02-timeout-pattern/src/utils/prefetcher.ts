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
 * Creates a promise that REJECTS after the specified time with a timeout error.
 * @param ms Time in milliseconds after which the promise will reject
 */
// 🦆 Task 1: implement this helper.
// const timeout = (ms: number) => new Promise<never>((_, reject) => ...)
// 🦉 It must `reject`, not `resolve`. Promise.race propagates the first settlement —
// a rejected promise is what makes the timeout look like a thrown error to the caller.
// 💯 Stretch: pair this with an AbortController so the losing fetch is actually cancelled
// instead of running to completion in the background.

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

      // 🦆 Task 2: race the fetch against your `timeout(timeoutDuration)` helper.
      // Replace the line below with:
      //   const data = (await Promise.race([fetchPromise, timeout(timeoutDuration)])) as TData;
      // 🦉 The `catch` below already handles the timeout error — `captureException(error)`
      // will fire when the timeout wins, with an Error containing your timeout message.
      const data = await fetchPromise as TData;

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
