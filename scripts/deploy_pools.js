const { ethers } = require("hardhat");

const addresses = require('../util/contract_addresses')

async function getPool(factoryContract, tokenAaddress, tokenBaddress){
    const pool = await factoryContract.getPair(tokenAaddress, tokenBaddress)
    return pool;
}

/**
 * Pools to create:
 * - WETH/USDC
 * - WETH/WBTC
 * - WBTC/UNIT
 */
async function deployPools(){

    [account] = await ethers.getSigners();
    deployerAddress = account.address;
    console.log(`Deploying pools using ${deployerAddress}`);

    const routerContract = await hre.ethers.getContractAt("UniswapV2Router02", addresses.ROUTER_ADDRESS);
    const factoryContract = await hre.ethers.getContractAt("UniswapV2Factory", addresses.FACTORY_ADDRESS);

    const wethContract = await hre.ethers.getContractAt("Token", addresses.WETH_TOKEN_ADDRESS); 
    const usdcContract = await hre.ethers.getContractAt("Token", addresses.USDC_TOKEN_ADDRESS); 
    const wbtcContract = await hre.ethers.getContractAt("Token", addresses.WBTC_TOKEN_ADDRESS); 


    console.log("Approving WETH token to Router...")
    let approveTx = await wethContract.connect(account).approve(addresses.ROUTER_ADDRESS, ethers.utils.parseEther('10000'));
    let receipt = await approveTx.wait();
    console.log("Approved: ", receipt.transactionHash)
    
    console.log("Approving USDC token to Router...")
    approveTx = await usdcContract.connect(account).approve(addresses.ROUTER_ADDRESS, ethers.utils.parseEther('20000'));
    receipt = await approveTx.wait();
    console.log("Approved: ", receipt.transactionHash)

    console.log("Adding liquidity to WETH/USDC Pair...")
    let addLiquidityTx = await routerContract.connect(account).addLiquidity(
        addresses.WETH_TOKEN_ADDRESS,
        addresses.USDC_TOKEN_ADDRESS,
        ethers.utils.parseEther('10000'), 
        ethers.utils.parseEther('20000'), 
        ethers.utils.parseEther('10000'), 
        ethers.utils.parseEther('20000'), 
        account.address, 
        Date.now() + 60 * 60,  //Deadline in 1 hour 
        { gasLimit: 5000000 }
    );
    receipt = await addLiquidityTx.wait();
    console.log("Added: ", receipt.transactionHash)

    console.log("Approving WETH token to Router...")
    approveTx = await wethContract.connect(account).approve(addresses.ROUTER_ADDRESS, ethers.utils.parseEther('10000'));
    receipt = await approveTx.wait();
    console.log("Approved: ", receipt.transactionHash)

    console.log("Approving WBTC token to Router...")
    approveTx = await wbtcContract.connect(account).approve(addresses.ROUTER_ADDRESS, ethers.utils.parseEther('20000'));
    receipt = await approveTx.wait();
    console.log("Approved: ", receipt.transactionHash)

    console.log("Adding liquidity to WETH/WBTC Pair...")
    addLiquidityTx = await routerContract.connect(account).addLiquidity(
        addresses.WETH_TOKEN_ADDRESS,
        addresses.WBTC_TOKEN_ADDRESS,
        ethers.utils.parseEther('10000'), 
        ethers.utils.parseEther('20000'), 
        ethers.utils.parseEther('10000'), 
        ethers.utils.parseEther('20000'), 
        account.address, 
        Date.now() + 60 * 60,  //Deadline in 1 hour 
        { gasLimit: 5000000 }
    );
    receipt = await addLiquidityTx.wait();
    console.log("Added: ", receipt.transactionHash)

    //Retrieving pools deployed:
    console.log("WETH/USDC pool address: ", await getPool(factoryContract, addresses.WETH_TOKEN_ADDRESS, addresses.USDC_TOKEN_ADDRESS));
    console.log("WETH/WBTC pool address: ", await getPool(factoryContract, addresses.WETH_TOKEN_ADDRESS, addresses.WBTC_TOKEN_ADDRESS));
}

deployPools()  
.then(() => process.exit(0))
.catch((error) => {
   console.error(error);
   process.exit(1);
});
