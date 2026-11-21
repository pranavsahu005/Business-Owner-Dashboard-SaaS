import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import { FilteredAnalyticsResult } from '../utils/analyticsData';

interface ClinicalInfographicsProps {
  analytics: FilteredAnalyticsResult;
  collectionRate: number;
}

export default function ClinicalInfographics({ analytics, collectionRate }: ClinicalInfographicsProps) {
  const { themeMode } = useStore();
  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const donutRef = useRef<SVGSVGElement>(null);
  const gaugeRef = useRef<SVGSVGElement>(null);

  // Interactive Consultation Session Timer (inspired by editorial time tracker)
  const [secondsElapsed, setSecondsElapsed] = useState(155); // 02:35 initial active session
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const formattedTimer = `${String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:${String(
    secondsElapsed % 60
  ).padStart(2, '0')}`;

  const channelData = [
    {
      label: 'In-Clinic Care',
      value: analytics.consultationMix.find((c) => c.name === 'In Clinic')?.count || 110,
      color: isDark ? '#E8E3DA' : '#1A1918',
    },
    {
      label: 'Telemedicine',
      value: analytics.consultationMix.find((c) => c.name === 'Telemedicine')?.count || 84,
      color: '#6D9E83',
    },
    {
      label: 'Insurance Claims',
      value: Math.round((analytics.kpis.paymentsReceived / Math.max(1, analytics.kpis.totalRevenue)) * 100),
      color: '#E5C167',
    },
    {
      label: 'Emergency & Urgent',
      value: analytics.consultationMix.find((c) => c.name === 'Emergency')?.count || 24,
      color: '#D48A6A',
    },
  ];

  const totalChannelUnits = channelData.reduce((s, d) => s + d.value, 0) || 1;

  // D3 Segmented Performance Donut
  useEffect(() => {
    const svgEl = donutRef.current;
    if (!svgEl) return;

    const size = 152;
    const radius = size / 2;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3
      .pie<(typeof channelData)[number]>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.055);

    const arc = d3
      .arc<d3.PieArcDatum<(typeof channelData)[number]>>()
      .innerRadius(radius * 0.62)
      .outerRadius(radius * 0.94)
      .cornerRadius(6);

    g.selectAll('path')
      .data(pie(channelData))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .style('transition', 'opacity 180ms ease');
  }, [analytics, isDark]);

  // D3 Semi-Circle Collection Efficiency Gauge
  useEffect(() => {
    const svgEl = gaugeRef.current;
    if (!svgEl) return;

    const width = 186;
    const height = 104;
    const outerRadius = 78;
    const innerRadius = 56;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height - 10})`);

    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const clampedPct = Math.max(5, Math.min(100, collectionRate));
    const valueAngle = startAngle + (clampedPct / 100) * Math.PI;

    // Background track
    const bgArc = d3
      .arc<unknown>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(6);

    g.append('path')
      .attr('d', bgArc({}) || '')
      .attr('fill', isDark ? 'rgba(255,255,255,0.08)' : '#EFEAE1');

    // Primary active segment (Warm Obsidian -> Sage)
    const splitAngle = startAngle + Math.min(valueAngle - startAngle, Math.PI * 0.65);
    const seg1 = d3
      .arc<unknown>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(splitAngle)
      .cornerRadius(6);

    g.append('path')
      .attr('d', seg1({}) || '')
      .attr('fill', isDark ? '#8FB5A3' : '#1E2D24');

    if (valueAngle > splitAngle + 0.04) {
      const seg2 = d3
        .arc<unknown>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(splitAngle + 0.04)
        .endAngle(valueAngle)
        .cornerRadius(6);

      g.append('path')
        .attr('d', seg2({}) || '')
        .attr('fill', '#C7D36F');
    }

    // Precision needle marker at valueAngle
    const needleX = Math.sin(valueAngle) * (outerRadius + 6);
    const needleY = -Math.cos(valueAngle) * (outerRadius + 6);
    const innerX = Math.sin(valueAngle) * (innerRadius - 6);
    const innerY = -Math.cos(valueAngle) * (innerRadius - 6);

    g.append('line')
      .attr('x1', innerX)
      .attr('y1', innerY)
      .attr('x2', needleX)
      .attr('y2', needleY)
      .attr('stroke', '#C87D55')
      .attr('stroke-width', 2.2)
      .attr('stroke-linecap', 'round');
  }, [collectionRate, isDark]);

  const cardSurface =
    themeMode === 'galaxy'
      ? 'bg-[#100E24]/90 border-indigo-950/70 text-stone-100'
      : themeMode === 'dark'
      ? 'bg-[#191817] border-[#2A2825] text-stone-100'
      : 'bg-[#FFFEFC] border-[#EAE3D7] text-[#221F1D] shadow-[0_2px_18px_rgba(34,31,29,0.03)]';

  const timerProgress = Math.min(1, (secondsElapsed % 1800) / 1800);
  const timerCirc = 2 * Math.PI * 52;

  return (
    <div className="space-y-6">
      {/* Warm Pastel Capacity & Time Allocation Bar (inspired by Crextio editorial strip) */}
      <div className={`rounded-[24px] border p-5 transition-colors duration-300 ${cardSurface}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div>
            <h3 className="text-sm font-serif font-semibold">Practice Utilization & Billing Split</h3>
            <p className="text-[11px] text-stone-400">Real-time operational distribution across active clinical workflows</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <span>
              <strong className={isDark ? 'text-white' : 'text-[#171614]'}>{analytics.kpis.totalConsultations}</strong>{' '}
              <span className="text-stone-400 font-sans text-[11px]">Visits</span>
            </span>
            <span>
              <strong className={isDark ? 'text-white' : 'text-[#171614]'}>${analytics.kpis.avgTicket}</strong>{' '}
              <span className="text-stone-400 font-sans text-[11px]">Avg Yield</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-3">
            <div className="text-[10px] text-stone-400 mb-1">In-Clinic</div>
            <div className="h-8 rounded-full bg-[#171614] dark:bg-[#E8E3DA] text-white dark:text-[#171614] text-[11px] font-mono tabular-nums font-semibold flex items-center px-3.5">
              34%
            </div>
          </div>
          <div className="col-span-3">
            <div className="text-[10px] text-stone-400 mb-1">Telehealth</div>
            <div className="h-8 rounded-full bg-[#F3D37A] text-[#2B2313] text-[11px] font-mono tabular-nums font-semibold flex items-center px-3.5">
              28%
            </div>
          </div>
          <div className="col-span-4">
            <div className="text-[10px] text-stone-400 mb-1">Insurance Processing</div>
            <div className={`h-8 rounded-full warm-stripes border text-[11px] font-mono tabular-nums font-semibold flex items-center px-3.5 ${isDark ? 'border-white/15 text-stone-200' : 'border-[#E4DCCF] text-stone-700'}`}>
              26%
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] text-stone-400 mb-1">Buffer</div>
            <div className={`h-8 rounded-full border text-[11px] font-mono tabular-nums font-medium flex items-center justify-center ${isDark ? 'border-white/15 text-stone-300' : 'border-[#E4DCCF] text-stone-600'}`}>
              12%
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Editorial Infographic Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. D3 Segmented Channel Performance Donut */}
        <div className={`rounded-[24px] border p-5 flex flex-col justify-between ${cardSurface}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-semibold">Clinical Channel Mix</h3>
            <span className="text-[10px] font-mono text-stone-400">D3 Donut</span>
          </div>

          <div className="flex items-center justify-center my-1">
            <svg ref={donutRef} width={152} height={152} className="overflow-visible" />
          </div>

          <div className="space-y-1.5 mt-3">
            {channelData.map((item) => {
              const pct = Math.round((item.value / totalChannelUnits) * 100);
              return (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2 text-stone-500 dark:text-stone-400">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-mono tabular-nums font-semibold">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. D3 Semi-Circle Collection Efficiency Gauge */}
        <div className={`rounded-[24px] border p-5 flex flex-col justify-between ${cardSurface}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-serif font-semibold">Collection Target</h3>
            <span className="text-[10px] font-mono text-stone-400">Gauge</span>
          </div>

          <div className="relative flex flex-col items-center justify-center my-2">
            <svg ref={gaugeRef} width={186} height={104} className="overflow-visible" />
            <div className="-mt-9 text-center">
              <div className="text-2xl font-serif font-bold tabular-nums">{collectionRate}%</div>
              <div className="text-[10px] text-stone-400">Settled invoices ratio</div>
            </div>
          </div>

          <div className={`mt-4 pt-3 border-t space-y-1.5 text-xs ${isDark ? 'border-white/10' : 'border-[#F0E9DF]'}`}>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Payments Received</span>
              <span className="font-mono tabular-nums font-semibold text-[#5B8A72]">
                ${analytics.kpis.paymentsReceived.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Pending Claims</span>
              <span className="font-mono tabular-nums font-semibold text-[#C87D55]">
                ${analytics.kpis.paymentsRequested.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Interactive Consultation Focus Timer */}
        <div className={`rounded-[24px] border p-5 flex flex-col justify-between ${cardSurface}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-serif font-semibold">Session Time Tracker</h3>
            <span className="text-[10px] font-mono text-stone-400">
              {timerRunning ? 'Active' : 'Paused'}
            </span>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <svg width={132} height={132} className="-rotate-90">
              <circle
                cx="66"
                cy="66"
                r="52"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.08)' : '#EFEAE1'}
                strokeWidth="8"
                strokeDasharray="3 5"
              />
              <circle
                cx="66"
                cy="66"
                r="52"
                fill="none"
                stroke="#E8C46A"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={timerCirc}
                strokeDashoffset={timerCirc * (1 - Math.max(0.14, timerProgress))}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-mono font-bold tabular-nums">{formattedTimer}</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Consult Time</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                timerRunning
                  ? 'bg-[#F3D37A] text-[#2B2313]'
                  : isDark
                  ? 'bg-[#F3EFEA] text-[#171614] hover:bg-white'
                  : 'bg-[#171614] text-white hover:bg-stone-800'
              }`}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setSecondsElapsed(0);
              }}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'border-white/15 text-stone-300 hover:bg-white/10' : 'border-[#E6DFD4] text-stone-600 hover:bg-[#F5F0E7]'
              }`}
              title="Reset timer"
              aria-label="Reset session timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
