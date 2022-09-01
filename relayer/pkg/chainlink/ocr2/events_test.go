package ocr2

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	caigotypes "github.com/dontpanicdao/caigo/types"
)

var (
	exampleNewTransmissionEventRaw = []string{
		"0x1",
		"0x63",
		"0x2c0dd77ce74b1667dc6fa782bbafaef5becbe2d04b052726ab236daeb52ac5d",
		"0x1",
		"0x10203000000000000000000000000000000000000000000000000000000",
		"0x4",
		"0x63",
		"0x63",
		"0x63",
		"0x63",
		"0x1",
		"0x485341c18461d70eac6ded4b8b17147f173308ddd56216a86f9ec4d994453",
		"0x1",
		"0x0",
	}
	exampleConfigSetEventRaw = []string{
		"0x0",
		"0x485341c18461d70eac6ded4b8b17147f173308ddd56216a86f9ec4d994453",
		"0x1",
		"0x4",
		"0x21e867aa6e6c545949a9c6f9f5401b70007bd93675857a0a7d5345b8bffcbf0",
		"0x2c0dd77ce74b1667dc6fa782bbafaef5becbe2d04b052726ab236daeb52ac5d",
		"0x64642f34e68436f45757b920f4cdfbdff82728844d740bac672a19ad72011ca",
		"0x2de61335d8f1caa7e9df54486f016ded83d0e02fde4c12280f4b898720b0e2b",
		"0x3fad2efda193b37e4e526972d9613238b9ff993e1e3d3b1dd376d7b8ceb7acd",
		"0x2f14e18cc198dd5133c8a9aa92992fc1a462f703401716f402d0ee383b54faa",
		"0x4fcf11b05ebd00a207030c04836defbec3d37a3f77e581f2d0962a20a55adcd",
		"0x5c35686f78db31d9d896bb425b3fd99be19019f8aeaf0f7a8767867903341d4",
		"0x1",
		"0x3",
		"0x1",
		"0x800000000000010fffffffffffffffffffffffffffffffffffffffffffffff7",
		"0x3b9aca00",
		"0x2",
		"0x2",
		"0x1",
		"0x1",
	}
)

func TestNewTransmissionEvent_Parse(t *testing.T) {
	var eventData []*caigotypes.Felt
	for i := 0; i < len(exampleNewTransmissionEventRaw); i++ {
		eventData = append(eventData, caigotypes.StrToFelt(exampleNewTransmissionEventRaw[i]))
	}

	require.Equal(t, len(exampleNewTransmissionEventRaw), len(eventData))

	_, err := ParseNewTransmissionEvent(eventData)
	assert.NoError(t, err)
}

func TestConfigSetEvent_Parse(t *testing.T) {
	var eventData []*caigotypes.Felt
	for i := 0; i < len(exampleConfigSetEventRaw); i++ {
		eventData = append(eventData, caigotypes.StrToFelt(exampleConfigSetEventRaw[i]))
	}

	require.Equal(t, len(exampleConfigSetEventRaw), len(eventData))

	_, err := ParseConfigSetEvent(eventData)
	assert.NoError(t, err)
}
