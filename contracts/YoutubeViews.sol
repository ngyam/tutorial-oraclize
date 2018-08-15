/*
    Youtube video views

    This contract keeps in storage a views counter
    for a given Youtube video.
*/

pragma solidity ^0.4.18;

import "./oraclizeAPI_0.5.sol";


contract YoutubeViews is usingOraclize {

    string public viewsCount;
    mapping(bytes32 => bool) validIds;

    event NewOraclizeQuery(string description);
    event NewYoutubeViewsCount(string views);

    function YoutubeViews() public {
        OAR = OraclizeAddrResolverI(0xBb029d89EFb9E7EDA9C8BAEb164cfBd021A6aa77);
        update();
    }

    function __callback(bytes32 myid, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert();
        if (!validIds[myid]) revert();
        viewsCount = result;
        validIds[myid] = false;
        // do something with viewsCount
        NewYoutubeViewsCount(viewsCount);
    }

    function update() public payable {
        bytes32 queryId = oraclize_query("URL", 'html(https://www.youtube.com/watch?v=9bZkp7q19f0).xpath(//*[contains(@class, "watch-view-count")]/text())');
        validIds[queryId] = true;
        NewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
    }
}
