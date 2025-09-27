#[test_only]
module meltyfi::meltyfi_tests {
    use std::option;
    use std::vector;
    use sui::test_scenario;
    use sui::coin;
    use sui::sui::SUI;
    use sui::clock;
    use sui::random;
    use sui::object;
    
    use meltyfi::meltyfi_core::{Self, Protocol, Lottery, LotteryReceipt, AdminCap};
    use meltyfi::choco_chip::{Self, ChocolateFactory, FactoryAdmin, CHOCO_CHIP};
    use meltyfi::wonka_bars::{Self, WonkaBars};

    // Test addresses
    const ADMIN: address = @0xa11ce;
    const USER1: address = @0xb0b;
    const USER2: address = @0xca51;

    // Test NFT for collateral
    public struct TestNFT has key, store {
        id: sui::object::UID,
        name: vector<u8>,
    }

    fun create_test_nft(ctx: &mut sui::tx_context::TxContext): TestNFT {
        TestNFT {
            id: object::new(ctx),
            name: b"Test NFT",
        }
    }

    fun setup_test_environment(): (test_scenario::Scenario, clock::Clock, random::Random) {
        let mut scenario = test_scenario::begin(ADMIN);
        
        // Initialize protocols
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            meltyfi_core::init_for_testing(test_scenario::ctx(&mut scenario));
            choco_chip::init_for_testing(test_scenario::ctx(&mut scenario));
        };

