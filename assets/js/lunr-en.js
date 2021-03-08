var idx = lunr(function () {
  this.field('title', {boost: 10})
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')
});



  
  
    idx.add({
      title: "Pokemons,Birthdays and Cryptography",
      excerpt: "Supose you’re walking on the streets hunting Pokemons in . Your objective is to collect different types of Pokemon, where...",
      categories: [],
      tags: [],
      id: 0
    });
    
  
    idx.add({
      title: "Currency Exchange and Negative Cycles",
      excerpt: "I really enjoy graph problems, because most of the problems the difficulty lies not in the knowledge of various graph...",
      categories: [],
      tags: [],
      id: 1
    });
    
  
    idx.add({
      title: "Quake III and the Fast Inverse Square Root",
      excerpt: "Given a number ,write a program that calculates the inverse square root: Well, it’s not that hard: float inverse_sqrt(float x){...",
      categories: [],
      tags: [],
      id: 2
    });
    
  
    idx.add({
      title: "An Easy Way to Understand Fast Fourier Transforms",
      excerpt: "One of the most remarkable things about Mathematics is how abstraction can lead to real improvements in the real world....",
      categories: [],
      tags: [],
      id: 3
    });
    
  
    idx.add({
      title: "Computational Geometry in C++",
      excerpt: "In this post i just want to make a compilation of useful C++ computational geometry algorithms used in Competitive Programming....",
      categories: [],
      tags: [],
      id: 4
    });
    
  
    idx.add({
      title: "Optimizing Code Performance and control flow with Async",
      excerpt: "Async handling its what makes Node.js a powerful tool but also a confusing one. With C++, Java, C# and other...",
      categories: [],
      tags: [],
      id: 5
    });
    
  


console.log( jQuery.type(idx) );

var store = [
  
    
    
    
      
      {
        "title": "Pokemons,Birthdays and Cryptography",
        "url": "/cableBlog/Pokemons,Birthdays-and-Cryptography/",
        "excerpt": "Supose you’re walking on the streets hunting Pokemons in . Your objective is to collect different types of Pokemon, where...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Currency Exchange and Negative Cycles",
        "url": "/cableBlog/BellmanFord/",
        "excerpt": "I really enjoy graph problems, because most of the problems the difficulty lies not in the knowledge of various graph...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Quake III and the Fast Inverse Square Root",
        "url": "/cableBlog/Quake-and-the-Fast-Inverse-Square-Root/",
        "excerpt": "Given a number ,write a program that calculates the inverse square root: Well, it’s not that hard: float inverse_sqrt(float x){...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "An Easy Way to Understand Fast Fourier Transforms",
        "url": "/cableBlog/FastFourierTransform/",
        "excerpt": "One of the most remarkable things about Mathematics is how abstraction can lead to real improvements in the real world....",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Computational Geometry in C++",
        "url": "/cableBlog/Computational-Geometry-in-C++/",
        "excerpt": "In this post i just want to make a compilation of useful C++ computational geometry algorithms used in Competitive Programming....",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Optimizing Code Performance and control flow with Async",
        "url": "/cableBlog/Optimizing-Code-Performance-and-control-flow-with-Async/",
        "excerpt": "Async handling its what makes Node.js a powerful tool but also a confusing one. With C++, Java, C# and other...",
        "teaser":
          
            null
          
      }
    
  ]

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    var query = $(this).val();
    var result = idx.search(query);
    resultdiv.empty();
    resultdiv.prepend('<p class="results__found">'+result.length+' Result(s) found</p>');
    for (var item in result) {
      var ref = result[item].ref;
      if(store[ref].teaser){
        var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<div class="archive__item-teaser">'+
                '<img src="'+store[ref].teaser+'" alt="">'+
              '</div>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      else{
    	  var searchitem =
          '<div class="list__item">'+
            '<article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork">'+
              '<h2 class="archive__item-title" itemprop="headline">'+
                '<a href="'+store[ref].url+'" rel="permalink">'+store[ref].title+'</a>'+
              '</h2>'+
              '<p class="archive__item-excerpt" itemprop="description">'+store[ref].excerpt+'</p>'+
            '</article>'+
          '</div>';
      }
      resultdiv.append(searchitem);
    }
  });
});
