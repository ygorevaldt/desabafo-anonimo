"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export function UnburdenForm() {
  const [vent, setVent] = useState("");

  function handleSubmitVent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(vent);
  }

  function handleNewVentValue(event: ChangeEvent<HTMLTextAreaElement>) {
    setVent(event.target.value);
  }

  return (
    <form onSubmit={handleSubmitVent}>
      <span>Compartilhe:</span>
      <textarea
        placeholder="Escreva seu desabafo aqui:"
        value={vent}
        onChange={handleNewVentValue}
      ></textarea>
      <button type="submit"></button>
    </form>
  );
}
