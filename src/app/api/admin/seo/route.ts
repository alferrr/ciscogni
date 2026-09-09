import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { syncDB } from "@/lib/sync";
import { getSeoSettings, updateSeoSettings } from "@/lib/seo";

export async function GET(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const settings = await getSeoSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  await syncDB();
  if (!(await isAdminRequest(req)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { title, description, keywords, ogImageUrl } = await req.json();

  if (!title || !description) {
    return NextResponse.json(
      { message: "Title and description are required." },
      { status: 400 },
    );
  }

  const settings = await updateSeoSettings({
    title,
    description,
    keywords,
    ogImageUrl,
  });
  return NextResponse.json(settings);
}
