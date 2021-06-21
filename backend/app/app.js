'use strict';

import express from 'express';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import cron from 'node-cron';
import start from './jobs/start.js';
import routes from './routes/index.js';
import demo from './helper/demo.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

const app = express();
const __dirname = path.resolve(path.dirname(''));

//Sync DB and import demo rows
await demo();

//cors controller
const corsOptions = {
  origin: 'http://localhost:3000' 
}
app.use(cors(corsOptions));

// view engine setup
app.use( ejsLayouts );
app.set('views', path.join(__dirname, './app/views'));
app.set('layout','layouts/admin');
app.set('view engine', 'ejs');

//Static Files
app.use(express.static(path.join( __dirname, 'public')));

//BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//passport for login
app.use(session({     
  secret: 'srgasfhsegfdnsfh',
  resave: false,
  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use(routes);

//Server Up
app.listen(8080);
console.log('http://localhost:8080');

//Schedule cron jobs
cron.schedule('*/5 * * * * *', function(){
    //start();
});

export default app;