const { expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const {
  ContractType,
} = require("hardhat/internal/hardhat-network/stack-traces/model")

describe("Raffle Unit Tests", function () {
  /* allowances testing
    should approve other address to spend token
    does not allow an unnaproved address to do transfers
    emits an aproval event
    the allowance being set is accurate
    does not let the user spend more than their allowance
    */
  let deployer, user1, user2, ourToken //global vars
  beforeEach(async () => {
    //const accounts = await ethers.getSigners() //gets the account specified for the network in hardhat config
    // const deployer = accounts[0]
    // const testAccount = accounts[1]
    // accounts = await ethers.getSigners() (the other way to do this is specified below)
    const accounts = await getNamedAccounts()
    deployer = accounts.deployer
    user1 = accounts.user1
    user2 = accounts.user2
    // deployer + user1 are abstracted from the namedAccounts object. getNamedAccounts gets these objects for us
    //this could also be writen as const {deployer} = await getNamedAccounts but we want to set a global var
    await deployments.fixture(["all"])
    ourToken = await ethers.getContract("OurToken", deployer) //gets the most recent deployment of whatever contract specified
    //whenever we call a function in will automaticaly be from that deployer account
  })

  it("spender should be allowed to use its allowance and its allowance is subtracted", async () => {
    const allowance = ethers.utils.parseEther("5")
    const tokensToSpend = ethers.utils.parseEther("4")
    const expectedNum = ethers.utils.parseEther("1")

    await ourToken.approve(user1, allowance) //give user1 5 tokens

    const ourToken1 = await ethers.getContract("OurToken", user1) //connect to user1

    await ourToken1.transferFrom(deployer, user2, tokensToSpend) //user1 sends 4 of its allowance tokens owned by deployer to user2

    expect(await ourToken1.balanceOf(user2)).to.equal(tokensToSpend)
    expect(await ourToken1.balanceOf(user1)).to.equal(expectedNum)

    // it("does not allow an unnaproved address to do transfers", async function () {})
    // it("emits an approval event", async function () {})
    // it("sets the allowance correctly", async function () {})
    // it("does not let the user spend more than their allowance")
  })
})
