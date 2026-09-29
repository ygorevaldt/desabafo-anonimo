"use client";

import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenList } from "@/components/UnburdenList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFeather } from "react-icons/fa";

export default function Unburdens() {
  return (
    <DinamicPage className="flex flex-col gap-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Todos os Desabafos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Leia com empatia, acolha sentimentos e apoie quem precisa.
          </p>
        </div>

        <Link href="/unburden">
          <Button variant="warm" size="sm" className="gap-2 font-semibold shadow-soft">
            <FaFeather className="w-3.5 h-3.5" />
            <span>Fazer um desabafo</span>
          </Button>
        </Link>
      </div>

      <main className="mb-12">
        <UnburdenList />
      </main>
    </DinamicPage>
  );
}
