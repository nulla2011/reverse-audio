import { PauseSolid, PlaySolid } from "iconoir-react"
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
            <PauseSolid color="#242424" height={36} width={36} />
          </button>
        ) : (
          <button
            className="play-button"
            onClick={() => audioRef.current?.play()}>
            <PlaySolid color="#242424" height={36} width={36} />
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
