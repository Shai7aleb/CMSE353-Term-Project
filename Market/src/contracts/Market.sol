pragma solidity ^0.5.0;

contract Market{
    string public name;
    uint public productCount = 0;
    mapping(uint => Product ) public products;
    struct Product{
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address owner,
        bool purchased
    );

    constructor() public{
        name ="CMSE353 Crypto";
    }

    function createProduct(string memory _name, uint _price) public {
        //params are correct
        //require a name
        require(bytes(_name).length > 0);
        //require a valid price
        require(_price > 0);
        //increment product
        productCount ++;
        //create the product
        products[productCount] = Product(productCount, _name,_price,msg.sender,false);
        //trigger an event
        emit ProductCreated(productCount, _name,_price,msg.sender,false);

    }
    // PART 3 
}
