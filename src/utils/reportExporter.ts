import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateRangeState, PatientBill } from '../types';
import { FilteredAnalyticsResult } from './analyticsData';

export interface ReportExportContext {
  viewTitle: string;
  doctorName: string;
  doctorSpecialty: string;
  dateRange: DateRangeState;
  analytics: FilteredAnalyticsResult;
  bills: PatientBill[];
  invoices: {
    invoiceNumber: string;
    clientName: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    status: string;
  }[];
}

function escapeCsvCell(value: string | number | null | undefined): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function sanitizeFilename(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/-+/g, '-');
}

export function exportAnalyticsCSV(ctx: ReportExportContext): string {
  const lines: string[] = [];
  const generatedAt = new Date().toLocaleString();

  lines.push(['Intelly Clinical Intelligence — Analytical Report'].map(escapeCsvCell).join(','));
  lines.push(['View', ctx.viewTitle].map(escapeCsvCell).join(','));
  lines.push(['Prepared By', `Dr. ${ctx.doctorName} (${ctx.doctorSpecialty})`].map(escapeCsvCell).join(','));
  lines.push(['Date Interval', `${ctx.dateRange.label} (${ctx.dateRange.startDate} to ${ctx.dateRange.endDate})`].map(escapeCsvCell).join(','));
  lines.push(['Generated On', generatedAt].map(escapeCsvCell).join(','));
  lines.push('');

  // Section 1: KPI Summary
  lines.push(['EXECUTIVE KPI SUMMARY'].join(','));
  lines.push(['Metric', 'Value', 'Period Change / Note'].map(escapeCsvCell).join(','));
  lines.push(['Total Clinical Revenue', `$${ctx.analytics.kpis.totalRevenue.toLocaleString()}`, `${ctx.dateRange.label}`].map(escapeCsvCell).join(','));
  lines.push(['Payments Received', `$${ctx.analytics.kpis.paymentsReceived.toLocaleString()}`, ctx.analytics.kpis.receivedDelta].map(escapeCsvCell).join(','));
  lines.push(['Payments Requested', `$${ctx.analytics.kpis.paymentsRequested.toLocaleString()}`, ctx.analytics.kpis.requestedDelta].map(escapeCsvCell).join(','));
  lines.push(['Non-Insurance Payments', `$${ctx.analytics.kpis.nonInsurance.toLocaleString()}`, ctx.analytics.kpis.nonInsuranceDelta].map(escapeCsvCell).join(','));
  lines.push(['Projected Forecast Volume', `$${ctx.analytics.kpis.projectedRevenue.toLocaleString()}`, `+${ctx.analytics.kpis.forecastGrowthPct}% next interval`].map(escapeCsvCell).join(','));
  lines.push(['Total Consultations', ctx.analytics.kpis.totalConsultations, `Avg $${ctx.analytics.kpis.avgTicket} / visit`].map(escapeCsvCell).join(','));
  lines.push('');

  // Section 2: Time Series & Forecast
  lines.push(['REVENUE & FORECAST SERIES'].join(','));
  lines.push(['Period', 'Date', 'Actual Revenue ($)', 'Forecast Revenue ($)', 'Expenses ($)', 'Telemedicine', 'In Clinic', 'Emergency'].map(escapeCsvCell).join(','));
  ctx.analytics.timeSeries.forEach((pt) => {
    lines.push([
      pt.label,
      pt.date,
      pt.actualRevenue !== null ? pt.actualRevenue : 'Projected',
      pt.forecastRevenue,
      pt.expenses,
      pt.telemedicine,
      pt.inClinic,
      pt.emergency,
    ].map(escapeCsvCell).join(','));
  });
  lines.push('');

  // Section 3: Patient Billing Records
  lines.push(['PATIENT BILLING LEDGER'].join(','));
  lines.push(['Bill ID', 'Type', 'Patient Name', 'Recipient', 'Send Date', 'Due Date', 'Amount ($)', 'Status'].map(escapeCsvCell).join(','));
  ctx.bills.forEach((b) => {
    lines.push([b.id, b.type, b.name, b.recipient, b.sendDate, b.dueDate, b.amount.toFixed(2), b.status].map(escapeCsvCell).join(','));
  });
  lines.push('');

  // Section 4: Corporate Invoices
  lines.push(['CORPORATE INVOICES'].join(','));
  lines.push(['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Total ($)', 'Status'].map(escapeCsvCell).join(','));
  ctx.invoices.forEach((inv) => {
    lines.push([inv.invoiceNumber, inv.clientName, inv.issueDate, inv.dueDate, inv.totalAmount.toFixed(2), inv.status].map(escapeCsvCell).join(','));
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `intelly-${sanitizeFilename(ctx.viewTitle)}-${ctx.dateRange.startDate}_to_${ctx.dateRange.endDate}.csv`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}

export function exportAnalyticsPDF(ctx: ReportExportContext): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Dark editorial header band
  doc.setFillColor(18, 18, 18);
  doc.rect(0, 0, pageWidth, 108, 'F');

  // Accent bar
  doc.setFillColor(128, 203, 196);
  doc.rect(0, 104, pageWidth, 4, 'F');

  // Brand + Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INTELLY CLINICAL INTELLIGENCE', margin, 32);

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text(ctx.viewTitle, margin, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(210, 206, 200);
  doc.text(`Prepared for Dr. ${ctx.doctorName}  |  ${ctx.doctorSpecialty}`, margin, 80);
  doc.text(
    `Interval: ${ctx.dateRange.label} (${ctx.dateRange.startDate} to ${ctx.dateRange.endDate})   •   Generated: ${new Date().toLocaleDateString()}`,
    margin,
    94
  );

  // Section 1: KPI Summary Cards
  let cursorY = 132;
  doc.setTextColor(30, 30, 30);
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('1. Executive Performance Summary', margin, cursorY);
  cursorY += 12;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Key Metric', 'Current Interval', 'Delta / Forecast Context']],
    body: [
      ['Total Clinical Revenue', `$${ctx.analytics.kpis.totalRevenue.toLocaleString()}`, `${ctx.dateRange.label}`],
      ['Payments Received', `$${ctx.analytics.kpis.paymentsReceived.toLocaleString()}`, `${ctx.analytics.kpis.receivedDelta} vs prior period`],
      ['Payments Requested', `$${ctx.analytics.kpis.paymentsRequested.toLocaleString()}`, `${ctx.analytics.kpis.requestedDelta} pending claims`],
      ['Non-Insurance Payments', `$${ctx.analytics.kpis.nonInsurance.toLocaleString()}`, `${ctx.analytics.kpis.nonInsuranceDelta} direct pay`],
      ['Projected Forecast', `$${ctx.analytics.kpis.projectedRevenue.toLocaleString()}`, `${ctx.analytics.kpis.forecastGrowthPct >= 0 ? '+' : ''}${ctx.analytics.kpis.forecastGrowthPct}% projected momentum`],
      ['Consultations Completed', `${ctx.analytics.kpis.totalConsultations} visits`, `Avg $${ctx.analytics.kpis.avgTicket} revenue / visit`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [24, 24, 27], textColor: [255, 255, 255], fontSize: 9.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [45, 45, 48] },
    alternateRowStyles: { fillColor: [250, 248, 245] },
    styles: { cellPadding: 7 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 24;

  // Section 2: Revenue & Forecast Trajectory
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('2. Revenue Actuals vs. Forecast Trajectory', margin, cursorY);
  cursorY += 12;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['Period', 'Actual Revenue', 'Forecast Target', 'Expenses', 'Consultations']],
    body: ctx.analytics.timeSeries.map((pt) => [
      pt.label,
      pt.actualRevenue !== null ? `$${pt.actualRevenue.toLocaleString()}` : 'Forecast Window',
      `$${pt.forecastRevenue.toLocaleString()}`,
      `$${pt.expenses.toLocaleString()}`,
      `${pt.telemedicine + pt.inClinic + pt.emergency}`,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [176, 111, 75], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [45, 45, 48] },
    styles: { cellPadding: 6 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 24;

  // Add page break if low on space
  if (cursorY > pageHeight - 180) {
    doc.addPage();
    cursorY = 48;
  }

  // Section 3: Patient Billing Ledger
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('3. Billing & Claims Ledger', margin, cursorY);
  cursorY += 12;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [['ID', 'Type', 'Patient', 'Recipient', 'Amount', 'Status']],
    body: ctx.bills.map((b) => [
      `#${b.id}`,
      b.type,
      b.name,
      b.recipient,
      `$${b.amount.toFixed(2)}`,
      b.status,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [24, 24, 27], textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [45, 45, 48] },
    alternateRowStyles: { fillColor: [250, 248, 245] },
    styles: { cellPadding: 6 },
  });

  cursorY = (doc as any).lastAutoTable.finalY + 24;

  if (ctx.invoices.length > 0) {
    if (cursorY > pageHeight - 150) {
      doc.addPage();
      cursorY = 48;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('4. Corporate Invoices Summary', margin, cursorY);
    cursorY += 12;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Total', 'Status']],
      body: ctx.invoices.map((inv) => [
        inv.invoiceNumber,
        inv.clientName,
        inv.issueDate,
        inv.dueDate,
        `$${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        inv.status,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [17, 122, 101], textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8.5, textColor: [45, 45, 48] },
      styles: { cellPadding: 6 },
    });
  }

  // Page footers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Intelly Clinical Suite • Confidential Analytical Export • ${ctx.dateRange.startDate} to ${ctx.dateRange.endDate}`,
      margin,
      pageHeight - 22
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  const filename = `intelly-${sanitizeFilename(ctx.viewTitle)}-${ctx.dateRange.startDate}_to_${ctx.dateRange.endDate}.pdf`;
  doc.save(filename);
  return filename;
}
