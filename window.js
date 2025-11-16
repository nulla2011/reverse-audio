let numChannels = 2;
let sampleRate;
const originAudio = document.querySelector('#audio-origin');
const reverseAudio = document.querySelector('#audio-reverse');
const originDownload = document.querySelector('#download-origin');
const reverseDownload = document.querySelector('#download-reverse');
let buffer = [];

window.onload = () => chrome.runtime.sendMessage({ key: 'window-finish-loading' });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.key === 'init') {
    sampleRate = message.sampleRate;
    numChannels = message.numChannels;
    buffer = Array(numChannels)
      .fill()
      .map(() => []);
  }
  if (message.key === 'chunk') {
    for (let i = 0; i < numChannels; i++) {
      buffer[i][message.index] = message.data[i];
    }
  }
  if (message.key === 'finish') {
    const b = [buffer[0].flat(1), buffer[1].flat(1)];
    const blob = new Blob([encodeWAV(interleave(...b))], {
      type: 'audio/wav',
    });
    const blobUrl = URL.createObjectURL(blob);
    originAudio.src = blobUrl;
    originDownload.href = blobUrl;
    originDownload.download = `Record_${date()}.wav`;
    const blob2 = new Blob([encodeWAV(interleave(b[0].reverse(), b[1].reverse()))], {
      type: 'audio/wav',
    });
    const blob2Url = URL.createObjectURL(blob2);
    reverseAudio.src = blob2Url;
    reverseDownload.href = blob2Url;
    reverseDownload.download = `Reverse_${date()}.wav`;
  }
});
function interleave(inputL, inputR) {
  let length = inputL.length + inputR.length;
  let result = new Int16Array(length);
  let index = 0;
  let inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
function encodeWAV(samples) {
  let buffer = new ArrayBuffer(44 + samples.length * 2);
  let view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  data = new Uint8Array(buffer);
  data.set(new Uint8Array(samples.buffer), 44);

  return data;
}
function date() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}