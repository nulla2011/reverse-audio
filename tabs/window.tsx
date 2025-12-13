import { Download } from "iconoir-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Player from "./components/player"
import { encodeWAV, interleave } from "./encodeWAV"

import "~i18n"
import "./window.css"

let numChannels = 2
let sampleRate = 48000
let bufferUnflat: number[][]
export default function WindowTab() {
  const { t } = useTranslation()
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
          <h2 className="description">{t("original-audio")}</h2>
          <div className="wrapper">
            <Player url={originAudioURL} />
            <DownloadButton
              url={originAudioURL}
              filename={`Record_${moment().format("YYMMDD-HHmmss")}.wav`}
            />
          </div>
          <hr />
          <h2 className="description">{t("reversed-audio")}</h2>
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
        <Download height={32} width={32} />
      </button>
    </a>
  )
}
