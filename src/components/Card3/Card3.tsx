import React, { FC } from "react";
import NcImage from "@/components/NcImage/NcImage";
import PostCardMeta from "@/components/PostCardMeta/PostCardMeta";
import PostCardSaveAction from "@/components/PostCardSaveAction/PostCardSaveAction";
import { PostDataType } from "@/data/types";
import PostCardLikeAndComment from "@/components/PostCardLikeAndComment/PostCardLikeAndComment";
import CategoryBadgeList from "@/components/CategoryBadgeList/CategoryBadgeList";
import PostTypeFeaturedIcon from "@/components/PostTypeFeaturedIcon/PostTypeFeaturedIcon";
import Link from "next/link";

export interface Card3Props {
  className?: string;
  post: PostDataType;
}

const Card3: FC<Card3Props> = ({ className = "h-full", post }) => {
  const {
    title,
    href,
    readingTime,
    featuredImage,
    desc,
    categories,
    postType,
  } = post;

  return (
    <div
      className={`nc-Card3 relative flex flex-row items-center group ${className}`}
    >
      <div className="flex flex-col flex-grow">
        <div className="space-y-3.5">
          <CategoryBadgeList categories={categories} />
          <Link href={href} className="block">
            <h2
              className={`nc-card-title block font-medium sm:font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base xl:text-lg`}
            >
              <span className="line-clamp-2" title={title}>
                {title}
              </span>
            </h2>
            <div className="hidden sm:block sm:mt-2">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2">
                {desc}
              </span>
            </div>
          </Link>

          <PostCardMeta meta={{ ...post }} />
        </div>
        <div className="mt-5 flex items-center flex-wrap justify-between">
          <PostCardLikeAndComment />
          <PostCardSaveAction readingTime={readingTime} />
        </div>
      </div>

      <div
        className={`block flex-shrink-0 w-24 sm:w-36 md:w-44 xl:w-56 ml-3 sm:ml-6 rounded-3xl overflow-hidden z-0 mb-5 sm:mb-0`}
      >
        <Link
          href={href}
          className="block w-full h-0 aspect-h-1 aspect-w-1 relative"
        >
          <NcImage
            containerClassName="absolute inset-0"
            src={featuredImage}
            fill
            alt={title}
          />
          <span>
            <PostTypeFeaturedIcon
              className="absolute left-2 bottom-2"
              postType={postType}
              wrapSize="w-8 h-8"
              iconSize="w-4 h-4"
            />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Card3;
