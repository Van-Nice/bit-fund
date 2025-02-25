// /app/api/proxy/address/[address]/sbtc-balance/route.ts
import { NextResponse } from "next/server";

interface BalanceResponse {
  fungible_tokens: {
    [key: string]: {
      balance: string;
    };
  };
}

export async function GET(request: Request, { params }: { params: { address: string } }) {
  const { address } = params;
  const STACKS_API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || "http://localhost:20443";
  const SBTC_CONTRACT = process.env.NEXT_PUBLIC_SBTC_CONTRACT || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc::sbtc";

  const url = `${STACKS_API_URL}/extended/v1/address/${address}/balances`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.status}`);
    }
    const data: BalanceResponse = await response.json();
    const sbtcBalance = parseInt(data.fungible_tokens[SBTC_CONTRACT]?.balance || "0", 10);
    const formattedBalance = sbtcBalance / 1e8; // Assuming 8 decimals for sBTC
    return NextResponse.json({ balance: formattedBalance });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}