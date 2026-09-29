import { ReactNode } from "react";

import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

type DinamicPageProps = {
  children: ReactNode;
  className?: string;
};

export function DinamicPage({ children, className }: DinamicPageProps) {
  return (
    <>
      <article className="flex flex-col min-h-screen">
        <NavBar />
        <div
          className={`
            flex-grow max-w-5xl w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 mx-auto
            ${className ?? ""}
          `}
        >
          {children}
        </div>
      </article>
      <Footer />
    </>
  );
}
