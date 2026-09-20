// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TransactionDashboardData } from "@/types";
import { withTransactionsConfig } from "@/utils/wrappers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | TransactionDashboardData
  | {
    message: string;
  };


async function handler(req: NextApiRequest, res: NextApiResponse<{
  message: string;
  data: Data | null;
}>) {
  try {

    const response = await fetch(
      `http://localhost:3001/api/transactions?quantity=${req.query.quantity}`
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    const mappedData = {
      "totalAmount": 55,
      "domesticCount": 3,
      "internationalCount": 7,
      "amountsByCardType": {
        "MasterCard": 17,
        "Discover Card": 2,
        "Visa": 20,
        "Visa Retired": 6,
        "JCB": 10
      }
    }
    res.status(200).json({ message: "Success", data: mappedData });
  } catch (error: unknown) {
    let message = "Internal Server Error";

    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message, data: null });
  }
}

export default withTransactionsConfig(handler);

