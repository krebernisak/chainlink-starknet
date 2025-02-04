%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.bool import TRUE, FALSE
from starkware.cairo.common.uint256 import Uint256, uint256_check
from openzeppelin.introspection.erc165.library import ERC165

const IERC677_RECEIVER_ID = 0x4f3dcd;

@storage_var
func token677ReceiverMock_token_sender_() -> (address: felt) {
}

@storage_var
func token677ReceiverMock_sent_value_() -> (value: Uint256) {
}

@storage_var
func token677ReceiverMock_token_data_(index: felt) -> (data: felt) {
}

@storage_var
func token677ReceiverMock_token_data_len_() -> (data_len: felt) {
}

@storage_var
func token677ReceiverMock_called_fallback_() -> (bool: felt) {
}

@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    ERC165.register_interface(IERC677_RECEIVER_ID);
    token677ReceiverMock_called_fallback_.write(FALSE);
    return ();
}

@external
func onTokenTransfer{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    sender: felt, value: Uint256, data_len: felt, data: felt*
) {
    uint256_check(value);
    token677ReceiverMock_called_fallback_.write(TRUE);
    token677ReceiverMock_token_sender_.write(sender);
    token677ReceiverMock_sent_value_.write(value);
    token677ReceiverMock_token_data_len_.write(data_len);
    fillDataStorage(0, data_len, data);
    return ();
}

func fillDataStorage{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    index: felt, data_len: felt, data: felt*
) {
    if (data_len == 0) {
        return ();
    }

    let index = index + 1;
    token677ReceiverMock_token_data_.write(index, [data]);
    return fillDataStorage(index=index, data_len=data_len - 1, data=data + 1);
}

@view
func supportsInterface{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    interface_id: felt
) -> (success: felt) {
    let (success) = ERC165.supports_interface(interface_id);
    return (success,);
}

@view
func getCalledFallback{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    bool: felt
) {
    let (bool) = token677ReceiverMock_called_fallback_.read();
    return (bool,);
}

@view
func getSentValue{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    value: Uint256
) {
    let (value) = token677ReceiverMock_sent_value_.read();
    return (value,);
}

@view
func getTokenSender{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (
    address: felt
) {
    let (address) = token677ReceiverMock_token_sender_.read();
    return (address,);
}
