
import moment from 'moment';
import acl from "../configs/acl";

import Role from "../models/role";

let roleController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "role";
      return next();
   }

   function findAction (callback){
      Role.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/roles', [control.auth, controller, control.acl], (req, res) => {

      Role.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", roles: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/role/:id', [control.auth, controller, control.acl], (req, res) => {

      Role.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", role: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/role', [control.auth, controller, control.acl], (req, res) => {

      let role = new Role({
         name: req.body.name,
         description: req.body.description,
         dateCreate: moment(),
         userCreate: req.user._id,
         dateUpdate: moment(),
         userUpdate: req.user._id
      });

      role.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/role/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.description,
         dateUpdate: moment(),
         userUpdate: req.user._id
      };

      Role.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/role/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Role.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default roleController
