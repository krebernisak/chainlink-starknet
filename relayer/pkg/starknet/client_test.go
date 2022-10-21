package starknet

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/dontpanicdao/caigo/gateway"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/smartcontractkit/chainlink-relay/pkg/logger"
)

var (
	chainID = gateway.GOERLI_ID
	timeout = 10 * time.Second
)

func TestGatewayClient(t *testing.T) {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := w.Write([]byte(`{"result": 1}`))
		require.NoError(t, err)
	}))
	defer mockServer.Close()

	lggr := logger.Test(t)
	client, err := NewClient(chainID, mockServer.URL, lggr, &timeout)
	require.NoError(t, err)
	assert.Equal(t, timeout, client.defaultTimeout)

	t.Run("get chain id", func(t *testing.T) {
		// TODO: mock the chainID query
		id, err := client.ChainID(context.Background())
		assert.NoError(t, err)
		assert.Equal(t, chainID, id)
	})

	t.Run("get block height", func(t *testing.T) {
		blockNum, err := client.LatestBlockHeight(context.Background())
		assert.NoError(t, err)
		assert.Equal(t, uint64(1), blockNum)
	})
}

func TestGatewayClient_DefaultTimeout(t *testing.T) {
	client, err := NewClient(chainID, "http://localhost:5050", logger.Test(t), nil)
	require.NoError(t, err)
	assert.Zero(t, client.defaultTimeout)
}

func TestGatewayClient_CustomURLChainID(t *testing.T) {
	client, err := NewClient("test", "test", logger.Test(t), nil)
	require.NoError(t, err)

	id, err := client.ChainID(context.TODO())
	require.NoError(t, err)
	assert.Equal(t, "test", id)

	assert.Equal(t, "test", client.Gw.Gateway.Base)
	assert.Equal(t, "test/feeder_gateway", client.Gw.Gateway.Feeder)
	assert.Equal(t, "test/gateway", client.Gw.Gateway.Gateway)
}
