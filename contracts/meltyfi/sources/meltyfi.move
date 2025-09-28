/// MeltyFi Protocol - Main entry point module
module meltyfi::meltyfi {
    use meltyfi::meltyfi_core;
    use meltyfi::choco_chip;
    use sui::coin::Coin;
    use sui::clock::Clock;
    use sui::random::Random;
    use sui::tx_context::TxContext;
    use std::option::Option;
    use std::string;
    
    // ===== Core Protocol Functions =====
    
    /// Create a new lottery with NFT collateral
    public fun create_lottery<T: key + store>(
        protocol: &mut meltyfi_core::Protocol,
        nft: T,
        expiration_date: u64,
        wonka_price: u64,
        max_supply: u64,
        nft_name: vector<u8>,
        nft_description: vector<u8>,
        nft_image_url: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let name_str = string::utf8(nft_name);
        let desc_str = string::utf8(nft_description); 
        let image_str = string::utf8(nft_image_url);
        meltyfi_core::create_lottery(protocol, nft, expiration_date, wonka_price, max_supply, name_str, desc_str, image_str, clock, ctx)
    }
    
    /// Purchase WonkaBars (lottery tickets)
    public fun buy_wonka_bars(
        protocol: &mut meltyfi_core::Protocol,
        lottery: &mut meltyfi_core::Lottery,
        payment: Coin<sui::sui::SUI>,
        quantity: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): meltyfi_core::WonkaBar {
        meltyfi_core::buy_wonka_bars(protocol, lottery, payment, quantity, clock, ctx)
    }
    
    /// Resolve lottery (draw winner or cancel)
    #[allow(lint(public_random))]
    public fun resolve_lottery(
        protocol: &mut meltyfi_core::Protocol,
        lottery: &mut meltyfi_core::Lottery,
        random: &Random,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        meltyfi_core::resolve_lottery(protocol, lottery, random, clock, ctx)
    }
    
    /// Melt WonkaBar to claim rewards (NFT for winner, ChocoChips for all participants)
    public fun melt_wonkabar<T: key + store>(
        lottery: &mut meltyfi_core::Lottery,
        wonka_bar: meltyfi_core::WonkaBar,
        choco_factory: &mut choco_chip::ChocolateFactory,
        ctx: &mut TxContext
    ) {
        meltyfi_core::melt_wonkabar<T>(lottery, wonka_bar, choco_factory, ctx)
    }
    
    /// Legacy function - use melt_wonkabar instead
    public fun claim_rewards<T: key + store>(
        lottery: &mut meltyfi_core::Lottery,
        wonka_bar: meltyfi_core::WonkaBar,
        ctx: &mut TxContext
    ): Option<T> {
        meltyfi_core::claim_rewards<T>(lottery, wonka_bar, ctx)
    }
    
    /// Cancel lottery (owner only)
    public fun cancel_lottery<T: key + store>(
        protocol: &mut meltyfi_core::Protocol,
        lottery: &mut meltyfi_core::Lottery,
        receipt: &meltyfi_core::LotteryReceipt,
        repayment: Coin<sui::sui::SUI>,
        ctx: &mut TxContext
    ) {
        meltyfi_core::cancel_lottery<T>(protocol, lottery, receipt, repayment, ctx)
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
    public fun get_protocol_stats(protocol: &meltyfi_core::Protocol): (u64, u64, u64, bool) {
        meltyfi_core::get_protocol_stats(protocol)
    }
    
    /// Get lottery details
    public fun get_lottery_info(lottery: &meltyfi_core::Lottery): (u64, address, u8, u64, u64, u64, u64, u64, Option<address>) {
        meltyfi_core::get_lottery_info(lottery)
    }
    
    /// Check if address is lottery participant
    public fun is_participant(lottery: &meltyfi_core::Lottery, participant: address): bool {
        meltyfi_core::is_participant(lottery, participant)
    }
    
    /// Get participant ticket count
    public fun get_participant_tickets(lottery: &meltyfi_core::Lottery, participant: address): u64 {
        meltyfi_core::get_participant_tickets(lottery, participant)
    }
    
    /// Get WonkaBar info
    public fun get_wonka_bar_info(wonka_bar: &meltyfi_core::WonkaBar): (u64, u64, address, u64) {
        meltyfi_core::get_wonka_bar_info(wonka_bar)
    }
    
    // ===== Admin Functions =====
    
    /// Pause/unpause protocol (admin only)
    public fun set_protocol_pause(
        protocol: &mut meltyfi_core::Protocol,
        admin_cap: &meltyfi_core::AdminCap,
        paused: bool,
        ctx: &mut TxContext
    ) {
        meltyfi_core::set_protocol_pause(protocol, admin_cap, paused, ctx)
    }
    
    /// Withdraw protocol fees (admin only)
    public fun withdraw_protocol_fees(
        protocol: &mut meltyfi_core::Protocol,
        admin_cap: &meltyfi_core::AdminCap,
        amount: u64,
        ctx: &mut TxContext
    ) {
        meltyfi_core::withdraw_protocol_fees(protocol, admin_cap, amount, ctx)
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