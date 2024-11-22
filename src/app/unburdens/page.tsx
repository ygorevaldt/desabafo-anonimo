"use client";

import { DinamicPage } from "@/components/DinamicPage";
import { Loading } from "@/components/Loading";
import { UnburdenListItem } from "@/components/UnburdenListItem";
import { UnburdenList } from "@/components/UnburdenList";
import { UnburdenType } from "@/types/unburden.type";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function Unburdens() {
  return (
    <>
      <DinamicPage className="flex flex-col gap-4">
        <header>
          <h1 className="text-2xl font-semibold">Desabafos</h1>
        </header>
        <main>
          <UnburdenList />
        </main>
      </DinamicPage>
    </>
  );
}
