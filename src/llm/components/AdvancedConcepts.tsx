'use client';

import React, { useState } from 'react';
import s from './AdvancedConcepts.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faTimes, faChevronDown, faChevronUp, faLightbulb, faBolt, faDatabase, faRandom } from '@fortawesome/free-solid-svg-icons';

interface Concept {
    id: string;
    title: string;
    icon: any;
    summary: string;
    details: string;
    diagram?: React.ReactNode;
}

const concepts: Concept[] = [
    {
        id: 'kv-cache',
        title: 'KV Cache',
        icon: faDatabase,
        summary: 'Optimización para generación autoregresiva',
        details: `Durante la generación de texto, el modelo produce un token a la vez. Sin KV Cache, recalcularíamos Q, K, V para TODOS los tokens anteriores en cada paso.

**El problema:**
- Generar token 100 requiere procesar tokens 1-99
- Generar token 101 requiere procesar tokens 1-100
- ¡Mucho trabajo repetido!

**La solución (KV Cache):**
- Guardamos los vectores K y V de tokens ya procesados
- Solo calculamos K, V para el nuevo token
- Concatenamos con el cache existente

**Beneficio:** Reducción de O(n²) a O(n) en cómputo durante generación.

**Costo:** Más memoria GPU para almacenar el cache.`,
    },
    {
        id: 'flash-attention',
        title: 'Flash Attention',
        icon: faBolt,
        summary: 'Atención eficiente en memoria',
        details: `Flash Attention es una reimplementación del mecanismo de atención que es mucho más eficiente en memoria y velocidad.

**Problema tradicional:**
- La matriz de atención es T×T (cuadrática)
- Para contexto de 32K tokens: 32K × 32K = 1 billón de elementos
- No cabe en memoria GPU rápida (SRAM)

**Solución Flash Attention:**
- Nunca materializa la matriz completa
- Procesa en bloques pequeños (tiles)
- Usa "recomputation" inteligente
- Fusiona operaciones en un solo kernel

**Resultados:**
- 2-4x más rápido que implementación estándar
- Permite contextos mucho más largos
- Usado en GPT-4, Claude, Llama 2, etc.`,
    },
    {
        id: 'sampling',
        title: 'Estrategias de Muestreo',
        icon: faRandom,
        summary: 'Greedy, Beam Search, Top-k, Top-p',
        details: `Una vez que el modelo produce probabilidades, ¿cómo elegimos el siguiente token?

**Greedy Decoding:**
- Siempre elige el token más probable
- Rápido pero puede ser repetitivo
- argmax(probabilidades)

**Beam Search:**
- Mantiene las k mejores secuencias
- Explora múltiples caminos
- Mejor para traducción, peor para creatividad

**Top-k Sampling:**
- Muestrea solo de los k tokens más probables
- k=50 es común
- Evita tokens muy improbables

**Top-p (Nucleus) Sampling:**
- Muestrea del conjunto mínimo que suma probabilidad p
- p=0.9 significa: tokens hasta acumular 90%
- Más adaptativo que top-k

**Temperatura:**
- Escala los logits antes de softmax
- T<1: más determinístico
- T>1: más aleatorio
- T=0: equivale a greedy`,
    },
    {
        id: 'rope',
        title: 'RoPE (Rotary Position Embedding)',
        icon: faLightbulb,
        summary: 'Embeddings posicionales rotativos',
        details: `RoPE es una forma moderna de codificar posiciones, usada en Llama, GPT-NeoX, y otros.

**Problema con embeddings posicionales aprendidos:**
- Límite fijo de longitud de contexto
- No generaliza a posiciones no vistas

**Cómo funciona RoPE:**
- Rota los vectores Q y K según su posición
- La rotación codifica posición relativa
- El producto punto QK depende de (pos_i - pos_j)

**Ventajas:**
- Extendible a longitudes mayores
- Codifica posición relativa naturalmente
- Sin parámetros adicionales que aprender

**Fórmula (simplificada):**
\`\`\`
Q_rotado = rotate(Q, θ * posición)
K_rotado = rotate(K, θ * posición)
\`\`\`

Donde θ son frecuencias predefinidas.`,
    },
];

export function AdvancedConcepts() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faRocket} />
                <span>Conceptos Avanzados</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Conceptos Avanzados</h2>
                        <p className={s.subtitle}>
                            Optimizaciones y técnicas usadas en modelos de producción
                        </p>

                        <div className={s.conceptList}>
                            {concepts.map(concept => (
                                <div key={concept.id} className={s.concept}>
                                    <button
                                        className={s.conceptHeader}
                                        onClick={() => toggleExpand(concept.id)}
                                    >
                                        <div className={s.conceptIcon}>
                                            <FontAwesomeIcon icon={concept.icon} />
                                        </div>
                                        <div className={s.conceptInfo}>
                                            <h3>{concept.title}</h3>
                                            <p>{concept.summary}</p>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={expandedId === concept.id ? faChevronUp : faChevronDown}
                                            className={s.chevron}
                                        />
                                    </button>

                                    {expandedId === concept.id && (
                                        <div className={s.conceptDetails}>
                                            {concept.details.split('\n\n').map((para, i) => (
                                                <p key={i} dangerouslySetInnerHTML={{
                                                    __html: para
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/`([^`]+)`/g, '<code>$1</code>')
                                                        .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>')
                                                }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={s.footer}>
                            <p>
                                Estos conceptos son usados en modelos como GPT-4, Claude, Llama 2,
                                y otros LLMs de producción para lograr eficiencia y escala.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
