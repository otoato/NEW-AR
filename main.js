document.addEventListener('DOMContentLoaded', () => {
    // ボタンがなくなったので、startButtonの参照は削除
    const loader = document.getElementById('loader');
    const loaderMessage = document.getElementById('loader-message');
    const audio = document.getElementById('env-audio');
    const sceneEl = document.querySelector('a-scene');
    const targetEntity = document.querySelector('[mindar-image-target]');

    const apiKey = "04c722650b61e51900cb5ec33d041f16"; // あなたのAPIキー

    const startExperience = async () => {
        // ローディングクラスを追加してUIを変化させる
        loader.classList.add('is-loading');
        loaderMessage.textContent = 'LOADING...';

        try {
            // 天気と時間を非同期で取得
            const weather = await getWeather();
            const time = getTimeOfDay();

            // 音声ファイルを設定
            const filePath = `./audio/${time}-${weather}.mp3`;
            console.log("再生ファイル:", filePath);
            audio.src = filePath;
            await audio.load();

            // ARを開始
            loader.classList.add('hidden'); // ローディング画面をフェードアウト
            sceneEl.classList.add('visible'); 
            await sceneEl.systems['mindar-image-system'].start();

        } catch (error) {
            console.error("初期化エラー:", error);
            loader.classList.remove('is-loading'); 
            loaderMessage.innerHTML = `ERROR<br><small>${error.message}</small>`;
        }
    };

    // ★★★ 画面全体をクリックした時に一度だけ実行する ★★★
    loader.addEventListener('click', startExperience, { once: true });


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

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) return "morning";
        if (hour >= 10 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 22) return "evening";
        return "night";
    };

    const getWeather = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("Geolocation not supported."));
            }
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    try {
                        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                        if (!res.ok) throw new Error("Could not fetch weather data.");
                        
                        const data = await res.json();
                        const mainWeather = data.weather[0].main.toLowerCase();

                        switch (mainWeather) {
                            case "rain": case "drizzle": case "thunderstorm":
                                resolve("rainy"); break;
                            case "snow":
                                resolve("snowy"); break;
                            case "clouds":
                                resolve("cloudy"); break;
                            case "clear":
                                resolve("sunny"); break;
                            default:
                                resolve("cloudy");
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                (err) => {
                    reject(new Error("Permission to access location was denied."));
                }
            );
        });
    };
});
