import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch("http://localhost:3001/api/analytics");
    
    if (!response.ok) {
      throw new Error(`Analytics API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.error("Analytics API Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
} 