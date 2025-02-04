import deployCommand from '../../src/commands/accessController/deploy'
import {
  registerExecuteCommand,
  TIMEOUT,
  startNetwork,
  IntegratedDevnet,
} from '@chainlink/starknet-gauntlet/test/utils'

describe('Access Controller Contract', () => {
  let network: IntegratedDevnet

  beforeAll(async () => {
    network = await startNetwork()
  }, 15000)

  it(
    'Deployment',
    async () => {
      const command = await registerExecuteCommand(deployCommand).create({}, [])

      const report = await command.execute()
      expect(report.responses[0].tx.status).toEqual('ACCEPTED')
    },
    TIMEOUT,
  )

  afterAll(() => {
    network.stop()
  })
})
