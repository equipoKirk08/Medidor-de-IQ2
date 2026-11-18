import {
  CategoryScore,
  QuestionCategory,
  QuestionReview,
  QuizQuestion,
  QuizResult,
  UserAnswers,
} from '../types/quiz';

const CATEGORIES: QuestionCategory[] = [
  'Lógica Numérica',
  'Reconocimiento de Patrones',
  'Deducción Verbal',
  'Razonamiento Espacial',
];

function computePercentile(iq: number): number {
  // Approximate normal distribution CDF with mean=100, sd=15
  const z = (iq - 100) / 15;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z > 0 ? 1 - prob : prob;
  return Math.max(1, Math.min(99, Math.round(cdf * 100)));
}

function getTierProfile(
  percentage: number,
  estimatedIQ: number,
  strongest: QuestionCategory,
  weakest: QuestionCategory,
  allEqual: boolean
): {
  classification: string;
  personalizedMessage: string;
  recommendation: string;
} {
  if (percentage >= 90) {
    return {
      classification: 'Sobresaliente',
      personalizedMessage: allEqual
        ? `Desempeño excepcional con un CI estimado de ${estimatedIQ}. Resolviste prácticamente toda la evaluación con precisión consistente en todas las áreas cognitivas.`
        : `Desempeño excepcional con un CI estimado de ${estimatedIQ}. Tu capacidad analítica destacó especialmente en ${strongest}, manteniendo una precisión de nivel superior en problemas complejos.`,
      recommendation:
        'Para seguir desafiando tu agilidad mental, explora acertijos de lógica formal multidimensional y secuencias matemáticas no lineales.',
    };
  }

  if (percentage >= 70) {
    return {
      classification: 'Superior al Promedio',
      personalizedMessage: allEqual
        ? `Muy buen resultado con un CI estimado de ${estimatedIQ}. Mostraste un razonamiento sólido y equilibrado a lo largo de toda la evaluación.`
        : `Muy buen resultado con un CI estimado de ${estimatedIQ}. Demostraste gran soltura en ${strongest}, mientras que ${weakest} representa la principal oportunidad para alcanzar el máximo nivel.`,
      recommendation: `Refinar tu velocidad de verificación en ejercicios de ${weakest} te permitirá consolidar un rendimiento sobresaliente.`,
    };
  }

  if (percentage >= 50) {
    return {
      classification: 'Promedio Alto',
      personalizedMessage: allEqual
        ? `Buen desempeño general con un CI estimado de ${estimatedIQ}. Tienes una base lógica estable para abordar patrones y deducciones cotidianas.`
        : `Buen desempeño general con un CI estimado de ${estimatedIQ}. Tu punto más firme fue ${strongest}; prestar atención adicional a los detalles en ${weakest} elevará notablemente tu puntuación.`,
      recommendation: `Dedica unos minutos a revisar las explicaciones de ${weakest} y vuelve a intentar la prueba aplicando descomposición paso a paso.`,
    };
  }

  if (percentage >= 30) {
    return {
      classification: 'En Consolidación',
      personalizedMessage: allEqual
        ? `Obtuviste un CI estimado de ${estimatedIQ}. Lograste resolver correctamente varios reactivos base, aunque algunos patrones más abstractos requirieron mayor análisis.`
        : `Obtuviste un CI estimado de ${estimatedIQ}. Tu mejor desempeño apareció en ${strongest}, mientras que los ejercicios de ${weakest} concentraron la mayor dificultad.`,
      recommendation:
        'Revisa el desglose pregunta por pregunta abajo para identificar la regla detrás de cada secuencia antes de repetir la evaluación.',
    };
  }

  return {
    classification: 'Inicio de Entrenamiento',
    personalizedMessage: `Completaste la evaluación con un CI estimado de ${estimatedIQ}. Este resultado sirve como línea base inicial para entrenar tu reconocimiento de reglas lógicas y espaciales.`,
    recommendation:
      'Tómate un momento para leer la explicación de cada pregunta en el resumen inferior; comprender la mecánica de cada categoría suele duplicar el puntaje en el segundo intento.',
  };
}

export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: UserAnswers,
  elapsedSeconds: number
): QuizResult {
  const totalQuestions = questions.length;
  let correctCount = 0;
  let answeredCount = 0;
  let earnedWeight = 0;
  let totalWeight = 0;

  const categoryAccumulator: Record<
    QuestionCategory,
    { correct: number; total: number }
  > = {
    'Lógica Numérica': { correct: 0, total: 0 },
    'Reconocimiento de Patrones': { correct: 0, total: 0 },
    'Deducción Verbal': { correct: 0, total: 0 },
    'Razonamiento Espacial': { correct: 0, total: 0 },
  };

  const questionReviews: QuestionReview[] = questions.map((question) => {
    const selectedIndex =
      typeof answers[question.id] === 'number' ? answers[question.id] : null;
    if (selectedIndex !== null) {
      answeredCount += 1;
    }

    const isCorrect = selectedIndex === question.correctIndex;
    totalWeight += question.weight;
    categoryAccumulator[question.category].total += 1;

    if (isCorrect) {
      correctCount += 1;
      earnedWeight += question.weight;
      categoryAccumulator[question.category].correct += 1;
    }

    return {
      questionId: question.id,
      prompt: question.prompt,
      category: question.category,
      selectedIndex,
      correctIndex: question.correctIndex,
      selectedText:
        selectedIndex !== null ? question.options[selectedIndex] : null,
      correctText: question.options[question.correctIndex],
      isCorrect,
      explanation: question.explanation,
    };
  });

  const rawPercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const weightedPercentage =
    totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Map weighted accuracy (0..100%) onto standard IQ range (72..142)
  const estimatedIQ = Math.round(72 + (weightedPercentage / 100) * 70);
  const percentile = computePercentile(estimatedIQ);

  const categoryBreakdown: CategoryScore[] = CATEGORIES.map((category) => {
    const stats = categoryAccumulator[category];
    const percentage =
      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return {
      category,
      correct: stats.correct,
      total: stats.total,
      percentage,
    };
  });

  const sortedCategories = [...categoryBreakdown].sort(
    (a, b) => b.percentage - a.percentage
  );
  const strongestCategory = sortedCategories[0].category;
  const weakestCategory =
    sortedCategories[sortedCategories.length - 1].category;
  const allEqual =
    sortedCategories[0].percentage ===
    sortedCategories[sortedCategories.length - 1].percentage;

  const { classification, personalizedMessage, recommendation } =
    getTierProfile(
      rawPercentage,
      estimatedIQ,
      strongestCategory,
      weakestCategory,
      allEqual
    );

  return {
    correctCount,
    totalQuestions,
    answeredCount,
    rawPercentage,
    weightedPercentage,
    estimatedIQ,
    percentile,
    classification,
    personalizedMessage,
    recommendation,
    strongestCategory,
    weakestCategory,
    categoryBreakdown,
    questionReviews,
    elapsedSeconds,
  };
}
