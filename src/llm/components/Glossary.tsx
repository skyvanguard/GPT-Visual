'use client';

import React, { useState } from 'react';
import { ModalWindow } from '@/src/utils/Portal';
import s from './Glossary.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { KeyboardOrder, useGlobalKeyboard } from '@/src/utils/keyboard';

interface IGlossaryTerm {
    term: string;
    definition: string;
    related?: string[];
}

const glossaryTerms: IGlossaryTerm[] = [
    {
        term: 'Token',
        definition: 'La unidad básica de texto que el modelo procesa. Puede ser una palabra, parte de una palabra, o un carácter. En nuestro ejemplo, cada letra (A, B, C) es un token.',
        related: ['Vocabulario', 'Tokenización'],
    },
    {
        term: 'Vocabulario',
        definition: 'El conjunto completo de todos los tokens que el modelo puede reconocer y procesar. En nuestro modelo nano-gpt, el vocabulario tiene solo 3 tokens: A, B, y C.',
        related: ['Token', 'Embedding'],
    },
    {
        term: 'Embedding',
        definition: 'La representación numérica de un token como un vector de números. Convierte cada token en un vector de dimensión fija (48 en nuestro modelo) que captura su significado semántico.',
        related: ['Token', 'Vector'],
    },
    {
        term: 'Vector',
        definition: 'Una lista ordenada de números. En el contexto de LLMs, los vectores representan información como embeddings de tokens o estados intermedios del modelo.',
        related: ['Embedding', 'Matriz'],
    },
    {
        term: 'Matriz',
        definition: 'Una tabla bidimensional de números organizada en filas y columnas. Los pesos del modelo se almacenan como matrices que transforman vectores de entrada.',
        related: ['Vector', 'Pesos'],
    },
    {
        term: 'Pesos',
        definition: 'Los parámetros aprendidos del modelo que determinan cómo transforma la entrada. Son los números (mostrados en azul) que el modelo aprende durante el entrenamiento.',
        related: ['Matriz', 'Entrenamiento'],
    },
    {
        term: 'Transformer',
        definition: 'La arquitectura principal del modelo, compuesta por capas de atención y redes feedforward. Procesa la secuencia completa en paralelo usando el mecanismo de atención.',
        related: ['Atención', 'MLP'],
    },
    {
        term: 'Atención (Self-Attention)',
        definition: 'Mecanismo que permite a cada token "mirar" a otros tokens en la secuencia para entender el contexto. Calcula qué tan relevante es cada token para los demás.',
        related: ['Query', 'Key', 'Value'],
    },
    {
        term: 'Query (Q)',
        definition: 'En atención, representa "qué información está buscando" el token actual. Se compara con las Keys de otros tokens para determinar relevancia.',
        related: ['Atención', 'Key', 'Value'],
    },
    {
        term: 'Key (K)',
        definition: 'En atención, representa "qué información contiene" cada token. Se compara con las Queries para calcular los puntajes de atención.',
        related: ['Atención', 'Query', 'Value'],
    },
    {
        term: 'Value (V)',
        definition: 'En atención, representa "la información a transmitir" de cada token. Los valores se ponderan según los puntajes de atención para producir la salida.',
        related: ['Atención', 'Query', 'Key'],
    },
    {
        term: 'Softmax',
        definition: 'Función que convierte un vector de números en probabilidades (que suman 1). Se usa para normalizar los puntajes de atención y para la predicción final.',
        related: ['Atención', 'Probabilidad'],
    },
    {
        term: 'Layer Normalization',
        definition: 'Técnica para estabilizar el entrenamiento normalizando los valores en cada capa. Ajusta los valores para que tengan media 0 y varianza 1.',
        related: ['Transformer', 'Entrenamiento'],
    },
    {
        term: 'MLP (Perceptrón Multicapa)',
        definition: 'Red neuronal feedforward que procesa cada posición independientemente. Típicamente expande la dimensión, aplica no-linealidad, y la reduce de nuevo.',
        related: ['Transformer', 'GELU'],
    },
    {
        term: 'GELU',
        definition: 'Función de activación no lineal usada en los MLPs modernos. Similar a ReLU pero más suave, permite al modelo aprender patrones complejos.',
        related: ['MLP', 'Activación'],
    },
    {
        term: 'Residual Connection',
        definition: 'Conexión que suma la entrada de una capa directamente a su salida. Facilita el flujo de gradientes y permite entrenar redes más profundas.',
        related: ['Transformer', 'Entrenamiento'],
    },
    {
        term: 'Parámetros',
        definition: 'El número total de pesos aprendibles en el modelo. Nuestro nano-gpt tiene ~85,000 parámetros, mientras que GPT-3 tiene 175 mil millones.',
        related: ['Pesos', 'Entrenamiento'],
    },
    {
        term: 'Inferencia',
        definition: 'El proceso de usar un modelo entrenado para hacer predicciones. Es lo que visualizamos: cómo el modelo procesa la entrada para predecir el siguiente token.',
        related: ['Entrenamiento', 'Predicción'],
    },
    {
        term: 'Entrenamiento',
        definition: 'El proceso de ajustar los pesos del modelo para minimizar errores en predicciones. Usa backpropagation y descenso de gradiente para actualizar los parámetros.',
        related: ['Pesos', 'Backpropagation'],
    },
    {
        term: 'Backpropagation',
        definition: 'Algoritmo para calcular cómo cada peso contribuye al error. Propaga el error desde la salida hacia atrás a través de la red para actualizar los pesos.',
        related: ['Entrenamiento', 'Gradiente'],
    },
];

