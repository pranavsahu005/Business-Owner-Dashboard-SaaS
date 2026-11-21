import { create } from 'zustand';
import { 
  PatientBill, 
  WaitingBill,
  LatestTransaction,
  ScheduleAppointment, 
  LearningSubject, 
  LearningEvent,
  PatientRecord,
  ChatMessage,
  DateRangeState,
  CalendarEvent,
  ClinicalNote,
  DailyTask,
  AppNotification,
  ToastItem
} from './types';
import { getPresetDateRange } from './utils/analyticsData';

interface ClinicalState {
  // Navigation & View Control
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  sidebarHoverExpand: boolean;
  setSidebarHoverExpand: (hoverExpand: boolean) => void;
  
  // Theme Controls
  themeMode: 'light' | 'dark' | 'galaxy';
  setThemeMode: (mode: 'light' | 'dark' | 'galaxy') => void;
  themeColor: 'teal' | 'purple' | 'amber' | 'blue' | 'rose';
  setThemeColor: (color: 'teal' | 'purple' | 'amber' | 'blue' | 'rose') => void;

  // Invoices for Home / Business Owners
  invoices: {
    id: string | number;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    issueDate: string;
    dueDate: string;
    items: { description: string; quantity: number; price: number }[];
    totalAmount: number;
    status: 'Paid' | 'Pending' | 'Draft' | 'Sent';
  }[];
  addInvoice: (invoice: any) => void;
  deleteInvoice: (id: string | number) => void;
  updateInvoiceStatus: (id: string | number, status: 'Paid' | 'Pending' | 'Draft' | 'Sent') => void;

  // Doctor/User info
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'all' | 'patients' | 'education' | 'prescriptions' | 'results';
  setSearchFilter: (filter: 'all' | 'patients' | 'education' | 'prescriptions' | 'results') => void;
  
  // State Lists
  patientBills: PatientBill[];
  waitingBills: WaitingBill[];
  latestTransactions: LatestTransaction[];
  scheduleAppointments: ScheduleAppointment[];
  learningSubjects: LearningSubject[];
  learningEvents: LearningEvent[];
  patients: PatientRecord[];
  
  // Actions
  addPatient: (patient: Omit<PatientRecord, 'id' | 'lastVisit'>) => void;
  requestBillPayment: (id: string) => void;
  updateBillStatus: (id: string, status: PatientBill['status']) => void;
  joinAppointment: (id: string) => void;
  completeSubject: (id: string) => void;
  
  // AI Assistant Chat state
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  isChatLoading: boolean;
  sendChatMessage: (content: string) => Promise<void>;

  // Dynamic Date Range Filter
  dateRange: DateRangeState;
  setDateRange: (range: DateRangeState) => void;

  // Interactive Calendar Events
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  toggleCalendarEvent: (id: string) => void;
  deleteCalendarEvent: (id: string) => void;

  // Clinical Notes & Scratchpad
  notes: ClinicalNote[];
  addNote: (note: Omit<ClinicalNote, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, patch: Partial<ClinicalNote>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Daily Tasks & Checklist
  tasks: DailyTask[];
  addTask: (text: string, priority?: DailyTask['priority'], dueDate?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Slide-over Quick Tools Drawer
  quickDrawerOpen: boolean;
  setQuickDrawerOpen: (open: boolean) => void;
  quickDrawerTab: 'notes' | 'tasks' | 'calendar';
  setQuickDrawerTab: (tab: 'notes' | 'tasks' | 'calendar') => void;

  // Toast Notification
  toast: ToastItem | null;
  showToast: (message: string, type?: ToastItem['type']) => void;
  clearToast: () => void;
}

export const useStore = create<ClinicalState>((set, get) => ({
  activeTab: 'home', // Set Home Invoice Generator as the default active tab
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  isAuthenticated: true,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  sidebarHoverExpand: true,
  setSidebarHoverExpand: (hoverExpand) => set({ sidebarHoverExpand: hoverExpand }),
  
  // Theme state
  themeMode: 'light',
  setThemeMode: (mode) => set({ themeMode: mode }),
  themeColor: 'teal',
  setThemeColor: (color) => set({ themeColor: color }),

  // Invoice list state
  invoices: [
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-001",
      clientName: "Acme Healthcare Corp",
      clientEmail: "billing@acmehealth.com",
      issueDate: "2026-07-01",
      dueDate: "2026-07-15",
      items: [
        { description: "Telehealth Consultation Platform Integration", quantity: 1, price: 1200.00 },
        { description: "ICD-10 Diagnostic Training Session", quantity: 3, price: 250.00 }
      ],
      totalAmount: 1950.00,
      status: "Paid"
    },
    {
      id: "inv-2",
      invoiceNumber: "INV-2026-002",
      clientName: "Metropolitan Geriatrics",
      clientEmail: "finance@metrogeriatrics.org",
      issueDate: "2026-07-05",
      dueDate: "2026-07-20",
      items: [
        { description: "Geriatric Care Protocol Advisory", quantity: 10, price: 150.00 },
        { description: "Custom Billing Compliance Mapping", quantity: 1, price: 850.00 }
      ],
      totalAmount: 2350.00,
      status: "Pending"
    },
    {
      id: "inv-3",
      invoiceNumber: "INV-2026-003",
      clientName: "St. Jude Outpatient Clinic",
      clientEmail: "ap@stjudeclinics.com",
      issueDate: "2026-07-07",
      dueDate: "2026-07-25",
      items: [
        { description: "Pediatric Coding Advisory & CPT Setup", quantity: 1, price: 950.00 }
      ],
      totalAmount: 950.00,
      status: "Draft"
    }
  ],
  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
  deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter(inv => inv.id !== id) })),
  updateInvoiceStatus: (id, status) => set((state) => ({
    invoices: state.invoices.map(inv => inv.id === id ? { ...inv, status } : inv)
  })),
  
