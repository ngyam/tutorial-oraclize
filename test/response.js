const FuelPrice = artifacts.require("FuelPrice.sol");
const YoutubeViews = artifacts.require("YoutubeViews.sol");
const KrakenPrice = artifacts.require("KrakenPriceTicker.sol");

const web3 = new (require('web3'))();

contract('FuelPrice', accounts => {
  // define variable to hold the instance of our Template.sol contract
  let fuelPrice

  // use fresh contract for each test
  beforeEach('Setup contract for each test', async function () {
    fuelPrice = await FuelPrice.new({ value: web3.utils.toWei("1", "ether") })
  })

  // check that it sends a query and receives a response
  it('sends a diesel price query and receives a response', async function () {

    // set this test to timeout after 1 minute
    this.timeout(60 * 1000)

    // call the getRandomNumber function
    // make sure to send enough Ether and to set gas limit sufficiently high
    const result = await fuelPrice.updateDiesel({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
      gas: '5000000',
    })

    // Method 1 to check for events: loop through the "result" variable

    // look for the NewOraclizeQuery event to make sure query sent
    let testPassed = false // variable to hold status of result
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i]
      if (log.event === 'NewOraclizeQuery') {

        testPassed = true
      }
    }
    assert(testPassed, '"NewOraclizeQuery" event not found')

    // Method 2 to check for events: listen for them with .watch()

    // listen for LogResultReceived event to check for Oraclize's call to _callback
    // define events we want to listen for
    const NewPrice = fuelPrice.NewPrice()

    // create promise so Mocha waits for value to be returned
    let checkForNumber = new Promise((resolve, reject) => {
      // watch for our LogResultReceived event
      NewPrice.watch(async function (error, result) {
        if (error) {
          reject(error)
        }
        // template.randomNumber() returns a BigNumber object
        const bigNumber = await fuelPrice.dieselPriceUSD.call()
        // convert BigNumber to ordinary number
        const dieselPriceUSD = bigNumber.toNumber()
        // stop watching event and resolve promise
        NewPrice.stopWatching()
        resolve(dieselPriceUSD)
      }) // end LogResultReceived.watch()
    }) // end new Promise

    // call promise and wait for result
    const dieselPriceUSD = await checkForNumber
    // ensure result is within our query's min/max values
    assert.notEqual(dieselPriceUSD, 0, 'Diesel price was zero.')

  });

  // check that it sends a query and receives a response
  it('sends an electricity price query and receives a response', async function () {

    // set this test to timeout after 1 minute
    this.timeout(60 * 1000)

    // call the getRandomNumber function
    // make sure to send enough Ether and to set gas limit sufficiently high
    const result = await fuelPrice.updateElectric({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether'),
      gas: '5000000',
    })

    // Method 1 to check for events: loop through the "result" variable

    // look for the NewOraclizeQuery event to make sure query sent
    let testPassed = false // variable to hold status of result
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i]
      if (log.event === 'NewOraclizeQuery') {

        testPassed = true
      }
    }
    assert(testPassed, '"NewOraclizeQuery" event not found')

    // Method 2 to check for events: listen for them with .watch()

    // listen for LogResultReceived event to check for Oraclize's call to _callback
    // define events we want to listen for
    const NewPrice = fuelPrice.NewPrice()

    // create promise so Mocha waits for value to be returned
    let checkForNumber = new Promise((resolve, reject) => {
      // watch for our LogResultReceived event
      NewPrice.watch(async function (error, result) {
        if (error) {
          reject(error)
        }
        // template.randomNumber() returns a BigNumber object
        const bigNumber = await fuelPrice.electricPriceUSD.call()
        // convert BigNumber to ordinary number
        const electricPriceUSD = bigNumber.toNumber()
        // stop watching event and resolve promise
        NewPrice.stopWatching()
        resolve(electricPriceUSD)
      }) // end LogResultReceived.watch()
    }) // end new Promise

    // call promise and wait for result
    const electricPriceUSD = await checkForNumber
    // ensure result is within our query's min/max values
    assert.notEqual(electricPriceUSD, 0, 'Electricity price was zero.')

  });
});

contract('YoutubeViews', accounts => {

  let youtubeViews

  beforeEach('Setup contract for each test', async function () {
    youtubeViews = await YoutubeViews.new()
  })

  it('queries youtube views and receives a response', async function () {

    this.timeout(60 * 1000)

    const result = await youtubeViews.update({
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether'),
      gas: '5000000',
    })
    let testPassed = false
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i]
      if (log.event === 'NewOraclizeQuery') {

        testPassed = true
      }
    }
    assert(testPassed, '"NewOraclizeQuery" event not found')
    const NewYoutubeViewsCount = youtubeViews.NewYoutubeViewsCount()

    let checkForNumber = new Promise((resolve, reject) => {
      NewYoutubeViewsCount.watch(async function (error, result) {
        if (error) {
          reject(error)
        }
        const views = await youtubeViews.viewsCount.call()
        NewYoutubeViewsCount.stopWatching()
        resolve(views)
      })
    })
    const views = await checkForNumber
    assert.notEqual(views, "", 'Gangnam style viewcount was zero. How can it be?')
  });

});

contract('KrakenPriceTicker', accounts => {

  let krakenPriceTicker

  beforeEach('Setup contract for each test', async function () {
    krakenPriceTicker = await KrakenPrice.new({value: web3.utils.toWei("1", "ether") })
  })

  it('sends a kraken price query and receives a response after 60 sec', async function () {

    this.timeout(120 * 1000)

    const result = await krakenPriceTicker.update({
      from: accounts[0],
      value: web3.utils.toWei('0.5', 'ether'),
      gas: '5000000',
    })

    let testPassed = false
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i]
      if (log.event === 'NewOraclizeQuery') {

        testPassed = true
      }
    }

    assert(testPassed, '"NewOraclizeQuery" event not found')

    const NewKrakenPriceTicker = krakenPriceTicker.NewKrakenPriceTicker()

    let checkForNumber = new Promise((resolve, reject) => {
      NewKrakenPriceTicker.watch(async function (error, result) {
        if (error) {
          reject(error)
        }
        const price = await krakenPriceTicker.priceETHXBT.call()
        NewKrakenPriceTicker.stopWatching()
        resolve(price)
      })
    })
    const price = await checkForNumber
    assert.notEqual(price, "", 'Price price was zero (empty).')
  });
});
