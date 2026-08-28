import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("products");
  return NextResponse.json({ revalidated: true });
}
