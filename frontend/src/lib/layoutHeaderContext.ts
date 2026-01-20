  import type { Snippet } from "svelte";
  import { createContext } from "svelte";

  export type HeaderContentType = Snippet | null;
  export interface HeaderContext{
    set: (headerContent: HeaderContentType) => void;
  }
  export const [getHeaderContext, setHeaderContext] = createContext<HeaderContext>();
