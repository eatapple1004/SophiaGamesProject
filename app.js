require('./Def');  

//express 모듈 불러오기
const express = require("express");
const path = require('path');
const axios = require('axios');
const cors = require('cors');  

const app = express();

const https = require('https');
const http = require('http');
const fs = require('fs');

app.use(express.json());
//app.use(express.urlencoded({ extended: true}));
app.use(cors());

// 'public' 폴더에 있는 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
// 'phaser_game' 폴더에 있는 정적 파일 제공
app.use(express.static(path.join(__dirname, 'phaser_game')));

// 'uploads' 폴더를 정적 파일 제공 폴더로 설정
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

var api_main = require('./router/main_api.js');

app.use('/api', api_main);

app.get("/info", (req, res) => {
    //Hello World 데이터 반환
    res.send(DEF_APP_TITLE + " made by "+ DEF_APP_GREATE_DATE);
});

app.get('/mainpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/main.html'));
});

app.get('/albertcamus/thestranger', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/thestrangerpage.html'));
});

app.get('/sample', (req, res) => {
    res.sendFile(path.join(__dirname, 'phaser_game/gamelist/index.html'));
});

// 등록되지 않은 패스에 대해 페이지 오류 응답 
app.all('*', function(req, res) { 
    res.status(404).send("<center><h1>ERROR - Unable to find a Page.</h1>\r\n<h2>" + DEF_APP_TITLE + " by YJ</h2></center>"); 
  });

  //HTTP 서버 시작
if(DEF_USING_HTTP == true)
{
    if(typeof DEF_EVP_LOCAL_HTTP_PORT != 'undefined') 
    {
        // Create an HTTP service.
        http.createServer(app).listen(DEF_EVP_LOCAL_HTTP_PORT, () => console.log(DEF_APP_TITLE  + " HTTP Server For Test(" + DEF_EVP_LOCAL_HTTP_PORT +")"));
    }
}

// 사용에 대한 확인  필요
if(DEF_USING_HTTPS == true)
{
    if(typeof DEF_EVP_LOCAL_HTTPS_PORT != 'undefined') 
    {
        // Create an HTTPS service identical to the HTTP service.
        https.createServer(options, app).listen(DEF_EVP_LOCAL_HTTPS_PORT,  () => console.log(DEF_APP_TITLE  + " HTTPS Server For Test(" + DEF_EVP_LOCAL_HTTPS_PORT +")"));
    }
}