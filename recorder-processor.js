const floatToInt16 = (floatArray) => {
  const int16Array = new Int16Array(floatArray.length)
  for (let i = 0; i < floatArray.length; i++) {
    const sample = Math.max(-1, Math.min(1, floatArray[i])) // range
    int16Array[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
  }
  return int16Array
}
class RecorderProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0]
    const buffers = []

    for (let ch = 0; ch < input.length; ch++) {
      const copy = new Float32Array(input[ch].length)
      copy.set(input[ch])
      const converted = floatToInt16(copy)
      buffers.push(converted.buffer)
    }

    this.port.postMessage({
      key: "audio",
      buffers
    })

    return true
  }
}

registerProcessor("recorder-processor", RecorderProcessor)
