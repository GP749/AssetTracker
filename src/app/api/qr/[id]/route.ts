import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const base = (process.env.APP_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const target = `${base}/tools/${id}`;
  const png = await QRCode.toBuffer(target, {
    type: "png",
    width: 512,
    margin: 1,
    errorCorrectionLevel: "M",
  });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
