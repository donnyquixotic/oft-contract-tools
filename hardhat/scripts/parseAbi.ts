import { id } from "ethers";

async function main(fileName: string) {

    // Import the ABI for the OFT contract
    const abi = require(`../abi/${fileName}.json`);

    // get abi function signatures, this is useful if contract is not verified to interpret transactions
    const prepareData = (e:any) => `${e.name}(${e.inputs.map((e:any) => e.type)})`;

    // Encode function selector
    const encodeSelector = (f:any) => id(f).slice(0,10);

    // Parse ABI and encode its functions
    const output = abi
      .filter((e:any) => e.type === "function")
      .flatMap((e:any) => `${encodeSelector(prepareData(e))}: ${prepareData(e)}`);

    console.log(output);
  }

export default main;
