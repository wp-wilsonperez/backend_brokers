
import sha1 from 'sha1';
import moment from 'moment';
import acl from "../configs/acl";

import User from "../models/user";

let userController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "user";
      return next();
   }

   app.get('/login', (req, res) => {

      res.render('user/login');
   });

   app.post('/login', (req, res, next) => {
      control.passport.authenticate('local', (err, user) => {
      switch (req.accepts('html', 'json')) {
         case 'html':
            if (err) { return next(err); }
            if (!user) { return res.redirect(303, '/login'); }
            console.log(user);
            req.logIn(user, function (err) {
               if (err) { return next(err); }
               return res.redirect('/admin');             
            });
            break;
         case 'json':
            if (err)  { return next(err); }
            if (!user) { return res.status(401).send({"login": false}); }
            req.logIn(user, function (err) {
               if (err) { return res.status(401).send({"login": false}); }
               return res.send({"login": true, "username": user.username});
            });
            break;
         default:
            res.status(406).send();
      }

      })(req, res, next);
      
   });
   
   app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
   });

   app.get('/admin', [control.auth, controller, control.acl], (req, res) => {

      let userSession = false;
      if(req.user){
         userSession = req.user;
      }

      res.render('user/admin', {userSession: userSession});
      
   });

   app.get('/users', [control.auth, controller, control.acl], (req, res) => {

      let userSession = false;
      if(req.user){
         userSession = req.user
      }
      User.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.render('user/index', {userSession: userSession, users: docs});
         } else {
            res.send({
               result : 'error',
               err : err.code
            });
         }
      });

   });

   app.get('/useradd', [control.auth, controller, control.acl], (req, res) => {

      let userSession = false;
      if(req.user){
         userSession = req.user;
      }

      res.render('user/add', {userSession: userSession, rols: acl.rol});
      
   });

   app.post('/user/add', [control.auth, controller, control.acl], (req, res) => {

      let user = new User({
         firstname: req.body.firstname,
         lastname: req.body.lastname,
         username: req.body.username,
         password: sha1(req.body.password),
         role_id: req.body.role_id,
         img: "user.jpg"
      });
      user.save((err, resp) => {
         if(err){
            console.log(err);
            res.status(401).send({"save": false});
         } else {
            console.log(user);   
            res.send({"save": true});
         }            
      });

   });

   app.get('/testacl', [control.auth, controller, control.acl], (req, res) => {

      res.send({"resp": "no"});

   });
}

export default userController
