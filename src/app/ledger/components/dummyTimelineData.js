export const dummyTimeline = [
  {
    id: "EVT-001",
    type: "movement",
    event: "Purchased",
    status: "Purchased",
    from: null,
    to: "DACBY",
    party: {
      name: "Harsha Sharma",
      order_id: "ORD-20260325104210S"
    },
    timestamp: "2026-03-25T16:12:10+05:30"
  },
  {
    id: "EVT-002",
    type: "status",
    event: "Under Evaluation",
    status: "Under Evaluation",
    location: "DACBY",
    timestamp: "2026-03-26T10:58:32+05:30"
  },
  {
    id: "EVT-003",
    type: "status",
    event: "Under Repair",
    status: "Under Repair",
    location: "DACBY",
    details: {
      repair_reason: "Disc drive issue"
    },
    timestamp: "2026-03-28T14:15:00+05:30"
  },
  {
    id: "EVT-004",
    type: "status",
    event: "Ready to Ship",
    status: "Ready to Ship",
    location: "DACBY",
    timestamp: "2026-03-30T11:20:00+05:30"
  },
  {
    id: "EVT-005",
    type: "movement",
    event: "Ledger Out",
    status: "Ledger Out",
    from: "DACBY",
    to: "Divyanshu Awari",
    party: {
      name: "Divyanshu Awari",
      order_id: "ORD-1790678197057B"
    },
    sale: {
      sale_price: 52200,
      shipment_charge: 0
    },
    timestamp: "2026-03-31T17:42:00+05:30"
  },
  {
    id: "EVT-006",
    type: "movement",
    event: "Returned",
    status: "Returned",
    from: "Divyanshu Awari",
    to: "DACBY",
    party: {
      name: "Divyanshu Awari",
      order_id: "ORD-1790678197057B"
    },
    return: {
      reason: "Product issue reported by customer"
    },
    timestamp: "2026-04-02T15:20:00+05:30"
  },
  {
    id: "EVT-007",
    type: "status",
    event: "Under Evaluation",
    status: "Under Evaluation",
    location: "DACBY",
    timestamp: "2026-04-03T10:15:00+05:30"
  },
  {
    id: "EVT-008",
    type: "status",
    event: "Under Repair",
    status: "Under Repair",
    location: "DACBY",
    details: {
      repair_reason: "Controller connectivity issue"
    },
    timestamp: "2026-04-04T13:30:00+05:30"
  },
  {
    id: "EVT-009",
    type: "status",
    event: "Ready to Ship",
    status: "Ready to Ship",
    location: "DACBY",
    timestamp: "2026-04-06T11:00:00+05:30"
  },
  {
    id: "EVT-010",
    type: "movement",
    event: "Ledger Out",
    status: "Ledger Out",
    from: "DACBY",
    to: "Rahul Sharma",
    party: {
      name: "Rahul Sharma",
      order_id: "ORD-20260407162045S"
    },
    sale: {
      sale_price: 53500,
      shipment_charge: 150
    },
    timestamp: "2026-04-07T16:20:00+05:30"
  },
  {
    id: "EVT-011",
    type: "movement",
    event: "Returned",
    status: "Returned",
    from: "Rahul Sharma",
    to: "DACBY",
    party: {
      name: "Rahul Sharma",
      order_id: "ORD-20260407162045S"
    },
    return: {
      reason: "Customer return"
    },
    timestamp: "2026-04-15T14:30:00+05:30"
  },
  {
    id: "EVT-012",
    type: "status",
    event: "Under Evaluation",
    status: "Under Evaluation",
    location: "DACBY",
    timestamp: "2026-04-16T11:00:00+05:30"
  }
];
