/**
 * crypto-trader
 * 
 * Written by: Jonas-Taha El Sesiy
 */
require('dotenv').config();

const Kraken = require('kraken-api');
const fs = require('fs');
const util = require('util');

const kraken = new Kraken(process.env.KRAKEN_API_KEY, process.env.KRAKEN_API_SECRET, {
    timeout: 60 * 60 * 48 * 1000
});
const amount = process.env.AMOUNT;
const coin = process.env.COIN;
const fiat = process.env.FIAT;

/**
 * Min order amounts as of 08/29/17 (see https://support.kraken.com/hc/en-us/articles/205893708-What-is-the-minimum-order-size):
 * 
 * Augur (REP): 0.3
 * Bitcoin (XBT): 0.002
 * Bitcoin Cash (BCH): 0.002
 * Dash (DASH): 0.03
 * Dogecoin (DOGE): 3000
 * EOS (EOS): 3
 * Ethereum (ETH): 0.02
 * Ethereum Classic (ETC): 0.3
 * Gnosis (GNO): 0.03
 * Iconomi (ICN): 2
 * Litecoin (LTC): 0.1
 * Melon (MLN): 0.1
 * Monero (XMR): 0.1
 * Ripple (XRP): 30
 * Stellar Lumens (XLM): 300
 * Zcash (ZEC): 0.03
 * Tether (USDT): 5
 */
const minOrderSize = {
    REP: 0.3,
    XBT: 0.002,
    BCH: 0.002,
    DASH: 0.03,
    DOGE: 3000,
    EOS: 3,
    ETH: 0.02,
    ETC: 0.3,
    GNO: 0.03,
    ICN: 2,
    LTC: 0.1,
    MLN: 0.1,
    XMR: 0.1,
    XRP: 30,
    XLM: 300,
    ZEC: 0.03,
    USDT: 5
};

(async() => {
    try {
        // Check if coin is valid
        if (!minOrderSize.hasOwnProperty(coin)) {
            console.log('The selected coin is not available for trading on Kraken.');
            return;
        }

        // Assemble pair
        const tradingPair = 'X' + coin + 'Z' + fiat;
        const cryptoPair = coin + '/' + fiat;

        // Retrieve btc/eur price 
        const tickResponse = await kraken.api('Ticker', {
            pair: tradingPair
        });
        const quote = tickResponse['result'][tradingPair]['a'][0];

        if (typeof quote === 'undefined') {
            console.log('Unable to retrieve price for selected pair ' + cryptoPair);
            return;
        }
        const cryptoOrder = (amount / quote).toFixed(6);
        const roundedOrderAmount = (cryptoOrder * quote).toFixed(3);

        // Check whether order amount is sufficient
        if (cryptoOrder < minOrderSize[coin]) {
            console.log('Increase the investment amount. The min order size for ' + coin + ' is ' + minOrderSize[coin] + ' :(');
            return;
        }

        // Append pending order to log
        const logMessage = util.format('[%s] Buying %f %s (= %f %s at price %f %s)\n', new Date().toISOString(), cryptoOrder, coin, roundedOrderAmount, fiat, quote, cryptoPair);
        fs.appendFile('order.log', logMessage, err => {
            if (err) {
                console.log('-- An error has occured: ' + err);
                return;
            }
        });

        // Execute order
        const tradeResponse = await kraken.api('AddOrder', {
            pair: tradingPair,
            volume: cryptoOrder,
            type: 'buy',
            ordertype: 'market'
        });

        // Retrieve txId and append to order log
        const txId = tradeResponse['result']['txid'];
        if (typeof txId === 'undefined') {
            console.log('Unable to retrieve the tx id for your order.');
            return;
        }
        fs.appendFile('order.log', "Tx-Id: " + txId + "\n", err => {
            if (err) {
                console.log('-- An error has occured: ' + err);
                return;
            }
        });

        // Done
        console.log(util.format('[%s] Trade completed successfully, see order.log for details :)', new Date().toISOString()));
    } catch (e) {
        console.log(e);
        // Log to file in case of failure
        fs.appendFile('order.log', util.format('[%s] Unable to execute order: %s\n', new Date().toISOString(), e), err => {
            if (err) {
                console.log('-- Runtime error: ' + err);
            }
        });
    }
})();