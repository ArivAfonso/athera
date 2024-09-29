import type { Route as NextRouter } from "next";
import { ComponentType } from "react";

// Get ready to update to nextjs version 13.2 with X typedRoutes
export type Route<T = string> = NextRouter<string>;
export type PathName = Route<string>;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<Object>;
}
