const hre = require("hardhat");

const main = async () => {
  const transactionFactory = await hre.ethers.getContractFactory('Transactions')
  const transactionContract = await transactionFactory.deploy()

  await transactionContract.deployed()

  console.log('Transactions deployed to:', transactionContract.address)
  // 0x5FbDB2315678afecb367f032d93F642f64180aa3
}

;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()