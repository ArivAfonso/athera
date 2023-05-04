"use client";

import LoadingVideo from "@/components/LoadingVideo/LoadingVideo";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import React, { FC, useEffect, useState } from "react";
import ReactPlayer from "react-player";

export interface MediaVideoProps {
  videoUrl: string;
  isHover: boolean;
}

const MediaVideo: FC<MediaVideoProps> = ({ videoUrl, isHover }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showDescUnmuted, setShowDescUnmuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  let __timeOut: NodeJS.Timeout | null = null;

  useEffect(() => {
    return () => {
      __timeOut && clearTimeout(__timeOut);
    };
  }, [__timeOut]);

  return (
    <div className="nc-MediaVideo">
      <ReactPlayer
        url={videoUrl}
        muted={isMuted}
        playing={isHover}
        style={{
          opacity: isPlaying ? 1 : 0,
        }}
        className={`absolute bg-neutral-900 inset-0 transition-opacity`}
        width="100%"
        height="100%"
        onStart={() => {
          setIsPlaying(true);
          __timeOut && clearTimeout(__timeOut);
          __timeOut = setTimeout(() => {
            setShowDescUnmuted(false);
          }, 2500);
        }}
      />
      <div
        className={`${
          isPlaying ? "opacity-0" : "opacity-100"
        } absolute bg-neutral-900/30 flex items-center justify-center inset-0 transition-opacity`}
      >
        <LoadingVideo />
      </div>
      {isPlaying && (
        <div
          className={`absolute z-20 bottom-2 left-2 h-6 rounded-full bg-black bg-opacity-70 text-white flex items-center justify-center text-sm transform transition-transform ${
            showDescUnmuted ? "pl-[6px] pr-2" : "w-6 hover:scale-125"
          }`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <>
              <SpeakerXMarkIcon className="w-3.5 h-3.5" />
              {showDescUnmuted && (
                <span className="ml-1 inline-block text-[9px]">
                  Click here to unmute
                </span>
              )}
            </>
          ) : (
            <SpeakerWaveIcon className="w-3.5 h-3.5" />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaVideo;
