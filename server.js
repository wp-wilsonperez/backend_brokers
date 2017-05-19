
import http from 'http';
import favicon from 'serve-favicon';

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import sha1 from 'sha1';
import cors from 'cors';
import crypto from 'crypto';
import moment from 'moment';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as BearerStrategy} from 'passport-http-bearer';


const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost/brokers');
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
   secret: 'SECRET-KEY',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(__dirname + '/public'));

app.get('/test', function (req, res, next) {
  res.json({msg: 'Enviado desde el Servidor'})
})

import User from './app/models/user';
import Token from './app/models/token';

let localStrategy = new LocalStrategy({
      usernameField: 'cedula',
      passwordField: 'password',
      session: false
      }, (username, password, done) => {
         console.log(sha1(password));
   User.findOne({cedula: username, password: sha1(password)}, (err, doc) => {
      if(err) {
         done(null, false, {
            message: 'Error'
         });
      }
      if(doc) {
         let generatedToken = crypto.randomBytes(32).toString('hex');
         let token = new Token({
            token: generatedToken,
            idUser: doc._id,
            created: moment(),
            expirated: moment()
         });

         token.save((err, doc) => { console.log("has been created a access token");});
         return done(null, {
            _id: doc._id,
            cedula: doc.cedula,
            name: doc.name,
            lastName: doc.lastName,
            userImg: doc.userImg,
            idRol: doc.idRol,
            token: generatedToken
         });
      }else {
         done(null, false, {
            message: 'Unkown user'
         });
      }      
   });
});

let bearerStrategy = new BearerStrategy(
   function(token, cb) {
      Token.findOne({token: token}, function(err, doc) {
         if (err) { return cb(err); }
         if (!doc) { return cb(null, false); }
         return cb(null, doc);
      });
   });

passport.use(localStrategy);
passport.use(bearerStrategy);
passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });


import businessController from './app/controllers/business';
businessController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import moduleController from './app/controllers/module';
moduleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import licenseController from './app/controllers/license';
licenseController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import roleController from './app/controllers/role';
roleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import userController from './app/controllers/user';
userController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import homeController from './app/controllers/home';
homeController(app, {auth: passport.authenticate('bearer', { error: "wrong token" })});

function ensureAuth (req, res, next){
   /*let $AUTH = req.query.AUTH ? true : false;
   if ($AUTH) {
      req.user = {
         _id: 0,
         cedula: "0000000000",
         name: "name",
         lastName: "lastName",
         userImg: "",
         idRol: 0
      }
      return next();
   }
   if(req.isAuthenticated()) {
      return next();
   }
   console.log("LOGIN NO");
   return res.status(401).send({"login": false});*/

   passport.authenticate('bearer', { session: false })
}

import acl from './app/configs/acl';
function ensureACL (req, res, next){
   return next();
   let $AUTH = req.query.AUTH ? true : false;
   if ($AUTH) {
      return next();
   }
   for(let key in acl.controller[req.controller].endpoint){
      if(acl.controller[req.controller].endpoint[key].uri == req.route.path){
         console.log(acl.controller[req.controller].endpoint[key].uri);
         console.log(" - - - - ");
         console.log(req.route.path);
         let rol = acl.controller[req.controller].endpoint[key].rol;
         //if(rol.indexOf(req.user.rol) > -1)
            return next();
      }
   }
   return res.status(401).send({"privilege": false});
}


let server = http.createServer(app).listen(port, () => {
   console.log(`El servidor esta levantado en el puerto ${port}`);
});
