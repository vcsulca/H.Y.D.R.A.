# H.Y.D.R.A

Prototipo frontend del Observatorio Hidroclimático y Territorial de la Puna salteña.

## Ejecutar

```bash
npm install
npm run dev
```

Compilación de producción:

```bash
npm run build
npm run preview
```

## Incluye

- Mapa MapLibre con imagen satelital, relieve 2D/3D y capas activables.
- Búsqueda y selección de salares, ficha territorial y filtros temporales.
- Visualizaciones ECharts de precipitación, SPI-6, NDVI, proyectos, cuencas y GRACE.
- Exportación CSV, tema claro/oscuro y diseño adaptable.

## Alcance de los datos

Las cifras, geometrías y series son ilustrativas y están señaladas como demostración. No constituyen resultados científicos ni un inventario oficial. La aplicación es frontend-only y no requiere una base de datos.

## Cartografía

La interfaz atribuye en el propio mapa los recursos utilizados: Esri/Maxar/Earthstar Geographics (imaginería), OpenStreetMap/CARTO (base oscura) y Mapzen/AWS Open Data (elevación). Las imágenes de la ficha y portada derivan del mockup proporcionado por el usuario.
