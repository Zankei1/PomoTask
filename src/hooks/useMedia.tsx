import { useEffect, useState } from "react";
import { isBrowser } from "../utils/isBrowser";

function getInitialState(query: string, defaultState?: boolean) {
  if (defaultState !== undefined) {
    return defaultState;
  }

  if (!isBrowser) {
    return window.matchMedia(query).matches;
  }

  return false;
}

export function useMedia(query: string, defaultState?: boolean) {
  const [state, setState] = useState(getInitialState(query, defaultState));

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);

    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addEventListener("change", () => {
      onChange();
    });
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeEventListener("change", () => {
        onChange();
      });
    };
  }, [query]);

  return state;
}
