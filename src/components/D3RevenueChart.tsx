import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MonthlyMetricPoint } from '../utils/analyticsData';
import { useStore } from '../store';

interface D3RevenueChartProps {
  data: MonthlyMetricPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}

type ChartMode = 'revenue' | 'net' | 'visits';

export default function D3RevenueChart({
  data,
  title = 'Monthly Revenue & Forecast Trends',
  subtitle,
  height = 290,
}: D3RevenueChartProps) {
  const { themeMode, dateRange } = useStore();
  const isDark = themeMode === 'dark' || themeMode === 'galaxy';

  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(640);
  const [mode, setMode] = useState<ChartMode>('revenue');
  const [hovered, setHovered] = useState<{
    point: MonthlyMetricPoint;
    x: number;
    y: number;
  } | null>(null);

  // Measure container responsively
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextWidth = Math.max(300, Math.floor(entry.contentRect.width));
        setWidth(nextWidth);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Render D3 interactive spline chart
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || data.length === 0) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const margin = { top: 22, right: 20, bottom: 34, left: 52 };
    const innerWidth = Math.max(200, width - margin.left - margin.right);
    const innerHeight = Math.max(150, height - margin.top - margin.bottom);

    const getPrimaryVal = (d: MonthlyMetricPoint): number | null => {
      if (mode === 'visits') {
        return d.actualRevenue !== null ? d.telemedicine + d.inClinic + d.emergency : null;
      }
      if (mode === 'net') {
        return d.actualRevenue !== null ? Math.max(0, d.actualRevenue - d.expenses) : null;
      }
      return d.actualRevenue;
    };

    const getSecondaryVal = (d: MonthlyMetricPoint): number => {
      if (mode === 'visits') {
        return d.telemedicine + d.inClinic + d.emergency;
      }
      if (mode === 'net') {
        return Math.max(0, d.forecastRevenue - d.expenses);
      }
      return d.forecastRevenue;
    };

    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.18);

    const allVals = data.flatMap((d) => {
      const p = getPrimaryVal(d);
      const s = getSecondaryVal(d);
      return p !== null ? [p, s] : [s];
    });
    const maxVal = (d3.max(allVals) || 100) * 1.16;
    const minVal = Math.max(0, (d3.min(allVals) || 0) * 0.72);

    const yScale = d3.scaleLinear().domain([minVal, maxVal]).nice(4).range([innerHeight, 0]);

    // Defs: Warm pastel area gradient
    const defs = svg.append('defs');
    const primaryGrad = defs
      .append('linearGradient')
      .attr('id', 'd3WarmAreaGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    if (mode === 'visits') {
      primaryGrad.append('stop').attr('offset', '0%').attr('stop-color', '#C87D55').attr('stop-opacity', isDark ? 0.34 : 0.28);
      primaryGrad.append('stop').attr('offset', '100%').attr('stop-color', '#C87D55').attr('stop-opacity', 0.01);
    } else {
      primaryGrad.append('stop').attr('offset', '0%').attr('stop-color', '#7AA88E').attr('stop-opacity', isDark ? 0.36 : 0.32);
      primaryGrad.append('stop').attr('offset', '100%').attr('stop-color', '#7AA88E').attr('stop-opacity', 0.01);
    }

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Subtle horizontal gridlines
    const yTicks = yScale.ticks(4);
    g.append('g')
      .selectAll('line')
      .data(yTicks)
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', isDark ? 'rgba(255,255,255,0.06)' : '#EFE9DF')
      .attr('stroke-dasharray', '3,4');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(4)
      .tickSize(0)
      .tickPadding(12)
      .tickFormat((v) => {
        const num = Number(v);
        if (mode === 'visits') return `${num}`;
        if (num >= 1000) return `$${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
        return `$${num}`;
      });

    g.append('g')
      .call(yAxis)
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('fill', isDark ? '#9A938A' : '#8C8378')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px');

    // X Axis
    const step = data.length > 9 ? 2 : 1;
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(data.filter((_, idx) => idx % step === 0 || idx === data.length - 1).map((d) => d.label))
      .tickSize(0)
      .tickPadding(14);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('fill', isDark ? '#9A938A' : '#8C8378')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('font-weight', '500');

    // Secondary Forecast / Benchmark Spline Curve (Warm Amber)
    const secondaryLine = d3
      .line<MonthlyMetricPoint>()
      .x((d) => xScale(d.label) ?? 0)
      .y((d) => yScale(getSecondaryVal(d)))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const forecastPath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#DCA452')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,4')
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0.9)
      .attr('d', secondaryLine);

    // Primary Actual Area + Spline Line (Warm Sage / Terracotta)
    const primaryStroke = mode === 'visits' ? '#C87D55' : '#6D9E83';

    const primaryArea = d3
      .area<MonthlyMetricPoint>()
      .defined((d) => getPrimaryVal(d) !== null)
      .x((d) => xScale(d.label) ?? 0)
      .y0(innerHeight)
      .y1((d) => yScale(getPrimaryVal(d) ?? 0))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3WarmAreaGrad)')
      .attr('d', primaryArea);

    const primaryLine = d3
      .line<MonthlyMetricPoint>()
      .defined((d) => getPrimaryVal(d) !== null)
      .x((d) => xScale(d.label) ?? 0)
      .y((d) => yScale(getPrimaryVal(d) ?? 0))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const actualPath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryStroke)
      .attr('stroke-width', 2.75)
      .attr('stroke-linecap', 'round')
      .attr('d', primaryLine);

    // Subtle path reveal animation (respects prefers-reduced-motion)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const actualNode = actualPath.node();
      if (actualNode) {
        const len = actualNode.getTotalLength();
        actualPath
          .attr('stroke-dasharray', `${len} ${len}`)
          .attr('stroke-dashoffset', len)
          .transition()
          .duration(720)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }
      forecastPath.attr('opacity', 0).transition().duration(650).delay(150).attr('opacity', 0.9);
    }

    // Subtle terminal dots on actual & forecast endpoints
    const actualData = data.filter((d) => getPrimaryVal(d) !== null);
    if (actualData.length > 0) {
      const last = actualData[actualData.length - 1];
      g.append('circle')
        .attr('cx', xScale(last.label) ?? 0)
        .attr('cy', yScale(getPrimaryVal(last) ?? 0))
        .attr('r', 4.5)
        .attr('fill', primaryStroke)
        .attr('stroke', isDark ? '#1A1918' : '#FFFFFF')
        .attr('stroke-width', 2);
    }

    // Hover crosshair & focus ring
    const guideLine = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', isDark ? 'rgba(255,255,255,0.22)' : '#B8AEA0')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4,3')
      .style('opacity', 0);

    const focusHalo = g
      .append('circle')
      .attr('r', 8)
      .attr('fill', primaryStroke)
      .attr('opacity', 0.18)
      .style('display', 'none');

    const focusDot = g
      .append('circle')
      .attr('r', 4.8)
      .attr('fill', primaryStroke)
      .attr('stroke', isDark ? '#1A1918' : '#FFFFFF')
      .attr('stroke-width', 2.2)
      .style('display', 'none');

    const forecastDot = g
      .append('circle')
      .attr('r', 3.8)
      .attr('fill', '#DCA452')
      .attr('stroke', isDark ? '#1A1918' : '#FFFFFF')
      .attr('stroke-width', 1.8)
      .style('display', 'none');

    // Interactive invisible hit layer
    const xPositions = data.map((d) => ({ point: d, x: xScale(d.label) ?? 0 }));

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove touchmove', function (event) {
        const [mx] = d3.pointer(event, this);
        let closest = xPositions[0];
        let minDist = Infinity;
        for (const item of xPositions) {
          const dist = Math.abs(item.x - mx);
          if (dist < minDist) {
            minDist = dist;
            closest = item;
          }
        }
        const pt = closest.point;
        const px = closest.x;
        const primaryVal = getPrimaryVal(pt);
        const secondaryVal = getSecondaryVal(pt);
        const py = primaryVal !== null ? yScale(primaryVal) : yScale(secondaryVal);

        guideLine.attr('x1', px).attr('x2', px).style('opacity', 1);

        if (primaryVal !== null) {
          focusHalo.attr('cx', px).attr('cy', py).style('display', null);
          focusDot.attr('cx', px).attr('cy', py).style('display', null);
        } else {
          focusHalo.style('display', 'none');
          focusDot.style('display', 'none');
        }

        forecastDot
          .attr('cx', px)
          .attr('cy', yScale(secondaryVal))
          .style('display', null);

        setHovered({
          point: pt,
          x: margin.left + px,
          y: margin.top + py,
        });
      })
      .on('mouseleave', () => {
        guideLine.style('opacity', 0);
        focusHalo.style('display', 'none');
        focusDot.style('display', 'none');
        forecastDot.style('display', 'none');
        setHovered(null);
      });
  }, [data, width, height, mode, isDark]);

  const cardSurface =
    themeMode === 'galaxy'
      ? 'bg-[#100E24]/90 border-indigo-950/70 text-stone-100'
      : themeMode === 'dark'
      ? 'bg-[#191817] border-[#2A2825] text-stone-100'
      : 'bg-[#FFFEFC] border-[#EAE3D7] text-[#221F1D] shadow-[0_2px_18px_rgba(34,31,29,0.03)]';

  const latestActual = [...data].reverse().find((d) => d.actualRevenue !== null);
  const latestVal = latestActual?.actualRevenue ?? 0;

  return (
    <div className={`rounded-[24px] border p-6 transition-colors duration-300 ${cardSurface}`}>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-serif font-semibold tracking-tight">{title}</h3>
            <span className="text-[11px] font-mono tabular-nums text-stone-400">
              · {dateRange.label}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {subtitle || 'Interactive D3.js trend analysis comparing verified performance against forward forecast'}
          </p>
        </div>

        {/* Clean segmented mode selector */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border self-start sm:self-auto ${
            isDark ? 'bg-white/[0.04] border-white/10' : 'bg-[#F5F0E7] border-[#E8E0D4]'
          }`}
        >
          {(
            [
              { id: 'revenue', label: 'Revenue' },
              { id: 'net', label: 'Net Margin' },
              { id: 'visits', label: 'Visits' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-sans font-medium transition-all cursor-pointer whitespace-nowrap ${
                mode === tab.id
                  ? isDark
                    ? 'bg-[#F3EFEA] text-[#171614] font-semibold'
                    : 'bg-[#171614] text-white font-semibold'
                  : isDark
                  ? 'text-stone-400 hover:text-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inline Legend + Latest Highlight */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        <div className="flex items-center gap-4 text-[11px] text-stone-400">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: mode === 'visits' ? '#C87D55' : '#6D9E83' }}
            />
            {mode === 'revenue' ? 'Actual Revenue' : mode === 'net' ? 'Net Operating Margin' : 'Completed Visits'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-[#DCA452] rounded-full" />
            {mode === 'visits' ? 'Projected Visits' : 'Forecast Trajectory'}
          </span>
        </div>

        <div className="text-[11px] font-mono tabular-nums text-stone-400">
          Latest verified:{' '}
          <strong className={isDark ? 'text-stone-100' : 'text-[#221F1D]'}>
            ${latestVal.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Responsive D3 SVG Canvas + Floating Popover Tooltip */}
      <div ref={wrapperRef} className="relative w-full select-none" style={{ height }}>
        <svg ref={svgRef} width={width} height={height} className="overflow-visible block" />

        {hovered && (
          <div
            className={`pointer-events-none absolute z-20 w-52 rounded-2xl border px-3.5 py-3 transition-transform duration-75 ${
              isDark
                ? 'bg-[#1F1E1C]/95 border-[#3A3733] text-stone-100 shadow-[0_14px_34px_rgba(0,0,0,0.5)]'
                : 'bg-[#FFFEFC]/98 border-[#E6DFD4] text-[#221F1D] shadow-[0_14px_34px_rgba(34,31,29,0.12)]'
            }`}
            style={{
              left: Math.min(Math.max(12, hovered.x - 104), Math.max(12, width - 220)),
              top: Math.max(4, hovered.y - 108),
            }}
          >
            <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
              <span className="font-semibold uppercase tracking-wider">{hovered.point.label}</span>
              <span className="font-mono tabular-nums">{hovered.point.date}</span>
            </div>

            {mode === 'visits' ? (
              <div className="space-y-1">
                <div className="text-lg font-serif font-bold tabular-nums">
                  {hovered.point.telemedicine + hovered.point.inClinic + hovered.point.emergency} visits
                </div>
                <div className="text-[10px] text-stone-400 flex items-center justify-between font-mono tabular-nums">
                  <span>Tele: {hovered.point.telemedicine}</span>
                  <span>Clinic: {hovered.point.inClinic}</span>
                  <span>ER: {hovered.point.emergency}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-lg font-serif font-bold tabular-nums">
                  {hovered.point.actualRevenue !== null
                    ? `$${(mode === 'net'
                        ? hovered.point.actualRevenue - hovered.point.expenses
                        : hovered.point.actualRevenue
                      ).toLocaleString()}`
                    : 'Forecast Window'}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                  <span className="text-stone-400">Forecast:</span>
                  <span className="font-semibold text-[#DCA452]">
                    $
                    {(mode === 'net'
                      ? hovered.point.forecastRevenue - hovered.point.expenses
                      : hovered.point.forecastRevenue
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-stone-400">
                  <span>Operating Costs:</span>
                  <span>${hovered.point.expenses.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
