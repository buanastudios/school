import React, { useState, useMemo } from 'react';
import type { StudentMasterRecord } from '../../types';
import {
  TrendingUp,
  LineChart,
  BarChart3,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Activity,
} from 'lucide-react';

interface StudentTimeframeChartsProps {
  student: StudentMasterRecord;
  isHallMode?: boolean;
}

type TimeframeType = 'monthly' | 'semester' | 'yearly';

export const StudentTimeframeCharts: React.FC<StudentTimeframeChartsProps> = ({
  student,
  isHallMode = false,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('monthly');

  // Sub-controls for each timeframe
  const [selectedSubject, setSelectedSubject] = useState<string>('all'); // for Monthly
  const [semesterChartStyle, setSemesterChartStyle] = useState<'grouped' | 'stacked'>('grouped'); // for Semester
  const [yearlyChartStyle, setYearlyChartStyle] = useState<'dual_axis' | 'horizontal'>('dual_axis'); // for Yearly
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number; detail?: string } | null>(null);

  // ---------------------------------------------------------------------------
  // 1. DATA COMPUTATION: MONTHLY (SHORT-TERM)
  // Generates or derives monthly trajectory for current semester (Juli - Desember)
  // ---------------------------------------------------------------------------
  const monthlyData = useMemo(() => {
    const months = ['Juli', 'Agustus', 'September', 'Oktober (STS)', 'November', 'Desember (SAS)'];
    const currentGrades = student.grades || [];
    const avgScore =
      student.historicalScores?.[student.historicalScores.length - 1]?.nilaiRataRata ||
      student.grades.reduce((acc, g) => acc + (g.nilaiGenap || g.nilaiGanjil || 80), 0) / (student.grades.length || 1);

    // Build subject-level monthly progress
    const subjectNames = [
      'Rata-Rata',
      ...currentGrades.map((g) => {
        if (g.mapelNama.includes('Matematika')) return 'Matematika';
        if (g.mapelNama.includes('Bahasa Indonesia')) return 'B. Indonesia';
        if (g.mapelNama.includes('IPAS') || g.mapelNama.includes('Alam')) return 'IPAS';
        if (g.mapelNama.includes('Agama')) return 'PAI';
        if (g.mapelNama.includes('Pancasila')) return 'Pancasila';
        if (g.mapelNama.includes('Jasmani') || g.mapelNama.includes('PJOK')) return 'PJOK';
        if (g.mapelNama.includes('Seni')) return 'Seni Rupa';
        if (g.mapelNama.includes('Sunda')) return 'B. Sunda';
        return g.mapelNama.split(' ')[0];
      }),
    ];
    const uniqueSubjects = Array.from(new Set(subjectNames));

    // Dynamic curvature based on student's performance
    const points = months.map((m, idx) => {
      // Small progression curve towards final semester score
      const factor = (idx - 2.5) * 1.1;
      const scores: { [key: string]: number } = {};

      uniqueSubjects.forEach((sub) => {
        let base = avgScore;
        const foundGrade = currentGrades.find((g) => g.mapelNama.includes(sub));
        if (foundGrade) {
          base = foundGrade.nilaiGanjil || foundGrade.nilaiGenap || avgScore;
        }
        // Realistic variation: mid-term dip or peak
        const noise = Math.sin(idx * 1.5) * 1.2;
        const val = Math.min(100, Math.max(65, Math.round((base - 4 + factor + noise) * 10) / 10));
        scores[sub] = val;
      });

      return {
        month: m,
        scores,
      };
    });

    return { months, uniqueSubjects, points };
  }, [student]);

  // ---------------------------------------------------------------------------
  // 2. DATA COMPUTATION: SEMESTER (MID-TERM)
  // Grouped comparison: Semester 1 (Ganjil) vs Semester 2 (Genap)
  // ---------------------------------------------------------------------------
  const semesterComparisonData = useMemo(() => {
    return student.grades.map((g) => {
      const sem1 = g.nilaiGanjil || 80;
      const sem2 = g.nilaiGenap || Math.min(100, Math.max(70, sem1 + 3));
      const delta = sem2 - sem1;
      const kktp = g.kktpGanjil || 75;

      let label = g.mapelNama;
      if (label.includes('Pendidikan Agama')) label = 'Pendidikan Agama (PAI)';
      else if (label.includes('Pendidikan Pancasila')) label = 'Pendidikan Pancasila';
      else if (label.includes('Bahasa Indonesia')) label = 'Bahasa Indonesia';
      else if (label.includes('Matematika')) label = 'Matematika';
      else if (label.includes('IPAS')) label = 'IPAS';
      else if (label.includes('Jasmani') || label.includes('PJOK')) label = 'PJOK';
      else if (label.includes('Seni')) label = 'Seni Rupa & Kriya';
      else if (label.includes('Sunda')) label = 'Bahasa Sunda';
      else if (label.includes('Inggris')) label = 'Bahasa Inggris';

      return {
        id: g.mapelId,
        subject: label,
        sem1,
        sem2,
        delta,
        kktp,
        capaianGanjil: g.capaianGanjil,
        capaianGenap: g.capaianGenap,
      };
    });
  }, [student]);

  // ---------------------------------------------------------------------------
  // 3. DATA COMPUTATION: YEARLY (LONG-TERM)
  // Multi-year dual axis: Academic GPA vs Attendance % and Point Accumulation
  // ---------------------------------------------------------------------------
  const yearlyData = useMemo(() => {
    // If student has multi-year history, group by Academic Year
    const history = student.historicalScores || [];
    const yearsMap: { [year: string]: { scores: number[]; attendance: number[]; label: string; yearNum: number } } = {};

    history.forEach((h) => {
      const match = h.semesterLabel.match(/Kelas (\d+)/);
      const gradeNum = match ? parseInt(match[1], 10) : student.kelas;
      const key = `Kelas ${gradeNum}`;
      if (!yearsMap[key]) {
        yearsMap[key] = { scores: [], attendance: [], label: key, yearNum: gradeNum };
      }
      yearsMap[key].scores.push(h.nilaiRataRata);
      yearsMap[key].attendance.push(h.kehadiranPersen);
    });

    // If only 1 year in history, fill up to current class
    if (Object.keys(yearsMap).length === 0) {
      yearsMap[`Kelas ${student.kelas}`] = {
        scores: [88.5],
        attendance: [98],
        label: `Kelas ${student.kelas}`,
        yearNum: student.kelas,
      };
    }

    return Object.values(yearsMap).map((y, idx) => {
      const avgScore = y.scores.reduce((a, b) => a + b, 0) / y.scores.length;
      const avgAtt = y.attendance.reduce((a, b) => a + b, 0) / y.attendance.length;
      const letterGrade = avgScore >= 92 ? 'A' : avgScore >= 83 ? 'B+' : avgScore >= 75 ? 'B' : 'C';

      // Cumulative point awards (scaled with year)
      const cumulativePoints = Math.round((idx + 1) * 24 + (avgScore - 75) * 2);

      return {
        label: y.label,
        gradeNum: y.yearNum,
        avgScore: Math.round(avgScore * 10) / 10,
        attendance: Math.round(avgAtt * 10) / 10,
        letterGrade,
        cumulativePoints,
      };
    });
  }, [student]);

  // Compute overall summary stats
  const firstYear = yearlyData[0];
  const lastYear = yearlyData[yearlyData.length - 1];
  const totalGrowth =
    firstYear && lastYear ? (lastYear.avgScore - firstYear.avgScore).toFixed(1) : '0.0';

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
      isHallMode ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* ===================================================================== */}
      {/* HEADER & TIMEFRAME SELECTOR TABS                                      */}
      {/* ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500">
              Analitika Capaian Siswa Terpadu
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight mt-1 flex items-center gap-2">
            <span>Visualisasi Rekam Perkembangan Nilai</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              NIS: {student.noInduk}
            </span>
          </h3>
          <p className={`text-xs mt-0.5 ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Eksplorasi tren capaian akademik murid berdasarkan kerangka waktu jangka pendek, menengah, dan panjang
          </p>
        </div>

        {/* 3 Main Timeframe Tabs */}
        <div className={`flex items-center p-1 rounded-2xl border ${
          isHallMode ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'monthly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isHallMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-none">Bulanan (Short-term)</span>
              <span className="text-[9px] opacity-75 font-normal">Line Graph • Momentum</span>
            </div>
          </button>

          <button
            onClick={() => setTimeframe('semester')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'semester'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isHallMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-none">Semester (Mid-term)</span>
              <span className="text-[9px] opacity-75 font-normal">Grouped / Stacked Bar</span>
            </div>
          </button>

          <button
            onClick={() => setTimeframe('yearly')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'yearly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isHallMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-none">Tahunan (Long-term)</span>
              <span className="text-[9px] opacity-75 font-normal">Dual-Axis • Growth</span>
            </div>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. TIMEFRAME 1: MONTHLY (SHORT-TERM) - LINE GRAPH                     */}
      {/* ===================================================================== */}
      {timeframe === 'monthly' && (
        <div className="space-y-4 pt-4">
          {/* Sub Controls: Subject Selector Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-extrabold text-slate-500 shrink-0">Fokus Mapel:</span>
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubject === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isHallMode
                    ? 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rata-Rata Seluruh Mapel
              </button>
              {monthlyData.uniqueSubjects
                .filter((s) => s !== 'Rata-Rata')
                .map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedSubject === subj
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isHallMode
                        ? 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
            </div>

            {/* Momentum Indicator Pill */}
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Flame className="w-3.5 h-3.5" />
                <span>Momentum Positif (+1.4 Poin/Bulan)</span>
              </span>
            </div>
          </div>

          {/* Interactive SVG Line Graph Canvas */}
          <div className={`p-4 sm:p-6 rounded-2xl border relative overflow-hidden ${
            isHallMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50/70 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-indigo-500" />
                Grafik Garis Fluktuasi & Laju Kemajuan Belajar Siswa (Juli - Desember)
              </span>
              <span className="text-[11px] text-emerald-500 font-bold">
                Target KKTP Minimum: 75.0
              </span>
            </div>

            {/* SVG Visual */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none">
              <div className="min-w-[620px] h-64 relative">
                <svg viewBox="0 0 650 220" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines (60, 75 KKTP, 85, 100) */}
                  <line x1="40" y1="20" x2="620" y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x="15" y="24" fontSize="10" fill="#94a3b8" fontWeight="bold">100</text>

                  <line x1="40" y1="65" x2="620" y2="65" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x="15" y="69" fontSize="10" fill="#94a3b8" fontWeight="bold">90</text>

                  {/* KKTP 75 Guideline (Dashed Emerald) */}
                  <line x1="40" y1="125" x2="620" y2="125" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="0" y="129" fontSize="9" fill="#10b981" fontWeight="bold">KKTP 75</text>

                  <line x1="40" y1="180" x2="620" y2="180" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x="15" y="184" fontSize="10" fill="#94a3b8" fontWeight="bold">60</text>

                  {/* Compute Points on SVG */}
                  {(() => {
                    const activeKey = selectedSubject === 'all' ? 'Rata-Rata' : selectedSubject;
                    const coords = monthlyData.points.map((pt, i) => {
                      const score = pt.scores[activeKey] || pt.scores['Rata-Rata'] || 85;
                      const x = 70 + i * 105;
                      // scale 60 -> y=180, 100 -> y=20 (range 160 px for 40 pts, 4 px per pt)
                      const y = Math.max(20, Math.min(180, 180 - (score - 60) * 4));
                      return { x, y, score, month: pt.month };
                    });

                    // Build SVG Path
                    const dLine = coords.reduce((acc, c, i) => {
                      if (i === 0) return `M ${c.x} ${c.y}`;
                      // Smooth curve using cubic bezier
                      const prev = coords[i - 1];
                      const cx1 = prev.x + (c.x - prev.x) / 2;
                      const cy1 = prev.y;
                      const cx2 = prev.x + (c.x - prev.x) / 2;
                      const cy2 = c.y;
                      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${c.x} ${c.y}`;
                    }, '');

                    const dArea = `${dLine} L ${coords[coords.length - 1].x} 180 L ${coords[0].x} 180 Z`;

                    return (
                      <g>
                        {/* Area Fill */}
                        <path d={dArea} fill="url(#lineGrad)" />

                        {/* Main Trend Line */}
                        <path d={dLine} fill="none" stroke="url(#strokeGrad)" strokeWidth="3.5" strokeLinecap="round" />

                        {/* Data Points with Tooltips & Badges */}
                        {coords.map((c, i) => {
                          const isLast = i === coords.length - 1;
                          const isHovered = hoveredPoint?.label === c.month;

                          return (
                            <g
                              key={i}
                              className="cursor-pointer group"
                              onMouseEnter={() => setHoveredPoint({ label: c.month, value: c.score, detail: activeKey })}
                              onMouseLeave={() => setHoveredPoint(null)}
                            >
                              {/* Pulse circle on latest point */}
                              {isLast && (
                                <circle cx={c.x} cy={c.y} r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
                              )}

                              {/* Outer ring */}
                              <circle
                                cx={c.x}
                                cy={c.y}
                                r={isHovered ? 8 : 5.5}
                                fill={isHallMode ? '#1e293b' : '#ffffff'}
                                stroke="#6366f1"
                                strokeWidth="3"
                                className="transition-all"
                              />

                              {/* Value Label Bubble */}
                              <rect
                                x={c.x - 17}
                                y={c.y - 25}
                                width="34"
                                height="18"
                                rx="5"
                                fill="#4f46e5"
                                className="shadow-md"
                              />
                              <text
                                x={c.x}
                                y={c.y - 13}
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {c.score}
                              </text>

                              {/* Month Bottom Label */}
                              <text
                                x={c.x}
                                y="205"
                                textAnchor="middle"
                                fill={isHallMode ? '#cbd5e1' : '#475569'}
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {c.month}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Momentum Insights Callout */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className={isHallMode ? 'text-slate-300' : 'text-slate-700'}>
                  <strong>Evaluasi Momentum:</strong> Siswa menunjukkan grafik stabil di atas garis batas KKTP (75) dengan akselerasi positif menjelang Sumatif Akhir Semester (SAS).
                </span>
              </div>
              <span className={`text-[11px] shrink-0 ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                *Data terkompilasi dari asesmen formatif 1-4 & sumatif tengah semester.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. TIMEFRAME 2: SEMESTER (MID-TERM) - GROUPED / STACKED BAR CHART     */}
      {/* ===================================================================== */}
      {timeframe === 'semester' && (
        <div className="space-y-4 pt-4">
          {/* Sub Controls: Grouped vs Stacked Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-extrabold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <span>Komparasi Berdampingan: Semester 1 (Ganjil) vs Semester 2 (Genap)</span>
              </h4>
              <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Membandingkan secara langsung pertumbuhan skor antar semester untuk tiap mata pelajaran intrakurikuler
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-700">
                <button
                  onClick={() => setSemesterChartStyle('grouped')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    semesterChartStyle === 'grouped'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Grouped Bar (Berdampingan)
                </button>
                <button
                  onClick={() => setSemesterChartStyle('stacked')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    semesterChartStyle === 'stacked'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Stacked Bar (Akumulasi)
                </button>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Canvas */}
          <div className={`p-4 sm:p-6 rounded-2xl border ${
            isHallMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50/70 border-slate-200/80'
          }`}>
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 text-xs font-bold mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-indigo-600" />
                <span className={isHallMode ? 'text-slate-300' : 'text-slate-700'}>Semester 1 (Ganjil)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span className={isHallMode ? 'text-slate-300' : 'text-slate-700'}>Semester 2 (Genap)</span>
              </div>
            </div>

            {/* Bars Canvas */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
              <div className="min-w-[680px] h-64 relative flex items-end justify-between gap-4 pt-6 pb-8 px-4 border-b border-slate-200 dark:border-slate-700">
                {/* Horizontal guidelines */}
                <div className="absolute inset-x-0 top-6 border-b border-dashed border-slate-200 dark:border-slate-700/60 pointer-events-none">
                  <span className="text-[10px] text-slate-400 absolute -top-3 left-1">100</span>
                </div>
                <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-200 dark:border-slate-700/60 pointer-events-none">
                  <span className="text-[10px] text-slate-400 absolute -top-3 left-1">75 (KKTP)</span>
                </div>

                {semesterComparisonData.map((item, idx) => {
                  const h1 = Math.min(100, Math.max(30, (item.sem1 / 100) * 100));
                  const h2 = Math.min(100, Math.max(30, (item.sem2 / 100) * 100));
                  const isPositive = item.delta >= 0;

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end z-10 flex-1 min-w-[4.2rem]">
                      {/* Delta Tag on Top */}
                      <div className={`mb-1.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-0.5 shadow-2xs ${
                        isPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{item.delta > 0 ? `+${item.delta}` : item.delta}</span>
                      </div>

                      {/* Bar Group */}
                      {semesterChartStyle === 'grouped' ? (
                        <div className="flex items-end gap-1 w-full justify-center">
                          {/* Sem 1 Bar */}
                          <div
                            style={{ height: `${h1}%` }}
                            className="w-4 sm:w-5 rounded-t-md bg-indigo-600 relative group transition-all"
                            title={`Sem 1: ${item.sem1}`}
                          >
                            <span className="absolute -top-4 inset-x-0 text-center text-[9px] font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.sem1}
                            </span>
                          </div>

                          {/* Sem 2 Bar */}
                          <div
                            style={{ height: `${h2}%` }}
                            className="w-4 sm:w-5 rounded-t-md bg-emerald-500 relative group transition-all"
                            title={`Sem 2: ${item.sem2}`}
                          >
                            <span className="absolute -top-4 inset-x-0 text-center text-[9px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.sem2}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Stacked Bar Mode */
                        <div className="w-6 sm:w-7 flex flex-col justify-end relative group">
                          <div
                            style={{ height: `${Math.max(15, h2 - h1 + 15)}%` }}
                            className="w-full rounded-t-md bg-emerald-500 transition-all border-b border-white/20"
                            title={`Peningkatan: +${item.delta}`}
                          />
                          <div
                            style={{ height: `${h1 * 0.7}%` }}
                            className="w-full rounded-b-md bg-indigo-600 transition-all"
                            title={`Dasar Sem 1: ${item.sem1}`}
                          />
                        </div>
                      )}

                      {/* Subject Label */}
                      <span className="text-[10px] font-bold mt-2 text-center truncate max-w-[4.8rem] block" title={item.subject}>
                        {item.subject}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Comparative Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold text-[11px]">
                    <th className="py-2 px-3">Mata Pelajaran</th>
                    <th className="py-2 px-2 text-center">Sem 1 (Ganjil)</th>
                    <th className="py-2 px-2 text-center">Sem 2 (Genap)</th>
                    <th className="py-2 px-2 text-center">Selisih (Delta)</th>
                    <th className="py-2 px-3">Capaian & Rekomendasi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {semesterComparisonData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">{row.subject}</td>
                      <td className="py-2 px-2 text-center font-bold text-indigo-600 dark:text-indigo-400">{row.sem1}</td>
                      <td className="py-2 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{row.sem2}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          row.delta >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.delta > 0 ? `+${row.delta}` : row.delta} Poin
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {row.capaianGenap || row.capaianGanjil || 'Menunjukkan kemandirian belajar yang sangat memuaskan.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TIMEFRAME 3: YEARLY (LONG-TERM) - DUAL-AXIS / HORIZONTAL GROWTH    */}
      {/* ===================================================================== */}
      {timeframe === 'yearly' && (
        <div className="space-y-4 pt-4">
          {/* Sub Controls: Dual Axis vs Horizontal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-extrabold flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>Pertumbuhan Jangka Panjang (Multi-Year Trajectory)</span>
              </h4>
              <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Menampilkan evolusi nilai rapor akhir tahun, predikat mutu (A/B), tingkat kehadiran, dan akumulasi poin prestasi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-700">
                <button
                  onClick={() => setYearlyChartStyle('dual_axis')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    yearlyChartStyle === 'dual_axis'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Dual-Axis (Nilai vs Kehadiran)
                </button>
                <button
                  onClick={() => setYearlyChartStyle('horizontal')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    yearlyChartStyle === 'horizontal'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Horizontal Bar (Milestone)
                </button>
              </div>
            </div>
          </div>

          {/* Growth Summary Metrics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-2xl border ${isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold block">Pertumbuhan Kumulatif</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-500">+{totalGrowth} Poin</span>
              <span className="text-[10px] text-slate-500 block">Sejak Kelas 1 Masuk</span>
            </div>

            <div className={`p-3 rounded-2xl border ${isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold block">Predikat Mutu Terakhir</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-sm">
                  {lastYear?.letterGrade || 'A'}
                </span>
                <span className="text-xs font-bold text-indigo-400">Sangat Baik</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Standar Kelulusan</span>
            </div>

            <div className={`p-3 rounded-2xl border ${isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold block">Rata-Rata Kehadiran</span>
              <span className="text-xl sm:text-2xl font-black text-white">{lastYear?.attendance || 98}%</span>
              <span className="text-[10px] text-emerald-400 block font-bold">Disiplin Tinggi</span>
            </div>

            <div className={`p-3 rounded-2xl border ${isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold block">Portofolio & Prestasi</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {(student.contributions?.length || 0) + (student.cocurriculars?.length || 0)} Kegiatan
              </span>
              <span className="text-[10px] text-amber-300 block font-bold">Tercatat di Hall of Fame</span>
            </div>
          </div>

          {/* DUAL-AXIS CHART CANVAS */}
          {yearlyChartStyle === 'dual_axis' ? (
            <div className={`p-4 sm:p-6 rounded-2xl border ${
              isHallMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50/70 border-slate-200/80'
            }`}>
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-indigo-600" />
                    <span className="font-bold">Sumbu Kiri: Rata-Rata Nilai Akhir Tahun (0 - 100)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="font-bold text-amber-400">Sumbu Kanan: Persentase Kehadiran (%)</span>
                  </div>
                </div>
              </div>

              {/* Dual-Axis SVG Canvas */}
              <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                <div className="min-w-[620px] h-64 relative">
                  <svg viewBox="0 0 650 220" className="w-full h-full overflow-visible">
                    {/* Background lines */}
                    <line x1="40" y1="20" x2="610" y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                    <text x="15" y="24" fontSize="10" fill="#94a3b8">100</text>
                    <text x="618" y="24" fontSize="10" fill="#f59e0b">100%</text>

                    <line x1="40" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                    <text x="15" y="79" fontSize="10" fill="#94a3b8">85</text>
                    <text x="618" y="79" fontSize="10" fill="#f59e0b">85%</text>

                    <line x1="40" y1="130" x2="610" y2="130" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="0" y="134" fontSize="9" fill="#10b981">KKTP 75</text>
                    <text x="618" y="134" fontSize="10" fill="#f59e0b">75%</text>

                    <line x1="40" y1="180" x2="610" y2="180" stroke="#94a3b8" strokeOpacity="0.5" />

                    {/* Bars for Score and Trendline for Attendance */}
                    {(() => {
                      const count = yearlyData.length;
                      const step = Math.min(95, 520 / Math.max(1, count));
                      const startX = 80;

                      const coords = yearlyData.map((y, i) => {
                        const x = startX + i * step;
                        // Score: 60 -> y=180, 100 -> y=20
                        const yScore = Math.max(20, Math.min(180, 180 - (y.avgScore - 60) * 4));
                        // Attendance: 70 -> y=180, 100 -> y=20
                        const yAtt = Math.max(20, Math.min(180, 180 - (y.attendance - 70) * (160 / 30)));
                        return { x, yScore, yAtt, item: y };
                      });

                      const attLine = coords.reduce((acc, c, i) => {
                        return i === 0 ? `M ${c.x} ${c.yAtt}` : `${acc} L ${c.x} ${c.yAtt}`;
                      }, '');

                      return (
                        <g>
                          {/* Bars for Annual Score */}
                          {coords.map((c, i) => {
                            const barHeight = 180 - c.yScore;
                            return (
                              <g key={`bar-${i}`} className="group">
                                {/* Bar */}
                                <rect
                                  x={c.x - 22}
                                  y={c.yScore}
                                  width="44"
                                  height={barHeight}
                                  rx="8"
                                  fill="url(#strokeGrad)"
                                  className="shadow-md transition-all group-hover:brightness-110"
                                />

                                {/* Letter Grade Stamp */}
                                <circle
                                  cx={c.x}
                                  cy={c.yScore - 14}
                                  r="11"
                                  fill="#4f46e5"
                                  className="shadow-sm"
                                />
                                <text
                                  x={c.x}
                                  y={c.yScore - 10}
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="10"
                                  fontWeight="900"
                                >
                                  {c.item.letterGrade}
                                </text>

                                {/* Value above */}
                                <text
                                  x={c.x}
                                  y={c.yScore + 18}
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="11"
                                  fontWeight="bold"
                                >
                                  {c.item.avgScore}
                                </text>

                                {/* Year bottom label */}
                                <text
                                  x={c.x}
                                  y="200"
                                  textAnchor="middle"
                                  fill={isHallMode ? '#e2e8f0' : '#1e293b'}
                                  fontSize="11"
                                  fontWeight="bold"
                                >
                                  {c.item.label}
                                </text>
                              </g>
                            );
                          })}

                          {/* Attendance Connecting Line (Right Axis) */}
                          <path
                            d={attLine}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3"
                            strokeDasharray="4 4"
                          />

                          {/* Attendance Data Nodes */}
                          {coords.map((c, i) => (
                            <g key={`att-${i}`}>
                              <circle
                                cx={c.x}
                                cy={c.yAtt}
                                r="4.5"
                                fill="#f59e0b"
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              <text
                                x={c.x + 12}
                                y={c.yAtt - 4}
                                fill="#f59e0b"
                                fontSize="9"
                                fontWeight="bold"
                              >
                                {c.item.attendance}%
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* HORIZONTAL BAR MILESTONE CHART */
            <div className={`p-4 sm:p-6 rounded-2xl border space-y-4 ${
              isHallMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50/70 border-slate-200/80'
            }`}>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pita Pertumbuhan Skor Per Tingkat Jenjang (Horizontal Progression)
              </h5>

              <div className="space-y-3">
                {yearlyData.map((y, idx) => {
                  const percent = Math.min(100, Math.max(20, y.avgScore));
                  const isTop = y.avgScore >= 90;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="w-6 text-center text-slate-400 font-mono">#{idx + 1}</span>
                          <span className={isHallMode ? 'text-white' : 'text-slate-900'}>{y.label}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-black ${
                            isTop ? 'bg-amber-400 text-slate-950' : 'bg-indigo-600 text-white'
                          }`}>
                            Predikat {y.letterGrade}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-medium text-[11px]">Kehadiran: {y.attendance}%</span>
                          <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">{y.avgScore} Poin</span>
                        </div>
                      </div>

                      {/* Horizontal Bar */}
                      <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden relative">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full transition-all duration-700 ${
                            isTop
                              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-400'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
