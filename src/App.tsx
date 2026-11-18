import { useEffect, useState } from 'react';
import { QUIZ_QUESTIONS } from './data/questions';
import { UserAnswers, QuizResult } from './types/quiz';
import { calculateQuizResult } from './utils/calculateResult';
import { QuestionVisual } from './components/QuestionVisual';
import { ResultSummary } from './components/ResultSummary';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  RotateCcwIcon,
} from './components/Icons';

type AppStage = 'intro' | 'quiz' | 'summary';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function App() {
  const [stage, setStage] = useState<AppStage>('intro');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (stage !== 'quiz') return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;
  const currentAnswer = answers[currentQuestion.id];

  function startQuiz() {
    setAnswers({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setResult(null);
    setStage('quiz');
  }

  function selectOption(optionIndex: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  }

  function goPrevious() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function goNext() {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function finishQuiz() {
    const calculated = calculateQuizResult(
      QUIZ_QUESTIONS,
      answers,
      elapsedSeconds
    );
    setResult(calculated);
    setStage('summary');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setStage('intro')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 rounded"
          >
            Medidor-de-IQ2
          </button>

          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#evaluacion"
              onClick={(e) => {
                if (stage !== 'intro') {
                  e.preventDefault();
                  setStage('intro');
                }
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Evaluación
            </a>
            <a
              href="#areas"
              onClick={(e) => {
                if (stage !== 'intro') {
                  e.preventDefault();
                  setStage('intro');
                }
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Áreas
            </a>
            <a
              href="#escala"
              onClick={(e) => {
                if (stage !== 'intro') {
                  e.preventDefault();
                  setStage('intro');
                }
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Escala
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            {stage === 'intro' ? (
              <button
                type="button"
                onClick={startQuiz}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap shrink-0"
              >
                Comenzar test
              </button>
            ) : (
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcwIcon className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 sm:py-12">
        {stage === 'intro' && (
          <div className="space-y-12" id="evaluacion">
            {/* Hero Intro Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>Evaluación cognitiva</span>
                    <span aria-hidden="true">·</span>
                    <span>10 reactivos</span>
                    <span aria-hidden="true">·</span>
                    <span>4 áreas de razonamiento</span>
                  </div>

                  <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                    Mide tu razonamiento lógico, numérico y espacial
                  </h1>

                  <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-prose">
                    Completa las 10 preguntas de dificultad progresiva. Al finalizar,
                    el sistema calcula tu puntuación total, estima tu cociente
                    intelectual en escala estándar y genera un diagnóstico
                    personalizado según tus fortalezas cognitivas.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap"
                  >
                    <span>Comenzar evaluación</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500">
                    Duración sugerida: 4 a 6 minutos
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Metodología de cálculo
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Cada respuesta correcta suma puntos ponderados según la
                    complejidad del reactivo (Base, Intermedio o Avanzado).
                  </p>
                </div>

                <dl className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Escala estimada</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      72 – 142 CI
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Media poblacional</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      100 (DE 15)
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Desglose incluido</dt>
                    <dd className="font-medium text-slate-900">
                      Por área y reactivo
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Cognitive Domains */}
            <section id="areas" className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Áreas evaluadas en el cuestionario
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-mono text-sky-700">01</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Lógica Numérica
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Sucesiones progresivas, razones aritméticas y reglas entre
                    tríos numéricos.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-mono text-sky-700">02</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Reconocimiento de Patrones
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Rotaciones geométricas secuenciales y progresiones visuales
                    de polígonos.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-mono text-sky-700">03</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Deducción Verbal
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Silogismos categóricos, analogías semánticas y ordenamiento
                    de condiciones.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-mono text-sky-700">04</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Razonamiento Espacial
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Matrices lógicas 3×3 y visualización tridimensional de
                    volúmenes seccionados.
                  </p>
                </div>
              </div>
            </section>

            {/* Score Classification Reference */}
            <section
              id="escala"
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                Niveles de diagnóstico personalizado
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Al completar todas las preguntas, el resumen final clasifica tu
                resultado y destaca tu dominio más sólido.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                {[
                  { range: '90% – 100%', label: 'Sobresaliente' },
                  { range: '70% – 89%', label: 'Superior al Promedio' },
                  { range: '50% – 69%', label: 'Promedio Alto' },
                  { range: '30% – 49%', label: 'En Consolidación' },
                  { range: '0% – 29%', label: 'Inicio de Entrenamiento' },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-mono text-xs text-slate-500 tabular-nums">
                      {tier.range}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {tier.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {stage === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress & Timer Strip */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    Pregunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentQuestion.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Dificultad {currentQuestion.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 font-mono tabular-nums text-slate-600">
                  <span>
                    Respondidas: {answeredCount}/{QUIZ_QUESTIONS.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatTimer(elapsedSeconds)}</span>
                </div>
              </div>

              <div
                className="h-2 w-full rounded-full bg-slate-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={QUIZ_QUESTIONS.length}
              >
                <div
                  className="h-full bg-sky-600 transition-all duration-200"
                  style={{
                    width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Question Card */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
              <h1 className="text-xl sm:text-2xl font-semibold leading-snug text-slate-900">
                {currentQuestion.prompt}
              </h1>

              {currentQuestion.visual && (
                <QuestionVisual visual={currentQuestion.visual} />
              )}

              <div
                className="space-y-3"
                role="radiogroup"
                aria-label={`Opciones para la pregunta ${currentIndex + 1}`}
              >
                {currentQuestion.options.map((optionText, idx) => {
                  const isSelected = currentAnswer === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => selectOption(idx)}
                      className={`w-full text-left flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${
                            isSelected
                              ? 'bg-sky-700 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {OPTION_LETTERS[idx]}
                        </span>
                        <span className="text-sm sm:text-base font-medium">
                          {optionText}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckIcon className="w-5 h-5 text-sky-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer Navigation Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const isAnswered = typeof answers[q.id] === 'number';
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Ir a pregunta ${idx + 1}`}
                        className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors ${
                          isCurrent
                            ? 'bg-slate-900 text-white'
                            : isAnswered
                              ? 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={typeof currentAnswer !== 'number'}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap"
                  >
                    <span>Siguiente</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishQuiz}
                    disabled={!allAnswered}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-colors whitespace-nowrap"
                  >
                    <span>Calcular resultado</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {currentIndex === QUIZ_QUESTIONS.length - 1 && !allAnswered && (
                <p className="text-xs text-amber-700 text-right">
                  Responde las {QUIZ_QUESTIONS.length - answeredCount}{' '}
                  {QUIZ_QUESTIONS.length - answeredCount === 1
                    ? 'pregunta pendiente'
                    : 'preguntas pendientes'}{' '}
                  para ver tu resumen final.
                </p>
              )}
            </section>
          </div>
        )}

        {stage === 'summary' && result && (
          <ResultSummary result={result} onRetake={startQuiz} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Medidor-de-IQ2</span>
          <span>Evaluación interactiva de razonamiento cognitivo</span>
        </div>
      </footer>
    </div>
  );
}
