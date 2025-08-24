module 0x6b175b96ec8b802aafbd1207774bcc34341b1c0bddfbc6a1e9ef1fb5118be57a::time_capsule {
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    const E_PAST_TIME: u64 = 1;
    const E_TOO_SOON: u64 = 2;
    const E_NOT_RECIPIENT: u64 = 3;
    const E_ALREADY_OPENED: u64 = 4;

    struct Capsule has store, drop {
        id: u64,
        creator: address,
        recipient: address,
        unlock_time: u64,
        message: vector<u8>,
        funds: coin::Coin<AptosCoin>,
        opened: bool,
    }

    struct Capsules has key {
        next_id: u64,
        items: Table<u64, Capsule>,
    }

    fun init_account(owner: &signer) {
        let addr = signer::address_of(owner);
        if (!exists<Capsules>(addr)) {
            move_to(owner, Capsules { next_id: 1, items: Table::new<u64, Capsule>() });
        }
    }

    public entry fun create_capsule(
        creator: &signer, recipient: address, unlock_time: u64,
        msg: vector<u8>, amount: u64
    ): u64 acquires Capsules {
        assert!(unlock_time > timestamp::now_seconds(), E_PAST_TIME);
        init_account(creator);

        let addr = signer::address_of(creator);
        let funds = coin::withdraw<AptosCoin>(creator, amount);
        let caps = borrow_global_mut<Capsules>(addr);

        let id = caps.next_id; caps.next_id = id + 1;
        Table::add(&mut caps.items, id, Capsule {
            id, creator: addr, recipient, unlock_time,
            message: msg, funds, opened: false
        });
        id
    }

    public fun peek_capsule(owner: address, id: u64): (address, address, u64, bool, u64) acquires Capsules {
        let cap = Table::borrow(&borrow_global<Capsules>(owner).items, id);
        (cap.creator, cap.recipient, cap.unlock_time, cap.opened, coin::value(&cap.funds))
    }

    public fun read_message(owner: address, id: u64): vector<u8> acquires Capsules {
        let cap = Table::borrow(&borrow_global<Capsules>(owner).items, id);
        assert!(timestamp::now_seconds() >= cap.unlock_time, E_TOO_SOON);
        cap.message
    }

    public entry fun open_capsule(recipient: &signer, owner: address, id: u64) acquires Capsules {
        let addr = signer::address_of(recipient);
        let cap = Table::borrow_mut(&mut borrow_global_mut<Capsules>(owner).items, id);

        assert!(timestamp::now_seconds() >= cap.unlock_time, E_TOO_SOON);
        assert!(addr == cap.recipient, E_NOT_RECIPIENT);
        assert!(!cap.opened, E_ALREADY_OPENED);

        if (!coin::is_account_registered<AptosCoin>(addr)) coin::register<AptosCoin>(recipient);
        coin::deposit(addr, coin::extract<AptosCoin>(&mut cap.funds, coin::value(&cap.funds)));
        cap.opened = true;
    }

    public entry fun delete_capsule(creator: &signer, id: u64) acquires Capsules {
        let cap = Table::remove(&mut borrow_global_mut<Capsules>(signer::address_of(creator)).items, id);
        assert!(cap.opened, E_ALREADY_OPENED);
        coin::destroy_zero<AptosCoin>(cap.funds);
    }
}
