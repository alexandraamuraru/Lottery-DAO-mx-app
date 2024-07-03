// Code generated by the multiversx-sc build system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                            9
// Async Callback (empty):               1
// Total number of exported functions:  11

#![no_std]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    my_lottery
    (
        init => init
        start => start
        createLotteryPool => create_lottery_pool
        buy_ticket => buy_ticket
        determine_winner => determine_winner
        getActiveLotteries => get_active_lotteries
        getEndedLotteries => get_ended_lotteries
        status => status
        getLotteryInfo => lottery_info
        setRewardsDistributionAddress => set_rewards_distribution_address
    )
}

multiversx_sc_wasm_adapter::async_callback_empty! {}
