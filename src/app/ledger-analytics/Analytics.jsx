"use client";
import React, { useState } from 'react';
// import { categories } from '../../constants/inventory';
import TopNavigationBar from '../../components/common/TopNavigationBar';
import { AlertTriangle, Aperture, ArrowDown, ArrowLeftRight, ArrowRight, ArrowUp, BarChart2, Calendar, Camera, Clock, Columns, CornerDownLeft, Cpu, Database, Disc, Disc3, Filter, Gamepad, Gamepad2, Gauge, Headphones, History, IndianRupee, Info, Laptop, LineChart, Link, List, LogOut, MoreVertical, Package, Plug, PlusCircle, Shield, ShieldAlert, ShoppingCart, Smartphone, Tag, TrendingDown, TrendingUp, Watch, Wrench } from 'lucide-react';
const categories = [
  { name: "PS5 CDs", code: "D001Y" },
  { name: "PS4 CDs", code: "D002Y" },
  { name: "Pre Orders", code: "D003Y" },
  { name: "Consoles", code: "D004Y" },
  { name: "Controllers", code: "D005Y" },
  { name: "Accessories", code: "D006Y" },
  { name: "PC Components", code: "D009Y" },
  { name: "Cameras", code: "D014Y" },
  { name: "Camera Lens", code: "D015Y" },
  { name: "Laptops", code: "D018Y" },
  { name: "Smartphones", code: "D019Y" },
  { name: "Smart Devices", code: "D020Y" },
  { name: "Audio Devices", code: "D021Y" },
];
export default function Analytics() {
    const [selectedCategory, setSelectedCategory] = useState('All Category');
    const [agingCategory, setAgingCategory] = useState('All Category');
    const [ledgerInterval, setLedgerInterval] = useState('Daily');
    const [ledgerStartMonth, setLedgerStartMonth] = useState('Jan 2026');
    const [ledgerEndMonth, setLedgerEndMonth] = useState('Sep 2026');
    const [ledgerStartDate, setLedgerStartDate] = useState('2026-09-01');
    const [ledgerEndDate, setLedgerEndDate] = useState('2026-09-30');
    return (
        <div className="bg-slate-50 text-sm text-slate-900 antialiased">
            {/* Added container to replicate body classes */}
            {/* <TopNavigationBar /> */}
            <main className="w-full px-4 sm:px-10 lg:px-20 py-8 flex-1"><div className="flex flex-col w-full pb-12">
                {/* Top Metadata & Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <div className="flex flex-col gap-0.5 min-w-0">

                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Ledger &amp; Inventory Analytics</h1>
                        </div>

                    </div>
                    {/* Right Side Actions & Sync */}
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-48 transition-colors cursor-pointer"
                        >
                            <option value="All Category">All Category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Enterprise Filter Bar Container */}

                {/* SECTION 1: Top Stats Grid */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { title: "TOTAL INVENTORY", globalValue: "12,458", globalSub: "₹1,84,52,000", catValue: "3,420", catSub: "₹62,50,000", percentage: "27.4%", icon: List, bg: "bg-sky-50/50", border: "border-sky-100", iconColor: "text-sky-500", valColor: "text-slate-900" },
                        { title: "UNDER EVALUATION", globalValue: "450", globalSub: "₹12,50,000", catValue: "120", catSub: "₹3,15,000", percentage: "26.6%", icon: Shield, bg: "bg-amber-50/50", border: "border-amber-100", iconColor: "text-amber-500", valColor: "text-slate-900" },
                        { title: "UNDER REPAIR", globalValue: "215", globalSub: "₹6,45,000", catValue: "85", catSub: "₹2,10,000", percentage: "39.5%", icon: Wrench, bg: "bg-rose-50/50", border: "border-rose-100", iconColor: "text-rose-500", valColor: "text-slate-900" },
                        { title: "READY TO SHIP", globalValue: "1,120", globalSub: "₹24,80,000", catValue: "430", catSub: "₹12,40,000", percentage: "38.4%", icon: Package, bg: "bg-indigo-50/50", border: "border-indigo-100", iconColor: "text-indigo-500", valColor: "text-slate-900" },
                        { title: "LEDGER OUT", globalValue: "8,450", globalSub: "₹1,24,00,000", catValue: "2,150", catSub: "₹34,10,000", percentage: "25.4%", icon: LogOut, bg: "bg-emerald-50/50", border: "border-emerald-100", iconColor: "text-emerald-500", valColor: "text-emerald-700" },
                        { title: "ATTACHED", globalValue: "1,540", globalSub: "₹45,20,000", catValue: "420", catSub: "₹10,50,000", percentage: "27.2%", icon: Link, bg: "bg-fuchsia-50/50", border: "border-fuchsia-100", iconColor: "text-fuchsia-500", valColor: "text-slate-900" },
                        { title: "DAMAGED", globalValue: "85", globalSub: "₹1,25,000", catValue: "12", catSub: "₹45,000", percentage: "14.1%", icon: AlertTriangle, bg: "bg-red-50/50", border: "border-red-100", iconColor: "text-red-500", valColor: "text-slate-900" },
                        { title: "AVG INV VAL", globalValue: "₹14,810", globalSub: "Avg unit valuation", catValue: "₹22,450", catSub: "Avg unit valuation", percentage: "151%", icon: BarChart2, bg: "bg-indigo-50/50", border: "border-indigo-100", iconColor: "text-indigo-500", valColor: "text-slate-900" },
                        { title: "AVG BUY PRICE", globalValue: "₹12,450", globalSub: "Avg procurement price", catValue: "₹18,200", catSub: "Avg procurement price", percentage: "146.1%", icon: ShoppingCart, bg: "bg-orange-50/50", border: "border-orange-100", iconColor: "text-orange-500", valColor: "text-slate-900" },
                        { title: "AVG SELL PRICE", globalValue: "₹16,800", globalSub: "Avg realized price", catValue: "₹24,500", catSub: "Avg realized price", percentage: "145.8%", icon: Tag, bg: "bg-emerald-50/50", border: "border-emerald-100", iconColor: "text-emerald-500", valColor: "text-emerald-700" },
                        { title: "AVG PROFIT", globalValue: "₹4,350", globalSub: "Avg profit margin", catValue: "₹6,300", catSub: "Avg profit margin", percentage: "144.8%", icon: TrendingUp, bg: "bg-indigo-50/50", border: "border-indigo-100", iconColor: "text-indigo-500", valColor: "text-slate-900" },
                        { title: "AVG PROFIT/UNIT", globalValue: "₹3,850", globalSub: "Avg net profit", catValue: "₹5,150", catSub: "Avg net profit", percentage: "133.7%", icon: IndianRupee, bg: "bg-violet-50/50", border: "border-violet-100", iconColor: "text-violet-500", valColor: "text-slate-900" }
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className={`p-4 rounded-xl border ${stat.bg} ${stat.border} flex flex-col justify-center gap-3 shadow-sm`}>
                                <div className="flex items-center gap-1.5">
                                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{stat.title}</span>
                                </div>

                                <div className="flex flex-col">
                                    <div className={`text-2xl font-bold ${stat.valColor}`}>
                                        {selectedCategory === "All Category" ? stat.globalValue : stat.catValue}
                                    </div>
                                    {selectedCategory === "All Category" ? (
                                        stat.globalSub && (
                                            <div className="text-xs font-semibold text-slate-500 mt-1">
                                                {stat.globalSub}
                                            </div>
                                        )
                                    ) : (
                                        stat.catSub && (
                                            <div className="text-xs font-semibold text-slate-500 mt-1">
                                                {stat.catSub}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SECTIONS 3 & 4: Two-column layout (Inventory by Category & Inventory Aging) */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Section 3: Inventory by Category (7 Cols) */}
                    <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900">Inventory by Category</h3>

                            </div>

                        </div>
                        {/* Category Proportional Bars */}
                        <div className="flex flex-col gap-3 mt-2 max-h-[380px] overflow-y-auto pr-2">
                            {[
                                { name: "Smartphones", units: "3,420", unitShare: "27.4", value: "₹62.5 Lakh", valueShare: "33.9", icon: Smartphone, color: "bg-blue-600", iconColor: "text-blue-700" },
                                { name: "Laptops", units: "2,840", unitShare: "22.8", value: "₹58.2 Lakh", valueShare: "31.5", icon: Laptop, color: "bg-sky-500", iconColor: "text-sky-600" },
                                { name: "Consoles", units: "2,150", unitShare: "17.3", value: "₹34.1 Lakh", valueShare: "18.5", icon: Gamepad2, color: "bg-emerald-500", iconColor: "text-emerald-600" },
                                { name: "PS5 CDs", units: "1,520", unitShare: "12.2", value: "₹45.6 Lakh", valueShare: "24.7", icon: Disc, color: "bg-blue-500", iconColor: "text-blue-600" },
                                { name: "Smart Devices", units: "920", unitShare: "7.4", value: "₹8.5 Lakh", valueShare: "4.6", icon: Watch, color: "bg-indigo-400", iconColor: "text-indigo-500" },
                                { name: "PS4 CDs", units: "850", unitShare: "6.8", value: "₹12.7 Lakh", valueShare: "6.9", icon: Disc3, color: "bg-blue-400", iconColor: "text-blue-500" },
                                { name: "Controllers", units: "840", unitShare: "6.7", value: "₹3.2 Lakh", valueShare: "1.7", icon: Gamepad, color: "bg-teal-500", iconColor: "text-teal-600" },
                                { name: "Cameras", units: "750", unitShare: "6.0", value: "₹8.2 Lakh", valueShare: "4.4", icon: Camera, color: "bg-rose-500", iconColor: "text-rose-600" },
                                { name: "Audio Devices", units: "700", unitShare: "5.6", value: "₹6.3 Lakh", valueShare: "3.4", icon: Headphones, color: "bg-slate-500", iconColor: "text-slate-600" },
                                { name: "PC Components", units: "480", unitShare: "3.9", value: "₹15.2 Lakh", valueShare: "8.2", icon: Cpu, color: "bg-purple-500", iconColor: "text-purple-600" },
                                { name: "Camera Lens", units: "430", unitShare: "3.5", value: "₹1.2 Lakh", valueShare: "0.7", icon: Aperture, color: "bg-rose-400", iconColor: "text-rose-500" },
                                { name: "Accessories", units: "408", unitShare: "3.3", value: "₹2.3 Lakh", valueShare: "1.2", icon: Plug, color: "bg-slate-400", iconColor: "text-slate-500" },
                                { name: "Pre Orders", units: "320", unitShare: "2.6", value: "₹14.4 Lakh", valueShare: "7.8", icon: Clock, color: "bg-amber-500", iconColor: "text-amber-600" },
                            ].map((cat, idx) => {
                                const Icon = cat.icon;
                                return (
                                    <div key={idx} className="flex flex-col gap-1 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-slate-900 flex items-center gap-2">
                                                <Icon className={`w-4 h-4 ${cat.iconColor}`} /> {cat.name}
                                            </span>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="text-slate-600 font-medium">{cat.units} Units</span>
                                                <span className="font-bold text-slate-900">{cat.value}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                            <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.unitShare}%` }}></div>
                                        </div>
                                        <div className="text-[10px] font-semibold text-slate-500 text-right uppercase tracking-wide mt-0.5">
                                            {cat.unitShare}% Units &middot; {cat.valueShare}% Value
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-700">Total Inventory: <span className="text-slate-900 font-bold">12,458 Units</span></span>
                                <span className="font-semibold text-slate-700">Total Inventory Value: <span className="text-slate-900 font-bold">₹1,84,52,000</span></span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                <span>Bar = Unit Share</span>
                                <span>Value = Inventory Value Share</span>
                            </div>
                        </div>
                    </div>
                    {/* Section 4: Inventory Aging Analysis (5 Cols) */}
                    {(() => {
                        const globalAging = {
                            count: {
                                "0-30": { percentage: 43.2, units: "4,240" },
                                "31-60": { percentage: 31.8, units: "3,120" },
                                "61-90": { percentage: 15.1, units: "1,480" },
                                "90+": { percentage: 10.0, units: "980" },
                                total: "12,458 Units"
                            },
                            value: {
                                "0-30": { percentage: 41.9, value: "₹77.3 Lakh" },
                                "31-60": { percentage: 32.4, value: "₹59.8 Lakh" },
                                "61-90": { percentage: 14.4, value: "₹26.6 Lakh" },
                                "90+": { percentage: 11.3, value: "₹20.8 Lakh" },
                                total: "₹184.5 Lakh"
                            }
                        };
                    
                        const categoryAging = {
                            count: {
                                "0-30": { percentage: 52.0, units: "1,778" },
                                "31-60": { percentage: 28.5, units: "974" },
                                "61-90": { percentage: 12.0, units: "410" },
                                "90+": { percentage: 7.5, units: "258" },
                                total: "3,420 Units"
                            },
                            value: {
                                "0-30": { percentage: 50.5, value: "₹31.6 Lakh" },
                                "31-60": { percentage: 29.8, value: "₹18.6 Lakh" },
                                "61-90": { percentage: 11.2, value: "₹7.0 Lakh" },
                                "90+": { percentage: 8.5, value: "₹5.3 Lakh" },
                                total: "₹62.5 Lakh"
                            }
                        };
                    
                        const agingData = agingCategory === "All Category" ? globalAging : categoryAging;
                    
                        const buckets = [
                            { key: "0-30", label: "0–30 Days", color: "bg-emerald-500" },
                            { key: "31-60", label: "31–60 Days", color: "bg-blue-500" },
                            { key: "61-90", label: "61–90 Days", color: "bg-orange-500" },
                            { key: "90+", label: "90+ Days", color: "bg-red-500" }
                        ];
                    
                        return (
                            <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm flex flex-col font-sans">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Inventory Aging Analysis</h3>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={agingCategory}
                                            onChange={(e) => setAgingCategory(e.target.value)}
                                            className="px-2 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm transition-colors cursor-pointer"
                                        >
                                            <option value="All Category">All Category</option>
                                            {categories.map((cat, i) => (
                                                <option key={i} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                    
                                <div className="flex flex-col gap-10">
                                    {/* COUNT SECTION */}
                                    <div className="flex flex-col gap-4">
                                        <div className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">COUNT</div>
                                        <div className="flex flex-col gap-3">
                                            {buckets.map((b) => (
                                                <div key={b.key} className="flex items-center gap-4 text-xs font-medium">
                                                    <div className="w-[72px] text-slate-600">{b.label}</div>
                                                    <div className="flex-1 flex items-center bg-slate-50 rounded-full h-2.5">
                                                        <div className={`h-2.5 rounded-full ${b.color}`} style={{ width: `${agingData.count[b.key].percentage}%` }}></div>
                                                    </div>
                                                    <div className="w-auto flex items-center justify-end gap-3 text-right">
                                                        <span className="text-slate-400 font-normal">{agingData.count[b.key].units}</span>
                                                        <span className="w-10 text-slate-700 font-mono">{agingData.count[b.key].percentage.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Total: {agingData.count.total}</div>
                                    </div>
                    
                                    {/* VALUE SECTION */}
                                    <div className="flex flex-col gap-4">
                                        <div className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">VALUE</div>
                                        <div className="flex flex-col gap-3">
                                            {buckets.map((b) => (
                                                <div key={b.key} className="flex items-center gap-4 text-xs font-medium">
                                                    <div className="w-[72px] text-slate-600">{b.label}</div>
                                                    <div className="flex-1 flex items-center bg-slate-50 rounded-full h-2.5">
                                                        <div className={`h-2.5 rounded-full ${b.color}`} style={{ width: `${agingData.value[b.key].percentage}%` }}></div>
                                                    </div>
                                                    <div className="w-auto flex items-center justify-end gap-3 text-right">
                                                        <span className="text-slate-400 font-normal">{agingData.value[b.key].value}</span>
                                                        <span className="w-10 text-slate-700 font-mono">{agingData.value[b.key].percentage.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Total: {agingData.value.total}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
                {/* SECTION 5: Inventory Efficiency (4 Precision Metric Cards with Tooltip Formulas) */}
                <div className="mt-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Gauge className="w-5 h-5 text-blue-700" />
                            <h2 className="text-xl font-semibold text-slate-900">Inventory Efficiency &amp; Velocity</h2>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Efficiency Metric 1 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between relative group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 font-medium">Turnover Ratio</span>
                                
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-bold text-slate-900 font-bold tracking-tight">4.8x</div>

                            </div>
                          
                        </div>
                        {/* Efficiency Metric 2 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between relative group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 font-medium">Sell Through Rate</span>
                               
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-bold text-slate-900 font-bold tracking-tight">68.4%</div>

                            </div>
                            
                        </div>
                        {/* Efficiency Metric 3 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between relative group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 font-medium">Units Sold / Day</span>
                               
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-bold text-slate-900 font-bold tracking-tight">84.6</div>

                            </div>
                           
                        </div>
                        {/* Efficiency Metric 4 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between relative group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 font-medium">Stock Runway</span>
                                
                            </div>
                            <div className="my-2">
                                <div className="text-4xl font-bold text-emerald-700 font-bold tracking-tight">38 Days</div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* SECTION 6: Ledger Movement (Intake vs Outflow) */}
                {(() => {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const availableMonths = [];
                    for (let y = 2025; y <= 2026; y++) {
                        for (let m = 0; m < 12; m++) {
                            if (y === 2026 && m > 8) break;
                            availableMonths.push(`${monthNames[m]} ${y}`);
                        }
                    }
                    const reversedMonths = [...availableMonths].reverse();

                    const getDummyData = (prefix, count) => Array.from({length: count}).map((_, i) => {
                        const day = (i + 1).toString().padStart(2, '0');
                        const inU = 60 + ((i * 17) % 80);
                        const outU = 40 + ((i * 23) % 70);
                        return {
                            label: `${day} ${prefix}`,
                            inUnits: inU,
                            inValue: `₹${(inU * 1.5 / 100).toFixed(2)}L`,
                            outUnits: outU,
                            outValue: `₹${(outU * 1.5 / 100).toFixed(2)}L`
                        };
                    });

                    let ledgerData = [];
                    if (ledgerInterval === 'Daily') {
                        ledgerData = getDummyData('Sep', 15);
                    } else {
                        const sIdx = availableMonths.indexOf(ledgerStartMonth);
                        const eIdx = availableMonths.indexOf(ledgerEndMonth);
                        const start = Math.max(0, Math.min(sIdx, eIdx));
                        const end = Math.min(availableMonths.length - 1, Math.max(sIdx, eIdx));
                        
                        const selectedRange = availableMonths.slice(start, end + 1);
                        ledgerData = selectedRange.map((m, i) => {
                            const inU = 1500 + ((i * 317) % 800);
                            const outU = 1200 + ((i * 423) % 700);
                            return {
                                label: m,
                                inUnits: inU,
                                inValue: `₹${(inU * 1.5 / 100).toFixed(2)}L`,
                                outUnits: outU,
                                outValue: `₹${(outU * 1.5 / 100).toFixed(2)}L`
                            };
                        });
                    }

                    const maxUnits = Math.max(...ledgerData.flatMap(d => [d.inUnits, d.outUnits]), 1) * 1.1;
                    const chartWidth = Math.max(900, ledgerData.length * 40);

                    return (
                        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <ArrowLeftRight className="w-5 h-5 text-blue-700" />
                                    <h2 className="text-xl font-semibold text-slate-900">Ledger Movement (Intake vs Outflow)</h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                                        <button 
                                            onClick={() => setLedgerInterval('Daily')} 
                                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${ledgerInterval === 'Daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Daily
                                        </button>
                                        <button 
                                            onClick={() => setLedgerInterval('Monthly')} 
                                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${ledgerInterval === 'Monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                    
                                    {ledgerInterval === 'Daily' && (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="date" 
                                                value={ledgerStartDate}
                                                onChange={(e) => setLedgerStartDate(e.target.value)}
                                                className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <span className="text-slate-400 text-xs">to</span>
                                            <input 
                                                type="date" 
                                                value={ledgerEndDate}
                                                onChange={(e) => setLedgerEndDate(e.target.value)}
                                                className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    )}

                                    {ledgerInterval === 'Monthly' && (
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={ledgerStartMonth} 
                                                onChange={(e) => setLedgerStartMonth(e.target.value)}
                                                className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                {reversedMonths.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                            <span className="text-slate-400 text-xs">to</span>
                                            <select 
                                                value={ledgerEndMonth} 
                                                onChange={(e) => setLedgerEndMonth(e.target.value)}
                                                className="text-xs font-semibold bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                {reversedMonths.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* SVG Chart */}
                                <div className="bg-slate-50 rounded-xl pt-4 pb-2 flex flex-col gap-4 border border-slate-100 overflow-hidden">
                                    <div className="flex items-center justify-end gap-4 text-xs font-medium px-6">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                                            <span>Ledger In</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                                            <span>Ledger Out</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full overflow-x-auto overflow-y-hidden pb-4 px-6 custom-scrollbar flex">
                                        <div style={{ minWidth: chartWidth, width: '100%', height: '200px' }} className="relative flex-1">
                                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} 200`}>
                                                <line opacity="0.3" stroke="#cbd5e1" strokeDasharray="4 4" x1="0" x2={chartWidth} y1="40" y2="40"></line>
                                                <line opacity="0.3" stroke="#cbd5e1" strokeDasharray="4 4" x1="0" x2={chartWidth} y1="90" y2="90"></line>
                                                <line opacity="0.3" stroke="#cbd5e1" strokeDasharray="4 4" x1="0" x2={chartWidth} y1="140" y2="140"></line>
                                                <line opacity="0.8" stroke="#94a3b8" x1="0" x2={chartWidth} y1="190" y2="190" strokeWidth="1.5"></line>

                                                {ledgerData.map((d, i) => {
                                                    const spacing = ledgerData.length > 1 ? (chartWidth - 80) / (ledgerData.length - 1) : 0;
                                                    const xPos = ledgerData.length === 1 ? chartWidth / 2 : 40 + i * spacing;
                                                    const inHeight = (d.inUnits / maxUnits) * 150;
                                                    const outHeight = (d.outUnits / maxUnits) * 150;
                                                    const rectWidth = ledgerData.length > 30 ? 10 : 16;
                                                    
                                                    return (
                                                        <g key={i} className="group cursor-pointer">
                                                            <title>{`${d.label}\nLedger In: +${d.inUnits} Units (${d.inValue})\nLedger Out: -${d.outUnits} Units (${d.outValue})`}</title>
                                                            <rect fill="#059669" width={rectWidth} rx="2" x={xPos - rectWidth - 2} y={190 - inHeight} height={inHeight} className="group-hover:opacity-80 transition-opacity"></rect>
                                                            <rect fill="#2563eb" width={rectWidth} rx="2" x={xPos + 2} y={190 - outHeight} height={outHeight} className="group-hover:opacity-80 transition-opacity"></rect>
                                                            
                                                            {/* X-axis Label */}
                                                            <text x={xPos} y="210" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500" fontFamily="monospace">{d.label}</text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="border border-slate-200 rounded-lg overflow-y-auto max-h-[300px] mt-2 custom-scrollbar relative">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-xs text-slate-500 font-semibold tracking-wider uppercase border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="py-3 px-4 font-semibold">Date</th>
                                                <th className="py-3 px-4 font-semibold">Ledger In</th>
                                                <th className="py-3 px-4 font-semibold">Ledger Out</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {[...ledgerData].reverse().map((d, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-2.5 px-4 font-medium text-slate-900 whitespace-nowrap">{d.label}</td>
                                                    <td className="py-2.5 px-4 font-mono text-emerald-700 font-medium whitespace-nowrap">
                                                        +{d.inUnits} Units <span className="text-slate-400">·</span> <span className="text-slate-600 font-normal">{d.inValue}</span>
                                                    </td>
                                                    <td className="py-2.5 px-4 font-mono text-blue-700 font-medium whitespace-nowrap">
                                                        -{d.outUnits} Units <span className="text-slate-400">·</span> <span className="text-slate-600 font-normal">{d.outValue}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })()}
                </div>
                {/* SECTION 7: Monthly Opening & Closing Inventory Trend */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-5 h-5 text-blue-700" />
                                <h2 className="text-xl font-semibold text-slate-900">Monthly Opening &amp; Closing Inventory Trend</h2>
                            </div>

                        </div>
                        <span className="text-xs font-mono text-slate-600 px-2 py-1 bg-slate-100 rounded-md">Q2 FY24 Review</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* April 2024 */}
                        <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-slate-900 font-semibold">April 2024</span>
                                <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono">Closed</span>
                            </div>
                            <div className="my-4 flex flex-col gap-1 text-xs font-mono">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Opening:</span>
                                    <span className="font-semibold text-slate-900">8,420 Units (₹1.12 Cr)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Closing:</span>
                                    <span className="font-semibold text-slate-900">9,120 Units (₹1.25 Cr)</span>
                                </div>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-emerald-700 text-xs font-medium font-semibold">
                                <span className="flex items-center gap-0.5">
                                    <TrendingUp className="w-4 h-4" /> Net Growth
                                </span>
                                <span>+700 Units (+₹13.0L)</span>
                            </div>
                        </div>
                        {/* May 2024 */}
                        <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-slate-900 font-semibold">May 2024</span>
                                <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono">Closed</span>
                            </div>
                            <div className="my-4 flex flex-col gap-1 text-xs font-mono">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Opening:</span>
                                    <span className="font-semibold text-slate-900">9,120 Units (₹1.25 Cr)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Closing:</span>
                                    <span className="font-semibold text-slate-900">10,240 Units (₹1.41 Cr)</span>
                                </div>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-emerald-700 text-xs font-medium font-semibold">
                                <span className="flex items-center gap-0.5">
                                    <TrendingUp className="w-4 h-4" /> Net Growth
                                </span>
                                <span>+1,120 Units (+₹16.0L)</span>
                            </div>
                        </div>
                        {/* June 2024 (Active) */}
                        <div className="bg-slate-100 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-slate-900 font-bold">June 2024 (Current)</span>
                                <span className="px-1 py-0.5 rounded bg-blue-700 text-white text-xs font-mono font-semibold">Active Snapshot</span>
                            </div>
                            <div className="my-4 flex flex-col gap-1 text-xs font-mono">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Opening:</span>
                                    <span className="font-semibold text-slate-900">10,240 Units (₹1.41 Cr)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Closing:</span>
                                    <span className="font-bold text-blue-700">12,458 Units (₹1.85 Cr)</span>
                                </div>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-emerald-700 text-xs font-medium font-semibold">
                                <span className="flex items-center gap-0.5">
                                    <TrendingUp className="w-4 h-4" /> Q2 Peak Net
                                </span>
                                <span>+2,218 Units (+₹44.0L)</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SECTION 8: Inventory Health (6 Clickable Risk & Action Cards) */}
                <div className="mt-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <ShieldAlert className="w-5 h-5 text-red-700" />
                            <h2 className="text-xl font-semibold text-slate-900">Inventory Health &amp; Critical Exceptions</h2>
                        </div>
                        <span className="text-xs text-slate-600">Click any category card to filter explorer view</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Risk 1: Low Stock */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-semibold tracking-wide font-semibold">High Priority</span>
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">184 SKUs</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">Low Stock Warning</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Trigger Reorder</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {/* Risk 2: Under Repair Stagnant */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-red-200 text-red-900 text-[11px] font-semibold tracking-wide font-semibold">&gt; 7 Days Idle</span>
                                <Wrench className="w-5 h-5 text-red-700" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">186 Units</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">Under Repair Delay</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Escalate to Bench</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {/* Risk 3: Under Evaluation Backlog */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-semibold tracking-wide font-semibold">&gt; 48h Intake</span>
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">420 Units</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">Awaiting Evaluation</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Assign Graders</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {/* Risk 4: 90+ Days Aging */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-red-200 text-red-900 text-[11px] font-semibold tracking-wide font-semibold">Dead Capital</span>
                                <History className="w-5 h-5 text-red-700" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">980 Units</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">90+ Days Aging</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Apply Clearance</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {/* Risk 5: Low Margin SKUs */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold tracking-wide font-semibold">CM1 &lt; 12%</span>
                                <TrendingDown className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">72 SKUs</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">Low Margin Margin</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Revise Pricing</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {/* Risk 6: High Return Rate */}
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                            <div className="flex items-center justify-between">
                                <span className="px-1 py-0.5 rounded bg-red-200 text-red-900 text-[11px] font-semibold tracking-wide font-semibold">&gt; 8.5% RTO</span>
                                <CornerDownLeft className="w-5 h-5 text-red-700" />
                            </div>
                            <div className="my-2">
                                <div className="text-xl font-semibold font-bold text-slate-900">31 SKUs</div>
                                <div className="text-xs font-medium text-slate-600 font-medium">Excess Returns</div>
                            </div>
                            <div className="text-blue-700 text-[11px] font-semibold tracking-wide font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Inspect QA Logs</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* SECTION 9: Procurement Opportunities (Velocity x Margin) */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-1">
                                <LineChart className="w-5 h-5 text-blue-700" />
                                <h2 className="text-xl font-semibold text-slate-900">Procurement Opportunities (Velocity × Margin)</h2>
                            </div>
                            <p className="text-xs text-slate-600">Algorithmic restocking recommendations prioritizing highest net contribution potential</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-sky-100 text-sky-950 text-xs font-mono font-semibold">Formula: Units Sold/Day × CM1</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-[11px] font-semibold tracking-wide text-slate-600 uppercase tracking-wider">
                                <tr>
                                    <th className="py-1 px-4 rounded-l-lg">SKU / Ident</th>
                                    <th className="py-1 px-4">Product Model</th>
                                    <th className="py-1 px-4 text-center">Velocity (Sold/Day)</th>
                                    <th className="py-1 px-4 text-right">CM1 / Unit</th>
                                    <th className="py-1 px-4 text-right">Avg Repair Cost</th>
                                    <th className="py-1 px-4 text-center">Stock Runway</th>
                                    <th className="py-1 px-4 text-right">Opportunity Score</th>
                                    <th className="py-1 px-4 text-right rounded-r-lg">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-0 text-slate-900">
                                {/* Row 1: MacBook Air M2 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4 text-xs font-mono font-semibold text-blue-700">LAP-MAC-M2-15</td>
                                    <td className="py-2 px-4">
                                        <div className="text-xs font-medium font-bold text-slate-900">MacBook Air M2 15" (16GB, 512GB)</div>
                                        <div className="text-xs text-slate-600">Space Gray • Battery Health &gt; 90%</div>
                                    </td>
                                    <td className="py-2 px-4 text-center font-code font-bold">14.2 / day</td>
                                    <td className="py-2 px-4 text-right font-code text-emerald-700 font-bold">₹18,400</td>
                                    <td className="py-2 px-4 text-right font-code text-slate-600">₹2,800</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 text-xs font-mono font-bold">4 Days Left</span></td>
                                    <td className="py-2 px-4 text-right font-code text-blue-700 font-bold text-body-lg">261,280</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="px-2 py-1 rounded bg-blue-700 text-white hover:bg-on-primary-fixed-variant transition-colors text-[11px] font-semibold tracking-wide font-semibold">PO Create</button>
                                    </td>
                                </tr>
                                {/* Row 2: iPhone 14 Pro */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4 text-xs font-mono font-semibold text-blue-700">PHN-IP14P-128</td>
                                    <td className="py-2 px-4">
                                        <div className="text-xs font-medium font-bold text-slate-900">iPhone 14 Pro 128GB</div>
                                        <div className="text-xs text-slate-600">Deep Purple • Grade A+ Re-boxed</div>
                                    </td>
                                    <td className="py-2 px-4 text-center font-code font-bold">22.8 / day</td>
                                    <td className="py-2 px-4 text-right font-code text-emerald-700 font-bold">₹10,500</td>
                                    <td className="py-2 px-4 text-right font-code text-slate-600">₹1,950</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono font-bold">7 Days Left</span></td>
                                    <td className="py-2 px-4 text-right font-code text-blue-700 font-bold text-body-lg">239,400</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="px-2 py-1 rounded bg-blue-700 text-white hover:bg-on-primary-fixed-variant transition-colors text-[11px] font-semibold tracking-wide font-semibold">PO Create</button>
                                    </td>
                                </tr>
                                {/* Row 3: Sony PS5 Disc */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4 text-xs font-mono font-semibold text-blue-700">CON-PS5-DISC</td>
                                    <td className="py-2 px-4">
                                        <div className="text-xs font-medium font-bold text-slate-900">Sony PlayStation 5 Disc Edition</div>
                                        <div className="text-xs text-slate-600">Standard DualSense Bundle • 825GB</div>
                                    </td>
                                    <td className="py-2 px-4 text-center font-code font-bold">18.5 / day</td>
                                    <td className="py-2 px-4 text-right font-code text-emerald-700 font-bold">₹8,200</td>
                                    <td className="py-2 px-4 text-right font-code text-slate-600">₹1,200</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono font-bold">9 Days Left</span></td>
                                    <td className="py-2 px-4 text-right font-code text-blue-700 font-bold text-body-lg">151,700</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="px-2 py-1 rounded bg-blue-700 text-white hover:bg-on-primary-fixed-variant transition-colors text-[11px] font-semibold tracking-wide font-semibold">PO Create</button>
                                    </td>
                                </tr>
                                {/* Row 4: Sony WH-1000XM5 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4 text-xs font-mono font-semibold text-blue-700">AUD-SNY-XM5-BLK</td>
                                    <td className="py-2 px-4">
                                        <div className="text-xs font-medium font-bold text-slate-900">Sony WH-1000XM5 Wireless ANC</div>
                                        <div className="text-xs text-slate-600">Black • Factory Sealed Ear Cushions</div>
                                    </td>
                                    <td className="py-2 px-4 text-center font-code font-bold">12.1 / day</td>
                                    <td className="py-2 px-4 text-right font-code text-emerald-700 font-bold">₹5,400</td>
                                    <td className="py-2 px-4 text-right font-code text-slate-600">₹650</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-emerald-100 text-emerald-950 text-xs font-mono font-bold">18 Days</span></td>
                                    <td className="py-2 px-4 text-right font-code text-blue-700 font-bold text-body-lg">65,340</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="px-2 py-1 rounded bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors text-[11px] font-semibold tracking-wide font-semibold">PO Create</button>
                                    </td>
                                </tr>
                                {/* Row 5: Canon EOS R6 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4 text-xs font-mono font-semibold text-blue-700">CAM-CAN-R6-BDY</td>
                                    <td className="py-2 px-4">
                                        <div className="text-xs font-medium font-bold text-slate-900">Canon EOS R6 Mirrorless Body</div>
                                        <div className="text-xs text-slate-600">Shutter Count &lt; 5k • Clean Sensor</div>
                                    </td>
                                    <td className="py-2 px-4 text-center font-code font-bold">4.6 / day</td>
                                    <td className="py-2 px-4 text-right font-code text-emerald-700 font-bold">₹22,000</td>
                                    <td className="py-2 px-4 text-right font-code text-slate-600">₹3,400</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 text-xs font-mono font-bold">3 Days Left</span></td>
                                    <td className="py-2 px-4 text-right font-code text-blue-700 font-bold text-body-lg">101,200</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="px-2 py-1 rounded bg-blue-700 text-white hover:bg-on-primary-fixed-variant transition-colors text-[11px] font-semibold tracking-wide font-semibold">PO Create</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* SECTION 10: Detailed Inventory Explorer (Expandable Enterprise Table) */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-1">
                                <Database className="w-5 h-5 text-blue-700" />
                                <h2 className="text-xl font-semibold text-slate-900">Detailed Inventory Explorer</h2>
                            </div>
                            <span className="text-xs text-slate-600">Granular multi-attribute audit and physical SKU status monitor</span>
                        </div>
                        {/* Table Filter Bar Tools */}
                        <div className="flex flex-wrap items-center gap-1">
                            <div className="relative">
                                <input className="h-9 pl-8 pr-4 bg-slate-50 rounded-lg text-xs text-slate-900 placeholder:text-on-surface-variant focus:outline-none" placeholder="Filter current list..." type="text" />
                                <Filter className="w-4 h-4 absolute left-2 top-2 text-slate-500" />
                            </div>
                            <select className="h-9 px-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-900 focus:outline-none">
                                <option>Condition: All</option>
                                <option>Like New (Grade A+)</option>
                                <option>Minor Scratches (Grade A)</option>
                                <option>Fair (Grade B)</option>
                            </select>
                            <select className="h-9 px-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-900 focus:outline-none">
                                <option>Sort: Value (High to Low)</option>
                                <option>Sort: Days of Stock (Lowest)</option>
                                <option>Sort: Return Rate (Highest)</option>
                            </select>
                            <button className="h-9 px-2 rounded-lg bg-slate-100 text-slate-600 hover:text-on-surface" title="Columns Customize">
                                <Columns className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>
                    {/* Master Explorer Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-[11px] font-semibold tracking-wide text-slate-600 uppercase tracking-wider">
                                <tr>
                                    <th className="py-2 px-4 rounded-l-lg">Product &amp; SKU</th>
                                    <th className="py-2 px-4">Category</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4 text-center">Shelf Age</th>
                                    <th className="py-2 px-4 text-right">Cost Value</th>
                                    <th className="py-2 px-4 text-right">Sale Price</th>
                                    <th className="py-2 px-4 text-center">In Stock</th>
                                    <th className="py-2 px-4 text-center">Sold (30d)</th>
                                    <th className="py-2 px-4 text-center">Runway</th>
                                    <th className="py-2 px-4 text-center">Return %</th>
                                    <th className="py-2 px-4 text-right rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-0 text-slate-900 text-xs font-mono">
                                {/* Row 1 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <img className="w-9 h-9 rounded-lg object-cover bg-slate-100" data-alt="Refurbished Apple iPhone 14 Pro in Deep Purple studio lighting on matte surface with subtle reflections and clean enterprise catalog backdrop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChFNpBZ2ujSl2RSp9nQP3TweW8kvGEA7-ZkpCVGi7ehrY54uzG41Jr1zttmob2cDWddtBmKBryseiOnlu6Ug79lwt1jLT8RHLq5PKA9qF2QnRwpmxa_ysRLbciREmJCdS-PDG_cSR9cu6Knk4t25ky-O0_hgrzK1sRxejTvQJzH3Lgq4pNyOk8Ub2L1-sJ4p14HSwuDrSwywvrzQpXs4-6KR7A8WaIwauk0n-0F-xJXmFSRuF2aLjo" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium font-bold text-slate-900 truncate">iPhone 14 Pro (128GB)</span>
                                                <span className="text-xs font-mono text-blue-700">SKU: PHN-IP14P-128</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-body-sm text-slate-900">Smartphones</td>
                                    <td className="py-2 px-4"><span className="px-1 py-0.5 rounded bg-emerald-100 text-emerald-950 font-label-sm font-semibold">Ready to Ship</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-bold">12 Days</td>
                                    <td className="py-2 px-4 text-right">₹64,500</td>
                                    <td className="py-2 px-4 text-right font-bold text-slate-900">₹75,000</td>
                                    <td className="py-2 px-4 text-center font-bold text-slate-900">160 Units</td>
                                    <td className="py-2 px-4 text-center">684 Units</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">7 Days</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-semibold">2.1%</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="p-1 rounded text-slate-600 hover:text-on-surface" title="Inspect Ledger History">
                                            <MoreVertical className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <img className="w-9 h-9 rounded-lg object-cover bg-slate-100" data-alt="Refurbished Apple MacBook Air M2 in Space Gray open laptop view crisp display sharp industrial studio photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3PYkKw8n3RsRfHCHBtFyTE6clIUa7Proix6kZPpcD-4plR3K7bJGAiGi6Y0kSLvwImkEMLpdAm6AR5gQXlaVpF3Gbf4iA8jn6kJoD4f0NcgbswYNKW2Bp39xBk6rr8FyHuHStJvqCx2WujHNDRgBAs5Lb6oMbLRGKhsmW8Bh94zPj91gIfDq5_OCkDZR1jjPC4isg_r5-AjySMaSrRCVhRcCmoYBmPJWYNIJQgSbIOqh4h7PvyoEn" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium font-bold text-slate-900 truncate">MacBook Air M2 15"</span>
                                                <span className="text-xs font-mono text-blue-700">SKU: LAP-MAC-M2-15</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-body-sm text-slate-900">Laptops</td>
                                    <td className="py-2 px-4"><span className="px-1 py-0.5 rounded bg-blue-100 text-blue-950 font-label-sm font-semibold">Product Attached</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-bold">18 Days</td>
                                    <td className="py-2 px-4 text-right">₹86,000</td>
                                    <td className="py-2 px-4 text-right font-bold text-slate-900">₹1,04,400</td>
                                    <td className="py-2 px-4 text-center font-bold text-slate-900">57 Units</td>
                                    <td className="py-2 px-4 text-center">426 Units</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 font-semibold">4 Days</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-semibold">1.4%</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="p-1 rounded text-slate-600 hover:text-on-surface" title="Inspect Ledger History">
                                            <MoreVertical className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <img className="w-9 h-9 rounded-lg object-cover bg-slate-100" data-alt="PlayStation 5 Disc Edition console with white side panels and DualSense wireless controller on sleek tech showcase stand" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC50sPijxHQ1b0X0XfiNLW6PPVJsnT7MaqJ5loPGvBJmooK-YrSEUzWY44t73CttBKHGsUDyHgVYnMcN91NunFA5tyxs6GAJ2RN_wuO6aJFcDNK905rsiwKFHF4hkMBw-dORAdqX1qIOaySEhkSfuyDDhZ_RoXJBSsisbsV3JVEsoU63fduAsjwRGNlRO5qHELmf1HjqdZ12GicpjH3a52O7A1_XfbzXeil7IlHg4UPlwyY78tcbBA1" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium font-bold text-slate-900 truncate">Sony PS5 Disc Edition</span>
                                                <span className="text-xs font-mono text-blue-700">SKU: CON-PS5-DISC</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-body-sm text-slate-900">Consoles</td>
                                    <td className="py-2 px-4"><span className="px-1 py-0.5 rounded bg-emerald-100 text-emerald-950 font-label-sm font-semibold">Ready to Ship</span></td>
                                    <td className="py-2 px-4 text-center text-blue-700 font-bold">34 Days</td>
                                    <td className="py-2 px-4 text-right">₹38,500</td>
                                    <td className="py-2 px-4 text-right font-bold text-slate-900">₹46,700</td>
                                    <td className="py-2 px-4 text-center font-bold text-slate-900">166 Units</td>
                                    <td className="py-2 px-4 text-center">555 Units</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">9 Days</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-semibold">3.8%</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="p-1 rounded text-slate-600 hover:text-on-surface" title="Inspect Ledger History">
                                            <MoreVertical className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <img className="w-9 h-9 rounded-lg object-cover bg-slate-100" data-alt="Canon EOS R6 digital mirrorless camera body showing optical sensor mount and rugged professional weather-sealed body" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-GMEkLUpuAOM4Ch_odISLOqYX4QwjQLNjMSc24QGyFtS_8XYPgQCOOsOhTMlSgjd1lLM-lnTlsYYvo37RRKRLdUI_6FxgGqTcrxEGfmI75g38EZUN_w_CGREBEtW-CdkiPC8YEJ3qA9R9jPqpTtpZoKieAToqM9KuPhTiL6jKqi3SUZmckTiBDHmIteMu6aJD8gwsXu5z18UpVITH3fwI1a8tYVABZgmXpQOLDjz3ZEYQ45QYcoCE" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium font-bold text-slate-900 truncate">Canon EOS R6 Body</span>
                                                <span className="text-xs font-mono text-blue-700">SKU: CAM-CAN-R6-BDY</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-body-sm text-slate-900">Cameras</td>
                                    <td className="py-2 px-4"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 font-label-sm font-semibold">Under Repair</span></td>
                                    <td className="py-2 px-4 text-center text-amber-700 font-bold">68 Days</td>
                                    <td className="py-2 px-4 text-right">₹1,18,000</td>
                                    <td className="py-2 px-4 text-right font-bold text-slate-900">₹1,40,000</td>
                                    <td className="py-2 px-4 text-center font-bold text-slate-900">14 Units</td>
                                    <td className="py-2 px-4 text-center">138 Units</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 font-semibold">3 Days</span></td>
                                    <td className="py-2 px-4 text-center text-red-700 font-semibold">8.9%</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="p-1 rounded text-slate-600 hover:text-on-surface" title="Inspect Ledger History">
                                            <MoreVertical className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 5 */}
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                <Disc className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium font-bold text-slate-900 truncate">God of War Ragnarök (PS5 Disc)</span>
                                                <span className="text-xs font-mono text-blue-700">SKU: GME-PS5-GOWR</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-body-sm text-slate-900">PS5 CDs</td>
                                    <td className="py-2 px-4"><span className="px-1 py-0.5 rounded bg-red-200 text-red-900 font-label-sm font-semibold">90+ Aging</span></td>
                                    <td className="py-2 px-4 text-center text-red-700 font-bold">104 Days</td>
                                    <td className="py-2 px-4 text-right">₹1,950</td>
                                    <td className="py-2 px-4 text-right font-bold text-slate-900">₹2,499</td>
                                    <td className="py-2 px-4 text-center font-bold text-slate-900">320 Units</td>
                                    <td className="py-2 px-4 text-center">45 Units</td>
                                    <td className="py-2 px-4 text-center"><span className="px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">213 Days</span></td>
                                    <td className="py-2 px-4 text-center text-emerald-700 font-semibold">0.9%</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="p-1 rounded text-slate-600 hover:text-on-surface" title="Inspect Ledger History">
                                            <MoreVertical className="w-[18px] h-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Enterprise Pagination Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                        <div>
                            Showing <strong className="text-slate-900">1 to 5</strong> of <strong className="text-slate-900">12,458 SKUs</strong>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-mono mr-1">Page 1 of 2,492</span>
                            <button className="h-8 px-2 rounded bg-slate-100 text-slate-600 opacity-60 cursor-not-allowed" disabled>Prev</button>
                            <button className="h-8 w-8 rounded bg-blue-700 text-white font-bold text-center">1</button>
                            <button className="h-8 w-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 text-center">2</button>
                            <button className="h-8 w-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 text-center">3</button>
                            <span className="px-1 text-slate-600">...</span>
                            <button className="h-8 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
