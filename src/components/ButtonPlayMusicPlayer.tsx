"use client";

// ** Tat ca cac component nao goi truc tiep ButtonPlayMusicPlayer thi can phai co use client

import React, { FC, ReactNode } from "react";
import iconPlaying from "@/images/icon-playing.gif";
import PostTypeFeaturedIcon from "@/components/PostTypeFeaturedIcon/PostTypeFeaturedIcon";
import { PostDataType } from "@/data/types";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import Image from "next/image";

export interface ButtonPlayMusicPlayerProps {
  className?: string;
  post: PostDataType;
  renderChildren?: (playing: boolean) => ReactNode;
  renderDefaultBtn?: () => ReactNode;
  renderPlayingBtn?: () => ReactNode;
}

// ** Tat ca cac component nao goi truc tiep ButtonPlayMusicPlayer thi can phai co use client **

const ButtonPlayMusicPlayer: FC<ButtonPlayMusicPlayerProps> = ({
  className = "",
  post,
  renderChildren,
  renderDefaultBtn,
  renderPlayingBtn,
}) => {
  const {
    postData: currentMediaPostData,
    setPostData,
    setPlaying,
    playing,
  } = useMusicPlayer();

  // STATE
  const handleClickNewAudio = () => {
    setPostData(post);
    setPlaying(true);
  };

  const handleClickButton = () => {
    // IF NOT EXIST MEDIA
    if (
      !currentMediaPostData ||
      currentMediaPostData.id !== post.id ||
      currentMediaPostData.audioUrl !== post.audioUrl
    ) {
      return handleClickNewAudio();
    }

    setPlaying(!playing);
  };

  const _renderDefaultBtn = () => {
    if (renderDefaultBtn) {
      return renderDefaultBtn();
    }
    return (
      <PostTypeFeaturedIcon
        className="z-20 hover:scale-105 transform cursor-pointer transition-transform"
        postType="audio"
      />
    );
  };

  const _renderPlayingBtn = () => {
    // RENDER DEFAULT IF IT NOT CURRENT
    if (currentMediaPostData?.id !== post.id) {
      return _renderDefaultBtn();
    }

    // RENDER WHEN IS CURRENT
    if (renderPlayingBtn) {
      return renderPlayingBtn();
    }

    return (
      <span className="z-10 bg-neutral-900 bg-opacity-60 rounded-full flex  items-center justify-center text-xl text-white border border-white w-11 h-11 cursor-pointer">
        <Image className="w-5" src={iconPlaying} alt="paused" />
      </span>
    );
  };

  return (
    <div
      className={`nc-ButtonPlayMusicPlayer select-none ${className}`}
      onClick={handleClickButton}
    >
      {renderChildren ? (
        renderChildren(playing)
      ) : (
        <>{playing ? _renderPlayingBtn() : _renderDefaultBtn()}</>
      )}
    </div>
  );
};

export default ButtonPlayMusicPlayer;