        // Create clock and random for testing
        let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000000); // Set initial time

        let random = random::create_for_testing(test_scenario::ctx(&mut scenario));

        (scenario, clock, random)
    }

    #[test]
    fun test_protocol_initialization() {
        let (mut scenario, clock, _random) = setup_test_environment();
        
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let protocol = test_scenario::take_shared<Protocol>(&scenario);
            let factory = test_scenario::take_shared<ChocolateFactory>(&scenario);
            
            // Check protocol stats
            let (total_lotteries, treasury_balance, paused) = meltyfi_core::protocol_stats(&protocol);
            assert!(total_lotteries == 0, 0);
            assert!(treasury_balance == 0, 1);
            assert!(!paused, 2);
            
            // Check factory initialization
            assert!(choco_chip::total_supply(&factory) == 0, 3);
            assert!(choco_chip::max_supply(&factory) == 1_000_000_000_000_000_000, 4);
            assert!(choco_chip::is_authorized_minter(&factory, ADMIN), 5);
            
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(factory);
        };
        
        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_lottery_creation() {
        let (mut scenario, clock, _random) = setup_test_environment();

        test_scenario::next_tx(&mut scenario, USER1);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let nft = create_test_nft(test_scenario::ctx(&mut scenario));

            let receipt = meltyfi_core::create_lottery(
                &mut protocol,
                nft,
                clock::timestamp_ms(&clock) + 1000000, // 1000 seconds from now
                100, // 100 SUI per WonkaBar
                1000, // Max 1000 WonkaBars
                &clock,
                test_scenario::ctx(&mut scenario)
            );

            assert!(meltyfi_core::receipt_lottery_id(&receipt) == 0, 0);
            
            // Check protocol stats updated
            let (total_lotteries, _, _) = meltyfi_core::protocol_stats(&protocol);
            assert!(total_lotteries == 1, 1);

            sui::object::delete(receipt);
            test_scenario::return_shared(protocol);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_wonkabar_purchase() {
        let (mut scenario, clock, _random) = setup_test_environment();

        // Create lottery first
        test_scenario::next_tx(&mut scenario, USER1);
        let receipt = {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let nft = create_test_nft(test_scenario::ctx(&mut scenario));
            let receipt = meltyfi_core::create_lottery(
                &mut protocol,
                nft,
                clock::timestamp_ms(&clock) + 1000000,
                100,
                1000,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(protocol);
            receipt
        };

        // Buy WonkaBars
        test_scenario::next_tx(&mut scenario, USER2);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            
            let payment = coin::mint_for_testing<SUI>(500, test_scenario::ctx(&mut scenario)); // 5 WonkaBars worth
            let wonka_bars = meltyfi_core::buy_wonkabars(
                &mut protocol,
                &mut lottery,
                payment,
                5,
                &clock,
                test_scenario::ctx(&mut scenario)
            );

            // Check WonkaBars properties
            assert!(wonka_bars::lottery_id(&wonka_bars) == 0, 0);
            assert!(wonka_bars::quantity(&wonka_bars) == 5, 1);
            assert!(wonka_bars::owner(&wonka_bars) == USER2, 2);

            // Check lottery state
            let (_, _, _, _, _, _, sold_count, _) = meltyfi_core::lottery_details(&lottery);
            assert!(sold_count == 5, 3);

            // Check user participation
            assert!(meltyfi_core::user_participation(&lottery, USER2) == 5, 4);

            sui::object::delete(wonka_bars);
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(lottery);
        };

        sui::object::delete(receipt);
        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_lottery_winner_selection() {
        let (mut scenario, clock, random) = setup_test_environment();

        // Create lottery
        test_scenario::next_tx(&mut scenario, USER1);
        let receipt = {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let nft = create_test_nft(test_scenario::ctx(&mut scenario));
            let receipt = meltyfi_core::create_lottery(
                &mut protocol,
                nft,
                clock::timestamp_ms(&clock) + 1000000,
                100,
                10, // Small lottery for testing
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(protocol);
            receipt
        };

        // Buy WonkaBars from different users
        test_scenario::next_tx(&mut scenario, USER1);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            let payment = coin::mint_for_testing<SUI>(300, test_scenario::ctx(&mut scenario));
            let wonka_bars = meltyfi_core::buy_wonkabars(&mut protocol, &mut lottery, payment, 3, &clock, test_scenario::ctx(&mut scenario));
            sui::object::delete(wonka_bars);
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(lottery);
        };

        test_scenario::next_tx(&mut scenario, USER2);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            let payment = coin::mint_for_testing<SUI>(500, test_scenario::ctx(&mut scenario));
            let wonka_bars = meltyfi_core::buy_wonkabars(&mut protocol, &mut lottery, payment, 5, &clock, test_scenario::ctx(&mut scenario));
            sui::object::delete(wonka_bars);
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(lottery);
        };

        // Advance time past expiration
        clock::set_for_testing(&mut clock, clock::timestamp_ms(&clock) + 2000000);

        // Draw winner
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            meltyfi_core::draw_winner(&mut lottery, &random, &clock, test_scenario::ctx(&mut scenario));
            
            // Check lottery concluded
            let (_, _, state, _, _, _, _, winner) = meltyfi_core::lottery_details(&lottery);
            assert!(state == 2, 0); // LOTTERY_CONCLUDED
            assert!(option::is_some(&winner), 1);
            
            test_scenario::return_shared(lottery);
        };

        sui::object::delete(receipt);
        clock::destroy_for_testing(clock);
        random::destroy_for_testing(random);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_wonkabar_redemption() {
        let (mut scenario, clock, random) = setup_test_environment();

        // Create and conclude a lottery
        test_scenario::next_tx(&mut scenario, USER1);
        let receipt = {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let nft = create_test_nft(test_scenario::ctx(&mut scenario));
            let receipt = meltyfi_core::create_lottery(
                &mut protocol,
                nft,
                clock::timestamp_ms(&clock) + 1000000,
                100,
                10,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(protocol);
            receipt
        };

        // Buy WonkaBars
        test_scenario::next_tx(&mut scenario, USER2);
        let wonka_bars = {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            let payment = coin::mint_for_testing<SUI>(500, test_scenario::ctx(&mut scenario));
            let wonka_bars = meltyfi_core::buy_wonkabars(&mut protocol, &mut lottery, payment, 5, &clock, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(lottery);
            wonka_bars
        };

        // Advance time and draw winner
        clock::set_for_testing(&mut clock, clock::timestamp_ms(&clock) + 2000000);
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            meltyfi_core::draw_winner(&mut lottery, &random, &clock, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(lottery);
        };

        // Redeem WonkaBars
        test_scenario::next_tx(&mut scenario, USER2);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let mut lottery = test_scenario::take_shared<Lottery>(&scenario);
            let mut factory = test_scenario::take_shared<ChocolateFactory>(&scenario);
            
            let (nft_option, sui_payout, choco_chips) = meltyfi_core::redeem_wonkabars<TestNFT>(
                &mut protocol, &mut lottery, &mut factory, wonka_bars, test_scenario::ctx(&mut scenario)
            );

            // Check redemption results
            let is_winner = meltyfi_core::is_lottery_winner(&lottery, USER2);
            if (is_winner) {
                assert!(option::is_some(&nft_option), 0);
                let returned_nft = option::extract(&mut nft_option);
                sui::object::delete(returned_nft);
            } else {
                assert!(option::is_none(&nft_option), 0);
                assert!(coin::value(&sui_payout) > 0, 1);
            };
            
            assert!(choco_chip::coin_value(&choco_chips) == 500, 2); // 5 * 100 ChocoChips

            option::destroy_none(nft_option);
            sui::object::delete(sui_payout);
            sui::object::delete(choco_chips);
            test_scenario::return_shared(protocol);
            test_scenario::return_shared(lottery);
            test_scenario::return_shared(factory);
        };

        sui::object::delete(receipt);
        clock::destroy_for_testing(clock);
        random::destroy_for_testing(random);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_wonka_bars_operations() {
        let mut scenario = test_scenario::begin(USER1);
        let ctx = test_scenario::ctx(&mut scenario);

        // Create WonkaBars
        let mut wonka_bars1 = wonka_bars::create_with_tickets_for_testing(1, 5, USER1, 1, 5, ctx);
        let wonka_bars2 = wonka_bars::create_with_tickets_for_testing(1, 3, USER1, 6, 8, ctx);

        // Test split
        let split_bars = wonka_bars::split(&mut wonka_bars1, 2, ctx);
        assert!(wonka_bars::quantity(&wonka_bars1) == 3, 0);
        assert!(wonka_bars::quantity(&split_bars) == 2, 1);

        // Test merge
        wonka_bars::merge(&mut wonka_bars1, wonka_bars2);
        assert!(wonka_bars::quantity(&wonka_bars1) == 6, 2); // 3 + 3

        // Test ticket range functions
        let (start, end) = wonka_bars::ticket_range(&wonka_bars1);
        assert!(start <= end, 3);

        // Test contains ticket
        assert!(wonka_bars::contains_ticket(&split_bars, 4), 4); // Should be in range
        assert!(!wonka_bars::contains_ticket(&split_bars, 10), 5); // Should not be in range

        // Test transfer
        wonka_bars::transfer_wonka_bars(&mut wonka_bars1, USER2);
        assert!(wonka_bars::owner(&wonka_bars1) == USER2, 6);

        // Clean up
        wonka_bars::burn(wonka_bars1);
        wonka_bars::burn(split_bars);
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = meltyfi_core::EInvalidAmount)]
    fun test_invalid_lottery_creation() {
        let (mut scenario, clock, _random) = setup_test_environment();

        let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
        let nft = create_test_nft(test_scenario::ctx(&mut scenario));

        // Try to create lottery with invalid parameters
        let receipt = meltyfi_core::create_lottery(
            &mut protocol,
            nft,
            clock::timestamp_ms(&clock) + 1000000,
            0, // Invalid price (0)
            1000,
            &clock,
            test_scenario::ctx(&mut scenario)
        );

        sui::object::delete(receipt);
        clock::destroy_for_testing(clock);
        test_scenario::return_shared(protocol);
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = meltyfi_core::EInsufficientPayment)]
    fun test_insufficient_payment() {
        let (mut scenario, clock, _random) = setup_test_environment();

        let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
        let nft = create_test_nft(test_scenario::ctx(&mut scenario));
        let receipt = meltyfi_core::create_lottery(
            &mut protocol,
            nft,
            clock::timestamp_ms(&clock) + 1000000,
            100,
            1000,
            &clock,
            test_scenario::ctx(&mut scenario)
        );

        sui::object::delete(receipt);
        test_scenario::next_tx(&mut scenario, USER1);
        let mut lottery = test_scenario::take_shared<Lottery>(&scenario);

        // Try to buy with insufficient payment
        let payment = coin::mint_for_testing<SUI>(50, test_scenario::ctx(&mut scenario)); // Only 50, need 100
        let wonka_bars = meltyfi_core::buy_wonkabars(
            &mut protocol,
            &mut lottery,
            payment,
            1,
            &clock,
            test_scenario::ctx(&mut scenario)
        );

        sui::object::delete(wonka_bars);
        clock::destroy_for_testing(clock);
        test_scenario::return_shared(protocol);
        test_scenario::return_shared(lottery);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_choco_chip_minting() {
        let mut scenario = test_scenario::begin(ADMIN);
        
        // Initialize factory
        test_scenario::next_tx(&mut scenario, ADMIN);
        choco_chip::init_for_testing(test_scenario::ctx(&mut scenario));

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut factory = test_scenario::take_shared<ChocolateFactory>(&scenario);
            
            // Test minting
            let coins = choco_chip::mint(&mut factory, 1000, USER1, test_scenario::ctx(&mut scenario));
            assert!(choco_chip::coin_value(&coins) == 1000, 0);
            
            // Check total supply updated
            assert!(choco_chip::total_supply(&factory) == 1000, 1);
            
            sui::object::delete(coins);
            test_scenario::return_shared(factory);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_protocol_pause() {
        let (mut scenario, clock, _random) = setup_test_environment();

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut protocol = test_scenario::take_shared<Protocol>(&scenario);
            let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
            
            // Pause protocol
            meltyfi_core::set_protocol_pause(&mut protocol, &admin_cap, true);
            
            // Check protocol is paused
            let (_, _, paused) = meltyfi_core::protocol_stats(&protocol);
            assert!(paused, 0);
            
            test_scenario::return_to_sender(&scenario, admin_cap);
            test_scenario::return_shared(protocol);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }
}