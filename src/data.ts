// Fuente: USGS 2020 (salares) y COHIFE (cuencas), procesados en analisis-hidrico-triangulo-litio.
// surface = km² (polígono USGS). altitude / projects / communities: 's/d' = sin dato en el análisis todavía.
export const salars = [
  { id: 'arizaro', name: 'Salar de Arizaro', coords: [-67.79, -24.72] as [number, number], surface: '1.993', basin: 'Salar de Arizaro', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'pocitos', name: 'Salar de Pocitos', coords: [-67.06, -24.53] as [number, number], surface: '665', basin: 'Salar de Pocitos o Quirón', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'rincon', name: 'Salar del Rincón', coords: [-67.12, -24.01] as [number, number], surface: '675', basin: 'Salar de Rincón', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'centenario', name: 'Salar de Centenario', coords: [-66.75, -24.9] as [number, number], surface: '88', basin: 'Cuencas endorreicas en Salta', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'diablillos', name: 'Salar de Diablillos', coords: [-66.74, -25.26] as [number, number], surface: '42', basin: 'Cuencas endorreicas en Salta y Catamarca', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'pozuelos', name: 'Salar de Pozuelos', coords: [-66.81, -24.71] as [number, number], surface: '86', basin: 'Salar de Pozuelos', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'ratones', name: 'Salar de Ratones', coords: [-66.8, -25.12] as [number, number], surface: '53', basin: 'Cuencas endorreicas en Salta', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'rio-grande', name: 'Salar de Río Grande', coords: [-68.14, -25.14] as [number, number], surface: '181', basin: 'Salar de Río Grande', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'tolillar', name: 'Salar Tolillar', coords: [-67.11, -25.1] as [number, number], surface: '45', basin: 'Cuencas endorreicas en Salta', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'pastos-grandes', name: 'Salar Pastos Grandes', coords: [-66.69, -24.57] as [number, number], surface: '34', basin: 'Salar de Pastos Grandes', altitude: 's/d', projects: 's/d', communities: 's/d' },
  { id: 'tolar-grande', name: 'Salar Tolar Grande', coords: [-67.39, -24.63] as [number, number], surface: '14', basin: 'Cuencas endorreicas en Salta', altitude: 's/d', projects: 's/d', communities: 's/d' },
]

const IMG = '/assets/images/'

export const salarImages: Record<string, string> = {
  arizaro: `${IMG}Salar_de_Arizaro.jpg`,
  pocitos: `${IMG}Salar_de_Pocitos.jpg`,
  rincon: `${IMG}Salar_del_Rincon.jpg`,
  centenario: `${IMG}Salar_de_Centenario.jpg`,
  diablillos: `${IMG}Salar_de_Diablillos.jpg`,
  pozuelos: `${IMG}Salar_de_Pozuelos.jpg`,
  ratones: `${IMG}Salar_de_Ratones.jpg`,
  'rio-grande': `${IMG}Salar_de_Rio_Grande.jpg`,
  tolillar: `${IMG}Salar_de_Tolillar.jpg`,
  'pastos-grandes': `${IMG}Salar_Pastos_Grandes.jpg`,
  'tolar-grande': `${IMG}Tolar_Grande_Salar.jpg`,
}
export const defaultSalarImage = '/puna-montanas.jpg'

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