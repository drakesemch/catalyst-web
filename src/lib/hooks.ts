"use client";

import { useState, useEffect } from "react";

interface UseMediaQueryOptions {
  mediaQuery: string;
  initialState?: boolean;
}

export const useMediaQuery = ({
  mediaQuery,
  initialState = false,
}: UseMediaQueryOptions): boolean => {
  const [matches, setMatches] = useState(initialState);

  useEffect(() => {
    const media = window.matchMedia(mediaQuery);

    const handleChange = () => setMatches(media.matches);

    media.addEventListener("change", handleChange);

    // Set initial state
    setMatches(media.matches);

    return () => media.removeEventListener("change", handleChange);
  }, [mediaQuery]);

  return matches;
};

export default useMediaQuery;
