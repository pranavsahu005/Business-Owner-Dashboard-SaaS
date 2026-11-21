import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import DownloadReportMenu from './DownloadReportMenu';
import CalendarWorkspace from './CalendarWorkspace';
import NotesWorkspace from './NotesWorkspace';
import { computeFilteredAnalytics } from '../utils/analyticsData';
import { 
  Search, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Lock, 
  Clock, 
  Phone, 
  MapPin, 
  Activity, 
  FileText, 
  AlertCircle, 
  Heart, 
  Smile, 
  Send, 
  DollarSign,
  UserPlus,
  Video,
  Eye,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Type,
  Folder,
  Download,
  Trash2,
  UploadCloud,
  ShieldCheck,
  User,
  Briefcase,
  Shield,
  LockKeyhole,
  Globe,
  Languages,
  FileEdit,
  Coins,
  Award,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Moon,
  Sun,
  Palette,
  Printer,
  Copy,
  Receipt
} from 'lucide-react';

export default function MainDashboard() {
  const { 
    activeTab, 
    patientBills, 
    waitingBills, 
    latestTransactions, 
    scheduleAppointments, 
    learningSubjects, 
    learningEvents, 
    patients,
    addPatient,
    requestBillPayment,
    updateBillStatus,
    joinAppointment,
    completeSubject,
    searchQuery,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChat,
    themeMode,
    setThemeMode,
    themeColor,
    setThemeColor,
    invoices,
    addInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    sidebarHoverExpand,
    setSidebarHoverExpand,
    dateRange,
    setActiveTab,
    calendarEvents,
    notes,
    tasks,
    setQuickDrawerOpen,
    setQuickDrawerTab
  } = useStore();

  // Local billing filter
  const [billingFilter, setBillingFilter] = useState<'All' | 'Telemedicine' | 'In clinic' | 'Insurance'>('All');

  // Add Patient Modal State
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('Female');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientBlood, setNewPatientBlood] = useState('O+');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');
  const [newPatientInsurance, setNewPatientInsurance] = useState('');

  // Chat local input state
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // My Articles Workspace state
  const [articles, setArticles] = useState([
    { id: 1, title: "Cardiovascular Impacts of Telemedicine Protocols", journal: "New England Journal of Medicine", date: "Jan 2026", citations: 42, category: "Peer-Reviewed", views: 245, likes: 38 },
    { id: 2, title: "Optimizing Pediatric Billing Codes for Under-Resourced Clinics", journal: "Healthcare Finance Quarterly", date: "Apr 2026", citations: 12, category: "Clinical Finance", views: 189, likes: 22 },
    { id: 3, title: "Managing Chronic Kidney Disease in Geriatric Outpatients", journal: "Geriatrics Review Journal", date: "Jun 2026", citations: 88, category: "Therapeutics", views: 512, likes: 104 }
  ]);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Peer-Reviewed');
  const [newArticleJournal, setNewArticleJournal] = useState('');
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [articlesSearch, setArticlesSearch] = useState('');

  // Invoice Generator States
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [invClientName, setInvClientName] = useState('');
  const [invClientEmail, setInvClientEmail] = useState('');
  const [invNumber, setInvNumber] = useState('');
  const [invIssueDate, setInvIssueDate] = useState('2026-07-08');
  const [invDueDate, setInvDueDate] = useState('2026-07-23');
  const [invItems, setInvItems] = useState<{ description: string; quantity: number; price: number }[]>([
    { description: "Standard Consultant Fee", quantity: 1, price: 150.00 }
  ]);
  const [newLineDesc, setNewLineDesc] = useState('');
  const [newLineQty, setNewLineQty] = useState(1);
  const [newLinePrice, setNewLinePrice] = useState(0);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Draft' | 'Sent'>('All');
  const [previewingInvoice, setPreviewingInvoice] = useState<any | null>(null);

  // Billing Configuration state
  const [billingFees, setBillingFees] = useState([
    { id: 'f1', service: 'Consultation - Telemedicine', code: 'CPT 99213', fee: 75.00, insuredRatio: 0.85 },
    { id: 'f2', service: 'In-Clinic Diagnostic Screen', code: 'CPT 99214', fee: 120.00, insuredRatio: 0.90 },
    { id: 'f3', service: 'Cardiopulmonary Consultation', code: 'CPT 99215', fee: 150.00, insuredRatio: 0.80 },
    { id: 'f4', service: 'Geriatric Therapy Session', code: 'CPT 90834', fee: 110.00, insuredRatio: 0.75 }
  ]);
  const [codingSearch, setCodingSearch] = useState('');
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editingFeeVal, setEditingFeeVal] = useState<string>('');
  
  // Toggles for Billing Settings
  const [stripeTerminalMode, setStripeTerminalMode] = useState(true);
  const [autoDispatchClaims, setAutoDispatchClaims] = useState(true);
  const [copyInvoicePortal, setCopyInvoicePortal] = useState(true);

  // Documents Workspace state with click-to-upload & Drag-and-Drop capability
  const [clinicalDocs, setClinicalDocs] = useState([
    { id: 'doc-1', name: 'patient_consent_template.pdf', size: '245 KB', category: 'Consent Forms', date: '2026-07-02' },
    { id: 'doc-2', name: 'hipaa_disclosure_statement_2026.docx', size: '1.2 MB', category: 'HIPAA & Compliance', date: '2026-06-15' },
    { id: 'doc-3', name: 'radiology_referral_blank.pdf', size: '310 KB', category: 'Referral Templates', date: '2026-07-01' },
    { id: 'doc-4', name: 'geriatric_ckd_care_protocol_v2.pdf', size: '840 KB', category: 'Clinical Protocols', date: '2026-07-05' }
  ]);
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings Workspace profile states
  const [profDoctorName, setProfDoctorName] = useState('Olivia');
  const [profDoctorSpecialty, setProfDoctorSpecialty] = useState('Internal Medicine & Clinical Director');
  const [doctorEmail, setDoctorEmail] = useState('olivia.clinical@intellymed.org');
  const [doctorPhone, setDoctorPhone] = useState('+1 (555) 019-2831');
  const [consultationBuffer, setConsultationBuffer] = useState('10 minutes');
  const [telemedicineLink, setTelemedicineLink] = useState('https://intellymed.zoom.us/j/dr-olivia');

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  // Handle billing payment request
  const handleRequestBill = (id: string) => {
    requestBillPayment(id);
  };

  // Submit patient
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;
    addPatient({
      name: newPatientName,
      age: Number(newPatientAge) || 30,
      gender: newPatientGender,
      email: newPatientEmail,
      phone: newPatientPhone,
      bloodType: newPatientBlood,
      diagnosis: newPatientDiagnosis || 'General Checkup',
      insuranceProvider: newPatientInsurance || 'Self-Pay',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000)}?auto=format&fit=crop&w=80&q=80`
    });
    // Reset form
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewPatientDiagnosis('');
    setNewPatientInsurance('');
    setIsAddPatientOpen(false);
  };

  // Dynamic analytics computed from active TopNavigation dateRange
  const analytics = useMemo(
    () => computeFilteredAnalytics(dateRange, patientBills),
    [dateRange, patientBills]
  );

  // Billing tab filter logical check
  const filteredBills = analytics.filteredBills.filter(bill => {
    if (billingFilter === 'All') return true;
    return bill.type === billingFilter;
  }).filter(bill => {
    if (!searchQuery) return true;
    return bill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           bill.recipient.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const cardStyle = themeMode === 'galaxy' 
    ? 'bg-[#0E0C22]/85 border border-indigo-950/70 text-stone-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] backdrop-blur-md p-6 rounded-[24px]' 
    : themeMode === 'dark'
    ? 'bg-[#18181B]/95 border border-zinc-800/80 text-stone-100 shadow-md backdrop-blur-md p-6 rounded-[24px]'
    : 'bg-white border border-stone-200/60 text-stone-800 shadow-xs p-6 rounded-[24px]';

  const inputStyle = themeMode === 'galaxy'
    ? 'bg-[#15122E] border border-indigo-900/60 text-stone-100 placeholder-indigo-400/70 focus:border-indigo-400 py-2 px-3 rounded-xl outline-none text-xs transition-all'
    : themeMode === 'dark'
    ? 'bg-[#121214] border border-[#2D2A33] text-stone-100 placeholder-stone-500 focus:border-stone-600 py-2 px-3 rounded-xl outline-none text-xs transition-all'
    : 'bg-[#FAF8F5] border border-stone-200 text-stone-800 placeholder-stone-400 focus:border-stone-400 py-2 px-3 rounded-xl outline-none text-xs transition-all';

  const textMuted = isDark ? 'text-stone-400' : 'text-stone-500';
  const headingStyle = isDark ? 'text-white' : 'text-stone-900';

  const getAccentText = () => {
    switch (themeColor) {
      case 'teal': return 'text-[#80CBC4]';
      case 'purple': return 'text-[#EA80FC]';
      case 'amber': return 'text-[#FFC107]';
      case 'blue': return 'text-[#2196F3]';
      case 'rose': return 'text-[#E91E63]';
      default: return 'text-[#80CBC4]';
    }
  };

  const getAccentBg = () => {
    switch (themeColor) {
      case 'teal': return 'bg-[#80CBC4] text-stone-950 hover:bg-[#6DBFB8]';
      case 'purple': return 'bg-[#EA80FC] text-stone-950 hover:bg-[#DD72EE]';
      case 'amber': return 'bg-[#FFC107] text-stone-950 hover:bg-[#E0A800]';
      case 'blue': return 'bg-[#2196F3] text-white hover:bg-[#1E88E5]';
      case 'rose': return 'bg-[#E91E63] text-white hover:bg-[#D81B60]';
      default: return 'bg-[#80CBC4] text-stone-950 hover:bg-[#6DBFB8]';
    }
  };

  const getAccentBorder = () => {
    switch (themeColor) {
      case 'teal': return 'border-[#80CBC4]/40';
      case 'purple': return 'border-[#EA80FC]/40';
      case 'amber': return 'border-[#FFC107]/40';
      case 'blue': return 'border-[#2196F3]/40';
      case 'rose': return 'border-[#E91E63]/40';
      default: return 'border-[#80CBC4]/40';
    }
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const outstandingRevenue = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Sent')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const collectionRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 100;

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 mt-2 no-scrollbar">
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Patients Billing & Invoices (Dashboard) */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Title & Download Report Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  Your patients billing & invoices
                </h1>
                <p className="text-xs text-stone-400 mt-1 font-sans">
                  Showing analytics for <span className="font-semibold text-[#B06F4B]">{dateRange.label}</span>
                  <span className="font-mono tabular-nums"> · {dateRange.startDate} to {dateRange.endDate}</span>
                </p>
              </div>
              <DownloadReportMenu viewTitle="Patients Billing & Analytics" />
            </div>

            {/* Layout Grid: Circular chart / card metrics left, bills right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Side: Donut Chart and stacked cards */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                
                {/* Donut Chart Container */}
                <div className="bg-white rounded-[24px] p-6 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] relative flex flex-col items-center justify-center min-h-[280px]">
                  {/* Decorative small indicator tags matching screenshot */}
                  {/* Dollar Tag */}
                  <div className="absolute top-8 left-10 w-9 h-9 rounded-full bg-[#FFE57F] flex items-center justify-center shadow-md border-2 border-white">
                    <DollarSign className="w-4 h-4 text-amber-800" />
                  </div>
                  {/* Hourglass/Key Tag */}
                  <div className="absolute bottom-8 left-8 w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center shadow-md border-2 border-white">
                    <Clock className="w-4 h-4 text-teal-800" />
                  </div>
                  {/* Pink Heart Tag */}
                  <div className="absolute top-10 right-8 w-9 h-9 rounded-full bg-[#FCE4EC] flex items-center justify-center shadow-md border-2 border-white">
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  </div>

                  {/* Circle SVG */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Inner light base circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#FAF8F5"
                        strokeWidth="12"
                      />
                      {/* Yellow sector: 30% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#FFE082"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="75.36" // 30% of 251.2 = 75.36
                      />
                      {/* Pink sector: 35% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#F48FB1"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="163.28" // 65% total offset
                        className="transform rotate-[108deg] origin-center"
                      />
                      {/* Blue/Teal sector: 35% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#80CBC4"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="163.28" // 65% total offset
                        className="transform rotate-[234deg] origin-center"
                      />
                    </svg>
                    
                    {/* Centered label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-serif font-bold text-stone-800 tabular-nums">
                        {analytics.kpis.totalBillsFormatted}
                      </span>
                      <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase mt-1">Total Bills</span>
                    </div>
                  </div>

                  {/* Period indicator inside chart view */}
                  <div className="mt-4">
                    <span className="text-[11px] font-sans font-medium text-stone-700 bg-stone-100 py-1 px-3 rounded-full inline-flex items-center gap-1.5">
                      {dateRange.label}
                    </span>
                  </div>
                </div>

                {/* Stacked metric cards synced to DateRangePicker */}
                {/* Payments received */}
                <div className="bg-[#F8EFE9] rounded-[24px] p-5 border border-[#EFE4DC] relative overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                      <span className="text-xs font-sans font-medium text-stone-700">Payments received</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                      {analytics.kpis.receivedDelta}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-800 tabular-nums">
                      $ {analytics.kpis.paymentsReceived.toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-1">Total receipts value · {dateRange.label}</p>
                  </div>
                </div>

                {/* Payments requested */}
                <div className="bg-[#EAF2F8] rounded-[24px] p-5 border border-[#D1E1EC] relative overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span className="text-xs font-sans font-medium text-stone-700">Payments requested</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {analytics.kpis.requestedDelta}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-800 tabular-nums">
                      $ {analytics.kpis.paymentsRequested.toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-1">Total waiting payments value</p>
                  </div>
                </div>

                {/* Non insurance payments */}
                <div className="bg-[#FEF9E7] rounded-[24px] p-5 border border-[#F9F0CE] relative overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-sans font-medium text-stone-700">Non insurance payments</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {analytics.kpis.nonInsuranceDelta}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-800 tabular-nums">
                      $ {analytics.kpis.nonInsurance.toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-1">Total value of non-covered payments</p>
                  </div>
                </div>

              </div>

              {/* Right Side: Waiting for bills list and Latest transactions */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                
                {/* Waiting for bills row */}
                <div>
                  <h3 className="text-lg font-serif font-semibold text-stone-800 mb-3">
                    Waiting for bills
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {waitingBills.map((wb) => (
                      <div 
                        key={wb.id}
                        className="bg-white border border-stone-200/60 rounded-[20px] p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <img 
                            src={wb.avatar} 
                            alt={wb.name} 
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-stone-800">{wb.name}</h4>
                            <p className="text-[10px] text-stone-400 mt-0.5">{wb.type}</p>
                            <p className="text-[11px] text-stone-600 font-semibold mt-1 bg-stone-100/60 py-0.5 px-2 rounded w-fit">
                              {wb.time}
                            </p>
                          </div>
                          
                          {/* Cost */}
                          <div className="text-right">
                            <span className="text-xs font-bold text-stone-800">${wb.amount.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[9px] text-stone-400 font-medium">Pending billing dispatch</span>
                          <button
                            onClick={() => handleRequestBill(wb.id)}
                            className="text-[11px] font-sans font-semibold text-white bg-stone-950 hover:bg-stone-800 py-1.5 px-3.5 rounded-full transition-colors focus:outline-none"
                          >
                            Request payment
                          </button>
                        </div>
                      </div>
                    ))}
                    {waitingBills.length === 0 && (
                      <div className="col-span-2 bg-stone-100/60 border border-dashed border-stone-200 rounded-[20px] p-8 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="w-8 h-8 text-[#80CBC4]" />
                        <span>All outpatient clinics have been billed. Good job!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Latest Transaction row */}
                <div>
                  <h3 className="text-lg font-serif font-semibold text-stone-800 mb-3">
                    Latest transaction
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latestTransactions.slice(0, 3).map((lt) => (
                      <div 
                        key={lt.id}
                        className="bg-[#FAF8F5] border border-stone-200/60 rounded-[16px] p-4 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-800">{lt.companyName}</span>
                          <span className="text-[9px] text-stone-400 mt-0.5">{lt.source}</span>
                          <span className="text-[8px] text-stone-400 mt-1 font-mono">{lt.timeAgo}</span>
                        </div>
                        <div className="bg-[#E8F8F5] text-[#117A65] font-sans font-bold text-xs py-1 px-2.5 rounded-lg border border-[#A3E4D7]">
                          + ${lt.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter segments & Billing records Table */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-2">
                    {/* Segments */}
                    <div className="flex items-center gap-2 bg-stone-100 p-0.5 rounded-full w-fit">
                      {(['All', 'Telemedicine', 'In clinic', 'Insurance'] as const).map((seg) => (
                        <button
                          key={seg}
                          onClick={() => setBillingFilter(seg)}
                          className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                            billingFilter === seg 
                              ? 'bg-stone-950 text-white shadow-sm' 
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          {seg}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs text-stone-400 font-medium">
                      Showing {filteredBills.length} invoices
                    </span>
                  </div>

                  {/* Table */}
                  <div className="bg-white rounded-[20px] border border-stone-200/60 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-stone-100 text-[10px] font-bold text-stone-400 tracking-wider uppercase bg-[#FAF8F5]/80">
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Send date</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Recipient</th>
                            <th className="py-3 px-4">Due date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-xs font-sans">
                          {filteredBills.map((bill) => (
                            <tr key={bill.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-stone-700">
                                {bill.type}
                              </td>
                              <td className="py-3.5 px-4 text-stone-400">
                                {bill.sendDate}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={bill.avatar} 
                                    alt={bill.name} 
                                    className="w-6 h-6 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-bold text-stone-800">{bill.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-stone-800">
                                ${bill.amount.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-4 text-stone-500">
                                {bill.recipient}
                              </td>
                              <td className="py-3.5 px-4 text-stone-400">
                                {bill.dueDate}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center py-0.5 px-2 rounded-full text-[10px] font-bold ${
                                  bill.status === 'Paid' 
                                    ? 'bg-[#E8F8F5] text-[#117A65]' 
                                    : bill.status === 'Requested' 
                                    ? 'bg-[#EBF5FB] text-[#2471A3]'
                                    : bill.status === 'Sent'
                                    ? 'bg-[#F2F3F4] text-[#5D6D7E]'
                                    : 'bg-[#FDEDEC] text-[#C0392B]'
                                }`}>
                                  {bill.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 text-stone-400">
                                  <button 
                                    onClick={() => updateBillStatus(bill.id, 'Paid')}
                                    className="p-1 hover:text-[#117A65] hover:bg-[#E8F8F5] rounded transition-colors"
                                    title="Mark as Paid"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => updateBillStatus(bill.id, 'Failed')}
                                    className="p-1 hover:text-[#C0392B] hover:bg-[#FDEDEC] rounded transition-colors"
                                    title="Mark as Failed"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredBills.length === 0 && (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-stone-400 text-xs">
                                No billing records found matching your query.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: Day Scheduler (Schedule) */}
        {activeTab === 'schedule' && (
          <motion.div
            key="schedule-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header section with add event button and view swappers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A]">
                  Stay up to date, Dr. Olivia
                </h1>
                <p className="text-xs text-stone-400 mt-1">Thursday, May 14 • 7 appointments today</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Integrate custom clinician calendar event via Add event dialog.")}
                  className="bg-stone-950 hover:bg-stone-800 text-white text-xs font-sans font-semibold py-2 px-4 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add event
                </button>
                
                {/* Period toggle */}
                <div className="bg-stone-100 p-0.5 rounded-lg flex items-center text-xs">
                  <span className="bg-white py-1 px-2.5 rounded font-bold shadow-xs text-stone-800">Today</span>
                  <span className="py-1 px-2.5 text-stone-500 font-medium">Week</span>
                  <span className="py-1 px-2.5 text-stone-500 font-medium">Month</span>
                </div>
              </div>
            </div>

            {/* Days slider matching Image 1 schedule exactly */}
            <div className="grid grid-cols-7 gap-2 bg-[#FAF8F5] p-2 rounded-[20px] border border-stone-200/60 shadow-xs">
              {[
                { label: 'MON', date: '11/05', active: false },
                { label: 'TUE', date: '12/05', active: false },
                { label: 'WED', date: '13/05', active: false },
                { label: 'THU', date: '14/05', active: true },
                { label: 'FRI', date: '15/05', active: false },
                { label: 'SAT', date: '16/05', active: false },
                { label: 'SUN', date: '17/05', active: false },
              ].map((day) => (
                <div 
                  key={day.date}
                  className={`py-3 px-2 rounded-[16px] text-center flex flex-col items-center gap-1 transition-all ${
                    day.active 
                      ? 'bg-stone-950 text-white shadow-md' 
                      : 'hover:bg-stone-100/60 text-stone-600'
                  }`}
                >
                  <span className="text-[9px] font-bold tracking-widest">{day.label}</span>
                  <span className="text-xs font-sans font-semibold">{day.date}</span>
                </div>
              ))}
            </div>

            {/* Vertical timetable grid */}
            <div className="relative bg-white rounded-[24px] border border-stone-200/60 p-6 shadow-xs overflow-hidden">
              
              {/* Pink dashed "Current Time" Line at 07:21 matching mockup exactly */}
              <div className="absolute left-0 right-0 top-[96px] z-20 pointer-events-none">
                <div className="relative w-full flex items-center">
                  <div className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-r-full shadow-xs">
                    07:21
                  </div>
                  <div className="flex-1 border-t border-dashed border-pink-500/80 mx-2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-4 shadow-sm" />
                </div>
              </div>

              <div className="space-y-8">
                {[
                  { time: '07:00' },
                  { time: '07:30' },
                  { time: '08:00' },
                  { time: '08:30' },
                  { time: '09:00' },
                  { time: '09:30' },
                ].map((slot) => {
                  // Find appointments starting during this slot
                  const apps = scheduleAppointments.filter(app => app.timeStart === slot.time);

                  return (
                    <div key={slot.time} className="grid grid-cols-12 gap-4 items-start relative min-h-[100px] border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                      
                      {/* Left: Time Label */}
                      <div className="col-span-2 md:col-span-1 text-stone-400 font-bold text-xs pt-1">
                        {slot.time}
                      </div>

                      {/* Right: Slots Grid Container */}
                      <div className="col-span-10 md:col-span-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {apps.map((app) => (
                          <div 
                            key={app.id}
                            className={`rounded-[20px] p-4 flex flex-col justify-between border transition-all ${
                              app.colorTheme === 'peach'
                                ? 'bg-[#FDEDEC]/80 border-[#FADBD8] text-[#78281F]'
                                : app.colorTheme === 'purple'
                                ? 'bg-[#F5EEF8]/80 border-[#EBDEF0] text-[#5B2C6F]'
                                : app.colorTheme === 'yellow'
                                ? 'bg-[#FEF9E7]/80 border-[#F9E79F] text-[#7D6608]'
                                : app.colorTheme === 'blue'
                                ? 'bg-[#EBF5FB]/80 border-[#D4E6F1] text-[#1B4F72]'
                                : app.colorTheme === 'green'
                                ? 'bg-[#E8F8F5]/80 border-[#D1F2EB] text-[#117A65]'
                                : 'bg-[#F2F3F4]/80 border-[#E5E7E9] text-[#2C3E50]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-full">
                                  {app.type}
                                </span>
                                <span className="text-[10px] font-semibold opacity-85">
                                  {app.timeStart} - {app.timeEnd}
                                </span>
                              </div>

                              <h3 className="text-sm font-bold mt-2 font-serif leading-snug">
                                {app.title}
                              </h3>
                              
                              {app.room && (
                                <p className="text-[10px] font-medium opacity-80 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {app.room}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                              {/* Participants Avatars */}
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {app.participants?.map((p, i) => (
                                  <img 
                                    key={i}
                                    src={p.avatar}
                                    alt={p.name}
                                    title={p.name}
                                    className="w-6 h-6 rounded-full border border-white object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>

                              {/* Special Action button based on mockup */}
                              {app.type === 'Online' && (
                                <button
                                  onClick={() => joinAppointment(app.id)}
                                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                                    app.joined 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-stone-900 text-white hover:bg-stone-800'
                                  }`}
                                >
                                  {app.joined ? 'Joined ✓' : 'Join'}
                                </button>
                              )}

                              {app.isInProgress && (
                                <span className="text-[9px] font-bold bg-[#EBF5FB] border border-[#A9DFBF] text-[#27AE60] py-0.5 px-2 rounded-full animate-pulse">
                                  In progress
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 3: Patients Management List */}
        {activeTab === 'patients' && (
          <motion.div
            key="patients-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A]">
                  Patient Database
                </h1>
                <p className="text-xs text-stone-400 mt-1">Manage and register your active clinical records</p>
              </div>

              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="bg-stone-950 hover:bg-stone-800 text-white text-xs font-sans font-semibold py-2.5 px-5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Register New Patient
              </button>
            </div>

            {/* Patients list table or cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {patients.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white border border-stone-200/60 rounded-[24px] p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#EBF5FB]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-stone-800">{p.name}</h3>
                        <p className="text-[10px] text-stone-400 mt-0.5">{p.gender} • {p.age} yrs</p>
                        <span className="inline-block bg-[#FDEDEC] text-[#C0392B] text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded mt-1">
                          Blood: {p.bloodType}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] text-stone-400 font-mono bg-stone-100 py-0.5 px-2 rounded-full">
                      {p.id}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-600">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Last Visit: <strong>{p.lastVisit}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{p.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate" title={p.diagnosis}>Diagnosis: <strong>{p.diagnosis}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">Insurance: <strong>{p.insuranceProvider}</strong></span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* REGISTER PATIENT DIALOG */}
            {isAddPatientOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-stone-100 relative"
                  >
                    <button 
                      onClick={() => setIsAddPatientOpen(false)}
                      className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
                      Register Patient Record
                    </h2>

                    <form onSubmit={handleCreatePatient} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={newPatientName}
                          onChange={(e) => setNewPatientName(e.target.value)}
                          placeholder="e.g. Rachel Meyers" 
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none focus:border-stone-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Age</label>
                          <input 
                            type="number" 
                            required
                            value={newPatientAge}
                            onChange={(e) => setNewPatientAge(e.target.value)}
                            placeholder="34" 
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Gender</label>
                          <select 
                            value={newPatientGender}
                            onChange={(e) => setNewPatientGender(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                          >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Email</label>
                        <input 
                          type="email" 
                          value={newPatientEmail}
                          onChange={(e) => setNewPatientEmail(e.target.value)}
                          placeholder="rachel@gmail.com" 
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Phone</label>
                        <input 
                          type="text" 
                          value={newPatientPhone}
                          onChange={(e) => setNewPatientPhone(e.target.value)}
                          placeholder="+1 (555) 234-5678" 
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Blood Type</label>
                          <input 
                            type="text" 
                            value={newPatientBlood}
                            onChange={(e) => setNewPatientBlood(e.target.value)}
                            placeholder="O+" 
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Insurance Provider</label>
                          <input 
                            type="text" 
                            value={newPatientInsurance}
                            onChange={(e) => setNewPatientInsurance(e.target.value)}
                            placeholder="American Family" 
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Primary Diagnosis</label>
                        <textarea 
                          rows={2}
                          value={newPatientDiagnosis}
                          onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                          placeholder="Explain primary reason for scheduling..." 
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-stone-950 text-white text-xs font-sans font-bold py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
                      >
                        Add to Patient Database
                      </button>
                    </form>
                  </motion.div>
                </div>
              </>
            )}

          </motion.div>
        )}

        {/* TAB 4: Statistics & Clinical Reports (Statistics) */}
        {activeTab === 'statistics' && (
          <motion.div
            key="statistics-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  Statistics, Analytics & Forecast
                </h1>
                <p className="text-xs text-stone-400 mt-1">
                  Interval: <span className="font-semibold text-[#B06F4B]">{dateRange.label}</span>
                  <span className="font-mono tabular-nums"> · {dateRange.startDate} to {dateRange.endDate}</span>
                </p>
              </div>
              <DownloadReportMenu viewTitle="Clinical Statistics & Revenue Forecast" />
            </div>

            {/* Dynamic 4-KPI Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={cardStyle}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Actual Revenue</span>
                <div className={`text-2xl font-serif font-bold tabular-nums mt-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  ${analytics.kpis.totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium mt-1 font-mono tabular-nums">
                  {analytics.kpis.receivedDelta} vs prior interval
                </p>
              </div>

              <div className={cardStyle}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Projected Forecast</span>
                <div className="text-2xl font-serif font-bold tabular-nums mt-2 text-[#B06F4B]">
                  ${analytics.kpis.projectedRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-400 mt-1 font-mono tabular-nums">
                  {analytics.kpis.forecastGrowthPct >= 0 ? '+' : ''}{analytics.kpis.forecastGrowthPct}% lookahead trajectory
                </p>
              </div>

              <div className={cardStyle}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Consultations</span>
                <div className={`text-2xl font-serif font-bold tabular-nums mt-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  {analytics.kpis.totalConsultations.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Telemedicine, clinic & emergency
                </p>
              </div>

              <div className={cardStyle}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Avg Revenue / Visit</span>
                <div className="text-2xl font-serif font-bold tabular-nums mt-2 text-[#117A65]">
                  ${analytics.kpis.avgTicket.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Net realized clinical yield
                </p>
              </div>
            </div>

            {/* Recharts Analytical & Forecast Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Revenue Actuals vs Forward Forecast Composed Chart */}
              <div className={`lg:col-span-7 ${cardStyle}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className={`text-base font-serif font-semibold ${headingStyle}`}>
                      Clinical Revenue & Forward Forecast
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Solid area tracks verified revenue · Dashed line models forward forecast
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-sans text-stone-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F48FB1]" /> Actual
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-[#80CBC4]" /> Forecast
                    </span>
                  </div>
                </div>
                
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={analytics.timeSeries}
                      margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="actualRevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F48FB1" stopOpacity={0.32} />
                          <stop offset="95%" stopColor="#F48FB1" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f0ece6'} vertical={false} />
                      <XAxis dataKey="label" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                          borderColor: isDark ? '#27272A' : '#E7E5E4',
                          borderRadius: '14px',
                          fontSize: '12px',
                        }}
                        formatter={(value: any, name: string) => [
                          value !== null && value !== undefined ? `$${Number(value).toLocaleString()}` : 'Projected',
                          name === 'actualRevenue' ? 'Actual Revenue' : name === 'forecastRevenue' ? 'Forecast Target' : 'Expenses',
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="actualRevenue"
                        stroke="#F48FB1"
                        fill="url(#actualRevGrad)"
                        strokeWidth={2.5}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecastRevenue"
                        stroke="#4DB6AC"
                        strokeWidth={2.2}
                        strokeDasharray="6 4"
                        dot={{ r: 3, fill: '#4DB6AC' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Consultation distribution */}
              <div className={`lg:col-span-5 ${cardStyle}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-base font-serif font-semibold ${headingStyle}`}>Patient Consultation Mix</h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">Filtered by {dateRange.label}</p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-stone-400">
                    {analytics.kpis.totalConsultations} visits
                  </span>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.consultationMix}
                      margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f0ece6'} vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                          borderColor: isDark ? '#27272A' : '#E7E5E4',
                          borderRadius: '14px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                        {analytics.consultationMix.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: Dei-style Learning Plan (Education) */}
        {activeTab === 'education' && (
          <motion.div
            key="education-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Title with clock icon */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A] flex items-center gap-2.5">
                My Learning Plan <BookOpen className="w-7 h-7 text-[#80CBC4]" />
              </h1>
              
              {/* Micro Search field specifically for learning plan */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Search lessons..."
                  className="bg-stone-100/80 border-none rounded-full py-1.5 pl-9 pr-4 text-xs text-stone-800 outline-none w-48 focus:w-64 transition-all"
                />
              </div>
            </div>

            {/* Layout Grid: Node Flow chart left, Events list right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* LEFT: Connective Flowchart Node Tree (Col span 8) */}
              <div className="xl:col-span-8 space-y-6 relative">
                
                {/* Stats Blocks Row at top of flowchart */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#EBF5FB] border border-[#D4E6F1] rounded-[20px] p-4 text-center">
                    <span className="text-3xl font-bold text-[#1F618D] block">26</span>
                    <span className="text-[10px] text-stone-500 font-sans tracking-wide uppercase mt-1">Total</span>
                  </div>
                  
                  <div className="bg-[#E8F8F5] border border-[#D1F2EB] rounded-[20px] p-4 text-center">
                    <span className="text-3xl font-bold text-[#117A65] block">2</span>
                    <span className="text-[10px] text-[#117A65] font-sans font-semibold tracking-wide uppercase mt-1 flex items-center justify-center gap-1">
                      Completed <Sparkles className="w-3.5 h-3.5 text-[#117A65]" />
                    </span>
                  </div>

                  <div className="bg-white border border-stone-200/60 rounded-[20px] p-4 text-center">
                    <span className="text-3xl font-bold text-stone-800 block">23</span>
                    <span className="text-[10px] text-stone-500 font-sans tracking-wide uppercase mt-1">Upcoming</span>
                  </div>
                </div>

                {/* Flowchart Tree Canvas Area */}
                <div className="bg-[#FAF8F5] rounded-[24px] p-6 border border-stone-200/60 relative min-h-[500px] overflow-hidden flex flex-col gap-6">
                  
                  {/* Connective flowchart dotted pathways running behind */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Node paths linking subjects */}
                      {/* Medical Terminology to Pharmacology Basics */}
                      <path d="M 240 100 Q 240 170 180 190" fill="none" stroke="#D1F2EB" strokeWidth="2.5" strokeDasharray="5,5" />
                      {/* Medical Terminology to Anatomy and Physiology */}
                      <path d="M 240 100 Q 240 170 360 190" fill="none" stroke="#D1F2EB" strokeWidth="2.5" strokeDasharray="5,5" />
                      {/* Pharmacology Basics to Disease Pathophysiology */}
                      <path d="M 180 280 L 180 370" fill="none" stroke="#D1F2EB" strokeWidth="2.5" strokeDasharray="5,5" />
                      {/* Anatomy and Physiology to Medical Ethics */}
                      <path d="M 360 280 L 360 370" fill="none" stroke="#D1F2EB" strokeWidth="2.5" strokeDasharray="5,5" />
                    </svg>
                  </div>

                  {/* Root Node: Medical Terminology (Completed) */}
                  <div className="flex justify-center z-10">
                    <div className="bg-white border border-stone-200 rounded-[20px] p-4 max-w-sm w-full shadow-xs relative hover:shadow-md transition-shadow">
                      {/* Top right icon badge */}
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#E8F8F5] text-[#117A65] flex items-center justify-center border border-[#D1F2EB]">
                        <Check className="w-3.5 h-3.5" />
                      </div>

                      <h3 className="text-sm font-bold text-stone-800 font-serif pr-6">
                        Medical Terminology
                      </h3>
                      <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                        Learn basic medical language for effective communication.
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-green-700 bg-green-50 py-0.5 px-2 rounded-full font-sans font-bold flex items-center gap-1">
                          Completed <Check className="w-3 h-3" />
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold hover:bg-stone-50 flex items-center justify-center">...</button>
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold hover:bg-stone-50 flex items-center justify-center">✕</button>
                          <button className="w-5 h-5 rounded-full bg-stone-950 text-white hover:bg-stone-800 flex items-center justify-center p-1"><Check className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Level 1 Split Row: Pharmacology (In Progress) and Anatomy (Completed) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                    
                    {/* Pharmacology Basics */}
                    <div className="bg-white border border-stone-200 rounded-[24px] p-5 shadow-xs relative hover:shadow-md transition-shadow">
                      
                      {/* Colorful soft purple background widget exactly like Image 2 */}
                      <div className="bg-[#F5EEF8] border border-[#EBDEF0] rounded-[20px] p-4 relative overflow-hidden mb-4">
                        
                        {/* Floating play circle icon */}
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform text-purple-600 pl-[2px]">
                          <Play className="w-4 h-4 fill-purple-600 stroke-none" />
                        </div>

                        <span className="text-[9px] font-bold text-purple-600 tracking-wider uppercase">Pharmacology</span>
                        <h4 className="text-sm font-bold font-serif text-stone-800 mt-1">Pharmacology Basics</h4>
                        <p className="text-[10px] text-stone-500 mt-1 leading-normal pr-12">
                          Learn basic medical language for effective communication.
                        </p>

                        <div className="mt-4 pt-3 border-t border-purple-200/50 flex items-center justify-between">
                          <span className="text-[10px] text-purple-700 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Watching 00:30
                          </span>

                          <div className="flex -space-x-1 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" className="w-5 h-5 rounded-full border border-white" />
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" className="w-5 h-5 rounded-full border border-white" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" className="w-5 h-5 rounded-full border border-white" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-700 bg-amber-50 py-0.5 px-2 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center">...</button>
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center">✕</button>
                          <button 
                            onClick={() => completeSubject('ls2')}
                            className="w-5 h-5 rounded-full bg-stone-950 text-white flex items-center justify-center hover:bg-stone-800 p-1"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Anatomy and Physiology */}
                    <div className="bg-white border border-stone-200 rounded-[24px] p-5 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
                      
                      <div>
                        {/* Top right check badge */}
                        <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-[#E8F8F5] text-[#117A65] flex items-center justify-center border border-[#D1F2EB]">
                          <Check className="w-3.5 h-3.5" />
                        </div>

                        <h3 className="text-sm font-bold text-stone-800 font-serif pr-8">
                          Anatomy and Physiology
                        </h3>
                        <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                          Understand the structure and function of the human body.
                        </p>
                      </div>

                      <div className="mt-8 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[10px] text-green-700 bg-green-50 py-0.5 px-2 rounded-full font-bold flex items-center gap-1">
                          Completed <Check className="w-3 h-3" />
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center">...</button>
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center">✕</button>
                          <button className="w-5 h-5 rounded-full bg-stone-950 text-white flex items-center justify-center p-1"><Check className="w-3 h-3" /></button>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Level 2: Medical Ethics and Pathology */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                    
                    {/* Medical Ethics */}
                    <div className="bg-white border border-stone-200 rounded-[24px] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow opacity-90">
                      <div>
                        <h3 className="text-sm font-bold text-stone-800 font-serif">
                          Medical Ethics & Professionalism
                        </h3>
                        <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                          Understand ethical principles and professionalism in healthcare.
                        </p>
                      </div>

                      <div className="mt-8 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 bg-stone-100 py-0.5 px-2 rounded-full font-medium flex items-center gap-1">
                          Upcoming <Clock className="w-3 h-3 text-stone-400" />
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button className="w-5 h-5 rounded-full border border-stone-200 text-stone-500 text-[10px] font-bold flex items-center justify-center">...</button>
                        </div>
                      </div>
                    </div>

                    {/* Disease Pathophysiology */}
                    <div className="bg-stone-50 border border-stone-200/60 rounded-[24px] p-5 shadow-xs flex flex-col justify-between opacity-75 relative">
                      {/* Lock Icon */}
                      <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-stone-500 font-serif pr-8">
                          Disease Pathophysiology
                        </h3>
                        <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                          Study the cellular and molecular basis of common diseases.
                        </p>
                      </div>

                      <div className="mt-8 pt-3 border-t border-stone-200/50 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 font-medium">
                          Locked
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Dei style bottom circle controls bar exactly like image 2 */}
                  <div className="mt-4 pt-4 border-t border-stone-200/50 flex items-center justify-center gap-1.5">
                    {[
                      { icon: Type, bg: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200', label: 'Formatting' },
                      { icon: Sparkles, bg: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200', label: 'AI Review' },
                      { icon: FileText, bg: 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200', label: 'Summary PDF' },
                      { icon: Folder, bg: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200', label: 'Move to folder' },
                      { icon: MessageSquare, bg: 'bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200', label: 'Discuss lesson' },
                      { icon: Smile, bg: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200', label: 'Provide feedback' },
                      { icon: Plus, bg: 'bg-stone-900 text-white hover:bg-stone-800 border-stone-800', label: 'Request new topic' }
                    ].map((btn, i) => {
                      const BtnIcon = btn.icon;
                      return (
                        <button 
                          key={i} 
                          onClick={() => alert(`Activated bottom navigation action: ${btn.label}`)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${btn.bg} border shadow-xs hover:scale-105`}
                          title={btn.label}
                        >
                          <BtnIcon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>

                </div>

              </div>

              {/* RIGHT: "My Events" side panel (Col span 4) */}
              <div className="xl:col-span-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-semibold text-stone-800 flex items-center gap-2">
                    My Events <Calendar className="w-4 h-4 text-[#80CBC4]" />
                  </h3>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active</span>
                </div>

                <div className="space-y-4">
                  {learningEvents.map((evt) => (
                    <div 
                      key={evt.id}
                      className={`rounded-[20px] p-5 border flex flex-col gap-2 relative transition-all hover:shadow-md ${
                        evt.colorTheme === 'blue'
                          ? 'bg-[#EAF2F8] border-[#A9DFBF]/40 text-[#2471A3]'
                          : evt.colorTheme === 'purple'
                          ? 'bg-[#F5EEF8] border-[#EBDEF0] text-[#5B2C6F]'
                          : evt.colorTheme === 'yellow'
                          ? 'bg-[#FEF9E7] border-[#F9E79F] text-[#7D6608]'
                          : 'bg-[#E8F8F5] border-[#D1F2EB] text-[#117A65]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-white/60 py-0.5 px-2 rounded-full">
                          {evt.type}
                        </span>
                        <span className="text-[10px] font-bold opacity-80">{evt.dateStr}</span>
                      </div>

                      <h4 className="text-sm font-bold font-serif leading-snug mt-1 text-stone-800">
                        {evt.title}
                      </h4>
                      <p className="text-[10px] text-stone-600 leading-normal">
                        {evt.description}
                      </p>

                      {evt.time && (
                        <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-800 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {evt.time}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional bottom prompt block */}
                <div className="bg-green-100 border border-green-200 rounded-[20px] p-4 text-green-900 mt-2 shadow-xs">
                  <span className="text-[9px] font-bold uppercase bg-green-200/50 py-0.5 px-2 rounded-full">Pro Tip</span>
                  <p className="text-[10px] font-medium leading-normal mt-2">
                    Review Pharmacology Basics to unlock Disease Pathophysiology for your team.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 6: Intelly Clinical AI Assistant Chat (Chats & Calls) */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  Intelly AI Assistant <Sparkles className="w-6 h-6 text-pink-400" />
                </h1>
                <p className="text-xs text-stone-400 mt-1">Get real-time insights, analyze bills, draft messages powered by Gemini</p>
              </div>

              <button 
                onClick={clearChat}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 py-2 px-4 rounded-full transition-colors"
              >
                Clear History
              </button>
            </div>

            {/* Chat screen */}
            <div className="bg-white border border-stone-200/60 rounded-[24px] shadow-sm flex flex-col h-[520px] overflow-hidden">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#FAF8F5]/30">
                {chatMessages.map((msg) => {
                  const isAsst = msg.role === 'assistant';
                  return (
                    <div 
                      key={msg.id}
                      className={`flex ${isAsst ? 'justify-start' : 'justify-end'} items-end gap-2.5`}
                    >
                      {isAsst && (
                        <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs">
                          AI
                        </div>
                      )}
                      
                      <div className={`max-w-md rounded-[20px] p-4 text-xs leading-normal ${
                        isAsst 
                          ? 'bg-[#EBF5FB] border border-[#D4E6F1] text-[#1B4F72]' 
                          : 'bg-stone-900 text-white rounded-br-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className={`block text-[8px] mt-1 text-right ${isAsst ? 'text-stone-400' : 'text-stone-300'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="flex justify-start items-end gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs animate-pulse">
                      AI
                    </div>
                    <div className="bg-stone-100 text-stone-500 rounded-[20px] p-4 text-xs italic animate-pulse">
                      Gemini is generating response...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim()) return;
                  sendChatMessage(chatInput);
                  setChatInput('');
                }}
                className="border-t border-stone-100 p-4 bg-[#FAF8F5] flex items-center gap-3"
              >
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me to audit Dr. Olivia's billing, view patient records, or help plan a schedule..."
                  className="flex-1 bg-white border border-stone-200 rounded-full py-2.5 px-5 text-xs text-stone-800 outline-none focus:border-stone-400"
                />
                
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center hover:bg-stone-800 transition-colors focus:outline-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}

        {/* TAB: Home & Invoice Generator Workspace */}
        {activeTab === 'home' && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Title with Subtitle, Download Report & Quick Invoice Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  Business Owner & Invoice Center
                </h1>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Manage corporate clinical accounts, export analytical reports, and track revenue for{' '}
                  <span className="font-semibold text-[#B06F4B]">{dateRange.label}</span>.
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <DownloadReportMenu viewTitle="Business Owner & Invoice Center" />
                <button
                  onClick={() => {
                    setInvNumber(`INV-2026-00${invoices.length + 1}`);
                    setIsNewInvoiceOpen(true);
                  }}
                  className={`flex items-center gap-2 py-2.5 px-5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${getAccentBg()}`}
                >
                  <Plus className="w-4 h-4" />
                  Generate New Invoice
                </button>
              </div>
            </div>

            {/* Live Business Analytics Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Metric 1 */}
              <div className={cardStyle}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Collected Revenue</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ${(totalRevenue + analytics.kpis.paymentsReceived).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-stone-400 mt-2">
                  Cleared & settled · {dateRange.label}
                </div>
              </div>

              {/* Metric 2 */}
              <div className={cardStyle}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Projected Forecast</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-[#B06F4B] tabular-nums">
                  ${analytics.kpis.projectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-stone-400 mt-2 font-mono tabular-nums">
                  {analytics.kpis.forecastGrowthPct >= 0 ? '+' : ''}{analytics.kpis.forecastGrowthPct}% projected growth
                </div>
              </div>

              {/* Metric 3 */}
              <div className={cardStyle}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Total Invoices Issued</span>
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-2xl font-serif font-bold tabular-nums ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  {totalInvoices} ledger lines
                </div>
                <div className="text-[10px] text-stone-400 mt-2">
                  ${outstandingRevenue.toLocaleString()} awaiting transfer
                </div>
              </div>

              {/* Metric 4 */}
              <div className={cardStyle}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>Collection Efficiency</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400 tabular-nums">{collectionRate}%</div>
                <div className="text-[10px] text-stone-400 mt-2">
                  {analytics.kpis.totalConsultations} visits in interval
                </div>
              </div>

            </div>

            {/* Unified Workspace Pulse: Forecast Sparkline + Today's Calendar + Pinned Notes & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Forecast Pulse */}
              <div className={`${cardStyle} flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-serif font-semibold ${headingStyle}`}>Revenue Forecast Pulse</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">{dateRange.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('statistics')}
                    className="text-[11px] font-semibold text-[#B06F4B] hover:underline cursor-pointer"
                  >
                    Full Analytics
                  </button>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={analytics.timeSeries} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                      <XAxis dataKey="label" stroke="#999" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#999" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                          borderColor: isDark ? '#27272A' : '#E7E5E4',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Area type="monotone" dataKey="actualRevenue" stroke="#F48FB1" fill="rgba(244,143,177,0.18)" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecastRevenue" stroke="#4DB6AC" strokeWidth={2} strokeDasharray="4 3" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Calendar Snapshot */}
              <div className={`${cardStyle} flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-serif font-semibold ${headingStyle}`}>Upcoming Calendar</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">{calendarEvents.filter(e => !e.completed).length} scheduled milestones</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('calendar')}
                    className="text-[11px] font-semibold text-[#B06F4B] hover:underline cursor-pointer"
                  >
                    Open Calendar
                  </button>
                </div>
                <div className="space-y-2">
                  {calendarEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
                        isDark ? 'bg-white/[0.03] border-white/8' : 'bg-[#FAF8F5] border-stone-200/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{ev.title}</p>
                        <p className="text-[10px] text-stone-400 font-mono tabular-nums">{ev.date} · {ev.time}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#B06F4B] shrink-0">{ev.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pinned Notes & Quick Tasks Snapshot */}
              <div className={`${cardStyle} flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-serif font-semibold ${headingStyle}`}>Clinical Notes & Tasks</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {notes.length} notes · {tasks.filter(t => !t.completed).length} open tasks
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    className="text-[11px] font-semibold text-[#B06F4B] hover:underline cursor-pointer"
                  >
                    Open Notes
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.slice(0, 2).map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => {
                        setQuickDrawerTab('notes');
                        setQuickDrawerOpen(true);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                        isDark ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.07]' : 'bg-[#FAF8F5] border-stone-200/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{note.title}</span>
                        <span className="text-[10px] text-[#B06F4B] shrink-0">{note.category}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{note.content}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Admin Navigation Panel */}
            <div className={`${cardStyle} p-4 flex flex-col md:flex-row items-center justify-between gap-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>Administrative Overview Hub</h3>
                  <p className="text-[10px] text-stone-400">Instantly jump between your clinical registers, planner, and notes:</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { tab: 'dashboard', label: 'Billing Queue' },
                  { tab: 'statistics', label: 'Forecast Analytics' },
                  { tab: 'calendar', label: 'Calendar' },
                  { tab: 'notes', label: 'Notes & Tasks' },
                  { tab: 'patients', label: 'Patients Ledger' },
                  { tab: 'documents', label: 'Compliance Vault' }
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      isDark 
                        ? 'border-stone-800 bg-stone-900/40 text-stone-300 hover:border-stone-700 hover:text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices Ledger Table Section */}
            <div className={cardStyle}>
              {/* Table header & filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/20 mb-4">
                
                {/* Search query input */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    placeholder="Search client name, email or INV #..."
                    className={`w-full pl-9 ${inputStyle}`}
                  />
                </div>

                {/* Status selector tabs */}
                <div className="flex items-center gap-1.5 bg-stone-100/5 p-1 rounded-xl border border-stone-200/10">
                  {(['All', 'Paid', 'Pending', 'Draft', 'Sent'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setInvoiceStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        invoiceStatusFilter === st
                          ? isDark ? 'bg-[#18181B] text-white shadow-sm' : 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

              </div>

              {/* Invoices Grid / Table view */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200/10 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      <th className="py-3">Invoice Number</th>
                      <th className="py-3">Client details</th>
                      <th className="py-3">Issued</th>
                      <th className="py-3">Due Date</th>
                      <th className="py-3">Total Amount</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-stone-200/10 text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    <AnimatePresence initial={false}>
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-stone-400 italic">
                            No matching invoices found in clinical archives.
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv) => (
                          <motion.tr
                            key={inv.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -15 }}
                            transition={{ duration: 0.2 }}
                            className={`hover:bg-stone-500/5 transition-colors`}
                          >
                            <td className="py-3.5 font-mono text-[11px] font-bold text-indigo-400">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-3.5">
                              <div className={`font-semibold ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>{inv.clientName}</div>
                              <div className="text-[10px] text-stone-400">{inv.clientEmail}</div>
                            </td>
                            <td className="py-3.5 text-stone-400">{inv.issueDate}</td>
                            <td className="py-3.5 text-stone-400">{inv.dueDate}</td>
                            <td className="py-3.5 font-bold font-serif text-stone-100">
                              ${inv.totalAmount.toFixed(2)}
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : inv.status === 'Pending'
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : inv.status === 'Sent'
                                  ? 'bg-blue-500/15 text-blue-400'
                                  : 'bg-stone-500/15 text-stone-400'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button
                                onClick={() => setPreviewingInvoice(inv)}
                                className={`text-[11px] font-bold hover:underline ${getAccentText()}`}
                              >
                                View Receipt
                              </button>
                              {inv.status !== 'Paid' && (
                                <button
                                  onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                                  className="text-[11px] text-emerald-400 hover:text-emerald-500 font-bold hover:underline"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Permanently delete invoice ${inv.invoiceNumber}?`)) {
                                    deleteInvoice(inv.id);
                                  }
                                }}
                                className="text-stone-500 hover:text-rose-500 p-1 align-middle inline-flex items-center justify-center"
                                title="Delete invoice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL WORKSPACE 1: Create Invoice Popup/Backdrop */}
            <AnimatePresence>
              {isNewInvoiceOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop blur */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsNewInvoiceOpen(false)}
                    className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
                  />

                  {/* Form Container */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="relative w-full max-w-lg bg-[#141228] border border-indigo-950 rounded-[28px] overflow-hidden p-6 text-stone-100 shadow-2xl z-10"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-indigo-900/30 mb-4">
                      <div>
                        <h2 className="text-md font-serif font-bold text-white flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-indigo-400" />
                          Issue Administrative Invoice
                        </h2>
                        <p className="text-[10px] text-stone-400 mt-0.5">Generate client invoices with line items and automatic taxes</p>
                      </div>
                      <button
                        onClick={() => setIsNewInvoiceOpen(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-all text-stone-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pre-population Templates */}
                    <div className="mb-4 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-900/30">
                      <span className="text-[9px] font-bold uppercase text-indigo-400 block mb-1">Quick clinical package presets:</span>
                      <div className="flex gap-1.5">
                        {[
                          { label: 'General Consult', desc: 'Standard screening package', items: [{ description: 'Primary Consultation Session', quantity: 1, price: 120.00 }] },
                          { label: 'Geriatric EKG', desc: 'Therapeutic and cardiology evaluation', items: [{ description: 'Cardiopulmonary EKG Eval', quantity: 1, price: 150.00 }, { description: 'Therapeutic Buffer Session', quantity: 1, price: 40.00 }] }
                        ].map((tpl) => (
                          <button
                            key={tpl.label}
                            type="button"
                            onClick={() => setInvItems(tpl.items)}
                            className="text-[10px] font-bold bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-stone-300 hover:bg-white/10"
                          >
                            {tpl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form body */}
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Client Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Alice Cooper"
                            value={invClientName}
                            onChange={(e) => setInvClientName(e.target.value)}
                            className="w-full bg-[#0D0B1C] border border-indigo-950 rounded-xl py-2 px-3 text-stone-100 outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Client Email</label>
                          <input
                            type="email"
                            placeholder="alice@gmail.com"
                            value={invClientEmail}
                            onChange={(e) => setInvClientEmail(e.target.value)}
                            className="w-full bg-[#0D0B1C] border border-indigo-950 rounded-xl py-2 px-3 text-stone-100 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Invoice Number</label>
                          <input
                            type="text"
                            value={invNumber}
                            onChange={(e) => setInvNumber(e.target.value)}
                            className="w-full bg-[#0D0B1C] border border-indigo-950 rounded-xl py-2 px-3 text-indigo-400 font-mono outline-none text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Issue Date</label>
                          <input
                            type="date"
                            value={invIssueDate}
                            onChange={(e) => setInvIssueDate(e.target.value)}
                            className="w-full bg-[#0D0B1C] border border-indigo-950 rounded-xl py-2 px-2 text-stone-100 outline-none text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Due Date</label>
                          <input
                            type="date"
                            value={invDueDate}
                            onChange={(e) => setInvDueDate(e.target.value)}
                            className="w-full bg-[#0D0B1C] border border-indigo-950 rounded-xl py-2 px-2 text-stone-100 outline-none text-center"
                          />
                        </div>
                      </div>

                      {/* Line item fields */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-stone-400 uppercase">Manage Line Items</label>
                        <div className="border border-indigo-950 bg-[#0A0816] rounded-2xl p-3 space-y-3">
                          <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-6">
                              <input
                                type="text"
                                placeholder="Item description (e.g. Consultation)"
                                value={newLineDesc}
                                onChange={(e) => setNewLineDesc(e.target.value)}
                                className="w-full bg-[#110F24] border border-indigo-950 rounded-lg py-1 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="number"
                                placeholder="Qty"
                                value={newLineQty}
                                onChange={(e) => setNewLineQty(Number(e.target.value) || 1)}
                                className="w-full bg-[#110F24] border border-indigo-950 rounded-lg py-1 text-xs text-white text-center"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                placeholder="Price"
                                value={newLinePrice}
                                onChange={(e) => setNewLinePrice(Number(e.target.value) || 0)}
                                className="w-full bg-[#110F24] border border-indigo-950 rounded-lg py-1 text-xs text-white text-right"
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newLineDesc.trim()) return;
                                  setInvItems([...invItems, { description: newLineDesc, quantity: newLineQty, price: newLinePrice }]);
                                  setNewLineDesc('');
                                  setNewLineQty(1);
                                  setNewLinePrice(0);
                                }}
                                className="bg-indigo-600 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Render dynamic line items with animation */}
                          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 no-scrollbar">
                            <AnimatePresence initial={false}>
                              {invItems.length === 0 ? (
                                <p className="text-center text-stone-500 italic text-[11px] py-2">No items added. Add a line above.</p>
                              ) : (
                                invItems.map((item, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    className="flex items-center justify-between text-[11px] p-2 bg-[#121025] border border-indigo-950/50 rounded-lg"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-stone-200 block truncate">{item.description}</span>
                                      <span className="text-[10px] text-stone-400">{item.quantity} x ${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-white">${(item.quantity * item.price).toFixed(2)}</span>
                                      <button
                                        type="button"
                                        onClick={() => setInvItems(invItems.filter((_, i) => i !== index))}
                                        className="text-stone-500 hover:text-rose-400 p-0.5"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Calculations total */}
                      {(() => {
                        const sub = invItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
                        const tax = sub * 0.10;
                        const grandTotal = sub + tax;
                        return (
                          <div className="p-3 bg-[#0A0816] rounded-xl flex items-center justify-between text-stone-300">
                            <div className="text-[10px] text-stone-400">
                              <div>Subtotal: <strong className="text-stone-300 font-mono">${sub.toFixed(2)}</strong></div>
                              <div className="mt-0.5">Govt Tax (10%): <strong className="text-stone-300 font-mono">${tax.toFixed(2)}</strong></div>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-bold text-indigo-400 block">Total Due</span>
                              <strong className="text-lg font-serif font-bold text-white font-mono">${grandTotal.toFixed(2)}</strong>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Submit action buttons */}
                      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-indigo-900/20">
                        <button
                          type="button"
                          onClick={() => setIsNewInvoiceOpen(false)}
                          className="bg-white/5 hover:bg-white/10 rounded-full py-2 px-5 font-bold text-stone-300 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (invItems.length === 0) {
                              alert("Please add at least one line item to publish this invoice.");
                              return;
                            }
                            const finalSub = invItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
                            const finalTotal = finalSub * 1.10;
                            addInvoice({
                              invoiceNumber: invNumber || `INV-2026-00${invoices.length + 1}`,
                              clientName: invClientName || 'Unnamed Outpatient LLC',
                              clientEmail: invClientEmail || 'patient.accounts@intellymed.com',
                              issueDate: invIssueDate,
                              dueDate: invDueDate,
                              items: invItems,
                              totalAmount: finalTotal,
                              status: 'Pending'
                            });
                            setIsNewInvoiceOpen(false);
                            // reset
                            setInvClientName('');
                            setInvClientEmail('');
                            setInvItems([{ description: "Standard Consultant Fee", quantity: 1, price: 150.00 }]);
                          }}
                          className={`rounded-full py-2 px-6 font-bold shadow-md ${getAccentBg()}`}
                        >
                          Publish & Issue Invoice
                        </button>
                      </div>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* MODAL WORKSPACE 2: Receipt Preview & Printing Watermarked Invoice */}
            <AnimatePresence>
              {previewingInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setPreviewingInvoice(null)}
                    className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
                  />

                  {/* Receipt Frame */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white text-stone-800 rounded-3xl p-8 shadow-2xl border border-stone-200 z-10 font-sans"
                  >
                    {/* Header Controls for Printing */}
                    <div className="absolute top-6 right-6 flex items-center gap-2 print:hidden">
                      <button
                        onClick={() => window.print()}
                        className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-full transition-all"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(previewingInvoice.invoiceNumber);
                          alert("Invoice ID copied to clipboard!");
                        }}
                        className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-full transition-all"
                        title="Copy Invoice Number"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreviewingInvoice(null)}
                        className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-full transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Receipt Body Watermarked */}
                    <div className="relative border-4 border-double border-stone-100 p-6 rounded-2xl overflow-hidden">
                      {/* Faint watermark vector background */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-2">
                        <div className="text-[120px] font-bold text-stone-900 rotate-12 select-none uppercase tracking-widest">
                          INTELLY
                        </div>
                      </div>

                      {/* Top Branding Header */}
                      <div className="flex justify-between items-start border-b border-stone-200 pb-5">
                        <div>
                          <span className="text-[10px] font-bold text-[#80CBC4] uppercase tracking-widest block mb-1">Official Invoice Receipt</span>
                          <h2 className="text-xl font-serif font-bold text-stone-900 leading-none">Intelly Clinical Network</h2>
                          <p className="text-[9px] text-stone-400 mt-1">
                            HIPAA Verified Medical Outpatient billing &middot; ID {previewingInvoice.invoiceNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 py-1 px-2.5 rounded-lg">
                            {previewingInvoice.invoiceNumber}
                          </span>
                          <span className="block text-[9px] text-stone-400 mt-1">Issue Date: {previewingInvoice.issueDate}</span>
                        </div>
                      </div>

                      {/* Doctor/Clinic credentials info & Patient details side-by-side */}
                      <div className="grid grid-cols-2 gap-4 my-5 text-[10px] leading-relaxed">
                        <div>
                          <strong className="text-stone-800 block text-[11px] uppercase tracking-wider mb-1">Billing Office</strong>
                          <p className="text-stone-500">
                            Dr. Olivia Clinical Pediatrics Specialist<br />
                            Intelly-Core Medical Hub, Tower B<br />
                            Suite 404, San Francisco, CA<br />
                            <span className="font-mono text-stone-400">+1 (555) 019-2831</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <strong className="text-stone-800 block text-[11px] uppercase tracking-wider mb-1">Invoice Recipient</strong>
                          <p className="text-stone-500">
                            <span className="font-semibold text-stone-800 text-[11px]">{previewingInvoice.clientName}</span><br />
                            Primary Account holder<br />
                            Email: {previewingInvoice.clientEmail}<br />
                            Due Date: <span className="text-rose-500 font-bold">{previewingInvoice.dueDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status indicator stamp */}
                      <div className="flex justify-center my-4">
                        <div className={`border-2 rounded-xl py-1 px-4 text-xs font-bold uppercase tracking-widest ${
                          previewingInvoice.status === 'Paid'
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 rotate-[-1deg]'
                            : 'border-amber-500 text-amber-600 bg-amber-50/50 rotate-[1deg]'
                        }`}>
                          Payment Status: {previewingInvoice.status}
                        </div>
                      </div>

                      {/* Line items billing grid */}
                      <div className="my-5">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="border-b border-stone-200 text-[10px] font-bold uppercase text-stone-400">
                              <th className="pb-2">Clinical Service Description</th>
                              <th className="pb-2 text-center">Qty</th>
                              <th className="pb-2 text-right">Unit Price</th>
                              <th className="pb-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-stone-600">
                            {(previewingInvoice.items || []).map((item: any, i: number) => (
                              <tr key={i} className="hover:bg-stone-50/50">
                                <td className="py-2 font-medium text-stone-800">{item.description}</td>
                                <td className="py-2 text-center font-mono">{item.quantity}</td>
                                <td className="py-2 text-right font-mono">${item.price.toFixed(2)}</td>
                                <td className="py-2 text-right font-mono font-bold text-stone-800">${(item.quantity * item.price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Computations totals block */}
                      {(() => {
                        const sub = (previewingInvoice.items || []).reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
                        const tax = sub * 0.10;
                        const grand = sub + tax;
                        return (
                          <div className="flex justify-end pt-3 border-t border-stone-200">
                            <div className="w-48 text-[11px] space-y-1 text-stone-500">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-mono text-stone-800">${sub.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Regulatory Tax (10%):</span>
                                <span className="font-mono text-stone-800">${tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-t border-stone-200 pt-1.5 text-stone-900 font-bold text-xs">
                                <span>Grand Total:</span>
                                <span className="font-mono font-serif text-sm">${previewingInvoice.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Footer Disclaimer */}
                      <div className="border-t border-stone-100 pt-4 mt-6 text-center text-[9px] text-stone-400 space-y-1">
                        <p>This medical billing statement is generated securely under the HIPAA Compliance Act 1996.</p>
                        <p>Authorized Signature: _______________________ &middot; Stamp: <strong>Intelly Med, Inc.</strong></p>
                      </div>

                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* TAB: My Articles */}
        {activeTab === 'articles' && (
          <motion.div
            key="articles-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A]">
                  Publications & Research
                </h1>
                <p className="text-xs text-stone-400 mt-1">Manage, draft, and view statistics for clinical articles and publications</p>
              </div>

              <button
                onClick={() => setIsNewArticleOpen(true)}
                className="bg-stone-950 hover:bg-stone-800 text-white text-xs font-sans font-semibold py-2.5 px-5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200/60 rounded-[20px] p-4">
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase block">Total Articles</span>
                <span className="text-2xl font-serif font-bold text-stone-800 mt-1 block">{articles.length}</span>
              </div>
              <div className="bg-white border border-stone-200/60 rounded-[20px] p-4">
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase block">Total Citations</span>
                <span className="text-2xl font-serif font-bold text-[#1F618D] mt-1 block">
                  {articles.reduce((acc, art) => acc + art.citations, 0)}
                </span>
              </div>
              <div className="bg-white border border-stone-200/60 rounded-[20px] p-4">
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase block">Global Views</span>
                <span className="text-2xl font-serif font-bold text-[#117A65] mt-1 block">
                  {articles.reduce((acc, art) => acc + art.views, 0)}
                </span>
              </div>
              <div className="bg-white border border-stone-200/60 rounded-[20px] p-4">
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase block">Total Likes</span>
                <span className="text-2xl font-serif font-bold text-pink-600 mt-1 block">
                  {articles.reduce((acc, art) => acc + art.likes, 0)}
                </span>
              </div>
            </div>

            {/* Filters & Search Row */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="text" 
                  value={articlesSearch}
                  onChange={(e) => setArticlesSearch(e.target.value)}
                  placeholder="Search articles by title, journal or keyword..." 
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-10 text-xs text-stone-800 outline-none focus:border-stone-400"
                />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(art => 
                  art.title.toLowerCase().includes(articlesSearch.toLowerCase()) ||
                  art.journal.toLowerCase().includes(articlesSearch.toLowerCase()) ||
                  art.category.toLowerCase().includes(articlesSearch.toLowerCase())
                )
                .map((art) => (
                  <div 
                    key={art.id}
                    className="bg-white border border-stone-200/60 rounded-[24px] p-6 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          art.category === 'Peer-Reviewed' 
                            ? 'bg-blue-50 text-blue-700' 
                            : art.category === 'Clinical Finance'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {art.category}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">{art.date}</span>
                      </div>

                      <h3 className="text-base font-serif font-semibold text-stone-800 tracking-tight leading-snug hover:text-stone-900 transition-colors">
                        "{art.title}"
                      </h3>
                      <p className="text-[11px] text-stone-400 font-sans italic mt-2">
                        Published in <strong className="text-stone-500 font-medium">{art.journal}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-stone-400 text-[11px]">
                        <span className="flex items-center gap-1" title="Citations count">
                          <Award className="w-3.5 h-3.5 text-stone-400" /> <strong>{art.citations}</strong>
                        </span>
                        <span className="flex items-center gap-1" title="View counts">
                          <Eye className="w-3.5 h-3.5 text-stone-400" /> {art.views}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setArticles(articles.map(a => a.id === art.id ? { ...a, likes: a.likes + 1, views: a.views + 1 } : a));
                          }}
                          className="bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold text-[10px] px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                        >
                          <Heart className="w-3 h-3 fill-pink-600 text-pink-600" />
                          <span>{art.likes}</span>
                        </button>

                        <button
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this publication?")) {
                              setArticles(articles.filter(a => a.id !== art.id));
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Create Article Dialog */}
            {isNewArticleOpen && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-stone-100 relative"
                >
                  <button 
                    onClick={() => setIsNewArticleOpen(false)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
                    Draft New Article
                  </h2>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if(!newArticleTitle.trim() || !newArticleJournal.trim()) return;
                      setArticles([
                        ...articles,
                        {
                          id: Date.now(),
                          title: newArticleTitle,
                          journal: newArticleJournal,
                          date: "Jul 2026",
                          citations: 0,
                          category: newArticleCategory,
                          views: 1,
                          likes: 0
                        }
                      ]);
                      setNewArticleTitle('');
                      setNewArticleJournal('');
                      setIsNewArticleOpen(false);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Article Title</label>
                      <input 
                        type="text" 
                        required
                        value={newArticleTitle}
                        onChange={(e) => setNewArticleTitle(e.target.value)}
                        placeholder="e.g. Advancements in Geriatric Nephrology" 
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none focus:border-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Target Journal / Publisher</label>
                      <input 
                        type="text" 
                        required
                        value={newArticleJournal}
                        onChange={(e) => setNewArticleJournal(e.target.value)}
                        placeholder="e.g. Journal of Clinical Medicine" 
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none focus:border-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Category / Discipline</label>
                      <select
                        value={newArticleCategory}
                        onChange={(e) => setNewArticleCategory(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl py-2 px-3 text-xs text-stone-800 outline-none"
                      >
                        <option value="Peer-Reviewed">Peer-Reviewed Research</option>
                        <option value="Clinical Finance">Clinical Finance & Coding</option>
                        <option value="Therapeutics">Therapeutics & Geriatrics</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-sans font-bold py-2.5 rounded-xl transition-colors mt-2"
                    >
                      Save Draft & Publish
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB: Billing Settings & Codes */}
        {activeTab === 'billing' && (
          <motion.div
            key="billing-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A]">
                Fees & Coding Configuration
              </h1>
              <p className="text-xs text-stone-400 mt-1">Configure standard clinic charges, edit fees, and reference standard medical insurance billing tags</p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Clinic Fee Schedule (Col span 7) */}
              <div className="lg:col-span-7 bg-white border border-stone-200/60 rounded-[24px] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-serif font-bold text-stone-800">Clinic Fee Schedule</h3>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Standard Services</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5">Medical Service</th>
                        <th className="py-2.5">Coding standard</th>
                        <th className="py-2.5 text-right">Standard Fee</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100/60 text-xs text-stone-700">
                      {billingFees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-3 font-medium text-stone-800">{fee.service}</td>
                          <td className="py-3 font-mono text-[11px] text-stone-400">{fee.code}</td>
                          <td className="py-3 text-right font-serif font-bold text-stone-800">
                            {editingFeeId === fee.id ? (
                              <input 
                                type="number" 
                                value={editingFeeVal} 
                                onChange={(e) => setEditingFeeVal(e.target.value)}
                                className="w-20 bg-stone-100 text-stone-800 text-right py-0.5 px-1.5 rounded outline-none text-xs border border-stone-300"
                              />
                            ) : (
                              `$${fee.fee.toFixed(2)}`
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {editingFeeId === fee.id ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    setBillingFees(billingFees.map(f => f.id === fee.id ? { ...f, fee: Number(editingFeeVal) || f.fee } : f));
                                    setEditingFeeId(null);
                                  }}
                                  className="bg-emerald-50 text-emerald-600 rounded px-2 py-0.5 font-bold hover:bg-emerald-100"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingFeeId(null)}
                                  className="bg-stone-100 text-stone-500 rounded px-2 py-0.5 hover:bg-stone-200"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingFeeId(fee.id);
                                  setEditingFeeVal(fee.fee.toString());
                                }}
                                className="text-[#80CBC4] hover:text-stone-800 font-semibold transition-colors"
                              >
                                Edit Fee
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Configurations and ICD-10 Coding Lookup (Col span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Insurance & Synchronization Controls */}
                <div className="bg-white border border-stone-200/60 rounded-[24px] p-6 space-y-4">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-sm font-serif font-bold text-stone-800">Billing Integrations</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Stripe Terminal toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800">Stripe Terminal Auto-Sync</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">Push completed sessions directly to checkout card readers</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setStripeTerminalMode(!stripeTerminalMode)}
                        className={`w-11 h-6 rounded-full transition-all relative flex items-center p-0.5 outline-none ${
                          stripeTerminalMode ? 'bg-stone-900 justify-end' : 'bg-stone-200 justify-start'
                        }`}
                      >
                        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Auto claim dispatch */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800">Auto Claim Dispatch</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">Deliver insurance bills instantly post-consultation</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setAutoDispatchClaims(!autoDispatchClaims)}
                        className={`w-11 h-6 rounded-full transition-all relative flex items-center p-0.5 outline-none ${
                          autoDispatchClaims ? 'bg-stone-900 justify-end' : 'bg-stone-200 justify-start'
                        }`}
                      >
                        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>

                    {/* Invoice Copy Portal */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-stone-800">Patient Copy Invoice</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">Send billing receipts automatically to patient's Intelly Portal</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setCopyInvoicePortal(!copyInvoicePortal)}
                        className={`w-11 h-6 rounded-full transition-all relative flex items-center p-0.5 outline-none ${
                          copyInvoicePortal ? 'bg-stone-900 justify-end' : 'bg-stone-200 justify-start'
                        }`}
                      >
                        <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ICD-10 / CPT Code finder */}
                <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-[24px] p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#80CBC4]" />
                    <h3 className="text-sm font-serif font-bold text-stone-800">ICD-10 & CPT Code Index</h3>
                  </div>

                  <p className="text-[11px] text-stone-500">Live search engine for diagnostic billing classification labels</p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <input 
                      type="text" 
                      value={codingSearch}
                      onChange={(e) => setCodingSearch(e.target.value)}
                      placeholder="Type search: Hypertension, CKD, Diabetes..." 
                      className="w-full bg-white border border-stone-200 rounded-xl py-2 px-9 text-xs text-stone-800 outline-none focus:border-stone-400"
                    />
                  </div>

                  {/* Results list */}
                  <div className="bg-white rounded-xl border border-stone-150 p-2 space-y-1.5 max-h-[160px] overflow-y-auto">
                    {[
                      { code: 'I10', desc: 'Essential (primary) hypertension', category: 'ICD-10-CM' },
                      { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', category: 'ICD-10-CM' },
                      { code: 'N18.30', desc: 'Chronic kidney disease, stage 3 unspecified', category: 'ICD-10-CM' },
                      { code: '99213', desc: 'Office outpatient visit, 15 minutes consultation', category: 'CPT-Code' },
                      { code: '99214', desc: 'Office outpatient visit, 25 minutes consultation', category: 'CPT-Code' },
                      { code: 'Z00.00', desc: 'Encounter for general adult medical examination', category: 'ICD-10-CM' }
                    ]
                    .filter(c => 
                      codingSearch === '' || 
                      c.code.toLowerCase().includes(codingSearch.toLowerCase()) || 
                      c.desc.toLowerCase().includes(codingSearch.toLowerCase())
                    )
                    .map((item, idx) => (
                      <div key={idx} className="p-2 hover:bg-stone-50 rounded-lg flex items-center justify-between text-[11px]">
                        <div>
                          <strong className="text-stone-800 bg-stone-100 px-1.5 py-0.5 rounded font-mono text-[10px]">{item.code}</strong>
                          <span className="text-stone-600 ml-2 font-medium">{item.desc}</span>
                        </div>
                        <span className="text-[9px] text-stone-400 bg-stone-50 px-1 rounded border border-stone-100 uppercase">{item.category}</span>
                      </div>
                    ))}
                    {codingSearch !== '' && [
                      { code: 'I10', desc: 'Essential (primary) hypertension', category: 'ICD-10-CM' },
                      { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', category: 'ICD-10-CM' },
                      { code: 'N18.30', desc: 'Chronic kidney disease, stage 3 unspecified', category: 'ICD-10-CM' },
                      { code: '99213', desc: 'Office outpatient visit, 15 minutes consultation', category: 'CPT-Code' },
                      { code: '99214', desc: 'Office outpatient visit, 25 minutes consultation', category: 'CPT-Code' },
                      { code: 'Z00.00', desc: 'Encounter for general adult medical examination', category: 'ICD-10-CM' }
                    ].filter(c => 
                      c.code.toLowerCase().includes(codingSearch.toLowerCase()) || 
                      c.desc.toLowerCase().includes(codingSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-center text-[10px] text-stone-400 py-4">No matching codes found. Try typing "CKD" or "9921"</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB: Documents vault (Supports drag & drop and clicked manual selection upload) */}
        {activeTab === 'documents' && (
          <motion.div
            key="documents-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1A1A1A]">
                Clinical Document Vault
              </h1>
              <p className="text-xs text-stone-400 mt-1">Access medical consent templates, HIPAA forms, and patient-uploaded image records safely</p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingDoc(true);
              }}
              onDragLeave={() => setIsDraggingDoc(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingDoc(false);
                const files = e.dataTransfer.files;
                if(files.length > 0) {
                  const f = files[0];
                  setClinicalDocs([
                    ...clinicalDocs,
                    {
                      id: `doc-${Date.now()}`,
                      name: f.name,
                      size: f.size > 1048576 
                        ? `${(f.size/1048576).toFixed(1)} MB` 
                        : `${Math.round(f.size/1024)} KB`,
                      category: docCategoryFilter === 'All' ? 'Clinical Protocols' : docCategoryFilter,
                      date: new Date().toISOString().split('T')[0]
                    }
                  ]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[24px] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDraggingDoc 
                  ? 'border-stone-800 bg-stone-50' 
                  : 'border-stone-200/60 bg-white hover:bg-stone-50/50 hover:border-stone-400'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => {
                  const files = e.target.files;
                  if(files && files.length > 0) {
                    const f = files[0];
                    setClinicalDocs([
                      ...clinicalDocs,
                      {
                        id: `doc-${Date.now()}`,
                        name: f.name,
                        size: f.size > 1048576 
                          ? `${(f.size/1048576).toFixed(1)} MB` 
                          : `${Math.round(f.size/1024)} KB`,
                        category: docCategoryFilter === 'All' ? 'Clinical Protocols' : docCategoryFilter,
                        date: new Date().toISOString().split('T')[0]
                      }
                    ]);
                  }
                }}
                className="hidden" 
              />
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-stone-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  {isDraggingDoc ? "Drop document to upload!" : "Drag & drop files here, or click to browse local files"}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">Supports PDF, DOCX, JPEG, or DICOM scanner media files</p>
              </div>
            </div>

            {/* Document Vault Lists */}
            <div className="bg-white border border-stone-200/60 rounded-[24px] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-3">
                <h3 className="text-sm font-serif font-bold text-stone-800">Clinical Library Vault</h3>
                
                {/* Category filters inside library */}
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Consent Forms', 'HIPAA & Compliance', 'Referral Templates', 'Clinical Protocols'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDocCategoryFilter(cat)}
                      className={`text-[10px] font-sans font-medium px-2.5 py-1 rounded-full transition-all ${
                        docCategoryFilter === cat 
                          ? 'bg-stone-900 text-white' 
                          : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinicalDocs
                  .filter(doc => docCategoryFilter === 'All' || doc.category === docCategoryFilter)
                  .map((doc) => (
                    <div key={doc.id} className="border border-stone-150 rounded-xl p-4 flex items-center justify-between hover:border-stone-300 hover:bg-stone-50/55 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-800 truncate max-w-xs sm:max-w-md" title={doc.name}>
                            {doc.name}
                          </h4>
                          <p className="text-[10px] text-stone-400 mt-0.5">{doc.size} • {doc.category} • Uploaded {doc.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => alert(`Downloading file: ${doc.name}`)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm(`Are you sure you want to permanently delete "${doc.name}"?`)) {
                              setClinicalDocs(clinicalDocs.filter(d => d.id !== doc.id));
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: Settings Workspace */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className={`text-3xl font-serif font-semibold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Clinician Workspace Settings
              </h1>
              <p className="text-xs text-stone-400 mt-1">Configure your personal profile metadata, consultation parameters, and HIPAA security variables</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Profile Card & Parameters Form (Col span 8) */}
              <div className={`${themeMode === 'galaxy' 
                ? 'bg-[#0E0C22]/85 border border-indigo-950/70 text-stone-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] backdrop-blur-md' 
                : themeMode === 'dark'
                ? 'bg-[#18181B]/95 border border-zinc-800/80 text-stone-100 shadow-md backdrop-blur-md'
                : 'bg-white border border-stone-200/60 text-stone-800 shadow-xs'
              } lg:col-span-8 p-6 rounded-[24px] space-y-6`}>
                <div>
                  <h3 className={`text-sm font-serif font-bold border-b border-stone-200/10 pb-3 ${isDark ? 'text-white' : 'text-stone-800'}`}>Clinician Identity Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Doctor Name</label>
                    <input 
                      type="text" 
                      value={profDoctorName}
                      onChange={(e) => setProfDoctorName(e.target.value)}
                      placeholder="e.g. Olivia" 
                      className={`w-full ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Clinical Title / Specialty</label>
                    <input 
                      type="text" 
                      value={profDoctorSpecialty}
                      onChange={(e) => setProfDoctorSpecialty(e.target.value)}
                      placeholder="e.g. Pediatrics" 
                      className={`w-full ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Primary Email Office</label>
                    <input 
                      type="email" 
                      value={doctorEmail}
                      onChange={(e) => setDoctorEmail(e.target.value)}
                      placeholder="olivia@clinic.com" 
                      className={`w-full ${inputStyle}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Clinic Desk Line</label>
                    <input 
                      type="text" 
                      value={doctorPhone}
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567" 
                      className={`w-full ${inputStyle}`}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200/15">
                  <h3 className={`text-sm font-serif font-bold mb-4 ${isDark ? 'text-white' : 'text-stone-800'}`}>Consultation Room Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Inter-appointment Buffer</label>
                      <select 
                        value={consultationBuffer}
                        onChange={(e) => setConsultationBuffer(e.target.value)}
                        className={`w-full bg-stone-100/5 text-stone-200 border border-stone-200/20 rounded-xl py-2.5 px-3 text-xs outline-none`}
                      >
                        <option value="5 minutes">5 minutes spacing</option>
                        <option value="10 minutes">10 minutes spacing</option>
                        <option value="15 minutes">15 minutes spacing</option>
                        <option value="30 minutes">30 minutes spacing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Telemedicine URL Room</label>
                      <input 
                        type="text" 
                        value={telemedicineLink}
                        onChange={(e) => setTelemedicineLink(e.target.value)}
                        placeholder="https://zoom.us/dr-olivia" 
                        className={`w-full ${inputStyle}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Theme & Brand customization segment */}
                <div className="pt-6 border-t border-stone-200/15">
                  <h3 className={`text-sm font-serif font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
                    <Palette className="w-4 h-4 text-stone-400 animate-pulse" />
                    Visual Theme & Brand Presets
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Display Mode</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { mode: 'light', label: 'Light Clean', desc: 'Standard luxury cream background' },
                          { mode: 'dark', label: 'Clinical Slate', desc: 'Sleek professional grey background' },
                          { mode: 'galaxy', label: 'Galaxy Night', desc: 'Constellation starry blue-purple space' }
                        ].map((item) => (
                          <button
                            key={item.mode}
                            type="button"
                            onClick={() => setThemeMode(item.mode as any)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              themeMode === item.mode
                                ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                                : 'border-stone-200/20 hover:border-stone-200/40 bg-stone-500/5'
                            }`}
                          >
                            <div>
                              <span className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>{item.label}</span>
                              <span className="block text-[9px] text-stone-400 mt-0.5">{item.desc}</span>
                            </div>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              themeMode === item.mode ? 'border-indigo-400 bg-indigo-500' : 'border-stone-500'
                            }`}>
                              {themeMode === item.mode && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brand Accent colors */}
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Brand Accent Color</label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { color: 'teal', value: '#80CBC4', label: 'Emerald Teal' },
                          { color: 'purple', value: '#EA80FC', label: 'Amethyst Purple' },
                          { color: 'amber', value: '#FFC107', label: 'Saffron Amber' },
                          { color: 'blue', value: '#2196F3', label: 'Sapphire Blue' },
                          { color: 'rose', value: '#E91E63', label: 'Morganite Rose' }
                        ].map((item) => (
                          <button
                            key={item.color}
                            type="button"
                            onClick={() => setThemeColor(item.color as any)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                              themeColor === item.color
                                ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                                : 'border-stone-200/25 hover:scale-102'
                            }`}
                            style={{ backgroundColor: item.value }}
                            title={item.label}
                          >
                            {themeColor === item.color && (
                              <Check className="w-5 h-5 text-stone-950 font-bold drop-shadow" />
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-3.5 leading-relaxed">
                        Modifies interactive buttons, glow metrics, dynamic sidebar frames, and highlights globally.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar Behavior Settings Segment */}
                <div className="pt-6 border-t border-stone-200/15">
                  <h3 className={`text-sm font-serif font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-stone-800'}`}>
                    <ChevronRight className="w-4 h-4 text-stone-400 animate-pulse" />
                    Sidebar Interaction Settings
                  </h3>

                  <div className="p-4 bg-stone-500/5 rounded-2xl border border-stone-200/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>
                        Auto Hover Expansion (YouTube-Style)
                      </span>
                      <span className="block text-[10px] text-stone-400 mt-1 leading-relaxed">
                        When collapsed, hovering over icons instantly opens the sidebar menu, automatically closing 0.5s after the cursor leaves. Disable for standard click-to-expand.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        key="hover-expand-true"
                        type="button"
                        onClick={() => setSidebarHoverExpand(true)}
                        className={`text-[10px] font-sans font-bold px-3.5 py-2 rounded-xl border transition-all ${
                          sidebarHoverExpand 
                            ? 'bg-indigo-500/15 border-indigo-500 text-indigo-400 ring-1 ring-indigo-500 shadow-md' 
                            : 'border-stone-200/20 text-stone-400 hover:border-stone-200/40'
                        }`}
                      >
                        Enabled (Default)
                      </button>
                      <button
                        key="hover-expand-false"
                        type="button"
                        onClick={() => setSidebarHoverExpand(false)}
                        className={`text-[10px] font-sans font-bold px-3.5 py-2 rounded-xl border transition-all ${
                          !sidebarHoverExpand 
                            ? 'bg-stone-500/15 border-stone-400 text-stone-200 shadow-sm' 
                            : 'border-stone-200/20 text-stone-400 hover:border-stone-200/40'
                        }`}
                      >
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 italic">Settings synchronize instantly with your local session database.</span>
                  <button 
                    type="button"
                    onClick={() => alert("Clinician settings profiles and branding presets have been saved successfully!")}
                    className={`text-xs font-sans font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${getAccentBg()}`}
                  >
                    Save Workspace Changes
                  </button>
                </div>
              </div>

              {/* Info Security sidebar (Col span 4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Security Status Box */}
                <div className={`${themeMode === 'galaxy' 
                  ? 'bg-[#0E0C22]/85 border border-indigo-950/70 text-stone-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] backdrop-blur-md' 
                  : themeMode === 'dark'
                  ? 'bg-[#18181B]/95 border border-zinc-800/80 text-stone-100 shadow-md backdrop-blur-md'
                  : 'bg-white border border-stone-200/60 text-stone-800 shadow-xs'
                } p-6 rounded-[24px] space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <h3 className={`text-sm font-serif font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}>Security & Integrity</h3>
                  </div>

                  <p className="text-[11px] text-stone-400 leading-relaxed">Your clinic credentials are systematically verified with encrypted HIPAA compliance hashes.</p>

                  <div className="space-y-2 text-xs">
                    <div className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-[#0F0D24] border-indigo-950' : 'bg-stone-50 border-stone-100'}`}>
                      <span className="text-stone-400 text-[10px]">Database Encryption</span>
                      <strong className="text-emerald-500 text-[11px] font-bold">AES-256 Enabled</strong>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-[#0F0D24] border-indigo-950' : 'bg-stone-50 border-stone-100'}`}>
                      <span className="text-stone-400 text-[10px]">Firebase Cloud Sync</span>
                      <strong className={`text-[11px] font-bold ${getAccentText()}`}>Synchronized</strong>
                    </div>

                    <div className={`p-3 rounded-xl flex items-center justify-between border ${isDark ? 'bg-[#0F0D24] border-indigo-950' : 'bg-stone-50 border-stone-100'}`}>
                      <span className="text-stone-400 text-[10px]">HIPAA Rule Audit</span>
                      <strong className="text-emerald-500 text-[11px] font-bold">Passed (Jul 2026)</strong>
                    </div>
                  </div>
                </div>

                {/* API Logs */}
                <div className={`${themeMode === 'galaxy' 
                  ? 'bg-[#0E0C22]/85 border border-indigo-950/70 text-stone-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] backdrop-blur-md' 
                  : themeMode === 'dark'
                  ? 'bg-[#18181B]/95 border border-zinc-800/80 text-stone-100 shadow-md backdrop-blur-md'
                  : 'bg-white border border-stone-200/60 text-stone-800 shadow-xs'
                } p-6 rounded-[24px] space-y-3`}>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Active Workspace Logs</h3>
                  <div className="space-y-2 text-[10px] font-mono text-stone-400">
                    <p className="flex items-start gap-1">
                      <span className={getAccentText()}>[OK]</span> 
                      <span>Logged in under Dr. Olivia credentials</span>
                    </p>
                    <p className="flex items-start gap-1">
                      <span className={getAccentText()}>[OK]</span> 
                      <span>Re-established connection to Intelly-Core-Server</span>
                    </p>
                    <p className="flex items-start gap-1">
                      <span className={getAccentText()}>[OK]</span> 
                      <span>Validated Stripe payment token terminal</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB: Interactive Monthly Clinical Calendar */}
        {activeTab === 'calendar' && <CalendarWorkspace />}

        {/* TAB: Clinical Notes & Daily Checklist */}
        {activeTab === 'notes' && <NotesWorkspace />}

      </AnimatePresence>
    </main>
  );
}
