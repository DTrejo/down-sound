require 'rubygems'  
require 'active_record'
require 'hpricot'
require 'uri'
require 'rest-open-uri'
require 'json'

# # # # # # # # # # # # # # # # #
# Super badass last fm scraper #
# # # # # # # # # # # # # # # #
$base = 'http://www.last.fm'
$results = Hash.new("results")

# get a page
def get_page(uri, results)
  dom = open(uri) { |f| Hpricot(f) }
  container = (dom/'#freeTracks')
  links = container.search('li')
  links.each do |li|
    song = Hash.new('song')

    # get link
    o = li.search('.lfmFreeDownloadButton')
    sub = o[0].attributes['href']
    song['link'] = sub
  
    # get image
    o = li.search('.trackImage')
    sub = o.search('img')[0].attributes['src']
    song['image'] = sub
  
    # get title
    o = li.search('.trackTitle')
    sub = o[0].inner_html
    song['title'] = sub
  
    # get artist
    o = li.search('.trackArtist')
    sub = o[0].inner_html
    song['artist'] = sub

    results << song
  end

  begin
    nextlink = (dom/".nextlink")[0].attributes['href']
    puts nextlink
    get_page($base + nextlink, results)
  rescue
    return results
  end
end

# get all genres
def get_genres(uri)
  dom = open(uri) { |f| Hpricot(f) }
  list = dom.search(".tagList")
  links = list.search("a")
  links.each do |tag|
    tag_link = tag.attributes['href']
    tag_title = tag.inner_html
    songs = []
    nexturi = URI.encode($base + tag_link)
    get_page(nexturi, songs)
    $results[tag_title] = songs
    print "#{tag_title} done"
  end
end

get_genres('http://www.last.fm/music/+free-music-downloads')
File.open("results.json","w") do |f|
  f.write($results.to_json)
end