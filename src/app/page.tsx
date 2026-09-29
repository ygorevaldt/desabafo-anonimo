import Link from "next/link";
import { FaFeather, FaHeart, FaShieldAlt, FaUserSecret, FaComments } from "react-icons/fa";
import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenList } from "@/components/UnburdenList";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <DinamicPage className="flex flex-col gap-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 py-8 md:py-16 max-w-3xl mx-auto">
        {/* Safe Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-300/30 dark:border-rose-800/40">
          <FaHeart className="w-3 h-3 text-rose-500 animate-pulse" />
          <span>Espaço gratuito, empático e 100% anônimo</span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Muitas vezes, só precisamos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-400">
              ser ouvidos
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Este é um refúgio acolhedor para você expressar seus sentimentos,
            dores, angústias ou alegrias sem receios ou julgamentos. Desabafe com
            liberdade e sinta o carinho de uma comunidade pronta para apoiar.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/unburden" className="w-full sm:w-auto">
            <Button
              variant="warm"
              size="lg"
              className="w-full sm:w-auto text-base gap-2.5 font-semibold shadow-soft hover:shadow-soft-md"
            >
              <FaFeather className="w-4 h-4" />
              <span>Quero desabafar</span>
            </Button>
          </Link>

          <Link href="/unburdens" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base gap-2 font-medium"
            >
              <FaComments className="w-4 h-4 text-muted-foreground" />
              <span>Ver desabafos</span>
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 w-full max-w-xl text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-border/70 shadow-soft">
            <FaUserSecret className="w-4 h-4 text-rose-400" />
            <span className="font-medium">Totalmente anônimo</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-border/70 shadow-soft">
            <FaShieldAlt className="w-4 h-4 text-rose-400" />
            <span className="font-medium">Moderação segura</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-border/70 shadow-soft">
            <FaHeart className="w-4 h-4 text-rose-400" />
            <span className="font-medium">Apoio mútuo</span>
          </div>
        </div>
      </section>

      {/* Main Feed Section */}
      <main className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Desabafos Recentes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Histórias reais de pessoas que escolheram compartilhar o que sentem.
            </p>
          </div>
          <Link href="/unburden">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-rose-500 font-semibold">
              <FaFeather className="w-3 h-3" />
              <span>Escrever</span>
            </Button>
          </Link>
        </div>

        <UnburdenList />
      </main>
    </DinamicPage>
  );
}
