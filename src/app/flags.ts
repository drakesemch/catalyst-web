import { unstable_flag as flag } from "@vercel/flags/next";

export const expFriends = flag({
  key: "friends",
  decide: () => true,
});
