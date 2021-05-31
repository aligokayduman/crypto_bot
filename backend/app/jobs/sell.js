'use strict'

import pair from "../models/Pair.js";
import ccxt from "ccxt";
import config from "../config/config.js";
import {open,high,low,close} from "../helper/ohlcv.js"
import logger from "../helper/logger.js";

export default async function sell() {

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

    await logger("Start Trailing Process");
    for(let i=0;i<pairs.length;i++){

        await exchange.loadMarkets();
        const coin = pairs[i].name.substring(0,3);        
        
        await logger((i+1).toString()+") "+pairs[i].name);

        if (exchange.has['fetchOpenOrders']){
            const openorders = await exchange.fetchOpenOrders(pairs[i].name);
            const ohlcv = await exchange.fetchOHLCV(pairs[i].name,'3m');
            const currentbar = ohlcv.length-1;  

            if(openorders.length==1){                                
                              
                let candle_signal = false;
                if(
                    //parseFloat(ohlcv[currentbar-2][close]) > parseFloat(ohlcv[currentbar-2][open])
                    parseFloat(ohlcv[currentbar-1][close]) > parseFloat(ohlcv[currentbar-1][open])                   
                ){
                    candle_signal = true;
                }

                await logger("Trailing Signal: "+candle_signal.toString());               
                
                if(candle_signal){
                    //const half = Math.round(Math.abs(ohlcv[currentbar-2][high]-ohlcv[currentbar-2][low])/2);
                    const newprice = parseFloat(ohlcv[currentbar-1][low]); // - parseFloat(half);

                    const lastorderprice = parseFloat(openorders[0].price);
                    if (exchange.has['fetchTrades']){
                        const tradehistory = await exchange.fetchMyTrades(pairs[i].name);
                        const tradeprice = parseFloat(tradehistory[tradehistory.length-1].price);
                    }

                    const minslprice = parseFloat(ohlcv[currentbar][close])-parseFloat(pairs[i].minsl);

                    if(newprice > tradeprice && newprice > lastorderprice && newprice < minslprice){
                        const cancelledorder = await exchange.cancelOrder(openorders[0].id,pairs[i].name);
                        await logger("Order cancelled:");
                        await logger(cancelledorder);
                        
                        if(cancelledorder.status="canceled"){
                            const stoploss = await exchange.createOrder(pairs[i].name,"stop_loss_limit","sell",openorders[0].amount,newprice,{'stopPrice':newprice});
                            await logger("New sell limit order created:");
                            await logger(stoploss);
                        }
                    }
                }

            }else{
                const balance = await exchange.fetchBalance();
                if(balance[coin].free*ohlcv[currentbar][close]>10){
                    const order = await exchange.createOrder(pairs[i].name,"market","sell",balance['WIN'].free);
                    await logger("Market order creates:");
                    await logger(order);
                }
            }
        }
    } 
}