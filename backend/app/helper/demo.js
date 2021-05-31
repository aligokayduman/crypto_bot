'use strict';

import { Sequelize } from 'sequelize';
import Pair from '../models/Pair.js';
import Parameter from '../models/Parameter.js';
import User from '../models/User.js';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/app/db/bot.db',
    logging: false
});

export default async function demo(){

    Pair.sync();
    Parameter.sync();
    User.sync();
    console.log("DB syncronized.");

    Pair.findAndCountAll().then(result => {
        if(result.count==0) {            
            Pair.create({name: "WIN/USDT",status:true,minsl:0.0000050}).then(()=>{
            });
            Pair.create({name: "BTT/USDT",status:true,minsl:0.0000050}).then(()=>{            
            });
            console.log("Demo rows inserted in the tables.");        
        }
    });    

    Parameter.findAndCountAll().then(result => {
        if(result.count==0) {
        Parameter.create({iscronrunning: false}).then(()=>{
            console.log("First rows inserted in the Parameters table.");
        });        
        }
    });

    User.findAndCountAll().then(result => {
        if(result.count==0) {
            User.create({username: 'admin',password:'1234',token:'12345678'}).then(()=>{
                console.log("First rows inserted in the User table.");
        });        
        }
    });    

}