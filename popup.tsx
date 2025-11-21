import { useEffect, useMemo, useState } from "react"

import Recorder from "~recorder"

import "./popup.css"

let rafId: number
export default function IndexPopup() {
  const [isRecording, setIsRecording] = useState(true)
  const [timer, setTimer] = useState("00:00.00")
  const [test, setTest] = useState("")
  const recorder = useMemo(() => new Recorder(), [])
  useEffect(() => {
    if (isRecording) {
      let startTime: number
      const tick = (now) => {
        if (startTime === undefined) startTime = now
        const elapsed = now - startTime
        let rst = elapsed
        const minutes = String(Math.floor(rst / 60000)).padStart(2, "0")
        rst = rst % 60000
        const seconds = String(Math.floor(rst / 1000)).padStart(2, "0")
        rst = rst % 1000
        const milliseconds = String(Math.floor(rst / 10)).padStart(2, "0")
        setTimer(`${minutes}:${seconds}.${milliseconds}`)
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
      recorder.getAudio()
    } else {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (recorder) {
        recorder.closeAudio()
      }
    }
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [isRecording])
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender) => {
      if (message.key === "test") {
        setTest(message.data)
      }
    })
  }, [])
  return (
    <main>
      <h1 className="title">已经开始录制，如未开始请点击录制按钮</h1>
      <hr />
      <div>
        <span id="light" className="flash"></span>
        <span id="timer">{timer}</span>
      </div>
      <button
        id="record-button"
        className="button"
        onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? "停止" : "录制"}
      </button>
      <ul>
        <li id="key-hint">本扩展快捷键为 Ctrl+Shift+5</li>
      </ul>
      <div id="test">{test}</div>
    </main>
  )
}
