// var count = 0;
// var links = new Array();
// 
// function addToLinks() {
//   $('my-new-list').each(function(){
//     links.push($(this).attr('href'));
//   });
// }
// 
// function useMyArray() {
//   console.log('hi', links.length);
//   for (i=0; i < links.length; i++) {
//     window.open(links[i]);
//   }
// }

$(document).ready(function(){
  $.getJSON('/electronic.json', function(data) {
    
    var container = $('#download-links');
    var template = $('#download-links .template');
    data.sort(function(a, b) {
      return parseInt(b.nominal || 0, 10) - parseInt(a.nominal || 0, 10);
    });
    data.forEach(function(song, i) {
      var item = template.clone();
      item.removeClass('template');
      item.find('a').attr('href', song.link);
      item.find('a')
        .text(
          (song.nominal || '')
          +' '+(song.name || song.artist) 
          + ' — ' + song.title);
      container.append(item);
    });
    template.remove();
    
  });
  
  $('button').first().click(function(event){
    var links = [];
    $('#download-links a').each(function(i, el) {
      var url = $(el).attr('href');
      links.push(url);
    });

    links.forEach(function(link) {
      window.open(link);
    });
  });
});
