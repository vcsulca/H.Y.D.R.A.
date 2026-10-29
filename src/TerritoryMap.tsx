import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { salarsGeo, projectsGeo, communitiesGeo } from './data'

type Props = {
  mode: '2d' | '3d'
  base: 'satellite' | 'dark' | 'terrain'
  layers: Record<string, boolean>
  onSelect: (id: string) => void
  onReady?: (map: maplibregl.Map) => void
}

const province = {
  type: 'FeatureCollection',
  features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-67.9,-22.8],[-65.8,-22.3],[-64.1,-23.2],[-63.9,-24.7],[-64.8,-25.8],[-66.4,-25.5],[-67.1,-24.7],[-68.2,-24.4],[-68.3,-23.5],[-67.9,-22.8]]] } }]
}

type PointSource = {
  features: Array<{
    properties: Record<string, unknown>
    geometry: { coordinates: number[] }
  }>
}

function extrudedPoints(source: PointSource, radius: number, height: number) {
  return {
    type: 'FeatureCollection',
    features: source.features.map((feature, index) => {
      const [longitude, latitude] = feature.geometry.coordinates as [number, number]
      const coordinates = Array.from({ length: 17 }, (_, point) => {
        const angle = (point / 16) * Math.PI * 2
        return [longitude + Math.cos(angle) * radius, latitude + Math.sin(angle) * radius]
      })
      return {
        type: 'Feature',
        properties: { ...feature.properties, height: height + index * 45 },
        geometry: { type: 'Polygon', coordinates: [coordinates] }
      }
    })
  }
}

