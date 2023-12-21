import { Contract, JsonRpcProvider, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import assert from "assert";

async function main(remoteChainId: number, OFTContractAddress: string, remoteOFTContractAddress: string) {
    assert(process.env.PRIVATE_KEY, 'Missing PRIVATE_KEY');
    assert(process.env.RPC_ENDPOINT, 'Missing RPC_ENDPOINT');

    // set up the RPC provider and wallet with the private key
    const rpc = new JsonRpcProvider(process.env.RPC_ENDPOINT);

    // must be contract owner private key
    const wallet = new Wallet(process.env.PRIVATE_KEY, rpc);

    // import the ABI for the OFT contract
    const abi = require('../abi/oft2.json');
    
    // create a contract instance using the contract's address, ABI, and the wallet instance
    const OFTContract = new Contract(OFTContractAddress, abi, wallet);

    const minGas = 200000; // default value for evm-compatible chains    

    const minGas0Tx: TransactionResponse = await OFTContract.setMinDstGas(remoteChainId, 0, minGas);
    const minGas1Tx: TransactionResponse = await OFTContract.setMinDstGas(remoteChainId, 1, minGas);
    const useCustomAdapterParamsTx: TransactionResponse = await OFTContract.setUseCustomAdapterParams(true);
    const setRemoteAddressTx: TransactionResponse = await OFTContract.setTrustedRemoteAddress(remoteChainId, remoteOFTContractAddress);
    
    const configTransactions = [minGas0Tx, minGas1Tx, useCustomAdapterParamsTx, setRemoteAddressTx];

    for (let tx of configTransactions){
      // wait for the transaction to be confirmed
      const receipt: TransactionReceipt | null = await tx.wait();

      // return tx hash
      console.log(`transaction hash: ${receipt?.hash}`);
    }
  
    console.log('***configuration complete***');
}

export default main
