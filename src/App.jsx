import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  BarChart3,
  GitBranch,
  Layers,
  Network,
  BookOpen,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Play,
  RotateCcw,
  Sliders,
  Filter,
  Download,
  Plus,
  HelpCircle,
  Briefcase,
  Compass,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Info,
  Maximize2,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  ExternalLink,
  Target,
  Building2,
  Cpu,
  Wind,
  Train,
  CheckCircle,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  FolderPlus,
  Calendar,
  Layers3,
  User,
  LogOut,
  ChevronUp,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  ShieldCheck,
  Percent,
  Sparkles,
  Trash2,
  Copy,
  Upload,
  CheckSquare,
  Square,
  MoreHorizontal,
  SlidersVertical,
  Loader2,
  Terminal,
  Activity,
  Zap,
  StopCircle,
  Shuffle,
  Split,
  CircleDot
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts';

function formatCurrency(val) {
  if (val == null || isNaN(val)) return '$0';
  if (Math.abs(val) >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(val) >= 1000) {
    return `$${(val / 1000).toFixed(0)}k`;
  }
  return `$${Number(val).toLocaleString()}`;
}

function calculateDurationMonths(startDateStr, finishDateStr) {
  if (!startDateStr || !finishDateStr) return { days: 0, months: 0 };
  const start = new Date(startDateStr);
  const finish = new Date(finishDateStr);
  const diffTime = finish.getTime() - start.getTime();
  if (diffTime <= 0) return { days: 0, months: 0 };
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return { days, months: Math.round(days / 30.4) };
}

const PORTFOLIO_PROJECTS = [
  {
    id: "PRJ-2027-VN01",
    code: "VN01-OFFICE",
    name: "30-Story Commercial Office Tower",
    industry: "Construction",
    location: "District 1, Ho Chi Minh City, Vietnam",
    budget: 20000000,
    durationMonths: 24,
    startDate: "2027-01-05",
    finishDate: "2029-01-04",
    pmoLead: "Alex Morgan, PMP",
    healthStatus: "Under Watch",
    progressPct: 38,
    scheduleConfidenceP80: 72,
    budgetConfidenceP80: 81,
    openRisksCount: 8,
    highRisksCount: 3,
    lastAnalysis: "2 hours ago",
    description: "Grade-A sustainable corporate skyscraper with 4 basement excavation levels adjacent to the Saigon River."
  },
  {
    id: "PRJ-2027-VN02",
    code: "VN02-METRO",
    name: "Metro Line 2 Underground Tunnel",
    industry: "Construction",
    location: "Ho Chi Minh City, Vietnam",
    budget: 85000000,
    durationMonths: 48,
    startDate: "2026-03-01",
    finishDate: "2030-03-01",
    pmoLead: "David Kim, PMI-RMP",
    healthStatus: "Critical Action Required",
    progressPct: 22,
    scheduleConfidenceP80: 48,
    budgetConfidenceP80: 55,
    openRisksCount: 14,
    highRisksCount: 6,
    lastAnalysis: "Yesterday",
    description: "Deep shield tunnel boring package passing under historic dense urban infrastructure."
  },
  {
    id: "PRJ-2027-VN03",
    code: "VN03-WIND",
    name: "Offshore Wind Power Substation Alpha",
    industry: "Energy",
    location: "Binh Thuan Offshore, Vietnam",
    budget: 45000000,
    durationMonths: 18,
    startDate: "2027-04-10",
    finishDate: "2028-10-10",
    pmoLead: "Sara Chen, PE",
    healthStatus: "On Track",
    progressPct: 60,
    scheduleConfidenceP80: 88,
    budgetConfidenceP80: 92,
    openRisksCount: 7,
    highRisksCount: 1,
    lastAnalysis: "3 days ago",
    description: "High-voltage maritime electrical substation platform with subsea export cables."
  },
  {
    id: "PRJ-2027-VN04",
    code: "VN04-CHIP",
    name: "Semiconductor Cleanroom Expansion",
    industry: "Manufacturing",
    location: "Saigon Hi-Tech Park, Vietnam",
    budget: 32000000,
    durationMonths: 14,
    startDate: "2026-08-15",
    finishDate: "2027-10-15",
    pmoLead: "Marcus Brody, PMP",
    healthStatus: "Under Watch",
    progressPct: 45,
    scheduleConfidenceP80: 64,
    budgetConfidenceP80: 74,
    openRisksCount: 6,
    highRisksCount: 2,
    lastAnalysis: "5 days ago",
    description: "ISO Class 3 ultra-clean manufacturing facility retrofit for advanced microelectronic packaging."
  }
];

const INITIAL_RISKS = [
  {
    id: "R001",
    title: "Heavy Rainfall & Monsoon Flooding",
    statement: "During excavation phase, monsoon storms may flood the pit, causing foundation work stoppage and slurry wall collapse.",
    category: "Environmental",
    type: "Threat",
    phase: "Substructure",
    severity: "High",
    probability: 0.65,
    costImpactMin: 180000,
    costImpactMostLikely: 420000,
    costImpactMax: 950000,
    scheduleImpactDaysMin: 14,
    scheduleImpactDaysML: 30,
    scheduleImpactDaysMax: 65,
    distribution: "PERT",
    responseStrategy: "Mitigate",
    mitigationStrategy: "Deploy high-volume dewatering pumps, construct flood bund barriers, and stage waterproofing membranes.",
    mitigationCost: 85000,
    owner: "Nguyen Van An (Site Director)",
    status: "Open",
    criticalPath: true,
    readyForQuant: true
  },
  {
    id: "R002",
    title: "Unexpected Underground Utilities",
    statement: "Uncharted high-voltage or drainage lines may be encountered during piling, requiring emergency utility rerouting.",
    category: "Technical",
    type: "Threat",
    phase: "Substructure",
    severity: "Medium",
    probability: 0.40,
    costImpactMin: 120000,
    costImpactMostLikely: 350000,
    costImpactMax: 800000,
    scheduleImpactDaysMin: 10,
    scheduleImpactDaysML: 25,
    scheduleImpactDaysMax: 45,
    distribution: "Triangular",
    responseStrategy: "Mitigate",
    mitigationStrategy: "Ground penetrating radar (GPR) scan and municipal as-built validation prior to augering.",
    mitigationCost: 40000,
    owner: "Pham Minh (Lead Civil)",
    status: "Open",
    criticalPath: false,
    readyForQuant: true
  },
  {
    id: "R003",
    title: "Concrete Price Escalation",
    statement: "Global clinker and raw aggregate supply tightness may drive ready-mix concrete unit costs higher by over 18%.",
    category: "Market",
    type: "Threat",
    phase: "Superstructure",
    severity: "High",
    probability: 0.70,
    costImpactMin: 250000,
    costImpactMostLikely: 680000,
    costImpactMax: 1400000,
    scheduleImpactDaysMin: 0,
    scheduleImpactDaysML: 5,
    scheduleImpactDaysMax: 15,
    distribution: "Normal",
    responseStrategy: "Transfer",
    mitigationStrategy: "Execute fixed-price advance supply agreement with 60% advance raw materials hedging.",
    mitigationCost: 110000,
    owner: "Le Thi Thu (Procurement)",
    status: "Treating",
    criticalPath: false,
    readyForQuant: true
  },
  {
    id: "R004",
    title: "Labor Shortage (Post-Tet Holiday)",
    statement: "Construction workers may delay returning after the lunar holiday, leading to reduced formwork cycle times.",
    category: "Resource",
    type: "Threat",
    phase: "Superstructure",
    severity: "Medium",
    probability: 0.55,
    costImpactMin: 90000,
    costImpactMostLikely: 210000,
    costImpactMax: 500000,
    scheduleImpactDaysMin: 12,
    scheduleImpactDaysML: 28,
    scheduleImpactDaysMax: 42,
    distribution: "Triangular",
    responseStrategy: "Mitigate",
    mitigationStrategy: "Offer retention and early return bonuses; subcontract backup trade contractors.",
    mitigationCost: 60000,
    owner: "Tran Hoang (HR & Subcontracts)",
    status: "Open",
    criticalPath: true,
    readyForQuant: true
  },
  {
    id: "R005",
    title: "Foundation Diaphragm Wall Rework",
    statement: "Slurry hydraulic pressure failure during trenching could cause soil collapse and defective concrete joints requiring jet grouting remediation.",
    category: "Quality",
    type: "Threat",
    phase: "Substructure",
    severity: "High",
    probability: 0.25,
    costImpactMin: 350000,
    costImpactMostLikely: 750000,
    costImpactMax: 1600000,
    scheduleImpactDaysMin: 20,
    scheduleImpactDaysML: 45,
    scheduleImpactDaysMax: 90,
    distribution: "PERT",
    responseStrategy: "Mitigate",
    mitigationStrategy: "Implement continuous ultrasonic trench profile checking and polymer stabilizer additives.",
    mitigationCost: 120000,
    owner: "Vuong Tan (QA/QC Lead)",
    status: "Open",
    criticalPath: true,
    readyForQuant: true
  },
  {
    id: "R006",
    title: "Permit Approval Delay",
    statement: "Bureaucratic changes in urban environmental guidelines may delay the above-ground superstructure building permit.",
    category: "Regulatory",
    type: "Threat",
    phase: "Design & Approvals",
    severity: "Medium",
    probability: 0.35,
    costImpactMin: 40000,
    costImpactMostLikely: 150000,
    costImpactMax: 400000,
    scheduleImpactDaysMin: 15,
    scheduleImpactDaysML: 35,
    scheduleImpactDaysMax: 70,
    distribution: "Uniform",
    responseStrategy: "Avoid",
    mitigationStrategy: "Engage expedited regulatory consultant and submit dual architectural compliance packages.",
    mitigationCost: 35000,
    owner: "Elena Rostova (Legal Counsel)",
    status: "Open",
    criticalPath: true,
    readyForQuant: true
  },
  {
    id: "R007",
    title: "Tower Crane Breakdown",
    statement: "Main hoist mechanical failure during core-wall construction could paralyze concrete bucket lifts and steel hoisting.",
    category: "Equipment",
    type: "Threat",
    phase: "Superstructure",
    severity: "Medium",
    probability: 0.30,
    costImpactMin: 50000,
    costImpactMostLikely: 140000,
    costImpactMax: 320000,
    scheduleImpactDaysMin: 7,
    scheduleImpactDaysML: 16,
    scheduleImpactDaysMax: 30,
    distribution: "PERT",
    responseStrategy: "Mitigate",
    mitigationStrategy: "Mandate bi-weekly certified non-destructive winch inspections and keep critical motors on standby.",
    mitigationCost: 25000,
    owner: "Klaus Weber (Plant Manager)",
    status: "Mitigated",
    criticalPath: false,
    readyForQuant: true
  },
  {
    id: "R008",
    title: "Supplier Delivery Disruption (Façade Glazing)",
    statement: "International sea freight bottlenecks could delay specialized double-glazed low-E curtain wall panels from Europe.",
    category: "Supply Chain",
    type: "Threat",
    phase: "Enclosure",
    severity: "Medium",
    probability: 0.45,
    costImpactMin: 100000,
    costImpactMostLikely: 290000,
    costImpactMax: 650000,
    scheduleImpactDaysMin: 14,
    scheduleImpactDaysML: 28,
    scheduleImpactDaysMax: 50,
    distribution: "Triangular",
    responseStrategy: "Transfer",
    mitigationStrategy: "Dual-source aluminum extrusions domestically; establish bonded warehouse buffer stock.",
    mitigationCost: 45000,
    owner: "Le Thi Thu (Procurement)",
    status: "Open",
    criticalPath: false,
    readyForQuant: true
  }
];

