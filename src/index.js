const http = require('http');

const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Call the function relevant to POST request endpoint.
const handlePost = (request, response, parsedUrl) => {
  if(parsedUrl.pathname === '/addStream'){
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      responseHandler.addStream(request, response, bodyParams);
    });
  }
}

const handleGet = (request, response, parsedUrl) => {

  const params = query.parse(parsedUrl.query);

  //Call the function relevant to GET request endpoint.
  if(parsedUrl.pathname === '/'){
    htmlHandler.getIndex(request, response);
  } else if(parsedUrl.pathname ==='/logo.png'){
    htmlHandler.getLogo(request, response);
  } else if(parsedUrl.pathname === '/app'){
    htmlHandler.getStreams(request, response);
  } else if(parsedUrl.pathname === '/default-styles.css'){
    htmlHandler.getCSS(request, response);
  }else if(parsedUrl.pathname === '/search'){
    responseHandler.loadStreams(request, response, params);
  } else if(parsedUrl.pathname === '/favorites'){
    htmlHandler.getFavorites(request, response);
  }else if(parsedUrl.pathname === '/getStreams'){
    responseHandler.getStreams(request, response);
  } else if(parsedUrl.pathname === '/admin'){
    htmlHandler.getAdmin(request, response);
  } else{
    htmlHandler.get404Response(request, response);
  }
}

const onRequest = (request, response) => {
  //console.log(request.headers);
  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  console.log(pathname);
  //console.log(params);

  if(request.method === 'POST'){
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};


// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);