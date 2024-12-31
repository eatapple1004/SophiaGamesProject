const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      mode: Phaser.Scale.RESIZE, // 창 크기 변경 시 자동 조정
      autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙 정렬
    },
    physics: {
      default: 'arcade', // 물리 엔진 활성화
      arcade: {
        gravity: { y: 0 }, // 중력 없음
        debug: false,
      },
    },
    scene: {
      preload,
      create,
      update,
    },
  };
  
  let player; // 플레이어 변수
  let cursors; // 키 입력 변수
  let currentDirection = 'down'; // 현재 방향을 추적 (기본값: 아래)
  let bgMusic; // 전역 변수로 선언
  let volumeBar; // 볼륨 바
  let volumeBarBackground; // 볼륨 바 배경
  let isSettingsMenuOpen = false; // 설정 메뉴 상태 플래그

  function preload() {

    // 배경 음악 로드
    this.load.audio('bgMusic', '../assets/audio/samplemp3.mp3');
    // 배경 이미지
    this.load.image('background', '../assets/images/background.jpg'); 
    this.load.spritesheet('player', '../assets/images/player.png', {
      frameWidth: 32, // 각 프레임의 너비
      frameHeight: 48, // 각 프레임의 높이
    });
  }
  
  function create() {

    const mapWidth = window.innerWidth*2; // 맵의 너비
    const mapHeight = window.innerHeight*2; // 맵의 높이

    // 배경 설정
    const background = this.add.tileSprite(0, 0, mapWidth, mapHeight, 'background').setOrigin(0, 0);


    //월드 경계 확장
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    // 플레이어 설정
    const centerX = mapWidth / 2; // 맵 중앙 X 좌표
    const centerY = mapHeight / 2; // 맵 중앙 Y 좌표
    player = this.physics.add.sprite(centerX, centerY, 'player', 0); // 맵 중앙에서 시작
    player.setScale(2); // 크기 확대
    player.setCollideWorldBounds(true); // 경계 제한
  

    // 카메라 설정
    this.cameras.main.startFollow(player); // 플레이어를 따라다니는 카메라
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // 카메라가 이동할 수 있는 맵 경계

    // 설정 텍스트 버튼 추가
    const settingsButton = this.add.text(window.innerWidth - 150, 10, '⚙ Settings', {
        font: '20px Arial',
        fill: '#000',
        padding: { x: 10, y: 5 },
    })
        .setInteractive()
        .setScrollFactor(0) // 화면 고정
        .setOrigin(0);
  
    // 클릭 이벤트
    settingsButton.on('pointerdown', () => {
        console.log('Settings button clicked');
        if (!isSettingsMenuOpen) {
            openSettingsMenu(this); // 설정 메뉴 열기
        }
    });

    // 배경 음악 재생
    bgMusic = this.sound.add('bgMusic', {
        volume: 0.5, // 음악 볼륨 (0.0 ~ 1.0)
        loop: true,  // 반복 재생
    });
    bgMusic.play();

    // 화살표 키 입력 추가
    cursors = this.input.keyboard.createCursorKeys();
  
    // Full Screen 버튼 생성
    const fullscreenButton = this.add.text(10, 10, '전체 화면', { font: '20px Arial', fill: '#ffffff' })
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen(); // 전체 화면 종료
        } else {
          this.scale.startFullscreen(); // 전체 화면 시작
        }
      }).setScrollFactor(0);;
  
    // 전체 화면 상태 감지
    this.scale.on('enterfullscreen', () => {
      fullscreenButton.setVisible(false); // 전체 화면일 때 버튼 숨김
    });
  
    this.scale.on('leavefullscreen', () => {
      fullscreenButton.setVisible(true); // 전체 화면 종료 시 버튼 표시
    });


    // 애니메이션 생성
    this.anims.create({
      key: 'walk-left', // 왼쪽 걷기
      frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
  
    this.anims.create({
      key: 'walk-right', // 오른쪽 걷기
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  
    this.anims.create({
      key: 'walk-up', // 위로 걷기
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  
    this.anims.create({
      key: 'walk-down', // 아래로 걷기
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  
  function openSettingsMenu(scene) {
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
  
  // 볼륨 텍스트 업데이트 함수
  function updateVolumeDisplay(updatedVolume) {
    const volume = Math.round(updatedVolume * 100); // 볼륨 값 (0~100)
    console.log(`Updating volume display. Current volume: ${volume}`);
    volumeText.setText(`Volume: ${volume}`);

  }

  function update() {
    // 속도 초기화
    player.setVelocity(0);
  
    // 대각선 속도 조정을 위해 초기 속도 설정
    let velocityX = 0;
    let velocityY = 0;
  
    // 키 입력에 따라 이동 방향 설정
    if (cursors.left.isDown) {
      velocityX = -200; // 왼쪽으로 이동
    }
    if (cursors.right.isDown) {
      velocityX = 200; // 오른쪽으로 이동
    }
    if (cursors.up.isDown) {
      velocityY = -200; // 위로 이동
    }
    if (cursors.down.isDown) {
      velocityY = 200; // 아래로 이동
    }
  
    // 최종 속도 설정
    player.setVelocity(velocityX, velocityY);
  
    // 애니메이션 실행
    if (velocityX < 0) {
      // 왼쪽으로 이동 (왼쪽 또는 대각선 왼쪽)
      player.anims.play('walk-left', true);
      currentDirection = 'left';
    } else if (velocityX > 0) {
      // 오른쪽으로 이동 (오른쪽 또는 대각선 오른쪽)
      player.anims.play('walk-right', true);
      currentDirection = 'right';
    }
  
    if (velocityY < 0 && velocityX === 0) {
      // 위로 이동 (대각선 제외)
      player.anims.play('walk-up', true);
      currentDirection = 'up';
    } else if (velocityY > 0 && velocityX === 0) {
      // 아래로 이동 (대각선 제외)
      player.anims.play('walk-down', true);
      currentDirection = 'down';
    }
  
    // 키 입력이 없을 때 애니메이션 정지 및 기본 정지 프레임 설정
    if (velocityX === 0 && velocityY === 0) {
      player.anims.stop();
      switch (currentDirection) {
        case 'left':
          player.setFrame(9); // 왼쪽 정지 프레임
          break;
        case 'right':
          player.setFrame(6); // 오른쪽 정지 프레임
          break;
        case 'up':
          player.setFrame(3); // 위쪽 정지 프레임
          break;
        case 'down':
          player.setFrame(0); // 아래쪽 정지 프레임
          break;
      }
    }
  }
  
  new Phaser.Game(config);
  