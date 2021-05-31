'use strict'

import pair from "../models/Pair.js";
import ccxt from "ccxt";
import config from "../config/config.js";
import {time,open,low,close} from "../helper/ohlcv.js"
import logger from "../helper/logger.js";

export default async function buy() {

    const exchangeId = 'binance'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
        'apiKey': config.binance_key,
        'secret': config.binance_secret,
        'timeout': 30000,
        'enableRateLimit': true,
        'createMarketBuyOrderRequiresPrice': false,
    });

    const pairs = await pair.findAll({where:{status: true}});

    await logger("Start Order Process");    
    for(let i=0;i<pairs.length;i++){

        await logger((i+1).toString()+") "+pairs[i].name);        

        await exchange.loadMarkets();
        const symbol = exchange.markets[pairs[i].name];
        const coin = pairs[i].name.substring(0,3);

        const ohlcv = await exchange.fetchOHLCV(pairs[i].name,'3m');
        const currentbar = ohlcv.length-1;

        let balance = await exchange.fetchBalance();
        const existprice = balance[coin].total * ohlcv[currentbar][close];
        
        if(existprice < 10){           

            let candle_signal = false;     
            let half = 0;   
            if(
                parseFloat(ohlcv[currentbar-3][close]) < parseFloat(ohlcv[currentbar-3][open])
                && parseFloat(ohlcv[currentbar-2][close]) < parseFloat(ohlcv[currentbar-2][open])
                && parseFloat(ohlcv[currentbar-1][close]) > parseFloat(ohlcv[currentbar-1][open])               
            ){
                //half = (Math.abs(ohlcv[currentbar-2][high]-ohlcv[currentbar-1][low])/2).toFixed(symbol.precision['price']);
                
                const isalreadytrade = false;
                if (exchange.has['fetchTrades']){
                    const tradehistory = await exchange.fetchMyTrades(pairs[i].name);
                    if (tradehistory[tradehistory.length-1].timestamp > ohlcv[currentbar][time]) isalreadytrade = true;
                }
                
                if(!isalreadytrade){
                    if (parseFloat(ohlcv[currentbar][close]) > parseFloat(ohlcv[currentbar-1][close])) {
                        candle_signal = true;
                    }
                }              
            }            
           
            await logger("Buy Signal: "+candle_signal.toString());
            
            if(candle_signal){        
    
                const cost = (parseFloat(balance['USDT'].free)/20 > 20) ? parseFloat(balance['USDT'].free)/20 : 20;
                let amount = Math.floor(cost/parseFloat(ohlcv[currentbar][4]));
                const order = await exchange.createOrder(pairs[i].name,"market","buy",amount);
                await logger("Market order creates:");
                await logger(order);
    
                if(order['status']=='closed'){

                    balance = await exchange.fetchBalance();
                    amount = balance[coin].free;
                    const minslprice = parseFloat(order.price)-parseFloat(pairs[i].minsl);
                    const stopprice = (parseFloat(ohlcv[currentbar-2][low]) < minslprice) ? parseFloat(ohlcv[currentbar-2][low]) : minslprice;                 
    
                    const stoploss = await exchange.createOrder(pairs[i].name, "stop_loss_limit", "sell", amount, stopprice, {'stopPrice':stopprice});
                    await logger("New sell limit order created:");
                    await logger(stoploss);
                }               
    
            } 
        }else{
            await logger("Order already opened");
        }
    } 
}