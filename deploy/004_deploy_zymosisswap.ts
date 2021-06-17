import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DeployResult } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const ZMSToken = await deployments.get('ZMSToken');

  const deployResult: DeployResult = await deploy('ZymosisSwap', {
    from: deployer,
    args: [ZMSToken.address],
    log: true,
  });

  if (deployResult.newlyDeployed) {
    // await ethernal.push({name: 'ZymosisSwap', address: deployResult.address});
    console.log(`==] ZymosisSwap [============================================
address: ${deployResult.address}`);
  }
};
export default func;
func.id = 'deploy_zymosisswap';
func.tags = ['ZymosisSwap'];
