
import moment from 'moment';
import acl from "../configs/acl";

import License from "../models/license";

let licenseController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "license";
      return next();
   }

   function findAction (callback){
      License.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/licenses', [control.auth, controller, control.acl], (req, res) => {

      License.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", licenses: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/licenses/:id', [control.auth, controller, control.acl], (req, res) => {

      License.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", license: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/license', [control.auth, controller, control.acl], (req, res) => {

      let license = new License({
         key: req.body.key,
         dateStart: req.body.dateStart,
         months: req.body.months,
         days: req.body.days,
         dateCreate: moment(),
         userCreate: req.user._id,
         dateUpdate: moment(),
         userUpdate: req.user._id
      });

      license.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/license/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         key: req.body.key,
         dateStart: req.body.dateStart,
         months: req.body.months,
         days: req.body.days,
         dateUpdate: moment(),
         userUpdate: req.user._id
      };

      License.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/license/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      License.findByIdAndRemove(filter, function (err, doc) {
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

export default licenseController
