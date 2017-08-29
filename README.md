crypto-trader
====

## Investing using Dollar Cost Averaging strategy

This node script let you set a daily amount to invest on any cryptocurrency pair that's available via [kraken crypto exchange](https://kraken.com).

### Dollar Cost Averaging

> Dollar cost averaging (DCA) is an investment strategy with the goal of reducing the impact of volatility on large purchases of financial assets such as equities. Dollar cost averaging is also called the constant dollar plan (in the US), pound-cost averaging (in the UK), and, irrespective of currency, as unit cost averaging or the cost average effect.

> By dividing the total sum to be invested in the market (e.g. $100,000) into equal amounts put into the market at regular intervals (e.g. $1000 over 100 weeks), DCA hopes to reduce the risk of incurring a substantial loss resulting from investing the entire "lump sum" just before a fall in the market. Dollar cost averaging is not always the most profitable way to invest a large sum, but it is alleged to minimize downside risk. The technique is said to work in markets undergoing temporary declines because it exposes only part of the total sum to the decline. The technique is so-called because of its potential for reducing the average cost of shares bought. As the amount of shares that can be bought for a fixed amount of money varies inversely with their price, DCA effectively leads to more shares being purchased when their price is low and fewer when they are expensive. As a result, DCA possibly can lower the total average cost per share of the investment, giving the investor a lower overall cost for the shares purchased over time.

> Finance journalist Dan Kadlec of Time summarized the relevant research in 2012, writing: "The superior long-term returns of lump sum investing [over DCA] have been acknowledged for more than 30 years." Similarly, decades of empirical research on DCA has found that it does not function as promoted, and is a sub-optimal investment strategy.

Source: [Wikipedia](https://en.wikipedia.org/wiki/Dollar_cost_averaging)

### Setting the right investment amount
Figure out how much you'd like to invest over a certain period of time.
Let's assume I want to invest 10000 EUR in Ethereum over the course of 6 months:

> 10000 / (6 * 30) = 10000 / 180 = approx. 55€ / day

I will then setup my `.env` file

```sh
KRAKEN_API_KEY=myKrakenKeyHere
KRAKEN_API_SECRET=myKrakenSecretKeyHere
AMOUNT=55.55
COIN=ETH
FIAT=EUR
```

### Pre-requisites

- Node >= 8
- A wallet for the appropriate coin or multi-currency wallet, i.e. [Jaxx](https://jaxx.io/)

### Usage

This snippet clones the repo, `cd` in it, installs and installs all required dependencies and renames the `.env.sample` so you can set it up according to your needs.  

```sh
git clone github.com/elsesiy/crypto-trader.git && cd crypto-trader && npm i && mv .env.example .env
```

**Scheduling**

Run the script via `node index.js` as often as you'd like to invest or setup a cronjob or deploy it on Heroku with a [custom clock process](https://devcenter.heroku.com/articles/scheduled-jobs-custom-clock-processes)

### Contributing

Feel free to open up an issue or PR if you've any remarks.


Inspired by [bitcoin-trading-dca](https://github.com/0x13a/bitcoin-trading-dca). 