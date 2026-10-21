"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart3,
  ShoppingCart,
  Briefcase,
  TrendingUp,
  Building2,
  Package,
  FileText,
  ChevronDown,
  Calendar,
  Bell,
  Search,
  Filter,
  Layers,
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Info,
  MoreVertical,
  Columns,
  ArrowRight,
  ArrowUpRight,
  ArrowUpDown,
  X,
  ExternalLink,
  ShieldAlert,
  Truck,
  DollarSign,
  Check,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

// =============================================================================
// Comprehensive SLA Breach Data Definition (21 Operational Issue Types)
// =============================================================================
const CATEGORIES_DATA = {
  "b2c-purchases": {
    id: "b2c-purchases",
    name: "B2C Purchases",
    label: "B2C purchases",
    description: "Track procurement bottlenecks, customer device pickups, and intake verification SLAs.",
    icon: ShoppingCart,
    issues: [
      {
        id: "b2c-p-1",
        issue: "Marked Delivered by Courier, Not Updated in DACBY",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 7,
        overdueCases: 7,
        dueSoonCases: 0,
        longestPending: "11.5 h",
        avgDelay: "7.2 h",
        severity: "Critical",
        severityRank: 1,
        department: "Logistics & Courier",
        valueAtRisk: "₹2.85L",
        valueRaw: 285000,
        status: "Overdue",
        trend: "+2 vs yesterday",
        description: "Courier marked package delivered at warehouse dock, but inwards inventory scan in DACBY portal has not occurred within 3 hours.",
        sampleCases: [
          { id: "PUR-B2C-9201", entity: "Aarav Gupta (Delhi)", product: "iPhone 13 (128 GB)", courier: "BlueDart (#BLU849201)", pending: "11.5 h", delay: "+8.5 h overdue", amount: "₹38,500", action: "Trigger Dock Intake" },
          { id: "PUR-B2C-9204", entity: "Neha Verma (Bengaluru)", product: "Samsung Galaxy S22", courier: "Delhivery (#DLV492018)", pending: "9.2 h", delay: "+6.2 h overdue", amount: "₹42,000", action: "Trigger Dock Intake" },
          { id: "PUR-B2C-9209", entity: "Vikram Malhotra (Mumbai)", product: "OnePlus 10 Pro", courier: "Shadowfax (#SHD992104)", pending: "8.1 h", delay: "+5.1 h overdue", amount: "₹34,000", action: "Trigger Dock Intake" },
          { id: "PUR-B2C-9212", entity: "Pooja Hegde (Hyderabad)", product: "PlayStation 5 Disc", courier: "BlueDart (#BLU773910)", pending: "7.0 h", delay: "+4.0 h overdue", amount: "₹48,000", action: "Trigger Dock Intake" },
          { id: "PUR-B2C-9215", entity: "Rohan Das (Kolkata)", product: "iPad Air 5th Gen", courier: "Delhivery (#DLV331902)", pending: "5.4 h", delay: "+2.4 h overdue", amount: "₹44,000", action: "Trigger Dock Intake" },
        ],
      },
      {
        id: "b2c-p-2",
        issue: "Order Rejected, Return Not Dispatched",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 3,
        overdueCases: 2,
        dueSoonCases: 1,
        longestPending: "98 h",
        avgDelay: "82 h",
        severity: "High",
        severityRank: 2,
        department: "Warehouse Ops",
        valueAtRisk: "₹1.15L",
        valueRaw: 115000,
        status: "Overdue",
        trend: "Stable",
        description: "Customer device rejected during QC inspection. Return parcel dispatch back to customer is delayed beyond 72h SLA.",
        sampleCases: [
          { id: "PUR-B2C-8812", entity: "Siddharth Jain (Pune)", product: "MacBook Air M1 (Water Damaged)", courier: "Awaiting Booking", pending: "98 h", delay: "+26 h overdue", amount: "₹52,000", action: "Generate Return AWB" },
          { id: "PUR-B2C-8834", entity: "Kavita Rao (Chennai)", product: "iPhone 12 Mini (iCloud Locked)", courier: "Awaiting Booking", pending: "84 h", delay: "+12 h overdue", amount: "₹28,500", action: "Generate Return AWB" },
          { id: "PUR-B2C-8849", entity: "Anil Kulkarni (Ahmedabad)", product: "Apple Watch Series 7", courier: "Delhivery (#DLV9021)", pending: "68 h", delay: "4h buffer left", amount: "₹34,500", action: "Handover to Courier" },
        ],
      },
      {
        id: "b2c-p-3",
        issue: "Received in Warehouse, Payment Pending (RTS / Under Repair)",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 3,
        overdueCases: 2,
        dueSoonCases: 1,
        longestPending: "94 h",
        avgDelay: "76 h",
        severity: "Critical",
        severityRank: 1,
        department: "Finance & Ledger",
        valueAtRisk: "₹1.60L",
        valueRaw: 160000,
        status: "Overdue",
        trend: "-1 vs yesterday",
        description: "Purchase device passed inspection and entered stock as RTS or Under Repair, but seller NEFT/IMPS payout is held.",
        sampleCases: [
          { id: "PUR-B2C-7910", entity: "Manish Tiwari (Noida)", product: "iPhone 13 Pro (256 GB)", courier: "Warehouse Stored", pending: "94 h", delay: "+22 h overdue", amount: "₹58,000", action: "Approve IMPS Payout" },
          { id: "PUR-B2C-7918", entity: "Sunita Roy (Gurugram)", product: "Samsung Galaxy Fold 3", courier: "Warehouse Stored", pending: "86 h", delay: "+14 h overdue", amount: "₹62,000", action: "Approve IMPS Payout" },
          { id: "PUR-B2C-7925", entity: "Farhan Ali (Jaipur)", product: "Pixel 7 (128 GB)", courier: "Warehouse Stored", pending: "64 h", delay: "8h buffer left", amount: "₹40,000", action: "Verify Bank Account" },
        ],
      },
      {
        id: "b2c-p-4",
        issue: "Placed, Not Picked Up (Free Pickup)",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 6,
        overdueCases: 5,
        dueSoonCases: 1,
        longestPending: "120 h",
        avgDelay: "88 h",
        severity: "High",
        severityRank: 2,
        department: "Logistics & Courier",
        valueAtRisk: "₹2.10L",
        valueRaw: 210000,
        status: "Overdue",
        trend: "+1 vs yesterday",
        description: "Customer requested free courier pickup; 3PL partner has failed to execute pickup within 72h window.",
        sampleCases: [
          { id: "PUR-B2C-7102", entity: "Deepak Choudhary (Chandigarh)", product: "iPhone 14 (128 GB)", courier: "Delhivery (#PKP9012)", pending: "120 h", delay: "+48 h overdue", amount: "₹46,000", action: "Reassign to BlueDart" },
          { id: "PUR-B2C-7115", entity: "Gaurav Sen (Lucknow)", product: "OnePlus 9 Pro", courier: "Shadowfax (#PKP8472)", pending: "105 h", delay: "+33 h overdue", amount: "₹31,000", action: "Send Courier Escalation" },
          { id: "PUR-B2C-7128", entity: "Preeti Nair (Kochi)", product: "Nintendo Switch OLED", courier: "Delhivery (#PKP7712)", pending: "92 h", delay: "+20 h overdue", amount: "₹24,000", action: "Send Courier Escalation" },
        ],
      },
      {
        id: "b2c-p-5",
        issue: "Placed, Not Picked Up (Doorstep Payment)",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 2,
        overdueCases: 0,
        dueSoonCases: 2,
        longestPending: "64 h",
        avgDelay: "58 h",
        severity: "High",
        severityRank: 2,
        department: "Logistics & Courier",
        valueAtRisk: "₹95K",
        valueRaw: 95000,
        status: "Due Soon",
        trend: "Approaching SLA",
        description: "Customer opted for Doorstep Evaluation and Instant Payout; executive visit scheduled within 72 hours.",
        sampleCases: [
          { id: "PUR-B2C-6501", entity: "Sameer Sheikh (Indore)", product: "iPhone 12 (64 GB)", courier: "Internal Field Fleet", pending: "64 h", delay: "8h buffer left", amount: "₹29,000", action: "Confirm Customer Slot" },
          { id: "PUR-B2C-6512", entity: "Bhavna Patel (Surat)", product: "Samsung Galaxy A53", courier: "Internal Field Fleet", pending: "58 h", delay: "14h buffer left", amount: "₹18,500", action: "Confirm Customer Slot" },
        ],
      },
      {
        id: "b2c-p-6",
        issue: "Picked Up, Not Received in Warehouse",
        category: "B2C Purchases",
        categoryId: "b2c-purchases",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 4,
        overdueCases: 3,
        dueSoonCases: 1,
        longestPending: "310 h",
        avgDelay: "260 h",
        severity: "Critical",
        severityRank: 1,
        department: "Logistics & Courier",
        valueAtRisk: "₹2.40L",
        valueRaw: 240000,
        status: "Overdue",
        trend: "+1 vs yesterday",
        description: "Courier picked device up from seller, but transit time exceeded the 10-day inter-state SLA with no hub updates.",
        sampleCases: [
          { id: "PUR-B2C-5901", entity: "Harish Pillai (Thiruvananthapuram)", product: "iPhone 13 Pro Max", courier: "BlueDart (#BLU302910)", pending: "310 h", delay: "+70 h overdue", amount: "₹72,000", action: "Raise Lost-in-Transit Ticket" },
          { id: "PUR-B2C-5914", entity: "Rajeshwar Singh (Patna)", product: "iPad Pro 11-inch", courier: "Delhivery (#DLV904812)", pending: "280 h", delay: "+40 h overdue", amount: "₹56,000", action: "Track Hub Location" },
          { id: "PUR-B2C-5922", entity: "Anushka Das (Guwahati)", product: "Samsung S21 FE", courier: "Delhivery (#DLV881923)", pending: "254 h", delay: "+14 h overdue", amount: "₹28,000", action: "Track Hub Location" },
        ],
      },
    ],
  },

  "b2b-purchases": {
    id: "b2b-purchases",
    name: "B2B Purchases",
    label: "B2B purchases",
    description: "Monitor wholesale advance capital exposure, vendor dispatch compliance, and bulk ledger bookings.",
    icon: Briefcase,
    issues: [
      {
        id: "b2b-p-1",
        issue: "Advance Paid, Products Not Received",
        category: "B2B Purchases",
        categoryId: "b2b-purchases",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 2,
        overdueCases: 2,
        dueSoonCases: 0,
        longestPending: "336 h",
        avgDelay: "290 h",
        severity: "Critical",
        severityRank: 1,
        department: "Vendor Management",
        valueAtRisk: "₹8.50L",
        valueRaw: 850000,
        status: "Overdue",
        trend: "Critical Alert",
        description: "Commercial advance payment transferred to wholesale vendor; bulk consignment delivery is overdue past 10 days.",
        sampleCases: [
          { id: "PUR-B2B-3001", entity: "Apex Tech Distributors (Delhi)", product: "50x iPhone 11 (64 GB Bulk Lot)", courier: "Vendor Fleet", pending: "336 h (14d)", delay: "+96 h overdue", amount: "₹5,20,000", action: "Issue Legal Demand Notice" },
          { id: "PUR-B2B-3004", entity: "Supreme Mobiles (Mumbai)", product: "25x Galaxy S21 FE Lot", courier: "SafeXpress (#SFX8401)", pending: "268 h (11.1d)", delay: "+28 h overdue", amount: "₹3,30,000", action: "Escalate to Key Account Head" },
        ],
      },
      {
        id: "b2b-p-2",
        issue: "Received in Warehouse, Ledger Not Updated (RTS / Under Repair)",
        category: "B2B Purchases",
        categoryId: "b2b-purchases",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 2,
        overdueCases: 1,
        dueSoonCases: 1,
        longestPending: "84 h",
        avgDelay: "76 h",
        severity: "Medium",
        severityRank: 3,
        department: "Finance & Ledger",
        valueAtRisk: "₹3.20L",
        valueRaw: 320000,
        status: "Overdue",
        trend: "+1 overdue",
        description: "Bulk consignment received and verified at warehouse dock; ERP financial ledger journal entry pending verification.",
        sampleCases: [
          { id: "PUR-B2B-3105", entity: "Zenith Retail Corp (Bengaluru)", product: "40x OnePlus Nord CE Lot", courier: "Dock Bay 3 Intake", pending: "84 h", delay: "+12 h overdue", amount: "₹3,20,000", action: "Post Purchase Journal Entry" },
        ],
      },
    ],
  },

  "b2c-sales": {
    id: "b2c-sales",
    name: "B2C Sales",
    label: "B2C sales",
    description: "Track customer order fulfillment, courier delivery delays, RTO reversals, and replacement dispatches.",
    icon: TrendingUp,
    issues: [
      {
        id: "b2c-s-1",
        issue: "Order Not Dispatched",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "48 h",
        slaHours: 48,
        openCases: 6,
        overdueCases: 5,
        dueSoonCases: 1,
        longestPending: "96 h",
        avgDelay: "64 h",
        severity: "Critical",
        severityRank: 1,
        department: "Warehouse Ops",
        valueAtRisk: "₹2.10L",
        valueRaw: 210000,
        status: "Overdue",
        trend: "+2 vs yesterday",
        description: "Customer order confirmed and paid; packaging and courier dispatch is overdue beyond the 48-hour SLA window.",
        sampleCases: [
          { id: "SAL-B2C-10492", entity: "Karan Mehta (Mumbai)", product: "iPhone 13 (128 GB Blue)", courier: "Awaiting Pick & Pack", pending: "96 h", delay: "+48 h overdue", amount: "₹42,500", action: "Fast-Track Pack Station" },
          { id: "SAL-B2C-10512", entity: "Smriti Sharma (Noida)", product: "Samsung Galaxy Watch 4", courier: "Awaiting Pick & Pack", pending: "82 h", delay: "+34 h overdue", amount: "₹14,000", action: "Fast-Track Pack Station" },
          { id: "SAL-B2C-10534", entity: "Ashwin Nair (Bengaluru)", product: "PlayStation 5 Console", courier: "Ready for Dispatch", pending: "64 h", delay: "+16 h overdue", amount: "₹49,999", action: "Handover to BlueDart" },
        ],
      },
      {
        id: "b2c-s-2",
        issue: "Order Dispatched, Not Delivered",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 7,
        overdueCases: 6,
        dueSoonCases: 1,
        longestPending: "402 h",
        avgDelay: "285 h",
        severity: "Critical",
        severityRank: 1,
        department: "Logistics & Courier",
        valueAtRisk: "₹3.40L",
        valueRaw: 340000,
        status: "Overdue",
        trend: "+1 vs yesterday",
        description: "Dispatched orders in transit exceeding 10-day inter-state delivery window; severe customer churn and cancellation risk.",
        sampleCases: [
          { id: "SAL-B2C-9018", entity: "Arjun Rampal (Bhopal)", product: "iPhone 14 Pro Max", courier: "Delhivery (#DLV552109)", pending: "402 h (16.7d)", delay: "+162 h overdue", amount: "₹88,000", action: "Escalate to National Courier Lead" },
          { id: "SAL-B2C-9045", entity: "Tanvi Saxena (Ranchi)", product: "Samsung Galaxy S22 Ultra", courier: "BlueDart (#BLU981245)", pending: "360 h (15d)", delay: "+120 h overdue", amount: "₹68,000", action: "Escalate to National Courier Lead" },
          { id: "SAL-B2C-9082", entity: "Mohit Bansal (Patna)", product: "OnePlus 11R (256 GB)", courier: "Shadowfax (#SHD771234)", pending: "295 h (12.2d)", delay: "+55 h overdue", amount: "₹38,000", action: "Locate Destination Hub" },
        ],
      },
      {
        id: "b2c-s-3",
        issue: "Marked RTO by Courier, Not Updated in DACBY",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 2,
        overdueCases: 0,
        dueSoonCases: 2,
        longestPending: "2.4 h",
        avgDelay: "2.1 h",
        severity: "High",
        severityRank: 2,
        department: "Logistics & Courier",
        valueAtRisk: "₹1.25L",
        valueRaw: 125000,
        status: "Due Soon",
        trend: "Approaching SLA",
        description: "Courier API marked delivery failure and RTO initiation; sync window approaching 3h SLA deadline.",
        sampleCases: [
          { id: "SAL-B2C-8102", entity: "Prateek Yadav (Delhi)", product: "iPad 9th Gen", courier: "BlueDart (#BLU849102)", pending: "2.4 h", delay: "36m buffer left", amount: "₹28,000", action: "Sync RTO Webhook" },
          { id: "SAL-B2C-8114", entity: "Ritika Sen (Kolkata)", product: "Apple Watch SE", courier: "Delhivery (#DLV772910)", pending: "2.1 h", delay: "54m buffer left", amount: "₹22,000", action: "Sync RTO Webhook" },
        ],
      },
      {
        id: "b2c-s-4",
        issue: "Marked Return by Courier, Not Updated in DACBY",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 2,
        overdueCases: 2,
        dueSoonCases: 0,
        longestPending: "6.2 h",
        avgDelay: "4.1 h",
        severity: "High",
        severityRank: 2,
        department: "Logistics & Courier",
        valueAtRisk: "₹92K",
        valueRaw: 92000,
        status: "Overdue",
        trend: "Stable",
        description: "Courier picked up customer return package, but reverse tracking state has not been reflected in user's order timeline.",
        sampleCases: [
          { id: "SAL-B2C-7801", entity: "Nidhi Agrawal (Jaipur)", product: "OnePlus 9R (Return)", courier: "Shadowfax (#SHD481029)", pending: "6.2 h", delay: "+3.2 h overdue", amount: "₹24,000", action: "Update Reverse Tracking" },
          { id: "SAL-B2C-7815", entity: "Ramanathan K (Chennai)", product: "Samsung Buds 2 Pro", courier: "Delhivery (#DLV662910)", pending: "4.5 h", delay: "+1.5 h overdue", amount: "₹12,000", action: "Update Reverse Tracking" },
        ],
      },
      {
        id: "b2c-s-5",
        issue: "Return Received, Replacement Not Dispatched",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 3,
        overdueCases: 2,
        dueSoonCases: 1,
        longestPending: "84 h",
        avgDelay: "78 h",
        severity: "Critical",
        severityRank: 1,
        department: "Warehouse Ops",
        valueAtRisk: "₹1.45L",
        valueRaw: 145000,
        status: "Overdue",
        trend: "Critical Alert",
        description: "Customer return received and verified at warehouse; replacement order dispatch is past the 72h SLA window.",
        sampleCases: [
          { id: "SAL-B2C-7204", entity: "Varun Bajaj (Gurugram)", product: "iPhone 13 (Replacement for Display)", courier: "Awaiting Dispatch", pending: "84 h", delay: "+12 h overdue", amount: "₹45,000", action: "Trigger Immediate Dispatch" },
          { id: "SAL-B2C-7218", entity: "Meenakshi Sundaram (Madurai)", product: "PS5 DualSense Controller", courier: "Awaiting Dispatch", pending: "76 h", delay: "+4 h overdue", amount: "₹6,500", action: "Trigger Immediate Dispatch" },
        ],
      },
      {
        id: "b2c-s-6",
        issue: "Return or RTO Delivered, Ledger Not Updated",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "24 h",
        slaHours: 24,
        openCases: 3,
        overdueCases: 2,
        dueSoonCases: 1,
        longestPending: "32 h",
        avgDelay: "28 h",
        severity: "Medium",
        severityRank: 3,
        department: "Finance & Ledger",
        valueAtRisk: "₹1.80L",
        valueRaw: 180000,
        status: "Overdue",
        trend: "+1 vs yesterday",
        description: "Returned or RTO units restored to active inventory bins; refund ledger entry pending verification.",
        sampleCases: [
          { id: "SAL-B2C-6901", entity: "Abhishek Roy (Kolkata)", product: "MacBook Air M1", courier: "Warehouse Restocked", pending: "32 h", delay: "+8 h overdue", amount: "₹56,000", action: "Post Ledger Reversal" },
          { id: "SAL-B2C-6912", entity: "Simran Kaur (Ludhiana)", product: "iPhone 12 (128 GB)", courier: "Warehouse Restocked", pending: "18 h", delay: "6h buffer left", amount: "₹34,000", action: "Post Ledger Reversal" },
        ],
      },
      {
        id: "b2c-s-7",
        issue: "Fast Delivery Not Processed",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "12 h",
        slaHours: 12,
        openCases: 2,
        overdueCases: 1,
        dueSoonCases: 1,
        longestPending: "18 h",
        avgDelay: "15 h",
        severity: "Critical",
        severityRank: 1,
        department: "Warehouse Ops",
        valueAtRisk: "₹88K",
        valueRaw: 88000,
        status: "Overdue",
        trend: "New Breach",
        description: "Buyer paid express fee for Same-Day / Next-Day Delivery; warehouse missed the 12-hour packaging and courier handover window.",
        sampleCases: [
          { id: "SAL-B2C-6102", entity: "Aditya Chopra (South Delhi)", product: "iPhone 15 Pro", courier: "Express Queue", pending: "18 h", delay: "+6 h overdue", amount: "₹88,000", action: "Assign Hyperlocal Courier" },
        ],
      },
      {
        id: "b2c-s-8",
        issue: "Replacement in Transit, Ledger Not Updated",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "48 h",
        slaHours: 48,
        openCases: 2,
        overdueCases: 2,
        dueSoonCases: 0,
        longestPending: "58 h",
        avgDelay: "52 h",
        severity: "Medium",
        severityRank: 3,
        department: "Finance & Ledger",
        valueAtRisk: "₹1.50L",
        valueRaw: 150000,
        status: "Overdue",
        trend: "New Breach",
        description: "Replacement device is out for delivery with courier; accounting ledger entry verification overdue past 48h SLA.",
        sampleCases: [
          { id: "SAL-B2C-5401", entity: "Kartik Aryan (Hyderabad)", product: "Galaxy S22 (Replacement)", courier: "BlueDart (#BLU661920)", pending: "58 h", delay: "+10 h overdue", amount: "₹48,000", action: "Post Replacement Journal" },
        ],
      },
      {
        id: "b2c-s-9",
        issue: "Order in Transit, Ledger Not Updated",
        category: "B2C Sales",
        categoryId: "b2c-sales",
        slaTarget: "48 h",
        slaHours: 48,
        openCases: 3,
        overdueCases: 2,
        dueSoonCases: 1,
        longestPending: "54 h",
        avgDelay: "50 h",
        severity: "Medium",
        severityRank: 3,
        department: "Finance & Ledger",
        valueAtRisk: "₹2.30L",
        valueRaw: 230000,
        status: "Overdue",
        trend: "+1 vs yesterday",
        description: "Prepaid orders dispatched and in transit; sales revenue recognition ledger posting overdue past 48h SLA window.",
        sampleCases: [
          { id: "SAL-B2C-4902", entity: "Vivek Oberoi (Pune)", product: "PS5 Digital Edition", courier: "Delhivery (#DLV991203)", pending: "54 h", delay: "+6 h overdue", amount: "₹39,990", action: "Trigger GST Invoice Posting" },
        ],
      },
    ],
  },

  "b2b-sales": {
    id: "b2b-sales",
    name: "B2B Sales",
    label: "B2B sales",
    description: "Monitor wholesale accounts receivable, credit term compliance, and dealer settlement aging.",
    icon: Building2,
    issues: [
      {
        id: "b2b-s-1",
        issue: "Dispatched, Payment Not Received",
        category: "B2B Sales",
        categoryId: "b2b-sales",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 3,
        overdueCases: 3,
        dueSoonCases: 0,
        longestPending: "360 h",
        avgDelay: "310 h",
        severity: "Critical",
        severityRank: 1,
        department: "Finance & Ledger",
        valueAtRisk: "₹9.20L",
        valueRaw: 920000,
        status: "Overdue",
        trend: "Critical Alert",
        description: "High-value wholesale consignment delivered to partner; invoice settlement is overdue past the 10-day credit term.",
        sampleCases: [
          { id: "SAL-B2B-1002", entity: "Metro Telecommunications (Delhi NCR)", product: "60x Mixed iPhone 12 Lots", courier: "Delivered (POD Verified)", pending: "360 h (15d)", delay: "+120 h overdue (5 days)", amount: "₹4,80,000", action: "Send Formal Payment Demand" },
          { id: "SAL-B2B-1008", entity: "Star Electronics Chain (Mumbai)", product: "45x Galaxy A-series Lots", courier: "Delivered (POD Verified)", pending: "312 h (13d)", delay: "+72 h overdue", amount: "₹2,90,000", action: "Freeze Credit Line & Call Finance" },
          { id: "SAL-B2B-1015", entity: "Vanguard Retail (Ahmedabad)", product: "20x OnePlus 10 Pro Lots", courier: "Delivered (POD Verified)", pending: "264 h (11d)", delay: "+24 h overdue", amount: "₹1,50,000", action: "Follow Up for Bank UTR" },
        ],
      },
    ],
  },

  "inventory": {
    id: "inventory",
    name: "Inventory",
    label: "Inventory",
    description: "Track vendor repair aging, out-of-stock missed demand, and dead stock liquidation thresholds.",
    icon: Package,
    issues: [
      {
        id: "inv-1",
        issue: "Stock Under Repair with Vendors",
        category: "Inventory",
        categoryId: "inventory",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 3,
        overdueCases: 0,
        dueSoonCases: 3,
        longestPending: "216 h",
        avgDelay: "190 h",
        severity: "High",
        severityRank: 2,
        department: "Vendor Management",
        valueAtRisk: "₹4.60L",
        valueRaw: 460000,
        status: "Due Soon",
        trend: "Approaching SLA",
        description: "Refurbishment inventory assigned to external authorized repair centers; turnaround time approaching 10-day SLA.",
        sampleCases: [
          { id: "INV-REP-801", entity: "Apex Tech Repairs (Okhla Hub)", product: "12x iPhone 13 Screen Replacements", courier: "Vendor Service Center", pending: "216 h (9d)", delay: "24h buffer left", amount: "₹1,85,000", action: "Request Repair ETA" },
          { id: "INV-REP-814", entity: "MicroChip Solutions (Bengaluru)", product: "8x MacBook Logic Board Repairs", courier: "Vendor Service Center", pending: "192 h (8d)", delay: "48h buffer left", amount: "₹1,60,000", action: "Request Repair ETA" },
        ],
      },
      {
        id: "inv-2",
        issue: "Out of Stock, Units Under Repair Exist",
        category: "Inventory",
        categoryId: "inventory",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 4,
        overdueCases: 3,
        dueSoonCases: 1,
        longestPending: "140 h",
        avgDelay: "96 h",
        severity: "Critical",
        severityRank: 1,
        department: "Warehouse Ops",
        valueAtRisk: "₹1.90L",
        valueRaw: 190000,
        status: "Overdue",
        trend: "High Churn Risk",
        description: "SKU displays 0 stock on consumer app causing lost sales, while repaired units sit in QC triage past 72h SLA.",
        sampleCases: [
          { id: "INV-OOS-401", entity: "Internal QC Desk (Bay 4)", product: "iPhone 13 128GB Midnight (5 units)", courier: "Warehouse Testing", pending: "140 h", delay: "+68 h overdue", amount: "₹95,000", action: "Fast-Track Final Inspection & List" },
          { id: "INV-OOS-409", entity: "Internal QC Desk (Bay 2)", product: "PS5 Digital Edition (3 units)", courier: "Warehouse Testing", pending: "96 h", delay: "+24 h overdue", amount: "₹65,000", action: "Fast-Track Final Inspection & List" },
          { id: "INV-OOS-415", entity: "Internal QC Desk (Bay 3)", product: "iPad Air 4 (2 units)", courier: "Warehouse Testing", pending: "76 h", delay: "+4 h overdue", amount: "₹30,000", action: "Fast-Track Final Inspection & List" },
        ],
      },
      {
        id: "inv-3",
        issue: "Dead Stock",
        category: "Inventory",
        categoryId: "inventory",
        slaTarget: "2,160 h",
        slaHours: 2160,
        openCases: 22,
        overdueCases: 15,
        dueSoonCases: 7,
        longestPending: "3,120 h",
        avgDelay: "2,450 h",
        severity: "High",
        severityRank: 2,
        department: "Warehouse Ops",
        valueAtRisk: "₹7.80L",
        valueRaw: 780000,
        status: "Overdue",
        trend: "+2 vs last week",
        description: "Inventory items stagnant and unsold in warehouse racks exceeding the 90-day holding SLA threshold.",
        sampleCases: [
          { id: "INV-DED-101", entity: "Zone C Warehouse Rack 14", product: "8x iPhone X (256 GB Older Gen)", courier: "Rack C-14", pending: "3,120 h (130d)", delay: "+960 h overdue", amount: "₹1,80,000", action: "Apply 25% Flash Clearance Markdown" },
          { id: "INV-DED-109", entity: "Zone C Warehouse Rack 18", product: "12x OnePlus 7 Pro Lots", courier: "Rack C-18", pending: "2,840 h (118d)", delay: "+680 h overdue", amount: "₹2,10,000", action: "Route to B2B Wholesale Clearance" },
          { id: "INV-DED-124", entity: "Zone D Warehouse Rack 04", product: "15x Samsung Galaxy S10 Lots", courier: "Rack D-04", pending: "2,450 h (102d)", delay: "+290 h overdue", amount: "₹2,30,000", action: "Liquidate via Offline Distributors" },
        ],
      },
    ],
  },
};

