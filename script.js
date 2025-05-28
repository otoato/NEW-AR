document.addEventListener("DOMContentLoaded", () => {
  const sceneEl = document.querySelector("a-scene");
  const audioRain = document.querySelector("#audioRain");
  const audioWind = document.querySelector("#audioWind");
  const audioClear = document.querySelector("#audioClear");

  // Audio再生用Audioオブジェクトを作成
  const rainSound = new Audio(audioRain.getAttribute("src"));
  const windSound = new Audio(audioWind.getAttribute("src"));
  const clearSound = new Audio(audioClear.getAttribute("src"));

  // 環境パターン例（ここは天気×時間の判定ロジックを入れる）
  let currentAudio = null;

  sceneEl.addEventListener("mindar-image-target-found", (event) => {
    console.log("ターゲット認識:", event.detail.index);

    // 簡単に天気×時間によって音を選ぶ例
    // 実際にはnavigatorや外部APIなどで情報を取得してください
    const weather = "rain";  // ここを動的に変える
    const timeOfDay = "day"; // ここを動的に変える

    if (weather === "rain") {
      currentAudio = rainSound;
    } else if (weather === "wind") {
      currentAudio = windSound;
    } else {
      currentAudio = clearSound;
    }

    if (currentAudio) {
      currentAudio.loop = true;
      currentAudio.play();
    }
  });

  sceneEl.addEventListener("mindar-image-target-lost", (event) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  });
});
