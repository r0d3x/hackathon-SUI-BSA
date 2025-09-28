/// ChocoChip - Reward token for MeltyFi Protocol
module meltyfi::choco_chip {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::url;
    use sui::event;
    use std::vector;
    use std::option;

    // ===== Constants =====
    const MAX_SUPPLY: u64 = 1_000_000_000_000_000_000; // 1B tokens with 9 decimals
    const DECIMALS: u8 = 9;

    // ===== Error Codes =====
    const ENotAuthorized: u64 = 1;
    const EInvalidAmount: u64 = 2;
    const ESupplyExceeded: u64 = 3;

    // ===== Types =====

    public struct CHOCO_CHIP has drop {}

    public struct ChocolateFactory has key {
        id: UID,
        treasury_cap: TreasuryCap<CHOCO_CHIP>,
        total_supply: u64,
        authorized_minters: vector<address>,
        max_supply: u64,
    }

    public struct FactoryAdmin has key, store {
        id: UID,
    }

    // ===== Events =====

    public struct ChocolateMinted has copy, drop {
        recipient: address,
        amount: u64,
        minter: address,
    }

    public struct MinterAuthorized has copy, drop {
        minter: address,
        authorized_by: address,
    }

    // ===== Initialization =====

    #[allow(deprecated_usage)]
    fun init(witness: CHOCO_CHIP, ctx: &mut TxContext) {
        // Use the traditional coin creation method with deprecation suppression
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            DECIMALS,
            b"CHOC",
            b"ChocoChip",
            b"Reward token for MeltyFi Protocol participants",
            option::some(url::new_unsafe_from_bytes(b"https://meltyfi.com/choco.png")),
            ctx
        );

        let admin_address = tx_context::sender(ctx);
        let mut authorized_minters = vector::empty<address>();
        vector::push_back(&mut authorized_minters, admin_address);

        let factory = ChocolateFactory {
            id: object::new(ctx),
            treasury_cap,
            total_supply: 0,
            authorized_minters,
            max_supply: MAX_SUPPLY,
        };

        let admin = FactoryAdmin {
            id: object::new(ctx),
        };

        transfer::public_freeze_object(metadata);
        transfer::share_object(factory);
        transfer::transfer(admin, admin_address);
    }

    // ===== Public Functions =====

    /// Mint ChocoChips
    public fun mint(
        factory: &mut ChocolateFactory,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ): Coin<CHOCO_CHIP> {
        let minter = tx_context::sender(ctx);
        assert!(vector::contains(&factory.authorized_minters, &minter), ENotAuthorized);
        assert!(amount > 0, EInvalidAmount);
        assert!(factory.total_supply + amount <= factory.max_supply, ESupplyExceeded);

        factory.total_supply = factory.total_supply + amount;
        let coin = coin::mint(&mut factory.treasury_cap, amount, ctx);

        event::emit(ChocolateMinted {
            recipient,
            amount,
            minter,
        });

        coin
    }

    /// Protocol mint function - only callable from within this package
    public(package) fun protocol_mint(
        factory: &mut ChocolateFactory,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ): Coin<CHOCO_CHIP> {
        assert!(amount > 0, EInvalidAmount);
        assert!(factory.total_supply + amount <= factory.max_supply, ESupplyExceeded);

        factory.total_supply = factory.total_supply + amount;
        let coin = coin::mint(&mut factory.treasury_cap, amount, ctx);

        event::emit(ChocolateMinted {
            recipient,
            amount,
            minter: @meltyfi,
        });

        coin
    }

    /// Authorize new minter (admin only)
    public fun authorize_minter(
        factory: &mut ChocolateFactory,
        _admin: &FactoryAdmin,
        new_minter: address,
        ctx: &mut TxContext
    ) {
        assert!(!vector::contains(&factory.authorized_minters, &new_minter), ENotAuthorized);
        vector::push_back(&mut factory.authorized_minters, new_minter);

        event::emit(MinterAuthorized {
            minter: new_minter,
            authorized_by: tx_context::sender(ctx),
        });
    }

    // ===== View Functions =====

    public fun total_supply(factory: &ChocolateFactory): u64 {
        factory.total_supply
    }

    public fun max_supply(factory: &ChocolateFactory): u64 {
        factory.max_supply
    }

    public fun is_authorized_minter(factory: &ChocolateFactory, minter: address): bool {
        vector::contains(&factory.authorized_minters, &minter)
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        let witness = CHOCO_CHIP {};
        init(witness, ctx);
    }
}