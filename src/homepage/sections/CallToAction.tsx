import React from "react";
import Link from "next/link";

export const CallToAction: React.FC = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-8">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                    Listo para explorar?
                </h2>

                {/* Description */}
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                    Comienza el recorrido guiado y descubre paso a paso como los
                    modelos de lenguaje procesan y generan texto.
                </p>

                {/* CTA Button */}
                <Link
                    href="/viz?phase=0"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                    <span>Iniciar Recorrido</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>

                {/* Secondary links */}
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                    <a href="https://github.com/niconiahi/llm-viz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Ver en GitHub
                    </a>
                    <span className="text-slate-600">|</span>
                    <Link href="/viz" className="hover:text-white transition-colors">
                        Modo libre
                    </Link>
                </div>
            </div>
        </section>
    );
};