const RECENT_ANALYSES = [
  {
    id: "RUN-9042",
    method: "Monte Carlo Simulation",
    project: "30-Story Commercial Office Tower",
    analyst: "Alex Morgan, PMP",
    iterations: "3,000",
    status: "Completed",
    keyOutcome: "P80 Target: $21.84M (+98 days)",
    timestamp: "Oct 3, 2026, 10:24 AM"
  },
  {
    id: "RUN-9038",
    method: "Sensitivity Analysis (Tornado)",
    project: "30-Story Commercial Office Tower",
    analyst: "Alex Morgan, PMP",
    iterations: "Ranked",
    status: "Completed",
    keyOutcome: "Driver #1: Foundation D-Wall Rework",
    timestamp: "Oct 2, 2026, 4:15 PM"
  },
  {
    id: "RUN-9011",
    method: "Decision Tree (EMV)",
    project: "Metro Line 2 Underground Tunnel",
    analyst: "David Kim, PMI-RMP",
    iterations: "Rollback",
    status: "Completed",
    keyOutcome: "Selected: Slurry TBM ($937k EMV)",
    timestamp: "Sep 28, 2026, 2:00 PM"
  },
  {
    id: "RUN-8994",
    method: "Monte Carlo Simulation",
    project: "Offshore Wind Power Substation Alpha",
    analyst: "Sara Chen, PE",
    iterations: "5,000",
    status: "Completed",
    keyOutcome: "P80 Target: $47.2M (+42 days)",
    timestamp: "Sep 25, 2026, 11:30 AM"
  }
];

function runMonteCarloSimulation(riskList, iterations = 3000, baselineCost = 20000000, baselineDays = 730) {
  const activeRisks = riskList.filter(r => r.readyForQuant);
  const costResults = [];
  const scheduleResults = [];

  for (let i = 0; i < iterations; i++) {
    let iterationCost = baselineCost;
    let iterationDays = baselineDays;

    activeRisks.forEach(risk => {
      if (Math.random() <= risk.probability) {
        let sampledCost;
        if (risk.distribution === 'Uniform') {
          sampledCost = risk.costImpactMin + Math.random() * (risk.costImpactMax - risk.costImpactMin);
        } else {
          const u = Math.random();
          const f = (risk.costImpactMostLikely - risk.costImpactMin) / ((risk.costImpactMax - risk.costImpactMin) || 1);
          if (u < f) {
            sampledCost = risk.costImpactMin + Math.sqrt(u * (risk.costImpactMax - risk.costImpactMin) * (risk.costImpactMostLikely - risk.costImpactMin));
          } else {
            sampledCost = risk.costImpactMax - Math.sqrt((1 - u) * (risk.costImpactMax - risk.costImpactMin) * (risk.costImpactMax - risk.costImpactMostLikely));
          }
        }
        iterationCost += sampledCost;

        if (risk.criticalPath) {
          const sampledDays = risk.scheduleImpactDaysMin + Math.random() * (risk.scheduleImpactDaysMax - risk.scheduleImpactDaysMin);
          iterationDays += sampledDays;
        }
      }
    });

    costResults.push(iterationCost);
    scheduleResults.push(iterationDays);
  }

  costResults.sort((a, b) => a - b);
  scheduleResults.sort((a, b) => a - b);

  const getPercentile = (arr, p) => arr[Math.floor(arr.length * (p / 100))] || arr[arr.length - 1];

  return {
    iterations,
    cost: {
      p10: getPercentile(costResults, 10),
      p50: getPercentile(costResults, 50),
      p70: getPercentile(costResults, 70),
      p80: getPercentile(costResults, 80),
      p90: getPercentile(costResults, 90)
    },
    schedule: {
      p10: getPercentile(scheduleResults, 10),
      p50: getPercentile(scheduleResults, 50),
      p70: getPercentile(scheduleResults, 70),
      p80: getPercentile(scheduleResults, 80),
      p90: getPercentile(scheduleResults, 90)
    }
  };
}

