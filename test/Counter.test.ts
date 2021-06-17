import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts } from 'hardhat';
import { Counter } from '../typechain';
import { setupUsers } from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('Counter');
  const contracts = {
    Counter: <Counter>await ethers.getContract('Counter'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
  };
});

describe('Counter', function () {
  before(async function () {
    //
  });

  beforeEach(async function () {
    //
  });

  it('getCount(): Should return the initial count', async function () {
    const { users } = await setup();
    expect(await users[0].Counter.getCount()).to.equal(0);
  });

  it('countUp(): should count up', async () => {
    const { users } = await setup();
    await users[0].Counter.countUp();
    expect(await users[0].Counter.getCount()).to.equal(1);
  });

  it('countUp(): event with correct values was sent', async () => {
    const { users, Counter } = await setup();
    // countUp while observing the event
    await expect(users[0].Counter.countUp()).to.emit(Counter, 'CountedTo').withArgs(1);
    expect(await users[0].Counter.getCount()).to.equal(1);
  });

  it('countDown(): should count down', async () => {
    const { users } = await setup();
    await users[0].Counter.countUp();
    await users[0].Counter.countDown();
    const count = await users[0].Counter.getCount();
    expect(count).to.equal(0);
  });

  it('countDown(): event with correct values was sent', async () => {
    const { users, Counter } = await setup();
    // countUp while observing the event
    await users[0].Counter.countUp();
    await expect(users[0].Counter.countDown()).to.emit(Counter, 'CountedTo').withArgs(0);
    expect(await users[0].Counter.getCount()).to.equal(0);
  });

  it('should fail due to underflow exception', async () => {
    const { users } = await setup();
    return expect(users[0].Counter.countDown()).to.eventually.be.rejectedWith(Error, 'Uint256 underflow');
  });
});
