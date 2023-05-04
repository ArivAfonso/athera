"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Tag from "@/components/Tag/Tag";
import SingleAuthor from "./SingleAuthor";
import SingleCommentForm from "./SingleCommentForm";
import SingleCommentLists from "./SingleCommentLists";
import SingleContentDemo from "./SingleContentDemo";
import { DEMO_TAGS } from "@/data/taxonomies";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import PostCardLikeAction from "@/components/PostCardLikeAction/PostCardLikeAction";
import PostCardCommentBtn from "@/components/PostCardCommentBtn/PostCardCommentBtn";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const demoTags = DEMO_TAGS.filter((_, i) => i < 9);

export interface SingleContentProps {}

const SingleContent: FC<SingleContentProps> = ({}) => {
  const endedAnchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLButtonElement>(null);
  //
  const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false);
  //

  const endedAnchorEntry = useIntersectionObserver(endedAnchorRef, {
    threshold: 0,
    root: null,
    rootMargin: "0%",
    freezeOnceVisible: false,
  });

  useEffect(() => {
    const handleProgressIndicator = () => {
      const entryContent = contentRef.current;
      const progressBarContent = progressRef.current;

      if (!entryContent || !progressBarContent) {
        return;
      }

      const totalEntryH = entryContent.offsetTop + entryContent.offsetHeight;
      let winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      let scrolled = (winScroll / totalEntryH) * 100;

      progressBarContent.innerText = scrolled.toFixed(0) + "%";

      if (scrolled >= 100) {
        setIsShowScrollToTop(true);
      } else {
        setIsShowScrollToTop(false);
      }
    };

    const handleProgressIndicatorHeadeEvent = () => {
      window?.requestAnimationFrame(handleProgressIndicator);
    };
    handleProgressIndicator();
    window?.addEventListener("scroll", handleProgressIndicatorHeadeEvent);
    return () => {
      window?.removeEventListener("scroll", handleProgressIndicatorHeadeEvent);
    };
  }, []);

  const showLikeAndCommentSticky =
    !endedAnchorEntry?.intersectionRatio &&
    (endedAnchorEntry?.boundingClientRect.top || 0) > 0;

  return (
    <div className="relative">
      <div className="nc-SingleContent space-y-10">
        {/* ENTRY CONTENT */}
        <div
          id="single-entry-content"
          className="prose lg:prose-lg !max-w-screen-md mx-auto dark:prose-invert"
          ref={contentRef}
        >
          <SingleContentDemo />
        </div>

        {/* TAGS */}
        <div className="max-w-screen-md mx-auto flex flex-wrap">
          {demoTags.map((item) => (
            <Tag hideCount key={item.id} tag={item} className="mr-2 mb-2" />
          ))}
        </div>

        {/* AUTHOR */}
        <div className="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>
        <div className="max-w-screen-md mx-auto ">
          <SingleAuthor />
        </div>

        {/* COMMENT FORM */}
        <div
          id="comments"
          className="scroll-mt-20 max-w-screen-md mx-auto pt-5"
        >
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Responses (10)
          </h3>
          <SingleCommentForm />
        </div>

        {/* COMMENTS LIST */}
        <div className="max-w-screen-md mx-auto">
          <SingleCommentLists />
          <div ref={endedAnchorRef}></div>
        </div>
      </div>
      <div
        className={`sticky mt-8 bottom-8 z-40 justify-center ${
          showLikeAndCommentSticky ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-full ring-1 ring-offset-1 ring-neutral-900/5 p-1.5 flex items-center justify-center space-x-2 text-xs">
          <PostCardLikeAction className="px-3 h-9 text-xs" />
          <div className="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>
          <PostCardCommentBtn
            isATagOnSingle
            className={` flex px-3 h-9 text-xs`}
          />
          <div className="border-l h-4 border-neutral-200 dark:border-neutral-700"></div>

          <button
            className={`w-9 h-9 items-center justify-center bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 rounded-full ${
              isShowScrollToTop ? "flex" : "hidden"
            }`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>

          <button
            ref={progressRef}
            className={`w-9 h-9 items-center justify-center ${
              isShowScrollToTop ? "hidden" : "flex"
            }`}
            title="Go to top"
          >
            %
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleContent;
