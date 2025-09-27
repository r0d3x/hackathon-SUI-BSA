/// MeltyFi Protocol - Main entry point module
module meltyfi::meltyfi {
    use meltyfi::core;
    use meltyfi::choco_chip;
    use sui::coin::Coin;
    use sui::clock::Clock;
    use sui::random::Random;
    use sui::tx_context::TxContext;
    use std::option::Option;
    
    // ===== Core Protocol Functions =====
    
    /// Create a new lottery with NFT collateral
    public fun create_lottery<T: key + store>(
        protocol: &mut core::Protocol,
        nft: T,
        expiration_date: u64,
        wonka_price: u64,
        max_supply: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): core::LotteryReceipt {
        core::create_lottery(protocol, nft, expiration_date, wonka_price, max_supply, clock, ctx)
    }
    
    /// Purchase WonkaBars (lottery tickets)
    public fun buy_wonka_bars(
        protocol: &mut core::Protocol,
        lottery: &mut core::Lottery,
        payment: Coin<sui::sui::SUI>,
        quantity: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): core::WonkaBar {
        core::buy_wonka_bars(protocol, lottery, payment, quantity, clock, ctx)
    }
    
    /// Resolve lottery (draw winner or cancel)
    #[allow(lint(public_random))]
    public fun resolve_lottery(
        protocol: &mut core::Protocol,
        lottery: &mut core::Lottery,
        random: &Random,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        core::resolve_lottery(protocol, lottery, random, clock, ctx)
    }
    
    /// Claim winnings or refund
    public fun claim_rewards<T: key + store>(
        lottery: &mut core::Lottery,
        wonka_bar: core::WonkaBar,
        ctx: &mut TxContext
    ): Option<T> {
        core::claim_rewards<T>(lottery, wonka_bar, ctx)
    }
    
    /// Cancel lottery (owner only)
    public fun cancel_lottery(
        protocol: &mut core::Protocol,
        lottery: &mut core::Lottery,
        receipt: &core::LotteryReceipt,
        repayment: Coin<sui::sui::SUI>,
        ctx: &mut TxContext
    ) {
        core::cancel_lottery(protocol, lottery, receipt, repayment, ctx)
    }
    
    // ===== ChocoChip Token Functions =====
    
    /// Mint ChocoChips
    public fun mint_choco_chips(
        factory: &mut choco_chip::ChocolateFactory,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ): Coin<choco_chip::CHOCO_CHIP> {
        choco_chip::mint(factory, amount, recipient, ctx)
    }
    
    /// Get ChocoChip total supply
    public fun choco_total_supply(factory: &choco_chip::ChocolateFactory): u64 {
        choco_chip::total_supply(factory)
    }
    
    /// Check if address is authorized minter
    public fun is_authorized_minter(factory: &choco_chip::ChocolateFactory, minter: address): bool {
        choco_chip::is_authorized_minter(factory, minter)
    }
    
    // ===== View Functions =====
    
    /// Get protocol stats
    public fun get_protocol_stats(protocol: &core::Protocol): (u64, u64, u64, bool) {
        core::get_protocol_stats(protocol)
    }
    
    /// Get lottery details
    public fun get_lottery_info(lottery: &core::Lottery): (u64, address, u8, u64, u64, u64, u64, u64, Option<address>) {
        core::get_lottery_info(lottery)
    }
    
    /// Check if address is lottery participant
    public fun is_participant(lottery: &core::Lottery, participant: address): bool {
        core::is_participant(lottery, participant)
    }
    
    /// Get participant ticket count
    public fun get_participant_tickets(lottery: &core::Lottery, participant: address): u64 {
        core::get_participant_tickets(lottery, participant)
    }
    
    /// Get WonkaBar info
    public fun get_wonka_bar_info(wonka_bar: &core::WonkaBar): (u64, u64, address, u64) {
        core::get_wonka_bar_info(wonka_bar)
    }
    
    // ===== Admin Functions =====
    
    /// Pause/unpause protocol (admin only)
    public fun set_protocol_pause(
        protocol: &mut core::Protocol,
        admin_cap: &core::AdminCap,
        paused: bool,
        ctx: &mut TxContext
    ) {
        core::set_protocol_pause(protocol, admin_cap, paused, ctx)
    }
    
    /// Withdraw protocol fees (admin only)
    public fun withdraw_protocol_fees(
        protocol: &mut core::Protocol,
        admin_cap: &core::AdminCap,
        amount: u64,
        ctx: &mut TxContext
    ) {
        core::withdraw_protocol_fees(protocol, admin_cap, amount, ctx)
    }
    
    /// Authorize new ChocoChip minter (admin only)
    public fun authorize_choco_minter(
        factory: &mut choco_chip::ChocolateFactory,
        admin: &choco_chip::FactoryAdmin,
        new_minter: address,
        ctx: &mut TxContext
    ) {
        choco_chip::authorize_minter(factory, admin, new_minter, ctx)
    }
}