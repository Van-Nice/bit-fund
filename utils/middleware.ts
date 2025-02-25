// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, AppDataSource } from "./data-source";

export const config = {
  matcher: "/api/:path*",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(request: NextRequest) {
  if (!AppDataSource.isInitialized) {
    await initializeDatabase();
  }
  return NextResponse.next();
}
