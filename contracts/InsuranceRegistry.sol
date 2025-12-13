// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract InsuranceRegistry {
    uint256 public policyCount;

    struct Policy {
        address farmer;
        string region;
        string crop;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }

    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) private farmerPolicies;

    function createPolicy(
        string calldata region,
        string calldata crop,
        uint256 startDate,
        uint256 endDate
    ) external {
        policyCount++;

        policies[policyCount] = Policy({
            farmer: msg.sender,
            region: region,
            crop: crop,
            startDate: startDate,
            endDate: endDate,
            active: true
        });

        farmerPolicies[msg.sender].push(policyCount);
    }

    function getPoliciesByFarmer(address farmer)
        external
        view
        returns (uint256[] memory)
    {
        return farmerPolicies[farmer];
    }
}