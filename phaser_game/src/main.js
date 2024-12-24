import Phaser from 'phaser';

// 게임 설정
const config = {
  type: Phaser.AUTO,            // WebGL 또는 Canvas 자동 선택
  width: 800,                   // 게임 프레임의 너비
  height: 600,                  // 게임 프레임의 높이
  backgroundColor: '#3498db',   // 배경색
  parent: 'game-container',     // HTML의 div ID
  scene: {
    create,                     // 씬의 생성 함수
  },
};

// Phaser 게임 객체 생성
const game = new Phaser.Game(config);

// create 함수: 게임 화면 초기화
function create() {
  // 텍스트 표시
  this.add.text(300, 250, 'Hello Phaser!', {
    font: '32px Arial',
    color: '#ffffff',
  });
}
