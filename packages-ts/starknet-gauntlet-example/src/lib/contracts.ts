<<<<<<< HEAD
import fs from 'fs'
import { json } from 'starknet'
=======
import { loadContract } from '@chainlink/starknet-gauntlet'
>>>>>>> cairo-1.0

export enum CONTRACT_LIST {
  EXAMPLE = 'example',
}

<<<<<<< HEAD
export const loadContract = (name: CONTRACT_LIST) => {
  return {
    contract: json.parse(
      fs.readFileSync(
        `${__dirname}/../../../../contracts/target/release/chainlink_${name}.sierra.json`,
        'utf-8',
      ),
    ),
    casm: json.parse(
      fs.readFileSync(
        `${__dirname}/../../../../contracts/target/release/chainlink_${name}.casm.json`,
        'utf-8',
      ),
    ),
  }
}

=======
>>>>>>> cairo-1.0
export const tokenContractLoader = () => loadContract(CONTRACT_LIST.EXAMPLE)
