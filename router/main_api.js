require('../Def');

const express = require("express");
const fs      = require('fs');
const path    = require('path'); 
var axios     = require('axios');
var router    = express.Router();




router.use(function(req, res, next) { next(); });

router.get('/sendImage', function(req, res) {
  console.log('send_image.js')  
  res.send('Success call send_image.js');
});


/**
 * @path (POST) /redirectTheStranger
 * Game_Novel_Project :: Save Image
*/
router.post('/redirectTheStranger', (req, res) => {
    const { link } = req.body; // 프론트엔드에서 보낸 링크 가져오기

    console.log("hi");

    if (link) {
        res.json({ redirectUrl: 'http://localhost:3000/albertcamus/thestranger' }); // 응답으로 리디렉션 URL 반환
    } else {
        res.status(400).json({ error: 'Link not provided' });
    }
});

/**
 * @path (POST) /upload
 * Game_Novel_Project :: Save Image
*/
router.post('/upload', async (req, res) => {
    
    try {
        var url = encodeURI("https://api.openai.com/v1/chat/completions");

        var header = {
            'Authorization': 'Bearer '+ DEF_GPT_API_KEY, 
            'Content-Type': 'application/json'
        }
       
        const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        console.log("파일이 저장된 경로: ", imagePath);

        const base64Image = await convertImageToBase64(imagePath);

        console.log(base64Image)

        var data = {
            model:"gpt-4o",
            messages:[
                {
                  "role": "user",
                  "content": [
                      {
                          "type": "text", 
                          "text": "Can you see any Teeth relate Diseases? if you see, then what number of teeth have? And do not use word 'I' "
                      },
                      {
                          "type": "image_url",
                          "image_url": {
                              "url": "data:image/png;base64,{"+base64Image+"}"
                          },
                      },
                  ],
                }
            ],
            max_tokens:300
        }

        var config = {
          method  : 'post',
          url     :  url,
          headers :  header,
          data    :  data
        };
  
        axios(config)
        .then(function (response) {
            
            const responseFromGPT = JSON.stringify(response.data.choices[0].message.content)
            console.log("response data :: " + responseFromGPT);
            // API 응답 전송
            res.json({
                responseFromGPT
            });
            
        })
        .catch(function (error) {
            console.log(error.message);
        });
 
    
    } catch (error) {
      console.error('API 요청 실패:', error);
      res.status(500).json({ success: false, message: 'API 요청에 실패했습니다.' });
    } finally {
      //업로드된 이미지 파일 삭제
      fs.unlinkSync(imagePath);
    }
});

module.exports = router;