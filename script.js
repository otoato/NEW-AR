document.getElementById('start-button').addEventListener('click', async () => {
  const sceneEl = document.querySelector('a-scene');
  try {
    await sceneEl.components['mindar-image'].start();
    console.log('MindAR 起動成功');
    document.getElementById('start-button').style.display = 'none';
  } catch (error) {
    console.error('MindAR 起動失敗', error);
  }
});
