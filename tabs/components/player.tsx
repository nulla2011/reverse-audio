import moment from "moment"
import { useRef, useState } from "react"

export default function Player({ url }: { url: string }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(undefined)
  const [currentTime, setCurrentTime] = useState(0)
  return (
    <div className="audio-player">
      <div className="buttons">
        {isPlaying ? (
          <button
            className="pause-button"
            onClick={() => audioRef.current?.pause()}>
            <svg
              width="36px"
              height="36px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
              strokeWidth={1.5}>
              <path
                d="M6 18.4V5.6C6 5.26863 6.26863 5 6.6 5H9.4C9.73137 5 10 5.26863 10 5.6V18.4C10 18.7314 9.73137 19 9.4 19H6.6C6.26863 19 6 18.7314 6 18.4Z"
                fill="#000000"
                stroke="#000000"
                strokeWidth={1.5}
              />
              <path
                d="M14 18.4V5.6C14 5.26863 14.2686 5 14.6 5H17.4C17.7314 5 18 5.26863 18 5.6V18.4C18 18.7314 17.7314 19 17.4 19H14.6C14.2686 19 14 18.7314 14 18.4Z"
                fill="#000000"
                stroke="#000000"
                strokeWidth={1.5}
              />
            </svg>
          </button>
        ) : (
          <button
            className="play-button"
            onClick={() => audioRef.current?.play()}>
            <svg
              width="36px"
              height="36px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
              strokeWidth={1.5}>
              <path
                d="M6.90588 4.53682C6.50592 4.2998 6 4.58808 6 5.05299V18.947C6 19.4119 6.50592 19.7002 6.90588 19.4632L18.629 12.5162C19.0211 12.2838 19.0211 11.7162 18.629 11.4838L6.90588 4.53682Z"
                fill="#000000"
                stroke="#000000"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="progress">
        <div className="time current">
          {moment().startOf("hour").seconds(currentTime).format("m:ss")}
        </div>
        <input
          className="progress-bar"
          style={{
            background: `linear-gradient(to right, var(--color) ${(currentTime / duration) * 100}%, #ddd ${(currentTime / duration) * 100}%)`
          }}
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          step={0.01}
          onChange={(event) =>
            (audioRef.current.currentTime = event.target.value)
          }
        />
        <div className="time duration">
          {Number.isFinite(duration)
            ? moment().startOf("hour").seconds(duration).format("m:ss")
            : "-:--"}
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration)}
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current?.currentTime)
        }></audio>
    </div>
  )
}