  doctorName: 'Olivia',
  doctorSpecialty: 'Internal Medicine & Clinical Director',
  doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilter: 'all',
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  // High-fidelity Billing Data matching image 1
  patientBills: [
    {
      id: "3586895",
      type: 'Telemedicine',
      sendDate: '11/19/26',
      isoDate: '2026-11-19',
      name: 'Rachel Meyers',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '11/28/26',
      status: 'Requested',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "4829304",
      type: 'In clinic',
      sendDate: '11/17/26',
      isoDate: '2026-11-17',
      name: 'Samantha Williams',
      amount: 420.00,
      recipient: 'Samantha Williams',
      dueDate: '-',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "9283748",
      type: 'Insurance',
      sendDate: '11/15/26',
      isoDate: '2026-11-15',
      name: 'Amy White',
      amount: 295.50,
      recipient: '123324 GEICO',
      dueDate: '11/30/26',
      status: 'Sent',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "5849203",
      type: 'In clinic',
      sendDate: '11/10/26',
      isoDate: '2026-11-10',
      name: 'Tyler Young',
      amount: 510.00,
      recipient: '123456 American Family Insurance',
      dueDate: '-',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "3920194",
      type: 'Telemedicine',
      sendDate: '10/28/26',
      isoDate: '2026-10-28',
      name: 'Amy White',
      amount: 185.00,
      recipient: '123324 GEICO',
      dueDate: '11/12/26',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "2930492",
      type: 'Telemedicine',
      sendDate: '10/14/26',
      isoDate: '2026-10-14',
      name: 'Rachel Meyers',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '10/28/26',
      status: 'Requested',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "1930294",
      type: 'Insurance',
      sendDate: '09/22/26',
      isoDate: '2026-09-22',
      name: 'Rachel Meyers',
      amount: 640.00,
      recipient: '123456 American Family Insurance',
      dueDate: '10/06/26',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    }
  ],

  waitingBills: [
    {
      id: 'wb1',
      name: 'Samantha Williams',
      type: 'Ophthalmology • Routine Check-up',
      date: '12/12/24',
      time: '09:15 AM',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
      amount: 145.00
    },
    {
      id: 'wb2',
      name: 'Amy White',
      type: 'Otolaryngology • Video Consultation',
      date: '12/12/24',
      time: '09:45 AM',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      amount: 85.00
    }
  ],

  latestTransactions: [
    {
      id: 't1',
      companyName: 'GEICO Insurance',
      source: '324343 IntellyMed',
      amount: 568.56,
      timeAgo: '15 min ago'
    },
    {
      id: 't2',
      companyName: 'Williamson T.',
      source: '24245 Dr.Olivia Clin',
      amount: 465.40,
      timeAgo: '15 min ago'
    },
    {
      id: 't3',
      companyName: 'GEICO Insurance',
      source: '324343 IntellyMed',
      amount: 120.00,
      timeAgo: '1 hr ago'
    }
  ],

