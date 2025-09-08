import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username } = await req.json();

  const token = `fake-signup-token-${username}-${Date.now()}`;

  return NextResponse.json({ token });
}
