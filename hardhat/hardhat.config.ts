require("dotenv").config();

import '@nomicfoundation/hardhat-toolbox';
import { task } from 'hardhat/config';
import parseAbi from './scripts/parseAbi';
import sendFrom from './scripts/sendFrom';
import setContract from './scripts/setContractConfig';
import verifyContract from './scripts/verifyContract';

task('parseAbi', 'Parse abi function signatures for unverified contracts')
  .addParam('abi', 'file name excluding extension')
  .setAction(async (taskArgs) => {
    await parseAbi(taskArgs.abi); 
});

task('sendFrom', 'Send tokens using the OFT contract')
  .addParam('qty', 'quantity to send')
  .addParam('id', 'bridge destination endpoint chain id')
  .setAction(async (taskArgs) => {
    await sendFrom(taskArgs.qty, taskArgs.id); 
});

task("setContract", "sets basic OFT contract config values")
  .addParam('id', "bridge destination endpoint chain id")
  .addParam('contract', 'source OFT contract address')
  .addParam('remotecontract', 'source remote OFT contract address')
  .setAction(async (taskArgs) => {
    await setContract(taskArgs.id, taskArgs.contract, taskArgs.remotecontract); 
});

task("verifyContract", "Verify OFT contract configuration")
  .addParam("id", "bridge destination endpoint chain id")
  .setAction(async (taskArgs) => {
    await verifyContract(taskArgs.id); 
});

module.exports = {
  solidity: "0.8.19",
  networks: {
    avalanche: {
      url: `https://api.avax.network/ext/bc/C/rpc`,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: `https://bsc-dataseed1.ninicoin.io`,
      accounts: [process.env.PRIVATE_KEY]
    },
    telos: {
      url: 'https://mainnet.telos.net/evm',
      accounts: [process.env.PRIVATE_KEY]
    },
    zksync: {
      url: `https://mainnet.era.zksync.io`,
      accounts: [process.env.PRIVATE_KEY],
      gas: 500000,
    },
    linea: {
      url: `https://rpc.linea.build`,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
