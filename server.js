var tako = require('tako')
  , request = require('request')
  , path = require('path')
  , app = tako()
  , PORT = 8000
  , PUBLIC = path.join(__dirname, 'public')
  , _ = underscore = require('underscore')
  , match = require('JSONSelect').match
  ;

// the OH GOD this is such a fat JSON blob URL.
var songs = require('./results3.json');
app.route('/results.json').json(songs)

var categories = _.unique(match('.category', songs))

categories.forEach(function(catname) {
  var route = '/' + catname + '.json'
  var json = match('.category:val("'+catname+'")', songs)
  console.log('auto-route', 'http://localhost:8000'+route, json.length);
  app.route(route).json(json)
})


// only after the other routes are done, should you fuggin serve static shit.
app.route('/*').files(PUBLIC)
// whoops, tako doesn't support index.html!
app.route('/').file(path.join(PUBLIC, 'index.html'))

// app.route('/proxypass', function (req, resp) {
//   req.pipe(request("http://otherserver.com"+req.url)).pipe(resp)
// })
// app.route('/hello.json').json({msg:'hello!'})
// app.route('/plaintext').text('I like text/plain')

app.httpServer.listen(PORT)
console.log('node ' + process.version
  + ', tako v' + require('tako/package.json').version
  + ' server running on http://localhost:' + PORT + '/'
)
