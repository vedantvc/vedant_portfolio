const path = require("path");
const port = 8080;
var http = require('http');
var fs = require('fs');
const { MongoClient } = require('mongodb');
var server = http.createServer(function (req, res) {
  console.log("Request for demo file received.", req.url);

  if (req.url === "/") {
    fs.readFile("./public/index.html", "UTF-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  } else if (req.url.match("\.css$")) {
    var cssPath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, { "Content-Type": "text/css" });
    fileStream.pipe(res);

  } else if (req.url.match("\.png$")) {
    var imagePath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  }
  else if (req.url.match("\.jpg$")) {
    var imagePath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/jpg" });
    fileStream.pipe(res);
  }else if (req.url === '/api') {
    // fs.readFile("./sampleData.json", "utf8", (err, jsonString) => {
    //     if (err) {
    //         console.log("File read failed:", err);
    //         return;
    //     }
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.parse(JSON.stringify(jsonString, null, 2)));
    // });

    const url = 'mongodb+srv://admin:admin@mountain.atqlzne.mongodb.net/?retryWrites=true&w=majority';
    const databasename = "mountaindb"; // Database name
    MongoClient.connect(url).then((client) => {
      const connect = client.db(databasename);
      // Connect to collection
      const collection = connect.collection("mountains");
      collection.find({}).toArray().then((ans) => {
        res.write(JSON.stringify(ans, null, 2));
        res.end();
      });
    }).catch((err) => {
      console.log(err.Message);
    })
  }else{
    res.write("<h1>404 Page Not Found</h1>");
    res.end()


  }
});

server.listen(port);
console.log('Server running at http://localhost:%d',port);
