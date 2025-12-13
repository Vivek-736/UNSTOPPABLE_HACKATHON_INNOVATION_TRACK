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
    mapping(uint256 => bool) public policyHasClaim;

    function submitClaim(
        uint256 policyId,
        string memory reason
    ) external {
        Policy storage policy = policies[policyId];
        require(msg.sender == policy.farmer, "Not policy owner");
        require(policy.active, "Policy inactive");
        require(!policyHasClaim[policyId], "Claim already submitted");
        require(block.timestamp >= policy.startDate && block.timestamp <= policy.endDate, "Outside coverage period");
        require(address(this).balance >= policy.coverageAmount, "Insufficient contract funds");
        claimCounter++;
        policyHasClaim[policyId] = true;

        claims[claimCounter] = Claim({
            id: claimCounter,
            policyId: policyId,
            reason: reason,
            status: ClaimStatus.Approved
        });

        policy.active = false;
        claims[claimCounter].status = ClaimStatus.Paid;

        payable(policy.farmer).transfer(policy.coverageAmount);
    }

    function fundContract() external payable onlyOwner {}

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}