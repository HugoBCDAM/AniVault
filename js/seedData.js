/**
 * AniVault - Catálogo Inicial con datos de muestra
 * Extraído y enriquecido directamente de los prototipos Stitch AI
 */
export const SEED_ANIMES = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    altTitle: "Ore dake Level Up na Ken",
    studio: "A-1 Pictures",
    genres: "Acción • Fantasía Oscura • Sobrenatural",
    status: "airing", // 'airing' | 'completed' | 'planning' | 'dropped'
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCriRVLl0E6Sxb_Q0ZLIfdPWCy2lm0e0BuUTYFJJTNHZXsu8MAlIRvjURe_ln_DAlTolF00yteSEBSQEcZ7uldFqdKR85kK_L1PNXuCikFTe1iGH1wGwA-xmKuLBg5m3ixjjh8YH7mXXlxQ-jOLnb_UC1ObEYq45Deuv3jJzUbpgOo44kXUpsn0fL88brlsQTuHVDkpQ_ug_N5RbruqJJMaRVL9Qp8IxBECXdgSOBk",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXf_fPvQPrSiNU8LNOTlTZNlvEYnNL5HXxV-FyiTKM4w8-tWxi7u01f4qRpp1hk_AUtLR0Bg3dO6s4NSkOlcWhW7UPDp8NPM5Mktzdm7VeFfAlG8SLYa5ahIax_BCysH8fz1RV8NIukBhT0CfPRmY3EYSRcv5GKOzdq1X24tSYKNvUgOMeaeVa4alC7yBRVV5FOhlu1RhiZ3vBEOgdRTyNjBSpT41dUsdq10sgjBg",
    rating: 9.4,
    favorite: true,
    notes: "Esperando con muchas ganas el arco de la isla Jeju en esta segunda temporada. Los efectos de sombras en el episodio 4 fueron brutales.",
    seasons: [
      { name: "Temporada 1", currentEp: 12, totalEps: 12, status: "completed" },
      { name: "Temporada 2: Arise from the Shadow", currentEp: 4, totalEps: 12, status: "airing" }
    ],
    movies: [
      {
        title: "ReAwakening",
        duration: "1h 45m",
        synopsis: "Recap T1 + Prólogo exclusivo T2",
        completed: true
      }
    ],
    ovasCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    altTitle: "Shingeki no Kyojin",
    studio: "WIT Studio • MAPPA",
    genres: "Acción • Misterio • Drama • Bélico",
    status: "completed",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCglMtVhVME-6fiAvymd5WXU8gnMh57uJAdIeYLDSecC5RZiSoxixGLNpmh4LKbz3t78ePG78fJDFUk3G21QCDNxZHp9EEnp-jw36JRz6wWCFiqAATK96lLkCvjJSuS0-ZNTl2AAjF7efzoyr6PSN_HrY3Gc3SWrdMOACwJIltmpceOGHe2uBofm1gfSudInKXey_If2CZK3SP5Gs_xWkErIMb3Bm6tRJ78z_dKU7Y",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCglMtVhVME-6fiAvymd5WXU8gnMh57uJAdIeYLDSecC5RZiSoxixGLNpmh4LKbz3t78ePG78fJDFUk3G21QCDNxZHp9EEnp-jw36JRz6wWCFiqAATK96lLkCvjJSuS0-ZNTl2AAjF7efzoyr6PSN_HrY3Gc3SWrdMOACwJIltmpceOGHe2uBofm1gfSudInKXey_If2CZK3SP5Gs_xWkErIMb3Bm6tRJ78z_dKU7Y",
    rating: 9.6,
    favorite: true,
    notes: "Una obra maestra narrativa de principio a fin. El retumbar y la resolución de Eren son inolvidables.",
    seasons: [
      { name: "Temporada 1", currentEp: 25, totalEps: 25, status: "completed" },
      { name: "Temporada 2", currentEp: 12, totalEps: 12, status: "completed" },
      { name: "Temporada 3", currentEp: 22, totalEps: 22, status: "completed" },
      { name: "Temporada Final", currentEp: 28, totalEps: 28, status: "completed" }
    ],
    movies: [
      { title: "Chronicle", duration: "2h 02m", synopsis: "Resumen de las temporadas 1 a 3", completed: true },
      { title: "The Last Attack", duration: "2h 25m", synopsis: "Capítulos finales en formato película", completed: true }
    ],
    ovasCount: 8,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    altTitle: "Chainsaw Man (MAPPA)",
    studio: "MAPPA",
    genres: "Acción • Gore • Sobrenatural • Comedia Oscura",
    status: "airing",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0Uz2s-YzgKZ6UZbZfneFnep0LGHZrWK5fFwaxhjSGd26KyB8b9KYPPHzp8QDGpnCv-0qhwyE3jEkvhXmq9tYWuhI9jUNKxfiu-okuYpTu14a88XVspTER_VlWFMo8uzGfU1YjjMmbNuRfgY7iAr6b8IY97km9GcFrrps0MOTJPpQEbZi_PgSNEAjY3GXzL-xhfGDRbHj5cWwha-KKBW__ybFZt1bRqKNGEdp45qg",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0Uz2s-YzgKZ6UZbZfneFnep0LGHZrWK5fFwaxhjSGd26KyB8b9KYPPHzp8QDGpnCv-0qhwyE3jEkvhXmq9tYWuhI9jUNKxfiu-okuYpTu14a88XVspTER_VlWFMo8uzGfU1YjjMmbNuRfgY7iAr6b8IY97km9GcFrrps0MOTJPpQEbZi_PgSNEAjY3GXzL-xhfGDRbHj5cWwha-KKBW__ybFZt1bRqKNGEdp45qg",
    rating: 8.9,
    favorite: false,
    notes: "Esperando el estreno en cines de la película del arco de Reze. Animación y banda sonora a otro nivel.",
    seasons: [
      { name: "Temporada 1", currentEp: 12, totalEps: 12, status: "completed" }
    ],
    movies: [
      { title: "Arco de Reze (Película)", duration: "Próximamente", synopsis: "En producción por MAPPA", completed: false }
    ],
    ovasCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    altTitle: "Sousou no Frieren",
    studio: "Madhouse",
    genres: "Fantasía • Aventura • Slice of Life • Drama",
    status: "completed",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCriRVLl0E6Sxb_Q0ZLIfdPWCy2lm0e0BuUTYFJJTNHZXsu8MAlIRvjURe_ln_DAlTolF00yteSEBSQEcZ7uldFqdKR85kK_L1PNXuCikFTe1iGH1wGwA-xmKuLBg5m3ixjjh8YH7mXXlxQ-jOLnb_UC1ObEYq45Deuv3jJzUbpgOo44kXUpsn0fL88brlsQTuHVDkpQ_ug_N5RbruqJJMaRVL9Qp8IxBECXdgSOBk",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCriRVLl0E6Sxb_Q0ZLIfdPWCy2lm0e0BuUTYFJJTNHZXsu8MAlIRvjURe_ln_DAlTolF00yteSEBSQEcZ7uldFqdKR85kK_L1PNXuCikFTe1iGH1wGwA-xmKuLBg5m3ixjjh8YH7mXXlxQ-jOLnb_UC1ObEYq45Deuv3jJzUbpgOo44kXUpsn0fL88brlsQTuHVDkpQ_ug_N5RbruqJJMaRVL9Qp8IxBECXdgSOBk",
    rating: 9.7,
    favorite: true,
    notes: "Tratamiento del paso del tiempo y la nostalgia insuperable. El examen de mago de primera clase tiene combates espectaculares.",
    seasons: [
      { name: "Temporada 1", currentEp: 28, totalEps: 28, status: "completed" }
    ],
    movies: [],
    ovasCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    altTitle: "Sorcery Fight",
    studio: "MAPPA",
    genres: "Acción • Sobrenatural • Demonios",
    status: "airing",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbm5TWl7xQIUGG5lA96ZN-q3H7jLhw8f8IhfigdAPWJP-B2rrNnqUve-ohBgkMBJZ0ckhosXFLz8vz7ZzR2xuDxEdkcADnGwyK40dG2E0XX_W7uqmcuC73SYGiIxkBxDch_itnZtTlGuw6shtZIo2JFxjVAtFRhv-7YeA1l_veIlkvRfv4KZgSYIfrTgAx0fK-QeGv-9-ksdcr_RQWbwd1aY0a-8WpqjaVRdpg7Lo",
    bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbm5TWl7xQIUGG5lA96ZN-q3H7jLhw8f8IhfigdAPWJP-B2rrNnqUve-ohBgkMBJZ0ckhosXFLz8vz7ZzR2xuDxEdkcADnGwyK40dG2E0XX_W7uqmcuC73SYGiIxkBxDch_itnZtTlGuw6shtZIo2JFxjVAtFRhv-7YeA1l_veIlkvRfv4KZgSYIfrTgAx0fK-QeGv-9-ksdcr_RQWbwd1aY0a-8WpqjaVRdpg7Lo",
    rating: 9.2,
    favorite: true,
    notes: "El incidente de Shibuya es uno de los arcos más intensos de la historia del shonen.",
    seasons: [
      { name: "Temporada 1", currentEp: 24, totalEps: 24, status: "completed" },
      { name: "Temporada 2: Shibuya Incident", currentEp: 23, totalEps: 23, status: "completed" },
      { name: "Temporada 3: Culling Game", currentEp: 0, totalEps: 24, status: "planning" }
    ],
    movies: [
      { title: "Jujutsu Kaisen 0", duration: "1h 45m", synopsis: "Historia de Yuta Okkotsu", completed: true }
    ],
    ovasCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
  }
];

export const DEFAULT_USER = {
  username: 'Alexander "Kage" Vance',
  email: 'alexander.vance@gmail.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbm5TWl7xQIUGG5lA96ZN-q3H7jLhw8f8IhfigdAPWJP-B2rrNnqUve-ohBgkMBJZ0ckhosXFLz8vz7ZzR2xuDxEdkcADnGwyK40dG2E0XX_W7uqmcuC73SYGiIxkBxDch_itnZtTlGuw6shtZIo2JFxjVAtFRhv-7YeA1l_veIlkvRfv4KZgSYIfrTgAx0fK-QeGv-9-ksdcr_RQWbwd1aY0a-8WpqjaVRdpg7Lo',
  levelTitle: 'Nivel 24 · Otaku Curator',
  isGoogleConnected: true,
  lastSync: new Date().toISOString()
};
