import { ExecuteCommandConfig, makeExecuteCommand } from '@chainlink/starknet-gauntlet'
import { isValidAddress } from '@chainlink/starknet-gauntlet'
import { CATEGORIES } from '../../lib/categories'
import { CONTRACT_LIST, aggregatorConsumerLoader } from '../../lib/contracts'

export interface UserInput {
  address: string
}

type ContractInput = [address: string]

const makeUserInput = async (flags, args): Promise<UserInput> => {
  if (flags.input) return flags.input as UserInput

  return {
    address: flags.address,
  }
}

const makeContractInput = async (input: UserInput): Promise<ContractInput> => {
  return [input.address]
}

const validateInput = async (input: UserInput): Promise<boolean> => {
  if (!isValidAddress(input.address)) {
    throw new Error(`Invalid OCR2 address: ${input.address}`)
  }

  return true
}

const commandConfig: ExecuteCommandConfig<UserInput, ContractInput> = {
  contractId: CONTRACT_LIST.AGGREGATOR_CONSUMER,
  category: CATEGORIES.OCR2,
  action: 'deploy',
  suffixes: ['consumer'],
  ux: {
    description: 'Deploys an example Aggregator consumer',
    examples: [
      `${CATEGORIES.OCR2}:consumer:deploy --network=<NETWORK> --address=[AGGREGATOR_ADDRESS]`,
    ],
  },
  makeUserInput,
  makeContractInput,
  validations: [validateInput],
  loadContract: aggregatorConsumerLoader,
}

export default makeExecuteCommand(commandConfig)
