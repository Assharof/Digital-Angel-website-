import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

// Server-only client using the service role key — bypasses storage RLS so
// authenticated admin uploads always succeed. NEVER expose this key to the
// browser; it must only ever be read here, in a server route.
const BUCKET = "publication-images";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });
  }
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File must be an image (jpg, png, webp, gif)" }, { status: 400 });
  }

  const maxSizeBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxSizeBytes) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeBase = file.name
    .replace(`.${ext}`, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const filename = `${Date.now()}-${safeBase || "upload"}.${ext}`;

  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl });
}
