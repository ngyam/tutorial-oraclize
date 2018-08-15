/*
    Diesel Price Peg

    This contract keeps in storage a reference
    to the Diesel Price in USD
*/
pragma solidity ^0.4.18;

import "./oraclizeAPI_0.5.sol";


contract FuelPrice is usingOraclize {

    enum Query {
        INVALID,
        DIESEL,
        ELECTRIC
    }

    uint public dieselPriceUSD;
    uint public electricPriceUSD;

    mapping(bytes32 => Query) validIds;

    event NewOraclizeQuery(string what, bytes32 id);
    event UpdateInvoke(address sender);
    event NewPrice(string what, string price, bytes32 id);

    function FuelPrice() public payable {
        // send some Ethers with the deployment!

        // this line is given by the ethereum-bridge
        OAR = OraclizeAddrResolverI(0xBb029d89EFb9E7EDA9C8BAEb164cfBd021A6aa77);

        // first check at contract creation
        updateDiesel(); 
        updateElectric();
    }

    function __callback(bytes32 myid, string result) public {
        UpdateInvoke(msg.sender);
        if (msg.sender != oraclize_cbAddress()) revert();
        
        if (validIds[myid] == Query.DIESEL) {
            dieselPriceUSD = parseInt(result, 2); // let's save it as $ cents
            NewPrice("Diesel", result, myid);
        } else if (validIds[myid] == Query.ELECTRIC) {
            electricPriceUSD = parseInt(result, 2); // let's save it as $ cents
            NewPrice("Electric", result, myid);
        } else {
            // validIds[myid] == Query.INVALID
            revert();
        }
        // This query id is invalidated 
        validIds[myid] = Query.INVALID;
    }

    function updateDiesel() public payable {
        bytes32 queryId = oraclize_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
        // add query ID to mapping
        validIds[queryId] = Query.DIESEL;
        NewOraclizeQuery("Diesel", queryId);
    }

    function updateElectric() public payable {
        // encrypted query
        // bytes32 queryId = oraclize_query("URL", "https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.electric");
        bytes32 queryId = oraclize_query("URL", "BGmmURxq3RKiL9hEckcP1pWqBEBPfNdBRHrOA38cHIhQNcFS7NLyg4ZoFwhar96XxcXTJTBmroyWSvL8nztP8IRf5D6C9CrT7Un38RDqBTH3nfh84a4yf4I0R4t27gGcfdR0pp3u9Y+dz4UVQ+4Zf4GJ+ZrVUFDx2Gyz9LUQezdV8UZz5h+D0EAg+IB/0x7Oj2M17m+YY7Y=");
        // add query ID to mapping
        validIds[queryId] = Query.ELECTRIC;
        NewOraclizeQuery("Electric", queryId);
    }

}