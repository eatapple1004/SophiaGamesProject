// scripts.js

// 모든 game-item 요소를 가져옵니다.
const gameItems = document.querySelectorAll('.game-item');

// 각 game-item에 클릭 이벤트를 추가합니다.
gameItems.forEach((item) => {
    item.addEventListener('click', () => {
        const link = item.getAttribute('data-link'); // data-link 속성 값 가져오기

        // Axios 요청 보내기
        axios.post('http://localhost:3000/api/redirectTheStranger', { link })
            .then((response) => {
                // 백엔드가 반환한 URL로 이동
                window.location.href = response.data.redirectUrl;
            })
            .catch((error) => {
                console.error('Error during redirection:', error);
            });
    });
});
