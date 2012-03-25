var fs = require('fs')
var async = require('async')
var _ = underscore = require('underscore')
var match = require('JSONSelect').match

var all = require('./results2.json')
var nbs = require('./nextbigsound')
var SCORE_TYPE = 'nominal'


// returns first key and the value stored there in an object
function firstKey(o) {
  for (var k in o) break
  return k
}

var ids = _.unique(match('.artistId', all))

// ids = ids.slice(0, 22);

var INTERVAL = 20
var tasks = []
_.range(0, ids.length, INTERVAL)
.forEach(function(i) {
  var end = Math.min(i+INTERVAL, ids.length)
  var bunch = ids.slice(i, end)
  // tasks.push(async.apply(rank, end, ids.length, bunch));
  tasks.push(async.apply(rank, end, ids.length, bunch));
})

function rank(end, total, list, cb) {
  console.log('fetching up to', end, 'of', total);
  nbs.rank(list.join('-'), SCORE_TYPE, cb);
}

async.series(tasks, function(err, results) {
  if (err) console.log(new Error(err.message))
  results = _.flatten(results)
  console.log('done fetching.')
  console.log(results);
  console.log('now adding rank info to results3.json');

  var idToScore = {}
  results.forEach(function(r) {
    idToScore[r.artist_id] = r.score
  })
  console.log(idToScore);
  var allRanked =
    all.map(function(song) {
      if (!song.artistId) return song;
      song[SCORE_TYPE] = idToScore[song.artistId]
      return song
    })

  console.log('===')
  console.log(allRanked.length)
  fs.writeFile('./results3.json', JSON.stringify(allRanked), 'utf8', onWrite)
})

function onWrite(err) {
  if (err) console.log(new Error(err.message))
  console.log('done!')
}
