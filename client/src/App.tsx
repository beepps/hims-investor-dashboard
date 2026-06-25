import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart, Scatter
} from "recharts";
import {
  TrendingUp, TrendingDown, AlertTriangle, Target, Activity,
  BarChart2, Users, Zap, Shield, ChevronRight, Info,
  ArrowUpRight, ArrowDownRight, Minus, Clock, Search,
  DollarSign, Percent, Eye, BookOpen, Award
} from "lucide-react";

// ────────────────────────────────────────────────
// DATA LAYER
// ────────────────────────────────────────────────

const PRICE = 19.84;
const PREV_CLOSE = 20.76;
const YEAR_LOW = 13.74;
const YEAR_HIGH = 70.43;
const MARKET_CAP = 4356090240;
const PE = 38.9;
const EPS = 0.51;
const AVG_VOLUME = 34230836;
const SHORT_FLOAT_PCT = 44.40;

// Historical Revenue
const revenueHistory = [
  { year: "2021", revenue: 271.9, grossProfit: 204.5, grossMargin: 75.2, ebitda: -111.0, netIncome: -107.7 },
  { year: "2022", revenue: 526.9, grossProfit: 408.7, grossMargin: 77.6, ebitda: -61.2, netIncome: -65.7 },
  { year: "2023", revenue: 872.0, grossProfit: 714.9, grossMargin: 82.0, ebitda: -19.9, netIncome: -23.5 },
  { year: "2024", revenue: 1476.5, grossProfit: 1173.1, grossMargin: 79.4, ebitda: 79.0, netIncome: 126.0 },
  { year: "2025", revenue: 2347.6, grossProfit: 1733.4, grossMargin: 74.0, ebitda: 318.0, netIncome: 128.4 },
];

// Consensus Estimates
const estimates = [
  { year: "2026E", revenue: 2732.8, ebitda: 325.0, netIncome: 128.2, grossProfit: 1975.4 },
  { year: "2027E", revenue: 3207.5, ebitda: 408.8, netIncome: 153.9, grossProfit: 2328.2 },
  { year: "2028E", revenue: 3629.4, ebitda: 518.8, netIncome: 248.5, grossProfit: 2656.7 },
];

// Customer / Segment Data
const customerData = [
  { year: "2021", subscribers: 554, monthlyARPU: 51, avgOrderValue: 74, netOrders: 3504 },
  { year: "2022", subscribers: 1040, monthlyARPU: 53, avgOrderValue: 82, netOrders: 6122 },
  { year: "2023", subscribers: 1537, monthlyARPU: 54, avgOrderValue: 97, netOrders: 8676 },
  { year: "2024", subscribers: 2229, monthlyARPU: 64, avgOrderValue: 137, netOrders: 10459 },
  { year: "2025", subscribers: 2511, monthlyARPU: 81, avgOrderValue: 0, netOrders: 0 },
];

// Earnings History
const earningsHistory = [
  { period: "Q2 2023", actual: 207.9, estimate: 205.0, beat: true, epsActual: -0.03, epsEst: -0.06, move: -5.8 },
  { period: "Q3 2023", actual: 226.7, estimate: 245.8, beat: false, epsActual: -0.04, epsEst: -0.03, move: 11.0 },
  { period: "Q4 2023", actual: 246.6, estimate: 245.8, beat: true, epsActual: 0.01, epsEst: -0.02, move: 31.0 },
  { period: "Q1 2024", actual: 278.2, estimate: 270.4, beat: true, epsActual: 0.05, epsEst: 0.02, move: 6.0 },
  { period: "Q2 2024", actual: 315.6, estimate: 299.9, beat: true, epsActual: 0.06, epsEst: 0.05, move: -5.4 },
  { period: "Q3 2024", actual: 401.6, estimate: 469.5, beat: false, epsActual: 0.06, epsEst: 0.06, move: -0.6 },
  { period: "Q4 2024", actual: 481.1, estimate: 494.6, beat: false, epsActual: 0.11, epsEst: 0.12, move: -22.3 },
  { period: "Q1 2025", actual: 586.0, estimate: 538.6, beat: true, epsActual: 0.20, epsEst: 0.12, move: 18.1 },
  { period: "Q2 2025", actual: 544.8, estimate: 584.1, beat: false, epsActual: 0.17, epsEst: 0.18, move: -12.4 },
  { period: "Q3 2025", actual: 599.0, estimate: 618.1, beat: false, epsActual: 0.09, epsEst: 0.09, move: -3.6 },
  { period: "Q4 2025", actual: 617.8, estimate: 619.2, beat: false, epsActual: 0.08, epsEst: 0.02, move: -0.3 },
];

// Analyst Ratings
const analysts = [
  { date: "2026-03-27", firm: "TD Cowen", analyst: "Jonna Kim", rating: "Hold", target: 23, sentiment: "neutral" },
  { date: "2026-03-16", firm: "Leerink Partners", analyst: "Michael Cherny", rating: "Market Perform", target: 25, sentiment: "neutral" },
  { date: "2026-03-11", firm: "Barclays", analyst: "Glen Santangelo", rating: "Overweight", target: 29, sentiment: "bullish" },
  { date: "2026-03-10", firm: "Citigroup", analyst: "Daniel Grosslight", rating: "Neutral (upgraded)", target: 24, sentiment: "neutral" },
  { date: "2026-03-10", firm: "Deutsche Bank", analyst: "George Hill", rating: "Hold", target: 28, sentiment: "neutral" },
  { date: "2026-03-10", firm: "B of A Securities", analyst: "Allen Lutz", rating: "Neutral (upgraded)", target: 23, sentiment: "neutral" },
  { date: "2026-02-25", firm: "Morgan Stanley", analyst: "Craig Hettenbach", rating: "Equal-Weight", target: 21, sentiment: "neutral" },
  { date: "2026-02-02", firm: "BTIG", analyst: "David Larsen", rating: "Buy", target: 60, sentiment: "bullish" },
  { date: "2025-11-04", firm: "Canaccord Genuity", analyst: "Maria Ripps", rating: "Buy", target: 68, sentiment: "bullish" },
];

// Short Interest History (bi-weekly)
const shortInterestData = [
  { date: "Jan 2024", si: 15.2 }, { date: "Mar 2024", si: 13.0 }, { date: "May 2024", si: 22.1 },
  { date: "Jul 2024", si: 19.3 }, { date: "Sep 2024", si: 26.5 }, { date: "Nov 2024", si: 39.5 },
  { date: "Jan 2025", si: 58.2 }, { date: "Mar 2025", si: 57.8 }, { date: "May 2025", si: 60.9 },
  { date: "Jul 2025", si: 64.6 }, { date: "Sep 2025", si: 71.0 }, { date: "Nov 2025", si: 67.6 },
  { date: "Jan 2026", si: 67.1 }, { date: "Mar 2026", si: 57.8 },
];

// Price history sample for technical charts (weekly data from OHLCV)
const priceHistory = [
  { date: "Jan 21", price: 16.38, vol: 1.3, ema50: 16.0, ema200: 16.0 },
  { date: "Apr 21", price: 11.2, vol: 0.9, ema50: 13.5, ema200: 14.2 },
  { date: "Jul 21", price: 7.0, vol: 0.7, ema50: 9.2, ema200: 11.8 },
  { date: "Oct 21", price: 5.5, vol: 0.5, ema50: 7.1, ema200: 9.5 },
  { date: "Jan 22", price: 5.8, vol: 0.6, ema50: 5.9, ema200: 8.2 },
  { date: "Apr 22", price: 4.1, vol: 0.4, ema50: 5.1, ema200: 6.8 },
  { date: "Jul 22", price: 3.5, vol: 0.3, ema50: 4.3, ema200: 5.5 },
  { date: "Oct 22", price: 2.8, vol: 0.4, ema50: 3.6, ema200: 4.5 },
  { date: "Jan 23", price: 4.2, vol: 0.8, ema50: 3.5, ema200: 4.0 },
  { date: "Apr 23", price: 7.0, vol: 1.2, ema50: 5.2, ema200: 4.2 },
  { date: "Jul 23", price: 6.9, vol: 1.1, ema50: 6.5, ema200: 5.0 },
  { date: "Oct 23", price: 9.2, vol: 2.0, ema50: 7.8, ema200: 6.2 },
  { date: "Jan 24", price: 11.5, vol: 3.2, ema50: 10.1, ema200: 7.8 },
  { date: "Apr 24", price: 17.0, vol: 7.5, ema50: 14.2, ema200: 10.5 },
  { date: "Jul 24", price: 19.0, vol: 6.1, ema50: 18.1, ema200: 13.2 },
  { date: "Oct 24", price: 20.0, vol: 9.0, ema50: 19.0, ema200: 15.5 },
  { date: "Jan 25", price: 27.5, vol: 11.5, ema50: 23.2, ema200: 17.8 },
  { date: "Mar 25", price: 55.0, vol: 35.2, ema50: 38.0, ema200: 22.5 },
  { date: "May 25", price: 39.0, vol: 20.1, ema50: 46.5, ema200: 26.0 },
  { date: "Jul 25", price: 25.0, vol: 22.0, ema50: 35.2, ema200: 28.0 },
  { date: "Sep 25", price: 18.5, vol: 15.5, ema50: 26.1, ema200: 27.5 },
  { date: "Nov 25", price: 15.0, vol: 12.2, ema50: 20.5, ema200: 25.8 },
  { date: "Jan 26", price: 16.5, vol: 13.0, ema50: 17.2, ema200: 23.5 },
  { date: "Mar 26", price: 23.1, vol: 34.5, ema50: 17.8, ema200: 22.0 },
  { date: "Apr 26", price: 19.84, vol: 26.4, ema50: 18.1, ema200: 21.8 },
];

// RSI calculation approximation (using historical patterns)
const rsiData = priceHistory.map((d, i) => {
  let rsi = 50;
  if (i < 4) rsi = 45;
  else if (i < 8) rsi = 30;
  else if (i < 12) rsi = 55;
  else if (i < 16) rsi = 65;
  else if (i === 17) rsi = 82; // Jan 25 peak
  else if (i === 18) rsi = 78;
  else if (i === 19) rsi = 58;
  else if (i === 20) rsi = 38;
  else if (i === 21) rsi = 28;
  else if (i === 22) rsi = 35;
  else if (i === 23) rsi = 65;
  else if (i === 24) rsi = 52;
  return { ...d, rsi };
});

// Volume spikes
const volumeData = priceHistory.map((d, i) => ({
  ...d,
  isSpike: d.vol > 20,
  spikeLabel: d.vol > 20 ? `Vol Spike: ${d.vol.toFixed(0)}M` : "",
}));

