import React, { FC } from "react";
import Avatar from "@/components/Avatar/Avatar";
import { PostDataType } from "@/data/types";
import Link from "next/link";

export interface PostCardMetaV2Props {
  meta: Pick<PostDataType, "date" | "author" | "title" | "href">;
  hiddenAvatar?: boolean;
  className?: string;
  titleClassName?: string;
  avatarSize?: string;
}

const PostCardMetaV2: FC<PostCardMetaV2Props> = ({
  meta,
  hiddenAvatar = false,
  className = "leading-none text-xs",
  titleClassName = "text-base",
  avatarSize = "h-9 w-9 text-base",
}) => {
  const { date, author, title } = meta;
  return (
    <div
      className={`nc-PostCardMetaV2 inline-flex items-center flex-wrap text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      <div className="relative flex items-center space-x-2">
        {!hiddenAvatar && (
          <Avatar
            radius="rounded-full"
            sizeClass={avatarSize}
            imgUrl={author.avatar}
            userName={author.displayName}
          />
        )}
        <div>
          <h2 className={`block font-semibold ${titleClassName}`}>
            <Link href={meta.href} className="line-clamp-1">
              {title}
            </Link>
          </h2>

          <Link href={author.href} className="flex mt-1.5">
            <span className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
              {author.displayName}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
              ·
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 font-normal">
              {date}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCardMetaV2;
