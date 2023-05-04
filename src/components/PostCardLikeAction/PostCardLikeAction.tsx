"use client";

import React, { FC, useState } from "react";
import convertNumbThousand from "@/utils/convertNumbThousand";

export interface PostCardLikeActionProps {
  className?: string;
  likeCount?: number;
  liked?: boolean;
}

const PostCardLikeAction: FC<PostCardLikeActionProps> = ({
  className = "px-3 h-8 text-xs",
  likeCount = 34,
  liked = false,
}) => {
  const [isLiked, setisLiked] = useState(liked);

  return (
    <button
      className={`nc-PostCardLikeAction relative min-w-[68px] flex items-center rounded-full leading-none group transition-colors ${className} ${
        isLiked
          ? "text-rose-600 bg-rose-50 dark:bg-rose-100"
          : "text-neutral-700 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-100 hover:text-rose-600 dark:hover:text-rose-500"
      }`}
      onClick={() => setisLiked(!isLiked)}
      title="Liked"
    >
      <svg
        width="24"
        height="24"
        fill={isLiked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
          clipRule="evenodd"
        ></path>
      </svg>

      {likeCount && (
        <span
          className={`ml-1 ${
            isLiked ? "text-rose-600" : "text-neutral-900 dark:text-neutral-200"
          }`}
        >
          {convertNumbThousand(isLiked ? likeCount + 1 : likeCount)}
        </span>
      )}
    </button>
  );
};

export default PostCardLikeAction;
