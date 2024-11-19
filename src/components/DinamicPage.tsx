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
        <div className={`flex-grow max-w-5xl my-0 mx-auto ${className}`}>
          {children}
        </div>
      </article>
      <Footer />
    </>
  );
}
