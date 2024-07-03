// Code generated by the multiversx-sc build system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                            6
// Async Callback (empty):               1
// Total number of exported functions:   8

#![no_std]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    rewards_distribution
    (
        init => init
        receiveRewards => receive_rewards
        distributeRewards => distribute_rewards
        claimRewards => claim_rewards
        getTokenHolders => get_token_holders
        updateHolderBalance => update_holder_balance
        removeHolder => remove_holder
    )
}

multiversx_sc_wasm_adapter::async_callback_empty! {}