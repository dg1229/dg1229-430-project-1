require('dotenv').config();
const { google } = require('googleapis');

let streamList = [];

/**
 * Starter code for YouTube Data API functionality sourced from YouTube Video
 * Video URL: https://www.youtube.com/watch?v=QZ4BXGgmATU
 * Video Author: Anson the Developer
 */


const loadStreams = (request, response, query) => {
    google.youtube('v3').search.list({
    key: process.env.API_KEY,
    part: "snippet",
    eventType: "live",
    maxResults: 25,
    q: "gaming",
    type: [
        "video"
      ]
    }).then((apiResponse) => {
        const{ data } = apiResponse;
        data.items.forEach((item) => {
            streamList.push(item.snippet);
        })
        writeStreams(request, response, query);
    }).catch((err)=> console.log(err));
}

const writeStreams = (request, response, params) => {

    //console.log(streamList[0]);

    response.writeHead(200, { 'Content-Type': 'application/json'});
    response.write("[");
    for(let i = 0; i < streamList.length; i++){
        response.write(JSON.stringify(streamList[i]));
        if(i < streamList.length-1){
            response.write(",");
        }
    }
    response.write("]");
    response.end();
}

module.exports.loadStreams = loadStreams;