const Market = artifacts.require("./Market.sol");

contract("Market", (accounts) => {
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
});
