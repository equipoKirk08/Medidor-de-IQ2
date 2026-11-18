import { useState } from 'react';
import { QuizResult } from '../types/quiz';
import { CheckIcon, RotateCcwIcon, XIcon } from './Icons';

interface ResultSummaryProps {
  result: QuizResult;
  onRetake: () => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function BellCurveChart({ estimatedIQ }: { estimatedIQ: number }) {
  // Normal distribution curve centered at x=200 (IQ 100), sd=52px (15 IQ points)
  const clampedIQ = Math.max(55, Math.min(145, estimatedIQ));
  const markerX = 200 + ((clampedIQ - 100) / 15) * 52;
  const z = (clampedIQ - 100) / 15;
  const markerY = 112 - 88 * Math.exp(-0.5 * z * z);

  // Build smooth SVG path across IQ 55..145
  const points: string[] = [];
  for (let iq = 55; iq <= 145; iq += 2) {
    const x = 200 + ((iq - 100) / 15) * 52;
    const zVal = (iq - 100) / 15;
    const y = 112 - 88 * Math.exp(-0.5 * zVal * zVal);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const curvePath = `M ${points.join(' L ')}`;
  const areaPath = `M 44,112 L ${points.join(' L ')} L 356,112 Z`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Posición en la curva de distribución
        </h3>
        <span className="text-xs font-mono text-slate-500 tabular-nums">
          Media 100 · DE 15
        </span>
      </div>
      <svg
        viewBox="0 0 400 144"
        className="w-full h-auto"
        role="img"
        aria-label={`Distribución normal con marcador en CI estimado ${estimatedIQ}`}
      >
        <defs>
          <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Reference vertical lines for -2SD, -1SD, Mean, +1SD, +2SD */}
        {[70, 85, 100, 115, 130].map((tick) => {
          const x = 200 + ((tick - 100) / 15) * 52;
          return (
            <g key={tick}>
              <line
                x1={x}
                y1="20"
                x2={x}
                y2="112"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={tick === 100 ? undefined : '3 3'}
              />
              <text
                x={x}
                y="130"
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1="36" y1="112" x2="364" y2="112" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Curve area and stroke */}
        <path d={areaPath} fill="url(#bellFill)" />
        <path d={curvePath} fill="none" stroke="#0284c7" strokeWidth="2.5" />

        {/* User marker */}
        <line
          x1={markerX}
          y1={markerY}
          x2={markerX}
          y2="112"
          stroke="#0f172a"
          strokeWidth="1.75"
        />
        <circle
          cx={markerX}
          cy={markerY}
          r="5"
          fill="#0284c7"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={markerX}
          y={Math.max(14, markerY - 10)}
          textAnchor="middle"
          className="text-[11px] font-mono font-semibold fill-slate-900"
        >
          CI {estimatedIQ}
        </text>
      </svg>
    </div>
  );
}

export function ResultSummary({ result, onRetake }: ResultSummaryProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const filteredReviews = result.questionReviews.filter((item) => {
    if (filter === 'correct') return item.isCorrect;
    if (filter === 'incorrect') return !item.isCorrect;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Primary Score & Personalized Message Section */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>Resumen de evaluación</span>
              <span aria-hidden="true">·</span>
              <span>Nivel {result.classification}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Duración {formatDuration(result.elapsedSeconds)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              {result.classification}
            </h1>

            <p className="text-base leading-relaxed text-slate-700">
              {result.personalizedMessage}
            </p>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">
                  Recomendación:{' '}
                </span>
                {result.recommendation}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-slate-50 p-6 min-w-[240px]">
            <div>
              <p className="text-xs font-medium text-slate-500">
                CI Estimado
              </p>
              <p className="mt-1 text-5xl font-bold font-mono tracking-tight text-sky-700 tabular-nums">
                {result.estimatedIQ}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Aciertos</p>
                <p className="mt-0.5 text-lg font-semibold font-mono text-slate-900 tabular-nums">
                  {result.correctCount}/{result.totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Precisión</p>
                <p className="mt-0.5 text-lg font-semibold font-mono text-slate-900 tabular-nums">
                  {result.rawPercentage}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Percentil</p>
                <p className="mt-0.5 text-lg font-semibold font-mono text-slate-900 tabular-nums">
                  {result.percentile}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRetake}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap"
            >
              <RotateCcwIcon className="w-4 h-4" />
              <span>Repetir evaluación</span>
            </button>
          </div>
        </div>
      </section>

      {/* Two-Column Breakdown: Cognitive Areas & Normal Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-base font-semibold text-slate-900">
                Desempeño por área cognitiva
              </h2>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                Puntaje ponderado {result.weightedPercentage}%
              </span>
            </div>

            <div className="space-y-4">
              {result.categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-slate-600 tabular-nums">
                      {item.correct}/{item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-600 transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              Área más fuerte:{' '}
              <strong className="font-semibold text-slate-900">
                {result.strongestCategory}
              </strong>
            </span>
            <span>
              Área a reforzar:{' '}
              <strong className="font-semibold text-slate-900">
                {result.weakestCategory}
              </strong>
            </span>
          </div>
        </div>

        <BellCurveChart estimatedIQ={result.estimatedIQ} />
      </section>

      {/* Question-by-Question Review */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Revisión detallada de respuestas
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Consulta la regla lógica y la solución verificada de cada reactivo.
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
            role="tablist"
            aria-label="Filtrar respuestas"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({result.totalQuestions})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'correct'}
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === 'correct'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correctas ({result.correctCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'incorrect'}
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === 'incorrect'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incorrectas ({result.totalQuestions - result.correctCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredReviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No hay preguntas en esta categoría de filtro.
            </p>
          ) : (
            filteredReviews.map((review) => {
              const originalIndex =
                result.questionReviews.findIndex(
                  (r) => r.questionId === review.questionId
                ) + 1;
              return (
                <article key={review.questionId} className="py-5 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-700 tabular-nums">
                        Pregunta {originalIndex}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{review.category}</span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        review.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {review.isCorrect ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Correcta</span>
                        </>
                      ) : (
                        <>
                          <XIcon className="w-4 h-4" />
                          <span>Incorrecta</span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-900">
                    {review.prompt}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="text-slate-600">
                      <span className="font-medium text-slate-500">
                        Tu respuesta:{' '}
                      </span>
                      <span
                        className={
                          review.isCorrect
                            ? 'font-medium text-emerald-800'
                            : 'font-medium text-rose-800'
                        }
                      >
                        {review.selectedText ?? 'Sin responder'}
                      </span>
                    </div>
                    {!review.isCorrect && (
                      <div className="text-slate-600">
                        <span className="font-medium text-slate-500">
                          Respuesta correcta:{' '}
                        </span>
                        <span className="font-medium text-slate-900">
                          {review.correctText}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600">
                    {review.explanation}
                  </p>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
