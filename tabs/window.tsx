import { useEffect, useState } from "react"

import Player from "./components/player"
import { encodeWAV, interleave } from "./encodeWAV"
import { date } from "./utils"

import "./window.css"

let numChannels = 2
let sampleRate = 48000
let buffer: Int16Array[][]
export default function WindowTab() {
  const [originAudioURL, setOriginAudioURL] = useState("")
  const [reverseAudioURL, setReverseAudioURL] = useState("")
  useEffect(() => {
    chrome.runtime.sendMessage({ key: "window-finish-loading" })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.key === "init") {
        sampleRate = message.sampleRate
        numChannels = message.numChannels
        buffer = Array(numChannels)
          .fill(undefined)
          .map(() => [])
      }
      if (message.key === "chunk") {
        for (let i = 0; i < numChannels; i++) {
          buffer[i][message.index] = message.data[i]
        }
      }
      if (message.key === "finish") {
        const b = buffer.map((channelBuffers) => channelBuffers.flat(1))
        const blob = new Blob(
          [encodeWAV(interleave(b), numChannels, sampleRate)],
          {
            type: "audio/wav"
          }
        )
        setOriginAudioURL(URL.createObjectURL(blob))
        const blob2 = new Blob(
          [
            encodeWAV(
              interleave(b[0].reverse(), b[1].reverse()),
              numChannels,
              sampleRate
            )
          ],
          {
            type: "audio/wav"
          }
        )
        setReverseAudioURL(URL.createObjectURL(blob2))
      }
    })
  }, [])
  return (
    <>
      {/* <h1 className="title"></h1> */}
      <h2 className="description">原版音频：</h2>
      <div className="wrapper">
        <Player />
        <DownloadButton
          url={originAudioURL}
          filename={`Record_${date()}.wav`}
        />
      </div>
      <hr />
      <h2 className="description">倒放音频：</h2>
      <div className="wrapper">
        <Player />
        <DownloadButton
          url={reverseAudioURL}
          filename={`Reverse_${date()}.wav`}
        />
      </div>
    </>
  )
}
function DownloadButton({ url, filename }: { url: string; filename: string }) {
  return (
    <a href={url} download={filename} id="download-origin">
      <button className="download-button">
        <svg
          width="32px"
          height="32px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000">
          <path
            d="M6 20L18 20"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"></path>
          <path
            d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"></path>
        </svg>
      </button>
    </a>
  )
}
