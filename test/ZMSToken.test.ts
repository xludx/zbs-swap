import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { ZMSToken, ZymosisSwap } from '../typechain';
import { setupUser, setupUsers } from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('ZMSToken');
  const { deployer } = await getNamedAccounts();
  const contracts = {
    ZMSToken: <ZMSToken>await ethers.getContract('ZMSToken'),
    ZymosisSwap: <ZymosisSwap>await ethers.getContract('ZymosisSwap'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
});

describe('ZMSToken', function () {
  it('has a name', async () => {
    const { ZMSToken } = await setup();
    expect(await ZMSToken.name()).to.equal('Zymosis Boozing Society Token');
  });

  it('has a symbol', async () => {
    const { ZMSToken } = await setup();
    expect(await ZMSToken.symbol()).to.equal('ZMS');
  });

  it('totalSupply is 9000', async () => {
    const { ZMSToken } = await setup();
    expect(await ZMSToken.totalSupply()).to.equal(ethers.utils.parseEther('9000'));
  });

  it('ZymosisSwap has all the tokens', async () => {
    const { ZMSToken, ZymosisSwap } = await setup();
    const balance = await ZMSToken.balanceOf(ZymosisSwap.address);
    expect(balance).to.equal(await ZMSToken.totalSupply());
  });

  it('transfer fails: NOT_ENOUGH_TOKENS', async function () {
    const { users } = await setup();
    await expect(users[0].ZMSToken.transfer(users[1].address, 1)).to.be.revertedWith('NOT_ENOUGH_TOKENS');
  });

  it('transfer fails: NOT_ENOUGH_ALLOWANCE', async function () {
    const { users, deployer, ZymosisSwap } = await setup();
    await expect(deployer.ZMSToken.transferFrom(ZymosisSwap.address, users[2].address, 1)).to.be.revertedWith(
      'NOT_ENOUGH_ALLOWANCE',
    );
  });
});
