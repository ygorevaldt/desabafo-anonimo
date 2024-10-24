"use client";

import { useState } from "react";

export default function Home() {
    const [showTextArea, setShowTextArea] = useState(false);

    function handleTextAreaInput() {
        setShowTextArea(!showTextArea);
    }

    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <header className="flex flex-col gap-2 items-center">
                <h1 className="text-3xl font-bold">
                    Desabafe aqui, você não está sozinho.
                </h1>
                <p>
                    Um espaço seguro e anônimo para compartilhar seus sentimentos.
                </p>
            </header>
            <main className="flex flex-col gap-10">
                <div className="flex justify-center">
                    <button
                        className={`
                            bg-pink-300 hover:bg-pink-200
                            border-2 border-transparent hover:border-pink-400 hover:border-2
                            transition duration-200
                            rounded-3xl   
                            px-6 py-4  
                        `}
                        onClick={handleTextAreaInput}
                    >
                        Desabafar
                    </button>
                </div>
                <section>
                    {showTextArea && (
                        <form action="#" className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <label>
                                    Sinta-se acolhido para desabafar sobre o que quiser
                                </label>
                                <textarea
                                    className="border-2 border-pink-400 rounded-lg p-2"
                                    name="vent"
                                    id="vent"
                                    cols={100}
                                    rows={10}
                                    placeholder="Escreva o seu desabafo aqui"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit">Enviar</button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}
