'use strict';

import {Router} from 'express';
import AdminController from "../controllers/AdminController.js";
import GuestController from '../controllers/GuestController.js';
import RestApi from "../controllers/RestApi.js";
import passport from 'passport';
import passportlocal from 'passport-local';
import passportbearer from 'passport-http-bearer';
import User from '../models/User.js';
import bcrypt from 'bcrypt-nodejs';

const router = Router();
const LocalStrategy =  passportlocal.Strategy;
const BearerStrategy = passportbearer.Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({where:{username: username}}).then(function(user){
        if (!user) {
            return done(null, false);
          }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }
 
        return done(null, user);
      }).catch(err=>{ 
        return done(err);
      })      
    }
  ));

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({where:{token: token}}).then(function(user){
      if (!user) {
          return done(null, false);
        }
      
      return done(null, user, { scope: 'read' });
    }).catch(err=>{ 
      return done(err);
    });
  }
));  

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(user => { 
        if (user) {
            done(null, user); 
        } 
    }).catch(err =>{
        done(err, user);
    });
}); 

//Parallax
router.get('/',GuestController.getIndex);

//Auth
router.get('/login',isLoggedIn,GuestController.getLogin);


router.post('/login',
    passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: false })
                                   );

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});                                   

//Admin
router.get('/admin',isAuthorize,AdminController.getIndex);

//Rest Api
router.post('/rest/pairs', passport.authenticate('bearer', { session: false }), RestApi.create);
router.get('/rest/pairs', passport.authenticate('bearer', { session: false }), RestApi.findAll);
router.get('/rest/pairs/:Id', passport.authenticate('bearer', { session: false }), RestApi.findOne);
router.put('/rest/pairs/:Id', passport.authenticate('bearer', { session: false }), RestApi.update);
router.delete('/rest/pairs/:Id', passport.authenticate('bearer', { session: false }), RestApi.remove);

function isAuthorize(req, res, next) { 
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) return res.status(302).redirect('/admin');
    return next();    
};

export default router;