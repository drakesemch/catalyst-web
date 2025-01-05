// import "server-only";

import Ably from "ably";
import { env } from "@/env";

export async function send({
  channelId,
  message: { name, data },
}: {
  channelId: string;
  message: {
    name: string;
    data: unknown;
  };
}) {
  const ably = new Ably.Rest(env.ABLY_PUBLISH_KEY);
  const channel = ably.channels.get(channelId);
  await channel.publish(name, data);
}
