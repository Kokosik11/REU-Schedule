const rtfToHTML = require('@iarna/rtf-to-html');
// const rtfToHTML = require('rtf-parser'); // JSON FORMAT

const express = require('express');
const http = require('http');
const https = require('https');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

const fs = require('fs');
const path = require('path');
const request = require('request');

const getFiles = async () => {
    // nodeFetch('https://reu.by/index.php?option=com_dropfiles&view=frontcategories&format=json&id=281&top=281').then(data => {
    //     console.log(data);
    // })

    let file = fs.createWriteStream(`file.rtf`);
    await new Promise((resolve, reject) => {
        let stream = request({
            uri: 'https://reu.by/files/803/20092021-24092021/2793/--211.rtf',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            gzip: true
        })
        .pipe(file)
        .on('finish', () => {
            console.log(`The file is finished downloading.`);
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`Something happened: ${error}`);
    });
}

app.get("/", async (req, res) => {
    getFiles().then(() => {
        fs.createReadStream("file.rtf").pipe(rtfToHTML((err, html) => {
            if(err) console.log(err);
            else res.send(html);
        }))
    })

})

app.listen(8800, () => {
    console.log("Server is starting");
})