import { NextApiRequest, NextApiResponse } from "next";

const MAX_RETRIES = 10;
let retryCount = 0;
let resetTimeout: NodeJS.Timeout | null = null;

const resetRetryCount = () => {
  retryCount = 0;
};

// Higher-order function to perform pre-checks
export const withTransactionsConfig = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // Reject all requests that are not GET
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }

    const resetDuration = 5_000; // Reset retry count after 5 sec

    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }

    resetTimeout = setTimeout(resetRetryCount, resetDuration);

    if (retryCount > MAX_RETRIES) {
      res.status(503).json({ message: "Service Unavailable. Please retry." });
      return;
    } else {
      retryCount++;
    }

    // // Simulating failure rate - 30% of the requests will fail
    // const shouldFail = Math.random() < 0.3;

    // if (shouldFail) {
    //   // Simulate a random server error
    //   res.status(500).json({ message: "Fake Internal Server Error" });
    //   return;
    // }

    const { quantity } = req.query;

    if (typeof quantity !== "string") {
      res.status(400).json({ message: "Missing quantity query parameter" });
      return;
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 1 || quantityNum > 10) {
      res.status(400).json({ message: "Quantity must be between 1 and 10" });
      return;
    }

    // If all checks pass, call the original handler
    await handler(req, res);
  };
};
