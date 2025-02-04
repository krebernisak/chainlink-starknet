import { assert } from 'chai'
import { starknet } from 'hardhat'
import { num } from 'starknet'
import { Account, StarknetContract, StarknetContractFactory } from 'hardhat/types/runtime'
import { TIMEOUT } from '../constants'
import { shouldBehaveLikeOwnableContract } from '../access/behavior/ownable'
import { account } from '@chainlink/starknet'

describe('aggregator_proxy.cairo', function () {
  this.timeout(TIMEOUT)
  const opts = account.makeFunderOptsFromEnv()
  const funder = new account.Funder(opts)
  let aggregatorContractFactory: StarknetContractFactory
  let proxyContractFactory: StarknetContractFactory

  let owner: Account
  let aggregator: StarknetContract
  let proxy: StarknetContract

  before(async function () {
    // assumes contract.cairo and events.cairo has been compiled
    aggregatorContractFactory = await starknet.getContractFactory('ocr2/mocks/MockAggregator')
    proxyContractFactory = await starknet.getContractFactory('ocr2/aggregator_proxy')

    owner = await starknet.OpenZeppelinAccount.createAccount()

    await funder.fund([{ account: owner.address, amount: 1e21 }])
    await owner.deployAccount()

    await owner.declare(aggregatorContractFactory)
    aggregator = await owner.deploy(aggregatorContractFactory, { decimals: 8 })

    await owner.declare(proxyContractFactory)

    proxy = await owner.deploy(proxyContractFactory, {
      owner: owner.address,
      address: aggregator.address,
    })

    console.log(proxy.address)
  })

  shouldBehaveLikeOwnableContract(async () => {
    const alice = owner
    const bob = await starknet.OpenZeppelinAccount.createAccount()

    await funder.fund([{ account: bob.address, amount: 1e21 }])
    await bob.deployAccount()
    return { ownable: proxy, alice, bob }
  })

  describe('proxy behaviour', function () {
    it('works', async () => {
      // insert round into the mock
      await owner.invoke(aggregator, 'set_latest_round_data', {
        answer: 10,
        block_num: 1,
        observation_timestamp: 9,
        transmission_timestamp: 8,
      })

      // query latest round
      let { round } = await proxy.call('latest_round_data')
      // TODO: split_felt the round_id and check phase=1 round=1
      assert.equal(round.answer, '10')
      assert.equal(round.block_num, '1')
      assert.equal(round.started_at, '9')
      assert.equal(round.updated_at, '8')

      // insert a second ocr2 aggregator
      let new_aggregator = await owner.deploy(aggregatorContractFactory, { decimals: 8 })

      // insert round into the mock
      await owner.invoke(new_aggregator, 'set_latest_round_data', {
        answer: 12,
        block_num: 2,
        observation_timestamp: 10,
        transmission_timestamp: 11,
      })

      // propose it to the proxy
      await owner.invoke(proxy, 'propose_aggregator', {
        address: new_aggregator.address,
      })

      // query latest round, it should still point to the old aggregator
      round = (await proxy.call('latest_round_data')).round
      assert.equal(round.answer, '10')

      // but the proposed round should be newer
      round = (await proxy.call('proposed_latest_round_data')).round
      assert.equal(round.answer, '12')

      // confirm the new aggregator
      await owner.invoke(proxy, 'confirm_aggregator', {
        address: new_aggregator.address,
      })

      const phase_aggregator = await proxy.call('aggregator', {})
      assert.equal(phase_aggregator.aggregator, num.toBigInt(new_aggregator.address))

      const phase_id = await proxy.call('phase_id', {})
      assert.equal(phase_id.phase_id, 2n)

      // query latest round, it should now point to the new aggregator
      round = (await proxy.call('latest_round_data')).round
      assert.equal(round.answer, '12')
    })
  })
})
