export default class Recorder {
  private stream: MediaStream
  private audioCtx: AudioContext
  private workletNode: AudioWorkletNode
  private numChannels = 2
  private buffers = []
  private base64 = []
  constructor() {}
  getAudio() {
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      if (chrome.runtime.lastError) {
      }
      if (stream) {
        this.createAudio(stream)
      }
    })
  }
  closeAudio() {
    if (this.stream) {
      this.stream.getAudioTracks()[0].stop()
      this.audioCtx.close()
    }
    this.finishRecording()
  }
  async createAudio(stream) {
    this.audioCtx = new AudioContext()
    this.stream = stream
    await this.audioCtx.audioWorklet.addModule("recorder-processor.js")
    this.workletNode = new AudioWorkletNode(
      this.audioCtx,
      "recorder-processor",
      {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        channelCount: this.numChannels
      }
    )
    const sourceNode = this.audioCtx.createMediaStreamSource(this.stream)
    sourceNode.connect(this.audioCtx.destination)
    sourceNode.connect(this.workletNode)
    this.startRecording()
  }
  startRecording() {
    this.workletNode.port.onmessage = async (event) => {
      if (event.data.key === "audio") {
        for (let ch = 0; ch < this.numChannels; ch++)
          this.buffers[ch] = new Int16Array(event.data.buffers[ch])
        this.base64 = await Promise.all(
          this.buffers.map(
            (buffer) =>
              new Promise((resolve, reject) => {
                const blob = new Blob([buffer])
                const reader = new FileReader()
                reader.onload = () => {
                  const base64data = reader.result as string
                  base64data.split(",")[1]
                  resolve(base64data.split(",")[1])
                }
                reader.onerror = (error) => reject(error)
                reader.readAsDataURL(blob)
              })
          )
        )
        chrome.runtime.sendMessage({
          key: "record",
          base64: this.base64
        })
      }
    }
    chrome.runtime.sendMessage({
      key: "start",
      sampleRate: this.audioCtx.sampleRate
    })
  }
  finishRecording() {
    chrome.runtime.sendMessage({
      key: "finish",
      screenSize: {
        width: window.screen.availWidth,
        height: window.screen.availHeight
      }
    })
  }
}
