var fs = require('fs')

var dummyData = {
  results: []
}

var headers = {
  'Content-Type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var sendResponse = function(response, statusCode = 200, data = dummyData) {
  response.writeHead(statusCode, headers)
  response.end(JSON.stringify(data))
}

var collectData = function(request, callback) {
  var body = ''
  request.on('data', function(chunk) {
    body += chunk
  })
  request.on('end', function() {
    callback(JSON.parse(body))
  })
}

var actions = {
  'GET': function(request, response) {
    sendResponse(response)
  },
  'POST': function(request, response) {
    collectData(request, function(message) {
      dummyData.results.push(message)
    })
    sendResponse(response, 201)
  },
  'OPTIONS': function(request, response) {
    sendResponse(response)
  }
}

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url !== "/classes/messages" && request.url !== "/" && request.url !== "/client/index.html") {
    sendResponse(response, 404, "Sorry, not found.")
    return
  }

  var action = actions[request.method]
  if (action) {
    action(request, response)
  }

};

module.exports.requestHandler = requestHandler
