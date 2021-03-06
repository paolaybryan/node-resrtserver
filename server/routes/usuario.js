const express = require('express');
const bcrypt = require('bcrypt');
const _ =require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken , verificaAdmin_Role }= require('../middlewares/autenticacion');
const app = express();

app.get('/usuario',verificaToken, function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);
 // Usuario.find({google:true})
  Usuario.find( { estado:true },'nombre email role estado google img')//para excluir
            .skip(desde)
            .limit(limite)
            .exec((err , usuarios )=>{

              if( err ){
                 return res.status(400).json({
                   ok:false,
                   err
                 });
              }
              Usuario.count({estado:true} ,(err, conteo) =>{
                res.json({
                  ok:true,
                  usuarios,
                  cuantos:conteo
                });
              })
               
            });

});



app.post('/usuario', {verificaToken , verificaAdmin_Role},function (req, res) {
  let body = req.body;
  let usuario = new Usuario({
      nombre:body.nombre,
      email:body.email,
      password:bcrypt.hashSync(body.password,10),
      role:body.role
  });//usuario != Usuario
usuario.save((err,usuarioDB) =>{
    if( err ){
       return res.status(400).json({
         ok:false,
         err
       });
    }


      res.json({
        ok:true,
        usuario:usuarioDB
      });

});//error y usuario

  // if(body.nombre === undefined){
  //     res.status(400).json({
  //       ok:false,
  //       mensaje:"El nombre es necesario"
  //     });
  // }else{
  //   res.json({
  //     persona:body
  //   });
  // }
});


app.put('/usuario/:id', {verificaToken , verificaAdmin_Role},function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body,['nombre','email','img','role','estado']);
  //let body = req.body;
  //Usuario.findById(id ,(err , usuarioDB )=>{
  //Usuario.findByIdAndUpdate(id , body ,{new:true}, (err , usuarioDB )=>{
    Usuario.findByIdAndUpdate(id , body ,{new:true,runValidators:true}, (err , usuarioDB )=>{

    if( err ){
       return res.status(400).json({
         ok:false,
         err
       });
    }

    res.json({
      ok:true,
      usuario:usuarioDB
    });

  });
});

app.delete('/usuario/:id',{verificaToken , verificaAdmin_Role}, function (req, res) {
  //res.json('Delete usuario');
  let id = req.params.id;
  let cambiaEstado = {
      estado:false
  };

 // Usuario.findByIdAndRemove(id,(err, usuarioBorrado) => {
   Usuario.findByIdAndRemove(id,cambiaEstado,{new:true,runValidators:true}, (err, usuarioBorrado) => {
    if( err ){
      return res.status(400).json({
        ok:false,
        err
      });
   };

      if(usuarioBorrado === null){//if(usuarioBorrado === null){
            return res.status(400).json({
            ok:false,
            err:{
              message: 'Usuario no encontrado'
            }
        });
   }

   res.json({
     ok:true,
     usuario: usuarioBorrado
   });

  });

});

module.exports = app;
