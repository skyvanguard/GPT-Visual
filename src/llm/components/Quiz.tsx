'use client';

import React, { useState, useEffect } from 'react';
import s from './Quiz.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faLightbulb, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Phase } from '../walkthrough/Walkthrough';

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface PhaseQuiz {
    phase: Phase;
    title: string;
    questions: QuizQuestion[];
}

const quizzes: PhaseQuiz[] = [
    {
        phase: Phase.Input_Detail_LayerNorm,
        title: 'Layer Normalization',
        questions: [
            {
                question: '¿Cuál es el propósito principal de Layer Normalization?',
                options: [
                    'Reducir el tamaño del modelo',
                    'Estabilizar el entrenamiento normalizando las activaciones',
                    'Aumentar la velocidad de inferencia',
                    'Comprimir los datos de entrada'
                ],
                correct: 1,
                explanation: 'LayerNorm normaliza las activaciones para tener media 0 y desviación estándar 1, lo que estabiliza el entrenamiento y permite usar tasas de aprendizaje más altas.'
            },
            {
                question: '¿Qué parámetros aprende LayerNorm?',
                options: [
                    'Solo la media (μ)',
                    'Solo la desviación estándar (σ)',
                    'Escala (γ) y sesgo (β)',
                    'No tiene parámetros aprendibles'
                ],
                correct: 2,
                explanation: 'LayerNorm aprende γ (gamma) para escalar y β (beta) para desplazar los valores normalizados, permitiendo que el modelo ajuste la distribución óptima.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Softmax,
        title: 'Softmax',
        questions: [
            {
                question: '¿Qué garantiza la función Softmax?',
                options: [
                    'Que todos los valores sean negativos',
                    'Que la suma de todas las probabilidades sea 1',
                    'Que el modelo sea más rápido',
                    'Que no haya errores numéricos'
                ],
                correct: 1,
                explanation: 'Softmax convierte un vector de números (logits) en una distribución de probabilidades donde todos los valores están entre 0 y 1, y suman exactamente 1.'
            },
            {
                question: '¿Por qué se resta el máximo antes de aplicar exponencial en Softmax?',
                options: [
                    'Para hacer el cálculo más lento',
                    'Por estabilidad numérica, evitando overflow',
                    'Para cambiar el resultado final',
                    'No es necesario restar el máximo'
                ],
                correct: 1,
                explanation: 'Restar el máximo previene overflow numérico cuando se calculan exponenciales de números grandes, sin cambiar el resultado final de Softmax.'
            },
            {
                question: '¿Qué efecto tiene aumentar la temperatura en Softmax?',
                options: [
                    'Hace la distribución más puntiaguda (más determinística)',
                    'Hace la distribución más uniforme (más aleatoria)',
                    'No tiene ningún efecto',
                    'Reduce el número de opciones'
                ],
                correct: 1,
                explanation: 'Una temperatura alta suaviza la distribución, haciendo que todas las opciones tengan probabilidades más similares. Temperatura baja concentra la probabilidad en la opción más probable.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Projection,
        title: 'Proyección y Residuales',
        questions: [
            {
                question: '¿Qué es una conexión residual (skip connection)?',
                options: [
                    'Una conexión que salta capas del modelo',
                    'Sumar la entrada de una capa a su salida',
                    'Una forma de reducir parámetros',
                    'Un tipo de función de activación'
                ],
                correct: 1,
                explanation: 'Las conexiones residuales suman la entrada original a la salida transformada (x + f(x)), permitiendo que los gradientes fluyan directamente y facilitando el entrenamiento de redes profundas.'
            },
            {
                question: '¿Por qué son importantes las conexiones residuales?',
                options: [
                    'Hacen el modelo más pequeño',
                    'Previenen el vanishing gradient y permiten redes más profundas',
                    'Aceleran la inferencia',
                    'Reducen el uso de memoria'
                ],
                correct: 1,
                explanation: 'Las conexiones residuales permiten que los gradientes fluyan sin degradarse, resolviendo el problema del vanishing gradient y permitiendo entrenar modelos con muchas capas.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Transformer,
        title: 'Arquitectura Transformer',
        questions: [
            {
                question: '¿Cuántos bloques transformer tiene nuestro modelo nano-GPT?',
                options: [
                    '1 bloque',
                    '3 bloques',
                    '12 bloques',
                    '96 bloques'
                ],
                correct: 1,
                explanation: 'Nano-GPT tiene 3 bloques transformer apilados. GPT-2 small tiene 12, GPT-3 tiene 96. Más bloques = más capacidad pero más cómputo.'
            },
            {
                question: '¿Qué aprenden las diferentes capas de un Transformer?',
                options: [
                    'Todas aprenden lo mismo',
                    'Capas tempranas: patrones simples. Capas profundas: abstracciones',
                    'Solo la última capa aprende',
                    'Solo la primera capa aprende'
                ],
                correct: 1,
                explanation: 'Las capas tempranas capturan patrones locales y sintácticos simples, mientras que las capas más profundas capturan semántica y relaciones abstractas.'
            },
            {
                question: '¿Cuál es el orden de operaciones en un bloque Transformer?',
                options: [
                    'MLP → Attention → LayerNorm',
                    'LayerNorm → Attention → LayerNorm → MLP',
                    'Attention → MLP → LayerNorm',
                    'LayerNorm → MLP → Attention'
                ],
                correct: 1,
                explanation: 'El orden es: LayerNorm → Self-Attention → Residual → LayerNorm → MLP → Residual. Este patrón "pre-norm" es común en transformers modernos.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Output,
        title: 'Capa de Salida',
        questions: [
            {
                question: '¿Qué son los "logits" en la salida del modelo?',
                options: [
                    'Probabilidades finales',
                    'Puntuaciones sin normalizar antes de softmax',
                    'Los tokens de entrada',
                    'Los pesos del modelo'
                ],
                correct: 1,
                explanation: 'Los logits son las puntuaciones "crudas" que produce la capa lineal final. Se convierten en probabilidades al aplicar softmax.'
            },
            {
                question: '¿Cómo se selecciona el siguiente token en generación?',
                options: [
                    'Siempre el token con mayor probabilidad',
                    'Aleatoriamente sin considerar probabilidades',
                    'Muestreo de la distribución de probabilidades',
                    'El primer token del vocabulario'
                ],
                correct: 2,
                explanation: 'Se puede usar greedy (siempre el máximo) o sampling (muestrear según probabilidades). Sampling con temperatura permite controlar la creatividad.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Embedding,
        title: 'Embedding',
        questions: [
            {
                question: '¿Qué hace la capa de embedding?',
                options: [
                    'Comprime las imágenes',
                    'Convierte tokens en vectores numéricos',
                    'Genera texto aleatorio',
                    'Ordena las palabras'
                ],
                correct: 1,
                explanation: 'El embedding convierte cada token (palabra o subpalabra) en un vector denso de números que captura su significado semántico.'
            },
            {
                question: '¿Por qué se suma el embedding posicional?',
                options: [
                    'Para hacer el modelo más rápido',
                    'Para indicar la posición de cada token en la secuencia',
                    'Para reducir memoria',
                    'Para colorear los tokens'
                ],
                correct: 1,
                explanation: 'El embedding posicional le dice al modelo dónde está cada token en la secuencia, ya que los transformers no tienen noción inherente de orden.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_SelfAttention,
        title: 'Auto-Atención',
        questions: [
            {
                question: '¿Qué representan Q, K y V en la auto-atención?',
                options: [
                    'Calidad, Kernel, Valor',
                    'Query (consulta), Key (clave), Value (valor)',
                    'Quantum, Kinetic, Vector',
                    'Quick, Keep, Verify'
                ],
                correct: 1,
                explanation: 'Q (Query) es lo que buscamos, K (Key) es con qué comparamos, y V (Value) es la información que extraemos.'
            },
            {
                question: '¿Por qué se usa atención "causal"?',
                options: [
                    'Para generar imágenes',
                    'Para que los tokens solo vean el pasado, no el futuro',
                    'Para acelerar el entrenamiento',
                    'Para reducir el tamaño del modelo'
                ],
                correct: 1,
                explanation: 'La atención causal evita que el modelo "haga trampa" viendo tokens futuros durante la generación de texto.'
            }
        ]
    },
    {
        phase: Phase.Input_Detail_Mlp,
        title: 'MLP',
        questions: [
            {
                question: '¿Qué hace la capa MLP en un transformer?',
                options: [
                    'Mezcla información entre tokens',
                    'Procesa cada token individualmente, expandiendo y contrayendo',
                    'Genera la salida final',
                    'Calcula la pérdida'
                ],
                correct: 1,
                explanation: 'El MLP procesa cada token por separado, expandiendo la dimensionalidad (4x) y luego contrayéndola, permitiendo transformaciones no lineales.'
            },
            {
                question: '¿Qué función de activación se usa típicamente en el MLP?',
                options: [
                    'Sigmoid',
                    'Tanh',
                    'GELU o ReLU',
                    'Softmax'
                ],
                correct: 2,
                explanation: 'GELU (Gaussian Error Linear Unit) o ReLU son las funciones de activación más comunes en transformers modernos.'
            }
        ]
    },
    {
        phase: Phase.Training_Overview,
        title: 'Entrenamiento',
        questions: [
            {
                question: '¿Qué es el backpropagation?',
                options: [
                    'Un tipo de red neuronal',
                    'El proceso de propagar gradientes hacia atrás para actualizar pesos',
                    'Un método de compresión',
                    'Una técnica de visualización'
                ],
                correct: 1,
                explanation: 'Backpropagation calcula cómo cada peso contribuyó al error, propagando gradientes desde la salida hacia la entrada.'
            },
            {
                question: '¿Qué mide la función de pérdida (loss)?',
                options: [
                    'La velocidad del modelo',
                    'El tamaño del modelo',
                    'Qué tan equivocada está la predicción vs la respuesta correcta',
                    'El número de parámetros'
                ],
                correct: 2,
                explanation: 'La pérdida cuantifica la diferencia entre la predicción del modelo y la respuesta correcta. El objetivo es minimizarla.'
            }
        ]
    }
];

interface QuizProps {
    phase: Phase;
    onClose: () => void;
}

export function Quiz({ phase, onClose }: QuizProps) {
    const quiz = quizzes.find(q => q.phase === phase);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    if (!quiz) return null;

    const question = quiz.questions[currentQ];
    const isCorrect = selected === question.correct;

    const handleSelect = (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
        if (idx === question.correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQ < quiz.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setSelected(null);
            setShowResult(false);
        } else {
            setCompleted(true);
            // Save to localStorage
            const key = `quiz-${phase}`;
            const best = localStorage.getItem(key);
            const currentScore = score + (isCorrect ? 1 : 0);
            if (!best || parseInt(best) < currentScore) {
                localStorage.setItem(key, currentScore.toString());
            }
        }
    };

    if (completed) {
        const finalScore = score;
        const total = quiz.questions.length;
        const percentage = Math.round((finalScore / total) * 100);

        return (
            <div className={s.overlay} onClick={onClose}>
                <div className={s.quizPanel} onClick={e => e.stopPropagation()}>
                    <button className={s.closeBtn} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className={s.completed}>
                        <div className={s.scoreCircle} style={{ '--percentage': `${percentage}%` } as any}>
                            <span>{finalScore}/{total}</span>
                        </div>
                        <h3>¡Quiz completado!</h3>
                        <p>
                            {percentage >= 80 ? '¡Excelente! Dominas este tema.' :
                             percentage >= 60 ? '¡Bien hecho! Sigue practicando.' :
                             'Revisa el material e intenta de nuevo.'}
                        </p>
                        <button className={s.retryBtn} onClick={() => {
                            setCurrentQ(0);
                            setSelected(null);
                            setShowResult(false);
                            setScore(0);
                            setCompleted(false);
                        }}>
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={s.quizPanel} onClick={e => e.stopPropagation()}>
                <button className={s.closeBtn} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className={s.header}>
                    <span className={s.badge}>Quiz: {quiz.title}</span>
                    <span className={s.progress}>{currentQ + 1} / {quiz.questions.length}</span>
                </div>

                <h3 className={s.question}>{question.question}</h3>

                <div className={s.options}>
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={`${s.option} ${selected === idx ? s.selected : ''} ${showResult && idx === question.correct ? s.correct : ''} ${showResult && selected === idx && !isCorrect ? s.wrong : ''}`}
                            onClick={() => handleSelect(idx)}
                            disabled={showResult}
                        >
                            <span className={s.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                            <span>{opt}</span>
                            {showResult && idx === question.correct && (
                                <FontAwesomeIcon icon={faCheckCircle} className={s.iconCorrect} />
                            )}
                            {showResult && selected === idx && !isCorrect && (
                                <FontAwesomeIcon icon={faTimesCircle} className={s.iconWrong} />
                            )}
                        </button>
                    ))}
                </div>

                {showResult && (
                    <div className={`${s.explanation} ${isCorrect ? s.correct : s.wrong}`}>
                        <FontAwesomeIcon icon={faLightbulb} />
                        <p>{question.explanation}</p>
                    </div>
                )}

                {showResult && (
                    <button className={s.nextBtn} onClick={handleNext}>
                        {currentQ < quiz.questions.length - 1 ? 'Siguiente' : 'Ver resultado'}
                    </button>
                )}
            </div>
        </div>
    );
}

export function QuizButton({ phase }: { phase: Phase }) {
    const [showQuiz, setShowQuiz] = useState(false);
    const hasQuiz = quizzes.some(q => q.phase === phase);

    if (!hasQuiz) return null;

    return (
        <>
            <button className={s.quizButton} onClick={() => setShowQuiz(true)}>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Quiz</span>
            </button>
            {showQuiz && <Quiz phase={phase} onClose={() => setShowQuiz(false)} />}
        </>
    );
}
