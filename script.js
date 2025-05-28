
document.addEventListener("DOMContentLoaded", () => {
  const sceneEl = document.querySelector("a-scene");
  const audioRain = new Audio('./audio/rain.mp3');
  const audioWind = new Audio('./audio/wind.mp3');
  const audioClear = new Audio('./audio/clear.mp3');

  // MindARのイベント監視
  sceneEl.addEventListener("mindar-image-target-found", (event) => {
    console.log("ターゲット認識:", event.detail.index);
    // ここで環境に合わせて音を再生する例
    audioClear.play();
  });

  sceneEl.addEventListener("mindar-image-target-lost", (event) => {
    audioClear.pause();
  });

  // 環境情報の取得はここで追加可能
});
