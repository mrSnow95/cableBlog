var idx = lunr(function () {
  this.field('title', {boost: 10})
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.ref('id')
});



  
  
    idx.add({
      title: "Pokemons,Birthdays and Cryptography",
      excerpt: "Supose you’re walking on the streets hunting Pokemons in \\(Pokemon Go\\). Your objective is to collect \\(N\\) different types of...",
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
      excerpt: "Given a number \\(x\\) ,write a program that calculates the inverse square root: \\[y = \\frac{1}{\\sqrt{x}}\\] Well, it’s not that...",
      categories: [],
      tags: [],
      id: 2
    });
    
  
    idx.add({
      title: "Computational Geometry in C++",
      excerpt: "In this post i just want to make a compilation of useful C++ computational geometry algorithms used in Competitive Programming....",
      categories: [],
      tags: [],
      id: 3
    });
    
  
    idx.add({
      title: "Optimizing Code Performance and control flow with Async",
      excerpt: "Async handling its what makes Node.js a powerful tool but also a confusing one. With C++, Java, C# and other...",
      categories: [],
      tags: [],
      id: 4
    });
    
  
    idx.add({
      title: "Node.js and MySQL",
      excerpt: "Node.js is able to connect to MySQL database servers, but support for this is not built in. We need to...",
      categories: [],
      tags: [],
      id: 5
    });
    
  
    idx.add({
      title: "Don't abuse the Spread Operator",
      excerpt: "Here I was on my spare time doing some problems on Binary Search and I was doing this easy one...",
      categories: [],
      tags: [],
      id: 6
    });
    
  
    idx.add({
      title: "Python & Flask",
      excerpt: "To begin: sudo pip install flask Flask is a good choice for a REST API because it is: Written in...",
      categories: [],
      tags: [],
      id: 7
    });
    
  
    idx.add({
      title: "Async Javascript",
      excerpt: "Computer programs, such as scientific simulations, are CPU Bound: they run continuously, with no pause, until they have computed their...",
      categories: [],
      tags: [],
      id: 8
    });
    
  
    idx.add({
      title: "Asynchronous request batching and caching",
      excerpt: "Caching plays a critical role in high load applications, and it’s used almost everywhere on the web, from static resources...",
      categories: [],
      tags: [],
      id: 9
    });
    
  
    idx.add({
      title: "Scalability and Architectural Patterns in Node.js",
      excerpt: "Node.js is a non-blocking single thread architecture that works great for applications handling a moderate number of requests per second...",
      categories: [],
      tags: [],
      id: 10
    });
    
  
    idx.add({
      title: "A Simple Neural Net",
      excerpt: "Neurons A neuron is the basic unit of a neural network. A neuron takes inputs, does some math with them,...",
      categories: [],
      tags: [],
      id: 11
    });
    
  
    idx.add({
      title: "Async Initialization in Node.js",
      excerpt: "Tasks that are trivial in traditional synchronous programming can become more complicated when applied to asynchronous programming. A typical example...",
      categories: [],
      tags: [],
      id: 12
    });
    
  
    idx.add({
      title: "Multivariable Calculus",
      excerpt: "Multivariable Calculus and Linear Algebra are my favorite subjects in Math. Mainly because we can manipulate entitites that are way...",
      categories: [],
      tags: [],
      id: 13
    });
    
  


console.log( jQuery.type(idx) );

var store = [
  
    
    
    
      
      {
        "title": "Pokemons,Birthdays and Cryptography",
        "url": "/cableBlog/Pokemons,Birthdays-and-Cryptography/",
        "excerpt": "Supose you’re walking on the streets hunting Pokemons in \\(Pokemon Go\\). Your objective is to collect \\(N\\) different types of...",
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
        "excerpt": "Given a number \\(x\\) ,write a program that calculates the inverse square root: \\[y = \\frac{1}{\\sqrt{x}}\\] Well, it’s not that...",
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
          
      },
    
      
      {
        "title": "Node.js and MySQL",
        "url": "/cableBlog/Node.js-and-MySQL/",
        "excerpt": "Node.js is able to connect to MySQL database servers, but support for this is not built in. We need to...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Don't abuse the Spread Operator",
        "url": "/cableBlog/Don't-abuse-the-spread-operator/",
        "excerpt": "Here I was on my spare time doing some problems on Binary Search and I was doing this easy one...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Python & Flask",
        "url": "/cableBlog/Python-&-Flask/",
        "excerpt": "To begin: sudo pip install flask Flask is a good choice for a REST API because it is: Written in...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Async Javascript",
        "url": "/cableBlog/Async-Javascript/",
        "excerpt": "Computer programs, such as scientific simulations, are CPU Bound: they run continuously, with no pause, until they have computed their...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Asynchronous request batching and caching",
        "url": "/cableBlog/Asynchronous-request-batching-and-caching/",
        "excerpt": "Caching plays a critical role in high load applications, and it’s used almost everywhere on the web, from static resources...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Scalability and Architectural Patterns in Node.js",
        "url": "/cableBlog/Scalibility-and-Architectural-Patterns/",
        "excerpt": "Node.js is a non-blocking single thread architecture that works great for applications handling a moderate number of requests per second...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "A Simple Neural Net",
        "url": "/cableBlog/A-Simple-Neural-Net/",
        "excerpt": "Neurons A neuron is the basic unit of a neural network. A neuron takes inputs, does some math with them,...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Async Initialization in Node.js",
        "url": "/cableBlog/Async-Initialization-in-Node.js/",
        "excerpt": "Tasks that are trivial in traditional synchronous programming can become more complicated when applied to asynchronous programming. A typical example...",
        "teaser":
          
            null
          
      },
    
      
      {
        "title": "Multivariable Calculus",
        "url": "/cableBlog/Multivariable-Calculus/",
        "excerpt": "Multivariable Calculus and Linear Algebra are my favorite subjects in Math. Mainly because we can manipulate entitites that are way...",
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
