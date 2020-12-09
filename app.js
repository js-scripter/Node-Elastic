var client = require("./connection.js");
//handle bars templating engine
const exphbs = require('express-handlebars');
const request = require("request-promise-native")
const shortid = require('shortid');
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
    client.search(
	    {	q:req.query.title   }
    ).then(function(resp) {
        console.log("Successful query! Here is the response:", resp);
        res.render('home',resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
})

app.get('/addTitleForm',(req,res)=>{
  res.render('insertTitleForm');
})

app.post('/addTitle',(req,res)=>{
  const ssid = shortid.generate();
  const {Title,MetaDescription,MetaKeywords ,Categories,Tags,Status}=req.body
  let url = "http://localhost:9200/articles/_doc/" //+ ssid
    let payload = {
        url: url, 
        body: {
          Title: Title, 
          MetaDescription: MetaDescription,
          MetaKeywords:MetaKeywords,
          Categories:Categories,
          Tags:Tags,
          Status:Status
        },
        json: true
    }
    console.log(payload)
    request.post(payload)
    res.redirect('/')
})
app.get('/editTitleForm/:id',(req,res)=>{
  client.search({
    index: 'search-articles',
    type: 'articles',
    body: {
      "query": {  
        "match_phrase": {
          "_id": { query: req.params.id, slop: 100 }
        }
      }
    }
  }).then(function(resp) {
      console.log("Successful query! Here is the response:", JSON.stringify(resp));
      res.render('editTitleForm',resp);
  }, function(err) {
      console.trace(err.message);
      res.send(err.message);
  });


})
app.post('/editTitle',(req,res)=>{
  const {_id,Title,MetaDescription,MetaKeywords ,Categories,Tags,Status}=req.body
  let url = "http://localhost:9200/articles/_doc/" + _id
  let payload = {
    url: url, 
    body: {
      Title: Title, 
      MetaDescription: MetaDescription,
      MetaKeywords:MetaKeywords,
      Categories:Categories,
      Tags:Tags,
      Status:Status
    },
    json: true
  }
  console.log(payload)
  request.put(payload)
  res.redirect('/')
})


app.listen(3000, function () {
  console.log('App listening for requests...on 3000');
});