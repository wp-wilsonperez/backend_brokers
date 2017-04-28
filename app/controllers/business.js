
import sha1 from 'sha1';
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import acl from "../configs/acl";

import Business from "../models/business";

const pathRender = `uploads/business`;
const pathBusiness = `./public/${pathRender}`;

if (!fs.existsSync(pathBusiness)){
    fs.mkdirSync('business');
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathBusiness);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("businessImg");

let businessController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "business";
      return next();
   }

   function findAction (callback){
      Business.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/businesses', [control.auth, controller, control.acl], (req, res) => {

      Business.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", businesses: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/businesses/:id', [control.auth, controller, control.acl], (req, res) => {

      Business.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", business: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/business', [control.auth, controller, control.acl], (req, res) => {

      let business = new Business({
         ruc: req.body.ruc,
         name: req.body.name,
         userMaster: req.body.userMaster,
         password: sha1(req.body.password),
         phone: req.body.phone,
         movil: req.body.movil,
         address: req.body.address,
         businessImg: req.body.businessImg,
         name: req.body.name,
         description: req.body.description,
         constitutionDate: req.body.constitutionDate,
         parking: req.body.parking,
         numberBus: req.body.numberBus,
         mail: req.body.mail,
         web: req.body.web,
         Enabled: req.body.Enabled,
         Actived: req.body.Actived,
         key: "key Aleatorio",
         nameBBDD: "name BBDD",
         dateCreate: moment(),
         userCreate: req.user._id,
         dateUpdate: moment(),
         userUpdate: req.user._id
      });

      business.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/business/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         ruc: req.body.ruc,
         name: req.body.name,
         userMaster: req.body.userMaster,
         password: sha1(req.body.password),
         phone: req.body.phone,
         movil: req.body.movil,
         address: req.body.address,
         businessImg: req.body.businessImg,
         name: req.body.name,
         description: req.body.description,
         constitutionDate: req.body.constitutionDate,
         parking: req.body.parking,
         numberBus: req.body.numberBus,
         mail: req.body.mail,
         web: req.body.web,
         Enabled: req.body.Enabled,
         Actived: req.body.Actived,
         dateUpdate: moment(),
         userUpdate: req.user._id
      };

      Business.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/business/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Business.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/businessImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $businessImg = `${req.file.filename}`;
            res.send({msg: "OK", businessImg: $businessImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/businessImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $businessImgPath = `${pathBusiness}/${req.params.name}`;
      fs.unlink($businessImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default businessController
