import { DateRangeState, PatientBill } from '../types';

export interface MonthlyMetricPoint {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
  actualRevenue: number | null;
  forecastRevenue: number;
  expenses: number;
  telemedicine: number;
  inClinic: number;
  emergency: number;
  paymentsReceived: number;
  paymentsRequested: number;
  nonInsurance: number;
}

// Rich 2026 clinical & financial series with actuals through Nov 2026 and forward forecast
export const BASE_ANALYTICS_SERIES: MonthlyMetricPoint[] = [
  { id: '2026-01', label: 'Jan 26', date: '2026-01-15', actualRevenue: 14500, forecastRevenue: 14200, expenses: 6100, telemedicine: 42, inClinic: 61, emergency: 14, paymentsReceived: 11200, paymentsRequested: 3300, nonInsurance: 2150 },
  { id: '2026-02', label: 'Feb 26', date: '2026-02-15', actualRevenue: 18200, forecastRevenue: 17500, expenses: 6800, telemedicine: 51, inClinic: 68, emergency: 16, paymentsReceived: 14100, paymentsRequested: 4100, nonInsurance: 2890 },
  { id: '2026-03', label: 'Mar 26', date: '2026-03-15', actualRevenue: 16400, forecastRevenue: 17100, expenses: 6450, telemedicine: 49, inClinic: 64, emergency: 12, paymentsReceived: 12650, paymentsRequested: 3750, nonInsurance: 2420 },
  { id: '2026-04', label: 'Apr 26', date: '2026-04-15', actualRevenue: 21000, forecastRevenue: 19800, expenses: 7200, telemedicine: 58, inClinic: 76, emergency: 18, paymentsReceived: 16200, paymentsRequested: 4800, nonInsurance: 3250 },
  { id: '2026-05', label: 'May 26', date: '2026-05-15', actualRevenue: 23400, forecastRevenue: 22100, expenses: 7500, telemedicine: 65, inClinic: 84, emergency: 21, paymentsReceived: 18100, paymentsRequested: 5300, nonInsurance: 3680 },
  { id: '2026-06', label: 'Jun 26', date: '2026-06-15', actualRevenue: 25800, forecastRevenue: 24500, expenses: 7900, telemedicine: 71, inClinic: 91, emergency: 19, paymentsReceived: 19950, paymentsRequested: 5850, nonInsurance: 4100 },
  { id: '2026-07', label: 'Jul 26', date: '2026-07-15', actualRevenue: 24900, forecastRevenue: 25200, expenses: 7600, telemedicine: 69, inClinic: 88, emergency: 20, paymentsReceived: 19120, paymentsRequested: 5780, nonInsurance: 3920 },
  { id: '2026-08', label: 'Aug 26', date: '2026-08-15', actualRevenue: 27150, forecastRevenue: 26400, expenses: 8100, telemedicine: 76, inClinic: 95, emergency: 17, paymentsReceived: 21050, paymentsRequested: 6100, nonInsurance: 4320 },
  { id: '2026-09', label: 'Sep 26', date: '2026-09-15', actualRevenue: 28900, forecastRevenue: 27900, expenses: 8350, telemedicine: 82, inClinic: 98, emergency: 22, paymentsReceived: 22480, paymentsRequested: 6420, nonInsurance: 4510 },
  { id: '2026-10', label: 'Oct 26', date: '2026-10-15', actualRevenue: 30400, forecastRevenue: 29600, expenses: 8600, telemedicine: 88, inClinic: 104, emergency: 19, paymentsReceived: 23900, paymentsRequested: 6500, nonInsurance: 4780 },
  { id: '2026-11', label: 'Nov 26', date: '2026-11-15', actualRevenue: 31850, forecastRevenue: 31200, expenses: 8900, telemedicine: 94, inClinic: 110, emergency: 21, paymentsReceived: 25100, paymentsRequested: 6750, nonInsurance: 4920 },
  { id: '2026-12', label: 'Dec 26 (Est)', date: '2026-12-15', actualRevenue: null, forecastRevenue: 34600, expenses: 9200, telemedicine: 102, inClinic: 118, emergency: 24, paymentsReceived: 0, paymentsRequested: 0, nonInsurance: 0 },
  { id: '2027-01', label: 'Jan 27 (Est)', date: '2027-01-15', actualRevenue: null, forecastRevenue: 36900, expenses: 9450, telemedicine: 108, inClinic: 122, emergency: 23, paymentsReceived: 0, paymentsRequested: 0, nonInsurance: 0 },
];

