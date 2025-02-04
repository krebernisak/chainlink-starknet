package smoke_test

// revive:disable:dot-imports
import (
	"flag"
	"fmt"
	"github.com/smartcontractkit/chainlink/integration-tests/actions"
	"go.uber.org/zap/zapcore"
	"testing"

	"github.com/smartcontractkit/chainlink-starknet/integration-tests/common"
	"github.com/smartcontractkit/chainlink-starknet/ops/gauntlet"
	"github.com/smartcontractkit/chainlink-starknet/ops/utils"
	"github.com/stretchr/testify/require"
)

var (
	keepAlive bool
)

func init() {
	flag.BoolVar(&keepAlive, "keep-alive", false, "enable to keep the cluster alive")
}

var (
	err           error
	testState     *common.Test
	decimals      = 9
	mockServerVal = 900000000
)

func TestOCRBasic(t *testing.T) {
	testState = &common.Test{
		T: t,
	}
	testState.Common = common.New()
	testState.Common.Default(t)
	// Setting this to the root of the repo for cmd exec func for Gauntlet
	testState.Sg, err = gauntlet.NewStarknetGauntlet(fmt.Sprintf("%s/", utils.ProjectRoot))
	require.NoError(t, err, "Could not get a new gauntlet struct")

	testState.DeployCluster()
	require.NoError(t, err, "Deploying cluster should not fail")
	if testState.Common.Env.WillUseRemoteRunner() {
		return // short circuit here if using a remote runner
	}
	err = testState.Sg.SetupNetwork(testState.Common.L2RPCUrl)
	require.NoError(t, err, "Setting up gauntlet network should not fail")
	err = testState.DeployGauntlet(0, 100000000000, decimals, "auto", 1, 1)
	require.NoError(t, err, "Deploying contracts should not fail")
	if !testState.Common.Testnet {
		testState.Devnet.AutoLoadState(testState.OCR2Client, testState.OCRAddr)
	}
	testState.SetUpNodes(mockServerVal)

	err = testState.ValidateRounds(10, false)
	require.NoError(t, err, "Validating round should not fail")

	t.Cleanup(func() {
		err = actions.TeardownSuite(t, testState.Common.Env, utils.ProjectRoot, testState.Cc.ChainlinkNodes, nil, zapcore.ErrorLevel)
		require.NoError(t, err, "Error tearing down environment")
	})

}
