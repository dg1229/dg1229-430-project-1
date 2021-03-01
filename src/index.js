const http = require('http');

const url = require('url');
const query = require('querystring');

const responseHandler = require('./responses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/search': responseHandler.loadStreams,
  '/streams': htmlHandler.getStreams,
  notFound: htmlHandler.get404Response
};

const onRequest = (request, response) => {
  //console.log(request.headers);
  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  console.log(pathname);

  if(urlStruct[pathname]){
	urlStruct[pathname](request, response, params);
  }else{
    urlStruct.notFound(request,response);
  }
};


// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);