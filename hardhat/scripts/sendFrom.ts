import { solidityPacked, Contract, JsonRpcProvider, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import assert from "assert";

async function main(qty: string, remoteChainId: number) {
    assert(process.env.PRIVATE_KEY, "Missing PRIVATE_KEY");
    assert(process.env.RPC_ENDPOINT, "Missing RPC_ENDPOINT");
    
    // Set up the RPC provider and wallet with the private key
    const rpc = new JsonRpcProvider(process.env.RPC_ENDPOINT);
    const wallet = new Wallet(process.env.PRIVATE_KEY, rpc);

    // Import the ABI for the OFT contract
    const abi = require('../abi/oft.json');

    // Define the address of the OFT contract (same network as RPC_ENDPOINT)
    const OFTContractAddress = '0xb99C43d3bce4c8Ad9B95a4A178B04a7391b2a6EB'; // RF (telos)
    
    // Create a contract instance using the contract's address, ABI, and the wallet instance
    const OFTContract = new Contract(OFTContractAddress, abi, wallet);

    // Define parameters for estimateSendFee()
    const useZro = false; // Flag to indicate if ZRO should be used
    const minDstGas = 200000; // default working value for evm-compatible chains
    const adapterParams = solidityPacked(['uint16', 'uint256'], [1, minDstGas]); // '0x00010000000000000000000000000000000000000000000000000000000000030d40'
    const sender = wallet.address; // Assuming sender is the wallet's address
    const toAddress = wallet.address; // Assuming receiver is ALSO the wallet's address
    const amount = BigInt(qty); // Define the amount to send in wei units
    
    // Estimate the fees for sending the token
    const [nativeFee, zroFee] = await OFTContract.estimateSendFee(remoteChainId, toAddress, amount, useZro, adapterParams);
    // Log the estimated fees
    console.log("Fees:", nativeFee, zroFee);

    // Define parameters for the sendFrom() function
    const refundAddress = sender; // Address where gas refunds will be sent if necessary
    const zroAddress = '0x0000000000000000000000000000000000000000'; // ZRO wallet address
    
    // Call the sendFrom function
    const tx: TransactionResponse = await OFTContract.sendFrom(sender, remoteChainId, toAddress, amount, refundAddress, zroAddress, adapterParams, nativeFee);
    // Wait for the transaction to be confirmed
    const receipt: TransactionReceipt | null = await tx.wait();

    // Log the transaction hash and a message for the user
    console.log(`View transaction details at: https://layerzeroscan.com/tx/${receipt?.hash}`);
    console.log(`* check your address [${sender}] on the destination chain, in the ERC20 transaction tab!`);
}

export default main
