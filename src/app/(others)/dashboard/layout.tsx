"use client";

import Heading2 from "@/components/Heading/Heading2";
import { Route } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const subPages: { href: Route; pageName: string; emoij: string }[] = [
  {
    href: "/dashboard",
    emoij: "⏳",
    pageName: "Dash board",
  },
  {
    href: "/dashboard/posts",

    emoij: "📕",
    pageName: "Posts",
  },
  {
    href: "/dashboard/edit-profile",

    emoij: "🛠",
    pageName: "Edit profile",
  },
  {
    href: "/dashboard/subscription",
    emoij: "📃",
    pageName: "Subscription",
  },
  {
    href: "/dashboard/billing-address",

    emoij: "✈",
    pageName: "Billing address",
  },
  {
    href: "/dashboard/submit-post",

    emoij: "✍",
    pageName: "Submit post",
  },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className={`nc-PageDashboard`}>
      <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-24">
        <Heading2 emoji="">Dash board</Heading2>
        <span className="block text-sm mt-2 text-neutral-700 sm:text-base dark:text-neutral-200">
          View your dashboard, manage your posts, subscription and edit and
          profile.
        </span>
      </header>

      <div className="flex flex-col space-y-8 xl:space-y-0 xl:flex-row">
        {/* SIDEBAR */}

        <div className="flex-shrink-0 max-w-xl xl:w-80 xl:pr-8">
          <ul className="text-base space-y-1 text-neutral-700 dark:text-neutral-400">
            {subPages.map(({ href, pageName, emoij }, index) => {
              return (
                <li key={index}>
                  <Link
                    className={`px-6 py-3 font-medium rounded-full flex items-center ${
                      pathname === href
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        : "hover:text-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    }`}
                    href={href}
                  >
                    <span className="w-8 mr-2 text-lg">{emoij}</span>
                    <span> {pageName}</span>
                  </Link>
                </li>
              );
            })}

            <li className=" border-t border-neutral-200 dark:border-neutral-700" />
            <li>
              <Link
                className={`flex items-center px-6 py-3 font-medium text-red-500`}
                href={"/"}
              >
                <span className="w-8 mr-2 text-lg">💡</span>
                Sign out
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-neutral-500 dark:border-neutral-300 md:hidden"></div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
