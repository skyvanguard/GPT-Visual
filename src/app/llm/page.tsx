import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';
import { Header } from '@/src/homepage/Header';
import { Glossary } from '@/src/llm/components/Glossary';
import { ExampleSelector } from '@/src/llm/components/ExampleSelector';

export const metadata = {
    title: 'GPT-Visual - Visualización 3D de Modelos GPT',
    description: 'Una visualización 3D animada e interactiva de un LLM (Large Language Model) con un recorrido guiado que explica cómo funcionan los transformers.',
    openGraph: {
        title: 'GPT-Visual - Visualización 3D de Modelos GPT',
        description: 'Explora cómo funcionan los LLM con esta visualización 3D interactiva. Recorrido guiado del algoritmo que impulsa ChatGPT.',
        type: 'article',
        locale: 'es_ES',
        images: [
            {
                url: '/images/llm-viz-screenshot2.png',
                width: 1200,
                height: 630,
                alt: 'GPT-Visual: Visualización 3D interactiva de un modelo de lenguaje grande',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GPT-Visual',
        description: 'Visualización 3D interactiva de modelos GPT y transformers.',
        images: ['/images/llm-viz-screenshot2.png'],
    },
    keywords: ['GPT-Visual', 'LLM', 'GPT', 'transformer', 'visualización', 'machine learning', 'inteligencia artificial', 'IA'],
};

export default function Page() {
    return <>
        <Header title="GPT-Visual">
            <InfoButton />
        </Header>
        <LayerView />
        <Glossary />
        <ExampleSelector />
        <div id="portal-container"></div>
    </>;
}
