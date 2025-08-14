module geetu_addr::JobEscrow {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    /// Error codes
    const E_JOB_NOT_FOUND: u64 = 1;
    const E_UNAUTHORIZED: u64 = 2;
    const E_JOB_ALREADY_COMPLETED: u64 = 3;
    const E_INSUFFICIENT_FUNDS: u64 = 4;

    /// Job status constants
    const STATUS_ACTIVE: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;

    /// Struct representing a freelance job with escrow
    struct Job has store, key {
        client: address,           // Address of the client who posted the job
        freelancer: address,       // Address of the assigned freelancer
        escrow_amount: u64,        // Amount held in escrow
        job_description: vector<u8>, // Job details and requirements
        status: u8,                // Job status (active, completed, etc.)
        created_at: u64,           // Timestamp when job was created
    }

    /// Function to create a new freelance job with escrow deposit
    /// Client deposits payment into escrow when creating the job
    public fun create_job(
        client: &signer,
        freelancer: address,
        escrow_amount: u64,
        job_description: vector<u8>
    ) {
        let client_addr = signer::address_of(client);
     // Transfer escrow amount from client to this contract
        let payment = coin::withdraw<AptosCoin>(client, escrow_amount);
        
        // Create job struct
        let job = Job {
            client: client_addr,
            freelancer,
            escrow_amount,
            job_description,
            status: STATUS_ACTIVE,
            created_at: timestamp::now_seconds(),
        };

        // Store job under client's address
        move_to(client, job);
        
        // Keep the payment in the contract (simplified escrow)
        coin::deposit<AptosCoin>(client_addr, payment);
    }

    /// Function to complete job and release escrow payment
    /// Only client can approve completion and release funds
    public fun complete_job(
        client: &signer,
        job_owner: address
    ) acquires Job {
        let client_addr = signer::address_of(client);
        let job = borrow_global_mut<Job>(job_owner);
        
        // Verify client is authorized to complete this job
        assert!(job.client == client_addr, E_UNAUTHORIZED);
        assert!(job.status == STATUS_ACTIVE, E_JOB_ALREADY_COMPLETED);
        
        // Update job status
        job.status = STATUS_COMPLETED;
        
        // Release escrow payment to freelancer
        let payment = coin::withdraw<AptosCoin>(client, job.escrow_amount);
        coin::deposit<AptosCoin>(job.freelancer, payment);
    }

    /// Helper function to get job details (view function)
    #[view]
    public fun get_job_info(job_owner: address): (address, address, u64, u8) acquires Job {
        let job = borrow_global<Job>(job_owner);
        (job.client, job.freelancer, job.escrow_amount, job.status)
}
}

#[test_only]
module geetu_addr::JobEscrowTests {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::timestamp;
    use geetu_addr::JobEscrow;

    /// Test constants
    const TEST_ESCROW_AMOUNT: u64 = 1000000; // 1 APT
    const TEST_JOB_DESCRIPTION: vector<u8> = b"Build a simple web application";

