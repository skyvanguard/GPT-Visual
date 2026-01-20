import React from "react";

interface Step {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Entrada de Texto",
        description: "El texto se divide en tokens y cada token se convierte en un vector de embedding de alta dimension.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        )
    },
    {
        number: "02",
        title: "Transformer",
        description: "Los embeddings pasan por capas de atencion y MLP que aprenden relaciones entre tokens.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        )
    },
    {
        number: "03",
        title: "Salida",
        description: "Se calcula una distribucion de probabilidad sobre todos los tokens posibles para predecir el siguiente.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )
    }
];

export const HowItWorks: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Como funciona un LLM
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        En tres pasos, el modelo transforma texto en predicciones.
                        Cada paso se visualiza en detalle en el recorrido guiado.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 transform -translate-y-1/2" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Card */}
                                <div className="relative bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
                                    {/* Number badge */}
                                    <div className="absolute -top-4 left-8 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-sm font-bold text-white">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center mb-6 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow for mobile */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden flex justify-center my-4">
                                        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual representation */}
                <div className="mt-16 p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center">
                        {/* Input */}
                        <div className="flex-shrink-0">
                            <div className="px-6 py-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                <div className="text-sm text-slate-400 mb-1">Entrada</div>
                                <div className="text-lg font-mono text-white">&quot;Hola, &quot;</div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <svg className="w-8 h-8 text-indigo-400 rotate-90 md:rotate-0 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>

                        {/* Transformer block */}
                        <div className="flex-shrink-0">
                            <div className="px-8 py-4 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl border border-indigo-500/30">
                                <div className="text-sm text-indigo-300 mb-1">Transformer</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400" title="Embedding" />
                                    <div className="w-2 h-2 rounded-full bg-orange-400" title="Atencion" />
                                    <div className="w-2 h-2 rounded-full bg-cyan-400" title="MLP" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" title="Softmax" />
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <svg className="w-8 h-8 text-violet-400 rotate-90 md:rotate-0 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>

                        {/* Output */}
                        <div className="flex-shrink-0">
                            <div className="px-6 py-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                <div className="text-sm text-slate-400 mb-1">Prediccion</div>
                                <div className="text-lg font-mono text-cyan-400">&quot;mundo&quot;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
