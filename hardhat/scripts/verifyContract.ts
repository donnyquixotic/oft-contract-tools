import { id, solidityPacked, Contract, JsonRpcProvider } from "ethers";
import assert from "assert";

async function main(remoteChainId: number) {
    assert(process.env.RPC_ENDPOINT, "Missing RPC_ENDPOINT");

    const valueNotSetWarning = (contractProperty: string, incorrectValue: string, correctValue: string, fixMethod: string): void  => {
      console.log(`INCORRECT CONTRACT SETTING: ${contractProperty} is set to ${incorrectValue}. Set to ${correctValue} by calling ${fixMethod}.`)
    }

    // Set up the RPC provider and wallet with the private key
    const rpc = new JsonRpcProvider(process.env.RPC_ENDPOINT);

    // Import the ABI for the OFT contract
    const abi = require('../abi/oft2.json');

    // Define the address of the OFT contract 
    const OFTContractAddress = '0xb99C43d3bce4c8Ad9B95a4A178B04a7391b2a6EB'; // RF (telos)
    
    // Create a contract instance using the contract's address, and ABI
    const OFTContract = new Contract(OFTContractAddress, abi, rpc);

    // verify minDstGas is set for packet 0
    const minDstGas0 = await OFTContract.minDstGasLookup(remoteChainId, 0);

    if (minDstGas0 <= 0){
      valueNotSetWarning('minDstGas (packetType: 0)', `${minDstGas0}`, 'value greater than 0 (200000 is a good default)', 'setMinDstGas');
    }
    
    // verify minDstGas is set for packet 1
    const minDstGas1 = await OFTContract.minDstGasLookup(remoteChainId, 1);

    if (minDstGas1 <= 0){
      valueNotSetWarning('minDstGas (packetType: 1)', `${minDstGas1}`, 'value greater than 0 (200000 is a good default)', 'setMinDstGas');
    }

    // verify custom adapter params is enabled
    const useCustomAdapterParams = await OFTContract.useCustomAdapterParams();

    if (useCustomAdapterParams){
      valueNotSetWarning('useCustomAdapterParams', `${useCustomAdapterParams}`, 'true', 'setUseCustomAdapterParams');
    }

    // output contract and token addresses for user verification
    console.log(' ');
    console.log("*******************************");
    
    const tokenAddress = await OFTContract.token();
    console.log(`token address: ${tokenAddress}`);

    const remoteContractAddress = await OFTContract.getTrustedRemoteAddress(remoteChainId);
    console.log(`remote contract address: ${remoteContractAddress}`);

    // Setup params for testing estimateSendFee
    const useZro = false; // Flag to indicate if ZRO should be used
    const minDstGas = 200000; // default working value for evm-compatible chains
    const adapterParams = solidityPacked(['uint16', 'uint256'], [1, minDstGas]);
    const toAddress = '0x0000000000000000000000000000000000000000'; 
    const amount = BigInt('1'); 
    
    // Test estimateSendFee
    try{
    const [nativeFee, zroFee] = await OFTContract.estimateSendFee(remoteChainId, toAddress, amount, useZro, adapterParams);
    console.log(`nativeFee: ${nativeFee}`);
    console.log(`zroFee: ${zroFee}`);
    console.log("*******************************");
    } catch(e) {
      console.log(' ');
      console.log(`estimateSendFees failed, please check parameters. Error: ${e}`);
    }
  }

export default main;
