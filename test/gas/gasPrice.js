const assert = require("assert");
const bootstrap = require("../helpers/contract/bootstrap");
const { hex } = require("../../lib/utils/to");

describe("options:gasPrice", function() {
  const mainContract = "Example";
  const contractFilenames = [];
  const contractSubdirectory = "examples";

  describe("default gasPrice", async function() {
    const options = {};
    const context = bootstrap(mainContract, contractFilenames, options, contractSubdirectory);

    it("should respect the default gasPrice", async function() {
      const { accounts, instance, provider, web3 } = context;

      const assignedGasPrice = provider.engine.manager.state.gasPriceVal;

      const { transactionHash } = await instance.methods.setValue("0x10").send({ from: accounts[0], gas: 3141592 });
      const { gasPrice } = await web3.eth.getTransaction(transactionHash);

      assert.deepStrictEqual(hex(gasPrice), hex(assignedGasPrice));
    });
  });

  describe("zero gasPrice", function() {
    const mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
    const options = {
      mnemonic,
      gasPrice: 0
    };

    const services = bootstrap(mainContract, contractFilenames, options, contractSubdirectory);

    it("should be possible to set a zero gas price", async function() {
      const { accounts, instance, provider, web3 } = services;

      const assignedGasPrice = provider.engine.manager.state.gasPriceVal;
      assert.deepStrictEqual(hex(assignedGasPrice), "0x0");

      const { transactionHash } = await instance.methods.setValue("0x10").send({ from: accounts[0], gas: 3141592 });
      const { gasPrice } = await web3.eth.getTransaction(transactionHash);
      assert.deepStrictEqual(hex(gasPrice), hex(assignedGasPrice));
    });
  });
});