async function createTokens(){

    [account] = await ethers.getSigners();
    deployerAddress = account.address;
    console.log(`Creating ERC20 tokens using ${deployerAddress}`);
 
    const USDCtoken = await ethers.getContractFactory('Token');
    const USDCtokenInstance = await USDCtoken.deploy("USD Coin", "USDC", 10000000000);
    await USDCtokenInstance.deployed();

    console.log(`USDC deployed to : ${USDCtokenInstance.address}`);

    const WrappedBTC = await ethers.getContractFactory('Token');
    const WrappedBTCinstance = await WrappedBTC.deploy("Wrapped BTC", "WBTC", 21000000);
    await WrappedBTCinstance.deployed();

    console.log(`WBTC deployed to : ${WrappedBTCinstance.address}`);

    const UniversityToken = await ethers.getContractFactory('Token');
    const UniversityTokenInstance = await UniversityToken.deploy("University Token", "UNIT", 21000000);
    await UniversityTokenInstance.deployed();

    console.log(`UNIT deployed to : ${UniversityTokenInstance.address}`);



}

createTokens()  
.then(() => process.exit(0))
.catch((error) => {
   console.error(error);
   process.exit(1);
});
