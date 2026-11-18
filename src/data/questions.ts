import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Lógica Numérica',
    difficulty: 'Base',
    weight: 1,
    prompt: '¿Qué número continúa lógicamente la siguiente sucesión? 2, 6, 12, 20, 30, ...',
    options: ['38', '40', '42', '44'],
    correctIndex: 2,
    explanation:
      'La diferencia entre términos consecutivos aumenta de 2 en 2 (+4, +6, +8, +10). El siguiente incremento es +12, por lo que 30 + 12 = 42.',
  },
  {
    id: 'q2',
    category: 'Reconocimiento de Patrones',
    difficulty: 'Base',
    weight: 1,
    prompt:
      'Observa la posición del sector sombreado en los tres primeros diagramas. ¿Qué cuadrante ocupará en el cuarto paso?',
    visual: 'rotation-sequence',
    options: [
      'Superior izquierdo',
      'Superior derecho',
      'Inferior derecho',
      'Inferior izquierdo',
    ],
    correctIndex: 3,
    explanation:
      'El cuadrante sombreado rota 90° en sentido horario en cada paso: superior izquierdo → superior derecho → inferior derecho → inferior izquierdo.',
  },
  {
    id: 'q3',
    category: 'Deducción Verbal',
    difficulty: 'Base',
    weight: 1,
    prompt:
      'Si ningún reptil tiene plumas y todas las iguanas son reptiles, ¿qué afirmación es necesariamente verdadera?',
    options: [
      'Algunas iguanas podrían tener plumas.',
      'Ninguna iguana tiene plumas.',
      'Todos los animales sin plumas son iguanas.',
      'Algunos reptiles tienen plumas.',
    ],
    correctIndex: 1,
    explanation:
      'Si el conjunto de las iguanas está completamente incluido dentro de los reptiles, y ningún reptil posee plumas, entonces ninguna iguana puede tenerlas.',
  },
  {
    id: 'q4',
    category: 'Lógica Numérica',
    difficulty: 'Intermedio',
    weight: 1.2,
    prompt: 'Identifica el valor que falta en la serie: 3, 5, 9, 17, 33, ...',
    options: ['57', '63', '65', '67'],
    correctIndex: 2,
    explanation:
      'Cada diferencia se duplica respecto a la anterior (+2, +4, +8, +16). Al sumar +32 a 33 se obtiene 65 (equivalente a 2n - 1).',
  },
  {
    id: 'q5',
    category: 'Razonamiento Espacial',
    difficulty: 'Avanzado',
    weight: 1.4,
    prompt:
      'En esta matriz de 3×3, cada fila y cada columna contiene las tres figuras y los tres estilos de relleno exactamente una vez. ¿Qué figura completa la celda inferior derecha?',
    visual: 'shape-matrix',
    options: [
      'Triángulo sólido',
      'Triángulo con contorno',
      'Círculo sólido',
      'Cuadrado rayado',
    ],
    correctIndex: 0,
    explanation:
      'En la tercera fila ya aparecen el cuadrado (contorno) y el círculo (rayado). Falta la figura triángulo y el relleno sólido, lo que también cierra la tercera columna.',
  },
  {
    id: 'q6',
    category: 'Deducción Verbal',
    difficulty: 'Base',
    weight: 1,
    prompt: 'TERMÓMETRO es a TEMPERATURA como ANEMÓMETRO es a:',
    options: [
      'Presión atmosférica',
      'Velocidad del viento',
      'Humedad relativa',
      'Altitud geográfica',
    ],
    correctIndex: 1,
    explanation:
      'La relación es instrumento de medición a magnitud física medida: el termómetro mide temperatura y el anemómetro mide la velocidad del viento.',
  },
  {
    id: 'q7',
    category: 'Lógica Numérica',
    difficulty: 'Intermedio',
    weight: 1.2,
    prompt:
      'Las dos primeras parejas numéricas siguen la misma regla matemática para generar el resultado inferior. ¿Qué número completa la tercera pareja?',
    visual: 'number-triads',
    options: ['24', '26', '28', '32'],
    correctIndex: 2,
    explanation:
      'La regla consiste en sumar los dos números superiores y multiplicar el total por 2: (3+5)×2 = 16, (7+2)×2 = 18, por lo tanto (6+8)×2 = 28.',
  },
  {
    id: 'q8',
    category: 'Reconocimiento de Patrones',
    difficulty: 'Intermedio',
    weight: 1.2,
    prompt:
      'Analiza la progresión de polígonos y puntos interiores. ¿Qué figura corresponde al cuarto término?',
    visual: 'polygon-progression',
    options: [
      'Hexágono con 4 puntos',
      'Hexágono con 5 puntos',
      'Pentágono con 4 puntos',
      'Heptágono con 4 puntos',
    ],
    correctIndex: 0,
    explanation:
      'Cada paso agrega 1 lado al polígono (3 → 4 → 5 → 6 lados) y 1 punto en el interior (1 → 2 → 3 → 4 puntos): hexágono con 4 puntos.',
  },
  {
    id: 'q9',
    category: 'Deducción Verbal',
    difficulty: 'Avanzado',
    weight: 1.4,
    prompt:
      'En una prueba de cinco participantes: Ana llegó después de Elena, pero antes que Bruno. Diego llegó después de Bruno. Carla llegó inmediatamente antes que Elena. ¿Quién ocupó el tercer lugar?',
    options: ['Carla', 'Elena', 'Ana', 'Bruno'],
    correctIndex: 2,
    explanation:
      'El orden estricto de llegada es: 1° Carla, 2° Elena, 3° Ana, 4° Bruno y 5° Diego. Por lo tanto, Ana ocupó el tercer lugar.',
  },
  {
    id: 'q10',
    category: 'Razonamiento Espacial',
    difficulty: 'Avanzado',
    weight: 1.4,
    prompt:
      'Un cubo sólido pintado de azul en todas sus caras se corta en 27 cubos pequeños iguales (3 × 3 × 3). ¿Cuántos cubos pequeños quedan con exactamente dos caras pintadas?',
    visual: 'cube-slice',
    options: ['6', '8', '12', '16'],
    correctIndex: 2,
    explanation:
      'En un cubo de 3×3×3, las esquinas (8) tienen 3 caras pintadas, los centros de cada cara (6) tienen 1 cara, el centro interno (1) tiene 0, y los centros de las 12 aristas tienen exactamente 2 caras pintadas.',
  },
];
