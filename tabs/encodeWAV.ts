export function interleave(channelBuffers: number[][]) {
  const length = channelBuffers.reduce((acc, cur) => acc + cur.length, 0)
  const output = new Int16Array(length)
  let index = 0
  let inputIndex = 0
  while (index < length) {
    channelBuffers.forEach((buffer) => {
      output[index++] = buffer[inputIndex]
    })
    inputIndex++
  }
  return output
}
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
export function encodeWAV(samples, numChannels, sampleRate) {
  let buffer = new ArrayBuffer(44 + samples.length * 2)
  let view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, "RIFF")
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true)
  /* RIFF type */
  writeString(view, 8, "WAVE")
  /* format chunk identifier */
  writeString(view, 12, "fmt ")
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, 1, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true)
  /* bits per sample */
  view.setUint16(34, 16, true)
  /* data chunk identifier */
  writeString(view, 36, "data")
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true)

  const data = new Uint8Array(buffer)
  data.set(new Uint8Array(samples.buffer), 44)

  return data
}
