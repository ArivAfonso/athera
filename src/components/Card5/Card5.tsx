import React, { FC } from "react";
import { PostDataType } from "@/data/types";
import CardAuthor2 from "@/components/CardAuthor2/CardAuthor2";
import CategoryBadgeList from "@/components/CategoryBadgeList/CategoryBadgeList";
import Link from "next/link";

export interface Card5Props {
  className?: string;
  post: PostDataType;
}

const Card5: FC<Card5Props> = ({ className = "", post }) => {
  const { author, title, href, id, date, categories, readingTime } = post;
  return (
    <div
      className={`nc-Card5 relative p-5 group border border-neutral-200 hover:shadow-lg transition-shadow dark:border-neutral-700 rounded-3xl bg-white dark:bg-neutral-900 ${className}`}
    >
      <Link href={href} className="absolute inset-0 rounded-lg"></Link>

      <div className="flex flex-col">
        <CategoryBadgeList categories={categories} />
        <h2
          className="block text-base font-semibold text-neutral-800 dark:text-neutral-300 my-4"
          title={title}
        >
          <Link href={href} className="line-clamp-2" title={title}>
            {title}
          </Link>
        </h2>
        <CardAuthor2
          className="relative mt-auto"
          readingTime={readingTime}
          author={author}
          date={date}
        />
      </div>
    </div>
  );
};

export default Card5;
