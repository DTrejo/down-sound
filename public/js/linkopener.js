var count = 0;
var links = new Array();

function addToLinks() {
  $("my-new-list").each(function(){
    links.push($(this).attr("href"));
  });
}

function useMyArray() {
  console.log('hi', links.length);
  for (i=0; i < links.length; i++) {
    window.open(links[i]);
  }
}

// $(document).ready(function(){
//   addToLinks();
// 
//   $("button").first().click(function(event){
//     useMyArray();
//   });
//   
//   $.getJSON('/60s.json', function(data) {
//     console.log (data);
//     // var items = [];
//     // 
//     $.each(data, function(key, val) {
//       items.push('<li id="' + key + '">' + val + '</li>');
//     });
//     
//     $('<ul/>', {
//        'class': 'my-new-list',
//        html: links.join('')
//      }).appendTo('body');
//   });
// });

$(document).ready(function(){
  $.getJSON('/60s.json', function(data) {
    console.log(data);
    
    var container = $('#download-links');
    var template = $('#download-links .template');
    data.forEach(function(song, i) {
      var item = template.clone();
      item.removeClass('template');
      console.log(item.find('a'));
      item.find('a').attr("href", song.link)
      container.append(item);
      
      // inside of song
      console.log(song.link);
    });
    
  });
  
  
  $("button").first().click(function(event){
    useMyArray();
  });
});
