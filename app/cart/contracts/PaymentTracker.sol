// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentTracker {
    struct Payment {
        uint256 id;
        address payer;
        uint256 amount;
        string details;
        uint256 timestamp;
    }

    mapping(uint256 => Payment) private payments;
    uint256 private nextPaymentId;

    event PaymentAdded(uint256 id, address indexed payer, uint256 amount, string details);

    constructor() {
        nextPaymentId = 1; // Start payment IDs from 1
    }

    function addPayment(uint256 amount, string memory details) public {
        payments[nextPaymentId] = Payment(nextPaymentId, msg.sender, amount, details, block.timestamp);
        emit PaymentAdded(nextPaymentId, msg.sender, amount, details);
        nextPaymentId++;
    }

    function getPayment(uint256 id) public view returns (Payment memory) {
        require(id < nextPaymentId, "Payment ID does not exist.");
        return payments[id];
    }

    function getTotalPayments() public view returns (uint256) {
        return nextPaymentId - 1; // Total payments made
    }
}
