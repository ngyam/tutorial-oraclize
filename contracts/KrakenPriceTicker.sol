/*
   Kraken-based ETH/XBT price ticker

   This contract keeps in storage an updated ETH/XBT price,
   which is updated every ~60 seconds.
*/
pragma solidity ^0.4.18;

import "./oraclizeAPI_0.5.sol";


contract KrakenPriceTicker is usingOraclize {

    string public priceETHXBT;
    mapping(bytes32 => bool) validIds;

    uint constant _gasLimit = 180000 wei;

    event NewOraclizeQuery(string description, uint fee, bytes32 id);
    event NewKrakenPriceTicker(string price, bytes32 id, bytes proof);

    function KrakenPriceTicker() public payable {
        OAR = OraclizeAddrResolverI(0xBb029d89EFb9E7EDA9C8BAEb164cfBd021A6aa77);
        
        // The proof will be received as an IPFS hash
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

        // set gas price for Oraclize callback
        oraclize_setCustomGasPrice(1000 wei);

        update();
    }

    function __callback(bytes32 myid, string result, bytes proof) public {
        if (msg.sender != oraclize_cbAddress()) revert();
        if (!validIds[myid]) revert();
        priceETHXBT = result;
        NewKrakenPriceTicker(priceETHXBT, myid, proof);

        validIds[myid] = false;

        update();
    }

    function update() public payable {
        uint feeNeeded = oraclize_getPrice("URL");
        if (feeNeeded > this.balance) {
            NewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee", feeNeeded, 0);
        } else {
            bytes32 queryId = oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0", _gasLimit);
            // add query ID to mapping
            validIds[queryId] = true;
            NewOraclizeQuery("Oraclize query was sent, standing by for the answer..", feeNeeded, queryId);
        }
    }
}
