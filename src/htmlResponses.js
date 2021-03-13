const fs = require('fs');
const path = require('path');
const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const streamsPage = fs.readFileSync(`${__dirname}/../client/streams.html`)
const favoritesPage = fs.readFileSync(`${__dirname}/../client/favorites.html`);
const stylesPage = fs.readFileSync(`${__dirname}/../client/default-styles.css`);
const adminPage = fs.readFileSync(`${__dirname}/../client/admin.html`);

const getIndex = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(indexPage);
    response.end();
};

const get404Response = (request, response) => {
    response.writeHead(404, { 'Content-Type': 'text/html'});
	response.write(errorPage);
	response.end();
};

const getStreams = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(streamsPage);
    response.end();
};

const getFavorites = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(favoritesPage);
    response.end();
};

const getCSS = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(stylesPage);
    response.end();
};

const getAdmin = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(adminPage);
    response.end();
}

const getLogo = (request, response) => {
    loadFile(request, response, "../assets/logo.png", 'image/png')
}

const loadFile = (request, response, dir, type) => {
    const file = path.resolve(__dirname, dir);
  
    fs.stat(file, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          response.writeHead(404);
        }
        return response.end(err);
      }
  
      let { range } = request.headers;
  
      if (!range) {
        range = 'bytes=0-';
      }
  
      const positions = range.replace('bytes=', '').split('-');
  
      let start = parseInt(positions[0], 10);
  
      const total = stats.size;
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  
      if (start > end) {
        start = end - 1;
      }
  
      const chunksize = (end - start) + 1;
  
      response.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': type,
      });
  
      const stream = fs.createReadStream(file, { start, end });
  
      stream.on('open', () => {
        stream.pipe(response);
      });
  
      stream.on('error', (streamErr) => {
        response.end(streamErr);
      });
  
      return stream;
    });
  };

module.exports = {
    getIndex,
    get404Response,
    getStreams,
    getFavorites,
    getCSS,
    getAdmin,
    getLogo
}