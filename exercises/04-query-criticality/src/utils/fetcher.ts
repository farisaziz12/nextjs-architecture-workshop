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

const mockFeatureFlags = {
    FEATURE_ONE: true,
    FEATURE_TWO: false,
    FEATURE_THREE: true,
}

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
};

export const apiFetcher = async ({ url, errorTag }: ApiFetcher) => {
  try {
    const response = await fetch(url);

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
    Sentry.setContext('Feature Flags', mockFeatureFlags)
    Sentry.captureException(error);

    return Promise.reject(error);
  }
};
