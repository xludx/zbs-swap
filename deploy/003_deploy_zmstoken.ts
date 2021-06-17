import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DeployResult } from 'hardhat-deploy/dist/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployResult: DeployResult = await deploy('ZMSToken', {
    from: deployer,
    args: [],
    log: true,
  });

  if (deployResult.newlyDeployed) {
    // await ethernal.push({name: 'ZMSToken', address: deployResult.address});
    console.log(`==] ZMSToken [============================================
address: ${deployResult.address}`);
  }
};
export default func;
func.id = 'deploy_zmstoken';
func.tags = ['ZMSToken'];