function DashboardScreen({
  state,
  setState,
  projects,
  currentProject,
  onSelectProject,
  risks,
  analyses,
  onOpenNewProject,
  onNavigate,
  kpiFilter,
  setKpiFilter,
  onOpenRunResult
}) {
  if (state === 'loading') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-7 w-16 bg-slate-300 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-80 bg-white border border-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Failed to Load Project Portfolio</h3>
        <p className="text-xs text-slate-500">
          The risk intelligence data layer encountered an unexpected connection failure.
        </p>
        <button
          onClick={() => setState('normal')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">No Projects Configured</h3>
        <p className="text-xs text-slate-500">
          Get started by configuring your first commercial development or infrastructure project.
        </p>
        <button
          onClick={onOpenNewProject}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg"
        >
          Create First Project
        </button>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => {
    if (kpiFilter === 'needs_attention') {
      return p.healthStatus === 'Critical Action Required' || p.healthStatus === 'Under Watch';
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, Alex
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Here's your project risk overview across {projects.length} active capital developments.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('projects')}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs"
          >
            Manage Portfolio
          </button>
          <button
            onClick={onOpenNewProject}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setKpiFilter(null)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            kpiFilter === null ? 'bg-white border-indigo-300 shadow-xs ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Projects</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">04</div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+1 new this quarter</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('risk-register')}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Open Risks</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{risks.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {risks.filter(r => r.criticalPath).length} on Critical Path &bull; {risks.filter(r => r.readyForQuant).length} Ready
          </div>
        </div>

        <div
          onClick={() => onNavigate('analysis-select')}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Analyses Run</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">18</div>
          <div className="text-[11px] text-indigo-600 mt-1 font-semibold">
            Monte Carlo & EMV &bull; Converged
          </div>
        </div>

        <div
          onClick={() => setKpiFilter(kpiFilter === 'needs_attention' ? null : 'needs_attention')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            kpiFilter === 'needs_attention'
              ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono">02</div>
          <div className="text-[11px] text-rose-600 mt-1 font-semibold">
            P80 schedule variance &gt; 15%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Capital Project Portfolio ({filteredProjects.length})
          </h2>
          {kpiFilter && (
            <button
              onClick={() => setKpiFilter(null)}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => { onSelectProject(proj.id); onNavigate('risk-register'); }}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {proj.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      proj.healthStatus === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      proj.healthStatus === 'Under Watch' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {proj.healthStatus}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{proj.name}</h3>
                  <p className="text-[11px] text-slate-500">{proj.location} &bull; {proj.industry}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900">{formatCurrency(proj.budget)}</span>
                  <span className="text-[10px] text-slate-400 block">{proj.durationMonths} Months</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Physical Completion</span>
                  <span className="font-bold text-slate-900">{proj.progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${proj.progressPct}%` }}></div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">P80 Schedule Confidence</span>
                    <span className={`font-mono font-bold ${proj.scheduleConfidenceP80 < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {proj.scheduleConfidenceP80}%
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">P80 Budget Confidence</span>
                    <span className={`font-mono font-bold ${proj.budgetConfidenceP80 < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {proj.budgetConfidenceP80}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Analyst: {proj.pmoLead}</span>
                <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                  <span>Open Register</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Portfolio Risk Exposure</h3>
          <p className="text-xs text-slate-500">Breakdown of cataloged threats across active projects</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                <span>Severity Distribution</span>
                <span>3 High &bull; 4 Med &bull; 1 Mitigated</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div style={{ width: '38%' }} className="bg-rose-500" title="High"></div>
                <div style={{ width: '50%' }} className="bg-amber-400" title="Medium"></div>
                <div style={{ width: '12%' }} className="bg-emerald-400" title="Low"></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Expected Cost EMV</span>
                <span className="font-mono font-bold text-slate-900 text-sm">+$1.84M USD</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Critical Path Schedule EMV</span>
                <span className="font-mono font-bold text-purple-700 text-sm">+57 Days Float</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('results')}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors"
            >
              View Detailed Exposure Analytics
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Recent Quantitative Runs</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] font-bold uppercase">
                <tr>
                  <th className="p-2">Run ID</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Outcome</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.map(run => (
                  <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 font-mono font-bold text-indigo-700">{run.id}</td>
                    <td className="p-2 font-medium text-slate-800">{run.method}</td>
                    <td className="p-2 font-mono text-[11px] text-slate-700">{run.keyOutcome}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => onOpenRunResult(run)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-indigo-600 font-semibold rounded text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCreationWizard({ onCancel, onCreateProject, onSaveDraft }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "30-Story Commercial Office Tower",
    code: "VN01-OFFICE",
    description: "Grade-A sustainable corporate skyscraper with 4 basement excavation levels adjacent to the Saigon River.",
    industry: "Construction",
    projectManager: "Alex Morgan, PMP",
    location: "District 1, Ho Chi Minh City, Vietnam",
    objective: "Deliver LEED Gold certified commercial headquarters on schedule with P80 budget certainty.",
    startDate: "2027-01-05",
    finishDate: "2029-01-04",
    budget: 20000000,
    currency: "USD",
    calendar: "Standard 6-Day Construction",
    targetScheduleConfidence: 80,
    targetCostConfidence: 80,
    maxAcceptableDelay: 45,
    maxAcceptableCostOverrun: 1500000,
    riskAppetite: "Medium"
  });

  const durationData = useMemo(() => {
    return calculateDurationMonths(formData.startDate, formData.finishDate);
  }, [formData.startDate, formData.finishDate]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.name.trim()) errs.name = "Project name is required.";
      if (!formData.projectManager.trim()) errs.projectManager = "Project manager is required.";
      if (!formData.location.trim()) errs.location = "Location is required.";
    }
    if (step === 2) {
      if (!formData.startDate) errs.startDate = "Start date required.";
      if (!formData.finishDate) errs.finishDate = "Finish date required.";
      if (formData.budget <= 0) errs.budget = "Valid budget required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      onCreateProject({
        ...formData,
        durationMonths: durationData.months
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Configuration Wizard</h1>
          <p className="text-xs text-slate-500">Configure baselines, working calendar, and statistical risk appetite.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSaveDraft(formData)}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold"
          >
            Save Draft
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        {[
          { num: 1, title: "1. Project Information" },
          { num: 2, title: "2. Baseline Configuration" },
          { num: 3, title: "3. Risk Tolerance" }
        ].map(step => (
          <div
            key={step.num}
            className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
              currentStep === step.num
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : currentStep > step.num
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentStep === step.num ? 'bg-indigo-600 text-white' :
              currentStep > step.num ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {currentStep > step.num ? <Check className="w-3 h-3" /> : step.num}
            </div>
            <span className="truncate">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-sm">Step 1 — Project Information</h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
              {errors.name && <span className="text-rose-600 text-[10px]">{errors.name}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={e => handleChange('industry', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Construction">Construction</option>
                  <option value="Banking">Banking</option>
                  <option value="IT/Software">IT / Software</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Manager *</label>
                <input
                  type="text"
                  value={formData.projectManager}
                  onChange={e => handleChange('projectManager', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Strategic Objective</label>
              <textarea
                rows={2}
                value={formData.objective}
                onChange={e => handleChange('objective', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-sm">Step 2 — Baseline Configuration</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Planned Finish Date *</label>
                <input
                  type="date"
                  value={formData.finishDate}
                  onChange={e => handleChange('finishDate', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-900">Auto-Calculated Duration:</span>
              <span className="font-mono font-bold text-indigo-700">
                {durationData.days} Calendar Days (~{durationData.months} Months)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Budget ($ USD) *</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={e => handleChange('budget', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Working Calendar</label>
                <select
                  value={formData.calendar}
                  onChange={e => handleChange('calendar', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Standard 6-Day Construction">Standard 6-Day Construction</option>
                  <option value="5-Day Standard Corporate">5-Day Standard Corporate</option>
                  <option value="7-Day Critical Path Continuous">7-Day Critical Path Continuous</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-sm">Step 3 — Risk Tolerance & Statistical Appetite</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Schedule Confidence</label>
                <select
                  value={formData.targetScheduleConfidence}
                  onChange={e => handleChange('targetScheduleConfidence', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                >
                  <option value={70}>P70 (Aggressive Commercial)</option>
                  <option value={80}>P80 (PMI Standard Benchmark)</option>
                  <option value={90}>P90 (Conservative Infrastructure)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Cost Confidence</label>
                <select
                  value={formData.targetCostConfidence}
                  onChange={e => handleChange('targetCostConfidence', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                >
                  <option value={70}>P70 (Aggressive)</option>
                  <option value={80}>P80 (Executive Standard)</option>
                  <option value={90}>P90 (High Buffer)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Acceptable Delay (Days)</label>
                <input
                  type="number"
                  value={formData.maxAcceptableDelay}
                  onChange={e => handleChange('maxAcceptableDelay', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Acceptable Cost Overrun ($)</label>
                <input
                  type="number"
                  value={formData.maxAcceptableCostOverrun}
                  onChange={e => handleChange('maxAcceptableCostOverrun', Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Risk Appetite Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('riskAppetite', level)}
                    className={`p-2.5 rounded-lg border font-semibold text-center transition-all ${
                      formData.riskAppetite === level
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {level} Appetite
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s - 1)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
            >
              Create Project & Initialize Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RiskRegisterView({ risks, setRisks, project, onNavigateModeling, onShowToast }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingRisk, setEditingRisk] = useState(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const filteredRisks = useMemo(() => {
    return risks.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === "all" || r.category === selectedCategory;
      const matchSev = selectedSeverity === "all" || r.severity === selectedSeverity;
      return matchSearch && matchCat && matchSev;
    });
  }, [risks, searchTerm, selectedCategory, selectedSeverity]);

  const handleOpenAdd = () => {
    setDrawerMode('add');
    setEditingRisk({
      id: `R${String(risks.length + 1).padStart(3, '0')}`,
      title: "",
      statement: "",
      category: "Technical",
      type: "Threat",
      owner: "Alex Morgan, PMP",
      status: "Open",
      probability: 0.40,
      severity: "Medium",
      criticalPath: false,
      readyForQuant: true,
      costImpactMin: 50000,
      costImpactMostLikely: 150000,
      costImpactMax: 350000,
      scheduleImpactDaysMin: 5,
      scheduleImpactDaysML: 15,
      scheduleImpactDaysMax: 30,
      distribution: "PERT",
      responseStrategy: "Mitigate",
      mitigationStrategy: "",
      mitigationCost: 25000
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (risk) => {
    setDrawerMode('edit');
    setEditingRisk(risk);
    setDrawerOpen(true);
  };

  const handleSaveRisk = (savedData) => {
    if (drawerMode === 'add') {
      setRisks([savedData, ...risks]);
      onShowToast(`Risk ${savedData.id} added successfully.`);
    } else {
      setRisks(risks.map(r => r.id === savedData.id ? savedData : r));
      onShowToast(`Risk ${savedData.id} updated.`);
    }
    setDrawerOpen(false);
  };

  const handleDeleteRisk = (id) => {
    setRisks(risks.filter(r => r.id !== id));
    onShowToast(`Removed risk ${id}.`);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Title", "Category", "Severity", "Probability", "Cost Min", "Cost ML", "Cost Max", "Critical Path"];
    const rows = filteredRisks.map(r => [
      r.id,
      `"${r.title}"`,
      r.category,
      r.severity,
      r.probability,
      r.costImpactMin,
      r.costImpactMostLikely,
      r.costImpactMax,
      r.criticalPath ? "Yes" : "No"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `RiskRegister_${project.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("Risk register exported to CSV.");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Risk Register</h1>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {project.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify, classify, and calibrate 3-point stochastic estimates for {project.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Risk</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Risks</span>
          <span className="text-xl font-bold font-mono text-slate-900">{risks.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Open Risks</span>
          <span className="text-xl font-bold font-mono text-amber-600">{risks.filter(r => r.status === 'Open').length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">High Priority</span>
          <span className="text-xl font-bold font-mono text-rose-600">{risks.filter(r => r.severity === 'High').length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Ready for Quant</span>
          <span className="text-xl font-bold font-mono text-emerald-600">{risks.filter(r => r.readyForQuant).length}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search risk ID or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Environmental">Environmental</option>
            <option value="Technical">Technical</option>
            <option value="Market">Market</option>
            <option value="Resource">Resource</option>
            <option value="Quality">Quality</option>
            <option value="Regulatory">Regulatory</option>
            <option value="Equipment">Equipment</option>
            <option value="Supply Chain">Supply Chain</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={onNavigateModeling}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg flex items-center gap-1 shrink-0"
          >
            <span>Proceed to Modeling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredRisks.length && filteredRisks.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedRows(filteredRisks.map(r => r.id));
                      else setSelectedRows([]);
                    }}
                  />
                </th>
                <th className="p-3">ID</th>
                <th className="p-3">Risk Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Probability</th>
                <th className="p-3">Cost 3-Point (Min / ML / Max)</th>
                <th className="p-3">Schedule Impact</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Critical Path</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRisks.map(risk => (
                <tr key={risk.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(risk.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRows([...selectedRows, risk.id]);
                        else setSelectedRows(selectedRows.filter(id => id !== risk.id));
                      }}
                    />
                  </td>
                  <td className="p-3 font-mono font-bold text-indigo-700">{risk.id}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-900 block">{risk.title}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{risk.statement}</span>
                  </td>
                  <td className="p-3 text-slate-600">{risk.category}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {Math.round(risk.probability * 100)}%
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700">
                    ${(risk.costImpactMin / 1000).toFixed(0)}k / ${(risk.costImpactMostLikely / 1000).toFixed(0)}k / ${(risk.costImpactMax / 1000).toFixed(0)}k
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    +{risk.scheduleImpactDaysML}d ({risk.scheduleImpactDaysMin}-{risk.scheduleImpactDaysMax}d)
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      risk.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      risk.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {risk.severity}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {risk.criticalPath ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Critical
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">&mdash;</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(risk)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                        title="Edit Risk"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRisk(risk.id)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                        title="Delete Risk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RiskDrawer
        isOpen={drawerOpen}
        mode={drawerMode}
        riskData={editingRisk || {}}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveRisk}
      />

      {csvModalOpen && (
        <CsvImportModal
          onClose={() => setCsvModalOpen(false)}
          onImport={(imported) => {
            setRisks([...imported, ...risks]);
            setCsvModalOpen(false);
            onShowToast(`Imported ${imported.length} risks from CSV template.`);
          }}
        />
      )}
    </div>
  );
}

function RiskModelingWorkspaceView({ risks, setRisks, project, onNavigateAnalysis, onShowToast }) {
  const [selectedRiskId, setSelectedRiskId] = useState("R001");
  const selectedRisk = useMemo(() => {
    return risks.find(r => r.id === selectedRiskId) || risks[0];
  }, [risks, selectedRiskId]);

  const handleUpdateSelected = (field, val) => {
    setRisks(risks.map(r => r.id === selectedRisk.id ? { ...r, [field]: val } : r));
  };

  const pdfData = useMemo(() => {
    const min = selectedRisk.costImpactMin || 100000;
    const ml = selectedRisk.costImpactMostLikely || 300000;
    const max = selectedRisk.costImpactMax || 700000;
    const points = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = min + (i / steps) * (max - min);
      let y = 0;
      if (selectedRisk.distribution === 'Uniform') {
        y = 1 / ((max - min) || 1);
      } else {
        if (x <= ml) {
          y = (2 * (x - min)) / (((max - min) * (ml - min)) || 1);
        } else {
          y = (2 * (max - x)) / (((max - min) * (max - ml)) || 1);
        }
      }
      points.push({ x: `$${(x / 1000).toFixed(0)}k`, density: Math.max(0, y * 100000) });
    }
    return points;
  }, [selectedRisk]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Risk Modeling Workspace</h1>
          <p className="text-xs text-slate-500">Transform qualitative risks into continuous probability and impact models.</p>
        </div>
        <button
          onClick={onNavigateAnalysis}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>Continue to Method Selection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Risk Catalog</span>
          <div className="space-y-1.5 overflow-y-auto max-h-[600px] pr-1">
            {risks.map(r => {
              const isSelected = r.id === selectedRiskId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRiskId(r.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                    isSelected ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-indigo-700">{r.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      r.readyForQuant ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {r.readyForQuant ? 'Calibrated' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 line-clamp-1">{r.title}</p>
                  <span className="text-[10px] text-slate-400">{r.category}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {selectedRisk.id}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedRisk.title}</h2>
              <p className="text-xs text-slate-500">{selectedRisk.statement}</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-900 bg-slate-100 px-2.5 py-1 rounded">
              P = {Math.round(selectedRisk.probability * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-[11px]">1. Occurrence Trigger</span>
              <div className="flex justify-between items-center text-slate-600">
                <span>Probability:</span>
                <span className="font-mono font-bold text-indigo-700">{Math.round(selectedRisk.probability * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={selectedRisk.probability}
                onChange={e => handleUpdateSelected('probability', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-[11px]">2. Distribution Kernel</span>
              <select
                value={selectedRisk.distribution}
                onChange={e => handleUpdateSelected('distribution', e.target.value)}
                className="w-full p-1.5 bg-white border border-slate-200 rounded font-semibold text-slate-800"
              >
                <option value="PERT">Beta-PERT</option>
                <option value="Triangular">Triangular</option>
                <option value="Uniform">Uniform</option>
                <option value="Normal">Normal</option>
              </select>
              <div className="text-[10px] text-slate-400">
                Weights modal value 4x in standard PERT
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 block">Conditional Cost Impact ($ USD)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Min ($)</label>
                <input
                  type="number"
                  value={selectedRisk.costImpactMin}
                  onChange={e => handleUpdateSelected('costImpactMin', Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-indigo-700 font-bold block mb-0.5">Most Likely ($)</label>
                <input
                  type="number"
                  value={selectedRisk.costImpactMostLikely}
                  onChange={e => handleUpdateSelected('costImpactMostLikely', Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-indigo-300 rounded font-mono text-indigo-900 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Max ($)</label>
                <input
                  type="number"
                  value={selectedRisk.costImpactMax}
                  onChange={e => handleUpdateSelected('costImpactMax', Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block">Illustrative Probability Density Function (PDF)</span>
            <div className="h-44 w-full bg-slate-50 p-2 rounded-xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pdfData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                  <XAxis dataKey="x" stroke="#94A3B8" fontSize={10} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip formatter={(val) => [`${val.toFixed(2)} density`, 'Likelihood']} />
                  <Area type="monotone" dataKey="density" stroke="#4F46E5" fill="#818CF8" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider block">Model Readiness</span>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Quant Status</span>
            <div className="text-2xl font-bold font-mono text-emerald-700">100% Ready</div>
            <p className="text-[11px] text-emerald-800">All 8 risks calibrated with valid 3-point bounds.</p>
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Min &le; ML &le; Max verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Critical path float mapped</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kernel distributions assigned</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onShowToast("Risk model saved to analysis session.")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors mb-2"
            >
              Save Calibration
            </button>
            <button
              onClick={onNavigateAnalysis}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Proceed to Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisMethodSelectionView({ project, risks, selectedMethod, onSelectMethod, onContinue, onBack }) {
  const methods = [
    {
      id: "montecarlo",
      title: "Monte Carlo Simulation",
      icon: Activity,
      question: "How likely is project success?",
      desc: "Forecast cumulative cost and schedule outcomes across 3,000+ stochastic iterations.",
      features: ["Probability of Success", "P50 / P80 / P90 Markers", "Histogram & S-Curve CDF", "Contingency Calculation"],
      badge: "Most Popular"
    },
    {
      id: "sensitivity",
      title: "Sensitivity Analysis",
      icon: BarChart3,
      question: "Which factor drives the most uncertainty?",
      desc: "Rank project threats and opportunities by their marginal variance contribution to budget and duration.",
      features: ["Tornado Diagram", "Driver Swing Ranking", "Correlation Analysis", "Pessimistic Swings"],
      badge: "Prioritization"
    },
    {
      id: "decisiontree",
      title: "Decision Tree Analysis",
      icon: GitBranch,
      question: "Which alternative should be evaluated?",
      desc: "Model engineering options, discrete chance events, and compute Expected Monetary Value (EMV).",
      features: ["Expected Monetary Value", "Chance Nodes", "Capital Payoffs", "Rollback Optimization"],
      badge: "Decision Theory"
    },
    {
      id: "influence",
      title: "Influence Diagram",
      icon: Network,
      question: "How are project risks connected?",
      desc: "Directed graph illustrating causal relationships between decisions, uncertainties, and final project value.",
      features: ["Decision Nodes", "Chance Nodes", "Causal Arrows", "DAG Validation"],
      badge: "Causal Graph"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Choose Your Analysis</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">What do you need to understand about your project?</p>
        </div>
        <button
          onClick={onBack}
          className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          Back to Modeling
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map(m => {
          const Icon = m.icon;
          const isSelected = selectedMethod === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              className={`p-5 rounded-xl border bg-white cursor-pointer transition-all shadow-xs space-y-4 ${
                isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {m.badge}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-600 block">{m.question}</span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">{m.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                {m.features.map(f => (
                  <div key={f} className="flex items-center space-x-1.5 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <button
          onClick={() => onContinue(selectedMethod)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          Continue to Configuration & Analysis
        </button>
      </div>
    </div>
  );
}

function AnalysisWorkspaceView({
  risks,
  project,
  activeEngine,
  setActiveEngine,
  onChangeMethod,
  onLaunchExecution,
  onShowToast
}) {
  const [iterations, setIterations] = useState(3000);
  const [objective, setObjective] = useState("Joint Cost & Schedule");
  const [seed, setSeed] = useState("0x4B92F");

  // Decision Tree builder interactive state
  const [treeNodes, setTreeNodes] = useState([
    { id: "D1", type: "decision", label: "Basement Shoring Method", capex: 0, x: 20, y: 120 },
    { id: "C1", type: "chance", label: "Option A: Jet Grouting Berms", capex: 450000, prob: 0.70, failCost: 600000, x: 260, y: 40 },
    { id: "C2", type: "chance", label: "Option B: Concrete D-Wall", capex: 850000, prob: 0.25, failCost: 350000, x: 260, y: 140 },
    { id: "C3", type: "chance", label: "Option C: Secant Piles", capex: 720000, prob: 0.45, failCost: 420000, x: 260, y: 240 }
  ]);

  // Influence diagram builder interactive state
  const [influenceNodes, setInfluenceNodes] = useState([
    { id: "N1", name: "Monsoon Storm Severity", type: "chance", state: "Continuous" },
    { id: "N2", name: "Pit Water Ingress", type: "chance", state: "Stochastic" },
    { id: "N3", name: "Shoring Method Choice", type: "decision", state: "Discrete (3)" },
    { id: "N4", name: "Substructure Completion Date", type: "value", state: "P80 Milestone" }
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in pb-12 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analysis Configuration Workspace</h1>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {project.code}
            </span>
          </div>
          <p className="text-slate-500">Configure parameters for {activeEngine.toUpperCase()} engine.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onChangeMethod}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg"
          >
            Switch Method
          </button>
          <button
            onClick={onLaunchExecution}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
          >
            Execute Run
          </button>
        </div>
      </div>

      {activeEngine === 'montecarlo' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">Iteration Sampling</span>
            <select
              value={iterations}
              onChange={e => setIterations(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value={1000}>1,000 Iterations (Fast Screening)</option>
              <option value={3000}>3,000 Iterations (PMI Standard)</option>
              <option value={10000}>10,000 Iterations (High Precision)</option>
              <option value={50000}>50,000 Iterations (Extreme Accuracy)</option>
            </select>
            <p className="text-slate-500 text-[11px]">Recommended for P80 contingency convergence.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">Analysis Objective</span>
            <select
              value={objective}
              onChange={e => setObjective(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="Joint Cost & Schedule">Joint Cost & Schedule Simulation</option>
              <option value="Cost Only">Cost Distribution Only ($)</option>
              <option value="Schedule Only">Schedule Critical Path Only (Days)</option>
            </select>
            <p className="text-slate-500 text-[11px]">Models dual time-cost trade-offs simultaneously.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">PRNG Random Seed</span>
            <input
              type="text"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
            />
            <p className="text-slate-500 text-[11px]">Allows exact reproducible statistical audits.</p>
          </div>
        </div>
      )}

      {activeEngine === 'decisiontree' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Interactive Decision Tree Canvas</h3>
              <p className="text-slate-500 text-[11px]">Model engineering alternatives and evaluate Expected Monetary Value (EMV).</p>
            </div>
            <button
              onClick={() => onShowToast("Added chance node to decision canvas.")}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-xs"
            >
              + Add Branch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {treeNodes.filter(n => n.type === 'chance').map(node => (
              <div key={node.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">{node.label}</span>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Capex:</span>
                  <span className="font-mono font-bold">{formatCurrency(node.capex)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Failure Prob:</span>
                  <span className="font-mono font-bold text-rose-600">{Math.round(node.prob * 100)}%</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>EMV Payoff:</span>
                  <span className="font-mono font-bold text-purple-700">{formatCurrency(node.capex + node.prob * node.failCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeEngine === 'influence' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Influence Diagram (Directed Acyclic Graph)</h3>
              <p className="text-slate-500 text-[11px]">Visual representation of causal links between decisions and project utility.</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              DAG Validated
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {influenceNodes.map(node => (
              <div key={node.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  node.type === 'decision' ? 'bg-blue-100 text-blue-800' :
                  node.type === 'chance' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {node.type} Node
                </span>
                <span className="font-semibold text-slate-800 block text-xs mt-1">{node.name}</span>
                <span className="text-[10px] text-slate-400 block">{node.state}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalysisExecutionView({ project, method, runId, onViewResults, onReturnToConfig, onBackToDashboard }) {
  const [status, setStatus] = useState('Running');
  const [progress, setProgress] = useState(15);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    let interval = null;
    if (status === 'Running') {
      interval = setInterval(() => {
        setElapsedSec(s => s + 1);
        setProgress(p => {
          if (p >= 100) {
            setStatus('Completed');
            return 100;
          }
          return p + 25;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in pb-12">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="font-mono text-indigo-700 font-bold">{runId}</span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Executing Monte Carlo Simulation</h2>
            <p className="text-slate-500">{project.name}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
            status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
            status === 'Running' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
            status === 'Failed' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
          }`}>
            {status}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-semibold text-slate-700">
            <span>Overall Simulation Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {[
            { name: "1. Input Validation", pctThreshold: 20 },
            { name: "2. Model Initialization", pctThreshold: 40 },
            { name: "3. Stochastic Iteration Run (3,000 samples)", pctThreshold: 70 },
            { name: "4. Statistical Aggregation (P10/P50/P80/P90)", pctThreshold: 90 },
            { name: "5. Result S-Curve & Histogram Generation", pctThreshold: 100 }
          ].map(stage => {
            const isDone = progress >= stage.pctThreshold;
            const isCurrent = progress < stage.pctThreshold && progress >= stage.pctThreshold - 25;
            return (
              <div key={stage.name} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className={isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'}>{stage.name}</span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <span className="text-[10px] text-slate-400">Queued</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onReturnToConfig}
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-semibold"
          >
            Cancel / Back
          </button>

          {status === 'Completed' ? (
            <button
              onClick={onViewResults}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm flex items-center gap-1.5"
            >
              <span>View Results & Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setProgress(100)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
            >
              Fast Forward Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuantitativeResultsDashboardView({
  project,
  runId = "RUN-9042",
  onNavigateBack,
  onNavigateWorkspace,
  onNavigateMitigationLab,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPercentile, setSelectedPercentile] = useState(80);
  const [activeScenario, setActiveScenario] = useState('unmitigated');

  const resultsData = useMemo(() => {
    const isMitigated = activeScenario === 'mitigated';

    return {
      runMetadata: {
        id: runId,
        analysisName: "Monte Carlo Comprehensive Project Risk Simulation",
        projectCode: project.code,
        projectName: project.name,
        method: "Monte Carlo Simulation (3,000 Iterations)",
        executedAt: "October 3, 2026, 10:24 AM",
        analyst: "Alex Morgan, PMP",
        status: "Converged (P80 Confirmed)"
      },
      kpis: {
        onTimeProb: isMitigated ? 58 : 34,
        withinBudgetProb: isMitigated ? 52 : 28,
        p50Date: isMitigated ? "Jan 28, 2029" : "Feb 18, 2029",
        p50DelayDays: isMitigated ? 24 : 45,
        p80Date: isMitigated ? "Mar 05, 2029" : "Apr 12, 2029",
        p80DelayDays: isMitigated ? 60 : 98,
        p80Cost: isMitigated ? 21050000 : 21840000,
        p80Buffer: isMitigated ? 1050000 : 1840000,
        baselineCost: 20000000,
        baselineDays: 730,
        baselineEndDate: "Jan 04, 2029"
      },
      costHistogram: [
        { bin: "$20.0M", costVal: 20000000, frequency: isMitigated ? 160 : 95, cumProb: 3 },
        { bin: "$20.4M", costVal: 20400000, frequency: isMitigated ? 480 : 310, cumProb: 14 },
        { bin: "$20.8M", costVal: 20800000, frequency: isMitigated ? 820 : 640, cumProb: 35 },
        { bin: "$21.2M", costVal: 21200000, frequency: isMitigated ? 710 : 810, cumProb: 62 },
        { bin: "$21.6M", costVal: 21600000, frequency: isMitigated ? 440 : 580, cumProb: 81 },
        { bin: "$22.0M", costVal: 22000000, frequency: isMitigated ? 230 : 340, cumProb: 92 },
        { bin: "$22.4M", costVal: 22400000, frequency: isMitigated ? 110 : 155, cumProb: 97 },
        { bin: "$22.8M", costVal: 22800000, frequency: isMitigated ? 40 : 60, cumProb: 99 },
        { bin: "$23.2M", costVal: 23200000, frequency: isMitigated ? 10 : 10, cumProb: 100 }
      ],
      scheduleHistogram: [
        { bin: "730d", days: 730, frequency: isMitigated ? 180 : 110, cumProb: 4 },
        { bin: "750d", days: 750, frequency: isMitigated ? 550 : 360, cumProb: 18 },
        { bin: "770d", days: 770, frequency: isMitigated ? 890 : 720, cumProb: 46 },
        { bin: "790d", days: 790, frequency: isMitigated ? 680 : 790, cumProb: 73 },
        { bin: "810d", days: 810, frequency: isMitigated ? 410 : 540, cumProb: 89 },
        { bin: "830d", days: 830, frequency: isMitigated ? 190 : 280, cumProb: 96 },
        { bin: "850d", days: 850, frequency: isMitigated ? 70 : 140, cumProb: 99 },
        { bin: "870d", days: 870, frequency: isMitigated ? 30 : 60, cumProb: 100 }
      ],
      tornadoDrivers: [
        { id: "R005", name: "Foundation Diaphragm Wall Rework", totalSwingCost: 1250000 },
        { id: "R001", name: "Heavy Rainfall & Monsoon Flooding", totalSwingCost: 770000 },
        { id: "R003", name: "Concrete Price Escalation", totalSwingCost: 650000 },
        { id: "R004", name: "Labor Shortage (Post-Tet Holiday)", totalSwingCost: 410000 },
        { id: "R006", name: "Permit Approval Delay", totalSwingCost: 360000 },
        { id: "R007", name: "Tower Crane Breakdown", totalSwingCost: 270000 }
      ]
    };
  }, [project, runId, activeScenario]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span className="hover:text-slate-800 cursor-pointer" onClick={onNavigateBack}>Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-slate-800 cursor-pointer" onClick={onNavigateWorkspace}>Analysis Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-indigo-700 font-bold">{resultsData.runMetadata.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Quantitative Results & Insights
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {resultsData.runMetadata.projectCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {resultsData.runMetadata.method} &bull; Generated: {resultsData.runMetadata.executedAt}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setActiveScenario('unmitigated')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                activeScenario === 'unmitigated'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current (Unmitigated)
            </button>
            <button
              onClick={() => setActiveScenario('mitigated')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                activeScenario === 'mitigated'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mitigated Strategy
            </button>
          </div>

          <button
            onClick={onNavigateMitigationLab}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open in Mitigation Lab</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">On-Time Probability</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600">
            {resultsData.kpis.onTimeProb}%
          </div>
          <p className="text-[11px] text-slate-500">Target: {resultsData.kpis.baselineEndDate}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">On-Budget Probability</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600">
            {resultsData.kpis.withinBudgetProb}%
          </div>
          <p className="text-[11px] text-slate-500">at $20.0M baseline</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">P50 Expected Date</span>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {resultsData.kpis.p50Date}
          </div>
          <p className="text-[11px] text-slate-500">+{resultsData.kpis.p50DelayDays} days variance</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">P80 Commit Milestone</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-indigo-950 truncate">
            {resultsData.kpis.p80Date}
          </div>
          <p className="text-[11px] text-purple-700 font-semibold">+{resultsData.kpis.p80DelayDays} days contingency</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold uppercase tracking-wider text-[10px]">P80 Cost Forecast</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            {formatCurrency(resultsData.kpis.p80Cost)}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold">
            Reserve: +{formatCurrency(resultsData.kpis.p80Buffer)}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex space-x-2 text-xs font-semibold overflow-x-auto pb-1">
          {[
            { id: 'overview', label: '1. Executive Overview', icon: Activity },
            { id: 'schedule', label: '2. Schedule Analysis (S-Curve)', icon: Clock },
            { id: 'cost', label: '3. Cost Distribution & CDF', icon: DollarSign },
            { id: 'sensitivity', label: '4. Sensitivity (Tornado)', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Quantitative Risk Findings & PMO Guidance</h3>
          <p className="text-slate-600 leading-relaxed">
            The baseline $20.0M budget holds only a <strong>{resultsData.kpis.withinBudgetProb}% likelihood</strong> of completion.
            To achieve an executive P80 confidence rating, the PMO must establish a dedicated contingency reserve of <strong>{formatCurrency(resultsData.kpis.p80Buffer)}</strong>,
            setting the authorized project spend limit at <strong>{formatCurrency(resultsData.kpis.p80Cost)}</strong>.
          </p>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Project Completion Schedule S-Curve</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resultsData.scheduleHistogram}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="bin" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} unit="%" />
                <Tooltip />
                <ReferenceLine y={selectedPercentile} stroke="#4F46E5" strokeDasharray="4 4" label={`P${selectedPercentile}`} />
                <Area type="monotone" dataKey="cumProb" stroke="#4F46E5" strokeWidth={2.5} fill="#4F46E5" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'cost' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Cost Cumulative Distribution Function (CDF)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resultsData.costHistogram}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="bin" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} unit="%" />
                <Tooltip />
                <ReferenceLine y={selectedPercentile} stroke="#10B981" strokeDasharray="4 4" label={`P${selectedPercentile}`} />
                <Area type="monotone" dataKey="cumProb" stroke="#10B981" strokeWidth={2.5} fill="#10B981" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'sensitivity' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Tornado Diagram & Uncertainty Drivers</h3>
          <div className="space-y-2 pt-2">
            {resultsData.tornadoDrivers.map(item => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-indigo-700">{item.id}</span> &bull; <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">+${(item.totalSwingCost / 1000).toFixed(0)}k Swing</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_SCENARIOS = [
  {
    id: "SCN-A",
    name: "Scenario A: Baseline (Unmitigated)",
    targetRiskId: "R002",
    targetRiskTitle: "Unexpected Underground Utilities & Excavation Delay",
    strategy: "Accept",
    responseCost: 0,
    probBefore: 0.40,
    probAfter: 0.40,
    costImpactBefore: 350000,
    costImpactAfter: 350000,
    scheduleImpactBefore: 25,
    scheduleImpactAfter: 25,
    owner: "Nguyen Van An (Site Director)",
    implDate: "2027-01-05",
    scheduleConfidenceP80: 48,
    costConfidenceP80: 55,
    expectedTotalCost: 21840000,
    residualRiskEMV: 140000,
    isPromoted: false,
    notes: "Default status-quo state with unhedged risk exposure."
  },
  {
    id: "SCN-B",
    name: "Scenario B: Additional Geotechnical Survey & GPR",
    targetRiskId: "R002",
    targetRiskTitle: "Unexpected Underground Utilities & Excavation Delay",
    strategy: "Mitigate",
    responseCost: 65000,
    probBefore: 0.40,
    probAfter: 0.15,
    costImpactBefore: 350000,
    costImpactAfter: 120000,
    scheduleImpactBefore: 25,
    scheduleImpactAfter: 8,
    owner: "Pham Minh (Lead Geotechnical)",
    implDate: "2026-12-15",
    scheduleConfidenceP80: 68,
    costConfidenceP80: 72,
    expectedTotalCost: 21320000,
    residualRiskEMV: 18000,
    isPromoted: false,
    notes: "Pre-auguring 3D radar scans eliminate 62.5% of utility strike uncertainty."
  },
  {
    id: "SCN-C",
    name: "Scenario C: Additional Schedule Buffer & Dual Shifts",
    targetRiskId: "R001",
    targetRiskTitle: "Heavy Rainfall & Monsoon Flooding",
    strategy: "Mitigate",
    responseCost: 110000,
    probBefore: 0.65,
    probAfter: 0.35,
    costImpactBefore: 420000,
    costImpactAfter: 220000,
    scheduleImpactBefore: 30,
    scheduleImpactAfter: 12,
    owner: "Tran Hoang (Operations)",
    implDate: "2027-02-01",
    scheduleConfidenceP80: 74,
    costConfidenceP80: 76,
    expectedTotalCost: 21180000,
    residualRiskEMV: 77000,
    isPromoted: false,
    notes: "Contractual weekend overtime allowance and backup dewatering equipment."
  },
  {
    id: "SCN-D",
    name: "Scenario D: Combined Mitigation Strategy",
    targetRiskId: "ALL",
    targetRiskTitle: "Portfolio Integrated Treatments (R001, R002, R003, R005)",
    strategy: "Mitigate",
    responseCost: 245000,
    probBefore: 0.50,
    probAfter: 0.20,
    costImpactBefore: 1250000,
    costImpactAfter: 380000,
    scheduleImpactBefore: 55,
    scheduleImpactAfter: 18,
    owner: "Alex Morgan, PMP",
    implDate: "2026-11-30",
    scheduleConfidenceP80: 84,
    costConfidenceP80: 86,
    expectedTotalCost: 20850000,
    residualRiskEMV: 76000,
    isPromoted: true,
    notes: "Comprehensive engineering shoring, advance concrete procurement hedge, and GPR."
  }
];

function RiskInsightsLabView({ project, risks, onNavigateResults, onNavigateReports, onShowToast }) {
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [selectedDriverId, setSelectedDriverId] = useState("R002");
  const [editingScenario, setEditingScenario] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");

  const selectedDriver = useMemo(() => {
    return risks.find(r => r.id === selectedDriverId) || risks[1] || risks[0];
  }, [risks, selectedDriverId]);

  const execMetrics = useMemo(() => {
    const targetScheduleP = project.scheduleConfidenceP80 || 80;
    const currentScheduleP = 48;
    const targetCost = project.budget || 20000000;
    const p80Cost = 21840000;
    const costExposure = p80Cost - targetCost;
    const gap = currentScheduleP - targetScheduleP;
    return {
      scheduleGap: gap,
      targetScheduleP,
      currentScheduleP,
      costExposure,
      costExposurePct: ((costExposure / targetCost) * 100).toFixed(1),
      topDriver: "R002 / R005 — Foundation Excavation Delay",
      topDriverSwing: "$1.25M",
      toleranceStatus: "Breached"
    };
  }, [project]);

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingScenario({
      id: `SCN-${String.fromCharCode(65 + scenarios.length)}`,
      name: `Scenario ${String.fromCharCode(65 + scenarios.length)}: Custom Treatment`,
      targetRiskId: selectedDriver.id,
      targetRiskTitle: selectedDriver.title,
      strategy: "Mitigate",
      responseCost: 50000,
      probBefore: selectedDriver.probability,
      probAfter: Math.max(0.1, Number((selectedDriver.probability * 0.5).toFixed(2))),
      costImpactBefore: selectedDriver.costImpactMostLikely,
      costImpactAfter: Math.round(selectedDriver.costImpactMostLikely * 0.4),
      scheduleImpactBefore: selectedDriver.scheduleImpactDaysML,
      scheduleImpactAfter: Math.round(selectedDriver.scheduleImpactDaysML * 0.4),
      owner: "Alex Morgan, PMP",
      implDate: "2027-01-15",
      scheduleConfidenceP80: 70,
      costConfidenceP80: 75,
      expectedTotalCost: 21250000,
      residualRiskEMV: 35000,
      isPromoted: false,
      notes: "Custom mitigation protocol entered by PMO."
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (scn) => {
    setModalMode("edit");
    setEditingScenario({ ...scn });
    setModalOpen(true);
  };

  const handleDuplicate = (scn) => {
    const newId = `SCN-${String.fromCharCode(65 + scenarios.length)}`;
    const duplicate = {
      ...scn,
      id: newId,
      name: `${scn.name} (Copy)`,
      isPromoted: false
    };
    setScenarios([...scenarios, duplicate]);
    onShowToast(`Duplicated scenario as ${newId}.`);
  };

  const handleDelete = (id) => {
    if (scenarios.length <= 1) {
      onShowToast("Cannot delete the only remaining scenario.");
      return;
    }
    setScenarios(scenarios.filter(s => s.id !== id));
    onShowToast(`Scenario ${id} deleted.`);
  };

  const handleSaveScenario = (saved) => {
    const residualEMV = Math.round(saved.probAfter * saved.costImpactAfter);
    const updated = {
      ...saved,
      residualRiskEMV: residualEMV
    };

    if (modalMode === "add") {
      setScenarios([...scenarios, updated]);
      onShowToast(`Scenario ${updated.id} created.`);
    } else {
      setScenarios(scenarios.map(s => s.id === updated.id ? updated : s));
      onShowToast(`Scenario ${updated.id} updated.`);
    }
    setModalOpen(false);
  };

  const handlePromoteScenario = (id) => {
    setScenarios(scenarios.map(s => ({
      ...s,
      isPromoted: s.id === id
    })));
    const target = scenarios.find(s => s.id === id);
    onShowToast(`Promoted "${target?.name}" as the active authorized baseline.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Risk Insights & Mitigation Lab
            </h1>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {project.code}
            </span>
          </div>
          <p className="text-slate-500 mt-1">
            Formulate targeted treatments, simulate probabilistic residual risk, and stress-test contingency reserves.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateResults}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-xs"
          >
            Back to Results
          </button>
          <button
            onClick={onNavigateReports}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Dossier</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scenario</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Section 1 — Executive Risk Diagnostic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Schedule Confidence Gap</span>
              <Clock className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-rose-600">{execMetrics.scheduleGap}%</span>
              <span className="text-[11px] text-slate-500 font-medium">({execMetrics.currentScheduleP}% vs {execMetrics.targetScheduleP}% target)</span>
            </div>
            <p className="text-[11px] text-slate-500">Substructure delays threaten the 24-month hard deadline.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Cost Exposure (P80)</span>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-slate-900">+{formatCurrency(execMetrics.costExposure)}</span>
              <span className="text-[11px] font-semibold text-amber-600">+{execMetrics.costExposurePct}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Contingency needed to achieve 80% budget certainty on $20.0M baseline.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Top Risk Driver</span>
              <AlertTriangle className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-base font-bold text-slate-900 truncate" title={execMetrics.topDriver}>
              {execMetrics.topDriver}
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {execMetrics.topDriverSwing} Swing
              </span>
              <span className="text-slate-500">34.2% total variance</span>
            </div>
          </div>

          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-rose-700">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Tolerance Status</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-700">
              {execMetrics.toleranceStatus}
            </div>
            <p className="text-[11px] text-rose-700/90 leading-tight">
              Unmitigated delay (+98d) exceeds project threshold of 45 days max delay.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 2 — Critical Risk Driver Profile
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-mono text-sm font-bold text-indigo-700">{selectedDriver.id}</span>
              <span className="text-sm font-bold text-slate-900">&mdash; {selectedDriver.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Select Driver:</span>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
            >
              <option value="R002">R002: Unexpected Underground Utilities</option>
              <option value="R005">R005: Foundation Diaphragm Wall Rework</option>
              <option value="R001">R001: Heavy Rainfall & Monsoon Flooding</option>
              <option value="R003">R003: Concrete Price Escalation</option>
              <option value="R004">R004: Labor Shortage (Post-Tet)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Uncertainty Parameters</span>
            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
              <span>Trigger Probability:</span>
              <span className="font-mono font-bold text-indigo-700">{Math.round(selectedDriver.probability * 100)}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
              <span>Cost Impact Range:</span>
              <span className="font-mono font-bold text-slate-900">
                ${(selectedDriver.costImpactMin / 1000).toFixed(0)}k &ndash; ${(selectedDriver.costImpactMax / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Sensitivity Contribution:</span>
              <span className="font-mono font-bold text-rose-600">34.2% Variance</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Critical Path Linkage</span>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-semibold text-indigo-900">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>Causal Domino Pathway:</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Zero float on Activity 104; any day lost augering pushes superstructure commencement day-for-day.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Model Governance</span>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Distribution Kernel:</span>
                <span className="font-semibold text-slate-800">Beta-PERT (Weight = 4x modal)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Risk Accountable Owner:</span>
                <span className="font-semibold text-slate-800">{selectedDriver.owner || "Nguyen Van An"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 3 — Mitigation Scenario Workspace
            </h2>
            <p className="text-slate-600 mt-0.5">
              Formulate response plans, calibrate cost-benefit trade-offs, and quantify probability reduction.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Scenario</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map(scn => (
            <div
              key={scn.id}
              className={`p-4 rounded-xl border transition-all ${
                scn.isPromoted
                  ? 'border-emerald-400 bg-emerald-50/20 ring-1 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      {scn.id}
                    </span>
                    {scn.isPromoted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Active Baseline</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      Strategy: {scn.strategy}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{scn.name}</h3>
                  <p className="text-[11px] text-slate-500">Target: {scn.targetRiskTitle}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Response Cost</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(scn.responseCost)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-50 rounded-lg text-slate-700 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Probability Shift</span>
                  <span className="font-mono font-bold text-rose-600 line-through mr-1">
                    {Math.round(scn.probBefore * 100)}%
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    &rarr; {Math.round(scn.probAfter * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cost Impact (ML)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(scn.costImpactAfter)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Residual EMV</span>
                  <span className="font-mono font-bold text-purple-700">
                    {formatCurrency(scn.residualRiskEMV)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic mb-3">"{scn.notes}"</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">Owner: {scn.owner}</span>
                <div className="flex items-center space-x-1.5">
                  {!scn.isPromoted && (
                    <button
                      onClick={() => handlePromoteScenario(scn.id)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[11px]"
                    >
                      Promote
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(scn)}
                    className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                    title="Edit Scenario"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(scn)}
                    className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    title="Duplicate Scenario"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(scn.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                    title="Delete Scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 4 — Multi-Scenario Comparison & Contingency Synthesis
            </h2>
            <p className="text-slate-600 mt-0.5">
              Evaluate expected capital cost vs residual exposure across calibrated response strategies.
            </p>
          </div>
        </div>

        <div className="h-64 w-full bg-slate-50 p-3 rounded-xl border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scenarios.map(s => ({
                name: s.id,
                fullName: s.name,
                costMillions: Number((s.expectedTotalCost / 1000000).toFixed(2)),
                scheduleP80: s.scheduleConfidenceP80,
                investmentThousands: Number((s.responseCost / 1000).toFixed(0))
              }))}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis yAxisId="left" stroke="#4F46E5" fontSize={10} domain={[19, 23]} unit="M" />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} domain={[0, 100]} unit="%" />
              <Tooltip
                formatter={(val, name) => {
                  if (name === "Total Cost ($M)") return [`$${val}M`, name];
                  if (name === "P80 Schedule (%)") return [`${val}%`, name];
                  return [val, name];
                }}
              />
              <Bar yAxisId="left" dataKey="costMillions" name="Total Cost ($M)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="scheduleP80" name="P80 Schedule (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {modalOpen && editingScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-indigo-700 font-bold">{editingScenario.id}</span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {modalMode === 'add' ? 'Create Mitigation Scenario' : 'Edit Scenario Parameters'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scenario Name *</label>
                <input
                  type="text"
                  value={editingScenario.name}
                  onChange={e => setEditingScenario({ ...editingScenario, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Response Strategy</label>
                  <select
                    value={editingScenario.strategy}
                    onChange={e => setEditingScenario({ ...editingScenario, strategy: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Mitigate">Mitigate</option>
                    <option value="Avoid">Avoid</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Accept">Accept</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Response Cost ($)</label>
                  <input
                    type="number"
                    value={editingScenario.responseCost}
                    onChange={e => setEditingScenario({ ...editingScenario, responseCost: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Residual Cost Impact ($)</label>
                  <input
                    type="number"
                    value={editingScenario.costImpactAfter}
                    onChange={e => setEditingScenario({ ...editingScenario, costImpactAfter: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Residual Schedule Impact (Days)</label>
                  <input
                    type="number"
                    value={editingScenario.scheduleImpactAfter}
                    onChange={e => setEditingScenario({ ...editingScenario, scheduleImpactAfter: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveScenario(editingScenario)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
              >
                Save Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_ANALYSIS_HISTORY = [
  {
    id: "RUN-9042",
    method: "Monte Carlo Simulation",
    version: "v2.4-calibrated",
    runDate: "Oct 3, 2026, 10:24 AM",
    iterations: "3,000",
    status: "Completed",
    createdBy: "Alex Morgan, PMP",
    keyOutcome: "P80 Target: $21.84M (+98 days)",
    seed: "0x4B92F",
    archived: false,
    p80Cost: 21840000,
    p80Days: 828,
    onTimeProb: 34,
    onBudgetProb: 28,
    notes: "Calibrated 3-point estimates with 4 critical path risks. Seed locked for PMO compliance."
  },
  {
    id: "RUN-9038",
    method: "Sensitivity Analysis (Tornado)",
    version: "v2.3-baseline",
    runDate: "Oct 2, 2026, 4:15 PM",
    iterations: "Ranked",
    status: "Completed",
    createdBy: "Alex Morgan, PMP",
    keyOutcome: "Driver #1: Foundation D-Wall Rework",
    seed: "Deterministic",
    archived: false,
    p80Cost: 21650000,
    p80Days: 812,
    onTimeProb: 38,
    onBudgetProb: 33,
    notes: "Evaluated 6 main threats; D-Wall rework accounts for 34.2% of total project swing."
  }
];

const LEARNING_MODULES = [
  {
    id: "monte-carlo",
    title: "Monte Carlo Simulation",
    icon: Activity,
    question: "How likely is project success?",
    tag: "Probabilistic Forecasting",
    definition: "A mathematical computational algorithm that relies on repeated random sampling (typically 1,000 to 50,000 iterations) from probability distributions (PERT, Triangular, Normal) to model the probability distribution of combined project schedule duration and final budget cost.",
    whenToUse: "Mandatory on major capital developments ($5M+), complex multi-path CPM network schedules, high-uncertainty contracts, or when project sponsors demand executive P80/P90 budget certainty rather than single-point estimates.",
    requiredInputs: [
      "Critical Path Network Schedule (CPM activities and logic ties)",
      "Calibrated 3-point stochastic estimates (Optimistic a, Most Likely m, Pessimistic b)",
      "Occurrence probabilities (Bernoulli trigger rates) for discrete risk events",
      "Correlation assumptions between interrelated cost items or schedule activities"
    ],
    example: "On the 30-Story Commercial Office Tower in Ho Chi Minh City, 3,000 iterations revealed that while the contractual baseline is $20.0M at 730 days, there is only a 28% likelihood of finishing within budget. To achieve executive P80 confidence, an authorized budget of $21.84M (+98 days) must be committed.",
    interpretation: "The resulting Cumulative Distribution Function (S-Curve) displays the exact probability of achieving any given milestone. The distance between the deterministic baseline and the P80 percentile defines the required contingency reserve.",
    pmpRelevance: "PMBOK® Guide 7th Edition & PMI-RMP® Examination Content Outline (Domain 3: Risk Analysis). Crucial test topic: Monte Carlo calculates total project likelihood (joint distribution), whereas the 3-point PERT formula calculates expected duration for a single activity only.",
    misconception: "Common Myth: 'Monte Carlo predicts the exact future date the building will open.' Reality: It does not predict certainty; it models the statistical likelihood of variance so leadership can fund appropriate contingencies."
  },
  {
    id: "sensitivity",
    title: "Sensitivity Analysis (Tornado Diagram)",
    icon: BarChart3,
    question: "Which risk drives the greatest variation?",
    tag: "Variance Ranking",
    definition: "A quantitative technique that systematically perturbs individual risk factors across their extreme ranges while holding all other variables at baseline values, plotting the resulting outcome swings in descending order of impact.",
    whenToUse: "During quantitative prioritization to isolate which uncertainties deserve the lion's share of risk response capital and executive attention; prevents wasting mitigation budgets on low-impact risks.",
    requiredInputs: [
      "Identified risks with quantified upper (pessimistic) and lower (optimistic) bounds",
      "Defined project target metric (Total Project Cost $ or Milestone Finish Date in Days)",
      "Sensitivity calculation model (one-at-a-time variation or Spearman rank correlation)"
    ],
    example: "Testing the 8 construction threats for the HCMC Tower generated a Tornado chart showing Foundation Diaphragm Wall rework creates a $1,250,000 swing (-$250k to +$1.0M), followed by Monsoon Flooding ($770k swing). Tower Crane breakdown swings only $270k, justifying deprioritization.",
    interpretation: "The widest bars at the top of the tornado represent the 'vital few' uncertainty drivers. Risk response actions targeted at the top 2–3 drivers yield the greatest reduction in overall project variance.",
    pmpRelevance: "PMI-RMP® standard exam question format. Tornado charts display variables horizontally sorted from widest impact at the top to narrowest at the bottom, directly facilitating Pareto 80/20 prioritization.",
    misconception: "Common Myth: 'Tornado diagrams account for compounding risks happening together.' Reality: Standard sensitivity diagrams vary one input at a time (ceteris paribus). Compounding multi-risk collisions require Monte Carlo simulation."
  },
  {
    id: "decision-tree",
    title: "Decision Tree Analysis (EMV)",
    icon: GitBranch,
    question: "Which alternative has the highest expected value?",
    tag: "Sequential Decision Theory",
    definition: "A chronological decision-flow diagram containing decision nodes (squares), chance nodes (circles), and payoff outcomes (triangles), solved using backward induction (rollback analysis) to compute Expected Monetary Value (EMV).",
    whenToUse: "Selecting between competing construction methodologies, procurement contract structures, design alternatives, or make-versus-buy capital investments under uncertain future states.",
    requiredInputs: [
      "Mutually exclusive decision choices with direct capital expenditures (Capex)",
      "Discrete chance events with mutually exhaustive probabilities (summing to 1.0 / 100%)",
      "Financial payoffs or cost impacts associated with each potential branch outcome"
    ],
    example: "For riverbank basement excavation shoring: Option A (Jet Grouting) costs $450k with 70% hydraulic failure risk (+$600k fix) = EMV $870k. Option B (Concrete D-Wall) costs $850k with 25% defect risk (+$350k remediation) = EMV $937.5k. When factoring secondary superstructure delays, Option B offers superior risk-adjusted protection.",
    interpretation: "Multiply probability by impact for each chance branch, add initial investment costs, and rollback to the decision node. The branch with the optimal risk-adjusted monetary payoff is chosen; inferior branches are pruned.",
    pmpRelevance: "Guaranteed PMP® calculation formula: EMV = Probability × Impact. Frequently combined with decision trees where project managers must calculate the net financial outcome of a build vs. lease decision.",
    misconception: "Common Myth: 'The EMV is the exact amount the project will spend.' Reality: EMV is a statistical weighted average. The actual financial cost will be one of the discrete terminal branches, never the average itself."
  },
  {
    id: "influence-diagram",
    title: "Influence Diagram",
    icon: Network,
    question: "How are project uncertainties connected?",
    tag: "Causal Graph Modeling",
    definition: "A compact directed acyclic graph (DAG) showing the structural dependencies between decision nodes (rectangles), chance uncertainties (ovals), and value/utility outcomes (diamonds).",
    whenToUse: "In early project conceptualization and risk workshops to visually map how complex multi-tier risks trigger secondary impacts before committing to detailed mathematical simulations.",
    requiredInputs: [
      "Decisions under the project manager's direct control",
      "External stochastic uncertainties and their conditioning links",
      "Directional arrows representing informational or probabilistic influence",
      "Final objective node (Net Present Value, Schedule Variance, Total Cost)"
    ],
    example: "Mapping the HCMC Tower showed: Monsoon Season (Chance) directly influences Pit Water Ingress (Chance), which influences Slurry Wall Trenching Quality (Chance), which combined with Shoring Type Selection (Decision) determines Foundation Completion Float (Value).",
    interpretation: "An arrow from Node A to Node B indicates that knowledge of A changes the probability distribution of B. The absence of an arrow signifies conditional independence, preventing false correlation assumptions.",
    pmpRelevance: "PMBOK® Guide & PMI-RMP® Practice Standard for Project Risk Management. Serves as the graphical foundation for Bayesian belief networks and system dynamics risk modeling.",
    misconception: "Common Myth: 'Arrows in an influence diagram represent project schedule timeline arrows (finish-to-start logic).' Reality: Arrows represent causal or informational influence, not chronological calendar precedence."
  }
];

function ReportsAndLearningWorkspaceView({
  project,
  risks,
  initialTab = "history",
  onNavigateResults,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [historyRuns, setHistoryRuns] = useState(INITIAL_ANALYSIS_HISTORY);
  const [activeLearningId, setActiveLearningId] = useState("monte-carlo");

  const [reportConfig, setReportConfig] = useState({
    includeExecutiveSummary: true,
    includeProjectInfo: true,
    includeRiskRegister: true,
    includeStatisticalResults: true,
    reportTitle: `Project Risk Intelligence Dossier — ${project.name}`,
    preparedFor: "Capital Projects Executive Committee & PMO"
  });

  const activeLearningModule = useMemo(() => {
    return LEARNING_MODULES.find(m => m.id === activeLearningId) || LEARNING_MODULES[0];
  }, [activeLearningId]);

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadCsvReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["RiskFlow Project Intelligence Dossier"],
        ["Project", `"${project.name}"`],
        ["Code", project.code],
        ["Budget Baseline", project.budget],
        ["Target P80 Cost", "$21,840,000 USD"],
        [],
        ["Risk ID", "Title", "Category", "Probability", "Cost ML ($)", "Schedule ML (d)"],
        ...risks.map(r => [
          r.id,
          `"${r.title}"`,
          r.category,
          r.probability,
          r.costImpactMostLikely,
          r.scheduleImpactDaysML
        ])
      ]
        .map(e => e.join(","))
        .join("\n");

    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `RiskFlow_Dossier_${project.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("Executive Dossier exported to CSV.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Reports, Audit Trail & Learning Hub
            </h1>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {project.code}
            </span>
          </div>
          <p className="text-slate-500 mt-1">
            Access immutable analysis execution logs, configure board-ready executive dossiers, and master quantitative risk theory.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "history" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analysis History ({historyRuns.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "builder" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Builder</span>
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "learning" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Center (PMP)</span>
          </button>
        </div>
      </div>

      {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in">
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Dossier Builder Controls</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportConfig.reportTitle}
                  onChange={e => setReportConfig({ ...reportConfig, reportTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={reportConfig.preparedFor}
                  onChange={e => setReportConfig({ ...reportConfig, preparedFor: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrintReport}
                  className="flex items-center justify-center space-x-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={handleDownloadCsvReport}
                  className="flex items-center justify-center space-x-1.5 p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-slate-800">
            <div className="border-b-2 border-indigo-600 pb-4 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 block">
                  RiskFlow Enterprise Intelligence &bull; Dossier
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{reportConfig.reportTitle}</h2>
                <p className="text-slate-500 text-[11px]">
                  Project Code: <span className="font-mono font-bold text-indigo-700">{project.code}</span>
                </p>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                CONFIDENTIAL
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-indigo-900 border-b border-slate-100 pb-1">
                1. Executive Summary & Contingency Mandate
              </h4>
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Time Probability</span>
                  <span className="font-mono text-base font-bold text-rose-600">34%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Budget Likelihood</span>
                  <span className="font-mono text-base font-bold text-rose-600">28%</span>
                </div>
                <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                  <span className="text-[10px] text-indigo-800 uppercase font-bold block">P80 Budget Target</span>
                  <span className="font-mono text-base font-bold text-indigo-700">$21.84M</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Contingency Buffer</span>
                  <span className="font-mono text-base font-bold text-emerald-700">+$1.84M (+9.2%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "learning" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in">
          <div className="lg:col-span-4 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
              Quantitative Methodology Syllabus
            </span>

            {LEARNING_MODULES.map(mod => {
              const Icon = mod.icon;
              const isSelected = mod.id === activeLearningId;
              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveLearningId(mod.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs">{mod.title}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 block pl-8">{mod.question}</span>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">{activeLearningModule.title}</h2>
              <p className="text-xs font-semibold text-indigo-600">Core Inquiry: "{activeLearningModule.question}"</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Formal Definition</span>
              <p className="text-slate-600 leading-relaxed text-xs">{activeLearningModule.definition}</p>
            </div>

            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 space-y-1.5">
              <span className="font-bold text-indigo-950 block text-[11px] uppercase tracking-wider">
                Concrete Application — 30-Story HCMC Office Tower
              </span>
              <p className="text-slate-700 text-xs leading-relaxed">{activeLearningModule.example}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Run ID</th>
                <th className="p-3">Analysis Method</th>
                <th className="p-3">Run Date</th>
                <th className="p-3">Iterations</th>
                <th className="p-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRuns.map(run => (
                <tr key={run.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-700">{run.id}</td>
                  <td className="p-3 font-medium text-slate-900">{run.method}</td>
                  <td className="p-3 text-slate-600">{run.runDate}</td>
                  <td className="p-3 font-mono">{run.iterations}</td>
                  <td className="p-3 font-mono text-slate-700">{run.keyOutcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RiskDrawer({ isOpen, mode, riskData, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...riskData });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFormData({ ...riskData });
    setErrorMsg("");
  }, [riskData]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setErrorMsg("Risk title is required.");
      return;
    }
    setErrorMsg("");
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              {formData.id}
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              {mode === 'add' ? 'Add New Project Risk' : 'Edit Risk Parameters'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Risk Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Category</label>
            <select
              value={formData.category || 'Technical'}
              onChange={e => handleChange('category', e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Environmental">Environmental</option>
              <option value="Technical">Technical</option>
              <option value="Market">Market</option>
              <option value="Resource">Resource</option>
              <option value="Quality">Quality</option>
              <option value="Regulatory">Regulatory</option>
              <option value="Equipment">Equipment</option>
              <option value="Supply Chain">Supply Chain</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Probability ({Math.round((formData.probability || 0.4) * 100)}%)</label>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={formData.probability || 0.4}
                onChange={e => handleChange('probability', parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Distribution Type</label>
              <select
                value={formData.distribution || 'PERT'}
                onChange={e => handleChange('distribution', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="PERT">Beta-PERT</option>
                <option value="Triangular">Triangular</option>
                <option value="Uniform">Uniform</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 block text-[11px]">Cost 3-Point Impact ($)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">Min</label>
                <input
                  type="number"
                  value={formData.costImpactMin || 0}
                  onChange={e => handleChange('costImpactMin', Number(e.target.value))}
                  className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-indigo-700 font-bold block">Most Likely</label>
                <input
                  type="number"
                  value={formData.costImpactMostLikely || 0}
                  onChange={e => handleChange('costImpactMostLikely', Number(e.target.value))}
                  className="w-full p-1 bg-white border border-indigo-300 rounded font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Max</label>
                <input
                  type="number"
                  value={formData.costImpactMax || 0}
                  onChange={e => handleChange('costImpactMax', Number(e.target.value))}
                  className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-semibold">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Save Risk
          </button>
        </div>
      </div>
    </div>
  );
}

function CsvImportModal({ onClose, onImport }) {
  const sampleImport = [
    {
      id: "R009",
      title: "Geotechnical Karst Void Encounter",
      statement: "Subsurface caverns encountered below bedrock elevation requiring pressure grouting.",
      category: "Technical",
      type: "Threat",
      phase: "Foundation",
      severity: "High",
      probability: 0.35,
      costImpactMin: 200000,
      costImpactMostLikely: 450000,
      costImpactMax: 900000,
      scheduleImpactDaysMin: 15,
      scheduleImpactDaysML: 30,
      scheduleImpactDaysMax: 60,
      distribution: "PERT",
      responseStrategy: "Mitigate",
      mitigationStrategy: "Micro-gravity geophysical survey & contingency grouting rig",
      mitigationCost: 65000,
      owner: "Geotechnical Lead",
      status: "Open",
      criticalPath: true,
      readyForQuant: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-slate-900 text-sm">Import Risk Register CSV</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-slate-500">
          Upload a structured CSV file with 3-point estimates to bulk import threats into the register.
        </p>
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
          <Upload className="w-8 h-8 text-slate-400 mx-auto" />
          <span className="font-semibold text-slate-700 block">Click or Drag CSV here</span>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onImport(sampleImport)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
          >
            Import Sample Data
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs animate-in fade-in">
      <h2 className="text-base font-bold text-slate-900">Quantitative Engine Settings</h2>
      <p className="text-slate-500">Default parameters for client-side stochastic Monte Carlo runs.</p>

      <div className="space-y-3 pt-2">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Default Iteration Sample Count</label>
          <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold">
            <option>3,000 Iterations (Recommended for browser stability)</option>
            <option>5,000 Iterations</option>
            <option>10,000 Iterations (High Precision)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ProjectsListView({ projects, currentProjectId, onSelectProject, onOpenNewProject, onLaunchAnalysis }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Active Projects</h1>
          <p className="text-xs text-slate-500">Manage project baselines, risk tolerances, and analysis configurations.</p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => {
          const isSelected = proj.id === currentProjectId;
          return (
            <div
              key={proj.id}
              className={`bg-white rounded-xl border p-5 space-y-4 transition-all shadow-xs ${
                isSelected ? 'border-indigo-600 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {proj.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{proj.name}</h3>
                  <p className="text-[11px] text-slate-500">{proj.location}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Budget:</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(proj.budget)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target P80 Schedule:</span>
                  <span className="font-mono font-bold text-emerald-700">{proj.scheduleConfidenceP80}% Confidence</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectProject(proj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isSelected ? 'bg-slate-100 text-slate-800' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {isSelected ? 'Selected Workspace' : 'Select Project'}
                </button>
                <button
                  onClick={onLaunchAnalysis}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Run Analysis
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projectsList, setProjectsList] = useState(PORTFOLIO_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("PRJ-2027-VN01");
  const [risks, setRisks] = useState(INITIAL_RISKS);
  const [draftToastMessage, setDraftToastMessage] = useState(null);
  const [selectedAnalysisMethod, setSelectedAnalysisMethod] = useState('montecarlo');
  const [activeRunId, setActiveRunId] = useState("RUN-9042");
  const [dashboardState, setDashboardState] = useState('normal');
  const [kpiFilter, setKpiFilter] = useState(null);

  const currentProject = useMemo(() => {
    return projectsList.find(p => p.id === activeProjectId) || projectsList[0];
  }, [projectsList, activeProjectId]);

  const showToast = (msg) => {
    setDraftToastMessage(msg);
    setTimeout(() => setDraftToastMessage(null), 3500);
  };

  const handleCreateProject = (newProj) => {
    const projectWithId = {
      ...newProj,
      id: `PRJ-2027-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      openRisksCount: 0,
      highRisksCount: 0,
      scheduleConfidenceP80: newProj.targetScheduleConfidence || 80,
      budgetConfidenceP80: newProj.targetCostConfidence || 80,
      progressPct: 0,
      healthStatus: "On Track",
      lastAnalysis: "Just now",
      pmoLead: newProj.projectManager || "Alex Morgan, PMP"
    };
    setProjectsList([projectWithId, ...projectsList]);
    setActiveProjectId(projectWithId.id);
    setActiveNav('risk-register');
    showToast(`Project "${newProj.name}" created! Navigated to Risk Register.`);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[248px]'
        } hidden md:flex shrink-0`}
      >
        <div>
          <div className="h-16 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => setActiveNav('dashboard')}>
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200 shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-bold text-base text-[#0F172A] tracking-tight">RiskFlow</span>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Project Intelligence</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
            </button>
          </div>

          <div className="py-4 px-2.5 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
              { id: 'projects', label: 'Projects', icon: Briefcase, badge: projectsList.length },
              { id: 'risk-register', label: 'Risk Register', icon: FileSpreadsheet, badge: risks.length },
              { id: 'risk-modeling', label: 'Risk Modeling', icon: Layers, badge: `${risks.filter(r => r.readyForQuant).length}/${risks.length}` },
              { id: 'analysis-select', label: 'Choose Analysis', icon: Sliders, badge: '4 Methods' },
              { id: 'analysis-workspace', label: 'Analysis Workspace', icon: Play, badge: null },
              { id: 'results', label: 'Results & Insights', icon: TrendingUp, badge: 'P80' },
              { id: 'insights', label: 'Mitigation Lab', icon: Sparkles, badge: 'Scenarios' },
              { id: 'reports', label: 'Reports & Audits', icon: FileText, badge: 'Dossier' },
              { id: 'learning', label: 'Learning Center', icon: BookOpen, badge: 'PMP' },
              { id: 'settings', label: 'Settings', icon: Settings, badge: null }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                  } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-[#64748B]'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-[#E2E8F0]">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-2 rounded-lg bg-slate-50 border border-slate-100`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              AM
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#0F172A] truncate">Alex Morgan</p>
                <p className="text-[10px] font-medium text-[#64748B] truncate">Lead Risk Analyst &bull; PMO</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-[#64748B] truncate">
            <span className="font-medium hover:text-slate-900 cursor-pointer" onClick={() => setActiveNav('dashboard')}>
              RiskFlow
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold text-xs rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-none"
            >
              {projectsList.map(p => (
                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveNav('projects-new')}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        {draftToastMessage && (
          <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{draftToastMessage}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {activeNav === 'dashboard' && (
            <DashboardScreen
              state={dashboardState}
              setState={setDashboardState}
              projects={projectsList}
              currentProject={currentProject}
              onSelectProject={(id) => { setActiveProjectId(id); setActiveNav('projects'); }}
              risks={risks}
              analyses={RECENT_ANALYSES}
              onOpenNewProject={() => setActiveNav('projects-new')}
              onNavigate={setActiveNav}
              kpiFilter={kpiFilter}
              setKpiFilter={setKpiFilter}
              onOpenRunResult={(run) => {
                setActiveRunId(run.id);
                setActiveNav('results');
              }}
            />
          )}

          {activeNav === 'projects-new' && (
            <ProjectCreationWizard
              onCancel={() => setActiveNav('dashboard')}
              onCreateProject={handleCreateProject}
              onSaveDraft={(draft) => showToast("Project draft saved.")}
            />
          )}

          {activeNav === 'projects' && (
            <ProjectsListView
              projects={projectsList}
              currentProjectId={activeProjectId}
              onSelectProject={(id) => setActiveProjectId(id)}
              onOpenNewProject={() => setActiveNav('projects-new')}
              onLaunchAnalysis={() => setActiveNav('analysis-select')}
            />
          )}

          {activeNav === 'risk-register' && (
            <RiskRegisterView
              risks={risks}
              setRisks={setRisks}
              project={currentProject}
              onNavigateModeling={() => setActiveNav('risk-modeling')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'risk-modeling' && (
            <RiskModelingWorkspaceView
              risks={risks}
              setRisks={setRisks}
              project={currentProject}
              onNavigateAnalysis={() => setActiveNav('analysis-select')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'analysis-select' && (
            <AnalysisMethodSelectionView
              project={currentProject}
              risks={risks}
              selectedMethod={selectedAnalysisMethod}
              onSelectMethod={(methodId) => setSelectedAnalysisMethod(methodId)}
              onContinue={(methodId) => {
                setSelectedAnalysisMethod(methodId);
                setActiveNav('analysis-workspace');
              }}
              onBack={() => setActiveNav('risk-modeling')}
            />
          )}

          {activeNav === 'analysis-workspace' && (
            <AnalysisWorkspaceView
              risks={risks}
              project={currentProject}
              activeEngine={selectedAnalysisMethod}
              setActiveEngine={setSelectedAnalysisMethod}
              onChangeMethod={() => setActiveNav('analysis-select')}
              onLaunchExecution={() => {
                setActiveRunId(`RUN-${Math.floor(Math.random() * 800) + 8900}`);
                setActiveNav('analysis-execution');
              }}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'analysis-execution' && (
            <AnalysisExecutionView
              project={currentProject}
              method={selectedAnalysisMethod}
              runId={activeRunId}
              onViewResults={() => setActiveNav('results')}
              onReturnToConfig={() => setActiveNav('analysis-workspace')}
              onBackToDashboard={() => setActiveNav('dashboard')}
            />
          )}

          {activeNav === 'results' && (
            <QuantitativeResultsDashboardView
              project={currentProject}
              runId={activeRunId}
              onNavigateBack={() => setActiveNav('dashboard')}
              onNavigateWorkspace={() => setActiveNav('analysis-workspace')}
              onNavigateMitigationLab={() => setActiveNav('insights')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'insights' && (
            <RiskInsightsLabView
              project={currentProject}
              risks={risks}
              onNavigateResults={() => setActiveNav('results')}
              onNavigateReports={() => setActiveNav('reports')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'reports' && (
            <ReportsAndLearningWorkspaceView
              project={currentProject}
              risks={risks}
              initialTab="builder"
              onNavigateResults={() => setActiveNav('results')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'learning' && (
            <ReportsAndLearningWorkspaceView
              project={currentProject}
              risks={risks}
              initialTab="learning"
              onNavigateResults={() => setActiveNav('results')}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}