import React from "react";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const features: Feature[] = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
        ),
        title: "Visualizacion 3D",
        description: "Explora la arquitectura del transformer en un espacio tridimensional interactivo con zoom, rotacion y navegacion.",
        color: "from-indigo-500 to-violet-500"
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        title: "Recorrido Guiado",
        description: "11 fases educativas que te llevan desde los conceptos basicos hasta el entrenamiento del modelo.",
        color: "from-cyan-500 to-blue-500"
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
        ),
        title: "Interactivo",
        description: "Haz clic en cualquier componente para ver su funcion. Cambia el texto de entrada y observa los cambios.",
        color: "from-violet-500 to-purple-500"
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        title: "Matematicas Visuales",
        description: "Ve como funcionan las matrices, el softmax, la atencion y otras operaciones en tiempo real.",
        color: "from-emerald-500 to-teal-500"
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
        ),
        title: "100% en Espanol",
        description: "Todo el contenido educativo, glosario y ejemplos estan completamente traducidos al espanol.",
        color: "from-orange-500 to-amber-500"
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        title: "Open Source",
        description: "Codigo abierto en GitHub. Contribuye, reporta issues o usa el proyecto para tus propios fines educativos.",
        color: "from-pink-500 to-rose-500"
    }
];

export const Features: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Aprende como funcionan los LLMs
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Una experiencia educativa completa para entender la arquitectura transformer
                        que impulsa ChatGPT, Claude y otros modelos de lenguaje.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