// Daily granular points for short intervals (7d / 30d)
const DAILY_RECENT_SERIES: MonthlyMetricPoint[] = [
  { id: 'd-1', label: 'Oct 25', date: '2026-10-25', actualRevenue: 980, forecastRevenue: 940, expenses: 310, telemedicine: 3, inClinic: 4, emergency: 1, paymentsReceived: 760, paymentsRequested: 220, nonInsurance: 150 },
  { id: 'd-2', label: 'Oct 29', date: '2026-10-29', actualRevenue: 1240, forecastRevenue: 1150, expenses: 340, telemedicine: 4, inClinic: 5, emergency: 1, paymentsReceived: 980, paymentsRequested: 260, nonInsurance: 190 },
  { id: 'd-3', label: 'Nov 02', date: '2026-11-02', actualRevenue: 1410, forecastRevenue: 1320, expenses: 390, telemedicine: 5, inClinic: 6, emergency: 1, paymentsReceived: 1120, paymentsRequested: 290, nonInsurance: 210 },
  { id: 'd-4', label: 'Nov 06', date: '2026-11-06', actualRevenue: 1190, forecastRevenue: 1280, expenses: 350, telemedicine: 4, inClinic: 5, emergency: 0, paymentsReceived: 910, paymentsRequested: 280, nonInsurance: 185 },
  { id: 'd-5', label: 'Nov 10', date: '2026-11-10', actualRevenue: 1620, forecastRevenue: 1490, expenses: 420, telemedicine: 6, inClinic: 7, emergency: 2, paymentsReceived: 1290, paymentsRequested: 330, nonInsurance: 255 },
  { id: 'd-6', label: 'Nov 14', date: '2026-11-14', actualRevenue: 1740, forecastRevenue: 1640, expenses: 430, telemedicine: 6, inClinic: 8, emergency: 1, paymentsReceived: 1380, paymentsRequested: 360, nonInsurance: 280 },
  { id: 'd-7', label: 'Nov 16', date: '2026-11-16', actualRevenue: 1510, forecastRevenue: 1580, expenses: 395, telemedicine: 5, inClinic: 6, emergency: 1, paymentsReceived: 1190, paymentsRequested: 320, nonInsurance: 230 },
  { id: 'd-8', label: 'Nov 17', date: '2026-11-17', actualRevenue: 1890, forecastRevenue: 1750, expenses: 440, telemedicine: 7, inClinic: 8, emergency: 1, paymentsReceived: 1490, paymentsRequested: 400, nonInsurance: 310 },
  { id: 'd-9', label: 'Nov 18', date: '2026-11-18', actualRevenue: 1660, forecastRevenue: 1710, expenses: 410, telemedicine: 6, inClinic: 7, emergency: 2, paymentsReceived: 1320, paymentsRequested: 340, nonInsurance: 265 },
  { id: 'd-10', label: 'Nov 19', date: '2026-11-19', actualRevenue: 2040, forecastRevenue: 1920, expenses: 470, telemedicine: 8, inClinic: 9, emergency: 1, paymentsReceived: 1610, paymentsRequested: 430, nonInsurance: 340 },
  { id: 'd-11', label: 'Nov 20', date: '2026-11-20', actualRevenue: 2180, forecastRevenue: 2050, expenses: 495, telemedicine: 8, inClinic: 9, emergency: 2, paymentsReceived: 1750, paymentsRequested: 430, nonInsurance: 360 },
  { id: 'd-12', label: 'Nov 21', date: '2026-11-21', actualRevenue: 2310, forecastRevenue: 2190, expenses: 510, telemedicine: 9, inClinic: 10, emergency: 1, paymentsReceived: 1860, paymentsRequested: 450, nonInsurance: 390 },
  { id: 'd-13', label: 'Nov 24 (Est)', date: '2026-11-24', actualRevenue: null, forecastRevenue: 2420, expenses: 520, telemedicine: 9, inClinic: 10, emergency: 1, paymentsReceived: 0, paymentsRequested: 0, nonInsurance: 0 },
  { id: 'd-14', label: 'Nov 28 (Est)', date: '2026-11-28', actualRevenue: null, forecastRevenue: 2590, expenses: 540, telemedicine: 10, inClinic: 11, emergency: 2, paymentsReceived: 0, paymentsRequested: 0, nonInsurance: 0 },
];

export interface FilteredAnalyticsResult {
  timeSeries: MonthlyMetricPoint[];
  consultationMix: { name: string; count: number; fill: string }[];
  kpis: {
    totalRevenue: number;
    paymentsReceived: number;
    paymentsRequested: number;
    nonInsurance: number;
    receivedDelta: string;
    requestedDelta: string;
    nonInsuranceDelta: string;
    totalBillsFormatted: string;
    projectedRevenue: number;
    forecastGrowthPct: number;
    totalConsultations: number;
    avgTicket: number;
  };
  filteredBills: PatientBill[];
}

export function getPresetDateRange(preset: DateRangeState['preset']): DateRangeState {
  // Reference current date: 2026-11-21
  switch (preset) {
    case '7d':
      return { preset: '7d', startDate: '2026-11-14', endDate: '2026-11-21', label: 'Last 7 Days' };
    case '30d':
      return { preset: '30d', startDate: '2026-10-22', endDate: '2026-11-21', label: 'Last 30 Days' };
    case '90d':
      return { preset: '90d', startDate: '2026-08-23', endDate: '2026-11-21', label: 'This Quarter (90d)' };
    case 'ytd':
      return { preset: 'ytd', startDate: '2026-01-01', endDate: '2026-11-21', label: 'Year to Date' };
    case 'all':
    default:
      return { preset: 'all', startDate: '2026-01-01', endDate: '2027-01-31', label: 'All Time & Forecast' };
  }
}

