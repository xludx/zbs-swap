import { utils } from 'ethers';
import { ZMSToken } from '../typechain';
import { ethers } from 'hardhat';
import '@nomiclabs/hardhat-ethers';

console.log('process.argv', process.argv);
const args = process.argv.slice(2);
const address = args[0];

async function main() {
  if (!address) {
    throw new Error('missing address.');
  }
  let balance = await ethers.provider.getBalance(address);
  console.log(utils.formatEther(balance.toString()), 'ETH');
  const ZMSToken = <ZMSToken>await ethers.getContract('ZMSToken');
  balance = await ZMSToken.balanceOf(address);
  console.log(utils.formatEther(balance.toString()), 'ZMS');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
