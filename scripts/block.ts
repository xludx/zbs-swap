import { ethers } from 'hardhat';
import '@nomiclabs/hardhat-ethers';

async function main() {
  await ethers.provider.getBlockNumber().then(blockNumber => {
    console.log('Current block number: ' + blockNumber);
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
