'use client';

import React, { useState } from 'react';
import { ModalWindow } from '@/src/utils/Portal';
import s from './ExampleSelector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { KeyboardOrder, useGlobalKeyboard } from '@/src/utils/keyboard';

interface IExample {
    id: string;
    input: string;
    output: string;
    title: string;
    description: string;
    steps: string[];
    difficulty: 'fácil' | 'medio' | 'difícil';
}

const examples: IExample[] = [
    {
        id: 'default',
        input: 'CBABBC',
        output: 'ABBBCC',
        title: 'Ejemplo Principal',
        description: 'Este es el ejemplo que usa la visualización. El modelo ordena las letras alfabéticamente.',
        difficulty: 'medio',
        steps: [
            'El modelo recibe la secuencia "CBABBC" (tokens: 2,1,0,1,1,2)',
            'Cada token se convierte en un embedding de 48 dimensiones',
            'Los embeddings pasan por 3 capas transformer',
            'El modelo predice el siguiente token para cada posición',
            'La salida ordenada es "ABBBCC" (2 A\'s, 3 B\'s, 1 C)',
        ],
    },
    {
        id: 'all-same',
        input: 'AAAAAA',
        output: 'AAAAAA',
        title: 'Secuencia Uniforme',
        description: 'Cuando todas las letras son iguales, la salida es idéntica a la entrada.',
        difficulty: 'fácil',
        steps: [
            'Entrada: "AAAAAA" - todos tokens con índice 0',
            'El modelo ve 6 tokens idénticos',
            'La atención distribuye peso uniformemente (todos son iguales)',
            'No hay cambio necesario - ya está ordenado',
            'Salida: "AAAAAA" - ningún cambio',
        ],
    },
    {
        id: 'reverse',
        input: 'CCBBAA',
        output: 'AABBCC',
        title: 'Orden Inverso',
        description: 'El caso más difícil: la secuencia está completamente al revés.',
        difficulty: 'difícil',
        steps: [
            'Entrada: "CCBBAA" (tokens: 2,2,1,1,0,0)',
            'El modelo debe "aprender" que A < B < C',
            'La atención identifica las posiciones de cada tipo',
            'Los transformers reorganizan la información',
            'Salida: "AABBCC" - orden correcto',
        ],
    },
    {
        id: 'alternating',
        input: 'ABABAB',
        output: 'AAABBB',
        title: 'Patrón Alternante',
        description: 'Un patrón regular que el modelo debe reconocer y ordenar.',
        difficulty: 'medio',
        steps: [
            'Entrada: "ABABAB" (tokens: 0,1,0,1,0,1)',
            'Patrón regular pero no ordenado',
            'El modelo cuenta: 3 A\'s y 3 B\'s',
            'La atención agrupa tokens similares',
            'Salida: "AAABBB" - primero A\'s, luego B\'s',
        ],
    },
    {
        id: 'mixed',
        input: 'ABCABC',
        output: 'AABBCC',
        title: 'Triplicado Mezclado',
        description: 'Cada letra aparece exactamente dos veces, pero mezcladas.',
        difficulty: 'medio',
        steps: [
            'Entrada: "ABCABC" (tokens: 0,1,2,0,1,2)',
            'El modelo identifica el patrón repetido',
            'Cuenta: 2 de cada letra',
            'Ordena respetando la cantidad de cada una',
            'Salida: "AABBCC" - 2 A\'s, 2 B\'s, 2 C\'s',
        ],
    },
    {
        id: 'almost-sorted',
        input: 'AABBCB',
        output: 'AABBBC',
        title: 'Casi Ordenado',
        description: 'Solo una letra está fuera de lugar.',
        difficulty: 'fácil',
        steps: [
            'Entrada: "AABBCB" - solo la última B está mal',
            'El modelo detecta la anomalía',
            'Menor corrección necesaria',
            'Mueve la B antes de la C final',
            'Salida: "AABBBC" - corregido',
        ],
    },
];

export const ExampleSelector: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [selectedExample, setSelectedExample] = useState<IExample>(examples[0]);

    useGlobalKeyboard(KeyboardOrder.Modal, ev => {
        if (visible && ev.key === 'Escape') {
            setVisible(false);
            ev.stopPropagation();
        }
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'fácil': return '#22c55e';
            case 'medio': return '#eab308';
            case 'difícil': return '#ef4444';
            default: return '#888';
        }
    };

    return <>
        <button
            onClick={() => setVisible(true)}
            className={s.exampleBtn}
            aria-label="Ver ejemplos interactivos"
            title="Ejemplos"
        >
            <FontAwesomeIcon icon={faFlask} />
        </button>

        {visible && <ModalWindow
            className={s.modalWindow}
            backdropClassName={s.modalWindowBackdrop}
            onBackdropClick={() => setVisible(false)}
        >
            <div className={s.header}>
                <div className={s.title}>Ejemplos Interactivos</div>
                <button className={s.closeBtn} onClick={() => setVisible(false)}>×</button>
            </div>

            <div className={s.content}>
                <div className={s.exampleList}>
                    <div className={s.listHeader}>Selecciona un ejemplo:</div>
                    {examples.map((example) => (
                        <div
                            key={example.id}
                            className={`${s.exampleItem} ${selectedExample.id === example.id ? s.selected : ''}`}
                            onClick={() => setSelectedExample(example)}
                        >
                            <div className={s.examplePreview}>
                                <span className={s.inputPreview}>{example.input}</span>
                                <span className={s.arrow}>→</span>
                                <span className={s.outputPreview}>{example.output}</span>
                            </div>
                            <div className={s.exampleMeta}>
                                <span className={s.exampleTitle}>{example.title}</span>
                                <span
                                    className={s.difficulty}
                                    style={{ backgroundColor: getDifficultyColor(example.difficulty) }}
                                >
                                    {example.difficulty}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={s.exampleDetail}>
                    <div className={s.detailHeader}>
                        <h3 className={s.detailTitle}>{selectedExample.title}</h3>
                        <span
                            className={s.difficultyBadge}
                            style={{ backgroundColor: getDifficultyColor(selectedExample.difficulty) }}
                        >
                            {selectedExample.difficulty}
                        </span>
                    </div>

                    <div className={s.transformation}>
                        <div className={s.transformBox}>
                            <div className={s.transformLabel}>Entrada</div>
                            <div className={s.transformValue}>{selectedExample.input}</div>
                        </div>
                        <div className={s.transformArrow}>→</div>
                        <div className={s.transformBox}>
                            <div className={s.transformLabel}>Salida</div>
                            <div className={s.transformValue}>{selectedExample.output}</div>
                        </div>
                    </div>

                    <p className={s.description}>{selectedExample.description}</p>

                    <div className={s.stepsSection}>
                        <h4 className={s.stepsTitle}>Proceso paso a paso:</h4>
                        <ol className={s.stepsList}>
                            {selectedExample.steps.map((step, idx) => (
                                <li key={idx} className={s.step}>{step}</li>
                            ))}
                        </ol>
                    </div>

                    <div className={s.tip}>
                        <strong>Consejo:</strong> La visualización principal muestra el ejemplo "{examples[0].input}".
                        Observa cómo cada capa transformer procesa y reorganiza la información
                        para producir la secuencia ordenada.
                    </div>
                </div>
            </div>
        </ModalWindow>}
    </>;
};
