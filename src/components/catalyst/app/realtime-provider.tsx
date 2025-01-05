"use client";

import { createContext, useEffect, useState } from "react";
import Ably from "ably";
import { env } from "@/env";
import { api } from "@/trpc/react";

const defaultValue = {
  ably: null,
  channel: null,
} as {
  ably: Ably.Realtime | null;
  channel: Ably.RealtimeChannel | null;
};

export const RealtimeContext = createContext(defaultValue);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  const { data } = api.catalyst.user.get.useQuery();

  useEffect(() => {
    if (!data) return;
    console.log("done");
    const ably = new Ably.Realtime(env.NEXT_PUBLIC_ABLY_READONLY_KEY);
    const channel = ably.channels.get(data.realtimeSecret!);
    setValue({ ably, channel });

    return () => {
      ably.connection.close();
    };
  }, [data]);

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}
