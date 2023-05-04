"use client";

import React, {
  FC,
  LegacyRef,
  useRef,
  useState,
  ChangeEvent,
  useEffect,
} from "react";
import PlayerContent from "./PlayerContent";
import _ from "lodash";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";

export interface MusicPlayerProps {}

const MusicPlayer: FC<MusicPlayerProps> = ({}) => {
  const playerRef: LegacyRef<ReactPlayer> | undefined = useRef(null);

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
    playedSeconds,
    postData,
    setPlayedSeconds,
    setPostData,
    loadedSeconds,
    setLoadedSeconds,
  } = useMusicPlayer();

  // STATE
  const [seeking, setSeeking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRender, setIsRender] = useState(false);

  //
  useEffect(() => {
    setIsRender(true);
  }, []);
  //

  const handleSeekMouseUp = (
    e:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    setSeeking(false);
    playerRef?.current?.seekTo(parseFloat(e.currentTarget.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: number) => {
    setVolume(e);
  };

  const handleSetPlaybackRate = (e: number) => {
    setplaybackRate(e);
  };

  const onClickBackwards10Sec = () => {
    playerRef?.current?.seekTo(playedSeconds - 10, "seconds");
  };

  const onClickForwarkds15Sec = () => {
    playerRef?.current?.seekTo(playedSeconds + 15, "seconds");
  };

  const handlePlay = () => {
    setPlaying(true);
  };
  const handlePause = () => {
    setPlaying(false);
  };
  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  const handleEnded = () => {
    setPlaying(false);
  };

  const handleProgress: ReactPlayerProps["onProgress"] = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setLoaded(state.loaded);
      setPlayed(state.played);
      setPlayedSeconds(state.playedSeconds);
      setLoadedSeconds(state.loadedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  return (
    <div className={`nc-MusicPlayer fixed bottom-0 inset-x-0 flex z-30`}>
      {/* ---- PLAYER CONTROL ---- */}
      <PlayerContent
        isError={isError}
        handleSetMuted={(isMuted) => setMuted(isMuted)}
        handleSeekMouseUp={handleSeekMouseUp}
        handleSeekMouseDown={handleSeekMouseDown}
        handleSeekChange={handleSeekChange}
        handleVolumeChange={handleVolumeChange}
        handleSetPlaybackRate={handleSetPlaybackRate}
        handleClickBackwards10Sec={_.debounce(onClickBackwards10Sec, 200)}
        handleClickForwards15Sec={_.debounce(onClickForwarkds15Sec, 200)}
      />

      {/* ---- PLAYER ---- */}
      <div className="fixed top-0 left-0 w-1 h-1 -z-50 opacity-0 overflow-hidden invisible">
        {isRender ? (
          <ReactPlayer
            ref={playerRef}
            className="react-player"
            width="100%"
            height="100%"
            url={postData?.audioUrl || ""}
            playing={playing}
            controls
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onReady={() => console.log("onReady")}
            onStart={() => setIsError(false)}
            onPlay={handlePlay}
            onPause={handlePause}
            onBuffer={() => console.log("onBuffer")}
            onSeek={(e) => console.log("onSeek", e)}
            onEnded={handleEnded}
            onError={(e) => setIsError(true)}
            onProgress={handleProgress}
            onDuration={handleDuration}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MusicPlayer;
