pragma solidity =0.5.16;

import '@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol';


contract Token is ERC20Detailed, ERC20Mintable {
    
    constructor(string memory _name, string memory _symbol, uint256 _amount) ERC20Detailed(_name, _symbol, 18) public {
        _mint(msg.sender, _amount * 10**18);
    }

}