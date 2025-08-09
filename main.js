document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const loader = document.getElementById('loader');
    const loaderMessage = document.getElementById('loader-message');
    const audio = document.getElementById('env-audio');
    const sceneEl = document.querySelector('a-scene');
    const targetEntity = document.querySelector('[mindar-image-target]');

    const apiKey = "04c722650b61e51900cb5ec33d041f16"; // あなたのAPIキー

    const startExperience = async () => {
        // ローディング表示
        startButton.style.display = 'none';
        loaderMessage.textContent = 'あなたの場所の天気情報を取得中...';

        try {
            // 1. 天気と時間を非同期で取得
            const weather = await getWeather();
            const time = getTimeOfDay();

            // 2. 音声ファイルを設定
            const filePath = `./audio/${time}-${weather}.mp3`;
            console.log("再生ファイル:", filePath);
            audio.src = filePath;
            await audio.load();

            // 3. ARを開始
            loader.classList.add('hidden'); // ローディング画面を消す
            sceneEl.classList.add('visible'); // ARシーンを表示
            await sceneEl.systems['mindar-image-system'].start(); // ARシステムを手動で開始

        } catch (error) {
            console.error("初期化エラー:", error);
            loaderMessage.innerHTML = `エラーが発生しました。<br>(${error.message})<br>ページを再読み込みしてください。`;
        }
    };

    startButton.addEventListener('click', startExperience);

    // ARターゲットの検出・消失イベント
    targetEntity.addEventListener("targetFound", () => {
        console.log("ターゲット発見！音再生");
        audio.play().catch(e => console.error("音声再生に失敗しました。", e));
    });

    targetEntity.addEventListener("targetLost", () => {
        console.log("ターゲット消失。音停止");
        audio.pause();
        audio.currentTime = 0;
    });

    // --- 補助関数 ---

    // 時間帯を判定する関数
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) return "morning";    // 5時-9時
        if (hour >= 10 && hour < 17) return "afternoon"; // 10時-16時
        if (hour >= 17 && hour < 22) return "evening";   // 17時-21時
        return "night"; // 22時-4時
    };

    // 天気情報を取得・分類する関数
    const getWeather = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("お使いのブラウザは位置情報取得に対応していません。"));
            }
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    try {
                        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                        if (!res.ok) throw new Error("天気情報の取得に失敗。");
                        
                        const data = await res.json();
                        const mainWeather = data.weather[0].main.toLowerCase();
                        console.log("取得した天気:", mainWeather);

                        switch (mainWeather) {
                            case "rain":
                            case "drizzle":
                            case "thunderstorm":
                                resolve("rainy"); break;
                            case "snow":
                                resolve("snowy"); break;
                            case "clouds":
                                resolve("cloudy"); break;
                            case "clear":
                                resolve("sunny"); break;
                            default: // mist, smoke, haze, dust, fogなど
                                resolve("cloudy"); // 曇りとして扱う
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                (err) => {
                    // ユーザーが位置情報を拒否した場合など
                    console.warn("位置情報取得エラー:", err.message);
                    reject(new Error("位置情報の取得が許可されませんでした。"));
                }
            );
        });
    };
});
