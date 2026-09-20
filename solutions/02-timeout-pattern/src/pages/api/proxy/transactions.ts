// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction, TransactionDashboardData } from "@/types";
import { withTransactionsConfig } from "@/utils/wrappers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | TransactionDashboardData
  | {
    message: string;
  };

const transactionDataMapper = (data: Transaction[]): TransactionDashboardData => {
  return data.reduce(
    (acc, transaction) => {
      const newTotalAmount = acc.totalAmount + transaction.amount;
      const newAmountsByCardType = {
        ...acc.amountsByCardType,
        [transaction.cardType]:
          (acc.amountsByCardType[transaction.cardType] || 0) + transaction.amount,
      };

      return {
        totalAmount: newTotalAmount,
        domesticCount: transaction.isDomestic ? acc.domesticCount + 1 : acc.domesticCount,
        internationalCount: !transaction.isDomestic
          ? acc.internationalCount + 1
          : acc.internationalCount,
        amountsByCardType: newAmountsByCardType,
      };
    },
    {
      totalAmount: 0,
      domesticCount: 0,
      internationalCount: 0,
      amountsByCardType: {} as Record<string, number>,
    }
  );
};

// Helper function to create an artificial delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function handler(req: NextApiRequest, res: NextApiResponse<{
  message: string;
  data: Data | null;
}>) {
  try {

    // Simulate a delay of 2 seconds to test timeout functionality
    await delay(2000);

    const response = await fetch(
      `http://localhost:3000/api/transactions?quantity=${req.query.quantity}`
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
