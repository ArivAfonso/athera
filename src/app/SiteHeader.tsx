"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import HeaderLogged from "@/components/Header/HeaderLogged";
import Header from "@/components/Header/Header";
import Header2 from "@/components/Header/Header2";

const SiteHeader = () => {
  let pathname = usePathname();

  const headerComponent = useMemo(() => {
    let HeadComponent = HeaderLogged;

    switch (pathname) {
      case "/home-2":
        HeadComponent = Header;
        break;
      case "/home-3":
        HeadComponent = Header2;
        break;

      default:
        break;
    }

    return <HeadComponent />;
  }, [pathname]);

  return <>{headerComponent}</>;
};

export default SiteHeader;
