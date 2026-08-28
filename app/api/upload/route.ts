import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${crypto.randomUUID()}.${extension}`;
    const fileNode = bucket.file(filename);

    await fileNode.save(buffer, {
      contentType: file.type,
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticatedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { url } = (await request.json()) as { url?: string };
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET!;
    const prefix = `https://storage.googleapis.com/${bucketName}/`;
    if (!url?.startsWith(prefix)) {
      return NextResponse.json({ error: "Not an object in this bucket" }, { status: 400 });
    }

    const objectName = decodeURIComponent(url.slice(prefix.length));
    // ignoreNotFound keeps repeated removals idempotent instead of erroring.
    await bucket.file(objectName).delete({ ignoreNotFound: true });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
