import type { NextApiRequest, NextApiResponse } from "next";

// A deterministic slow dependency for the timeout lesson. No external API needed.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  res.status(200).json({
    message: "Success",
    data: {
      totalAmount: 55, domesticCount: 3, internationalCount: 7,
      amountsByCardType: { MasterCard: 17, Discover: 2, Visa: 20, JCB: 16 },
    },
  });
}