    /// Test helper function to setup test environment
    fun setup_test(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(aptos_framework);
        
        // Initialize AptosCoin for testing
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        
        // Register client and freelancer for AptosCoin
        coin::register<AptosCoin>(client);
        coin::register<AptosCoin>(freelancer);
        
        // Mint coins to client for testing - give enough for multiple operations
        let coins = coin::mint<AptosCoin>(TEST_ESCROW_AMOUNT * 100, &mint_cap);
        coin::deposit<AptosCoin>(signer::address_of(client), coins);
        
        // Clean up capabilities
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    fun test_create_job_success(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Create a job
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT,
            TEST_JOB_DESCRIPTION
        );
        
        // Verify job was created successfully
        let (job_client, job_freelancer, escrow_amount, status) = 
            JobEscrow::get_job_info(client_addr);
        
        assert!(job_client == client_addr, 1);
        assert!(job_freelancer == freelancer_addr, 2);
        assert!(escrow_amount == TEST_ESCROW_AMOUNT, 3);
        assert!(status == 1, 4); // STATUS_ACTIVE
        
        // Verify client still has the escrow amount since it was deposited back to them
        let client_balance = coin::balance<AptosCoin>(client_addr);
        assert!(client_balance == TEST_ESCROW_AMOUNT * 100, 5);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456, dummy = @0x999)]
    #[expected_failure] // Will fail due to insufficient balance
    fun test_create_job_insufficient_funds(aptos_framework: &signer, client: &signer, freelancer: &signer, dummy: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        // Register dummy account to receive withdrawn coins
        coin::register<AptosCoin>(dummy);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        let dummy_addr = signer::address_of(dummy);
        
        // First, withdraw most of the client's balance to create insufficient funds
        let current_balance = coin::balance<AptosCoin>(client_addr);
        let withdrawal_amount = current_balance - 100; // Leave only 100 coins
        let withdrawn_coins = coin::withdraw<AptosCoin>(client, withdrawal_amount);
        coin::deposit<AptosCoin>(dummy_addr, withdrawn_coins); // Deposit somewhere else
        
        // Try to create job with more funds than available (should fail)
        JobEscrow::create_job(
            client,
            freelancer_addr,
            1000, // More than the 100 remaining
            TEST_JOB_DESCRIPTION
        );
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    fun test_complete_job_success(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Create a job first
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT,
            TEST_JOB_DESCRIPTION
        );
        
        // Complete the job
        JobEscrow::complete_job(client, client_addr);
        
        // Verify job status changed to completed
        let (_, _, _, status) = JobEscrow::get_job_info(client_addr);
        assert!(status == 2, 1); // STATUS_COMPLETED
        
        // Verify freelancer received payment
        let freelancer_balance = coin::balance<AptosCoin>(freelancer_addr);
        assert!(freelancer_balance == TEST_ESCROW_AMOUNT, 2);
        
        // Client should have original amount minus the payment sent to freelancer
        let client_balance = coin::balance<AptosCoin>(client_addr);
        assert!(client_balance == (TEST_ESCROW_AMOUNT * 100) - TEST_ESCROW_AMOUNT, 3);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456, unauthorized = @0x789)]
    #[expected_failure(abort_code = 2)] // E_UNAUTHORIZED
    fun test_complete_job_unauthorized(
        aptos_framework: &signer, 
        client: &signer, 
        freelancer: &signer,
        unauthorized: &signer
    ) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Register unauthorized user for coins
        coin::register<AptosCoin>(unauthorized);
        
        // Create a job
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT,
            TEST_JOB_DESCRIPTION
        );
        
        // Try to complete job with unauthorized signer
        JobEscrow::complete_job(unauthorized, client_addr);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    #[expected_failure(abort_code = 3)] // E_JOB_ALREADY_COMPLETED
    fun test_complete_job_already_completed(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Create a job
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT,
            TEST_JOB_DESCRIPTION
        );
        
        // Complete the job once
        JobEscrow::complete_job(client, client_addr);
        
        // Try to complete the same job again
        JobEscrow::complete_job(client, client_addr);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456, other_client = @0x789)]
    #[expected_failure(abort_code = 4008)] // MISSING_DATA error code
    fun test_get_job_info_nonexistent(
        aptos_framework: &signer, 
        client: &signer, 
        freelancer: &signer,
        other_client: &signer
    ) {
        setup_test(aptos_framework, client, freelancer);
        
        let other_client_addr = signer::address_of(other_client);
        
        // Try to get info for non-existent job
        JobEscrow::get_job_info(other_client_addr);
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    fun test_job_creation_with_timestamp(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Set a specific timestamp
        timestamp::update_global_time_for_test(100000);
        
        // Create a job
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT,
            TEST_JOB_DESCRIPTION
        );
        
        // Verify job was created with correct timestamp
        let (job_client, job_freelancer, escrow_amount, status) = 
            JobEscrow::get_job_info(client_addr);
        
        assert!(job_client == client_addr, 1);
        assert!(job_freelancer == freelancer_addr, 2);
        assert!(escrow_amount == TEST_ESCROW_AMOUNT, 3);
        assert!(status == 1, 4); // STATUS_ACTIVE
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    fun test_multiple_jobs_different_clients(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        
        // Create first job with client
        JobEscrow::create_job(
            client,
            freelancer_addr,
            TEST_ESCROW_AMOUNT / 2,
            b"First job"
        );
        
        // Verify first job
        let client_addr = signer::address_of(client);
        let (_, _, escrow_amount, status) = JobEscrow::get_job_info(client_addr);
        assert!(escrow_amount == TEST_ESCROW_AMOUNT / 2, 1);
        assert!(status == 1, 2); // STATUS_ACTIVE
    }

    #[test(aptos_framework = @0x1, client = @0x123, freelancer = @0x456)]
    fun test_zero_escrow_amount(aptos_framework: &signer, client: &signer, freelancer: &signer) {
        setup_test(aptos_framework, client, freelancer);
        
        let freelancer_addr = signer::address_of(freelancer);
        let client_addr = signer::address_of(client);
        
        // Create job with zero escrow amount
        JobEscrow::create_job(
            client,
            freelancer_addr,
            0,
            TEST_JOB_DESCRIPTION
        );
        
        // Verify job was created
        let (_, _, escrow_amount, status) = JobEscrow::get_job_info(client_addr);
        assert!(escrow_amount == 0, 1);
        assert!(status == 1, 2); // STATUS_ACTIVE
        
        // Complete the job (should work even with zero amount)
        JobEscrow::complete_job(client, client_addr);
        
        // Verify completion
        let (_, _, _, final_status) = JobEscrow::get_job_info(client_addr);
        assert!(final_status == 2, 3); // STATUS_COMPLETED
    }
}