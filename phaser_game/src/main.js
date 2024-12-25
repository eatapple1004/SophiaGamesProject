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
  
  function preload() {
    this.load.image('background', '../assets/images/background.jpg'); // 배경 이미지
    this.load.spritesheet('player', '../assets/images/player.png', {
      frameWidth: 32, // 각 프레임의 너비
      frameHeight: 48, // 각 프레임의 높이
    });
  }
  
  function create() {
    // 배경 설정
    const background = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(window.innerWidth, window.innerHeight);
  
    // 플레이어 추가
    player = this.physics.add.sprite(400, 300, 'player', 0); // 초기 프레임 설정
    player.setScale(2); // 크기 확대
    player.setCollideWorldBounds(true); // 경계 제한
  
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
      });
  
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
  
  function update() {
    // 속도 초기화
    player.setVelocity(0);
  
    // 키 입력에 따라 이동 및 애니메이션 실행
    if (cursors.left.isDown) {
      player.setVelocityX(-200); // 왼쪽으로 이동
      player.anims.play('walk-left', true); // 걷기 애니메이션 실행
      currentDirection = 'left'; // 현재 방향 업데이트
    } else if (cursors.right.isDown) {
      player.setVelocityX(200); // 오른쪽으로 이동
      player.anims.play('walk-right', true);
      currentDirection = 'right';
    } else if (cursors.up.isDown) {
      player.setVelocityY(-200); // 위로 이동
      player.anims.play('walk-up', true);
      currentDirection = 'up';
    } else if (cursors.down.isDown) {
      player.setVelocityY(200); // 아래로 이동
      player.anims.play('walk-down', true);
      currentDirection = 'down';
    } else {
      // 키 입력이 없을 때 애니메이션 정지 및 기본 정지 프레임 설정
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
  