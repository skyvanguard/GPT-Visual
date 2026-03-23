import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/src/homepage/Header';

const LayerView = dynamic(() => import('@/src/llm/LayerView').then(m => m.LayerView), { ssr: false });
const InfoButton = dynamic(() => import('@/src/llm/WelcomePopup').then(m => m.InfoButton), { ssr: false });
const Glossary = dynamic(() => import('@/src/llm/components/Glossary').then(m => m.Glossary), { ssr: false });
const ExampleSelector = dynamic(() => import('@/src/llm/components/ExampleSelector').then(m => m.ExampleSelector), { ssr: false });

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
