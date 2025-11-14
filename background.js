const recTypedArrays = [];
let recArrLength = 0;
const recBase64s = [];
const numChannels = 2;
const chunkSize = 1500000;
let sampleRate;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.key) {
    case 'start-capture':
      chrome.runtime.sendMessage('1');
      break;
    case 'start':
      init(message.sampleRate);
      break;
    case 'record':
      record(message.base64);
      break;
    case 'finish':
      finish();
      break;
  }
});
const record = (base64) => {
  for (let channel = 0; channel < numChannels; channel++) {
    recBase64s[channel].push(base64[channel]);
  }
};
const finish = async () => {
  const sendArrays = new Array(numChannels);
  for (let channel = 0; channel < numChannels; channel++) {
    const arrList = []
    for (const chunk of recBase64s[channel]) {
      const str = atob(chunk);
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      arrList.push(arr);
    }
    sendArrays[channel] = Array.from(new Int16Array(await new Blob(arrList).arrayBuffer()));
  }
  chrome.windows.create(
    { type: 'popup', url: 'window.html', focused: !0, height: 300, width: 350 },
    (window) => {
      // chrome.tabs.sendMessage(window.tabs[0].id, { buffer: recTypedArrays, sampleRate });
      chrome.runtime.onMessage.addListener(async (message, sender) => {

        if (message.key === 'window-finish-loading') {
          const tid = window.tabs[0].id;
          chrome.tabs.sendMessage(tid, { key: 'init', sampleRate, numChannels });
          // chrome.runtime.sendMessage({
          //   key: 'test',
          //   data: `${recTypedArrays[0][3000]}<br>${recTypedArrays[1][3000]}`,
          // });
          const taskList = [];
          for (let index = 0; index < sendArrays[0].length / chunkSize; index++) {
            taskList.push(
              chrome.tabs.sendMessage(tid, {
                key: 'chunk',
                index,
                data: [
                  sendArrays[0].slice(index * chunkSize, (index + 1) * chunkSize),
                  sendArrays[1].slice(index * chunkSize, (index + 1) * chunkSize),
                ],
              })
            );
          }
          await Promise.all(taskList);
          chrome.tabs.sendMessage(tid, { key: 'finish' });
        }
      });
      // chrome.runtime.sendMessage({ key: 'test', data: recBase64s[0].slice(0,20) });
    }
  );
};
const init = (sample_rate) => {
  sampleRate = sample_rate;
  for (let channel = 0; channel < numChannels; channel++) {
    recTypedArrays[channel] = new Uint8Array(0);
    recBase64s[channel] = []
  }
};
