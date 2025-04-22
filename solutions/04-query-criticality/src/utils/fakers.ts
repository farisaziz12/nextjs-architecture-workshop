import { Transaction } from "@/types";
import {
  apiPayloadStructure,
  objectToQueryString,
  transformToNestedTransactionStructure,
} from "./api";

export const getFakeData = async (
  quantity?: number,
  signal?: AbortSignal
): Promise<Transaction[]> => {

  const responses = await Promise.allSettled(
    Array.from({ length: quantity ?? 5 }, (_, i) =>
      fetch(
        `https://fakerapi.it/api/v1/custom?_quantity=10&${objectToQueryString(
          apiPayloadStructure
        )}`,
        { signal }
      ).then((res) => res.json())
    )
  );

  // Check if any of the promises were rejected and throw an error
  const rejectedResponse = responses.find(
    (response) => response.status === "rejected"
  ) as PromiseRejectedResult | undefined;

  if (rejectedResponse && !(rejectedResponse.reason instanceof DOMException)) {
    console.error(rejectedResponse.reason);
    throw new Error(
      `One or more requests failed with reason: ${rejectedResponse.reason}`
    );
  }

  // Filter out the successful responses
  const successfulResponses = responses.filter(
    (
      response
    ): response is PromiseFulfilledResult<{ data: any; status: string; code: number }> =>
      response.status === "fulfilled"
  );

  // check if one of the fulfilled requests has a value with an error object
  const failedResponse = successfulResponses.find(
    (response) => response.value.code !== 200
  );

  if (failedResponse) {
    throw new Error(
      `One or more requests failed with status: ${failedResponse.value.status}`
    );
  }

  // Get the data from the successful responses
  const successfulResponsesData = successfulResponses.map(
    (response) => response.value.data
  );
  // Flatten the data
  const flattenedData = successfulResponsesData.flatMap((data) =>
    data.map(transformToNestedTransactionStructure)
  );

  // Return the data
  return flattenedData;
};
