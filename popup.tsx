import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import Recorder from "~recorder"

import "~i18n"
import "./popup.css"

const LIMIT = 20 * 60 * 1000

export default function IndexPopup() {
  const { t } = useTranslation()
  const [isRecording, setIsRecording] = useState(true)
  const [timer, setTimer] = useState("00:00.00")
  const [test, setTest] = useState("")
  const rafId = useRef(null)
  const recorder = useMemo(() => new Recorder(), [])
  useEffect(() => {
    if (isRecording) {
      let startTime: number
      const tick = (now) => {
        if (startTime === undefined) startTime = now
        const elapsed = now - startTime
        if (elapsed > LIMIT) {
          setIsRecording(false)
        }
        let rst = elapsed
        const minutes = String(Math.floor(rst / 60000)).padStart(2, "0")
        rst = rst % 60000
        const seconds = String(Math.floor(rst / 1000)).padStart(2, "0")
        rst = rst % 1000
        const milliseconds = String(Math.floor(rst / 10)).padStart(2, "0")
        setTimer(`${minutes}:${seconds}.${milliseconds}`)
        rafId.current = requestAnimationFrame(tick)
      }
      rafId.current = requestAnimationFrame(tick)
      recorder.getAudio()
    } else {
      if (rafId) {
        cancelAnimationFrame(rafId.current)
      }
      if (recorder) {
        recorder.closeAudio()
      }
    }
    return () => {
      cancelAnimationFrame(rafId.current)
    }
  }, [isRecording])
  useEffect(() => {
    // chrome.runtime.onMessage.addListener((message, sender) => {
    //   if (message.key === "test") {
    //     setTest(message.data)
    //   }
    // })
  }, [])
  return (
    <main>
      <div className="head">
        <Github />
      </div>
      <div>
        {/* <span id="light" className="flash"></span> */}
        <span id="timer">{timer}</span>
      </div>
      <button
        id="record-button"
        className="button"
        onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? (
          <svg
            width="20px"
            height="20px"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000">
            <path
              d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z"
              stroke="#232323"
              fill="#232323"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        ) : (
          <svg
            width="20px"
            height="20px"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#232323"
              fill="#232323"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        )}
        <span>{isRecording ? t("stop") : t("record")}</span>
      </button>
      <ul>
        <li className="comment">{t("comment-limit")}</li>
        <li className="comment">{t("comment-shortcut")}</li>
      </ul>
      {/* <div id="test">{navigator.language}</div> */}
    </main>
  )
}
function Github() {
  return (
    <a
      className="icon"
      href="https://github.com/nulla2011/reverse-audio"
      target="_blank">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25px"
        height="25px"
        viewBox="0 0 24 24"
        fill="#808b9a">
        <path
          fill="#808b9a"
          d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
        />
      </svg>
    </a>
  )
}
