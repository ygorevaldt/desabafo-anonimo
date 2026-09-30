import { DinamicPage } from "@/components/DinamicPage";
import { FaHeart, FaUserSecret, FaRobot, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <DinamicPage className="max-w-4xl py-8 md:py-12">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-3 text-center sm:text-left border-b border-border/60 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-300 w-fit mx-auto sm:mx-0">
            <FaHeart className="w-3 h-3 text-rose-500" />
            <span>Nossa Missão</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Sobre o Desabafo Anônimo
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Acreditamos que todo ser humano merece um refúgio acolhedor para
            expressar suas dores, alegrias, dúvidas e anseios sem medo de
            rejeição ou julgamento.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FaUserSecret className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Anonimato Absoluto</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Não exigimos cadastro, e-mail ou fotos de perfil. Você é livre para
              ser você mesmo(a) em sua forma mais autêntica e sincera.
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FaHeart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Cultura de Apoio Empático</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O objetivo central da nossa comunidade é acolher. Cada botão de
              apoio e comentário deixado carrega afeto humano de quem também já
              passou por dias difíceis.
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FaRobot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Acolhimento Inicial com IA</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos inteligência artificial compassiva para que ninguém
              fique no silêncio logo após desabafar, trazendo palavras gentis de
              conforto inicial enquanto a comunidade lê o desabafo.
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FaShieldAlt className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Moderação Protetiva</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nossa tecnologia filtra e bloqueia discursos de ódio, violência ou
              abusos, mantendo um ambiente verdadeiramente seguro e saudável
              para mentes fragilizadas.
            </p>
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-300/40 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-soft">
              <FaPhoneAlt className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300">
                Está passando por um momento de crise intensa?
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                O <strong>Centro de Valorização da Vida (CVV)</strong> realiza apoio emocional e prevenção do suicídio gratuitamente, atendendo 24 horas todos os dias pelo telefone <strong>188</strong> ou pelo site <strong>cvv.org.br</strong>.
              </p>
            </div>
          </div>

          <a
            href="https://cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="warm" size="lg" className="font-semibold shadow-soft">
              Acessar CVV (188)
            </Button>
          </a>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/unburden">
            <Button variant="warm" size="lg" className="rounded-full px-8 font-semibold shadow-soft">
              Fazer meu desabafo agora
            </Button>
          </Link>
        </div>
      </div>
    </DinamicPage>
  );
}
