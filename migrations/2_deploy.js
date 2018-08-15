var FuelPrice = artifacts.require("FuelPrice.sol");
var YoutubeViews = artifacts.require("YoutubeViews.sol");
var KrakenPrice = artifacts.require("KrakenPriceTicker.sol");

const web3 = new (require('web3'))();

module.exports = function(deployer) {
  // The fuel price constructor requires some tokens, because we immediately launch 2 queries
  deployer.deploy(FuelPrice, {value: web3.utils.toWei("1","ether")}).then(() => {
    deployer.deploy(YoutubeViews).then(() => {
      deployer.deploy(KrakenPrice);
    });
  });
};
