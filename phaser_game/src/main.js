// Phaser 게임 설정
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // 초기 화면 너비를 창 너비로 설정
    height: window.innerHeight, // 초기 화면 높이를 창 높이로 설정
    scale: {
        mode: Phaser.Scale.RESIZE, // 화면 크기가 변경되면 자동으로 조정
        autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙 정렬
    },
    scene: {
        preload,
        create,
        update,
    },
};
  
  
// 리소스 로드
function preload() {

    this.load.image('player', '../assets/images/sample.png');
    this.load.image('background', '../assets/images/background.jpg');
    

}

// 게임 초기화
function create() {

    const background = this.add.sprite(0, 0, 'background');
    background.setScale(1);
    const logo = this.add.image(400, 300, 'player'); // x=400, y=300에 이미지 추가
    logo.setScale(0.2); // 이미지 크기를 50%로 조정
}

// 게임 루프
function update() {}

// Phaser 게임 실행
new Phaser.Game(config);
  