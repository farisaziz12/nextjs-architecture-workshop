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

// 🦉 The `timeout` here RESOLVES with null after `ms` (not rejects). Combined with
// Promise.race below, a timed-out fetch silently produces `data = null` — fine for
// this exercise, but in production you'd usually want it to reject so the wrappers
// can distinguish "slow upstream" from "upstream returned null".
const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

/**
 * Critical vs. optional query helpers.
 *
 * @example
 * const prefetch = createPrefetch(queryClient)
 * // Throws to the error boundary if it fails:
 * await prefetch.criticalQuery('transactions', () => fetch(...))
 * // Returns null if it fails (caller renders without it):
 * const result = await prefetch.optionalQuery('analytics', () => fetch(...))
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
    // 🦆 Task 1: wrap everything in this function body in try/catch.
    // On success: keep returning `{ type: "data", data }`.
    // On error:
    //   1. call `captureException(error)` (already imported).
    //   2. return `{ type: "error", error: error instanceof Error ? error : new Error("Request failed.") }`.
    // 🦉 Once Task 1 is done, the `criticalQuery` / `optionalQuery` wrappers below
    // (which already switch on `result.type`) start behaving as advertised. Without
    // Task 1 the wrappers never see an error result because the throw escapes first.
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
  };

  /**
   * Critical query: throws on failure so an error boundary upstream catches it.
   * Use for data the page can't render meaningfully without.
   */
  // 🦉 This wrapper is already correctly shaped — it switches on `result.type`.
  // It only behaves correctly once Task 1 above is done (prefetch must return an
  // error result instead of throwing). Read it, but you don't need to edit it.
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
    return prefetch(queryKey, queryFn, options).then(result => {
      if (result.type === "error") {
        throw result.error;
      }
      return result.data;
    });
  };

  /**
   * Optional query: returns null on failure so the page can render without this data.
   * Use for sidebars, analytics widgets, anything non-essential.
   */
  // 🦉 Same shape as criticalQuery — already correct, depends on Task 1.
  // 💯 Stretch: differentiate the Sentry tag inside `prefetch` so optional failures
  // can be alerted differently (or not at all) from critical ones.
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