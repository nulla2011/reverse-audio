import { useState } from "react"

import "./popup.css"

export default function IndexPopup() {
  const [isRecording, toggleRecording] = useState(false)
  return (
    <main>
      <h1 className="title">已经开始录制，如未开始请点击录制按钮</h1>
      <hr />
      <div>
        <span id="light" className="flash"></span>
        <span id="timer">00:00.00</span>
      </div>
      <button
        id="record-button"
        className="button"
        onClick={() => toggleRecording(!isRecording)}>
        {isRecording ? "停止" : "录制"}
      </button>
      <ul>
        <li id="key-hint">本扩展快捷键为 Ctrl+Shift+5</li>
      </ul>
      <div id="test"></div>
    </main>
  )
}
