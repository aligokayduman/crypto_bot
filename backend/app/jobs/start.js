'use strict'

import buy from './buy.js';
import sell from './sell.js';
import {getParameter, setParameter} from '../helper/parameter.js';
import logger from '../helper/logger.js'

export default async function start() {

    try{

        if(await getParameter('iscronrunning')) return;
        await setParameter('iscronrunning',true);
        
        await logger('Job started');
        await sell(); //trailing stop
        await buy(); //alım emirleri
        await logger('Job finished');

    }catch(err){
        await logger(err);
    }finally{
        await setParameter('iscronrunning',false);   
    }   

}