// Flatten all issues for multi-category aggregation
const ALL_ISSUES = Object.values(CATEGORIES_DATA).flatMap((cat) => cat.issues);

// =============================================================================
// Reusable Glassmorphic Card Container
// =============================================================================
function Card({ children, className = "", style = {} }) {
  return (
    <section
      className={`relative isolate overflow-hidden rounded-[22px] border text-[#18213b] shadow-[0_12px_34px_rgba(32,68,128,0.11)] backdrop-blur-2xl backdrop-saturate-150 transition duration-300 hover:shadow-[0_20px_42px_rgba(32,68,128,0.14)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 [&>*]:relative [&>*]:z-10 ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.60), rgba(250,252,255,0.36) 48%, rgba(238,246,255,0.26))",
        borderColor: "rgba(255,255,255,0.66)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default function Sla_Industry() {
  // Navigation & Filter States
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("overdue"); // "overdue" | "value" | "longest" | "target"
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIssueFilter, setSelectedIssueFilter] = useState(null);

  // Drill-down Modal State
  const [activeDrilldownIssue, setActiveDrilldownIssue] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  // Interactive View Modes for the 3 Enlarged Visual Analytics Cards
  const [donutMode, setDonutMode] = useState("status"); // "status" | "severity" | "category"
  const [trendMode, setTrendMode] = useState("cases"); // "cases" | "value" | "target"
  const [agingMode, setAgingMode] = useState("cases"); // "cases" | "value"
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic Height Sync between All Operations card and right-hand cards (Category Share + Bottlenecks)
  const rightColumnRef = useRef(null);
  const [rightColHeight, setRightColHeight] = useState(null);

  useEffect(() => {
    const updateHeight = () => {
      if (rightColumnRef.current && typeof window !== "undefined" && window.innerWidth >= 1024) {
        const cards = rightColumnRef.current.children;
        let totalH = 0;
        for (let i = 0; i < cards.length; i++) {
          totalH += cards[i].offsetHeight;
        }
        if (cards.length > 1) {
          totalH += (cards.length - 1) * 20; // 20px gap-5 between cards
        }
        if (totalH > 350) {
          setRightColHeight(totalH);
        } else {
          setRightColHeight(rightColumnRef.current.offsetHeight);
        }
      } else {
        setRightColHeight(null);
      }
    };

    updateHeight();

    let ro;
    if (typeof ResizeObserver !== "undefined" && rightColumnRef.current) {
      ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(rightColumnRef.current);
    }

    window.addEventListener("resize", updateHeight);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Tab change handler
  const handleTabChange = (tabId) => {
    setSelectedCategoryTab(tabId);
    setSelectedIssueFilter(null);
    setSelectedRows([]);
  };

  // Check if any filters, sorting, search, or tab selections are active
  const hasActiveFilters = useMemo(() => {
    return (
      statusFilter !== "all" ||
      severityFilter !== "all" ||
      searchQuery.trim() !== "" ||
      sortBy !== "overdue" ||
      selectedCategoryTab !== "all" ||
      selectedIssueFilter !== null ||
      selectedRows.length > 0
    );
  }, [
    statusFilter,
    severityFilter,
    searchQuery,
    sortBy,
    selectedCategoryTab,
    selectedIssueFilter,
    selectedRows,
  ]);

  // Comprehensive reset handler that clears all filters, search, tabs, and sorting
  const handleResetAllFilters = () => {
    setStatusFilter("all");
    setSeverityFilter("all");
    setSearchQuery("");
    setSortBy("overdue");
    setSelectedCategoryTab("all");
    setSelectedIssueFilter(null);
    setSelectedRows([]);
  };

  // Category Badge Styles
  const getCategoryBadgeClass = (catId) => {
    switch (catId) {
      case "b2c-purchases":
        return "border-[#C9DCFF] bg-[#EDF3FF] text-[#2459C4]";
      case "b2b-purchases":
        return "border-[#D2E2FB] bg-[#F0F5FF] text-[#1656C2]";
      case "b2c-sales":
        return "border-[#B7F1CD] bg-[#ECFBF3] text-[#157348]";
      case "b2b-sales":
        return "border-[#E1D4FB] bg-[#F5F0FF] text-[#633DB8]";
      case "inventory":
        return "border-[#F4D877] bg-[#FFF8E9] text-[#C87513]";
      default:
        return "border-white/80 bg-white/70 text-[#2459C4]";
    }
  };

  // Severity Badge Styles
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0F2] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#9E253A] border border-[#F5C7CE]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C24153] animate-pulse" />
            Urgent (High Risk)
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4EC] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#B54D14] border border-[#F8CCA8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DE7331]" />
            Important
          </span>
        );
      case "Medium":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF9E6] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#8F6510] border border-[#F3E098]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C99424]" />
            Moderate
          </span>
        );
    }
  };

  // Category Tabs Configuration
  const categoryTabs = useMemo(() => {
    return [
      { id: "all", label: "All Operations", count: ALL_ISSUES.length, icon: Layers },
      { id: "b2c-purchases", label: "B2C Purchases", count: CATEGORIES_DATA["b2c-purchases"].issues.length, icon: ShoppingCart },
      { id: "b2b-purchases", label: "B2B Purchases", count: CATEGORIES_DATA["b2b-purchases"].issues.length, icon: Briefcase },
      { id: "b2c-sales", label: "B2C Sales", count: CATEGORIES_DATA["b2c-sales"].issues.length, icon: TrendingUp },
      { id: "b2b-sales", label: "B2B Sales", count: CATEGORIES_DATA["b2b-sales"].issues.length, icon: Building2 },
      { id: "inventory", label: "Inventory", count: CATEGORIES_DATA["inventory"].issues.length, icon: Package },
    ];
  }, []);

  // Filter and Sort Active Table Rows
  const activeTableRows = useMemo(() => {
    let rows = selectedCategoryTab === "all" ? ALL_ISSUES : (CATEGORIES_DATA[selectedCategoryTab]?.issues || []);

    // Filter by single issue selected from chart
    if (selectedIssueFilter) {
      rows = rows.filter((r) => r.id === selectedIssueFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      rows = rows.filter((r) => {
        if (statusFilter === "overdue") return (r.overdueCases || 0) > 0;
        if (statusFilter === "due-soon") return (r.dueSoonCases || 0) > 0;
        return true;
      });
    }

    // Severity filter
    if (severityFilter !== "all") {
      rows = rows.filter((r) => r.severity.toLowerCase() === severityFilter.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.issue.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.severity.toLowerCase().includes(q) ||
          (r.department && r.department.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...rows].sort((a, b) => {
      if (sortBy === "value") {
        return (b.valueRaw || 0) - (a.valueRaw || 0);
      }
      if (sortBy === "longest") {
        return (parseFloat(b.longestPending) || 0) - (parseFloat(a.longestPending) || 0);
      }
      if (sortBy === "target") {
        return (a.slaHours || 9999) - (b.slaHours || 9999);
      }
      // default: overdue
      return (b.overdueCases || 0) - (a.overdueCases || 0);
    });
  }, [selectedCategoryTab, selectedIssueFilter, statusFilter, severityFilter, searchQuery, sortBy]);

  // Overall Aggregated Metrics
  const aggregatedKpis = useMemo(() => {
    const totalOpen = ALL_ISSUES.reduce((acc, i) => acc + i.openCases, 0);
    const totalOverdue = ALL_ISSUES.reduce((acc, i) => acc + i.overdueCases, 0);
    const totalDueSoon = ALL_ISSUES.reduce((acc, i) => acc + i.dueSoonCases, 0);
    const totalValueRaw = ALL_ISSUES.reduce((acc, i) => acc + (i.valueRaw || 0), 0);
    const criticalCases = ALL_ISSUES.filter((i) => i.severity === "Critical").reduce((acc, i) => acc + i.overdueCases, 0);
    const valueLakhs = (totalValueRaw / 100000).toFixed(1);

    return {
      totalOpen,
      totalOverdue,
      totalDueSoon,
      totalValueStr: `₹${valueLakhs}L`,
      criticalCases,
      breachRate: totalOpen > 0 ? Math.round((totalOverdue / totalOpen) * 100) : 0,
      avgResolutionTime: "18.4 h",
    };
  }, []);

  // Top 5 Critical Bottlenecks
  const topCriticalBottlenecks = useMemo(() => {
    return [...ALL_ISSUES]
      .sort((a, b) => (b.valueRaw || 0) - (a.valueRaw || 0))
      .slice(0, 5);
  }, []);

  // Checkbox Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(activeTableRows.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Case Action simulation in Modal
  const handleCaseAction = (caseId, actionName) => {
    setActionSuccessMessage(`Successfully triggered "${actionName}" for case ${caseId}`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  // Dynamic Datasets for Recharts Visual Analytics
  const donutChartData = useMemo(() => {
    if (donutMode === "severity") {
      const urgentCases = ALL_ISSUES.filter((i) => i.severity === "Critical").reduce((acc, i) => acc + i.overdueCases, 0);
      const importantCases = ALL_ISSUES.filter((i) => i.severity === "High").reduce((acc, i) => acc + i.overdueCases, 0);
      const moderateCases = ALL_ISSUES.filter((i) => i.severity === "Medium").reduce((acc, i) => acc + i.overdueCases, 0);
      return [
        { name: "Urgent", value: urgentCases, color: "#C24153", filterVal: "critical", desc: "Critical priority · immediate action required" },
        { name: "Important", value: importantCases, color: "#DE7331", filterVal: "high", desc: "High priority · needs timely resolution" },
        { name: "Moderate", value: moderateCases, color: "#C99424", filterVal: "medium", desc: "Medium priority · routine operational backlog" },
      ];
    }
    if (donutMode === "category") {
      return [
        { name: "Inventory", value: 25, color: "#E8AD37", catId: "inventory", valStr: "₹14.3L" },
        { name: "B2C Purchases", value: 19, color: "#2459C4", catId: "b2c-purchases", valStr: "₹11.1L" },
        { name: "B2C Sales", value: 16, color: "#157348", catId: "b2c-sales", valStr: "₹15.6L" },
        { name: "B2B Sales", value: 3, color: "#633DB8", catId: "b2b-sales", valStr: "₹9.2L" },
        { name: "B2B Purchases", value: 2, color: "#1656C2", catId: "b2b-purchases", valStr: "₹11.7L" },
      ];
    }
    // Default: status
    return [
      { name: "Breached (Overdue)", value: aggregatedKpis.totalOverdue, color: "#D34D5D", filterVal: "overdue", desc: "Past SLA deadline" },
      { name: "Due Soon (Buffer <25%)", value: aggregatedKpis.totalDueSoon, color: "#E8AD37", filterVal: "due-soon", desc: "Impending breach" },
    ];
  }, [donutMode, aggregatedKpis]);

  // 8-Week Trend Data for Recharts Line/Area Chart
  const trendChartData = [
    { week: "W1", cases: 32, value: 28.5, target: 25, label: "Week 1", change: "Base" },
    { week: "W2", cases: 45, value: 36.2, target: 25, label: "Week 2", change: "+40%" },
    { week: "W3", cases: 58, value: 44.8, target: 25, label: "Week 3", change: "+29%" },
    { week: "W4", cases: 64, value: 49.1, target: 25, label: "Week 4", change: "+10%" },
    { week: "W5", cases: 76, value: 58.4, target: 25, label: "Week 5", change: "+19%" },
    { week: "W6", cases: 74, value: 56.0, target: 25, label: "Week 6", change: "-3%" },
    { week: "W7", cases: 68, value: 51.8, target: 25, label: "Week 7", change: "-8%" },
    { week: "W8", cases: 85, value: 61.9, target: 25, label: "Week 8 (Current)", change: "+25%" },
  ];

  // Delay Aging Bar Chart Data for Recharts
  const agingChartData = [
    { range: "< 12h", cases: 22, value: 8.4, pct: "24%", stage: "Dock / 3PL Sync", color: "#FF7582" },
    { range: "12h-48h", cases: 32, value: 19.2, pct: "35%", stage: "Dispatch / Handover", color: "#E03137" },
    { range: "48h-120h", cases: 24, value: 21.5, pct: "26%", stage: "Payout / RTO", color: "#B83852" },
    { range: "> 120h", cases: 14, value: 12.8, pct: "15%", stage: "Dead Stock / Repairs", color: "#78101E" },
  ];

  // Custom Glassmorphic Tooltips for Recharts
  const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = donutChartData.reduce((acc, item) => acc + item.value, 0);
      const pct = total > 0 ? Math.round((data.value / total) * 100) : 0;
      return (
        <div className="relative z-50 rounded-xl border border-white/90 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(32,68,128,0.18)] backdrop-blur-xl text-xs space-y-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.color }} />
            <span className="font-bold text-xs text-[#151D35]">{data.name}</span>
          </div>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-black text-[#151D35]">{data.value}</span>
            <span className="text-[11px] font-bold text-[#8190A9]">cases ({pct}%)</span>
          </div>
          {data.payload.valStr && (
            <p className="text-[11px] font-bold text-[#B83852]">Value: {data.payload.valStr}</p>
          )}
          {data.payload.desc && (
            <p className="text-[10px] text-[#71809A] font-medium">{data.payload.desc}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomTrendTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="relative z-50 rounded-xl border border-white/90 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(32,68,128,0.18)] backdrop-blur-xl text-xs space-y-1.5 min-w-[170px] pointer-events-none">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-1">
            <span className="font-extrabold text-[#151D35]">{item.label}</span>
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${item.change.startsWith("+") ? "bg-[#FFF0F2] text-[#B83852]" : item.change.startsWith("-") ? "bg-[#ECFBF3] text-[#157348]" : "bg-slate-100 text-[#53647F]"
              }`}>
              {item.change}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#53647F] font-semibold">Breaches:</span>
            <span className="font-black text-[#D34D5D]">{item.cases} cases</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#53647F] font-semibold">Capital at Risk:</span>
            <span className="font-extrabold text-[#151D35]">₹{item.value}L</span>
          </div>
          {trendMode === "target" && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-[#157348] font-semibold">Target Cap:</span>
              <span className="font-bold text-[#157348]">{item.target} cases</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomAgingTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="relative z-50 rounded-xl border border-white/90 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(32,68,128,0.18)] backdrop-blur-xl text-xs space-y-1.5 min-w-[170px] pointer-events-none">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-1">
            <span className="font-black text-xs text-[#151D35]">{item.range} overdue</span>
            <span className="text-[10px] font-bold text-[#71809A]">{item.stage}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#53647F] font-semibold">Breach Volume:</span>
            <span className="font-black text-[#D34D5D]">{item.cases} cases ({item.pct})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#53647F] font-semibold">Capital Held:</span>
            <span className="font-extrabold text-[#151D35]">₹{item.value}L</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Operational Category Breach Data for visual breakdown graph
  const categoryBreachData = useMemo(() => {
    return Object.values(CATEGORIES_DATA)
      .map((cat) => {
        const overdue = cat.issues.reduce((acc, i) => acc + i.overdueCases, 0);
        const value = cat.issues.reduce((acc, i) => acc + (i.valueRaw || 0), 0);
        return {
          id: cat.id,
          name: cat.name,
          overdue,
          valueFormatted: `₹${(value / 100000).toFixed(1)}L`,
          pct: Math.round((overdue / 85) * 100),
        };
      })
      .sort((a, b) => b.overdue - a.overdue);
  }, []);

  const activeCategoryMeta = CATEGORIES_DATA[selectedCategoryTab] || {
    name: "All Operations",
    description: "Holistic operations monitor covering 21 critical SLA breach checkpoints across all pipelines.",
    icon: Layers,
  };
  const ActiveIcon = activeCategoryMeta.icon;

  return (
    <main className="glass-image-page font-sans text-slate-800">
      {/* ===================================================================== */}
      {/* TOP FLOATING FROSTED HEADER */}
      {/* ===================================================================== */}
      <header className="relative z-10 px-5 pt-4 sm:px-7">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/45 px-5 py-4 shadow-[0_8px_26px_rgba(32,68,128,.06)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1656C2] to-[#2A67EC] text-white shadow-[0_6px_20px_rgba(42,103,236,.3)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[.18em] text-[#2A67EC]">
                  DACBY ENTERPRISE · OPERATIONS SLA
                </span>
                <span className="rounded-full bg-[#FFF0F2] px-2 py-0.5 text-[10px] font-black text-[#B83852] border border-[#F5C7CE]">
                  21 BREACH MONITORS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#151D35]">
                SLA Breach
              </h1>
              <p className="mt-0.5 text-xs text-[#53647F] font-medium">
                Real-time tracking of operational bottlenecks, financial exposure, and case drill-downs across purchases, sales, and warehouse inventory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#B7F1CD] bg-[#ECFBF3]/90 px-3.5 py-1.5 text-xs font-bold text-[#157348] shadow-xs">
              <i className="h-2 w-2 rounded-full bg-[#16B879] animate-pulse" />
              Live Operations Sync
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* DASHBOARD BODY CONTAINER */}
      {/* ===================================================================== */}
      <div className="relative z-10 mx-auto max-w-[1560px] space-y-6 p-5 pb-20 sm:p-7">
        {/* =================================================================== */}
        {/* HIGH CRITICALITY LIVE BREACH ALERT BANNER */}
        {/* =================================================================== */}
        <div className="rounded-2xl border border-[#F5C7CE] bg-gradient-to-r from-[#FFF0F2]/95 via-[#FFE8EC]/90 to-[#FFF0F2]/95 p-4 shadow-[0_4px_20px_rgba(211,77,93,0.08)] backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#D34D5D] border border-[#F5C7CE] shadow-xs">
              <AlertTriangle className="h-5 w-5 text-[#D34D5D] animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D34D5D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D34D5D]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase tracking-wider text-[#B83852]">
                  High Alert: {aggregatedKpis.totalOverdue} Active SLA Breaches Detected
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-[#D34D5D] text-white shadow-2xs">
                  Immediate Action Required
                </span>
              </div>
              <p className="text-xs text-[#7A2536] font-medium mt-0.5">
                <strong>{aggregatedKpis.criticalCases} Urgent Cases</strong> with severe customer churn risk · <strong>{aggregatedKpis.totalValueStr} Capital Stuck</strong> across courier handovers, returns and repairs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSeverityFilter(severityFilter === "critical" ? "all" : "critical");
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer shadow-xs ${severityFilter === "critical"
                  ? "bg-[#D34D5D] text-white"
                  : "bg-white/85 hover:bg-white text-[#B83852] border border-[#F5C7CE]"
                }`}
            >
              {severityFilter === "critical" ? `Showing Urgent (${aggregatedKpis.criticalCases})` : `Filter Urgent Breaches (${aggregatedKpis.criticalCases})`}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TOP ENTERPRISE KPI CARDS (5 METRICS) */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Overdue SLA Breaches */}
          <Card className="min-h-[145px] p-5 border-[#F5C7CE] shadow-[0_12px_34px_rgba(211,77,93,0.12)] bg-gradient-to-br from-white/70 via-[#FFF8F9]/50 to-[#FFF0F2]/40">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] text-[#B83852]">
                Active SLA Breaches
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#D34D5D] border border-[#F5C7CE] shadow-xs">
                <AlertCircle className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black tracking-[-0.04em] text-[#B83852]">
                  {aggregatedKpis.totalOverdue}
                </p>
                <span className="text-xs font-bold text-[#D34D5D] bg-[#FFF0F2] border border-[#F5C7CE] px-2.5 py-0.5 rounded-full">
                  {aggregatedKpis.totalOverdue} Overdue · {aggregatedKpis.totalDueSoon} Due Soon
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#71809A]">
                {aggregatedKpis.totalOverdue} already breached · {aggregatedKpis.totalDueSoon} breaching soon ({aggregatedKpis.totalOpen} at risk)
              </p>
            </div>
          </Card>

          {/* Card 2: Financial Value at Risk */}
          <Card className="min-h-[145px] p-5 border-[#F5C7CE]">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] text-[#53647F]">
                Value at Risk
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#B83852] border border-[#F5C7CE] shadow-xs">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#151D35]">
                  {aggregatedKpis.totalValueStr}
                </p>
                <span className="text-[11px] font-bold text-[#B83852] bg-[#FFF0F2] border border-[#F5C7CE] px-2 py-0.5 rounded-full">
                  Capital Tied
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#71809A]">
                Revenue & assets stuck in breached steps
              </p>
            </div>
          </Card>

          {/* Card 3: Urgent Breaches */}
          <Card className="min-h-[145px] p-5 border-[#F5C7CE] shadow-[0_12px_34px_rgba(211,77,93,0.12)] bg-gradient-to-br from-white/70 via-[#FFF8F9]/50 to-[#FFF0F2]/40">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] text-[#B83852]">
                Urgent Breaches
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#B83852] border border-[#F5C7CE] shadow-xs">
                <AlertTriangle className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black tracking-[-0.04em] text-[#B83852]">
                  {aggregatedKpis.criticalCases}
                </p>
                <span className="text-[11px] font-bold text-white bg-[#D34D5D] px-2 py-0.5 rounded-full shadow-2xs">
                  Action Needed
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#71809A]">
                Immediate executive escalation required
              </p>
            </div>
          </Card>

          {/* Card 4: Due Soon (<20% buffer) */}
          <Card className="min-h-[145px] p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] text-[#53647F]">
                Due Soon (At Risk)
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E9] text-[#C87513] shadow-xs">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#151D35]">
                  {aggregatedKpis.totalDueSoon}
                </p>
                <span className="text-[11px] font-bold text-[#C87513]">Buffer &lt; 20%</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#71809A]">
                Breaching in next 12 to 24 hours
              </p>
            </div>
          </Card>

          {/* Card 5: Avg Breach Resolution */}
          <Card className="min-h-[145px] p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-nowrap text-xs font-black uppercase tracking-[0.14em] text-[#53647F]">
                Avg Breach Resolution
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECFBF3] text-[#13B89B] shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#151D35]">
                  {aggregatedKpis.avgResolutionTime}
                </p>
                <span className="text-[11px] font-bold text-[#157348] bg-[#ECFBF3] px-2 py-0.5 rounded-full">
                  Target &lt; 24h
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#71809A]">
                Average turnaround time to resolve
              </p>
            </div>
          </Card>
        </div>

        {/* =================================================================== */}
        {/* COMPREHENSIVE FILTER & SEARCH BAR */}
        {/* =================================================================== */}
        <Card className="p-3.5 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Live Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2A67EC]" />
                <input
                  type="text"
                  placeholder="Search by issue title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/80 bg-white/70 pl-9 pr-8 py-2 text-xs font-bold text-[#151D35] placeholder:text-[#8190A9] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#2A67EC]/20 shadow-xs backdrop-blur-md transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8190A9] hover:text-[#151D35] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Severity Filter */}
              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-white/80 bg-white/70 pl-8 pr-7 py-2 text-xs font-bold text-[#151D35] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#2A67EC]/20 cursor-pointer shadow-xs backdrop-blur-md transition"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Urgent (Immediate Action)</option>
                  <option value="high">Important (Needs Attention)</option>
                  <option value="medium">Moderate (Routine Fix)</option>
                </select>
                <AlertCircle className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#D34D5D]" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71809A]" />
              </div>

              {/* SLA Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-white/80 bg-white/70 pl-8 pr-7 py-2 text-xs font-bold text-[#151D35] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#2A67EC]/20 cursor-pointer shadow-xs backdrop-blur-md transition"
                >
                  <option value="all">All Breach Statuses</option>
                  <option value="overdue">Breached (Overdue)</option>
                  <option value="due-soon">Due Soon (&lt; 20% SLA Buffer)</option>
                </select>
                <Clock className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2A67EC]" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71809A]" />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-white/80 bg-white/70 pl-8 pr-7 py-2 text-xs font-bold text-[#151D35] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#2A67EC]/20 cursor-pointer shadow-xs backdrop-blur-md transition"
                >
                  <option value="overdue">Sort: Most Breached Cases</option>
                  <option value="value">Sort: Highest Value at Risk</option>
                  <option value="longest">Sort: Longest Pending Delay</option>
                  <option value="target">Sort: Shortest SLA Target</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71809A]" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71809A]" />
              </div>

              {/* Reset Filters inline with filter controls */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#B83852] bg-[#FFF0F2] hover:bg-[#FFE5E8] border border-[#F5C7CE] transition shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                  title="Reset all filters and sorting"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#D34D5D]" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* Results Counter on the right */}
            <div className="flex items-center shrink-0">
              <span className="text-xs font-bold text-[#53647F] bg-white/70 border border-white/80 px-3 py-2 rounded-xl shadow-2xs whitespace-nowrap">
                Showing {activeTableRows.length} of {ALL_ISSUES.length} operational monitors
              </span>
            </div>
          </div>
        </Card>

        {/* =================================================================== */}
        {/* CATEGORY SUB-NAVIGATION PILL TABS */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl border border-white/80 bg-white/45 backdrop-blur-xl shadow-[0_4px_16px_rgba(32,68,128,.04)]">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategoryTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-white text-[#2A67EC] shadow-[0_4px_14px_rgba(32,68,128,0.12)] border border-white/90"
                    : "text-[#53647F] hover:text-[#151D35] hover:bg-white/40 border border-transparent"
                  }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-[#EDF3FF] text-[#2A67EC]" : "bg-black/5 text-[#71809A]"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* VISUAL ANALYTICS ROW: 3 ENLARGED RECHARTS CARDS */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* 1. SLA Breach Breakdown & Composition (Donut / Circular Chart) */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE5F1]/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#151D35] flex items-center gap-1.5">
                    <span>SLA Risk Composition</span>
                  </h3>
                  <p className="text-[11px] text-[#71809A] font-semibold mt-0.5">
                    {donutMode === "status"
                      ? "Breached vs impending buffer"
                      : donutMode === "severity"
                        ? "Priority severity breakdown"
                        : "Operational pipeline share"}
                  </p>
                </div>

                {/* Donut Mode Switch Pills */}
                <div className="flex items-center rounded-xl bg-white/70 border border-[#DCE5F1]/80 p-0.5 text-[10px] font-black shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDonutMode("status")}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${donutMode === "status"
                        ? "bg-[#2A67EC] text-white shadow-xs"
                        : "text-[#53647F] hover:text-[#151D35]"
                      }`}
                  >
                    Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonutMode("severity")}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${donutMode === "severity"
                        ? "bg-[#2A67EC] text-white shadow-xs"
                        : "text-[#53647F] hover:text-[#151D35]"
                      }`}
                  >
                    Severity
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonutMode("category")}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${donutMode === "category"
                        ? "bg-[#2A67EC] text-white shadow-xs"
                        : "text-[#53647F] hover:text-[#151D35]"
                      }`}
                  >
                    Category
                  </button>
                </div>
              </div>

              {/* Enlarged Donut Chart Area with Recharts */}
              <div className="relative h-60 w-full mt-3 flex items-center justify-center">
                {/* Dynamic Center Badge (placed in background layer with z-0) */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center z-0 select-none">
                  <span className="text-3xl font-black text-[#151D35] leading-none">
                    {donutMode === "status"
                      ? aggregatedKpis.totalOverdue
                      : donutMode === "severity"
                        ? aggregatedKpis.totalOverdue
                        : 5}
                  </span>
                  <span className="text-[10px] text-[#B83852] font-black uppercase tracking-wider mt-1">
                    {donutMode === "status"
                      ? "Breaches"
                      : donutMode === "severity"
                        ? "Breaches"
                        : "Pipelines"}
                  </span>
                </div>

                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                    <PieChart>
                      <Pie
                        data={donutChartData}
                        innerRadius={64}
                        outerRadius={92}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                        animationDuration={700}
                      >
                        {donutChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="cursor-pointer hover:opacity-85 transition-opacity"
                            onClick={() => {
                              if (entry.filterVal) {
                                if (donutMode === "status") setStatusFilter(entry.filterVal);
                                if (donutMode === "severity") setSeverityFilter(entry.filterVal);
                              } else if (entry.catId) {
                                handleTabChange(entry.catId);
                              }
                            }}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={<CustomDonutTooltip />}
                        wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-[#8190A9]">
                    Loading breakdown...
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Legend Chips */}
            <div className="pt-3 border-t border-[#DCE5F1]/80 mt-2 flex flex-wrap items-center justify-between gap-1.5 text-xs">
              {donutChartData.map((d) => (
                <div
                  key={d.name}
                  onClick={() => {
                    if (d.filterVal) {
                      if (donutMode === "status") setStatusFilter(d.filterVal);
                      if (donutMode === "severity") setSeverityFilter(d.filterVal);
                    } else if (d.catId) {
                      handleTabChange(d.catId);
                    }
                  }}
                  className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-white/60 transition cursor-pointer"
                  title="Click to filter table"
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[#53647F] font-bold text-[11px] truncate max-w-[90px]">{d.name}</span>
                  <span className="font-black text-[#151D35] text-[11px]">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Historical 8-Week Trend (Line & Area Chart) */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE5F1]/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#151D35] flex items-center gap-1.5">
                    <span>8-Week Velocity & Trend</span>
                  </h3>
                  <p className="text-[11px] text-[#71809A] font-semibold mt-0.5">
                    {trendMode === "cases"
                      ? "Weekly breached cases trajectory"
                      : trendMode === "value"
                        ? "Weekly capital at risk (₹ Lakhs)"
                        : "Actual breaches vs SLA target threshold"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Trend View Switch Pills */}
                  <div className="flex items-center rounded-xl bg-white/70 border border-[#DCE5F1]/80 p-0.5 text-[10px] font-black shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setTrendMode("cases")}
                      className={`px-2 py-1 rounded-lg transition cursor-pointer ${trendMode === "cases"
                          ? "bg-[#2A67EC] text-white shadow-xs"
                          : "text-[#53647F] hover:text-[#151D35]"
                        }`}
                    >
                      Cases
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendMode("value")}
                      className={`px-2 py-1 rounded-lg transition cursor-pointer ${trendMode === "value"
                          ? "bg-[#2A67EC] text-white shadow-xs"
                          : "text-[#53647F] hover:text-[#151D35]"
                        }`}
                    >
                      Value (₹)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendMode("target")}
                      className={`px-2 py-1 rounded-lg transition cursor-pointer ${trendMode === "target"
                          ? "bg-[#2A67EC] text-white shadow-xs"
                          : "text-[#53647F] hover:text-[#151D35]"
                        }`}
                    >
                      vs Target
                    </button>
                  </div>
                  <span className="rounded-full border border-[#F5C7CE] bg-[#FFF0F2] px-2.5 py-0.5 text-[11px] font-bold text-[#B83852] whitespace-nowrap">
                    +35% vs W1
                  </span>
                </div>
              </div>

              {/* Enlarged Line & Area Chart with Recharts */}
              <div className="h-60 w-full mt-3">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendChartData} margin={{ top: 14, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="slaRedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D34D5D" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#D34D5D" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 4" stroke="#DCE5F1" vertical={false} />
                      <XAxis
                        dataKey="week"
                        tickLine={false}
                        axisLine={{ stroke: "#DCE5F1" }}
                        tick={{ fill: "#8190A9", fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#8190A9", fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(v) => (trendMode === "value" ? `₹${v}L` : v)}
                      />
                      <RechartsTooltip content={<CustomTrendTooltip />} wrapperStyle={{ zIndex: 100, pointerEvents: "none" }} />
                      <Area
                        type="monotone"
                        dataKey={trendMode === "value" ? "value" : "cases"}
                        stroke="#D34D5D"
                        strokeWidth={2.8}
                        fill="url(#slaRedAreaGrad)"
                        activeDot={{ r: 5, fill: "#D34D5D", stroke: "#fff", strokeWidth: 2 }}
                        name={trendMode === "value" ? "Value at Risk" : "Breached Cases"}
                      />
                      {trendMode === "target" && (
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#16B879"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={false}
                          name="Target SLA Cap"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-[#8190A9]">
                    Loading trend...
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Trend Summary */}
            <div className="pt-3 border-t border-[#DCE5F1]/80 mt-2 flex items-center justify-between text-[11px] text-[#71809A] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D34D5D]" />
                <span>Peak: <strong>85 cases (W8)</strong></span>
              </span>
              <span>Baseline: <strong>32 cases (W1)</strong></span>
              <span className="text-[#B83852] font-black">Net Growth: +53</span>
            </div>
          </Card>

          {/* 3. Delay Aging & Pipeline Severity (Bar Graph) */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE5F1]/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#151D35] flex items-center gap-1.5">
                    <span>Delay Aging & Severity</span>
                  </h3>
                  <p className="text-[11px] text-[#71809A] font-semibold mt-0.5">
                    {agingMode === "cases"
                      ? "Case volume across time brackets"
                      : "Financial capital locked across brackets"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Aging View Switch Pills */}
                  <div className="flex items-center rounded-xl bg-white/70 border border-[#DCE5F1]/80 p-0.5 text-[10px] font-black shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setAgingMode("cases")}
                      className={`px-2 py-1 rounded-lg transition cursor-pointer ${agingMode === "cases"
                          ? "bg-[#2A67EC] text-white shadow-xs"
                          : "text-[#53647F] hover:text-[#151D35]"
                        }`}
                    >
                      Cases
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgingMode("value")}
                      className={`px-2 py-1 rounded-lg transition cursor-pointer ${agingMode === "value"
                          ? "bg-[#2A67EC] text-white shadow-xs"
                          : "text-[#53647F] hover:text-[#151D35]"
                        }`}
                    >
                      Value (₹)
                    </button>
                  </div>
                  <span className="rounded-full border border-[#F5C7CE] bg-[#FFF0F2] px-2.5 py-0.5 text-[11px] font-bold text-[#B83852] whitespace-nowrap">
                    4 Bands
                  </span>
                </div>
              </div>

              {/* Enlarged Bar Chart with Recharts */}
              <div className="h-60 w-full mt-3">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agingChartData} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 4" stroke="#DCE5F1" vertical={false} />
                      <XAxis
                        dataKey="range"
                        tickLine={false}
                        axisLine={{ stroke: "#DCE5F1" }}
                        tick={{ fill: "#53647F", fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#8190A9", fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(v) => (agingMode === "value" ? `₹${v}L` : v)}
                      />
                      <RechartsTooltip content={<CustomAgingTooltip />} wrapperStyle={{ zIndex: 100, pointerEvents: "none" }} />
                      <Bar
                        dataKey={agingMode === "value" ? "value" : "cases"}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={48}
                      >
                        {agingChartData.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-[#8190A9]">
                    Loading aging...
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Aging Summary */}
            <div className="pt-3 border-t border-[#DCE5F1]/80 mt-2 flex items-center justify-between text-[11px] text-[#71809A] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E03137]" />
                <span>Core: <strong>12h-48h (35%)</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#78101E]" />
                <span>Deadlock &gt;120h: <strong>14 cases</strong></span>
              </span>
            </div>
          </Card>
        </div>

        {/* =================================================================== */}
        {/* MAIN LOWER SPLIT: LEFT (68%) DETAILED REGISTER & RIGHT (32%) INSIGHTS */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT COLUMN: DETAILED REGISTER (8 OF 12 COLS) */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-8 flex flex-col">
            <Card
              className="overflow-hidden flex flex-col w-full"
              style={
                rightColHeight
                  ? { height: `${rightColHeight}px`, maxHeight: `${rightColHeight}px` }
                  : { height: "700px", maxHeight: "700px" }
              }
            >
              {/* Table Header Strip */}
              <div className="border-b border-white/70 bg-white/40 px-5 py-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-xs">
                    <ActiveIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#151D35]">{activeCategoryMeta.name}</h2>
                      <span className="text-[11px] font-bold text-[#2A67EC] bg-[#EDF3FF] px-2.5 py-0.5 rounded-full">
                        {activeTableRows.length} Operational Monitors Active
                      </span>
                    </div>
                    <p className="text-xs text-[#53647F] font-medium mt-0.5">
                      {activeCategoryMeta.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2"></div>
              </div>

              {/* Table Body */}
              <div className="p-5 flex flex-col flex-1 min-h-0">
                <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 rounded-xl border border-[#DCE5F1]/60 sla-table-scroll">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-20 shadow-2xs bg-[#F6F8FC]">
                      <tr className="border-b border-[#DCE5F1]/80 text-[11px] font-black uppercase tracking-[0.08em] text-[#53647F] bg-[#F6F8FC]">
                        <th className="py-2.5 px-3 w-10 text-center bg-[#F6F8FC] shrink-0">#</th>
                        <th className="py-2.5 px-3 min-w-[200px] bg-[#F6F8FC]">Operational Issue</th>
                        <th className="py-2.5 px-3 bg-[#F6F8FC] whitespace-nowrap">Severity</th>
                        <th className="py-2.5 px-3 bg-[#F6F8FC] whitespace-nowrap">SLA Target</th>
                        <th className="py-2.5 px-3 text-center text-[#B83852] font-black bg-[#F6F8FC] whitespace-nowrap">Breaches</th>
                        <th className="py-2.5 px-3 bg-[#F6F8FC] whitespace-nowrap">Max Delay</th>
                        <th className="py-2.5 px-3 text-right bg-[#F6F8FC] whitespace-nowrap">Value at Risk</th>
                        <th className="py-2.5 px-3 bg-[#F6F8FC] whitespace-nowrap">SLA Status</th>
                        <th className="py-2.5 px-3 text-right bg-[#F6F8FC] whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5F1]/40">
                      {activeTableRows.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-[#8190A9] text-xs font-semibold">
                            No matching SLA breach issues found with active filters.
                          </td>
                        </tr>
                      ) : (
                        activeTableRows.map((row, idx) => {
                          return (
                            <tr
                              key={row.id}
                              className={`hover:bg-white/60 transition-colors group cursor-pointer ${row.severity === "Critical" ? "border-l-4 border-l-[#D34D5D] bg-[#FFF0F2]/20" : ""
                                }`}
                              onClick={() => setActiveDrilldownIssue(row)}
                            >
                              <td className="py-3 px-3 text-center font-bold text-[#8190A9]">{idx + 1}</td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-[#151D35] group-hover:text-[#2A67EC] transition leading-snug">
                                  {row.issue}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTabChange(row.categoryId);
                                    }}
                                    className={`inline-flex items-center px-2 py-0.2 rounded text-[9px] font-bold border cursor-pointer hover:opacity-80 transition ${getCategoryBadgeClass(
                                      row.categoryId
                                    )}`}
                                  >
                                    {row.category}
                                  </span>
                                  {row.trend && (
                                    <span className="text-[10px] text-[#71809A] font-semibold">
                                      · {row.trend}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                {getSeverityBadge(row.severity)}
                              </td>
                              <td className="py-3 px-3 font-semibold text-[#53647F] whitespace-nowrap">
                                <span className="font-extrabold text-[#151D35]">{row.slaTarget}</span>
                              </td>
                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                {statusFilter === "due-soon" ? (
                                  <div>
                                    <span className="inline-flex items-center justify-center min-w-[34px] px-2.5 py-1 rounded-full font-black text-sm shadow-2xs bg-[#FFF8E9] border border-[#F4D877] text-[#C87513]">
                                      {row.dueSoonCases}
                                    </span>
                                    {row.overdueCases > 0 && (
                                      <span className="block text-[10px] font-bold text-[#B83852] mt-0.5">
                                        {row.overdueCases} overdue
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div>
                                    {row.overdueCases > 0 ? (
                                      <>
                                        <span className="inline-flex items-center justify-center min-w-[34px] px-2.5 py-1 rounded-full font-black text-sm shadow-2xs bg-[#FFF0F2] border border-[#F5C7CE] text-[#B83852]">
                                          {row.overdueCases}
                                        </span>
                                        {row.dueSoonCases > 0 && (
                                          <span className="block text-[10px] font-bold text-[#C87513] mt-0.5">
                                            +{row.dueSoonCases} due soon
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span className="inline-flex items-center justify-center min-w-[34px] px-2.5 py-1 rounded-full font-black text-sm shadow-2xs bg-[#FFF8E9] border border-[#F4D877] text-[#C87513]">
                                          {row.dueSoonCases}
                                        </span>
                                        <span className="block text-[10px] font-bold text-[#71809A] mt-0.5">
                                          due soon
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 font-bold whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-black ${row.overdueCases === 0 && row.dueSoonCases > 0
                                    ? "bg-[#FFF8E9] border border-[#F4D877] text-[#C87513]"
                                    : "bg-[#FFF0F2] border border-[#F5C7CE] text-[#B83852]"
                                  }`}>
                                  <Clock className={`h-3 w-3 ${row.overdueCases === 0 && row.dueSoonCases > 0 ? "text-[#E8AD37]" : "text-[#D34D5D]"}`} />
                                  {row.longestPending}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-extrabold whitespace-nowrap">
                                <span className={row.severity === "Critical" ? "text-[#B83852] font-black" : "text-[#151D35]"}>
                                  {row.valueAtRisk}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                {row.overdueCases > 0 ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0F2] px-2.5 py-1 text-[11px] font-bold text-[#B83852] border border-[#F5C7CE]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#D34D5D]" />
                                    Breached
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E9] px-2.5 py-1 text-[11px] font-bold text-[#C87513] border border-[#F4D877]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#E8AD37]" />
                                    Due Soon
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setActiveDrilldownIssue(row)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/90 bg-white/80 hover:bg-white text-[#2A67EC] hover:text-[#1656C2] px-2.5 py-1 text-xs font-bold shadow-2xs hover:shadow-xs transition cursor-pointer"
                                >
                                  <span>View Cases</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#71809A] font-semibold pt-3 border-t border-[#DCE5F1]/80 shrink-0">
                  <span>
                    Displaying <strong>{activeTableRows.length}</strong> monitors with active criteria · Click any row to inspect underlying breached orders
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#D34D5D]" />
                      <span>Overdue Breaches: <strong>{activeTableRows.reduce((a, c) => a + c.overdueCases, 0)}</strong></span>
                    </div>
                    {activeTableRows.reduce((a, c) => a + c.dueSoonCases, 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#E8AD37]" />
                        <span>Due Soon: <strong>{activeTableRows.reduce((a, c) => a + c.dueSoonCases, 0)}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT COLUMN: CONTEXTUAL INTEL & RECENT BREACHES (4 OF 12 COLS) */}
          {/* ----------------------------------------------------------------- */}
          <div ref={rightColumnRef} className="lg:col-span-4 flex flex-col gap-5">
            {/* Operational Category Breach Distribution Graph */}
            <Card className="p-5">
              <div className="border-b border-[#DCE5F1]/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#151D35] flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#D34D5D]" />
                    <span>Category Breach Share</span>
                  </h3>
                  <p className="text-[11px] text-[#71809A] font-medium mt-0.5">
                    Breach distribution across 5 operations
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#B83852] bg-[#FFF0F2] px-2 py-0.5 rounded-full border border-[#F5C7CE]">
                  {aggregatedKpis.totalOverdue} Breaches
                </span>
              </div>

              <div className="mt-3.5 space-y-3">
                {categoryBreachData.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    className="space-y-1.5 group cursor-pointer hover:bg-white/40 p-1.5 rounded-xl transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#151D35] group-hover:text-[#D34D5D] transition">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-[#B83852] bg-[#FFF0F2] px-2 py-0.5 rounded-md border border-[#F5C7CE] text-[10px] font-black">
                          {cat.overdue} breaches
                        </span>
                        <span className="text-[#151D35] text-[11px] font-extrabold">{cat.valueFormatted}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/60 border border-white/80 overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6B7A] via-[#E03137] to-[#B83852] transition-all duration-500 shadow-sm"
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top 5 Financial Bottlenecks Card */}
            <Card className="overflow-hidden">
              <div className="border-b border-white/70 bg-white/40 px-5 py-3.5 backdrop-blur-md flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#151D35] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#D34D5D]" />
                  <span>Top 5 Financial Bottlenecks</span>
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#B83852] bg-[#FFF0F2] px-2 py-0.5 rounded-full border border-[#F5C7CE]">
                  Ranked by Value
                </span>
              </div>

              <div className="p-4">
                <div className="divide-y divide-[#DCE5F1]/40">
                  {topCriticalBottlenecks.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveDrilldownIssue(item)}
                      className="group flex items-start gap-3 py-3 px-2 rounded-xl hover:bg-white/60 transition cursor-pointer"
                    >
                      <span className="w-4 pt-0.5 text-xs font-black text-[#D34D5D] group-hover:scale-110 transition shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0 pr-1">
                        <p className="text-xs font-bold text-[#151D35] truncate group-hover:text-[#D34D5D] transition">
                          {item.issue}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold border ${getCategoryBadgeClass(item.categoryId)}`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-[#B83852]">
                            {item.overdueCases} breaches
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#B83852] block">
                          {item.valueAtRisk}
                        </span>
                        <span className="text-[10px] font-black text-[#D34D5D] bg-[#FFF0F2] border border-[#F5C7CE] px-1.5 py-0.2 rounded">
                          {item.longestPending}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUCCESS ACTION NOTIFICATION TOAST */}
      {/* ===================================================================== */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-[#B7F1CD] bg-[#ECFBF3] px-4 py-3 shadow-xl backdrop-blur-md">
          <CheckCircle2 className="h-5 w-5 text-[#16B879]" />
          <span className="text-xs font-bold text-[#157348]">{actionSuccessMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* INTERACTIVE CASE DRILL-DOWN MODAL / SLIDE-OVER */}
      {/* ===================================================================== */}
      {activeDrilldownIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md"
          onClick={() => setActiveDrilldownIssue(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[26px] border border-white/90 bg-white/95 shadow-[0_25px_60px_rgba(32,68,128,0.22)] backdrop-blur-3xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,250,255,0.92))",
            }}
          >
            {/* Modal Header */}
            <div className="border-b border-[#DCE5F1]/80 px-6 py-4 flex items-start justify-between gap-4 bg-white/40">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(activeDrilldownIssue.categoryId)}`}>
                    {activeDrilldownIssue.category}
                  </span>
                  {getSeverityBadge(activeDrilldownIssue.severity)}
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-extrabold text-[#151D35]">
                  {activeDrilldownIssue.issue}
                </h3>
                <p className="text-xs text-[#53647F] font-medium mt-1">
                  {activeDrilldownIssue.description}
                </p>
              </div>

              <button
                onClick={() => setActiveDrilldownIssue(null)}
                className="rounded-xl p-2 text-[#71809A] hover:bg-slate-100 hover:text-[#151D35] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal SLA Metrics Bar */}
            <div className="px-6 py-3.5 bg-[#EDF3FF]/40 border-b border-[#DCE5F1]/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#71809A] block">SLA Commitment</span>
                  <span className="font-extrabold text-sm text-[#151D35]">{activeDrilldownIssue.slaTarget}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#71809A] block">Breached Cases</span>
                  <div className="flex items-center gap-1.5 font-extrabold text-sm">
                    {activeDrilldownIssue.overdueCases > 0 && (
                      <span className="text-[#B83852]">{activeDrilldownIssue.overdueCases} Overdue</span>
                    )}
                    {activeDrilldownIssue.overdueCases > 0 && activeDrilldownIssue.dueSoonCases > 0 && (
                      <span className="text-[#8190A9]">·</span>
                    )}
                    {activeDrilldownIssue.dueSoonCases > 0 && (
                      <span className="text-[#C87513]">{activeDrilldownIssue.dueSoonCases} Due Soon</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#71809A] block">Longest Delay</span>
                  <span className="font-extrabold text-sm text-[#B83852]">{activeDrilldownIssue.longestPending}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#71809A] block">Financial Exposure</span>
                  <span className="font-extrabold text-sm text-[#151D35]">{activeDrilldownIssue.valueAtRisk}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDrilldownIssue(null)}
                  className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#53647F] flex items-center justify-center transition cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Sample Cases Register */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#53647F]">
                  Underlying Breached Cases & Orders ({activeDrilldownIssue.sampleCases?.length || 0} Sample Entries)
                </h4>
                <span className="text-[11px] font-bold text-[#8190A9]">
                  Live status synced from ERP & 3PL APIs
                </span>
              </div>

              <div className="rounded-2xl border border-[#DCE5F1]/80 bg-white/70 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DCE5F1]/80 bg-[#F6F8FC] text-[10px] font-black uppercase tracking-wider text-[#53647F]">
                      <th className="py-2.5 px-3">Case / Order ID</th>
                      <th className="py-2.5 px-3">Customer / Partner</th>
                      <th className="py-2.5 px-3">Item / Device</th>
                      <th className="py-2.5 px-3">Pending Time</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F1]/50">
                    {activeDrilldownIssue.sampleCases && activeDrilldownIssue.sampleCases.length > 0 ? (
                      activeDrilldownIssue.sampleCases.map((c) => (
                        <tr key={c.id} className="hover:bg-white transition-colors">
                          <td className="py-3 px-3 font-bold text-[#2A67EC]">{c.id}</td>
                          <td className="py-3 px-3 font-semibold text-[#151D35]">{c.entity}</td>
                          <td className="py-3 px-3 font-medium text-[#53647F]">{c.product}</td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-[#B83852] block">{c.pending}</span>
                            <span className="text-[10px] font-bold text-[#C85E6B]">{c.delay}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-[#151D35]">{c.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#8190A9]">
                          No individual cases currently tracked for this issue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#DCE5F1]/80 px-6 py-3 bg-[#F6F8FC] flex items-center justify-between text-xs text-[#71809A]">
              <span>Press ESC or click anywhere outside to close this drill-down</span>
              <button
                onClick={() => setActiveDrilldownIssue(null)}
                className="font-bold text-[#151D35] hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
