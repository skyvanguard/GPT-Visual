import React from 'react';
import { HomePage } from '@/src/homepage/HomePage';

export const metadata = {
    title: 'GPT-Visual - Visualiza como piensan los LLMs',
    description: 'Una visualizacion 3D animada e interactiva de un LLM (Large Language Model) con un recorrido guiado que explica como funcionan los transformers.',
    openGraph: {
        title: 'GPT-Visual - Visualiza como piensan los LLMs',
        description: 'Explora como funcionan los LLM con esta visualizacion 3D interactiva. Recorrido guiado del algoritmo que impulsa ChatGPT.',
        type: 'website',
        locale: 'es_ES',
        images: [
            {
                url: '/images/llm-viz-screenshot2.png',
                width: 1200,
                height: 630,
                alt: 'GPT-Visual: Visualizacion 3D interactiva de un modelo de lenguaje grande',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GPT-Visual - Visualiza como piensan los LLMs',
        description: 'Visualizacion 3D interactiva de modelos GPT y transformers.',
        images: ['/images/llm-viz-screenshot2.png'],
    },
    keywords: ['GPT-Visual', 'LLM', 'GPT', 'transformer', 'visualizacion', 'machine learning', 'inteligencia artificial', 'IA', 'deep learning'],
};

export default function Page() {
    return <HomePage />;
}
