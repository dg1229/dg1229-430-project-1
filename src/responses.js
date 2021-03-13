require('dotenv').config();
const { google } = require('googleapis');

let streamList = [];
let channels = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json'});
    response.write(JSON.stringify(object));
    response.end();
}

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, {'Content-Type': 'application/json' });
    response.end();
}


/**
 * Starter code for YouTube Data API functionality sourced from YouTube Video
 * Video URL: https://www.youtube.com/watch?v=QZ4BXGgmATU
 * Video Author: Anson the Developer
 */
//Get relevant streams from the YouTube Data API
const loadStreams = (request, response, query) => {
    streamList = [];
    google.youtube('v3').search.list({
    key: process.env.API_KEY,
    part: "snippet",
    eventType: "live",
    regionCode: "US",
    maxResults: 25,
    q: query.term,
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

//Write streams retrieved from YouTube Data API
const writeStreams = (request, response) => {
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

//Confirm data and write with the relevant function.
const addStream = (request, response, body) => {
    const responseJSON = {
        message: 'Channel name and url are both required',
    };

    if(!body.name || !body.url) {
        responseJSON.id ='missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if(channels[body.name]){
        responseCode = 204;
    } else{
        channels[body.name] = {};
        channels[body.name].name = body.name;
    }

    channels[body.name].url = body.url;

    if(responseCode === 201){
        responseJSON.message = 'Stream added Successfully!';
        return respondJSON(request,response,responseCode,responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

//Return list of favorted streams/channels
const getStreams = (request, response, body) => {
    const responseJSON = {
        channels,
    };

    return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
    loadStreams,
    addStream,
    getStreams
}