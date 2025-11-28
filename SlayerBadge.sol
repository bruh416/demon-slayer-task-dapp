// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 SlayerBadge (ERC721)
 - Simple NFT used as milestone badge
 - Owner (deployer) can mint; we'll transfer ownership to TaskManager so it can mint badges automatically
 - Uses ERC721URIStorage to attach metadata URIs
*/

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SlayerBadge is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("SlayerBadge", "SBADGE") {
        _nextTokenId = 1;
    }

    // only owner (or TaskManager once owner is transferred) can mint a badge with metadata URI
    function mintBadge(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tid = _nextTokenId++;
        _safeMint(to, tid);
        _setTokenURI(tid, tokenURI);
        emit BadgeMinted(to, tid, tokenURI);
        return tid;
    }
}