  // High-fidelity Schedule Appointments matching Image 1 (Schedule tab)
  scheduleAppointments: [
    {
      id: "a1",
      title: "Emergency visit",
      type: "Emergency",
      timeStart: "07:00",
      timeEnd: "07:30",
      room: "Room 302",
      colorTheme: "peach",
      participants: [
        { name: "John Doe", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a2",
      title: "Online visit",
      type: "Online",
      timeStart: "07:00",
      timeEnd: "08:00",
      room: "Video Call",
      colorTheme: "purple",
      joined: false,
      participants: [
        { name: "Amy White", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" },
        { name: "Resident Carter", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a3",
      title: "Diagnostic test",
      type: "Diagnostic",
      timeStart: "07:30",
      timeEnd: "07:55",
      room: "Lab 2",
      colorTheme: "grey",
      participants: [
        { name: "Bob Peterson", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a4",
      title: "Team planning",
      type: "Team",
      timeStart: "08:00",
      timeEnd: "09:00",
      room: "Room 200",
      colorTheme: "yellow",
      participants: [
        { name: "Dr. Olivia", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80" },
        { name: "Samantha", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" },
        { name: "Kaito", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a5",
      title: "Follow-up",
      type: "Follow-up",
      timeStart: "08:00",
      timeEnd: "08:30",
      room: "Room 312",
      colorTheme: "grey",
      participants: [
        { name: "Rachel Meyers", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a6",
      title: "Interna visit",
      type: "Clinic",
      timeStart: "08:30",
      timeEnd: "09:00",
      room: "Conference Room 404",
      colorTheme: "blue",
      participants: [
        { name: "Tyler Young", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" }
      ]
    },
    {
      id: "a7",
      title: "Chronic Kidney Disease Treatment",
      type: "Primary Care",
      timeStart: "08:00",
      timeEnd: "08:45",
      room: "Room 102",
      colorTheme: "blue",
      isInProgress: true,
      participants: [
        { name: "Elder Jenkins", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" }
      ]
    }
  ],

  // High-fidelity "Dei" Learning plan subjects matching image 2
  learningSubjects: [
    {
      id: 'ls1',
      title: 'Medical Terminology',
      description: 'Learn basic medical language for effective communication.',
      status: 'Completed',
      progressPercent: 100,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
      ],
      linkNodeIds: ['ls2', 'ls3']
    },
    {
      id: 'ls2',
      title: 'Pharmacology Basics',
      description: 'Learn basic medical language for effective communication.',
      status: 'In Progress',
      watchTimeLeft: 'Watching 00:30',
      progressPercent: 45,
      avatars: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80'
      ],
      linkNodeIds: ['ls5']
    },
    {
      id: 'ls3',
      title: 'Anatomy and Physiology',
      description: 'Understand the structure and function of the human body.',
      status: 'Completed',
      progressPercent: 100,
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
      ],
      linkNodeIds: ['ls4']
    },
    {
      id: 'ls4',
      title: 'Medical Ethics and Professionalism',
      description: 'Understand ethical principles and professionalism in healthcare.',
      status: 'Upcoming',
      progressPercent: 0,
      isLocked: false,
      linkNodeIds: []
    },
    {
      id: 'ls5',
      title: 'Disease Pathophysiology',
      description: 'Study the cellular and molecular basis of common diseases.',
      status: 'Upcoming',
      progressPercent: 0,
      isLocked: true,
      linkNodeIds: []
    }
  ],

  // Events list matching Dei image
  learningEvents: [
    {
      id: 'le1',
      type: 'Webinar',
      title: 'Understanding Medical Research',
      description: 'Understanding medical research, critical appraisal skills, and applying evidence-based guidelines in practice.',
      time: 'Start at 12:30',
      dateStr: 'Tu, 25.03',
      colorTheme: 'blue'
    },
    {
      id: 'le2',
      type: 'Lesson',
      title: 'Healthcare Delivery Systems',
      description: 'Overview of healthcare delivery systems, health policy, and their impact on patient care.',
      dateStr: 'We, 26.03',
      colorTheme: 'purple'
    },
    {
      id: 'le3',
      type: 'Task',
      title: 'Global Health Issues & Diseases',
      description: 'Examination of major global health issues, including infectious diseases, non-communicable diseases, and healthcare disparities.',
      dateStr: 'Th, 27.03',
      colorTheme: 'yellow'
    },
    {
      id: 'le4',
      type: 'Task',
      title: 'Importance of Teamwork',
      description: 'Importance of teamwork and communication among healthcare professionals for optimal patient outcomes.',
      dateStr: 'Fr, 28.03',
      colorTheme: 'green'
    }
  ],

  // Patients Records List
  patients: [
    {
      id: "P-1092",
      name: "Rachel Meyers",
      age: 28,
      gender: "Female",
      email: "rachel.meyers@gmail.com",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
      lastVisit: "2026-07-02",
      bloodType: "A+",
      diagnosis: "Post-op Follow-up & Routine Consultation",
      insuranceProvider: "American Family Insurance"
    },
    {
      id: "P-1093",
      name: "Samantha Williams",
      age: 34,
      gender: "Female",
      email: "sam.williams@yahoo.com",
      phone: "+1 (555) 876-5432",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
      lastVisit: "2026-07-05",
      bloodType: "O-",
      diagnosis: "Ophthalmic Assessment & Prescription Refill",
      insuranceProvider: "Self-Pay"
    },
    {
      id: "P-1094",
      name: "Amy White",
      age: 29,
      gender: "Female",
      email: "amy.white@outlook.com",
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
      lastVisit: "2026-07-08",
      bloodType: "B+",
      diagnosis: "Otolaryngology Video Call Consultation",
      insuranceProvider: "GEICO Health Plan"
    },
    {
      id: "P-1095",
      name: "Tyler Young",
      age: 41,
      gender: "Male",
      email: "tyler.young@gmail.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
      lastVisit: "2026-07-06",
      bloodType: "AB-",
      diagnosis: "Cardiology Diagnostic Screen",
      insuranceProvider: "American Family Insurance"
    }
  ],

  // Actions
  addPatient: (patientData) => set((state) => {
    const newPatient: PatientRecord = {
      ...patientData,
      id: `P-${Math.floor(Math.random() * 1000) + 1000}`,
      lastVisit: new Date().toISOString().split('T')[0]
    };
    return { patients: [newPatient, ...state.patients] };
  }),

  requestBillPayment: (id) => set((state) => {
    // Adds a new PatientBill of 'Requested' status and removes or updates waiting bill
    const waiting = state.waitingBills.find(wb => wb.id === id);
    if (!waiting) return {};

    const newBill: PatientBill = {
      id: Math.floor(Math.random() * 9000000 + 1000000).toString(),
      type: waiting.type.includes('Video') ? 'Telemedicine' : 'In clinic',
      sendDate: new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }),
      name: waiting.name,
      amount: waiting.amount,
      recipient: waiting.name,
      dueDate: new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }),
      status: 'Requested',
      avatar: waiting.avatar
    };

    return {
      patientBills: [newBill, ...state.patientBills],
      waitingBills: state.waitingBills.filter(wb => wb.id !== id)
    };
  }),

  updateBillStatus: (id, status) => set((state) => ({
    patientBills: state.patientBills.map(b => b.id === id ? { ...b, status } : b)
  })),

  joinAppointment: (id) => set((state) => ({
    scheduleAppointments: state.scheduleAppointments.map(app => 
      app.id === id ? { ...app, joined: true } : app
    )
  })),

  completeSubject: (id) => set((state) => ({
    learningSubjects: state.learningSubjects.map(sub => 
      sub.id === id ? { ...sub, status: 'Completed', progressPercent: 100 } : sub
    )
  })),

  // AI Chat Messages
  chatMessages: [
    {
      id: "initial",
      role: "assistant",
      content: "Hello Dr. Olivia, welcome to your Intelly AI Clinical Companion. I am fully integrated with your billing dashboard, patient records, and schedule. You can ask me to draft invoice summaries, analyze monthly clinical revenue, or explain medical ethics concepts from your learning plan.",
      timestamp: "12:00 PM"
    }
  ],

  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, msg]
  })),

  clearChat: () => set({
    chatMessages: [
      {
        id: "initial",
        role: "assistant",
        content: "How can I assist you with clinical, billing, or schedule workflows today, Dr. Olivia?",
        timestamp: "Now"
      }
    ]
  }),

  isChatLoading: false,
  sendChatMessage: async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isChatLoading: true
    }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: get().chatMessages })
      });
      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMsg]
      }));
    } catch (e) {
      console.error("Failed to chat with Gemini backend:", e);
      // Clinical intelligence fallback responses
      let reply = "I apologize, there was a connection interruption. As an offline-capable backup, I've loaded your immediate clinical metrics: you have 2 pending bills in 'Waiting for bills' and your next appointment is an Emergency visit in Room 302.";
      const lowCase = content.toLowerCase();
      if (lowCase.includes("billing") || lowCase.includes("revenue") || lowCase.includes("invoice") || lowCase.includes("money")) {
        reply = "Looking at your billing logs: total requested payments stand at $6,234, received payments at $14,568, and non-insurance payments at $3,786. Samantha Williams' ophthalmology routine checkup bill of $145.00 is ready for payment request.";
      } else if (lowCase.includes("schedule") || lowCase.includes("appointment") || lowCase.includes("visit")) {
        reply = "Dr. Olivia, you have 7 appointments scheduled for today. Currently in progress is your 'Chronic Kidney Disease Treatment' in Room 102. You also have a 'Team planning' session at 08:00 AM in Room 200.";
      } else if (lowCase.includes("learn") || lowCase.includes("dei") || lowCase.includes("pharmacology")) {
        reply = "In your 'My Learning Plan' module: 'Medical Terminology' and 'Anatomy and Physiology' are fully Completed. You are currently in the middle of 'Pharmacology Basics' (Watching 00:30, 45% progress).";
      }
      
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, errorMsg]
      }));
    } finally {
      set({ isChatLoading: false });
    }
  },

  // Dynamic Date Range Filter
  dateRange: getPresetDateRange('90d'),
  setDateRange: (range) => set({ dateRange: range }),

  // Interactive Calendar Events
  calendarEvents: [
    {
      id: 'cal-1',
      title: 'Quarterly Revenue & Forecast Review',
      date: '2026-11-21',
      time: '10:30 AM',
      category: 'Billing',
      location: 'Boardroom B',
      description: 'Review Q4 insurance collection velocity and December projections with finance lead.',
      completed: false
    },
    {
      id: 'cal-2',
      title: 'Rachel Meyers — Post-Op Telehealth Check',
      date: '2026-11-21',
      time: '02:00 PM',
      category: 'Follow-up',
      location: 'Intelly Video Suite',
      description: 'Review blood panel lab metrics and confirm prescription dosage.',
      completed: false
    },
    {
      id: 'cal-3',
      title: 'Geriatric CKD Protocol Audit',
      date: '2026-11-23',
      time: '09:00 AM',
      category: 'Clinical',
      location: 'Room 102',
      description: 'Monthly case conference with resident team and nephrology specialist.',
      completed: false
    },
    {
      id: 'cal-4',
      title: 'GEICO Batch Insurance Claims Submission',
      date: '2026-11-25',
      time: '04:00 PM',
      category: 'Billing',
      location: 'Billing Portal',
      description: 'Submit November CPT 99213 & 99214 claims prior to end-of-month cutoff.',
      completed: false
    },
    {
      id: 'cal-5',
      title: 'Samantha Williams — Annual Eye & Wellness Exam',
      date: '2026-11-27',
      time: '11:15 AM',
      category: 'Clinical',
      location: 'Clinic Suite 304',
      description: 'Follow-up ophthalmology screening and annual preventive care update.',
      completed: false
    },
    {
      id: 'cal-6',
      title: 'CME Ethics & Telehealth Workshop',
      date: '2026-11-18',
      time: '01:00 PM',
      category: 'Personal',
      location: 'Online Webinar',
      description: 'Accredited 2-hour seminar on digital consent workflows.',
      completed: true
    }
  ],
  addCalendarEvent: (event) => set((state) => ({
    calendarEvents: [
      { ...event, id: `cal-${Date.now()}` },
      ...state.calendarEvents
    ]
  })),
  toggleCalendarEvent: (id) => set((state) => ({
    calendarEvents: state.calendarEvents.map((ev) =>
      ev.id === id ? { ...ev, completed: !ev.completed } : ev
    )
  })),
  deleteCalendarEvent: (id) => set((state) => ({
    calendarEvents: state.calendarEvents.filter((ev) => ev.id !== id)
  })),

  // Clinical Notes & Scratchpad
  notes: [
    {
      id: 'note-1',
      title: 'Q4 Clinical Revenue & Collection Notes',
      content: 'Telemedicine billing cycle averaged 9.2 days to payout this quarter (down from 14 days). Prioritize automated reminder dispatch for American Family Insurance claims over $300 before Dec 1.',
      category: 'Billing',
      color: 'ivory',
      pinned: true,
      updatedAt: 'Nov 21, 2026 • 09:40 AM',
      tags: ['Q4', 'Revenue', 'Insurance']
    },
    {
      id: 'note-2',
      title: 'Rachel Meyers — Follow-up Observations',
      content: 'Patient reported improved energy levels after dosage adjustment. Double-check latest metabolic panel during today\'s 2:00 PM video consult and schedule 6-week in-clinic review.',
      category: 'Patient Follow-up',
      color: 'sage',
      pinned: true,
      updatedAt: 'Nov 20, 2026 • 05:15 PM',
      tags: ['Telehealth', 'Labs']
    },
    {
      id: 'note-3',
      title: 'Team Planning Agenda (Room 200)',
      content: '1. Onboard new resident onto Intelly ICD-10 quick codes.\n2. Confirm holiday coverage roster for December.\n3. Standardize pre-visit intake questionnaire for geriatric patients.',
      category: 'Meeting',
      color: 'sky',
      pinned: false,
      updatedAt: 'Nov 19, 2026 • 11:20 AM',
      tags: ['Team', 'Operations']
    },
    {
      id: 'note-4',
      title: 'Pharmacology CME Reading Takeaways',
      content: 'Key update on renal dosing thresholds for elderly outpatients with Stage 3 CKD. Bookmark reference chart in Documents Base for quick consultation access.',
      category: 'Clinical',
      color: 'lavender',
      pinned: false,
      updatedAt: 'Nov 17, 2026 • 03:05 PM',
      tags: ['CKD', 'Protocol']
    }
  ],
  addNote: (note) => set((state) => ({
    notes: [
      {
        ...note,
        id: `note-${Date.now()}`,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Just now'
      },
      ...state.notes
    ]
  })),
  updateNote: (id, patch) => set((state) => ({
    notes: state.notes.map((n) =>
      n.id === id
        ? {
            ...n,
            ...patch,
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Updated'
          }
        : n
    )
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== id)
  })),
  togglePinNote: (id) => set((state) => ({
    notes: state.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
  })),

  // Daily Tasks & Checklist
  tasks: [
    { id: 'tsk-1', text: 'Approve & export Q4 analytical report for board review', completed: false, priority: 'High', dueDate: '2026-11-21' },
    { id: 'tsk-2', text: 'Send payment request for Samantha Williams check-up ($145)', completed: false, priority: 'High', dueDate: '2026-11-21' },
    { id: 'tsk-3', text: 'Sign off Tyler Young cardiology diagnostic screen summary', completed: true, priority: 'Medium', dueDate: '2026-11-20' },
    { id: 'tsk-4', text: 'Update CPT 99214 reimbursement table for Q1 2027', completed: false, priority: 'Low', dueDate: '2026-11-26' }
  ],
  addTask: (text, priority = 'Medium', dueDate) => set((state) => ({
    tasks: [
      { id: `tsk-${Date.now()}`, text, completed: false, priority, dueDate },
      ...state.tasks
    ]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),

  // Notifications
  notifications: [
    {
      id: 'notif-1',
      title: 'GEICO Insurance Settlement Cleared',
      detail: '$568.56 deposited to IntellyMed operating account.',
      time: '15 min ago',
      read: false,
      type: 'billing'
    },
    {
      id: 'notif-2',
      title: 'Upcoming Telehealth Consult',
      detail: 'Rachel Meyers joins Video Suite at 02:00 PM today.',
      time: '45 min ago',
      read: false,
      type: 'schedule'
    },
    {
      id: 'notif-3',
      title: 'Forecast Updated for December',
      detail: 'Projected clinical revenue increased +8.6% based on Q4 volume.',
      time: '2 hrs ago',
      read: true,
      type: 'system'
    }
  ],
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  })),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  // Slide-over Quick Tools Drawer
  quickDrawerOpen: false,
  setQuickDrawerOpen: (open) => set({ quickDrawerOpen: open }),
  quickDrawerTab: 'notes',
  setQuickDrawerTab: (tab) => set({ quickDrawerTab: tab }),

  // Toast Notification
  toast: null,
  showToast: (message, type = 'success') => {
    const id = `toast-${Date.now()}`;
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 3400);
  },
  clearToast: () => set({ toast: null })
}));
