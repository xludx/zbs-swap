import { utils } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { ethers } from 'hardhat';

// SEE: https://hardhat.org/guides/scripts.html#standalone-scripts-using-hardhat-as-a-library

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // to deploy contract:
  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  // await greeter.deployed();

  // HARDHAT_NETWORK: Sets the network to connect to.
  // HARDHAT_SHOW_STACK_TRACES: Enables JavaScript stack traces of expected errors.
  // HARDHAT_VERBOSE: Enables Hardhat verbose logging.
  // HARDHAT_MAX_MEMORY: Sets the maximum amount of memory that Hardhat can use.

  console.log('===] named accounts [======================');
  const namedSigners: Record<string, SignerWithAddress> = await ethers.getNamedSigners();
  for (const [name, signer] of Object.entries(namedSigners)) {
    const balance = await ethers.provider.getBalance(signer.address);
    console.log(name, signer.address, utils.formatEther(balance.toString()), 'ETH');
  }

  console.log('===] unnamed accounts [======================');
  const signers: SignerWithAddress[] = await ethers.getUnnamedSigners();
  for (const signer of signers) {
    const balance = await ethers.provider.getBalance(signer.address);
    console.log(signer.address, utils.formatEther(balance.toString()), 'ETH');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
