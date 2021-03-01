const fs = require('fs');
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const streamsPage = fs.readFileSync(`${__dirname}/../client/streams.html`)

const get404Response = (request, response) => {
    response.writeHead(404, { 'Content-Type': 'text/html'});
	response.write(errorPage);
	response.end();
};

const getStreams = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(streamsPage);
    response.end();
}

module.exports.get404Response = get404Response;
module.exports.getStreams = getStreams;