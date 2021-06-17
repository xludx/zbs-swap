import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DeployResult } from 'hardhat-deploy/dist/types';
// import { parseEther } from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // https://hardhat.org/plugins/hardhat-deploy.html#deployments-deploy-name-options
  const deployResult: DeployResult = await deploy('Greeter', {
    from: deployer,
    // proxy: network.live ? false : 'postUpgrade', // https://hardhat.org/plugins/hardhat-deploy.html#deploying-and-upgrading-proxies
    args: ['HELLO'],
    log: true,
  });

  if (deployResult.newlyDeployed) {
    // await ethernal.push({name: 'Greeter', address: deployResult.address});
    console.log(`==] Greeter [============================================
address: ${deployResult.address}`);
  }

  // when live network, record the script as executed to prevent re-execution
  // return network.live;
};
export default func;
func.id = 'deploy_greeter'; // id required to prevent re-execution
func.tags = ['Greeter'];
