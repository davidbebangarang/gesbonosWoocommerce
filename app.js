const express = require('express');
const app = express();
const path = require('path');
const consumo = require('./modules/consumo');
const ticketsController = require('./controllers/ticketsController');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Routes
const indexRoutes = require('./routes/index');
app.use(indexRoutes);
//app.get('/consumo/:dni', ticketsController.validate);
app.get('/validate',ticketsController.validate);
app.get('/consume/:id/:quantity',ticketsController.consume);

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

//consumo();

app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});