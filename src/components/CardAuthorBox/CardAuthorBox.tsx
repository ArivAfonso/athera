import React, { FC } from "react";
import { PostAuthorType } from "@/data/types";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Avatar from "@/components/Avatar/Avatar";
import Link from "next/link";

export interface CardAuthorBoxProps {
  className?: string;
  author: PostAuthorType;
}

const CardAuthorBox: FC<CardAuthorBoxProps> = ({ className = "", author }) => {
  const { displayName, href = "/", avatar, jobName, count } = author;
  return (
    <Link
      href={href}
      className={`nc-CardAuthorBox flex flex-col items-center justify-center text-center px-3 py-5 sm:px-6 sm:py-7 rounded-3xl bg-white dark:bg-neutral-900 ${className}`}
    >
      <Avatar
        sizeClass="w-20 h-20 text-2xl"
        radius="rounded-full"
        imgUrl={avatar}
        userName={displayName}
      />
      <div className="mt-3">
        <h2 className={`text-sm sm:text-base font-medium`}>
          <span className="line-clamp-1">{displayName}</span>
        </h2>
        <span
          className={`block mt-1 text-sm text-neutral-500 dark:text-neutral-400`}
        >
          @{jobName}
        </span>
      </div>
      <div className="py-2 px-4 mt-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center leading-none text-xs font-medium">
        {count} <ArrowRightIcon className="w-5 h-5 text-yellow-600 ml-3" />
      </div>
    </Link>
  );
};

export default CardAuthorBox;
