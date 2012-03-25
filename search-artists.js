var fs = require('fs')
var async = require('async')
var _ = underscore = require('underscore')
var match = require('JSONSelect').match

var cats = require('./results.json')
var nbs = require('./nextbigsound')


// returns first key and the value stored there in an object
function firstKey(o) {
  for (var k in o) break
  return k
}

var results = match('.artist', cats)

var artists = _.unique(results);
console.log('total', artists.length);

var tasks = {}

artists.forEach(function(name) {
  tasks[name] = async.apply(nbs.search, name);
})

var all = []

async.series(tasks, insertAndWrite);
function insertAndWrite(err, results) {
  if (err) return console.log(new Error(err.message))

  _.each(cats, function(cat, catname) {
    _.each(cat, function(song, i) {
      var lastfmName = song.artist

      song.category = catname;

      // if no data was fetched for it, ignore.
      if (!results[lastfmName]) return
      
      var id, nbsResult
      // we put in empty stats in this case.
      if (results[lastfmName].status === 'error') {
        id = false;
        nbsResult = {}

      // success case
      } else {
        id = firstKey(results[lastfmName])
        nbsResult = results[lastfmName][id]
      }
    
      if (id) song.artistId = id
      song = _.extend(song, nbsResult)

      all.push(song)
    })
  })

  console.log('===')
  console.log(all.length)
  fs.writeFile('./results2.json', JSON.stringify(all), 'utf8', onWrite)
}
function onWrite(err) {
  if (err) console.log(new Error(err.message))
  console.log('done!')
}