export default function TerritoryMap({ mode, base, layers, onSelect, onReady }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect

  useEffect(() => {
    if (!container.current) return
    maplibregl.setWorkerUrl('/assets/maplibre-gl-worker.mjs')
    const map = new maplibregl.Map({
      container: container.current,
      style: {
        version: 8,
        sources: {
          satellite: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 18, attribution: 'Esri, Maxar, Earthstar Geographics' },
          dark: { type: 'raster', tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'], tileSize: 256, maxzoom: 19, attribution: '© OpenStreetMap © CARTO' },
          terrainSource: { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'], encoding: 'terrarium', tileSize: 256, maxzoom: 15, attribution: 'Mapzen / AWS Open Data' }
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#0b0d12' } },
          { id: 'dark', type: 'raster', source: 'dark', layout: { visibility: 'none' }, paint: { 'raster-opacity': .85 } },
          { id: 'satellite', type: 'raster', source: 'satellite', paint: { 'raster-saturation': -.25, 'raster-brightness-max': .75 } }
        ]
      },
      center: [-66.9, -24.25], zoom: 6.25, pitch: 68, bearing: -12, attributionControl: false
    })
    mapRef.current = map
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.touchPitch.disable()
    map.on('load', () => {
      map.addSource('province', { type: 'geojson', data: province as any })
      map.addLayer({ id: 'province-fill', type: 'fill', source: 'province', paint: { 'fill-color': '#a63858', 'fill-opacity': .05 } })
      map.addLayer({ id: 'province-line', type: 'line', source: 'province', paint: { 'line-color': '#db416c', 'line-width': 2, 'line-dasharray': [2, 1] } })
      const basins = { type: 'FeatureCollection', features: [
        [[-68.05,-25.35],[-66.85,-25.2],[-66.65,-24.45],[-67.55,-24.2],[-68.1,-24.75]],
        [[-67.65,-24.5],[-66.25,-24.45],[-66.35,-23.75],[-67.35,-23.7]],
        [[-67.45,-23.9],[-66.2,-24.0],[-66.1,-23.0],[-67.1,-22.95]]
      ].map((ring, i) => ({ type: 'Feature', properties: { id: i }, geometry: { type: 'Polygon', coordinates: [ring.concat([ring[0]])] } })) }
      map.addSource('basins', { type: 'geojson', data: basins as any })
      map.addLayer({ id: 'basins-fill', type: 'fill', source: 'basins', paint: { 'fill-color': ['match', ['get', 'id'], 0, '#49b9c5', 1, '#8b5cf6', '#d1a46a'], 'fill-opacity': .13 } })
      map.addLayer({ id: 'basins-line', type: 'line', source: 'basins', paint: { 'line-color': '#9ac8c8', 'line-width': 1, 'line-opacity': .65 } })
      map.addLayer({ id: 'basins-extrusion', type: 'fill-extrusion', source: 'basins', layout: { visibility: 'none' }, paint: { 'fill-extrusion-color': ['match', ['get', 'id'], 0, '#49b9c5', 1, '#8b5cf6', '#d1a46a'], 'fill-extrusion-height': 4200, 'fill-extrusion-base': 0, 'fill-extrusion-opacity': .34, 'fill-extrusion-vertical-gradient': true } })
      map.addSource('salars', { type: 'geojson', data: salarsGeo as any })
      map.addLayer({ id: 'salar-halo', type: 'circle', source: 'salars', paint: { 'circle-radius': 8, 'circle-color': '#d93d68', 'circle-opacity': .2, 'circle-stroke-width': 1, 'circle-stroke-color': '#ef6085' } })
      map.addLayer({ id: 'salars', type: 'circle', source: 'salars', paint: { 'circle-radius': 3.5, 'circle-color': '#f4dce4', 'circle-stroke-color': '#d93d68', 'circle-stroke-width': 2 } })
      map.addLayer({ id: 'salar-labels', type: 'symbol', source: 'salars', layout: { 'text-field': ['get', 'name'], 'text-font': ['Open Sans Regular'], 'text-size': 11, 'text-offset': [0, 1.6], 'text-anchor': 'top' }, paint: { 'text-color': '#f5f0ed', 'text-halo-color': '#111117', 'text-halo-width': 2 } })
      map.addSource('salar-3d', { type: 'geojson', data: extrudedPoints(salarsGeo, .085, 5200) as any })
      map.addLayer({ id: 'salar-3d', type: 'fill-extrusion', source: 'salar-3d', layout: { visibility: 'none' }, paint: { 'fill-extrusion-color': '#d93d68', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': 0, 'fill-extrusion-opacity': .42, 'fill-extrusion-vertical-gradient': true } })
      map.addSource('projects', { type: 'geojson', data: projectsGeo as any })
      map.addLayer({ id: 'projects', type: 'circle', source: 'projects', paint: { 'circle-radius': 5, 'circle-color': '#d1a46a', 'circle-stroke-color': '#25190c', 'circle-stroke-width': 1.5 } })
      map.addSource('projects-3d', { type: 'geojson', data: extrudedPoints(projectsGeo, .06, 3600) as any })
      map.addLayer({ id: 'projects-3d', type: 'fill-extrusion', source: 'projects-3d', layout: { visibility: 'none' }, paint: { 'fill-extrusion-color': '#d1a46a', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': 0, 'fill-extrusion-opacity': .48, 'fill-extrusion-vertical-gradient': true } })
      map.addSource('communities', { type: 'geojson', data: communitiesGeo as any })
      map.addLayer({ id: 'communities', type: 'circle', source: 'communities', paint: { 'circle-radius': 3.5, 'circle-color': '#e9b9ca', 'circle-stroke-color': '#f5f0ed', 'circle-stroke-width': .7 } })
      map.addSource('communities-3d', { type: 'geojson', data: extrudedPoints(communitiesGeo, .04, 2400) as any })
      map.addLayer({ id: 'communities-3d', type: 'fill-extrusion', source: 'communities-3d', layout: { visibility: 'none' }, paint: { 'fill-extrusion-color': '#ef9b4a', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': 0, 'fill-extrusion-opacity': .5, 'fill-extrusion-vertical-gradient': true } })
      const auxiliary = {
        vegetation: { type: 'FeatureCollection', features: [[-67.45,-24.82],[-67.2,-24.72],[-66.91,-24.18],[-67.6,-24.98],[-66.72,-23.84]].map((coordinates:any) => ({type:'Feature',properties:{},geometry:{type:'Point',coordinates}})) },
        stations: { type: 'FeatureCollection', features: [[-65.41,-24.79],[-66.85,-24.72],[-67.5,-24.1]].map((coordinates:any) => ({type:'Feature',properties:{},geometry:{type:'Point',coordinates}})) },
        water: { type: 'FeatureCollection', features: [{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[-67.9,-24.8],[-67.4,-24.7],[-67.1,-24.5],[-66.9,-24.3],[-66.8,-24.0]]}}] }
      }
      Object.entries(auxiliary).forEach(([key,data]) => map.addSource(key,{type:'geojson',data:data as any}))
      map.addLayer({id:'vegetation',type:'circle',source:'vegetation',layout:{visibility:'visible'},paint:{'circle-radius':9,'circle-color':'#ef9b4a','circle-opacity':.45,'circle-stroke-color':'#ffd08a','circle-stroke-width':1}})
      map.addLayer({id:'stations',type:'circle',source:'stations',layout:{visibility:'none'},paint:{'circle-radius':5,'circle-color':'#f5f0ed','circle-stroke-color':'#34363e','circle-stroke-width':2}})
      map.addLayer({id:'water',type:'line',source:'water',layout:{visibility:'none'},paint:{'line-color':'#49b9c5','line-width':2,'line-opacity':.85}})
      map.setTerrain({ source: 'terrainSource', exaggeration: 2.8 })
      map.on('click', 'salars', e => { const id = e.features?.[0]?.properties?.id; if (id) selectRef.current(id) })
      map.on('click', 'salar-3d', e => { const id = e.features?.[0]?.properties?.id; if (id) selectRef.current(id) })
      map.on('mouseenter', 'salars', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'salars', () => { map.getCanvas().style.cursor = '' })
      if (mode === '3d') {
        map.dragRotate.enable()
        map.touchZoomRotate.enableRotation()
        map.touchPitch.enable()
        map.setTerrain({ source: 'terrainSource', exaggeration: 2.8 })
        ;['basins-extrusion', 'salar-3d', 'projects-3d', 'communities-3d'].forEach(id => map.setLayoutProperty(id, 'visibility', 'visible'))
        ;['basins-fill', 'salar-halo', 'salars', 'projects', 'communities'].forEach(id => map.setLayoutProperty(id, 'visibility', 'none'))
      }
      onReady?.(map)
    })
    return () => map.remove()
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (mode === '3d') {
      map.dragRotate.enable()
      map.touchZoomRotate.enableRotation()
      map.touchPitch.enable()
    } else {
      map.dragRotate.disable()
      map.touchZoomRotate.disableRotation()
      map.touchPitch.disable()
    }
    map.easeTo({ pitch: mode === '3d' ? 68 : 0, bearing: mode === '3d' ? -12 : 0, duration: 550 })
    map.setTerrain(mode === '3d' ? { source: 'terrainSource', exaggeration: 2.8 } : null)
    const threeDimensionalLayers = ['basins-extrusion', 'salar-3d', 'projects-3d', 'communities-3d']
    const flatLayers = ['basins-fill', 'salar-halo', 'salars', 'projects', 'communities']
    threeDimensionalLayers.forEach(id => map.setLayoutProperty(id, 'visibility', mode === '3d' ? 'visible' : 'none'))
    flatLayers.forEach(id => map.setLayoutProperty(id, 'visibility', mode === '3d' ? 'none' : 'visible'))
  }, [mode])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    map.setLayoutProperty('satellite', 'visibility', base === 'satellite' || base === 'terrain' ? 'visible' : 'none')
    map.setLayoutProperty('dark', 'visibility', base === 'dark' ? 'visible' : 'none')
    map.setPaintProperty('satellite', 'raster-saturation', base === 'terrain' ? -1 : -.25)
  }, [base])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const ids: Record<string, string[]> = { salta: ['province-fill', 'province-line'], cuencas: ['basins-fill', 'basins-line', 'basins-extrusion'], salares: ['salars', 'salar-halo', 'salar-labels', 'salar-3d'], proyectos: ['projects', 'projects-3d'], comunidades: ['communities', 'communities-3d'], vegetacion: ['vegetation'], estaciones: ['stations'], red: ['water'] }
    Object.entries(ids).forEach(([key, value]) => value.forEach(id => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', layers[key] ? 'visible' : 'none') }))
  }, [layers])

  return <div className="map-canvas" ref={container} aria-label="Mapa interactivo de la Puna salteña" />
}
