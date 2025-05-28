document.getElementById("ar-button").addEventListener("click", async () => {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "./mind/targets.mind"
  });
  const { renderer, scene, camera } = mindarThree;

  // シンプルな平面を表示（白く半透明）
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const plane = new THREE.Mesh(geometry, material);

  // 0番目のターゲットにアンカーを追加し、平面をセット
  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(plane);

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  document.getElementById("ar-button").style.display = "none";
});