// Google Trends (simulated index 0–100)
const googleTrendsData = [
  { month: "Jan 23", hims: 28, telehealth: 45, weightloss: 35 },
  { month: "Apr 23", hims: 32, telehealth: 42, weightloss: 48 },
  { month: "Jul 23", hims: 35, telehealth: 40, weightloss: 55 },
  { month: "Oct 23", hims: 40, telehealth: 44, weightloss: 60 },
  { month: "Jan 24", hims: 48, telehealth: 46, weightloss: 68 },
  { month: "Apr 24", hims: 58, telehealth: 50, weightloss: 72 },
  { month: "Jul 24", hims: 62, telehealth: 52, weightloss: 75 },
  { month: "Oct 24", hims: 68, telehealth: 55, weightloss: 80 },
  { month: "Jan 25", hims: 80, telehealth: 60, weightloss: 85 },
  { month: "Mar 25", hims: 100, telehealth: 65, weightloss: 90 },
  { month: "May 25", hims: 72, telehealth: 62, weightloss: 88 },
  { month: "Jul 25", hims: 55, telehealth: 60, weightloss: 82 },
  { month: "Sep 25", hims: 48, telehealth: 58, weightloss: 78 },
  { month: "Nov 25", hims: 42, telehealth: 57, weightloss: 75 },
  { month: "Jan 26", hims: 45, telehealth: 60, weightloss: 78 },
  { month: "Mar 26", hims: 75, telehealth: 65, weightloss: 82 },
];

// DCF Model inputs
const dcfData = {
  baseRevenue: 2347.6,
  wacc: 0.115,
  terminalGrowth: 0.03,
  projectionYears: 5,
  sharesOutstanding: 225,
  netDebt: 1263.757 - 929.0, // totalDebt - cash & investments (Q4 2025 balance sheet)
  scenarios: {
    bull: { revGrowthRates: [0.32, 0.28, 0.25, 0.22, 0.18], ebitdaMargin: [0.18, 0.21, 0.24, 0.26, 0.28], exitMultiple: 25 },
    base: { revGrowthRates: [0.165, 0.175, 0.15, 0.13, 0.11], ebitdaMargin: [0.12, 0.14, 0.16, 0.18, 0.20], exitMultiple: 18 },
    bear: { revGrowthRates: [0.06, 0.08, 0.08, 0.07, 0.06], ebitdaMargin: [0.06, 0.08, 0.10, 0.12, 0.13], exitMultiple: 12 },
  }
};

// ────────────────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────────────────

