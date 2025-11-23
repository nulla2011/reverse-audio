import moment from "moment"
import { useEffect, useState } from "react"

import Player from "./components/player"
import { encodeWAV, interleave } from "./encodeWAV"

import "./window.css"

let numChannels = 2
let sampleRate = 48000
let bufferUnflat: number[][]
export default function WindowTab() {
  const [originAudioURL, setOriginAudioURL] = useState("")
  const [reverseAudioURL, setReverseAudioURL] = useState("")
  const [isAudioReady, setIsAudioReady] = useState(false)
  useEffect(() => {
    chrome.runtime.sendMessage({ key: "window-finish-loading" })
    const handler = (message, sender, sendResponse) => {
      if (message.key === "init") {
        sampleRate = message.sampleRate
        numChannels = message.numChannels
        bufferUnflat = Array(numChannels)
          .fill(undefined)
          .map(() => [])
      }
      if (message.key === "chunk") {
        for (let i = 0; i < numChannels; i++) {
          bufferUnflat[i][message.index] = message.data[i]
        }
      }
      if (message.key === "finish") {
        const buffer = bufferUnflat.map((channelBuffers) =>
          channelBuffers.flat(1)
        )
        const blob = new Blob(
          [encodeWAV(interleave(buffer), numChannels, sampleRate)],
          {
            type: "audio/wav"
          }
        )
        setOriginAudioURL(URL.createObjectURL(blob))
        const blob2 = new Blob(
          [
            encodeWAV(
              interleave(
                buffer.map((channelBuffers) => channelBuffers.reverse())
              ),
              numChannels,
              sampleRate
            )
          ],
          {
            type: "audio/wav"
          }
        )
        setReverseAudioURL(URL.createObjectURL(blob2))
        setIsAudioReady(true)
      }
    }
    chrome.runtime.onMessage.addListener(handler)
    return () => chrome.runtime.onMessage.removeListener(handler)
  }, [])
  return (
    <>
      {isAudioReady ? (
        <>
          {/* <h1 className="title"></h1> */}
          <h2 className="description">原版音频：</h2>
          <div className="wrapper">
            <Player url={originAudioURL} />
            <DownloadButton
              url={originAudioURL}
              filename={`Record_${moment().format("YYMMDD-HHmmss")}.wav`}
            />
          </div>
          <hr />
          <h2 className="description">倒放音频：</h2>
          <div className="wrapper">
            <Player url={reverseAudioURL} />
            <DownloadButton
              url={reverseAudioURL}
              filename={`Reverse_${moment().format("YYMMDD-HHmmss")}.wav`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="skeleton-text"></div>
          <div className="skeleton-player"></div>
          <hr />
          <div className="skeleton-text"></div>
          <div className="skeleton-player"></div>
        </>
      )}
    </>
  )
}
function DownloadButton({ url, filename }: { url: string; filename: string }) {
  return (
    <a href={url} download={filename}>
      <button className="download-button">
        <svg
          width="32px"
          height="32px"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000">
          <path
            d="M6 20L18 20"
            stroke="#000000"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5"
            stroke="#000000"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </a>
  )
}
