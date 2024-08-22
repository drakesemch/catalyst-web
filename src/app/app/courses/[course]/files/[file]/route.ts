import { api } from "@/trpc/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const canvasDetails = await api.catalyst.user.canvas.details();

  const fileDetails = (await (
    await fetch(
      new URL(
        new URL(req.url).pathname.replace("/app/", "/api/v1/"),
        canvasDetails.url,
      ),
      {
        headers: {
          Authorization: `Bearer ${canvasDetails.token ?? ""}`,
        },
      },
    )
  ).json()) as { url: string };

  return new Response(
    await (
      await fetch(fileDetails.url, {
        headers: {
          Authorization: `Bearer ${canvasDetails.token ?? ""}`,
        },
      })
    ).blob(),
  );
}
