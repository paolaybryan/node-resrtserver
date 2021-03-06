require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//config goblal 
app.use(require('./routes/index'));
//mongoose.set('useCreateIndex',true);
mongoose.connect(process.env.URLDB , {useNewUrlParser: true}, (err, res )=>{
//si logra abrir la coneccion callback
    if( err ){
      throw err;
    }else{
      console.log('Base de datos ONLINE');
    }

});


app.listen(process.env.PORT,()=>{
  console.log('Escuchando el puerto',3000);
});
