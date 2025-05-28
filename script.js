document.addEventListener("DOMContentLoaded", async () => {
  const sceneEl = document.querySelector("a-scene");
  const audioMap = {
    "clear_day": new Audio("./audio/clear_day.mp3"),
    "clear_night": new Audio("./audio/clear_night.mp3"),
    "rain_day": new Audio("./audio/rain_day.mp3"),
    "rain_night": new Audio("./audio/rain_night.mp3"),
    "wind_day": new Audio("./audio/wind_day.mp3"),
    "wind_night": new Audio("./audio/wind_night.mp3"),
  };

  let currentAudio = null;

  async function getWeatherKey() {
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18 ? "day" : "night";

    let weather = "clear"; // デフォルト

    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.76&current=weathercode");
      const data = await res.json();
      const code = data.current.weathercode;
      if ([51, 61, 63, 65, 80, 81].includes(code)) weather = "rain";
      else if ([95, 96, 99].includes(code)) weather = "wind";
      else weather = "clear";
    } catch (e) {
      console.warn("天気取得エラー", e);
    }

    return `${weather}_${isDay}`;
  }

  sceneEl.addEventListener("mindar-image-target-found", async (event) => {
    console.log("ターゲット認識:", event.detail.index);
    const key = await getWeatherKey();
    console.log("再生する音:", key);

    currentAudio = audioMap[key];
    if (currentAudio) {
      currentAudio.loop = true;
      currentAudio.play();
    }
  });

  sceneEl.addEventListener("mindar-image-target-lost", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  });
});
