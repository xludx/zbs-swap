import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers } = hre;
  const { deployer } = await getNamedAccounts();

  const zmsToken = await ethers.getContract('ZMSToken', deployer);
  const zymosisSwap = await ethers.getContract('ZymosisSwap', deployer);

  // move all tokens to ZymosisSwap
  const signer = ethers.provider.getSigner(deployer);
  const zmsTokenAsOwner = zmsToken.connect(signer);
  const totalSupply = await zmsTokenAsOwner.totalSupply();
  console.log('zmsToken totalSupply: ' + ethers.utils.formatEther(totalSupply) + ' ZMS');

  let zmsTokenBalance = await zmsTokenAsOwner.balanceOf(deployer);
  if (zmsTokenBalance.toString() !== '0') {
    await zmsTokenAsOwner.transfer(zymosisSwap.address, totalSupply.toString());
    console.log('zmsToken totalSupply sent to', zymosisSwap.address);
  }
  zmsTokenBalance = await zmsTokenAsOwner.balanceOf(deployer);
  console.log('zmsToken (' + zmsToken.address + ') balance: ' + ethers.utils.formatEther(zmsTokenBalance) + ' ZMS');
  const zymosisSwapBalance = await zmsTokenAsOwner.balanceOf(zymosisSwap.address);
  console.log(
    'zymosisSwap (' + zymosisSwap.address + ') balance: ' + ethers.utils.formatEther(zymosisSwapBalance) + ' ZMS',
  );
};

export default func;
func.id = 'deploy_move_tokens';
func.tags = ['Fund'];
