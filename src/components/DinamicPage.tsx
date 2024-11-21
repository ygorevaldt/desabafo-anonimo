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
          className={`flex-grow max-w-5xl w-full my-0 mx-auto p-10 ${className ?? ""}`}
        >
          {children}
        </div>
      </article>
      <Footer />
    </>
  );
}
