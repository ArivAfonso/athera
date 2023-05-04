"use client";

import React from "react";
import Badge from "@/components/Badge/Badge";
import iconPlaying from "@/images/icon-playing.gif";
import featuredImageDemo from "@/images/podcast.jpg";
import Image from "next/image";
import ButtonPlayMusicPlayer from "@/components/ButtonPlayMusicPlayer";
import { DEMO_POSTS_AUDIO } from "@/data/posts";
import SingleTitle from "@/app/(singles)/SingleTitle";
import SingleMetaAction2 from "@/app/(singles)/SingleMetaAction2";

const PageSingleAudio = ({}) => {
  const renderIcon = (playing: boolean) => {
    if (playing) {
      return <Image className="w-7" src={iconPlaying} alt="" />;
    }

    return (
      <svg className="w-11 h-11" fill="currentColor" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
        ></path>
      </svg>
    );
  };

  const renderButtonPlay = (playing: boolean) => {
    return (
      <div
        className={`aspect-w-1 aspect-h-1 rounded-full overflow-hidden z-10 shadow-2xl group cursor-pointer`}
      >
        <Image
          className={`w-full h-full object-cover transition-transform z-0 nc-animation-spin rounded-full ${
            playing ? "playing" : ""
          }`}
          src={featuredImageDemo}
          alt="audio"
        />

        <div className="bg-neutral-900 bg-blend-multiply bg-opacity-75 rounded-full"></div>
        <div className="flex items-center justify-center">
          <div className="text-white bg-black bg-blend-multiply bg-opacity-50 w-20 h-20 border-2 border-neutral-300 rounded-full flex items-center justify-center ">
            {renderIcon(playing)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`relative pt-8 lg:pt-16`}>
        {/* Overlay */}
        <div className="bg-primary-50 dark:bg-neutral-800 absolute top-0 inset-x-0 h-60 w-full"></div>

        {/* SINGLE_AUDIO HEADER */}
        <header className="relative container ">
          <div className="bg-white dark:bg-neutral-900 shadow-2xl px-5 py-7 md:p-11 rounded-2xl md:rounded-[40px] flex flex-col sm:flex-row items-center justify-center space-y-10 sm:space-y-0 sm:space-x-11">
            <div className="w-1/2 sm:w-1/4 flex-shrink-0">
              <ButtonPlayMusicPlayer
                renderChildren={renderButtonPlay}
                post={DEMO_POSTS_AUDIO[1]}
              />
            </div>
            <div className="flex flex-col space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div>
                  <Badge name="S1 EP. 128" />
                </div>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Adventures in DevOps
                  <span className="mx-2">·</span>
                  Jul 22
                </span>
              </div>
              <SingleTitle title={"Programming Languages"} />
              <span className="hidden lg:block text-lg text-neutral-500 dark:text-neutral-400">
                We’re an online magazine dedicated to covering the best in
                international product design. We started as a little blog back
                in 2002 covering student work and over time
              </span>
              <SingleMetaAction2 />
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default PageSingleAudio;
