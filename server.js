const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const MongoClient = require('mongodb').MongoClient
var db

MongoClient.connect('mongodb://admin:admin@ds141358.mlab.com:41358/ironhacks', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
})
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').count({"name": req.body.name},{"quotes": req.body.quotes}, function(error, numOfDocs){
            if(error) return console.log(error)

        
             var string = encodeURIComponent(req.body.name);
            if(numOfDocs > 0) 
              res.redirect('/user?id=' +string)
            else
               res.render('index.ejs')
        });
    });  


app.post('/signup', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.render('index.ejs')
   
  })
})

app.get('/user', (req, res) => {
  res.render('user.ejs',{
    name:req.query.id
})});



app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
   
    res.render('index.ejs', {message:req.query.success})
  })
})
