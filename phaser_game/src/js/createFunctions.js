export function createAnimations(scene) {
    scene.anims.create({
      key: 'walk-left', // 왼쪽 걷기
      frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
  
    scene.anims.create({
      key: 'walk-right', // 오른쪽 걷기
      frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  
    scene.anims.create({
      key: 'walk-up', // 위로 걷기
      frames: scene.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  
    scene.anims.create({
      key: 'walk-down', // 아래로 걷기
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  export function setupFullscreen(scene) {
    // Full Screen 버튼 생성
    const fullscreenButton = scene.add.text(10, 10, '전체 화면', {
      font: '20px Arial',
      fill: '#ffffff',
    })
      .setInteractive()
      .setScrollFactor(0) // 화면 고정
      .setOrigin(0);
  
    // 전체 화면 버튼 클릭 이벤트
    fullscreenButton.on('pointerdown', () => {
      if (scene.scale.isFullscreen) {
        scene.scale.stopFullscreen(); // 전체 화면 종료
      } else {
        scene.scale.startFullscreen(); // 전체 화면 시작
      }
    });
  
    // 전체 화면 상태 변경 이벤트
    scene.scale.on('enterfullscreen', () => {
      fullscreenButton.setVisible(false); // 전체 화면일 때 버튼 숨김
    });
  
    scene.scale.on('leavefullscreen', () => {
      fullscreenButton.setVisible(true); // 전체 화면 종료 시 버튼 표시
    });
  }
  export function setupMobileControls(scene) {
    let currentTouch = { x: null, y: null };
    let touchInterval;
  
    scene.input.on('pointerdown', (pointer) => {
      currentTouch.x = pointer.x;
      currentTouch.y = pointer.y;
  
      // 터치 위치에 따라 플레이어 이동
      touchInterval = setInterval(() => {
        let velocityX = 0;
        let velocityY = 0;
  
        if (currentTouch.x < player.x - 10) {
          velocityX = -200;
          currentDirection = 'left';
        } else if (currentTouch.x > player.x + 10) {
          velocityX = 200;
          currentDirection = 'right';
        }
  
        if (currentTouch.y < player.y - 10) {
          velocityY = -200;
          currentDirection = 'up';
        } else if (currentTouch.y > player.y + 10) {
          velocityY = 200;
          currentDirection = 'down';
        }
  
        player.setVelocity(velocityX, velocityY);
  
        // 대각선 방향 애니메이션 처리
        if (velocityX !== 0 && velocityY !== 0) {
          if (velocityX > 0 && velocityY > 0) {
            player.anims.play('walk-down', true);
          } else if (velocityX > 0 && velocityY < 0) {
            player.anims.play('walk-right', true);
          } else if (velocityX < 0 && velocityY > 0) {
            player.anims.play('walk-left', true);
          } else if (velocityX < 0 && velocityY < 0) {
            player.anims.play('walk-up', true);
          }
        } else {
          // 단일 방향 애니메이션
          if (velocityX < 0) {
            player.anims.play('walk-left', true);
          } else if (velocityX > 0) {
            player.anims.play('walk-right', true);
          }
          if (velocityY < 0) {
            player.anims.play('walk-up', true);
          } else if (velocityY > 0) {
            player.anims.play('walk-down', true);
          }
        }
      }, 50); // 일정 간격으로 업데이트
    });
  
    scene.input.on('pointermove', (pointer) => {
      currentTouch.x = pointer.x;
      currentTouch.y = pointer.y;
    });
  
    scene.input.on('pointerup', () => {
      clearInterval(touchInterval); // 터치가 끝나면 반복 중지
      player.setVelocity(0);
      player.anims.stop();
      currentTouch = { x: null, y: null }; // 터치 좌표 초기화
    });
}

export function openSettingsMenu(scene) {
    // 설정 메뉴가 열려 있음을 표시
    isSettingsMenuOpen = true;
  
    // 설정 메뉴 배경
    const menuBackground = scene.add.rectangle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      300,
      200,
      0x000000,
      0.8
    )
    .setScrollFactor(0) // 화면 고정
    .setOrigin(0.5); // 중심에 배치
  
    // 설정 메뉴 닫기 버튼
    const closeButton = scene.add.text(
      window.innerWidth / 2 + 120,
      window.innerHeight / 2 - 80,
      'X',
      {
        font: '20px Arial',
        fill: '#ffffff',
      }
    )
    .setInteractive()
    .setScrollFactor(0) // 화면 고정
    .setOrigin(0.5) // 중심 기준으로 배치
    .on('pointerdown', () => {
      menuBackground.destroy();
      closeButton.destroy();
      volumeText.destroy();
      decreaseButton.destroy();
      increaseButton.destroy();
      isSettingsMenuOpen = false; // 설정 메뉴 닫힘 상태로 설정
    });
  
    // 볼륨 텍스트
    volumeText = scene.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2 - 20,
      `Volume: ${Math.round(bgMusic.volume * 100)}`,
      {
        font: '20px Arial',
        fill: '#ffffff',
      }
    )
    .setScrollFactor(0) // 화면 고정
    .setOrigin(0.5); // 중심 기준으로 배치
  
    volumeText.setText(`Volume: ${Math.round(bgMusic.volume * 100)}`);
  
    // 볼륨 감소 버튼
    const decreaseButton = scene.add.text(
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 + 20,
      '-',
      {
        font: '30px Arial',
        fill: '#ffffff',
      }
    )
    .setInteractive()
    .setScrollFactor(0) // 화면 고정
    .setOrigin(0.5) // 중심 기준으로 배치
    .on('pointerdown', () => {
      if (bgMusic.volume > 0.01) {
        bgMusic.setVolume(bgMusic.volume - 0.1);
        updateVolumeDisplay(bgMusic.volume-0.1); // UI 업데이트
      }
    });
  
    // 볼륨 증가 버튼
    const increaseButton = scene.add.text(
      window.innerWidth / 2 + 50,
      window.innerHeight / 2 + 20,
      '+',
      {
      font: '30px Arial',
      fill: '#ffffff',
      }
    )
    .setInteractive()
    .setScrollFactor(0) // 화면 고정
    .setOrigin(0.5) // 중심 기준으로 배치
    .on('pointerdown', () => {
      const currentVolume = bgMusic.volume; // 현재 볼륨 가져오기
      console.log("Current volume before increase:", currentVolume);
  
      if (currentVolume < 1) {
      bgMusic.setVolume(Math.min(currentVolume + 0.1, 1)); // 0.1 단위로 증가
      console.log("Volume set to:", bgMusic.volume+0.1);
  
      updateVolumeDisplay(bgMusic.volume+0.1); // UI 업데이트
      }
    });
}

function updateVolumeDisplay(updatedVolume) {
    const volume = Math.round(updatedVolume * 100); // 볼륨 값 (0~100)
    console.log(`Updating volume display. Current volume: ${volume}`);
    volumeText.setText(`Volume: ${volume}`);
  }

