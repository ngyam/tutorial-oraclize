# Ethereum Oraclize tutorial on a private network (Tobalaba test network)

For educational purposes. Supplement to [this ewf wiki post](https://energyweb.atlassian.net/wiki/spaces/EWF/pages/558432257/Data+for+your+contracts+Oracles+with+Oraclize).

Tested with [Parity client](https://github.com/paritytech/parity-ethereum) version 1.11.6 Beta.

### Dependencies

- Connection to Tobalaba. For a tutorial on how to set up a local [Parity client](https://github.com/paritytech/parity-ethereum) and connect to the network, check [here](https://energyweb.atlassian.net/wiki/spaces/EWF/pages/72974337/Install+the+Energy-Web+Client).
- Two accounts with some test Ethers in it. You can use the Parity UI for this purpose, then navigate to the [faucet](http://tobalaba.slock.it/faucet/) to get some ethers.
- [Ethereum-bridge](https://github.com/oraclize/ethereum-bridge)
- [Truffle](https://truffleframework.com/)

### Setup

#### Ethereum-bridge
After you have the Parity client running, you need to set up a connection between the private network and Oraclize:
```
git clone https://github.com/oraclize/ethereum-bridge.git
cd ethereum-bridge
npm install
```
Then:
```
node bridge -H localhost:8545 -a 1
```
When the bridge is launched, sometimes you see the following in the console:
```
Please add this line to your contract constructor:

OAR = OraclizeAddrResolverI(<an address here>);
```
You have to add this line to the smart contract constructors. Just replace the existing one.

When you stop the bridge, you see something like this:
```
To load this instance again: ethereum-bridge --instance oracle_instance_20180813T181443.json
Exiting...
```
Which means you can run the bridge next time with:
```
node bridge --instance oracle_instance_20180813T181443.json
```
and have the same OAR address. 

### How to use

 1. Make sure your parity client is running and configured to connect to Tobalaba
 2. Launch ethereum-bridge
 3. Clone repo, install web3 (the new 1.x version)
   ```
   git clone https://github.com/ngyam/tutorial-oraclize.git
   cd tutorial-oraclize
   npm install web3
   ```
 4. Migrate, or run the tests

#### Test
```
truffle test --network tobalaba
```

#### Deploy
```
truffle migrate --network tobalaba
```

### Resources

[Energy Web Foundation](http://www.energyweb.org/)

[Parity client](https://github.com/paritytech/parity-ethereum)

[Blog](https://medium.com/coinmonks/using-apis-in-your-ethereum-smart-contract-with-oraclize-95656434292e)

[Oraclize doc](https://docs.oraclize.it/)

[Truffle](https://truffleframework.com/)  

