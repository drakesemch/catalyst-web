"use client";

import { api } from "@/trpc/react";
import { H } from "highlight.run";
import { useEffect } from "react";

export function HighlightProvider() {
  const { data, error: _ } = api.catalyst.user.get.useQuery();

  useEffect(() => {
    if (!data) return;
    H.identify(data.id, {
      id: data.id,
      name: data.name ?? "(No name)",
      email: data.email
    });
  }, [data]);

  return (<></>);
}