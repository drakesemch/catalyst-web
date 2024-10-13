import { NextResponse, type NextRequest } from "next/server";
import { verifyAccess, type ApiData } from "@vercel/flags";

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get("Authorization"));
  if (!access) return NextResponse.json(null, { status: 401 });

  return NextResponse.json<ApiData>({
    definitions: {
      notifications: {
        description:
          "Allows ability to show Web Notifications, and on Device Notifications",
        origin: "https://catalyst.bluefla.me/flags#notifications",
        options: [
          { value: true, label: "Enabled" },
          { value: false, label: "Disabled" },
        ],
      },
      friends: {
        description: "Controls whether to and use show friends",
        origin: "https://catalyst.bluefla.me/flags#friends",
        options: [
          { value: true, label: "Enabled" },
          { value: false, label: "Disabled" },
        ],
      },
      tools: {
        description: "Controls whether to and use show tools",
        origin: "https://catalyst.bluefla.me/flags#tools",
        options: [
          { value: true, label: "Enabled" },
          { value: false, label: "Disabled" },
        ],
      },
    },
  });
}
