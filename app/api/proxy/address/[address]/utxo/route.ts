// /app/api/proxy/address/[address]/utxo/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { address: string } }) {
  const { address } = params;
  try {
    // Use a Bitcoin testnet API (e.g., Blockstream)
    const response = await fetch(`https://blockstream.info/testnet/api/address/${address}/utxo`);
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch UTXOs: ${response.status}` }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}