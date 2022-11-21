const { Contract, BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const addresses = require('../util/contract_addresses')

async function getBalanceTokenOrPool(account, tokenOrPool){
    const balanceBN = await tokenOrPool.balanceOf(account.address);
    
    return Number(balanceBN._hex) / 10**18;
}


async function removeLiquidity(){
    //to remove liqudiity i have to get the Pair contract of the pool. Approve the liquidity to send and then remove liquidity

    [account] = await ethers.getSigners();
    deployerAddress = account.address;
    console.log(`Removing liquidity using ${deployerAddress}`);

    //pools
    const LiquidityPool_WETH_USDC = await hre.ethers.getContractAt("UniswapV2Pair", addresses.WETH_USDC_POOL_ADDRESS);
    const LiquidityPool_WETH_WBTC = await hre.ethers.getContractAt("UniswapV2Pair", addresses.WETH_WBTC_POOL_ADDRESS);

    //tokens
    const wethContract = await hre.ethers.getContractAt("Token", addresses.WETH_TOKEN_ADDRESS); 
    const usdcContract = await hre.ethers.getContractAt("Token", addresses.USDC_TOKEN_ADDRESS); 
    
    
    const liquidityWethUsdc = await getBalanceTokenOrPool(account, LiquidityPool_WETH_USDC);
    console.log("My liquidity for WETH/USDC pool: ",  liquidityWethUsdc);
    const balanceWETHbefore = await getBalanceTokenOrPool(account, wethContract)
    const balanceUSDCbefore = await getBalanceTokenOrPool(account, usdcContract);

    const routerContract = await hre.ethers.getContractAt("UniswapV2Router02", addresses.ROUTER_ADDRESS);

    console.log("Approving liquidity token to Pair WETH/USDC...")
    let approveTx = await LiquidityPool_WETH_USDC.connect(account).approve(addresses.ROUTER_ADDRESS, ethers.utils.parseEther(liquidityWethUsdc.toString()));
    let receipt = await approveTx.wait();
    console.log("Approved: ", receipt.transactionHash)

    //removing liquidity added to WETH/USDC pool
    console.log("Removing liquidity from Pair WETH/USDC...")
    let removeLiquidityTx = await routerContract.connect(account).removeLiquidity(
        addresses.WETH_TOKEN_ADDRESS,
        addresses.USDC_TOKEN_ADDRESS,
        ethers.utils.parseEther(liquidityWethUsdc.toString()),
        1,
        1,
        account.address,
        (Date.now() + 60 * 60).toString(), 
        { gasLimit: 5000000 }
    )
    receipt = await removeLiquidityTx.wait();
    console.log("Removed: ", receipt.transactionHash)


    const balanceWETHafter = await getBalanceTokenOrPool(account, wethContract)
    const balanceUSDCafter = await getBalanceTokenOrPool(account, usdcContract);

    console.log("WETH Tokens received: ", balanceWETHafter-balanceWETHbefore)
    console.log("USDC Tokens received: ", balanceUSDCafter-balanceUSDCbefore)
}

removeLiquidity()  
.then(() => process.exit(0))
.catch((error) => {
   console.error(error);
   process.exit(1);
});