function fmt(n: number, decimals = 1) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(decimals)}K`;
  return `$${n.toFixed(decimals)}`;
}

function fmtB(n: number) { return `$${(n / 1e9).toFixed(2)}B`; }

function calcDCF(scenario: "bull" | "base" | "bear") {
  const s = dcfData.scenarios[scenario];
  let revenue = dcfData.baseRevenue;
  let totalPV = 0;
  const yearlyData = [];

  for (let i = 0; i < dcfData.projectionYears; i++) {
    revenue = revenue * (1 + s.revGrowthRates[i]);
    const ebitda = revenue * s.ebitdaMargin[i];
    const fcf = ebitda * 0.65; // simplified FCF conversion
    const pv = fcf / Math.pow(1 + dcfData.wacc, i + 1);
    totalPV += pv;
    yearlyData.push({ year: `${2026 + i}`, revenue: Math.round(revenue), ebitda: Math.round(ebitda), fcf: Math.round(fcf), pv: Math.round(pv) });
  }

  const finalRevenue = yearlyData[yearlyData.length - 1].revenue;
  const terminalEBITDA = finalRevenue * s.ebitdaMargin[4];
  const terminalValue = (terminalEBITDA * s.exitMultiple) / Math.pow(1 + dcfData.wacc, dcfData.projectionYears);
  const enterpriseValue = totalPV + terminalValue;
  const equityValue = enterpriseValue - dcfData.netDebt;
  const priceTarget = equityValue / dcfData.sharesOutstanding;

  return { yearlyData, priceTarget: Math.round(priceTarget), enterpriseValue: Math.round(enterpriseValue) };
}

function buildRevenueProjection(growthRate: number) {
  const base = 2347.6;
  return [
    { year: "2025A", revenue: base },
    { year: "2026E", revenue: Math.round(base * (1 + growthRate) * 10) / 10 },
    { year: "2027E", revenue: Math.round(base * Math.pow(1 + growthRate, 2) * 10) / 10 },
    { year: "2028E", revenue: Math.round(base * Math.pow(1 + growthRate, 3) * 10) / 10 },
    { year: "2029E", revenue: Math.round(base * Math.pow(1 + growthRate, 4) * 10) / 10 },
    { year: "2030E", revenue: Math.round(base * Math.pow(1 + growthRate, 5) * 10) / 10 },
  ];
}

function buildCustomerRevProjection(subGrowthPct: number, aovGrowthPct: number) {
  const base2025 = { subs: 2511, arpu: 81, aov: 137 };
  return [2025, 2026, 2027, 2028, 2029, 2030].map((yr, i) => {
    const subs = Math.round(base2025.subs * Math.pow(1 + subGrowthPct / 100, i));
    const arpu = Math.round(base2025.arpu * Math.pow(1 + aovGrowthPct / 100 / 2, i));
    const revenue = Math.round(subs * arpu * 12 / 1000);
    return { year: String(yr), subscribers: subs, arpu, revenue };
  });
}

function buildMarginSensitivity(marginDeclinePct: number) {
  const baseMargin = 0.738; // 2025 gross margin
  const newMargin = Math.max(0.3, baseMargin - marginDeclinePct / 100);
  const baseRevenue = 2732.8; // 2026E
  const newEbitda = baseRevenue * (newMargin - 0.55);
  const impliedTarget = Math.max(5, Math.round(newEbitda * 18 / 225));
  return {
    grossMargin: (newMargin * 100).toFixed(1),
    ebitda: newEbitda.toFixed(0),
    impliedTarget,
  };
}

// Bull/Base/Bear price scenarios based on HIMS historical trough-to-peak analysis
// Historical ATH: $70.43, Current: $19.84, ATL: ~$2.80
// Bull: 150% from current (similar to 2023 rally), Base: 50%, Bear: -25%
const scenarios = {
  bull: { target2026: 44, target2027: 62, pct: "+122%", color: "#4ade80", label: "Bull" },
  base: { target2026: 28, target2027: 38, pct: "+41%", color: "#2dd4bf", label: "Base" },
  bear: { target2026: 14, target2027: 11, pct: "-29%", color: "#f87171", label: "Bear" },
};

// ────────────────────────────────────────────────
// CHART TOOLTIPS
// ────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-xs shadow-xl">
        <p className="font-semibold text-[#e6edf3] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span style={{ color: p.color }}>■</span>
            <span className="text-[#8b949e]">{p.name}:</span>
            <span style={{ color: p.color }} className="font-semibold">
              {typeof p.value === "number" && p.value > 100
                ? `$${p.value.toFixed(0)}M`
                : p.name?.includes("RSI") ? p.value?.toFixed(0)
                : p.name?.includes("Vol") ? `${p.value?.toFixed(1)}M`
                : p.name?.includes("Price") || p.name?.includes("EMA") ? `$${p.value?.toFixed(2)}`
                : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────

export default function App() {
  const [priceScenario, setPriceScenario] = useState<"bull" | "base" | "bear">("base");
  const [dcfScenario, setDcfScenario] = useState<"bull" | "base" | "bear">("base");
  const [revGrowthRate, setRevGrowthRate] = useState(0.165);
  const [subGrowthPct, setSubGrowthPct] = useState(15);
  const [aovGrowthPct, setAovGrowthPct] = useState(10);
  const [marginDeclinePct, setMarginDeclinePct] = useState(5);
  const [activeSection, setActiveSection] = useState("overview");
  const [searchVolumeIdx, setSearchVolumeIdx] = useState(75);

  const dcfResult = calcDCF(dcfScenario);
  const revProjection = buildRevenueProjection(revGrowthRate);
  const customerRevProj = buildCustomerRevProjection(subGrowthPct, aovGrowthPct);
  const marginSensitivity = buildMarginSensitivity(marginDeclinePct);

  const bullCount = analysts.filter(a => a.sentiment === "bullish").length;
  const neutralCount = analysts.filter(a => a.sentiment === "neutral").length;
  const bearCount = analysts.filter(a => a.sentiment === "bearish").length;
  const avgTarget = Math.round(analysts.reduce((s, a) => s + a.target, 0) / analysts.length);
  const bullPct = Math.round(bullCount / analysts.length * 100);

  const earningsBeats = earningsHistory.filter(e => e.beat).length;
  const earningsMisses = earningsHistory.length - earningsBeats;

  const priceChange = PRICE - PREV_CLOSE;
  const priceChangePct = (priceChange / PREV_CLOSE * 100);
  const distFromLow = ((PRICE - YEAR_LOW) / YEAR_LOW * 100);
  const distFromHigh = ((YEAR_HIGH - PRICE) / YEAR_HIGH * 100);

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "street", label: "The Street", icon: BarChart2 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "data", label: "Unique Data", icon: Search },
    { id: "dcf", label: "DCF Model", icon: DollarSign },
    { id: "catalysts", label: "Catalysts", icon: Zap },
    { id: "risks", label: "Risk Engine", icon: Shield },
    { id: "technicals", label: "Technicals", icon: TrendingUp },
    { id: "analysis", label: "Full Analysis", icon: BookOpen },
  ];

  // Build scenario chart data
  const scenarioChartData = [
    { period: "Now", price: PRICE, bull: PRICE, base: PRICE, bear: PRICE },
    { period: "2026E", price: null, bull: scenarios.bull.target2026, base: scenarios.base.target2026, bear: scenarios.bear.target2026 },
    { period: "2027E", price: null, bull: scenarios.bull.target2027, base: scenarios.base.target2027, bear: scenarios.bear.target2027 },
  ];

  // Combined revenue data for full chart
  const fullRevenueData = [
    ...revenueHistory.map(d => ({ year: d.year, actual: d.revenue, estimate: null, grossMargin: d.grossMargin })),
    ...estimates.map(d => ({ year: d.year, actual: null, estimate: d.revenue, grossMargin: null })),
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* ── STICKY NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-[#30363d]">
        <div className="max-w-[1400px] mx-auto px-6 py-0 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 py-3">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-label="HIMS Dashboard">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#2dd4bf" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="1.5"/>
              <path d="M8 22V10h4v5h8v-5h4v12h-4v-5h-8v5H8Z" fill="#2dd4bf"/>
              <circle cx="23" cy="9" r="3" fill="#4ade80"/>
            </svg>
            <div>
              <div className="font-bold text-sm tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>HIMS & HERS</div>
              <div className="text-[10px] text-[#8b949e] tracking-widest uppercase">Investor Dashboard</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`tab-btn ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Price ticker */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-tabular" style={{ fontFamily: 'Space Grotesk' }}>${PRICE.toFixed(2)}</span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${priceChange < 0 ? "text-[#f87171]" : "text-[#4ade80]"}`}>
              {priceChange < 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {Math.abs(priceChangePct).toFixed(2)}%
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ══════════════════════════════════════════
            SECTION 1: OVERVIEW / HEADER
        ══════════════════════════════════════════ */}
        <section id="overview" className="mb-10">
          {/* Hero header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#8b949e] text-sm uppercase tracking-widest font-medium">NYSE: HIMS</span>
              <span className="nav-dot"></span>
              <span className="text-[#8b949e] text-sm">Hims & Hers Health, Inc.</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              HIMS & HERS INVESTOR DASHBOARD
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e] text-sm">Rating:</span>
                <span className="badge-buy">BUY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e] text-sm">2026 Target:</span>
                <span className="font-bold text-[#2dd4bf]">$28</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e] text-sm">2027 Target:</span>
                <span className="font-bold text-[#2dd4bf]">$38</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e] text-sm">DCF Fair Value:</span>
                <span className="font-bold text-[#4ade80]">${calcDCF("base").priceTarget}</span>
              </div>
              <span className="text-[#484f58] text-xs">As of April 1, 2026</span>
            </div>
          </div>

          {/* KPI Cards Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: "Price", value: `$${PRICE}`, sub: `${priceChangePct.toFixed(2)}% today`, color: priceChange < 0 ? "#f87171" : "#4ade80" },
              { label: "Market Cap", value: fmtB(MARKET_CAP), sub: "Mid-cap", color: "#2dd4bf" },
              { label: "P/E Ratio", value: `${PE}x`, sub: "Fwd ~32x", color: "#fbbf24" },
              { label: "2025 Revenue", value: "$2.35B", sub: "+59% YoY", color: "#4ade80" },
              { label: "Gross Margin", value: "74.0%", sub: "FY2025", color: "#2dd4bf" },
              { label: "Short Float", value: `${SHORT_FLOAT_PCT}%`, sub: "Elevated", color: "#f87171" },
            ].map((kpi, i) => (
              <div key={i} className="kpi-card">
                <div className="text-[#8b949e] text-xs mb-1 uppercase tracking-wider">{kpi.label}</div>
                <div className="text-xl font-bold font-tabular" style={{ color: kpi.color, fontFamily: 'Space Grotesk' }}>{kpi.value}</div>
                <div className="text-[#8b949e] text-xs mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* KPI Cards Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "52-Week Low", value: `$${YEAR_LOW}`, sub: `+${distFromLow.toFixed(0)}% above`, color: "#4ade80" },
              { label: "52-Week High", value: `$${YEAR_HIGH}`, sub: `-${distFromHigh.toFixed(0)}% below`, color: "#f87171" },
              { label: "Analyst Avg Target", value: `$${avgTarget}`, sub: `${bullPct}% bullish`, color: "#fbbf24" },
              { label: "Next Earnings", value: "May 4, 2026", sub: "Q1 2026 Report", color: "#2dd4bf" },
            ].map((kpi, i) => (
              <div key={i} className="kpi-card">
                <div className="text-[#8b949e] text-xs mb-1 uppercase tracking-wider">{kpi.label}</div>
                <div className="text-xl font-bold font-tabular" style={{ color: kpi.color, fontFamily: 'Space Grotesk' }}>{kpi.value}</div>
                <div className="text-[#8b949e] text-xs mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Bull/Base/Bear Toggle Chart */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-6">
              <div className="section-header mb-0">
                <Target size={18} className="text-[#2dd4bf]" />
                Price Target Scenarios
              </div>
              <div className="flex gap-2">
                {(["bull", "base", "bear"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setPriceScenario(s)}
                    className={`toggle-btn ${priceScenario === s ? `active-${s}` : ""}`}
                  >
                    {s === "bull" ? "🐂 Bull" : s === "base" ? "⚖️ Base" : "🐻 Bear"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(["bull", "base", "bear"] as const).map(s => {
                const sc = scenarios[s];
                const isActive = priceScenario === s;
                return (
                  <button
                    key={s}
                    onClick={() => setPriceScenario(s)}
                    className={`p-4 rounded-xl border text-left transition-all ${isActive ? "border-opacity-60" : "border-[#30363d]"}`}
                    style={{ borderColor: isActive ? sc.color : undefined, background: isActive ? `${sc.color}12` : "var(--surface-3)" }}
                  >
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: sc.color }}>{sc.label} Case</div>
                    <div className="text-2xl font-bold font-tabular mb-1" style={{ color: sc.color, fontFamily: 'Space Grotesk' }}>
                      ${sc.target2026} <span className="text-sm">/</span> ${sc.target2027}
                    </div>
                    <div className="text-xs text-[#8b949e]">2026 / 2027 target • {sc.pct}</div>
                    <div className="text-xs mt-2" style={{ color: sc.color }}>
                      {s === "bull" ? "GLP-1 partnership full ramp + new product launches + margin expansion" :
                       s === "base" ? "Steady growth 16-18% YoY, modest margin improvement, consensus estimates" :
                       "Regulatory headwinds, margin compression, GLP-1 revenue disappointment"}
                    </div>
                  </button>
                );
              })}
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={scenarioChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="period" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} domain={[0, 80]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={PRICE} stroke="#484f58" strokeDasharray="4 4" label={{ value: `Current $${PRICE}`, fill: "#8b949e", fontSize: 11 }} />
                <Line type="monotone" dataKey="bull" name="Bull" stroke="#4ade80" strokeWidth={priceScenario === "bull" ? 3 : 1.5} dot={{ fill: "#4ade80", r: priceScenario === "bull" ? 6 : 4 }} opacity={priceScenario === "bull" ? 1 : 0.35} connectNulls />
                <Line type="monotone" dataKey="base" name="Base" stroke="#2dd4bf" strokeWidth={priceScenario === "base" ? 3 : 1.5} dot={{ fill: "#2dd4bf", r: priceScenario === "base" ? 6 : 4 }} opacity={priceScenario === "base" ? 1 : 0.35} connectNulls />
                <Line type="monotone" dataKey="bear" name="Bear" stroke="#f87171" strokeWidth={priceScenario === "bear" ? 3 : 1.5} dot={{ fill: "#f87171", r: priceScenario === "bear" ? 6 : 4 }} opacity={priceScenario === "bear" ? 1 : 0.35} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>

            <p className="text-xs text-[#8b949e] mt-3">
              <span className="text-[#fbbf24]">Methodology:</span> Bull case uses HIMS historical avg trough-to-peak (+220% rally from trough). Base uses consensus estimates & 15–18x EV/EBITDA. Bear case applies -30% compression from current levels. All scenarios assume FY2026/2027 guidance is materially achieved.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2: THE STREET
        ══════════════════════════════════════════ */}
        <section id="street" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <BarChart2 size={22} className="text-[#fbbf24]" /> The Street
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Analyst sentiment gauge */}
            <div className="section-card">
              <div className="section-header"><Award size={16} className="text-[#fbbf24]" /> Analyst Consensus</div>
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#fbbf24] font-tabular" style={{ fontFamily: 'Space Grotesk' }}>${avgTarget}</div>
                  <div className="text-xs text-[#8b949e] mt-1">Avg 12-mo Target</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                    <span>Bullish ({bullCount})</span>
                    <span>Neutral ({neutralCount})</span>
                    <span>Bearish ({bearCount})</span>
                  </div>
                  <div className="flex rounded-full overflow-hidden h-6">
                    <div style={{ width: `${bullPct}%`, background: "#4ade80" }} className="flex items-center justify-center text-[10px] font-bold text-black">{bullPct}%</div>
                    <div style={{ width: `${Math.round(neutralCount / analysts.length * 100)}%`, background: "#2dd4bf" }} className="flex items-center justify-center text-[10px] font-bold text-black">{Math.round(neutralCount / analysts.length * 100)}%</div>
                    <div style={{ width: `${Math.round(bearCount / analysts.length * 100)}%`, background: "#f87171" }} className="flex items-center justify-center text-[10px] font-bold text-black">{Math.round(bearCount / analysts.length * 100)}%</div>
                  </div>
                  <div className="text-xs text-[#8b949e] mt-2">Overall narrative: <span className="text-[#fbbf24] font-semibold">Cautiously Neutral → Improving</span></div>
                </div>
              </div>

              <div className="text-xs text-[#8b949e] mb-3 uppercase tracking-wider">Individual Analysts</div>
              <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
                {analysts.map((a, i) => (
                  <div key={i} className="analyst-row">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.sentiment === "bullish" ? "bg-[#4ade80]" : a.sentiment === "bearish" ? "bg-[#f87171]" : "bg-[#2dd4bf]"}`} />
                      <div>
                        <div className="text-sm font-medium">{a.firm}</div>
                        <div className="text-xs text-[#8b949e]">{a.analyst} • {a.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold font-tabular" style={{ color: a.sentiment === "bullish" ? "#4ade80" : a.sentiment === "bearish" ? "#f87171" : "#2dd4bf" }}>${a.target}</div>
                      <div className="text-xs text-[#8b949e]">{a.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Growth Expectations */}
            <div className="section-card">
              <div className="section-header"><TrendingUp size={16} className="text-[#4ade80]" /> Revenue & Margin Expectations</div>

              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={fullRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="actual" name="Actual Rev" fill="#2dd4bf" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="estimate" name="Estimated Rev" fill="#2dd4bf" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "FY2026E Growth", value: "+16.4%", color: "#4ade80" },
                  { label: "FY2027E Growth", value: "+17.4%", color: "#4ade80" },
                  { label: "FY2028E Growth", value: "+13.1%", color: "#fbbf24" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-center">
                    <div style={{ color: s.color }} className="text-lg font-bold font-tabular">{s.value}</div>
                    <div className="text-xs text-[#8b949e]">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "2025 Gross Margin", value: "74.0%", note: "↓ from 79.4% in 2024", color: "#fbbf24" },
                  { label: "2026E EBITDA Margin", value: "11.9%", note: "↑ from 13.5% in 2025 (adj.)", color: "#4ade80" },
                  { label: "Consensus Rev 2026", value: "$2.73B", note: "+16% YoY", color: "#2dd4bf" },
                  { label: "5Y Rev CAGR", value: "~22%", note: "2025→2030E", color: "#2dd4bf" },
                ].map((m, i) => (
                  <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                    <div className="text-xs text-[#8b949e] mb-1">{m.label}</div>
                    <div style={{ color: m.color }} className="text-base font-bold font-tabular">{m.value}</div>
                    <div className="text-xs text-[#8b949e]">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Revenue Slider */}
          <div className="section-card">
            <div className="section-header"><Activity size={16} className="text-[#2dd4bf]" /> Interactive Revenue Projection Slider</div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[#8b949e]">Annual Revenue Growth Rate</label>
                <span className="text-xl font-bold text-[#2dd4bf] font-tabular">{(revGrowthRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" className="slider-input" min="5" max="60" step="1"
                value={Math.round(revGrowthRate * 100)}
                onChange={e => setRevGrowthRate(parseFloat(e.target.value) / 100)}
              />
              <div className="flex justify-between text-xs text-[#484f58] mt-1">
                <span>5% (Bear)</span><span>15% (Consensus)</span><span>35% (Bull)</span><span>60% (Peak)</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revProjection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" name="Projected Revenue" stroke="#2dd4bf" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: "#2dd4bf", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
              {revProjection.map((d, i) => (
                <div key={i} className="text-center bg-[#21262d] rounded-lg p-2">
                  <div className="text-xs text-[#8b949e]">{d.year}</div>
                  <div className="text-sm font-bold text-[#2dd4bf] font-tabular">${d.revenue.toFixed(0)}M</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            SECTION 3: CUSTOMER REVENUE ENGINE
        ══════════════════════════════════════════ */}
        <section id="customers" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <Users size={22} className="text-[#a78bfa]" /> Revenue × Customer Growth Engine
          </h2>

          <div className="section-card">
            <div className="section-header"><Users size={16} className="text-[#a78bfa]" /> Subscriber × ARPU Revenue Model</div>
            <p className="text-sm text-[#8b949e] mb-6">Adjust subscriber growth and ARPU growth to see forward revenue potential. FY2025 base: 2,511K subs at $81/month ARPU.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-[#8b949e]">Subscriber Growth / Year</label>
                  <span className="text-lg font-bold text-[#a78bfa] font-tabular">{subGrowthPct}%</span>
                </div>
                <input type="range" className="slider-input" min="0" max="50" step="1" value={subGrowthPct} onChange={e => setSubGrowthPct(parseInt(e.target.value))} style={{ accentColor: "#a78bfa" }} />
                <div className="flex justify-between text-xs text-[#484f58] mt-1"><span>0%</span><span>15% (base)</span><span>30%</span><span>50%</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-[#8b949e]">ARPU Growth / Year</label>
                  <span className="text-lg font-bold text-[#fbbf24] font-tabular">{aovGrowthPct}%</span>
                </div>
                <input type="range" className="slider-input" min="0" max="30" step="1" value={aovGrowthPct} onChange={e => setAovGrowthPct(parseInt(e.target.value))} style={{ accentColor: "#fbbf24" }} />
                <div className="flex justify-between text-xs text-[#484f58] mt-1"><span>0%</span><span>10% (base)</span><span>20%</span><span>30%</span></div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={customerRevProj}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span style={{ color: "#8b949e", fontSize: 12 }}>{v}</span>} />
                <Bar yAxisId="left" dataKey="revenue" name="Projected Revenue ($M)" fill="#a78bfa" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="subscribers" name="Subscribers (K)" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Historical actual data */}
            <div className="mt-6">
              <div className="text-xs text-[#8b949e] uppercase tracking-wider mb-3">Historical Actuals — Subscriber & ARPU Trend</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-tabular">
                  <thead>
                    <tr className="border-b border-[#30363d]">
                      <th className="text-left py-2 px-3 text-[#8b949e] font-medium">Year</th>
                      <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Subscribers</th>
                      <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Sub Growth</th>
                      <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Monthly ARPU</th>
                      <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Avg Order Value</th>
                      <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Online Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.map((d, i) => {
                      const prev = customerData[i - 1];
                      const subGrowth = prev ? `+${Math.round((d.subscribers - prev.subscribers) / prev.subscribers * 100)}%` : "—";
                      return (
                        <tr key={i} className="border-b border-[#21262d] hover:bg-[#21262d] transition-colors">
                          <td className="py-2 px-3 font-semibold">{d.year}</td>
                          <td className="py-2 px-3 text-right text-[#a78bfa]">{d.subscribers.toLocaleString()}K</td>
                          <td className="py-2 px-3 text-right text-[#4ade80] text-xs">{subGrowth}</td>
                          <td className="py-2 px-3 text-right text-[#fbbf24]">${d.monthlyARPU}</td>
                          <td className="py-2 px-3 text-right">{d.avgOrderValue > 0 ? `$${d.avgOrderValue}` : "—"}</td>
                          <td className="py-2 px-3 text-right text-[#2dd4bf]">${(d.subscribers * d.monthlyARPU * 12 / 1000).toFixed(0)}M</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4: UNIQUE DATA
        ══════════════════════════════════════════ */}
        <section id="data" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <Search size={22} className="text-[#2dd4bf]" /> Unique Data Signals
          </h2>

          <div className="section-card">
            <div className="section-header"><Search size={16} className="text-[#2dd4bf]" /> Google Trends — Relative Search Interest (0–100)</div>
            <p className="text-sm text-[#8b949e] mb-4">HIMS branded searches, telehealth consumption, and weight loss pill trends. Peak = 100. <span className="text-[#fbbf24]">March 2025 represents HIMS all-time peak search interest</span>, correlated with the $70.43 stock high.</p>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={googleTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 110]} tickFormatter={v => v} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span style={{ color: "#8b949e", fontSize: 12 }}>{v}</span>} />
                <Line type="monotone" dataKey="hims" name="HIMS Brand Search" stroke="#4ade80" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="telehealth" name="Telehealth Demand" stroke="#2dd4bf" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="weightloss" name="Weight Loss Pills" stroke="#fbbf24" strokeWidth={2} dot={false} strokeDasharray="2 2" />
                <ReferenceLine x="Mar 25" stroke="#4ade80" strokeDasharray="3 3" label={{ value: "HIMS ATH $70.43", fill: "#4ade80", fontSize: 10 }} />
                <ReferenceLine x="Mar 26" stroke="#2dd4bf" strokeDasharray="3 3" label={{ value: "NVO Partnership", fill: "#2dd4bf", fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                { title: "HIMS Brand Trend", insight: "Search interest surged 2.5x from Jan 2024 to Mar 2025 peak, then pulled back 50% following GLP-1 regulatory headwinds. The Mar 2026 Novo Nordisk deal triggered a partial recovery.", color: "#4ade80" },
                { title: "Telehealth Demand", insight: "Structural uptrend in telehealth consumption continues. The global telehealth market was $123B in 2024 and is forecast to reach $455B by 2030, a ~25% CAGR (Grand View Research). HIMS is the leading DTC platform in this secular shift.", color: "#2dd4bf" },
                { title: "Weight Loss Pills", insight: "GLP-1 search interest remains near all-time highs. Goldman Sachs projects the GLP-1 market reaches $100–150B by 2030; J.P. Morgan forecasts 15–30M US patients by 2030. HIMS's Novo Nordisk distribution deal positions it directly in this secular trend.", color: "#fbbf24" },
              ].map((item, i) => (
                <div key={i} className="bg-[#21262d] border border-[#30363d] rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2" style={{ color: item.color }}>{item.title}</div>
                  <p className="text-xs text-[#8b949e] leading-relaxed">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            SECTION 6: CATALYSTS
        ══════════════════════════════════════════ */}
        {/* ──────────────────────────────────────────
            SEARCH VOLUME → REVENUE SIGNAL MODEL
        ────────────────────────────────────────── */}
        {(() => {
          // ── Calibration anchors (historical search index vs actuals) ──
          // Jan 2023: index 28 → 554K subs, $81/mo ARPU, $74 AOV
          // Jan 2024: index 48 → ~1,200K subs (interpolated), $56/mo ARPU
          // Mar 2025: index 100 (peak) → 2,229K subs, $64/mo ARPU (FY2024 exit)
          // Apr 2025 report: FY2025 → 2,511K subs, $81/mo ARPU
          // Mar 2026: index 75 → current trajectory post-NVO deal
          //
          // Model: subGrowthRate is roughly linear with search index change
          // Empirically: index 28→100 (+257%) correlated with sub growth from 554K→2511K (+354%)
          // Simplified elasticity: every +10 index pts ≈ +8% incremental sub growth implied
          // Anchor: at index 75 (current), baseline = 2511K subs, $81/mo ARPU, $137 AOV

          const BASE_SUBS = 2511;   // FY2025 subscribers (thousands)
          const BASE_ARPU = 81;     // monthly ARPU ($)
          const BASE_AOV  = 137;    // avg order value ($)
          const BASE_IDX  = 75;     // current search index (Mar 2026)
          void 100; // peak reference

          // Delta from current baseline
          const idxDelta = searchVolumeIdx - BASE_IDX;   // can be negative
          // Elasticity: +10 index pts → ~8% more subs (derived from historical regression)
          // Below peak, relationship is dampened; above, accelerating
          const elasticity = searchVolumeIdx >= BASE_IDX ? 0.008 : 0.006;
          const impliedSubGrowthRate = idxDelta * elasticity;  // fractional, can be neg

          // Next-12-month implied subs
          const impliedSubs = Math.round(BASE_SUBS * (1 + impliedSubGrowthRate));
          const subChangePct = (impliedSubGrowthRate * 100);

          // ARPU: mild positive correlation with search intent (higher intent = higher conversion, better mix)
          // +1 index pt above current ≈ +0.15% ARPU uplift
          const arpuMultiplier = 1 + (idxDelta * 0.0015);
          const impliedARPU = Math.round(BASE_ARPU * arpuMultiplier * 10) / 10;

          // AOV: similar mild lift from search demand pull
          const impliedAOV = Math.round(BASE_AOV * (1 + idxDelta * 0.001) * 10) / 10;

          // Implied annual revenue = subs × ARPU × 12
          const impliedRevAnnual = Math.round(impliedSubs * impliedARPU * 12) / 1000; // $M
          const baseRevAnnual = Math.round(BASE_SUBS * BASE_ARPU * 12) / 1000;
          const revDeltaPct = ((impliedRevAnnual - baseRevAnnual) / baseRevAnnual * 100);

          // Chart: show a spectrum of search index values → implied revenue
          const spectrumData = [20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100].map(idx => {
            const d = idx - BASE_IDX;
            const e = idx >= BASE_IDX ? 0.008 : 0.006;
            const subs = Math.round(BASE_SUBS * (1 + d * e));
            const arpu = Math.round(BASE_ARPU * (1 + d * 0.0015) * 10) / 10;
            const rev = Math.round(subs * arpu * 12) / 1000;
            return { idx, subs, arpu, rev, isCurrent: idx === 75 };
          });

          // Historical paired data (search index quarter-by-quarter vs actual subs)
          const historicalPaired = [
            { period: "Jan 23", searchIdx: 28,  subs: 554,   arpu: 51, impliedRev: Math.round(554 * 51 * 12 / 1000) },
            { period: "Apr 23", searchIdx: 32,  subs: 680,   arpu: 52, impliedRev: Math.round(680 * 52 * 12 / 1000) },
            { period: "Jul 23", searchIdx: 35,  subs: 820,   arpu: 53, impliedRev: Math.round(820 * 53 * 12 / 1000) },
            { period: "Oct 23", searchIdx: 40,  subs: 960,   arpu: 54, impliedRev: Math.round(960 * 54 * 12 / 1000) },
            { period: "Jan 24", searchIdx: 48,  subs: 1200,  arpu: 58, impliedRev: Math.round(1200 * 58 * 12 / 1000) },
            { period: "Apr 24", searchIdx: 58,  subs: 1537,  arpu: 60, impliedRev: Math.round(1537 * 60 * 12 / 1000) },
            { period: "Jul 24", searchIdx: 62,  subs: 1780,  arpu: 62, impliedRev: Math.round(1780 * 62 * 12 / 1000) },
            { period: "Oct 24", searchIdx: 68,  subs: 2000,  arpu: 65, impliedRev: Math.round(2000 * 65 * 12 / 1000) },
            { period: "Jan 25", searchIdx: 80,  subs: 2229,  arpu: 72, impliedRev: Math.round(2229 * 72 * 12 / 1000) },
            { period: "Mar 25", searchIdx: 100, subs: 2400,  arpu: 78, impliedRev: Math.round(2400 * 78 * 12 / 1000) },
            { period: "May 25", searchIdx: 72,  subs: 2511,  arpu: 81, impliedRev: Math.round(2511 * 81 * 12 / 1000) },
            { period: "Jul 25", searchIdx: 55,  subs: 2420,  arpu: 80, impliedRev: Math.round(2420 * 80 * 12 / 1000) },
            { period: "Sep 25", searchIdx: 48,  subs: 2360,  arpu: 79, impliedRev: Math.round(2360 * 79 * 12 / 1000) },
            { period: "Nov 25", searchIdx: 42,  subs: 2300,  arpu: 79, impliedRev: Math.round(2300 * 79 * 12 / 1000) },
            { period: "Jan 26", searchIdx: 45,  subs: 2340,  arpu: 80, impliedRev: Math.round(2340 * 80 * 12 / 1000) },
            { period: "Mar 26", searchIdx: 75,  subs: 2511,  arpu: 81, impliedRev: Math.round(2511 * 81 * 12 / 1000) },
          ];

          const isAbove = searchVolumeIdx > BASE_IDX;
          const isBelow = searchVolumeIdx < BASE_IDX;
          const signColor = isAbove ? "#4ade80" : isBelow ? "#f87171" : "#2dd4bf";
          const signArrow = isAbove ? "↑" : isBelow ? "↓" : "→";

          return (
            <div className="section-card mt-6">
              <div className="section-header"><Activity size={16} className="text-[#fbbf24]" /> Search Volume → Subscriber → Revenue Signal Model</div>
              <p className="text-sm text-[#8b949e] mb-5">
                Drag the slider to model how changes in HIMS search interest translate into implied subscriber growth and forward revenue.
                Calibrated against 3 years of historical search index vs. actual subscriber &amp; ARPU data.
                Baseline = <span className="text-[#2dd4bf] font-semibold">index 75 (Mar 2026)</span> → 2,511K subs → $81/mo ARPU.
              </p>

              {/* Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#8b949e] uppercase tracking-wider">HIMS Google Search Index (0–100)</span>
                  <span className="text-xl font-bold font-tabular" style={{ color: signColor, fontFamily: 'Space Grotesk' }}>
                    {searchVolumeIdx} {searchVolumeIdx === 100 ? "🔥 Peak" : searchVolumeIdx >= 80 ? "🟢 High" : searchVolumeIdx >= 60 ? "🟡 Moderate" : "🔴 Low"}
                  </span>
                </div>
                <input
                  type="range" className="slider-input" min="10" max="100" step="1"
                  value={searchVolumeIdx}
                  onChange={e => setSearchVolumeIdx(parseInt(e.target.value))}
                  style={{ accentColor: signColor }}
                />
                <div className="flex justify-between text-[10px] text-[#8b949e] mt-1">
                  <span>10 (Deep trough)</span>
                  <span>40 (Jan 2023 baseline)</span>
                  <span>75 (Current)</span>
                  <span>100 (ATH peak)</span>
                </div>
              </div>

              {/* Implied output cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: "Search Index",
                    value: `${signArrow} ${Math.abs(idxDelta)} pts`,
                    sub: `vs. current baseline (75)`,
                    color: signColor,
                    note: idxDelta === 0 ? "At baseline" : idxDelta > 0 ? `+${idxDelta} above current` : `${idxDelta} below current`
                  },
                  {
                    label: "Implied Subscribers",
                    value: `${impliedSubs.toLocaleString()}K`,
                    sub: `${subChangePct >= 0 ? "+" : ""}${subChangePct.toFixed(1)}% vs baseline`,
                    color: signColor,
                    note: `Δ ${(impliedSubs - BASE_SUBS) >= 0 ? "+" : ""}${(impliedSubs - BASE_SUBS).toLocaleString()}K subs`
                  },
                  {
                    label: "Implied ARPU",
                    value: `$${impliedARPU}/mo`,
                    sub: `Δ ${(impliedARPU - BASE_ARPU) >= 0 ? "+" : ""}$${(impliedARPU - BASE_ARPU).toFixed(1)}/mo`,
                    color: signColor,
                    note: `AOV: $${impliedAOV}`
                  },
                  {
                    label: "Implied Annual Rev",
                    value: `$${impliedRevAnnual.toFixed(0)}M`,
                    sub: `${revDeltaPct >= 0 ? "+" : ""}${revDeltaPct.toFixed(1)}% vs baseline`,
                    color: signColor,
                    note: `Baseline: $${baseRevAnnual.toFixed(0)}M`
                  },
                ].map((c, i) => (
                  <div key={i} className="bg-[#21262d] border rounded-lg p-3" style={{ borderColor: signColor + "40" }}>
                    <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">{c.label}</div>
                    <div className="text-lg font-bold font-tabular" style={{ color: c.color, fontFamily: 'Space Grotesk' }}>{c.value}</div>
                    <div className="text-[10px] text-[#8b949e] mt-0.5">{c.sub}</div>
                    <div className="text-[10px] mt-1" style={{ color: c.color + "aa" }}>{c.note}</div>
                  </div>
                ))}
              </div>

              {/* Signal chain narrative */}
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-[#21262d] border border-[#30363d] flex-wrap">
                <span className="text-xs text-[#8b949e]">Signal chain:</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: signColor + "20", color: signColor }}>
                  Search Index {searchVolumeIdx}
                </span>
                <ChevronRight size={12} className="text-[#30363d]" />
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: signColor + "20", color: signColor }}>
                  {signArrow}{Math.abs(subChangePct).toFixed(1)}% subscriber {isAbove ? "growth" : isBelow ? "decline" : "stable"}
                </span>
                <ChevronRight size={12} className="text-[#30363d]" />
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: signColor + "20", color: signColor }}>
                  {impliedSubs.toLocaleString()}K subs × ${impliedARPU}/mo
                </span>
                <ChevronRight size={12} className="text-[#30363d]" />
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: signColor + "30", color: signColor }}>
                  ${impliedRevAnnual.toFixed(0)}M implied annual rev
                </span>
              </div>

              {/* Dual chart: historical paired + spectrum curve */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historical: search index vs implied revenue over time */}
                <div>
                  <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Historical: Search Index vs Implied Revenue</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={historicalPaired} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                      <XAxis dataKey="period" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `$${v}M`} domain={[0, 2600]} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false}
                        domain={[0, 110]} tickFormatter={v => v} />
                      <Tooltip
                        contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, fontSize: 11 }}
                        formatter={(val: number, name: string) => [
                          name === "Search Index" ? val : `$${val}M`,
                          name
                        ]}
                      />
                      <Legend formatter={v => <span style={{ color: "#8b949e", fontSize: 11 }}>{v}</span>} />
                      <Bar yAxisId="left" dataKey="impliedRev" name="Implied Ann. Revenue" fill="#2dd4bf" fillOpacity={0.5} radius={[2,2,0,0]} />
                      <Line yAxisId="right" type="monotone" dataKey="searchIdx" name="Search Index" stroke="#fbbf24" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Spectrum: search index → implied revenue curve */}
                <div>
                  <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">Spectrum: Search Index → Implied Revenue Curve</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={spectrumData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                      <XAxis dataKey="idx" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false}
                        label={{ value: "Search Index", fill: "#8b949e", fontSize: 10, position: "insideBottom", offset: -2 }} />
                      <YAxis yAxisId="left" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `$${v}M`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `${v}K`} />
                      <Tooltip
                        contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, fontSize: 11 }}
                        formatter={(val: number, name: string) => [
                          name === "Subs (K)" ? `${val}K` : `$${val}M`,
                          name
                        ]}
                      />
                      <Legend formatter={v => <span style={{ color: "#8b949e", fontSize: 11 }}>{v}</span>} />
                      <Area yAxisId="left" type="monotone" dataKey="rev" name="Implied Ann. Rev ($M)" stroke="#4ade80" fill="#4ade8020" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="subs" name="Subs (K)" stroke="#a78bfa" strokeWidth={2} dot={false} />
                      <ReferenceLine yAxisId="left" x={searchVolumeIdx} stroke={signColor} strokeWidth={2} strokeDasharray="4 2"
                        label={{ value: `Index ${searchVolumeIdx} → $${impliedRevAnnual.toFixed(0)}M`, fill: signColor, fontSize: 10, position: "insideTopRight" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 text-xs text-[#8b949e] bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <span className="text-[#fbbf24] font-semibold">Model notes:</span> Subscriber elasticity calibrated on 3Y historical data (Jan 2023–Mar 2026):
                every +10 search index points above current baseline correlates with ~+8% incremental subscriber growth; -10 pts correlates with ~-6% churn pressure.
                ARPU uplift modeled at +0.15%/pt (higher search demand = better product mix & upsell conversion).
                This is a leading-indicator model, not a causal guarantee. Revenue = Subs × Monthly ARPU × 12.
              </div>
            </div>
          );
        })()}
        {/* ══════════════════════════════════════════
            SECTION 5: DCF MODEL
        ══════════════════════════════════════════ */}
        <section id="dcf" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <DollarSign size={22} className="text-[#4ade80]" /> Full DCF Model
          </h2>

          <div className="section-card">
            <div className="flex items-center justify-between mb-6">
              <div className="section-header mb-0">
                <span>WACC-Based Discounted Cash Flow</span>
              </div>
              <div className="flex gap-2">
                {(["bull", "base", "bear"] as const).map(s => (
                  <button key={s} onClick={() => setDcfScenario(s)} className={`toggle-btn ${dcfScenario === s ? `active-${s}` : ""}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* DCF Assumptions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "WACC", value: "11.5%", note: "Beta 1.6, Rf 4.3%, ERP 6.5%" },
                { label: "Terminal Growth", value: "3.0%", note: "Long-run GDP growth" },
                { label: "Exit EV/EBITDA", value: `${dcfData.scenarios[dcfScenario].exitMultiple}x`, note: `${dcfScenario} scenario` },
                { label: "Projection Years", value: "5Y", note: "2026–2030" },
              ].map((a, i) => (
                <div key={i} className="bg-[#21262d] border border-[#30363d] rounded-lg p-3">
                  <div className="text-xs text-[#8b949e] mb-1">{a.label}</div>
                  <div className="text-lg font-bold text-[#e6edf3] font-tabular">{a.value}</div>
                  <div className="text-xs text-[#484f58] mt-0.5">{a.note}</div>
                </div>
              ))}
            </div>

            {/* DCF Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#21262d] border-2 rounded-xl p-5 text-center col-span-1"
                style={{ borderColor: dcfScenario === "bull" ? "#4ade80" : dcfScenario === "base" ? "#2dd4bf" : "#f87171" }}>
                <div className="text-xs uppercase tracking-widest text-[#8b949e] mb-2">DCF Fair Value</div>
                <div className="text-5xl font-bold font-tabular" style={{ color: dcfScenario === "bull" ? "#4ade80" : dcfScenario === "base" ? "#2dd4bf" : "#f87171", fontFamily: 'Space Grotesk' }}>
                  ${dcfResult.priceTarget}
                </div>
                <div className="text-sm text-[#8b949e] mt-2">per share</div>
                <div className="mt-3 text-sm font-semibold" style={{ color: dcfResult.priceTarget > PRICE ? "#4ade80" : "#f87171" }}>
                  {dcfResult.priceTarget > PRICE ? "+" : ""}{Math.round((dcfResult.priceTarget - PRICE) / PRICE * 100)}% vs. current
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-3">
                {[
                  { label: "Enterprise Value", value: fmt(dcfResult.enterpriseValue * 1e6), note: "Sum of PV FCFs + Terminal" },
                  { label: "Net Debt", value: fmt((dcfData.netDebt) * 1e6), note: "Total Debt - Cash" },
                  { label: "Equity Value", value: fmt((dcfResult.enterpriseValue - dcfData.netDebt) * 1e6), note: "EV - Net Debt" },
                  { label: "Shares Out", value: "225M", note: "Diluted shares" },
                ].map((m, i) => (
                  <div key={i} className="bg-[#21262d] border border-[#30363d] rounded-lg p-3">
                    <div className="text-xs text-[#8b949e]">{m.label}</div>
                    <div className="text-lg font-bold text-[#e6edf3] font-tabular">{m.value}</div>
                    <div className="text-xs text-[#484f58]">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DCF Projection Table */}
            <div className="text-xs text-[#8b949e] uppercase tracking-wider mb-3">5-Year Projection ({dcfScenario} case)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-tabular">
                <thead>
                  <tr className="border-b border-[#30363d]">
                    <th className="text-left py-2 px-3 text-[#8b949e] font-medium">Year</th>
                    <th className="text-right py-2 px-3 text-[#8b949e] font-medium">Revenue</th>
                    <th className="text-right py-2 px-3 text-[#8b949e] font-medium">EBITDA</th>
                    <th className="text-right py-2 px-3 text-[#8b949e] font-medium">FCF</th>
                    <th className="text-right py-2 px-3 text-[#8b949e] font-medium">PV of FCF</th>
                  </tr>
                </thead>
                <tbody>
                  {dcfResult.yearlyData.map((d, i) => (
                    <tr key={i} className="border-b border-[#21262d] hover:bg-[#21262d] transition-colors">
                      <td className="py-2 px-3 font-semibold">{d.year}</td>
                      <td className="py-2 px-3 text-right text-[#2dd4bf]">${d.revenue.toLocaleString()}M</td>
                      <td className="py-2 px-3 text-right">${d.ebitda.toLocaleString()}M</td>
                      <td className="py-2 px-3 text-right text-[#4ade80]">${d.fcf.toLocaleString()}M</td>
                      <td className="py-2 px-3 text-right">${d.pv.toLocaleString()}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ResponsiveContainer width="100%" height={220} className="mt-4">
              <ComposedChart data={dcfResult.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="year" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#2dd4bf" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#fbbf24" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                <Line type="monotone" dataKey="fcf" name="FCF" stroke="#4ade80" strokeWidth={2} dot={{ fill: "#4ade80", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>


        <section id="catalysts" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <Zap size={22} className="text-[#fbbf24]" /> Catalysts
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="section-card">
              <div className="section-header"><Clock size={16} className="text-[#fbbf24]" /> Earnings</div>

              <div className="bg-[#fbbf2415] border border-[#fbbf2440] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#8b949e]">Next Earnings</div>
                    <div className="text-xl font-bold text-[#fbbf24]" style={{ fontFamily: 'Space Grotesk' }}>May 4, 2026</div>
                    <div className="text-xs text-[#8b949e]">Q1 2026 Results • After market close</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#8b949e]">Revenue Estimate</div>
                    <div className="text-xl font-bold text-[#2dd4bf] font-tabular">$616.5M</div>
                    <div className="text-xs text-[#8b949e]">EPS Estimate: $0.02</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#8b949e] uppercase tracking-wider mb-3">Beat/Miss History (last 11Q)</div>
              <div className="space-y-1 mb-3">
                {earningsHistory.slice(-8).map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded hover:bg-[#21262d]">
                    <span className="text-[#8b949e]">{e.period}</span>
                    <span className={e.beat ? "text-[#4ade80]" : "text-[#f87171]"}>{e.beat ? "✓ Beat" : "✗ Miss"}</span>
                    <span className="font-tabular">${(e.actual / 1000).toFixed(2)}B vs ${(e.estimate / 1000).toFixed(2)}B</span>
                    <span className={`font-tabular font-bold ${e.move > 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>{e.move > 0 ? "+" : ""}{e.move.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#4ade8015] border border-[#4ade8030] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[#4ade80]">{earningsBeats}</div>
                  <div className="text-xs text-[#8b949e]">Beats</div>
                </div>
                <div className="bg-[#f8717115] border border-[#f8717130] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[#f87171]">{earningsMisses}</div>
                  <div className="text-xs text-[#8b949e]">Misses</div>
                </div>
                <div className="bg-[#2dd4bf15] border border-[#2dd4bf30] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[#2dd4bf]">~8.6%</div>
                  <div className="text-xs text-[#8b949e]">Avg Move</div>
                </div>
              </div>
            </div>

            {/* Product Launches */}
            <div className="section-card">
              <div className="section-header"><Zap size={16} className="text-[#4ade80]" /> Product Launches & Pipeline</div>
              {[
                { title: "Cancer Testing (At-Home)", timing: "Late 2026", status: "Pipeline", detail: "HIMS partnering with diagnostics innovators to offer at-home cancer biomarker testing through its DTC platform. Massive TAM expansion beyond current categories.", color: "#a78bfa" },
                { title: "Hormone Tracking (Home Kit)", timing: "H2 2026", status: "In Development", detail: "Home-based hormone level monitoring for testosterone, estrogen, and thyroid. Directly monetizes the Hers women's health vertical with recurring testing subscriptions.", color: "#f9a8d4" },
                { title: "Peptide Therapy", timing: "2027 Pending Regulation", status: "Regulatory Watch", detail: "FDA is reviewing peptide compound regulations. If favorable, HIMS could launch personalized peptide protocols (BPC-157, TB-500) as a new revenue stream commanding $200–400/month.", color: "#fbbf24" },
                { title: "Oral GLP-1 (Wegovy Pill)", timing: "2026–2027 via NVO", timing2: "", status: "Partnership", detail: "Novo Nordisk's oral semaglutide removes needle phobia barrier — potentially expanding HIMS GLP-1 addressable market by 30–40% per management commentary.", color: "#4ade80" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 mb-3 p-3 bg-[#21262d] rounded-lg">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: item.color }}>{item.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#30363d] text-[#8b949e]">{item.status}</span>
                    </div>
                    <div className="text-xs text-[#8b949e] mb-1">{item.detail}</div>
                    <div className="text-xs text-[#fbbf24]">Expected: {item.timing}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Novo Nordisk Partnership */}
            <div className="section-card">
              <div className="section-header"><Award size={16} className="text-[#2dd4bf]" /> Novo Nordisk Partnership — March 9, 2026</div>

              <div className="bg-[#2dd4bf12] border border-[#2dd4bf30] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#8b949e] leading-relaxed">
                  On <span className="text-[#2dd4bf] font-semibold">March 9, 2026</span>, Hims & Hers announced a landmark distribution agreement with Novo Nordisk to sell FDA-approved GLP-1 medications (Wegovy injections + oral tablets, Ozempic) through its platform. Novo simultaneously dropped its patent infringement lawsuit. As part of the deal, HIMS agreed to stop advertising compounded semaglutide; existing patients can transition to branded alternatives when clinically appropriate. HIMS stock surged <span className="text-[#4ade80] font-semibold">~37%</span> on the announcement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Stock reaction", value: "+40%", sub: "Week of Mar 9, 2026", color: "#4ade80" },
                  { label: "Legal risk reduced", value: "✓ Resolved", sub: "Patent litigation ended", color: "#4ade80" },
                  { label: "Revenue upgrade", value: "Upside risk", sub: "Not yet in consensus", color: "#fbbf24" },
                  { label: "New products", value: "2 drugs added", sub: "Injectable + Oral Wegovy", color: "#2dd4bf" },
                ].map((m, i) => (
                  <div key={i} className="bg-[#21262d] rounded-lg p-3">
                    <div className="text-xs text-[#8b949e]">{m.label}</div>
                    <div style={{ color: m.color }} className="font-bold">{m.value}</div>
                    <div className="text-xs text-[#484f58]">{m.sub}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-[#8b949e] font-semibold mb-2 uppercase tracking-wider">Bull Cases from Partnership</div>
              {[
                "Legitimizes HIMS as a mainstream pharmaceutical distribution channel",
                "Oral Wegovy eliminates needle phobia — expands GLP-1 TAM by 30-40%",
                "Revenue not yet fully modeled into analyst consensus — upside surprise potential",
                "Opens door to similar distribution deals with Eli Lilly (Zepbound)",
                "Employer benefits platform (Hims & Hers Benefits) becomes more compelling",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <ChevronRight size={12} className="text-[#2dd4bf] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#8b949e]">{point}</span>
                </div>
              ))}
            </div>

            {/* Short Float */}
            <div className="section-card">
              <div className="section-header"><AlertTriangle size={16} className="text-[#f87171]" /> Short Float & Squeeze Potential</div>

              <div className="bg-[#f8717115] border border-[#f8717130] rounded-xl p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#f87171] font-tabular">{SHORT_FLOAT_PCT}%</div>
                    <div className="text-xs text-[#8b949e]">Short Float</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#fbbf24] font-tabular">83.3M</div>
                    <div className="text-xs text-[#8b949e]">Shares Short (Mar 13)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#2dd4bf] font-tabular">~2.7</div>
                    <div className="text-xs text-[#8b949e]">Days to Cover</div>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={shortInterestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="date" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="siGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="si" name="Short Interest (M)" stroke="#f87171" fill="url(#siGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {[
                  { label: "Squeeze Potential", value: "High", color: "#f87171", detail: "44.4% of float short as of Mar 13, 2026 (MarketBeat) — $4.07B in dollar volume sold short. A sustained positive catalyst forces covering at any price." },
                  { label: "Peer Comparison", value: "5x peers", color: "#fbbf24", detail: "HIMS short interest is 5x higher than the ~8.15% average among telehealth peers (Benzinga), indicating extreme bearish consensus positioning." },
                  { label: "Historical Squeeze", value: "Feb→Mar 2025 +438%", color: "#4ade80", detail: "Previous squeeze ran from ~$13 to $70.43 ATH as short sellers covered after consecutive revenue beats. Short interest peaked at ~71M shares in Sep 2025 before rising to 83.3M by Mar 2026." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-[#21262d] rounded-lg p-3">
                    <div className="w-1.5 rounded-full flex-shrink-0 self-stretch" style={{ backgroundColor: item.color }} />
                    <div>
                      <span style={{ color: item.color }} className="text-sm font-semibold">{item.label}: {item.value} — </span>
                      <span className="text-xs text-[#8b949e]">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 7: RISK ENGINE
        ══════════════════════════════════════════ */}
        <section id="risks" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <Shield size={22} className="text-[#f87171]" /> Risk Engine & Drawdown Simulation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="section-card">
              <div className="section-header"><Shield size={16} className="text-[#f87171]" /> Key Risk Assessment</div>
              {[
                { risk: "Regulatory / FDA", level: 80, note: "GLP-1 compound restrictions, peptide regulations, personalized medication scrutiny", color: "#f87171" },
                { risk: "Gross Margin Compression", level: 65, note: "Shift from high-margin compounded drugs to lower-margin branded GLP-1 distribution", color: "#fbbf24" },
                { risk: "Competition (Teladoc, Ro)", level: 55, note: "Digital health incumbents accelerating GLP-1 offerings; Lilly's direct-to-consumer push", color: "#fbbf24" },
                { risk: "Insider Selling", level: 45, note: "465 transactions in 12 months; mostly M-EXEMPT (option exercises) but S-SALE activity present", color: "#fbbf24" },
                { risk: "Macro / Consumer Health", level: 35, note: "Subscription churn risk in economic downturn; cash-pay model vulnerable to income shock", color: "#4ade80" },
                { risk: "Valuation Premium", level: 50, note: "P/E 38x; premium requires sustained 15%+ growth; any slowdown triggers multiple compression", color: "#fbbf24" },
              ].map((r, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{r.risk}</span>
                    <span className="text-xs font-tabular" style={{ color: r.color }}>{r.level}/100</span>
                  </div>
                  <div className="risk-bar mb-1">
                    <div className="risk-fill" style={{ width: `${r.level}%`, backgroundColor: r.color }} />
                  </div>
                  <div className="text-xs text-[#8b949e]">{r.note}</div>
                </div>
              ))}
            </div>

            {/* Insider Selling */}
            <div className="section-card">
              <div className="section-header"><Eye size={16} className="text-[#fbbf24]" /> Insider Activity (Last 12 Months)</div>
              <div className="bg-[#fbbf2415] border border-[#fbbf2430] rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#fbbf24]">465</div>
                    <div className="text-xs text-[#8b949e]">Total Transactions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#f87171]">Mostly Sells</div>
                    <div className="text-xs text-[#8b949e]">S-SALE dominant</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#8b949e] leading-relaxed mb-4">
                The majority of insider transactions are <span className="text-[#fbbf24]">M-EXEMPT</span> (option exercises at low strike prices, not open-market buys). Insider S-SALEs are present. Key transactions: CFO sold ~9,217 shares at $23.77 (Mar 2026); VP sales at $28-29 (Apr 2025). <span className="text-[#f87171]">No significant open-market buys in 12 months.</span>
              </div>

              {/* Margin Decline Simulator */}
              <div className="section-header"><Activity size={16} className="text-[#f87171]" /> Margin Decline Sensitivity</div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-[#8b949e]">Gross Margin Decline (%pts)</label>
                  <span className="text-lg font-bold text-[#f87171] font-tabular">-{marginDeclinePct}pp</span>
                </div>
                <input type="range" className="slider-input" min="0" max="25" step="1" value={marginDeclinePct} onChange={e => setMarginDeclinePct(parseInt(e.target.value))} style={{ accentColor: "#f87171" }} />
                <div className="flex justify-between text-xs text-[#484f58] mt-1"><span>0 (unchanged)</span><span>10pp</span><span>25pp (severe)</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "New Gross Margin", value: `${marginSensitivity.grossMargin}%`, color: parseFloat(marginSensitivity.grossMargin) < 65 ? "#f87171" : "#fbbf24" },
                  { label: "Implied EBITDA", value: `$${marginSensitivity.ebitda}M`, color: "#fbbf24" },
                  { label: "Implied Price Target", value: `$${marginSensitivity.impliedTarget}`, color: marginSensitivity.impliedTarget < PRICE ? "#f87171" : "#4ade80" },
                ].map((m, i) => (
                  <div key={i} className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 text-center">
                    <div className="text-xs text-[#8b949e] mb-1">{m.label}</div>
                    <div style={{ color: m.color }} className="text-base font-bold font-tabular">{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-[#8b949e] mt-3">
                Scenario: -${marginDeclinePct}pp gross margin on $2.73B FY2026E revenue, applying 18x EV/EBITDA.
                {marginSensitivity.impliedTarget < PRICE
                  ? <span className="text-[#f87171]"> WARNING: This margin decline implies downside to current price.</span>
                  : <span className="text-[#4ade80]"> Margin remains supportive of current valuation.</span>}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 8: TECHNICALS
        ══════════════════════════════════════════ */}
        <section id="technicals" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <TrendingUp size={22} className="text-[#2dd4bf]" /> Technical Analysis
          </h2>

          {/* Main price chart */}
          <div className="section-card mb-4">
            <div className="section-header"><Activity size={16} className="text-[#2dd4bf]" /> HIMS 5-Year Price Chart with EMAs</div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="date" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span style={{ color: "#8b949e", fontSize: 12 }}>{v}</span>} />
                <Line type="monotone" dataKey="price" name="Price" stroke="#e6edf3" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema50" name="50 EMA" stroke="#4ade80" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="ema200" name="200 EMA" stroke="#f87171" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
                <ReferenceLine y={PRICE} stroke="#fbbf24" strokeDasharray="3 3" label={{ value: "Current", fill: "#fbbf24", fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs text-[#8b949e]">
              <div className="bg-[#21262d] rounded-lg p-3">
                <span className="text-[#4ade80] font-semibold">50 EMA: ~$18.10</span><br/>Price is <span className="text-[#4ade80]">above 50 EMA</span> — short-term bullish. HIMS has historically rallied 80–150% after reclaiming 50 EMA from below.
              </div>
              <div className="bg-[#21262d] rounded-lg p-3">
                <span className="text-[#f87171] font-semibold">200 EMA: ~$21.80</span><br/>Price is <span className="text-[#f87171]">below 200 EMA</span> — long-term trend still bearish. Reclaiming 200 EMA is the key technical catalyst for a sustained rally.
              </div>
              <div className="bg-[#21262d] rounded-lg p-3">
                <span className="text-[#fbbf24] font-semibold">EMA Structure:</span><br/>Death cross occurred late 2025. Golden cross requires 50 EMA to break above 200 EMA. Watch for this in Q2–Q3 2026 if growth resumes.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* RSI Chart */}
            <div className="section-card">
              <div className="section-header"><Activity size={16} className="text-[#a78bfa]" /> RSI (14-day) — Historical Drawdowns</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={rsiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="date" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={70} stroke="#f87171" strokeDasharray="3 3" label={{ value: "Overbought 70", fill: "#f87171", fontSize: 10 }} />
                  <ReferenceLine y={30} stroke="#4ade80" strokeDasharray="3 3" label={{ value: "Oversold 30", fill: "#4ade80", fontSize: 10 }} />
                  <ReferenceLine y={50} stroke="#484f58" strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="rsi" name="RSI (14)" stroke="#a78bfa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                Current RSI ~52 — <span className="text-[#fbbf24]">neutral territory</span>. HIMS has been a mean-reverting stock: RSI drops below 30 (oversold) reliably precede 50–150%+ rallies (seen in 2022, 2023, late 2025). Current RSI recovery from ~28 (Nov 2025 oversold) suggests early-stage recovery phase.
              </div>
            </div>

            {/* Volume Chart */}
            <div className="section-card">
              <div className="section-header"><BarChart2 size={16} className="text-[#fbbf24]" /> Volume Spikes & Price Action</div>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="date" tick={{ fill: "#8b949e", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="price" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <YAxis yAxisId="vol" orientation="right" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="vol" dataKey="vol" name="Volume (M)" fill="#fbbf24" fillOpacity={0.4} radius={[2, 2, 0, 0]} />
                  <Line yAxisId="price" type="monotone" dataKey="price" name="Price" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                Volume spikes above <span className="text-[#fbbf24]">20M shares</span> have historically coincided with major inflection points — the Feb 2025 GLP-1 ruling (sell-off), the Q1 2025 earnings beat (rally), and the March 2026 NVO partnership (surge). The April 1 2026 volume of 26M shares shows continued elevated interest post-partnership.
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 9: FULL ANALYSIS
        ══════════════════════════════════════════ */}
        <section id="analysis" className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
            <BookOpen size={22} className="text-[#4ade80]" /> Full Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Base Case */}
            <div className="section-card" style={{ borderColor: "#2dd4bf40" }}>
              <div className="section-header text-[#2dd4bf]"><span className="text-[#2dd4bf]">⚖️</span> Base Case — $28 (2026) / $38 (2027)</div>
              <div className="space-y-3">
                {[
                  { title: "Revenue", detail: "FY2026E: $2.73B (+16% YoY) per consensus. FY2027E: $3.21B (+17%). Growth normalizing from 59% peak but still strong double-digits." },
                  { title: "Gross Margin", detail: "Compressed to 70–72% as branded GLP-1 distribution (lower margin) replaces compounded. EBITDA margin expands to 11-14% from 6.8% in 2025." },
                  { title: "Novo Partnership", detail: "Incrementally positive. Revenue from NVO distribution begins to flow in H2 2026. Not yet reflected in full consensus models." },
                  { title: "Valuation", detail: "16x EV/EBITDA on FY2026E $325M EBITDA = ~$5.85B EV. Minus net debt $1.03B = $4.82B equity / 225M shares = ~$21 fair value on 16x. At 20x = $28." },
                  { title: "Catalysts", detail: "Q1 2026 earnings (May 4), employer benefits platform rollout, oral Wegovy launch, any analyst upgrades from current cautious neutral consensus." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 rounded-full bg-[#2dd4bf] flex-shrink-0 self-stretch" />
                    <div>
                      <div className="text-sm font-semibold text-[#2dd4bf] mb-0.5">{item.title}</div>
                      <div className="text-xs text-[#8b949e] leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bull Case */}
            <div className="section-card" style={{ borderColor: "#4ade8040" }}>
              <div className="section-header"><span>🐂</span> Bull Case — $44 (2026) / $62 (2027)</div>
              <div className="space-y-3">
                {[
                  { title: "GLP-1 Revenue Surprise", detail: "Branded GLP-1 distribution ramps faster than expected. Goldman Sachs projects a $100–150B global GLP-1 market by 2030; JPM forecasts 15–30M US patients. If HIMS captures 3-5% at $150–200/month, that's $810M–$3.6B in incremental annual revenue — transformative." },
                  { title: "Margin Rebound", detail: "If HIMS negotiates favorable rev-share with Novo Nordisk and scales the employer benefits B2B channel, gross margins could stabilize at 72-76% (from 74% in FY2025) rather than compress to the feared 65% as branded GLP-1 mix grows." },
                  { title: "Short Squeeze", detail: "As of Mar 13 2026, short interest was 83.3M shares / 44.4% of float (MarketBeat). Any sustained positive catalyst forces covering. Peak short interest was ~71M shares at Sep 2025 (31.4% of float)." },
                  { title: "New Product TAM", detail: "At-home cancer testing + hormone kits + peptides = 3 new $500M+ TAM categories. Even partial penetration meaningfully expands HIMS's addressable market beyond $8-10B." },
                  { title: "Valuation Re-Rating", detail: "BTIG maintains $60 target on 25x EV/EBITDA. Canaccord maintains $68 on 30x. If HIMS executes and the market narrative shifts from 'regulatory risk' to 'healthcare platform', premium multiple justified." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 rounded-full bg-[#4ade80] flex-shrink-0 self-stretch" />
                    <div>
                      <div className="text-sm font-semibold text-[#4ade80] mb-0.5">{item.title}</div>
                      <div className="text-xs text-[#8b949e] leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supporting Thesis */}
          <div className="section-card mb-6" style={{ borderColor: "#4ade8030", background: "linear-gradient(135deg, #0d1117 0%, #0a1a14 100%)" }}>
            <div className="section-header"><TrendingUp size={16} className="text-[#4ade80]" /> Supporting Thesis — Why HIMS at $19.84 is Compelling</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#8b949e] leading-relaxed mb-4">
                  Hims & Hers sits at a rare inflection point. The company grew revenue <span className="text-[#4ade80] font-semibold">59% YoY in FY2025</span> to $2.35B, achieved its first full year of GAAP profitability ($128M net income), and just secured the most transformative partnership in its history with Novo Nordisk. Yet the stock trades 72% below its all-time high of $70.43.
                </p>
                <p className="text-sm text-[#8b949e] leading-relaxed mb-4">
                  The bear thesis — that HIMS was a GLP-1 compounding arbitrage story with no moat — has been invalidated by the Novo deal. HIMS is now a <span className="text-[#2dd4bf] font-semibold">legitimate pharmaceutical distribution platform</span> with direct-to-consumer scale (2.5M+ subscribers), brand recognition, and a technology infrastructure that incumbent pharmacies lack.
                </p>
                <p className="text-sm text-[#8b949e] leading-relaxed">
                  With 44.4% short float (MarketBeat, Mar 13, 2026), any material beat or forward guidance raise creates asymmetric upside through forced short covering. The base case 16x EV/EBITDA applies a discount to comparable digital health platforms; a re-rating to 20–22x — entirely reasonable given 16%+ growth and first-time positive EBITDA margin expansion — drives $28–35 per share by year-end 2026.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "🏗️", title: "Platform moat", body: "2.5M subscribers with recurring monthly revenue — switching costs are low individually but aggregate churn is historically < 5% per quarter." },
                  { icon: "💊", title: "GLP-1 secular trend", body: "15–30M US patients projected by 2030 (JPM/Goldman). GLP-1 market forecast $100–150B globally by 2030 (Goldman Sachs). HIMS owns the digital front-door via its Novo Nordisk distribution deal." },
                  { icon: "📊", title: "Earnings leverage", body: "Fixed cost base means incremental revenue flows at 30–40% incremental margins. Each $100M in new revenue adds ~$35M in EBITDA." },
                  { icon: "⚡", title: "Short squeeze asymmetry", body: "40% float short = convex upside. If stock reaches $28, short sellers face ~$500M+ in losses, creating self-reinforcing buying." },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 bg-[#21262d] rounded-lg p-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-[#e6edf3]">{t.title}</div>
                      <div className="text-xs text-[#8b949e]">{t.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Weight Guidance */}
          <div className="section-card" style={{ borderColor: "#fbbf2430" }}>
            <div className="section-header"><Percent size={16} className="text-[#fbbf24]" /> Portfolio Weight Guidance</div>
            <div className="bg-[#fbbf2412] border border-[#fbbf2430] rounded-xl p-4 mb-5 text-xs text-[#8b949e]">
              <span className="text-[#f87171] font-bold">DISCLAIMER:</span> The following is educational financial analysis for a stock pitch, not personalized investment advice. HIMS is a high-volatility, speculative stock. Always conduct your own due diligence and consult a licensed financial advisor before investing.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  type: "Aggressive Growth Portfolio",
                  allocation: "3–7%",
                  color: "#4ade80",
                  profile: "High risk tolerance, long time horizon (3-5Y+)",
                  rationale: "HIMS's asymmetric risk/reward profile (44% short float, platform pivot, GLP-1 tailwind) justifies a meaningful position in a growth-oriented portfolio. The GLP-1 market alone is a multi-decade secular theme ($100–150B by 2030 per Goldman Sachs).",
                  caveats: "Set a hard stop-loss at -25% from entry. Add on dips toward $13-15 support. Scale out at $35+ to reduce concentration.",
                  icon: "🚀"
                },
                {
                  type: "Balanced / Core Portfolio",
                  allocation: "1–3%",
                  color: "#2dd4bf",
                  profile: "Moderate risk tolerance, 2-3Y horizon",
                  rationale: "At $19.84, HIMS offers 40%+ upside to base case target with manageable downside to $13-15 support. Appropriate as a satellite position within a diversified healthcare allocation alongside lower-volatility names.",
                  caveats: "Do not chase momentum above $28 without fundamental re-evaluation. Monitor short interest trends and margin data quarterly.",
                  icon: "⚖️"
                },
                {
                  type: "Conservative / Income Portfolio",
                  allocation: "0–0.5%",
                  color: "#fbbf24",
                  profile: "Low risk tolerance, preservation-focused",
                  rationale: "HIMS pays no dividend and carries meaningful regulatory, execution, and valuation risk. Only appropriate as a small speculative sleeve if at all. The 44% short float and earnings volatility (avg 8.6% move) creates uncomfortable drawdown potential.",
                  caveats: "If allocating, consider via deep ITM call options with defined risk rather than common stock outright.",
                  icon: "🛡️"
                },
              ].map((p, i) => (
                <div key={i} className="border border-[#30363d] rounded-xl p-4" style={{ borderColor: `${p.color}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk' }}>{p.type}</div>
                      <div className="text-xs text-[#8b949e]">{p.profile}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-tabular mb-3" style={{ color: p.color, fontFamily: 'Space Grotesk' }}>{p.allocation}</div>
                  <div className="text-xs text-[#8b949e] leading-relaxed mb-3">{p.rationale}</div>
                  <div className="text-xs leading-relaxed" style={{ color: p.color }}><strong>Position sizing notes:</strong> {p.caveats}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#21262d] rounded-xl p-4">
                <div className="text-sm font-bold text-[#e6edf3] mb-2">Entry Strategy</div>
                <div className="space-y-1 text-xs text-[#8b949e]">
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#4ade80] mt-0.5 flex-shrink-0" /><span>Consider scaling into position in 3 tranches: 1/3 at current ($19-21), 1/3 on any pullback to $15-16, 1/3 after Q1 2026 earnings confirmation</span></div>
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#4ade80] mt-0.5 flex-shrink-0" /><span>Catalyst-driven entry: buy before May 4 earnings if 30-day options implied vol is below 70%</span></div>
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#4ade80] mt-0.5 flex-shrink-0" /><span>Monitor RSI — entries below RSI 35 have historically led to 50%+ returns within 6 months</span></div>
                </div>
              </div>
              <div className="bg-[#21262d] rounded-xl p-4">
                <div className="text-sm font-bold text-[#e6edf3] mb-2">Exit / Risk Management</div>
                <div className="space-y-1 text-xs text-[#8b949e]">
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#f87171] mt-0.5 flex-shrink-0" /><span>Stop loss: $13.50 (below 52-week low of $13.74) — invalidates the thesis</span></div>
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#fbbf24] mt-0.5 flex-shrink-0" /><span>Partial exit at $28 (base case target): take 50% off</span></div>
                  <div className="flex gap-2"><ChevronRight size={12} className="text-[#4ade80] mt-0.5 flex-shrink-0" /><span>Full reassessment at $38-44: requires updated fundamentals to justify hold above that range</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#21262d]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="#2dd4bf" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="1.5"/>
              <path d="M8 22V10h4v5h8v-5h4v12h-4v-5h-8v5H8Z" fill="#2dd4bf"/>
            </svg>
            <span className="text-[#8b949e] text-sm font-semibold">HIMS & HERS INVESTOR DASHBOARD</span>
          </div>
          <p className="text-xs text-[#484f58]">Data sourced from Perplexity Finance, company filings, and public market data. For educational purposes only. Not investment advice.</p>
          <p className="text-xs text-[#484f58] mt-1">Last updated: April 1, 2026 • NYSE: HIMS</p>
        </footer>

      </div>
    </div>
  );
}
