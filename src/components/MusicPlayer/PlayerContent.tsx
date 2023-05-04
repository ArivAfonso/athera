import React, { FC } from "react";
import NcImage from "@/components/NcImage/NcImage";
import { Transition } from "@/app/headlessui";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import Link from "next/link";
import PostCardLikeAction from "../PostCardLikeAction/PostCardLikeAction";
import NcBookmark from "../NcBookmark/NcBookmark";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export interface PlayerContentProps {
  isError: boolean;
  handleSeekMouseUp: (
    e:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.TouchEvent<HTMLInputElement>
  ) => void;
  handleSeekMouseDown: (
    e:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.TouchEvent<HTMLInputElement>
  ) => void;
  handleSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolumeChange: (e: number) => void;
  handleSetPlaybackRate: (e: 1 | 1.5 | 2) => void;
  handleSetMuted: (e: boolean) => void;
  handleClickBackwards10Sec: () => void;
  handleClickForwards15Sec: () => void;
}

const PlayerContent: FC<PlayerContentProps> = ({
  isError,
  handleSeekMouseUp,
  handleSeekMouseDown,
  handleSeekChange,
  handleVolumeChange,
  handleSetPlaybackRate,
  handleSetMuted,
  handleClickBackwards10Sec,
  handleClickForwards15Sec,
}) => {
  //
  const {
    duration,
    loaded,
    muted,
    playbackRate,
    played,
    playing,
    setDuration,
    setLoaded,
    setMuted,
    setPlayed,
    setPlaying,
    setVolume,
    setplaybackRate,
    volume,
    postData: post,
    setPostData,
    playedSeconds,
    setPlayedSeconds,
    loadedSeconds,
    setLoadedSeconds,
  } = useMusicPlayer();
  //

  const [isShowContentOnMobile, setIsShowContentOnMobile] =
    React.useState(false);

  //

  //

  const getConvertTime = (sec: number) => {
    let minutes = Math.floor(sec / 60);
    let seconds = `${sec - minutes * 60}`;

    if (Number(seconds) < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  };

  const handleClickToggle = () => {
    setPlaying(!playing);
  };

  const handleClickClose = () => {
    setPlaying(false);
    setPostData(undefined);
  };

  const renderLeft = () => {
    const {
      href = "/",
      featuredImage = "",
      categories = [],
      title = "",
    } = post || {};
    return (
      <div className="mr-2 flex items-center flex-grow lg:flex-shrink-0 lg:basis-52 overflow-hidden">
        <Link
          href={href}
          className="relative h-14 sm:h-16 flex items-center space-x-2 sm:space-x-3 pl-12 overflow-hidden"
        >
          <NcImage
            alt={title}
            fill
            sizes="3rem"
            containerClassName={`absolute left-0 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform nc-animation-spin rounded-full ${
              playing ? "playing" : ""
            }`}
            src={featuredImage}
            className="object-cover w-full h-full rounded-full shadow-md"
          />
          <div className="flex-grow overflow-hidden">
            <h3 className="text-sm sm:text-base font-medium truncate">
              {title}
            </h3>
            <span className="block text-xs text-neutral-500 dark:text-neutral-400 ">
              {categories[0]?.name}
            </span>
          </div>
        </Link>
        <div className="hidden xl:flex flex-shrink-0 px-6 space-x-2.5">
          <PostCardLikeAction />
          <NcBookmark />
        </div>
      </div>
    );
  };

  const renderDurationTime = () => {
    return (
      <div className="absolute w-full inset-x-0 bottom-full">
        <input
          className="slider absolute z-10 opacity-0 inset-0 h-full w-full cursor-pointer"
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onTouchStart={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          onTouchEnd={handleSeekMouseUp}
        />
        <div
          className="absolute left-0 top-1/2 h-0.5 min-w-0 transform -translate-y-1/2 transition-all rounded-full bg-primary-500/30  will-change-contents"
          style={{ width: loaded * 100 + "%" }}
        ></div>
        <div
          className="absolute h-0.5 min-w-0 left-0 top-1/2 transform -translate-y-1/2 rounded-full bg-primary-500 z-0"
          // 12px la kich thuoc cua num' chuot
          style={{ width: `calc(${played * 100 + "%"} - 12px)` }}
        >
          <span className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-primary-500"></span>
        </div>
      </div>
    );
  };

  const renderButtonControl = () => {
    return (
      <div
        className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-neutral-700 dark:text-neutral-200 bg-neutral-100/70 hover:bg-neutral-200/70 dark:bg-neutral-700/40 dark:hover:bg-neutral-700/80 cursor-pointer transition-colors"
        onClick={handleClickToggle}
      >
        {/* PLAYING */}
        {playing ? (
          <PauseIcon className="w-10 h-10" />
        ) : (
          <PlayIcon className="ml-0.5 w-10 h-10" />
        )}
      </div>
    );
  };

  const renderButtonControlMobile = () => {
    return (
      <div
        className="flex-shrink-0 flex lg:hidden items-center justify-center w-10 h-10 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-black/10 cursor-pointer "
        onClick={handleClickToggle}
      >
        {/* PLAYING */}
        {playing ? (
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15.25 6.75V17.25"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8.75 6.75V17.25"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
            ></path>
          </svg>
        )}
      </div>
    );
  };

  const renderForwards15S = () => {
    return (
      <button
        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors"
        onClick={handleClickForwards15Sec}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M15.9601 10.8301H12.9001L12.1401 13.1201H14.4301C15.2701 13.1201 15.9601 13.8001 15.9601 14.6501C15.9601 15.4901 15.2801 16.1801 14.4301 16.1801H12.1401"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.54004 16.17V10.8301L8.04004 12.5001"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.98 4.46997L12 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.0899 7.79999C20.1999 9.27999 20.8899 11.11 20.8899 13.11C20.8899 18.02 16.9099 22 11.9999 22C7.08988 22 3.10986 18.02 3.10986 13.11C3.10986 8.19999 7.08988 4.21997 11.9999 4.21997C12.6799 4.21997 13.3399 4.31002 13.9799 4.46002"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const renderBackwards10S = () => {
    return (
      <button
        className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700/80 transition-colors"
        onClick={() => handleClickBackwards10Sec()}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.54004 15.92V10.5801L8.04004 12.2501"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.02 4.46997L12 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.91 7.79999C3.8 9.27999 3.10999 11.11 3.10999 13.11C3.10999 18.02 7.09 22 12 22C16.91 22 20.89 18.02 20.89 13.11C20.89 8.19999 16.91 4.21997 12 4.21997C11.32 4.21997 10.66 4.31002 10.02 4.46002"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 10.5801C15.1 10.5801 16 11.4801 16 12.5801V13.9301C16 15.0301 15.1 15.9301 14 15.9301C12.9 15.9301 12 15.0301 12 13.9301V12.5801C12 11.4701 12.9 10.5801 14 10.5801Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const rederSpeed = () => {
    return (
      <div className="w-12 flex justify-center items-center">
        <button
          className="rounded-lg text-[11px] leading-6 font-semibold px-2 ring-1 ring-inset ring-neutral-500 transition-all duration-500"
          onClick={() => {
            if (playbackRate === 1) {
              return handleSetPlaybackRate(1.5);
            }
            if (playbackRate === 1.5) {
              return handleSetPlaybackRate(2);
            }
            if (playbackRate === 2) {
              return handleSetPlaybackRate(1);
            }
          }}
        >
          {`${playbackRate === 1.5 ? 1.5 : playbackRate + `.0`}x`}
        </button>
      </div>
    );
  };

  const renderContentCenter = () => {
    return (
      <div className="flex flex-grow items-center text-neutral-500 dark:text-neutral-300 justify-evenly max-w-xs xl:max-w-md">
        {<div className="w-12"></div>}
        {renderBackwards10S()}
        {renderButtonControl()}
        {renderForwards15S()}
        {rederSpeed()}
      </div>
    );
  };

  const renderVolumn = () => {
    return (
      <div className="hidden lg:flex items-center justify-end text-neutral-500 dark:text-neutral-300">
        <button
          onClick={() => {
            if (!volume) {
              handleSetMuted(false);
              handleVolumeChange(0.8);
              return;
            }
            handleSetMuted(!muted);
          }}
        >
          {!!volume && !muted && volume >= 0.5 && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2 10V14C2 16 3 17 5 17H6.43C6.8 17 7.17 17.11 7.49 17.3L10.41 19.13C12.93 20.71 15 19.56 15 16.59V7.41003C15 4.43003 12.93 3.29003 10.41 4.87003L7.49 6.70003C7.17 6.89003 6.8 7.00003 6.43 7.00003H5C3 7.00003 2 8.00003 2 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M18 8C19.78 10.37 19.78 13.63 18 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.83 5.5C22.72 9.35 22.72 14.65 19.83 18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {!!volume && !muted && volume < 0.5 && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3.32996 10V14C3.32996 16 4.32996 17 6.32996 17H7.75996C8.12996 17 8.49996 17.11 8.81996 17.3L11.74 19.13C14.26 20.71 16.33 19.56 16.33 16.59V7.41003C16.33 4.43003 14.26 3.29003 11.74 4.87003L8.81996 6.70003C8.49996 6.89003 8.12996 7.00003 7.75996 7.00003H6.32996C4.32996 7.00003 3.32996 8.00003 3.32996 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M19.33 8C21.11 10.37 21.11 13.63 19.33 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {(!volume || muted) && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 8.37003V7.41003C15 4.43003 12.93 3.29003 10.41 4.87003L7.49 6.70003C7.17 6.89003 6.8 7.00003 6.43 7.00003H5C3 7.00003 2 8.00003 2 10V14C2 16 3 17 5 17H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.41 19.13C12.93 20.71 15 19.56 15 16.59V12.95"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.81 9.41992C19.71 11.5699 19.44 14.0799 18 15.9999"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.15 7.80005C22.62 11.29 22.18 15.37 19.83 18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L2 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="ml-3.5 relative w-24 flex-shrink-0">
          <input
            className="slider absolute z-10 opacity-0 inset-0 h-1 w-full cursor-pointer "
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={volume}
            onChange={(e) => {
              handleVolumeChange(parseFloat(e.currentTarget.value));
              handleSetMuted(false);
            }}
          />
          <div className="absolute left-0 top-1/2 h-0.5 min-w-0 w-full -translate-y-1/2 rounded-full bg-neutral-300 dark:bg-neutral-500"></div>
          <div
            className={`absolute h-0.5 min-w-0 left-0 top-1/2 -translate-y-1/2 rounded-full ${
              !volume || muted ? "bg-neutral-400" : "bg-primary-500"
            }`}
            style={{ width: volume * 100 + "%" }}
          >
            <span
              className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${
                !volume || muted ? "bg-neutral-400" : "bg-primary-500"
              }`}
            ></span>
          </div>
        </div>
      </div>
    );
  };

  const renderClose = () => {
    return (
      <button
        className="flex-shrink-0 flex items-center justify-center rounded-full focus:outline-none focus:shadow-outline hover:bg-neutral-100 dark:hover:bg-neutral-700/80 w-10 h-10 md:w-12 md:h-12"
        onClick={handleClickClose}
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    );
  };

  const renderTiming = () => {
    return (
      <div className="ml-5 mr-3 hidden lg:flex items-center justify-center flex-shrink-0 text-xs tracking-widest">
        <div className="flex-shrink-0 truncate min-w-[40px] text-right">
          {getConvertTime(Math.floor(playedSeconds))}
        </div>
        /
        <div className="flex-shrink-0 truncate min-w-[40px]">
          {getConvertTime(Math.floor(duration))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Transition
        className="relative bg-white dark:bg-neutral-800 w-full flex flex-col px-2 sm:px-3 z-0 - nc-google-shadow"
        show={!!post && !!post.audioUrl}
        enter="transition-transform duration-150"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition-transform duration-150"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
      >
        {/* BUTTON TOGGLE CONTENT ON MOBILE */}
        <button
          className="w-[26px] h-6 flex lg:hidden items-center justify-center absolute z-20 right-0 -top-3"
          onClick={() => setIsShowContentOnMobile(!isShowContentOnMobile)}
        >
          <div className="w-6 h-6 bg-white dark:bg-neutral-800 flex items-center justify-center  rounded-full - nc-google-shadow">
            <ChevronUpIcon
              className={`w-4 h-4 ${isShowContentOnMobile ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {renderDurationTime()}

        <div className="h-16 sm:h-20 w-full flex justify-between">
          {/* LEFT */}
          {renderLeft()}

          {/* CENTER */}
          <div className="hidden lg:flex flex-grow px-5 items-center justify-center">
            {isError ? (
              <span className="flex pl-2 text-xs lg:text-sm text-red-500">
                This track not found or not supported.
              </span>
            ) : (
              renderContentCenter()
            )}
          </div>

          {/* RENDER RIGHT */}
          <div className="ml-2 flex-shrink-0 lg:basis-52 lg:flex-grow flex items-center justify-end">
            {renderVolumn()}
            {renderTiming()}
            {renderButtonControlMobile()}
            {renderClose()}
          </div>
        </div>

        <Transition
          className="h-16 flex lg:hidden justify-center border-t border-neutral-300 dark:border-neutral-700 transition-all z-0 "
          enter="duration-150"
          enterFrom="-mb-16"
          enterTo="mb-0"
          leave="duration-150"
          leaveFrom="mb-0"
          leaveTo="-mb-16"
          as="div"
          show={isShowContentOnMobile}
        >
          <div className="flex flex-grow items-center justify-evenly text-neutral-500 dark:text-neutral-300 max-w-xs sm:max-w-sm md:max-w-md ">
            <div className="w-12 flex justify-center">
              {post && <NcBookmark />}
            </div>
            {renderBackwards10S()}
            {renderButtonControl()}
            {renderForwards15S()}
            {rederSpeed()}
          </div>
        </Transition>
      </Transition>
    </>
  );
};

export default PlayerContent;
