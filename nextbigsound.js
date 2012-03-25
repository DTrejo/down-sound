var request = require('request')
  , BASE = 'http://ddtrejo.api3.nextbigsound.com/'
  , SEARCH = BASE + 'artists/search.json?q='
  , RANK = BASE + 'artists/rank/'

// module.exports = rate

// returns first key and the value stored there in an object
function firstKey(o) {
  for (var k in o) break;
  return k
}

function search(artist, cb) {
  var url = SEARCH + encodeURIComponent(artist)

  request(url, function(err, res, body) {
    cb(null, JSON.parse(body))
  })
}

// the data args called back with looks like this:
// callback(err, '303567', { 
//    name: 'Childish Gambino',
//    music_brainz_id: '7fb57fba-a6ef-44c2-abab-2fa3bdee607e',
//    stars: '18'
// })

function searchPickFirst(artist, cb) {
  search(artist, function(err, data) {
    if (err) return cb(new Error(err.message));
    var id = firstKey(data)
    var info = data[id];
    
    return cb(null, id, info)
  })
}

function constructRankUrl(ids, type) {
  if (!type) type = 'nominal'
  // http://ddtrejo.api3.nextbigsound.com/artists/rank/TYPE/ARTIST-IDS.json
  return RANK + type + '/' + ids.join('-') + '.json'
}

// get rankings of an artist
function rank(ids, cb) {
  if (typeof ids === 'string') ids = [ ids ]
  
  var url = constructRankUrl(ids);
  request(url, function(err, res, body) {
    if (err) return cb(new Error(err.message))

    return cb(null, JSON.parse(body))
  })
}

// artist is a string containing the artist's name.
function view(artist, cb) {
  var options = {};
  request(options, function(err, res, body) {

    cb(new Error('not implemented'))
  });
}

if (require.main === module) {
  var ARTIST = 'childish gambino'
  var ID = '303567'
  // searchPickFirst(artist, function(err, id, info) {
  //   console.log(id)
  //   console.log(info)
  // })
  
  rank(ID, function(err, r) {
    console.log(r);
  })

}
