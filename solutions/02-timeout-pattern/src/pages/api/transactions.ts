// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Transaction } from "@/types";
import { getFakeData } from "@/utils/fakers";
import { withTransactionsConfig } from "@/utils/wrappers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      data: Transaction[];
      total: number;
    }
  | {
      message: string;
    };

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const data = await getFakeData(Number(req.query.quantity));

    res.status(200).json({ message: "Success", data });
  } catch (error: unknown) {
    let message = "Internal Server Error";

    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
}

export default withTransactionsConfig(handler);
