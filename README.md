## OFT Contract Tools
Useful hardhat scripts for Omnichain Fungible Token (OFT) contracts to:
- Transfer tokens
- Troubleshoot common contract configuration settings

A list of remote endpoint chain IDs can be found in `chainIds.md`

## OFT Token Transfer Script

This script is designed to interact with the OFT smart contract to facilitate token transfers using `estimateFees()` and `sendFrom()`. If successful, it outputs the transaction hash which can be viewed on the appropriate network explorer. User passes quantity and remote chain id.

- `estimateFees()`: This function provides an estimate of the fees required to send a certain amount of tokens.
- `sendFrom()`: This function allows you to send tokens from one address on the source blockchain to another on the destination.

### Usage

```
npx hardhat sendFrom --qty 100000000000000 --id 199
```

## OFT Contract Verification Script

This script is designed to verify and help troubleshoot basic OFT contract configuration settings by calling read actions on the contract. Specify the contract to test by setting `OFTContractAddress` in `verifyContract.ts`. This must be a contract on the network associated with the `RPC_ENDPOINT` environment variable. On successful check, it outputs address and fee information for further user verification. If a setting is incorrect, it outputs an error message containing instructions to resolve the issue.

- `useCustomAdapterParams()`: This function checks whether custom adapter params have been enabled.
- `minDstGasLookup()`: This function checks that minDstGas has been set for both packet types for the remote chain.
- `estimateSendFees()`: This function checks that fees can be successfully calculated and informs user if it has failed.
- `token()`: This function returns the address of the OFT token, this can be used to verify token address.
- `getTrustedRemoteAddress()`: this function returns the address of the OFT contract configure for the given remote chain id.

### Usage

```
npx hardhat verifyContract --id 199 
```

### Successful Output Example
``` 
*******************************
token address: 0xb99C43d3bce4c8Ad9B95a4A178B04a7391b2a6EB
remote contract address: 0xf5430284e7418891e3a0477d7598a3aa861d5c1d
nativeFee: 51798810800542170206
zroFee: 0
*******************************
```

### Error Output Example
```
INCORRECT CONTRACT SETTING: useCustomAdapterParams is set to 'false'. Set to 'true' by calling setUseCustomAdapterParams().
```

## OFT Contract Configuration Script

This script is designed to set common OFT contract configutation settings. User passes remote chain id, contract address, and remote contract address. Successful configuration returns transaction has for each called action.

- `setUseCustomAdapterParams()`: This function is called and sets `useCustomAdapterParams` to `true`.
- `setMinDstGas()`: This function is called for each packet type and sets default `minGas` to `200000`.
- `setTrustedRemoteAddress()`: This function sets remote OFT contract address on the remote chain id.

### Usage

```
npx hardhat setContractConfig --id 165 --contract 0xf5430284e7418891e3a0477d7598a3aa861d5c1d --remotecontract 0xf5430284e7418891e3a0477d7598a3aa861d5c1d
```

## Parse ABI Script

This script parses the specified abi json file and returns a list of function signatures and corresponding human readable methods. User passes the filename (excluding extension) located in the `/abi` directory.

### Usage

```
npx hardhat parseAbi --abi oft
```
### Output Example
```
[
  '0xdd62ed3e: allowance(address,address)',
  '0x095ea7b3: approve(address,uint256)',
  '0xed629c5c: useCustomAdapterParams()',
  ...
]
```

## Setup & Installation

### Prerequisites

Ensure that you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

### Initialization

Clone the repository and navigate to the hardhat folder: `cd hardhat`.
Install the required npm packages by running:

```
npm install // NOTE: you must use `npm`, `yarn` will not install required dependences and will produce errors
```

Create a `.env` file in the root directory of the repository:
```
cp .env.example .env
```

Update the following variables:

```
RPC_ENDPOINT=<Your_RPC_Endpoint_URL>
PRIVATE_KEY=<Your__Private_Key>
```

`RPC_ENDPOINT`: This should be the URL of your Ethereum JSON RPC endpoint.
`PRIVATE_KEY`: The private key of the Ethereum address you intend to use with the script, for the setContract script this must be the private key for the contract owner.

