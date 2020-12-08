var client = require("./connection.js");
//handle bars templating engine
const exphbs = require('express-handlebars');
var express = require('express');
var app = express();

// Middleware to recognize strings and arrays in requests
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('home');
});

const health = require('./health')
app.get('/health', async(req,res)=>{
	const healthData = await health.healthCheck()
	res.render('health',healthData)
})

app.get('/search-title/:title', function (req, res) {
    // Access title like this: req.params.title

    /* Query using slop to allow for unexact matches */
    client.search({
    index: 'search-articles',
    type: 'articles',
    body: {
      "query": {  
        "match_phrase": {
          "Title": { query: req.params.title, slop: 100 }
        }
      }
    }
   
    }).then(function(resp) {
        console.log("Successful query! Here is the response:", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

app.get('/search-title/', async function (req, res) {
	/* Query using slop to allow for unexact matches */
    client.search(
	    {	q:req.query.title
	    	// index: 'search-articles',
	    	// type: 'articles',
		    // body: {
		    //   "query": {  
		    //     "match_phrase": {
		    //       "Title": { query: req.query.title, slop: 100 }
		    //     }
		    //   }
		    // }   
	    }
    ).then(function(resp) {
        console.log("Successful query! Here is the response:", resp);
        res.render('home',resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
})


app.listen(3000, function () {
  console.log('App listening for requests...');
});