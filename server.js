var tako = require('tako')
  , request = require('request')
  , path = require('path')
  , app = tako()
  , PORT = 8000
  , PUBLIC = path.join(__dirname, 'public')
  ;


// the OH GOD this is such a fat JSON blob URL.
app.route('/results.json').json(require('./results.json'))

// only after the other routes are done, should you fuggin serve static shit.
app.route('/*').files(PUBLIC)
// whoops, tako doesn't support index.html!
app.route('/').file(path.join(PUBLIC, 'index.html'))

// app.route('/proxypass', function (req, resp) {
//   req.pipe(request("http://otherserver.com"+req.url)).pipe(resp)
// })

// app.route('/hello.json').json({msg:'hello!'})
// app.route('/plaintext').text('I like text/plain')

// Ported example from socket.io docs to show integration
// app.sockets.on('connection', function (socket) {
//   app.sockets.emit('news', { will: 'be received by everyone'});
//   socket.on('disconnect', function () {
//     app.sockets.emit('user disconnected')
//   })
// })

app.httpServer.listen(PORT)
console.log('node ' + process.version
  + ', tako v' + require('tako/package.json').version
  + ' server running on http://localhost:' + PORT + '/'
)
