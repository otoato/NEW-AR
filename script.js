@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;500&display=swap');

/* ベース設定 */
body {
  margin: 0;
  padding: 0;
  background-color: #000;
  font-family: 'Noto Sans JP', sans-serif;
  color: #f0f0f0;
  overflow: hidden;
}

/* 透明感と静けさを演出 */
#ar-button {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  color: #fff;
  font-size: 1rem;
  letter-spacing: 0.1em;
  backdrop-filter: blur(5px);
  border-radius: 2rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

#ar-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-50%) scale(1.02);
}

a-scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 0.9rem;
  opacity: 0.8;
}

.hidden {
  display: none;
}
