import { NextResponse } from "next/server";

// Placeholder API route for cloud recordings (Stage 2)
export async function GET() {
  return NextResponse.json(
    {
      message: "Cloud recordings API is coming in Stage 2",
      recordings: [],
    },
    { status: 200 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message: "Cloud recordings API is coming in Stage 2",
    },
    { status: 501 }, // Not Implemented
  );
}
