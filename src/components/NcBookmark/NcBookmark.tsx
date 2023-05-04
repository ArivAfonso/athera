"use client";

import React, { FC, useState } from "react";

export interface NcBookmarkProps {
  containerClassName?: string;
  bookmarked?: boolean;
}

const NcBookmark: FC<NcBookmarkProps> = ({
  containerClassName = "h-8 w-8 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700",
  bookmarked = false,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  return (
    <button
      className={`nc-NcBookmark relative rounded-full flex items-center justify-center ${containerClassName}`}
      title="Save to reading list"
      onClick={() => setIsBookmarked(!isBookmarked)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        className="w-[18px] h-[18px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
};

export default NcBookmark;