export function computeFilteredAnalytics(
  dateRange: DateRangeState,
  patientBills: PatientBill[]
): FilteredAnalyticsResult {
  const start = new Date(dateRange.startDate).getTime();
  const end = new Date(dateRange.endDate).getTime();
  const spanDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

  // Pick daily series for <= 45 day windows, monthly series for wider intervals
  let series: MonthlyMetricPoint[];
  if (spanDays <= 45 && dateRange.preset !== 'all') {
    const matched = DAILY_RECENT_SERIES.filter((pt) => {
      const t = new Date(pt.date).getTime();
      return t >= start && t <= end;
    });
    // Always append 2 forecast lookahead points so the forecast curve is visible
    const forecastLookahead = DAILY_RECENT_SERIES.filter((pt) => pt.actualRevenue === null);
    series = matched.length > 0 ? [...matched, ...forecastLookahead] : DAILY_RECENT_SERIES.slice(-8);
  } else {
    const matched = BASE_ANALYTICS_SERIES.filter((pt) => {
      const t = new Date(pt.date).getTime();
      return t >= start && t <= end;
    });
    const hasForecast = matched.some((m) => m.actualRevenue === null);
    const forecastTail = hasForecast ? [] : BASE_ANALYTICS_SERIES.filter((pt) => pt.actualRevenue === null);
    series = matched.length > 0 ? [...matched, ...forecastTail] : BASE_ANALYTICS_SERIES;
  }

  const actualPoints = series.filter((p) => p.actualRevenue !== null);
  const forecastPoints = series.filter((p) => p.actualRevenue === null);

  const paymentsReceived = actualPoints.reduce((acc, p) => acc + p.paymentsReceived, 0);
  const paymentsRequested = actualPoints.reduce((acc, p) => acc + p.paymentsRequested, 0);
  const nonInsurance = actualPoints.reduce((acc, p) => acc + p.nonInsurance, 0);
  const totalRevenue = actualPoints.reduce((acc, p) => acc + (p.actualRevenue || 0), 0);

  const teleCount = actualPoints.reduce((acc, p) => acc + p.telemedicine, 0);
  const clinicCount = actualPoints.reduce((acc, p) => acc + p.inClinic, 0);
  const emergencyCount = actualPoints.reduce((acc, p) => acc + p.emergency, 0);
  const totalConsultations = teleCount + clinicCount + emergencyCount;

  const projectedRevenue = forecastPoints.reduce((acc, p) => acc + p.forecastRevenue, 0) || Math.round(totalRevenue * 1.12);
  const lastActual = actualPoints[actualPoints.length - 1]?.actualRevenue || 1;
  const nextForecast = forecastPoints[0]?.forecastRevenue || Math.round(lastActual * 1.09);
  const forecastGrowthPct = Number((((nextForecast - lastActual) / lastActual) * 100).toFixed(1));

  // Filter patient bills by isoDate when present, otherwise include all for 'all' / 'ytd'
  const filteredBills = patientBills.filter((bill) => {
    if (!bill.isoDate || dateRange.preset === 'all') return true;
    const t = new Date(bill.isoDate).getTime();
    return t >= start && t <= end;
  });

  const deltaMap: Record<DateRangeState['preset'], { rec: string; req: string; non: string }> = {
    '7d': { rec: '+14.2%', req: '-4.1%', non: '-9.5%' },
    '30d': { rec: '+13.0%', req: '-6.0%', non: '-17.0%' },
    '90d': { rec: '+18.6%', req: '-2.8%', non: '-11.2%' },
    'ytd': { rec: '+24.4%', req: '+3.1%', non: '-8.4%' },
    'all': { rec: '+27.8%', req: '+1.9%', non: '-6.7%' },
    'custom': { rec: '+11.5%', req: '-3.4%', non: '-7.2%' },
  };

  const deltas = deltaMap[dateRange.preset];
  const totalBillsVal = paymentsReceived + paymentsRequested;
  const totalBillsFormatted =
    totalBillsVal >= 1000
      ? `${(totalBillsVal / 1000).toFixed(1)}k`
      : `${totalBillsVal}`;

  return {
    timeSeries: series,
    consultationMix: [
      { name: 'Telemedicine', count: teleCount, fill: '#80CBC4' },
      { name: 'In Clinic', count: clinicCount, fill: '#FFE082' },
      { name: 'Emergency', count: emergencyCount, fill: '#F48FB1' },
    ],
    kpis: {
      totalRevenue,
      paymentsReceived,
      paymentsRequested,
      nonInsurance,
      receivedDelta: deltas.rec,
      requestedDelta: deltas.req,
      nonInsuranceDelta: deltas.non,
      totalBillsFormatted,
      projectedRevenue,
      forecastGrowthPct,
      totalConsultations,
      avgTicket: totalConsultations > 0 ? Math.round(totalRevenue / totalConsultations) : 0,
    },
    filteredBills: filteredBills.length > 0 ? filteredBills : patientBills.slice(0, 3),
  };
}
