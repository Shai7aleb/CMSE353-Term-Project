const Market = artifacts.require("./Market.sol");
require('chai')
   .use(require('chai-as-promised'))
   .should()
contract("Market", ([deployer, seller, buyer]) => {
  let market;

  before(async () => {
    market = await Market.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await market.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await market.name();
      assert.equal(name, "CMSE353 Crypto");
    });
  });

  describe("products", async () => {
    let result, productCount
    before(async () => {
      result = await market.createProduct('iphone 7',web3.utils.toWei('1','Ether'), {from : seller});
      productCount = await market.productCount();
    });

    it("creates products", async () => {
      //success
      assert.equal(productCount, 1);
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(),productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iphone 7', 'name is correct')
      assert.equal(event.price, '1000000000000000000','price is correct')
      assert.equal(event.owner, seller, 'name is correct')
      assert.equal(event.purchased, false, 'purchased is correct')
      //failure
      //product should have a name
      await await market.createProduct('',web3.utils.toWei('1','Ether'), {from : seller}).should.be.rejected;
      //product should have a price > 0 Ether
      await await market.createProduct('iphone 10',0, {from : seller}).should.be.rejected;
    });
    //  PART 3 
  });


});
