import { create } from 'zustand';
import { 
  PatientBill, 
  WaitingBill,
  LatestTransaction,
  ScheduleAppointment, 
  LearningSubject, 
  LearningEvent,
  PatientRecord,
  ChatMessage 
} from './types';

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
      sendDate: '12/12/24',
      name: 'Rachel Meyers',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '12/12/24',
      status: 'Requested',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "4829304",
      type: 'In clinic',
      sendDate: '12/12/24',
      name: 'Samantha Williams',
      amount: 345.65,
      recipient: 'Samantha Williams',
      dueDate: '-',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "9283748",
      type: 'Insurance',
      sendDate: '12/12/24',
      name: 'Amy White',
      amount: 345.65,
      recipient: '123324 GEICO',
      dueDate: '12/12/24',
      status: 'Sent',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "5849203",
      type: 'In clinic',
      sendDate: '12/12/24',
      name: 'Tyler Young',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '-',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "3920194",
      type: 'Telemedicine',
      sendDate: '12/12/24',
      name: 'Amy White',
      amount: 345.65,
      recipient: '123324 GEICO',
      dueDate: '12/12/24',
      status: 'Paid',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "2930492",
      type: 'Telemedicine',
      sendDate: '12/12/24',
      name: 'Rachel Meyers',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '12/12/24',
      status: 'Requested',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
    },
    {
      id: "1930294",
      type: 'Insurance',
      sendDate: '12/12/24',
      name: 'Rachel Meyers',
      amount: 345.65,
      recipient: '123456 American Family Insurance',
      dueDate: '12/12/24',
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
  }
}));
