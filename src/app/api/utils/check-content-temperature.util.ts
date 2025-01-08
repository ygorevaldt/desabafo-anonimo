export function checkContentTemperature(text: string) {
  const sensitivePatterns = [
    /s[3e][uú][ií1!|][cçk][íi1!|]d[io0ø]/i, // suicídio (s3u1c1d10, s3uçíd10, etc.)
    /auto[ -]?[mµ][uúv][t7][ií1!|][l1!|][a@4][çc]?[ãa][o0ø]/i, // automutilação (aut0-mµt1l4çã0, etc.)
    /m[o0ø][r4]{1,2}[a@4]/i, // morra, m0rra, m0rr4
    /m[o0ø][r4][t7][e3]/i, // morte, mort3, m0rt3
    /m[o0ø][r4]{1,2}[e3][r3]?/i, // morrer, m0rr3r, m0r3r
    /mat[a@4][r3]/i, // matar, m4t4r, m@t4r
    /cr[ií1!|][mµ][e3s5]/i, // crime, cr1m3, cr1m35
    /ass[a@4][s5]{1,2}[ií1!|]n[a@4][t7][o0ø]/i, // assassinato, 4ss4ss1n4t0
    /estu[p9][r3][a@4][r3]?/i, // estuprar, 3stupr4r
    /est[uúv][p9][r3][o0ø]/i, // estupro, 3stúpr0
    /roub[a@4][r3]/i, // roubar, r0ub4r
    /roub[o0ø]/i, // roubo, r0ub0
    /palavr[a@4][ãa][o0ø][e3ií1!|]/i, // palavrões personalizados
    /me[ -]?[mµ]at[a@4][r3]/i, // me matar, m3 m4t4r
    /me[ -]?[cçk][o0ø]rt[a@4][r3]/i, // me cortar, m3 c0rt4r
    /se[ -]?[cçk][o0ø]rt[a@4][r3]/i, // se cortar, s3 c0rt4r
    /me[ -]?[q9][uúv][e3]im[a@4][r3]/i, // me queimar, m3 qu31m4r
    /se[ -]?[q9][uúv][e3]im[a@4][r3]/i, // se queimar, s3 qu31m4r
    /se[ -]?[b8][a@4]t[e3r]/i, // se bater, s3 b4t3r
    /g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?me[ -]?[b8][a@4]t[e3r]/i, // gosto de me bater, g0st0 d3 m3 b4t3r
    /g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?me[ -]?[cçk][o0ø]rt[a@4][r3]/i, // gosto de me cortar, g0st0 d3 m3 c0rt4r
    /g[o0ø][s5][t7][o0ø][ -]?[d9][e3][ -]?ass[a@4][s5]{1,2}[ií1!|]n[a@4][r3]/i, // gosto de assassinar, g0st0 d3 4ss4ss1n4r
    /q[uúv][e3][r7][o0ø][ -]?[a@4]ss[a@4][s5]{1,2}[ií1!|]n[a@4][r3]/i, // quero assassinar, qu3r0 4ss4ss1n4r
    /q[uúv][e3][r7][o0ø][ -]?me[ -]?[cçk][o0ø]rt[a@4][r3]/i, // quero me cortar, qu3r0 m3 c0rt4r
  ];

  let points = 0;

  sensitivePatterns.forEach((pattern) => {
    const matches = text.toLowerCase().match(pattern);
    if (matches) {
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
