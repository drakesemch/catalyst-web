import { unstable_flag as flag } from "@vercel/flags/next";

export const expNotifications = flag({
  key: "notifications",
  decide: () => false,
});

export const expFriends = flag({
  key: "friends",
  decide: () => false,
});

export const expTools = flag({
  key: "tools",
  decide: () => false,
});
