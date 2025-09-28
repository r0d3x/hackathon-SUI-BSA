/// WonkaBars - NFT lottery tickets for MeltyFi Protocol
module meltyfi::wonka_bars {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;

    /// NFT representing lottery tickets
    public struct WonkaBars has key, store {
        id: UID,
        lottery_id: u64,
        quantity: u64,
        owner: address,
        ticket_range_start: u64,
        ticket_range_end: u64,
    }

    /// Create WonkaBars for lottery participation
    public fun create(
        lottery_id: u64,
        quantity: u64,
        owner: address,
        start: u64,
        end: u64,
        ctx: &mut TxContext
    ): WonkaBars {
        WonkaBars {
            id: object::new(ctx),
            lottery_id,
            quantity,
            owner,
            ticket_range_start: start,
            ticket_range_end: end,
        }
    }

    /// Get lottery ID
    public fun lottery_id(wonka_bars: &WonkaBars): u64 {
        wonka_bars.lottery_id
    }

    /// Get quantity of tickets
    public fun quantity(wonka_bars: &WonkaBars): u64 {
        wonka_bars.quantity
    }

    /// Get owner address
    public fun owner(wonka_bars: &WonkaBars): address {
        wonka_bars.owner
    }

    /// Get ticket range
    public fun ticket_range(wonka_bars: &WonkaBars): (u64, u64) {
        (wonka_bars.ticket_range_start, wonka_bars.ticket_range_end)
    }

    /// Check if a ticket number is within this WonkaBars range
    public fun contains_ticket(wonka_bars: &WonkaBars, ticket: u64): bool {
        ticket >= wonka_bars.ticket_range_start && ticket <= wonka_bars.ticket_range_end
    }

    /// Split WonkaBars into smaller portions
    public fun split(wonka_bars: &mut WonkaBars, amount: u64, ctx: &mut TxContext): WonkaBars {
        assert!(amount < wonka_bars.quantity, 0);
        
        let new_end = wonka_bars.ticket_range_start + amount - 1;
        let split_bars = WonkaBars {
            id: object::new(ctx),
            lottery_id: wonka_bars.lottery_id,
            quantity: amount,
            owner: wonka_bars.owner,
            ticket_range_start: wonka_bars.ticket_range_start,
            ticket_range_end: new_end,
        };

        wonka_bars.quantity = wonka_bars.quantity - amount;
        wonka_bars.ticket_range_start = new_end + 1;

        split_bars
    }

    /// Merge two WonkaBars from the same lottery
    public fun merge(wonka_bars: &mut WonkaBars, other: WonkaBars) {
        let WonkaBars { id, lottery_id: _, quantity, owner: _, ticket_range_start: _, ticket_range_end } = other;
        object::delete(id);
        
        wonka_bars.quantity = wonka_bars.quantity + quantity;
        wonka_bars.ticket_range_end = ticket_range_end;
    }

    /// Transfer ownership of WonkaBars
    public fun transfer_wonka_bars(wonka_bars: &mut WonkaBars, new_owner: address) {
        wonka_bars.owner = new_owner;
    }

    /// Burn/destroy WonkaBars
    public fun burn(wonka_bars: WonkaBars) {
        let WonkaBars { id, lottery_id: _, quantity: _, owner: _, ticket_range_start: _, ticket_range_end: _ } = wonka_bars;
        object::delete(id);
    }

    /// Create WonkaBars for testing (only for tests)
    #[test_only]
    public fun create_with_tickets_for_testing(
        lottery_id: u64,
        quantity: u64,
        owner: address,
        start: u64,
        end: u64,
        ctx: &mut TxContext
    ): WonkaBars {
        create(lottery_id, quantity, owner, start, end, ctx)
    }
} 