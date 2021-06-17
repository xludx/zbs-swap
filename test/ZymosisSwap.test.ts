import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { ZMSToken, ZymosisSwap } from '../typechain';
import { setupUser, setupUsers } from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('Fund');
  const { deployer, investor } = await getNamedAccounts();
  const contracts = {
    ZMSToken: <ZMSToken>await ethers.getContract('ZMSToken'),
    ZymosisSwap: <ZymosisSwap>await ethers.getContract('ZymosisSwap'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
    investor: await setupUser(investor, contracts),
  };
});

describe('ZymosisSwap', function () {
  it('parsing values works as expected', async () => {
    expect(ethers.utils.parseEther('9000')).to.equal('9000000000000000000000');
    expect(ethers.utils.formatEther('9000000000000000000000')).to.equal('9000.0');
  });

  it('has a name', async () => {
    const { ZymosisSwap } = await setup();
    expect(await ZymosisSwap.name()).to.equal('ZymosisSwap Instant Exchange');
  });

  it('ZymosisSwap has all the tokens', async () => {
    const { ZMSToken, ZymosisSwap } = await setup();
    const balance = await ZMSToken.balanceOf(ZymosisSwap.address);
    expect(balance).to.equal(await ZMSToken.totalSupply());
  });

  describe('buyTokens()', function () {
    it('investor has eth', async () => {
      const { investor } = await setup();
      const investorEthBalance = await ethers.provider.getBalance(investor.address);
      expect(ethers.utils.formatEther(investorEthBalance)).to.equal('10000.0');
    });

    it('investor can buy tokens and event was sent', async () => {
      const { investor, ZymosisSwap, ZMSToken } = await setup();
      await expect(
        investor.ZymosisSwap.buyTokens({
          from: investor.address,
          value: ethers.utils.parseEther('1'),
        }),
      )
        .to.emit(ZymosisSwap, 'TokensPurchased')
        .withArgs(investor.address, ZMSToken.address, ethers.utils.parseEther('2000'), '2000');
    });

    it('investor received tokens', async () => {
      const { investor, ZMSToken } = await setup();
      await investor.ZymosisSwap.buyTokens({
        from: investor.address,
        value: ethers.utils.parseEther('1'),
      });
      const balance = await ZMSToken.balanceOf(investor.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('2000'));
    });

    it('tokens were sent from ZymosisSwap', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await investor.ZymosisSwap.buyTokens({
        from: investor.address,
        value: ethers.utils.parseEther('1'),
      });
      const balance = await ZMSToken.balanceOf(ZymosisSwap.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('7000'));
    });

    it('ZymosisSwap received eth', async () => {
      const { investor, ZymosisSwap } = await setup();
      await investor.ZymosisSwap.buyTokens({
        from: investor.address,
        value: ethers.utils.parseEther('1'),
      });
      const balance = await ethers.provider.getBalance(ZymosisSwap.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('1'));
    });
  });

  describe('sellTokens()', function () {
    const buyTokens = async (investor: { address: string } & { ZMSToken: ZMSToken; ZymosisSwap: ZymosisSwap }) => {
      await investor.ZymosisSwap.buyTokens({
        from: investor.address,
        value: ethers.utils.parseEther('1'),
      });
    };

    const sellTokens = async (
      investor: { address: string } & { ZMSToken: ZMSToken; ZymosisSwap: ZymosisSwap },
      ZMSToken: ZMSToken,
      ZymosisSwap: ZymosisSwap,
    ) => {
      // a contract can only transfer tokens from a user if the user
      // has already approved the contract to spend the tokens.
      await investor.ZMSToken.approve(ZymosisSwap.address, ethers.utils.parseEther('2000'), {
        from: investor.address,
      });

      await expect(investor.ZymosisSwap.sellTokens(ethers.utils.parseEther('2000')))
        .to.emit(ZymosisSwap, 'TokensSold')
        .withArgs(investor.address, ZMSToken.address, ethers.utils.parseEther('2000'), '2000');
    };

    it('investor has tokens', async () => {
      const { investor, ZMSToken } = await setup();
      await buyTokens(investor);

      const balance = await ZMSToken.balanceOf(investor.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('2000'));
    });

    it('investor can sell tokens and event was sent', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await buyTokens(investor);

      // a contract can only transfer tokens from a user if the user
      // has already approved the contract to spend the tokens.
      await investor.ZMSToken.approve(ZymosisSwap.address, ethers.utils.parseEther('2000'), {
        from: investor.address,
      });

      await expect(investor.ZymosisSwap.sellTokens(ethers.utils.parseEther('2000')))
        .to.emit(ZymosisSwap, 'TokensSold')
        .withArgs(investor.address, ZMSToken.address, ethers.utils.parseEther('2000'), '2000');
    });

    it('investor sent tokens', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await buyTokens(investor);
      await sellTokens(investor, ZMSToken, ZymosisSwap);

      const balance = await ZMSToken.balanceOf(investor.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('0'));
    });

    it('tokens were sent to ZymosisSwap', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await buyTokens(investor);
      await sellTokens(investor, ZMSToken, ZymosisSwap);

      const balance = await ZMSToken.balanceOf(ZymosisSwap.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('9000'));
    });

    it('ZymosisSwap sent eth', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await buyTokens(investor);
      await sellTokens(investor, ZMSToken, ZymosisSwap);

      const balance = await ethers.provider.getBalance(ZymosisSwap.address);
      expect(balance.toString()).to.equal(ethers.utils.parseEther('0'));
    });

    it('investor cant sell more tokens than they have', async () => {
      const { investor, ZMSToken, ZymosisSwap } = await setup();
      await buyTokens(investor);
      await sellTokens(investor, ZMSToken, ZymosisSwap);

      await investor.ZMSToken.approve(ZymosisSwap.address, ethers.utils.parseEther('2000'), {
        from: investor.address,
      });

      await expect(investor.ZymosisSwap.sellTokens(ethers.utils.parseEther('2000'))).to.be.rejectedWith(
        'NOT_ENOUGH_TOKENS',
      );
    });
  });
});
