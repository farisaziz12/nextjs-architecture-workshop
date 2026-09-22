import * as Sentry from "@sentry/nextjs";

type FetchErrorMeta = {
  name: string;
  status: number;
  path: string;
  json: {
    message: string;
    title?: string;
  };
};

export class FetchError extends Error {
  public readonly metaData: FetchErrorMeta;
  public readonly title: string;

  constructor(metaData: FetchErrorMeta) {
    const errorMessage =
      metaData?.json?.message || "An error occurred while fetching data";
    const errorTitle = metaData?.json?.title || "FetchError";
    const errorName = metaData?.name;

    super(errorMessage || errorTitle);
    this.name = errorName ?? "FetchError";
    this.title = errorTitle;
    this.metaData = metaData;
  }
}

type ApiFetcher = {
  url: string;
  errorTag: `${string}Error`;
  signal?: AbortSignal;
  diagnostics?: { feature: string; release: string; analyticsEnabled: boolean };
};

export const apiFetcher = async ({ url, errorTag, signal, diagnostics }: ApiFetcher) => {
  try {
    const response = await fetch(url, { signal });

    const json = await response.json();

    if (!response.ok) {
      throw new FetchError({
        name: errorTag,
        status: response.status,
        path: url,
        json,
      });
    }

    return json;
  } catch (error) {
    // Disabling the feature is intentional cancellation, not a new incident.
    if (!signal?.aborted) {
      Sentry.withScope(scope => {
        scope.setTag("errorTag", errorTag);
        if (diagnostics) {
          scope.setTag("feature", diagnostics.feature);
          scope.setTag("demo_release", diagnostics.release);
          scope.setContext("Feature Flags", { analyticsEnabled: diagnostics.analyticsEnabled });
        }
        Sentry.captureException(error);
      });
    }

    return Promise.reject(error);
  }
};
