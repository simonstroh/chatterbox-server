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

// var processDependency = function(url, response) {
//   fs.readFileSync(url, function(err, data) {
//     if (err) throw err;
//     response.writeHead({'Content-Type': 'text/html'})
//     response.end(data)
//   })
// }
//
// var readDependencies = {
//   '/client/styles/styles.css': function(url, response) {
//     processDependency(url, response)
//   },
//   '/client/scripts/app.js': function(url, response) {
//     processDependency(url, response)
//   },
//   '/?username': function(url, response) {
//     processDependency('Users/student/Desktop/hrsf96-chatterbox-server/client/index.html', response)
//   },
//   '/': function(url, response) {
//     processDependency('Users/student/Desktop/hrsf96-chatterbox-server/client/index.html', response)
//   }
// }

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // var dependency = readDependencies[request.url]
  // if (dependency) {
  //   dependency(request.url, response)
  // }

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

// if (request.method === 'GET' && request.url === "/classes/messages" || request.url === "/") {
//   response.writeHead(200, headers);
//   response.end(JSON.stringify(dummyData));
// } else if (request.method === 'POST' || request.method === 'OPTIONS' && request.url === "/classes/messages") {
//   var body = ''
//   request.on('data', (chunk) => body += chunk)
//   console.log('this is the request:', request)
//   console.log('this is the dummy data:', dummyData)
//   console.log('this is the data body:', body)
//   request.on('end', function () {
//     response.writeHead(201, headers);
//     dummyData.results.push(JSON.parse(body))
//     console.log("Dummy Data After End:", dummyData)
//     response.end(JSON.stringify(dummyData));
//   });
// } else if (request.url !== "/classes/messages" && request.url !== '/') {
//   response.writeHead(404, headers)
//   response.end();
// }


// Create parsed url
// var parsedUrl = url.parse(request.url);

// // Convert parsed url into pathname
// var pathname = request.url;

// // Check if file system exists for pathname
// fs.exists(pathname, function(exists){
//   if (!exists) {
//     response.writeHead(404, headers)
//     response.end();
//     return;
//   }
//   if (fs.statSync(pathname).isDirectory()) {
//     pathname += '../client/index.html';
//   }
//   fs.readFile(pathname, function(error, data) {
//     if (error) {
//       console.log(pathname)
//     } else {
//       response.setHeader(headers)
//       response.end(data)
//     }
//   })
// })
