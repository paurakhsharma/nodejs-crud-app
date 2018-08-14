var express = require('express'),
 path = require('path'),
 bodyParser = require('body-parser'),
 cons = require('consolidate'),
 dust = require('dustjs-helpers'),
 app = express(),
 multer = require('multer'),
 sharp = require('sharp'),
 fs = require('fs');

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
  cb(null, `${path.join(__dirname, 'public/images/recipeImage/')}`)
 },
 filename: function(req, file, cb) {
  cb(null, Date.now() + '.jpg')
 }
})


var upload = multer({
 storage: storage
})


const {
 Pool,
 Client
} = require('pg');

const pool = new Client({
 user: 'postgres',
 host: 'localhost',
 database: 'recipebookdb',
 password: '********',
 port: 5432,
})

pool.connect();
pool.query('CREATE table IF NOT EXISTS recipes (id serial primary key, name text unique not null, ingredients text not null, direction text not null, imageName varchar(17))')
// Assign dust engine to .dust Files
app.engine('dust', cons.dust);

// Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));

app.get('/', (req, res) => {
 pool.query('SELECT * FROM recipes ORDER BY id desc', (err, result) => {
  if (err) {
   return console.error('error running query', err);
  }
  res.render('index', {
   recipes: result.rows
  });
 });
});

app.post('/add', upload.single('filetoupload'), function(req, res, next) {

 name        = req.body.name        !== "" ? req.body.name : null;
 ingredients = req.body.ingredients !== "" ? req.body.ingredients : null;
 direction   = req.body.direction   !== "" ? req.body.direction : null;
 if (req.file) {
    imageName = req.file.filename
    sharp('public/images/recipeImage/' + imageName).resize(300, 300).toBuffer(function(err, buffer) {
        console.log('public/images/recipeImage/' + imageName)
        fs.writeFile('public/images/recipeImage/' + imageName, buffer, function(e) {
            console.log(e)
        });
    });
   } else {
    imageName = null
   }

 pool.query("INSERT INTO recipes(name, ingredients, direction, imageName) VALUES($1, $2, $3, $4)", [name, ingredients, direction, imageName]);
 res.redirect('/');
});

app.post('/edit', upload.single('filetoupload'), function(req, res, next) {
 name        = req.body.name        !== "" ? req.body.name : null;
 ingredients = req.body.ingredients !== "" ? req.body.ingredients : null;
 direction   = req.body.direction   !== "" ? req.body.direction : null;
 if (req.file) {
  imageName = req.file.filename
  sharp('public/images/recipeImage/' + imageName).resize(300, 300).toBuffer(function(err, buffer) {
    console.log('public/images/recipeImage/' + imageName)
    fs.writeFile('public/images/recipeImage/' + imageName, buffer, function(e) {
        console.log(e)
    });
});
 } else {
  imageName = req.body.imageName
 }
 pool.query("UPDATE recipes SET name=$1, ingredients=$2, direction=$3, imageName=$4 WHERE id=$5", [name, ingredients, direction, imageName, req.body.id]);
 res.redirect('/');
});

app.delete('/delete/:id', (req, res) => {
 pool.query("DELETE FROM recipes WHERE id = $1", [req.params.id]);
});

// Server
app.listen(3000, function() {
 console.log('Server started on port 3000');
});