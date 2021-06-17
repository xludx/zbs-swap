import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts } from 'hardhat';
import { Greeter } from '../typechain';
import { setupUsers } from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('Greeter');
  const contracts = {
    Greeter: <Greeter>await ethers.getContract('Greeter'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
  };
});

describe('Greeter', function () {
  before(async function () {
    //
  });

  beforeEach(async function () {
    //
  });

  it('should return the original greeting', async function () {
    const { users } = await setup();
    console.log('greet:', await users[0].Greeter.greet());
    expect(await users[0].Greeter.greet()).to.equal('HELLO');
  });

  it("should return new greeting once it's changed", async function () {
    const { users, Greeter } = await setup();
    const greeting = 'HOLA!';
    await expect(users[0].Greeter.setGreeting(greeting))
      .to.emit(Greeter, 'MessageChanged')
      .withArgs(users[0].address, greeting);
    expect(await users[0].Greeter.greet()).to.equal(greeting);
  });
});