export const Glossary: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState<IGlossaryTerm | null>(null);

    useGlobalKeyboard(KeyboardOrder.Modal, ev => {
        if (visible && ev.key === 'Escape') {
            setVisible(false);
            ev.stopPropagation();
        }
    });

    const filteredTerms = glossaryTerms.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTermClick = (term: IGlossaryTerm) => {
        setSelectedTerm(term);
    };

    const handleRelatedClick = (relatedTerm: string) => {
        const found = glossaryTerms.find(t => t.term === relatedTerm);
        if (found) {
            setSelectedTerm(found);
            setSearchTerm('');
        }
    };

    return <>
        <button
            onClick={() => setVisible(true)}
            className={s.glossaryBtn}
            aria-label="Abrir glosario de términos"
            title="Glosario"
        >
            <FontAwesomeIcon icon={faBook} />
        </button>

        {visible && <ModalWindow
            className={s.modalWindow}
            backdropClassName={s.modalWindowBackdrop}
            onBackdropClick={() => setVisible(false)}
        >
            <div className={s.header}>
                <div className={s.title}>Glosario de Términos</div>
                <button className={s.closeBtn} onClick={() => setVisible(false)}>×</button>
            </div>

            <div className={s.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar término..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={s.searchInput}
                />
            </div>

            <div className={s.content}>
                <div className={s.termList}>
                    {filteredTerms.map((term) => (
                        <div
                            key={term.term}
                            className={`${s.termItem} ${selectedTerm?.term === term.term ? s.selected : ''}`}
                            onClick={() => handleTermClick(term)}
                        >
                            {term.term}
                        </div>
                    ))}
                </div>

                <div className={s.termDetail}>
                    {selectedTerm ? (
                        <>
                            <h3 className={s.termTitle}>{selectedTerm.term}</h3>
                            <p className={s.termDefinition}>{selectedTerm.definition}</p>
                            {selectedTerm.related && selectedTerm.related.length > 0 && (
                                <div className={s.relatedTerms}>
                                    <span className={s.relatedLabel}>Términos relacionados:</span>
                                    <div className={s.relatedList}>
                                        {selectedTerm.related.map((related) => (
                                            <button
                                                key={related}
                                                className={s.relatedBtn}
                                                onClick={() => handleRelatedClick(related)}
                                            >
                                                {related}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={s.placeholder}>
                            Selecciona un término para ver su definición
                        </div>
                    )}
                </div>
            </div>
        </ModalWindow>}
    </>;
};
