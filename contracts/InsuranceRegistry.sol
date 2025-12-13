// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InsuranceRegistry {
    address public owner;
    uint256 public policyCounter;
    uint256 public claimCounter;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    struct Policy {
        uint256 id;
        address farmer;
        string crop;
        string region;
        uint256 premium;
        uint256 coverageAmount;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }

    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public farmerPolicies;

    function createPolicy(
        string memory crop,
        string memory region,
        uint256 coverageAmount,
        uint256 durationDays
    ) external payable {
        require(msg.value > 0, "Premium required");

        policyCounter++;

        policies[policyCounter] = Policy({
            id: policyCounter,
            farmer: msg.sender,
            crop: crop,
            region: region,
            premium: msg.value,
            coverageAmount: coverageAmount,
            startDate: block.timestamp,
            endDate: block.timestamp + (durationDays * 1 days),
            active: true
        });

        farmerPolicies[msg.sender].push(policyCounter);
    }

    function getPoliciesByFarmer(address farmer)
        external
        view
        returns (uint256[] memory)
    {
        return farmerPolicies[farmer];
    }

    enum ClaimStatus {
        Pending,
        Approved,
        Rejected,
        Paid
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        string reason;
        ClaimStatus status;
    }

    mapping(uint256 => Claim) public claims;

    function submitClaim(
        uint256 policyId,
        string memory reason
    ) external {
        Policy storage policy = policies[policyId];
        require(msg.sender == policy.farmer, "Not policy owner");
        require(policy.active, "Policy inactive");

        claimCounter++;

        claims[claimCounter] = Claim({
            id: claimCounter,
            policyId: policyId,
            reason: reason,
            status: ClaimStatus.Pending
        });
    }

    function approveClaim(uint256 claimId) external onlyOwner {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Pending, "Invalid status");

        claim.status = ClaimStatus.Approved;
    }

    function rejectClaim(uint256 claimId) external onlyOwner {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Pending, "Invalid status");

        claim.status = ClaimStatus.Rejected;
    }

    function payoutClaim(uint256 claimId) external {
        Claim storage claim = claims[claimId];
        Policy storage policy = policies[claim.policyId];

        require(claim.status == ClaimStatus.Approved, "Not approved");
        require(address(this).balance >= policy.coverageAmount, "Insufficient funds");

        claim.status = ClaimStatus.Paid;
        policy.active = false;

        payable(policy.farmer).transfer(policy.coverageAmount);
    }

    receive() external payable {}
}