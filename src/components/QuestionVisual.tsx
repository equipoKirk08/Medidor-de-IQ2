import { useId } from 'react';
import { VisualType } from '../types/quiz';

interface QuestionVisualProps {
  visual: VisualType;
}

function MatrixCell({
  shape,
  fill,
}: {
  shape: 'circle' | 'triangle' | 'square';
  fill: 'solid' | 'outline' | 'striped';
}) {
  const patternId = useId();
  const fillProp =
    fill === 'solid'
      ? '#0f172a'
      : fill === 'striped'
        ? `url(#${patternId})`
        : 'none';

  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12" aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
        </pattern>
      </defs>
      {shape === 'circle' && (
        <circle
          cx="32"
          cy="32"
          r="19"
          fill={fillProp}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      )}
      {shape === 'square' && (
        <rect
          x="14"
          y="14"
          width="36"
          height="36"
          rx="2"
          fill={fillProp}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      )}
      {shape === 'triangle' && (
        <polygon
          points="32,12 52,50 12,50"
          fill={fillProp}
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function QuestionVisual({ visual }: QuestionVisualProps) {
  if (visual === 'rotation-sequence') {
    const activeQuadrants = [0, 1, 3]; // 0: TL, 1: TR, 2: BL, 3: BR
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
          {activeQuadrants.map((quad, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <svg
                viewBox="0 0 80 80"
                className="w-20 h-20"
                aria-label={`Paso ${idx + 1}`}
              >
                <rect
                  x="4"
                  y="4"
                  width="36"
                  height="36"
                  fill={quad === 0 ? '#0284c7' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="4"
                  width="36"
                  height="36"
                  fill={quad === 1 ? '#0284c7' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect
                  x="4"
                  y="40"
                  width="36"
                  height="36"
                  fill={quad === 2 ? '#0284c7' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="40"
                  width="36"
                  height="36"
                  fill={quad === 3 ? '#0284c7' : '#ffffff'}
                  stroke="#334155"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-xs font-mono text-slate-500">
                Paso {idx + 1}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-sky-600 bg-white flex items-center justify-center">
              <span className="text-2xl font-mono font-semibold text-sky-700">
                ?
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">Paso 4</span>
          </div>
        </div>
      </div>
    );
  }

  if (visual === 'shape-matrix') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex justify-center">
        <div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-lg">
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="circle" fill="solid" />
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="triangle" fill="outline" />
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="square" fill="striped" />
          </div>

          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="triangle" fill="striped" />
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="square" fill="solid" />
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="circle" fill="outline" />
          </div>

          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="square" fill="outline" />
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <MatrixCell shape="circle" fill="striped" />
          </div>
          <div className="bg-sky-50 border-2 border-dashed border-sky-600 p-2 rounded flex items-center justify-center">
            <span className="text-2xl font-mono font-semibold text-sky-700">
              ?
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (visual === 'number-triads') {
    const triads = [
      { left: 3, right: 5, bottom: '16' },
      { left: 7, right: 2, bottom: '18' },
      { left: 6, right: 8, bottom: '?' },
    ];
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {triads.map((t, idx) => (
            <svg
              key={idx}
              viewBox="0 0 140 110"
              className="w-36 h-28"
              aria-label={`Pareja ${idx + 1}`}
            >
              <line
                x1="34"
                y1="30"
                x2="70"
                y2="80"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <line
                x1="106"
                y1="30"
                x2="70"
                y2="80"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <circle
                cx="34"
                cy="28"
                r="18"
                fill="#ffffff"
                stroke="#334155"
                strokeWidth="2"
              />
              <text
                x="34"
                y="34"
                textAnchor="middle"
                className="text-sm font-mono font-semibold fill-slate-900"
              >
                {t.left}
              </text>
              <circle
                cx="106"
                cy="28"
                r="18"
                fill="#ffffff"
                stroke="#334155"
                strokeWidth="2"
              />
              <text
                x="106"
                y="34"
                textAnchor="middle"
                className="text-sm font-mono font-semibold fill-slate-900"
              >
                {t.right}
              </text>
              <circle
                cx="70"
                cy="82"
                r="20"
                fill={t.bottom === '?' ? '#f0f9ff' : '#0f172a'}
                stroke={t.bottom === '?' ? '#0284c7' : '#0f172a'}
                strokeWidth="2"
                strokeDasharray={t.bottom === '?' ? '4 3' : undefined}
              />
              <text
                x="70"
                y="88"
                textAnchor="middle"
                className={`text-sm font-mono font-semibold ${
                  t.bottom === '?' ? 'fill-sky-700' : 'fill-white'
                }`}
              >
                {t.bottom}
              </text>
            </svg>
          ))}
        </div>
      </div>
    );
  }

  if (visual === 'polygon-progression') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
          {/* Step 1: Triangle + 1 dot */}
          <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 80 80" className="w-20 h-20" aria-label="Triángulo con 1 punto">
              <polygon
                points="40,10 70,66 10,66"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="48" r="3.5" fill="#0284c7" />
            </svg>
            <span className="text-xs font-mono text-slate-500">3 lados · 1 pt</span>
          </div>

          {/* Step 2: Square + 2 dots */}
          <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 80 80" className="w-20 h-20" aria-label="Cuadrado con 2 puntos">
              <rect
                x="14"
                y="14"
                width="52"
                height="52"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2.5"
              />
              <circle cx="32" cy="40" r="3.5" fill="#0284c7" />
              <circle cx="48" cy="40" r="3.5" fill="#0284c7" />
            </svg>
            <span className="text-xs font-mono text-slate-500">4 lados · 2 pts</span>
          </div>

          {/* Step 3: Pentagon + 3 dots */}
          <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 80 80" className="w-20 h-20" aria-label="Pentágono con 3 puntos">
              <polygon
                points="40,10 70,32 58,66 22,66 10,32"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="34" r="3.5" fill="#0284c7" />
              <circle cx="31" cy="49" r="3.5" fill="#0284c7" />
              <circle cx="49" cy="49" r="3.5" fill="#0284c7" />
            </svg>
            <span className="text-xs font-mono text-slate-500">5 lados · 3 pts</span>
          </div>

          {/* Step 4: ? */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-sky-600 bg-white flex items-center justify-center">
              <span className="text-2xl font-mono font-semibold text-sky-700">
                ?
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">Paso 4</span>
          </div>
        </div>
      </div>
    );
  }

  // cube-slice
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex justify-center">
      <svg
        viewBox="0 0 180 150"
        className="w-48 h-40"
        aria-label="Cubo dividido en 3 por 3 por 3"
      >
        {/* Top face */}
        <polygon
          points="90,14 156,42 90,70 24,42"
          fill="#bae6fd"
          stroke="#0369a1"
          strokeWidth="2"
        />
        {/* Left face */}
        <polygon
          points="24,42 90,70 90,136 24,108"
          fill="#38bdf8"
          stroke="#0369a1"
          strokeWidth="2"
        />
        {/* Right face */}
        <polygon
          points="90,70 156,42 156,108 90,136"
          fill="#0284c7"
          stroke="#0369a1"
          strokeWidth="2"
        />
        {/* Grid lines top */}
        <line x1="46" y1="32.7" x2="112" y2="60.7" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="68" y1="23.3" x2="134" y2="51.3" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="46" y1="51.3" x2="112" y2="23.3" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="68" y1="60.7" x2="134" y2="32.7" stroke="#0369a1" strokeWidth="1.2" />
        {/* Grid lines left */}
        <line x1="46" y1="51.3" x2="46" y2="117.3" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="68" y1="60.7" x2="68" y2="126.7" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="24" y1="64" x2="90" y2="92" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="24" y1="86" x2="90" y2="114" stroke="#0369a1" strokeWidth="1.2" />
        {/* Grid lines right */}
        <line x1="112" y1="60.7" x2="112" y2="126.7" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="134" y1="51.3" x2="134" y2="117.3" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="90" y1="92" x2="156" y2="64" stroke="#0369a1" strokeWidth="1.2" />
        <line x1="90" y1="114" x2="156" y2="86" stroke="#0369a1" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
