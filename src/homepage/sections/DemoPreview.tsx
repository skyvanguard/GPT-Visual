import React from "react";
import Link from "next/link";
import Image from "next/image";

export const DemoPreview: React.FC = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Visualizacion en accion
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Explora cada capa del modelo GPT: embedding, atencion, MLP y mas.
                        Todo renderizado en 3D con WebGL.
                    </p>
                </div>

                {/* Preview container */}
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                    {/* Screenshot container */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900">
                        {/* Browser chrome mockup */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="flex items-center gap-2 px-4 py-1 bg-slate-900/50 rounded-lg text-sm text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    gpt-visual.vercel.app
                                </div>
                            </div>
                        </div>

                        {/* Screenshot image */}
                        <div className="relative aspect-video">
                            <Image
                                src="/images/llm-viz-screenshot2.png"
                                alt="GPT-Visual - Visualizacion 3D del modelo transformer"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Overlay with play button */}
                            <Link
                                href="/viz"
                                className="absolute inset-0 flex items-center justify-center bg-slate-950/40 hover:bg-slate-950/20 transition-colors group/play"
                            >
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover/play:scale-110 transition-transform">
                                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Component labels */}
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    {[
                        { name: "Embedding", color: "bg-purple-500" },
                        { name: "Atencion", color: "bg-orange-500" },
                        { name: "MLP", color: "bg-cyan-500" },
                        { name: "Softmax", color: "bg-green-500" },
                        { name: "LayerNorm", color: "bg-yellow-500" }
                    ].map((component) => (
                        <div
                            key={component.name}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50"
                        >
                            <div className={`w-3 h-3 rounded-full ${component.color}`} />
                            <span className="text-sm text-slate-300">{component.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
