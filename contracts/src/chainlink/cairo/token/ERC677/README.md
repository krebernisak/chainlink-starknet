# Chainlink ERC677

## starkgate_token.cairo

Similar to the starkgate ERC20 contract but with some added functionality from ERC677.

### transferAndCall

Transfers tokens to receiver, via ERC20's `transfer(address, address, uint256)` function. It then logs an event `Transfer(address,address,uint256,bytes)`.

Once the transfer has succeeded and the event is logged, the token calls `onTokenTransfer(sender, value, data_len, data)` on the receiver with `data[0]` as the function's selector, and all the parameters required by the function that you want to call next.

## Receiver contract

### onTokenTransfer

This function is added to contracts enabling them to react to receiving tokens within a single transaction. The `data[0]` parameter is the selector of the function that you want to call.
The data paramater contains all the parameters required by the function that you want to call through the selector.
