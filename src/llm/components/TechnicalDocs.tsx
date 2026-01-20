'use client';

import React, { useState } from 'react';
import s from './TechnicalDocs.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTimes, faCode, faCalculator, faExternalLink } from '@fortawesome/free-solid-svg-icons';

interface DocSection {
    id: string;
    title: string;
    content: React.ReactNode;
}

const sections: DocSection[] = [
    {
        id: 'attention',
        title: 'Ecuación de Atención',
        content: (
            <>
                <div className={s.equation}>
                    <code>Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) V</code>
                </div>
                <div className={s.variables}>
                    <div><strong>Q</strong> = Queries (consultas), matriz [T × d<sub>k</sub>]</div>
                    <div><strong>K</strong> = Keys (claves), matriz [T × d<sub>k</sub>]</div>
                    <div><strong>V</strong> = Values (valores), matriz [T × d<sub>v</sub>]</div>
                    <div><strong>d<sub>k</sub></strong> = dimensión de Q y K (para escalar)</div>
                    <div><strong>T</strong> = longitud de secuencia</div>
                </div>
                <div className={s.note}>
                    La división por √d<sub>k</sub> previene que el producto punto sea muy grande
                    cuando d<sub>k</sub> es grande, lo que haría que softmax se sature.
                </div>
            </>
        )
    },
    {
        id: 'multihead',
        title: 'Multi-Head Attention',
        content: (
            <>
                <div className={s.equation}>
                    <code>MultiHead(Q, K, V) = Concat(head<sub>1</sub>, ..., head<sub>h</sub>) W<sup>O</sup></code>
                    <br />
                    <code>head<sub>i</sub> = Attention(QW<sub>i</sub><sup>Q</sup>, KW<sub>i</sub><sup>K</sup>, VW<sub>i</sub><sup>V</sup>)</code>
                </div>
                <div className={s.variables}>
                    <div><strong>h</strong> = número de cabezas (heads)</div>
                    <div><strong>W<sub>i</sub><sup>Q</sup>, W<sub>i</sub><sup>K</sup>, W<sub>i</sub><sup>V</sup></strong> = proyecciones para cabeza i</div>
                    <div><strong>W<sup>O</sup></strong> = proyección de salida</div>
                </div>
                <div className={s.note}>
                    Cada cabeza puede aprender a atender a diferentes tipos de información
                    (sintáctica, semántica, posicional, etc.)
                </div>
            </>
        )
    },
    {
        id: 'layernorm',
        title: 'Layer Normalization',
        content: (
            <>
                <div className={s.equation}>
                    <code>LayerNorm(x) = γ ⊙ (x - μ) / σ + β</code>
                </div>
                <div className={s.variables}>
                    <div><strong>μ</strong> = mean(x) = (1/d) Σ x<sub>i</sub></div>
                    <div><strong>σ</strong> = √(var(x) + ε)</div>
                    <div><strong>γ, β</strong> = parámetros aprendibles (escala y sesgo)</div>
                    <div><strong>ε</strong> = constante pequeña para estabilidad (ej: 1e-5)</div>
                </div>
            </>
        )
    },
    {
        id: 'gelu',
        title: 'GELU (Activación)',
        content: (
            <>
                <div className={s.equation}>
                    <code>GELU(x) = x · Φ(x)</code>
                    <br />
                    <code>≈ 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))</code>
                </div>
                <div className={s.variables}>
                    <div><strong>Φ(x)</strong> = CDF de distribución normal estándar</div>
                </div>
                <div className={s.note}>
                    GELU es una versión suave de ReLU. A diferencia de ReLU que tiene un corte
                    brusco en 0, GELU tiene una transición suave.
                </div>
            </>
        )
    },
    {
        id: 'softmax',
        title: 'Softmax',
        content: (
            <>
                <div className={s.equation}>
                    <code>softmax(x<sub>i</sub>) = e<sup>x<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub></sup></code>
                </div>
                <div className={s.note}>
                    <strong>Versión estable numéricamente:</strong>
                </div>
                <div className={s.equation}>
                    <code>softmax(x<sub>i</sub>) = e<sup>(x<sub>i</sub> - max(x))</sup> / Σ<sub>j</sub> e<sup>(x<sub>j</sub> - max(x))</sup></code>
                </div>
                <div className={s.note}>
                    Restar el máximo previene overflow al calcular exponenciales grandes.
                </div>
            </>
        )
    },
    {
        id: 'pseudocode',
        title: 'Pseudocódigo del Transformer',
        content: (
            <pre className={s.code}>{`def transformer_block(x):
    # Pre-norm Self-Attention
    norm1 = layer_norm(x)
    q = norm1 @ W_q + b_q
    k = norm1 @ W_k + b_k
    v = norm1 @ W_v + b_v

    # Attention scores
    scores = (q @ k.T) / sqrt(d_k)
    scores = apply_causal_mask(scores)
    weights = softmax(scores)
    attn_out = weights @ v

    # Residual connection
    x = x + (attn_out @ W_o + b_o)

    # Pre-norm MLP
    norm2 = layer_norm(x)
    hidden = gelu(norm2 @ W_1 + b_1)
    mlp_out = hidden @ W_2 + b_2

    # Residual connection
    x = x + mlp_out

    return x`}</pre>
        )
    },
    {
        id: 'papers',
        title: 'Papers Fundamentales',
        content: (
            <div className={s.papers}>
                <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className={s.paper}>
                    <div className={s.paperTitle}>
                        Attention Is All You Need
                        <FontAwesomeIcon icon={faExternalLink} />
                    </div>
                    <div className={s.paperInfo}>Vaswani et al., 2017 - El paper original del Transformer</div>
                </a>
                <a href="https://arxiv.org/abs/2005.14165" target="_blank" rel="noopener noreferrer" className={s.paper}>
                    <div className={s.paperTitle}>
                        Language Models are Few-Shot Learners
                        <FontAwesomeIcon icon={faExternalLink} />
                    </div>
                    <div className={s.paperInfo}>Brown et al., 2020 - GPT-3</div>
                </a>
                <a href="https://arxiv.org/abs/2205.14135" target="_blank" rel="noopener noreferrer" className={s.paper}>
                    <div className={s.paperTitle}>
                        FlashAttention
                        <FontAwesomeIcon icon={faExternalLink} />
                    </div>
                    <div className={s.paperInfo}>Dao et al., 2022 - Atención eficiente en memoria</div>
                </a>
                <a href="https://arxiv.org/abs/2104.09864" target="_blank" rel="noopener noreferrer" className={s.paper}>
                    <div className={s.paperTitle}>
                        RoFormer: Enhanced Transformer with Rotary Position Embedding
                        <FontAwesomeIcon icon={faExternalLink} />
                    </div>
                    <div className={s.paperInfo}>Su et al., 2021 - RoPE</div>
                </a>
            </div>
        )
    }
];

export function TechnicalDocs() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('attention');

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faBook} />
                <span>Documentación Técnica</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Documentación Técnica</h2>
                        <p className={s.subtitle}>
                            Ecuaciones, pseudocódigo y referencias
                        </p>

                        <div className={s.tabs}>
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    className={`${s.tab} ${activeSection === section.id ? s.active : ''}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>

                        <div className={s.content}>
                            {sections.find(s => s.id === activeSection)?.content}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
