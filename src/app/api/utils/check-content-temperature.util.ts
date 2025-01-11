export function checkContentTemperature(text: string) {
  const sensitivePatterns = [
    /\b(s[3e][uú][ií1!|][cçk][íi1!|]d[io0ø])\b/gi, // suicídio
    /\b(auto[ -]?[mµ][uúv][t7][ií1!|][l1!|][a@4][çc]?[ãa][o0ø])\b/gi, // automutilação
    /\b(m[o0ø][r4]{1,2}[a@4])\b/gi, // morra
    /\b(m[o0ø][r4][t7][e3])\b/gi, // morte
    /\b(m[o0ø][r4]{1,2}[e3][r3]?)\b/gi, // morrer
    /\b(mat[a@4][r3])\b/gi, // matar
    /\b(cr[ií1!|][mµ][e3s5])\b/gi, // crime
    /\b(ass[a@4][s5]{1,2}[ií1!|]n[a@4][t7][o0ø])\b/gi, // assassinato
    /\b(estu[p9][r3][a@4][r3]?)\b/gi, // estuprar
    /\b(est[uúv][p9][r3][o0ø])\b/gi, // estupro
    /\b(roub[a@4][r3])\b/gi, // roubar
    /\b(roub[o0ø])\b/gi, // roubo
    /\b(palavr[a@4][ãa][o0ø][e3ií1!|])\b/gi, // palavrões personalizados
    /\b(me[ -]?[mµ]at[a@4][r3])\b/gi, // me matar
    /\b(me[ -]?[cçk][o0ø]rt[a@4][r3])\b/gi, // me cortar
    /\b(se[ -]?[cçk][o0ø]rt[a@4][r3])\b/gi, // se cortar
    /\b(me[ -]?[q9][uúv][e3]im[a@4][r3])\b/gi, // me queimar
    /\b(se[ -]?[q9][uúv][e3]im[a@4][r3])\b/gi, // se queimar
    /\b(se[ -]?[b8][a@4]t[e3r])\b/gi, // se bater
    /\b(g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?me[ -]?[b8][a@4]t[e3r])\b/gi, // gosto de me bater
    /\b(g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?me[ -]?[cçk][o0ø]rt[a@4][r3])\b/gi, // gosto de me cortar
    /\b(g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?ass[a@4][s5]{1,2}[ií1!|]n[a@4][r3])\b/gi, // gosto de assassinar
    /\b(q[uúv][e3][r7][o0ø][ -]?[a@4]ss[a@4][s5]{1,2}[ií1!|]n[a@4][r3])\b/gi, // quero assassinar
    /\b(q[uúv][e3][r7][o0ø][ -]?me[ -]?[cçk][o0ø]rt[a@4][r3])\b/gi, // quero me cortar
  ];

  let points = 0;

  sensitivePatterns.forEach((pattern) => {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      console.log("Pattern matched:", pattern, "Count:", matches.length);
      points += matches.length;
    }
  });

  if (points >= 4) {
    return "red";
  }

  if (points > 0) {
    return "yellow";
  }

  return "blue";
}
