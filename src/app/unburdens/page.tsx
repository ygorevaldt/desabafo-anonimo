"use client";

import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenList } from "@/components/UnburdenList";

export default function Unburdens() {
  return (
    <>
      <DinamicPage className="flex flex-col gap-4 py-6">
        <header>
          <h1 className="text-2xl font-semibold">Desabafos</h1>
        </header>
        <main className="mb-10">
          <UnburdenList />
        </main>
      </DinamicPage>
    </>
  );
}
