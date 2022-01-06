const Market = artifacts.require("./Market.sol");
require("chai")
  .use(require("chai-as-promised"))
  .should();
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
    let result, productCount;
    before(async () => {
      result = await market.createProduct("iphone 7",web3.utils.toWei("1", "Ether"),{ from: seller });
      productCount = await market.productCount();
    });

    it("creates products", async () => {
      //success
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal( event.id.toNumber(),productCount.toNumber(),"id is correct");;
      assert.equal(event.name, "iphone 7", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, "name is correct");
      assert.equal(event.purchased, false, "purchased is correct");
      //failure
      //product should have a name
      await await market.createProduct("", web3.utils.toWei("1", "Ether"), {from: seller}).should.be.rejected;
      //product should have a price > 0 Ether
      await await market.createProduct("iphone 10", 0, { from: seller }).should.be.rejected;
    });

    it("lists products", async () => {
      const product = await market.products(productCount);
      assert.equal(product.id.toNumber(),productCount.toNumber(),"id is correct");
      assert.equal(product.name, "iphone 7", "name is correct");
      assert.equal(product.price, "1000000000000000000", "price is correct");
      assert.equal(product.owner, seller, "name is correct");
      assert.equal(product.purchased, false, "purchased is correct");
    });

     it('sells products', async () => {
      // Obtain seller's balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // SUCCESS: 
      // - Buyer makes purchase
      result = await market.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iphone 7', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      //  Verify that the seller recieved the funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const exepectedBalance = oldSellerBalance.add(price)

      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

      // FAILURE TESTS: 
      // - Tries to buy a product that does not exist, (product must have valid id)
      await market.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      
      // - Buyer tries to buy without enough ether
      await market.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // - Deployer tries to buy the product, (product can't be purchased twice)
      await market.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      // - Buyer tries to buy again, (buyer can't be the seller)
      await market.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  });
});
