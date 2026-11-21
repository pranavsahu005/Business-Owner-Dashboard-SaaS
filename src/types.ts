/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientBill {
  id: string; // e.g. "3586895"
  type: 'Telemedicine' | 'In clinic' | 'Insurance' | 'Consultation';
  sendDate: string;
  isoDate?: string; // YYYY-MM-DD for accurate date range filtering
  name: string;
  amount: number;
  recipient: string;
  dueDate: string;
  status: 'Requested' | 'Paid' | 'Sent' | 'Failed';
  avatar: string;
}

export interface WaitingBill {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  avatar: string;
  amount: number;
}

export interface LatestTransaction {
  id: string;
  companyName: string;
  source: string;
  amount: number;
  timeAgo: string;
}

export interface ScheduleAppointment {
  id: string;
  title: string;
  type: 'Emergency' | 'Online' | 'Clinic' | 'Diagnostic' | 'Team' | 'Follow-up' | 'Primary Care';
  timeStart: string; // e.g. "07:00"
  timeEnd: string;   // e.g. "07:30"
  room?: string;
  participants?: { name: string; avatar: string }[];
  colorTheme: 'peach' | 'purple' | 'blue' | 'yellow' | 'green' | 'grey';
  joined?: boolean;
  isInProgress?: boolean;
}

export interface LearningSubject {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  watchTimeLeft?: string;
  progressPercent: number;
  avatars?: string[];
  linkNodeIds?: string[]; // linked subject nodes for the Dei style flowchart
  isLocked?: boolean;
}

export interface LearningEvent {
  id: string;
  type: 'Webinar' | 'Lesson' | 'Task';
  title: string;
  description: string;
  time?: string;
  dateStr: string; // e.g. "Tu, 25.03"
  colorTheme: 'blue' | 'purple' | 'yellow' | 'green';
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  avatar: string;
  lastVisit: string;
  bloodType: string;
  diagnosis: string;
  insuranceProvider: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type DateRangePreset = '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom';

export interface DateRangeState {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: 'Clinical' | 'Billing' | 'Follow-up' | 'Personal';
  description?: string;
  location?: string;
  completed?: boolean;
}

export interface ClinicalNote {
  id: string;
  title: string;
  content: string;
  category: 'Clinical' | 'Patient Follow-up' | 'Billing' | 'Meeting' | 'Personal';
  color: 'ivory' | 'sage' | 'blush' | 'sky' | 'lavender';
  pinned: boolean;
  updatedAt: string;
  tags: string[];
}

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  type: 'billing' | 'schedule' | 'system';
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
