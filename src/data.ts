export const salars = [
  { id: 'arizaro', name: 'Salar de Arizaro', coords: [-67.72, -24.93] as [number, number], surface: '1.600', basin: 'Sistema Arizaro', altitude: '3.720', projects: 3, communities: 12 },
  { id: 'rincon', name: 'Salar del Rincón', coords: [-67.10, -24.10] as [number, number], surface: '260', basin: 'Sistema Rincón', altitude: '3.740', projects: 2, communities: 5 },
  { id: 'cauchari', name: 'Salar de Cauchari', coords: [-66.88, -23.62] as [number, number], surface: '550', basin: 'Sistema Cauchari', altitude: '3.950', projects: 4, communities: 8 },
  { id: 'olaroz', name: 'Salar de Olaroz', coords: [-66.70, -23.43] as [number, number], surface: '120', basin: 'Sistema Olaroz', altitude: '3.900', projects: 2, communities: 6 },
  { id: 'pocitos', name: 'Salar de Pocitos', coords: [-67.02, -24.45] as [number, number], surface: '435', basin: 'Sistema Pocitos', altitude: '3.660', projects: 1, communities: 7 },
]

export const projects = [
  { name: 'Rincón', coords: [-67.03, -24.04], stage: 'Operación' },
  { name: 'Cauchari-Olaroz', coords: [-66.77, -23.57], stage: 'Operación' },
  { name: 'Sal de Vida', coords: [-66.63, -24.37], stage: 'Construcción' },
  { name: 'Tres Quebradas', coords: [-67.98, -25.23], stage: 'Construcción' },
  { name: 'Arizaro', coords: [-67.67, -24.86], stage: 'Exploración' },
  { name: 'Pocitos', coords: [-67.00, -24.40], stage: 'Exploración' },
]

export const precipitation = [310, 420, 350, 390, 365, 430, 395, 450, 510, 380, 365, 450, 335, 350, 415, 400, 365, 470, 480, 420, 510, 295, 360, 315, 265]
export const years = Array.from({ length: 25 }, (_, i) => 2002 + i)

export const spiRows = [
  [0.4, -0.8, -1.2, -0.5, 0.3, -0.9, -1.5, -0.7, 0.4, 1.0, 0.7, -0.3],
  [0.2, -0.4, -1.7, -1.1, -0.8, -0.2, 0.6, 1.2, 0.4, -0.6, -0.9, 0.3],
  [-0.5, 0.8, 0.4, -0.3, -1.4, -1.8, -0.7, 0.2, 0.7, 0.1, -0.6, -0.3],
  [1.2, 0.6, -0.2, -0.6, 0.1, 0.8, -0.4, -1.2, -0.8, 0.3, 0.5, 1.1],
  [-0.8, -0.4, 0.6, 1.5, 1.1, 0.7, 0.1, -0.5, -0.9, -0.3, 0.4, 0.8],
  [-1.1, -0.7, 0.3, 0.5, -0.2, -1.3, -1.6, -0.5, 0.7, 1.4, 0.8, -0.1],
]

export const ndvi = Array.from({ length: 49 }, (_, i) => {
  const x = 2002 + i / 2
  const base = 0.31 + Math.sin(i * 0.48) * 0.075 + Math.sin(i * 0.13) * 0.035
  const pulse = i > 20 && i < 29 ? 0.08 : 0
  return [Number(x.toFixed(1)), Number((base + pulse - i * 0.0012).toFixed(3))]
})

export const grace = Array.from({ length: 45 }, (_, i) => {
  const x = 2004 + i / 2
  const y = 5 + Math.sin(i * .39) * 8 - i * .45 + (i > 29 ? (i - 29) * 1.2 : 0)
  return [Number(x.toFixed(1)), Number(y.toFixed(1))]
})

export const communitiesGeo = {
  type: 'FeatureCollection',
  features: [
    [-66.94, -24.79], [-67.31, -24.52], [-66.81, -23.98], [-67.42, -23.79], [-66.98, -23.52], [-67.56, -25.03], [-67.88, -24.62], [-66.67, -24.21]
  ].map((coords, i) => ({ type: 'Feature', properties: { name: `Comunidad ${i + 1}` }, geometry: { type: 'Point', coordinates: coords } }))
}

export const salarsGeo = {
  type: 'FeatureCollection',
  features: salars.map(s => ({ type: 'Feature', properties: { id: s.id, name: s.name }, geometry: { type: 'Point', coordinates: s.coords } }))
}

export const projectsGeo = {
  type: 'FeatureCollection',
  features: projects.map(p => ({ type: 'Feature', properties: p, geometry: { type: 'Point', coordinates: p.coords } }))
}
