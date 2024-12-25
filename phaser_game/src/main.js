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
        debug: false, // 디버그 비활성화
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
  
  function preload() {
    this.load.image('player', '../assets/images/sample.png'); // 캐릭터 이미지
    this.load.image('background', '../assets/images/background.jpg'); // 배경 이미지
  }
  
  function create() {
    // 배경 이미지 추가 및 크기 조정
    const background = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(window.innerWidth, window.innerHeight); // 화면 크기에 맞게 배경 조정
  
    // 플레이어 캐릭터 추가 및 초기 위치 설정
    player = this.physics.add.sprite(400, 300, 'player').setScale(0.2);
    player.setCollideWorldBounds(true); // 화면 밖으로 나가지 않도록 설정
  
    // 키 입력 설정
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
  }
  
  function update() {
    // 플레이어 이동 속도 초기화
    player.setVelocity(0);
  
    // 화살표 키 입력에 따른 속도 설정
    if (cursors.left.isDown) {
      player.setVelocityX(-400); // 왼쪽 이동
    } else if (cursors.right.isDown) {
      player.setVelocityX(400); // 오른쪽 이동
    }
  
    if (cursors.up.isDown) {
      player.setVelocityY(-400); // 위로 이동
    } else if (cursors.down.isDown) {
      player.setVelocityY(400); // 아래로 이동
    }
  }
  
  new Phaser.Game(config);
  