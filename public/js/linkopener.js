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
