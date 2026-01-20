import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';
import { Header } from '@/src/homepage/Header';
import { Glossary } from '@/src/llm/components/Glossary';
import { ExampleSelector } from '@/src/llm/components/ExampleSelector';

export const metadata = {
    title: 'GPT-Visual - Visualizacion 3D Interactiva',
    description: 'Explora el funcionamiento interno de un modelo GPT con esta visualizacion 3D interactiva y un recorrido guiado educativo.',
    openGraph: {
        title: 'GPT-Visual - Visualizacion 3D de Modelos GPT',
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
        title: 'GPT-Visual',
        description: 'Visualizacion 3D interactiva de modelos GPT y transformers.',
        images: ['/images/llm-viz-screenshot2.png'],
    },
    keywords: ['GPT-Visual', 'LLM', 'GPT', 'transformer', 'visualizacion', 'machine learning', 'inteligencia artificial', 'IA'],
};

export default function VizPage() {
    return <>
        <Header title="Visualizacion 3D">
            <InfoButton />
        </Header>
        <LayerView />
        <Glossary />
        <ExampleSelector />
        <div id="portal-container"></div>
    </>;
}
