import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { Home, Map, BarChart3, Leaf, Mountain, Users, BookOpen, Database, Download, Search, Moon, Sun, Layers3, Plus, Minus, LocateFixed, RotateCw, ArrowRight, CloudRain, Droplets, Waves, ChevronDown, ExternalLink, Menu, Info, FileText, Check } from 'lucide-react'
import TerritoryMap from './TerritoryMap'
import { salars, precipitation, years, spiRows, ndvi, grace } from './data'
import './App.css'

const colors = { text: '#f5f0ed', secondary: '#a6a9b2', grid: '#292b33', burgundy: '#a63858', water: '#49b9c5', green: '#76b899', gold: '#d1a46a' }
const tooltip = { backgroundColor: '#202229', borderColor: '#3a3d46', textStyle: { color: colors.text, fontSize: 12 }, extraCssText: 'box-shadow:0 8px 30px #0008;border-radius:8px;' }
const axis = { axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.secondary, fontSize: 10, fontFamily: 'JetBrains Mono' }, splitLine: { lineStyle: { color: colors.grid, type: 'dashed' as const } } }

function downloadFile(name: string, content: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
}

function Logo() {
  return <img src="/assets/Logo_Salta.svg" alt="Agua en Salta" className="brand-mark" />
}

type ModalKind = 'project' | 'method' | 'downloads' | 'open' | 'communities' | null

export default function App() {
  const [mode, setMode] = useState<'2d' | '3d'>('3d')
  const [base, setBase] = useState<'satellite' | 'dark' | 'terrain'>('satellite')
  const [layers, setLayers] = useState<Record<string, boolean>>({ salta: true, cuencas: true, salares: true, proyectos: true, comunidades: true, vegetacion: true, estaciones: false, red: false })
  const [selected, setSelected] = useState('arizaro')
  const [activeNav, setActiveNav] = useState('Inicio')
  const [activeTab, setActiveTab] = useState('Resumen')
  const [period, setPeriod] = useState(2026)
  const [light, setLight] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [modal, setModal] = useState<ModalKind>(null)
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [layersOpen, setLayersOpen] = useState(true)
  const [precipScope, setPrecipScope] = useState('Provincia')
  const [spiScope, setSpiScope] = useState('Cuenca seleccionada')
  const mapRef = useRef<any>(null)
  const salar = salars.find(s => s.id === selected) || salars[0]
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setModal(null); setSearchOpen(false); setDownloadOpen(false); setMobileMenu(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const results = useMemo(() => salars.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.basin.toLowerCase().includes(search.toLowerCase())), [search])

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const goTo = (label: string, id?: string) => {
    setActiveNav(label); setMobileMenu(false)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (label === 'Comunidades') setModal('communities')
    if (label === 'Monitoreo y evidencia' || label === 'Metodología') setModal('method')
    if (label === 'Descargas') setModal('downloads')
  }
  const selectSalar = (id: string) => { setSelected(id); setActiveTab('Resumen'); setSearchOpen(false); setSearch('') }
  const exportCsv = (name = 'agua-en-salta-precipitacion') => { downloadFile(`${name}.csv`, `anio,precipitacion_mm\n${years.filter(y => y <= period).map((y) => `${y},${precipitation[years.indexOf(y)]}`).join('\n')}`); notify('Archivo CSV descargado') }
  const visibleYears = years.filter(y => y <= period)
  const visiblePrecipitation = precipitation.slice(0, visibleYears.length)
  const chartAxis = light
    ? { ...axis, axisLabel: { ...axis.axisLabel, color: '#514936' }, axisLine: { lineStyle: { color: '#b8aa78' } }, splitLine: { lineStyle: { color: '#b8aa78', type: 'dashed' as const } } }
    : axis

  const precipOption: EChartsOption = {
    animationDuration: 450, tooltip: { ...tooltip, trigger: 'axis', valueFormatter: v => `${v} mm` }, grid: { left: 36, right: 10, top: 12, bottom: 25 },
    xAxis: { type: 'category', data: visibleYears, ...chartAxis, axisLabel: { ...chartAxis.axisLabel, interval: 2 } }, yAxis: { type: 'value', ...chartAxis, max: 600 },
    series: [{ type: 'bar', data: visiblePrecipitation.map((v, i) => i === 24 ? { value: v, itemStyle: { color: colors.gold } } : v), barWidth: '58%', itemStyle: { color: colors.water, borderRadius: [2, 2, 0, 0] }, emphasis: { itemStyle: { color: '#83d9df' } } }]
  }
  const spiData = spiRows.flatMap((row, y) => row.map((v, m) => [m, y, v]))
  const spiOption: EChartsOption = {
    tooltip: { ...tooltip, formatter: (p: any) => `${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][p.value[0]]} ${2022 - p.value[1]}<br/>SPI-6: <b>${p.value[2]}</b>` },
    grid: { left: 34, right: 8, top: 5, bottom: 35 }, xAxis: { type: 'category', data: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], ...chartAxis, splitLine: { show: false }, axisLabel: { ...chartAxis.axisLabel, fontSize: 9 } }, yAxis: { type: 'category', inverse: true, data: ['2022','2021','2020','2019','2018','2017'], ...chartAxis, splitLine: { show: false } },
    visualMap: { min: -2, max: 2, show: false, inRange: { color: ['#9c294c', '#d57d83', '#ead6cc', '#77b9c7', '#276d8a'] } },
    series: [{ type: 'heatmap', data: spiData, itemStyle: { borderColor: '#111319', borderWidth: 2, borderRadius: 2 }, emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 1 } } }]
  }
  const ndviOption: EChartsOption = {
    tooltip: { ...tooltip, trigger: 'axis', valueFormatter: v => Number(v).toFixed(3) }, grid: { left: 34, right: 10, top: 10, bottom: 24 },
    xAxis: { type: 'value', min: 2002, max: period, ...chartAxis, axisLabel: { ...chartAxis.axisLabel, formatter: v => String(Math.round(v)) } }, yAxis: { type: 'value', min: 0, max: .8, ...chartAxis },
    series: [{ name: 'NDVI medio', type: 'line', data: ndvi.filter(d => d[0] <= period), showSymbol: false, smooth: .25, lineStyle: { color: colors.green, width: 1.8 }, areaStyle: { color: 'rgba(118,184,153,.06)' } }, { name: 'Tendencia', type: 'line', data: [[2002,.33],[2026,.30]], showSymbol: false, lineStyle: { color: '#b7c4bc', width: 1, type: 'dashed' } }]
  }
  const donutOption: EChartsOption = {
    tooltip: { ...tooltip, formatter: '{b}: {c} proyectos' }, series: [{ type: 'pie', radius: ['54%','78%'], center: ['30%','50%'], label: { show: false }, itemStyle: { borderColor: '#111318', borderWidth: 4 }, data: [{ value: 6, name: 'Exploración', itemStyle: { color: colors.gold } }, { value: 4, name: 'Construcción', itemStyle: { color: '#d47768' } }, { value: 2, name: 'Operación', itemStyle: { color: colors.burgundy } }] }]
  }
  const compareOption: EChartsOption = {
    tooltip: { ...tooltip, trigger: 'axis', valueFormatter: v => `${v}%` }, grid: { left: 72, right: 36, top: 5, bottom: 5 },
    xAxis: { type: 'value', show: false, max: 50 }, yAxis: { type: 'category', inverse: true, data: ['Sist. Arizaro','Sist. Cauchari','Sist. Olaroz','Sist. Rincón','Otras cuencas'], ...chartAxis, splitLine: { show: false }, axisLabel: { ...chartAxis.axisLabel, fontSize: 10, fontFamily: 'Space Grotesk' } },
    series: [{ type: 'bar', data: [42,36,28,24,18].map((v,i) => ({ value: v, itemStyle: { color: i === 0 ? colors.burgundy : i === 1 ? '#c77f8e' : '#7c808a' }, label: { show: true, position: 'right', formatter: '{c}%', color: colors.text, fontSize: 10 } })), barWidth: 10, showBackground: true, backgroundStyle: { color: '#25272d' } }]
  }
  const graceOption: EChartsOption = {
    tooltip: { ...tooltip, trigger: 'axis', valueFormatter: v => `${v} cm` }, grid: { left: 34, right: 10, top: 10, bottom: 24 },
    xAxis: { type: 'value', min: 2004, max: Math.max(2005, Math.min(2026, period)), ...chartAxis, axisLabel: { ...chartAxis.axisLabel, formatter: v => String(Math.round(v)) } }, yAxis: { type: 'value', min: -40, max: 20, ...chartAxis },
    series: [{ type: 'line', data: grace.filter(d => d[0] <= period), showSymbol: false, smooth: .2, lineStyle: { color: '#80c7d4', width: 1.7 }, areaStyle: { color: 'rgba(73,185,197,.13)' }, markLine: { silent: true, symbol: 'none', label: { show: false }, lineStyle: { color: '#777b83', width: .7 }, data: [{ yAxis: 0 }] } }]
  }

  const nav = [
    ['Inicio', Home, 'inicio'], ['Explorador territorial', Map, 'explorador'], ['Hidroclima', BarChart3, 'hidroclima'], ['Ecosistemas', Leaf, 'ecosistemas'], ['Territorio y litio', Mountain, 'territorio'], ['Comunidades', Users], ['Monitoreo y evidencia', BookOpen], ['Metodología', Database], ['Descargas', Download]
  ] as const

  return <div className={light ? 'app light' : 'app'}>
    <header className="topbar">
      <button className="mobile-menu icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir navegación"><Menu size={20}/></button>
      <a className="brand" href="#inicio" onClick={() => goTo('Inicio','inicio')}><Logo/><span><strong>AGUA EN SALTA</strong><small>OBSERVATORIO HIDROCLIMÁTICO Y TERRITORIAL</small></span></a>
      <div className="search-wrap">
        <Search size={15}/><input value={search} onFocus={() => setSearchOpen(true)} onChange={e => {setSearch(e.target.value);setSearchOpen(true)}} placeholder="Buscar cuenca, salar, comunidad o proyecto..." aria-label="Buscar territorio"/>
        {searchOpen && <div className="search-results">{results.length ? results.map(s => <button key={s.id} onClick={() => selectSalar(s.id)}><Map size={14}/><span>{s.name}<small>{s.basin}</small></span><ArrowRight size={14}/></button>) : <p>No se encontraron territorios.</p>}<button className="search-close" onClick={() => setSearchOpen(false)}>Cerrar</button></div>}
      </div>
      <div className="period"><label>PERÍODO DE ESTUDIO</label><div><span>2002</span><input type="range" min="2002" max="2026" value={period} onChange={e => setPeriod(+e.target.value)} aria-label="Año final del período"/><strong>{period}</strong></div></div>
      <div className="header-actions">
        <div className="download-wrap"><button className="icon-button" onClick={() => setDownloadOpen(!downloadOpen)} aria-label="Descargar datos"><Download size={19}/></button>{downloadOpen && <div className="mini-menu"><button onClick={() => {exportCsv();setDownloadOpen(false)}}>Series en CSV</button><button onClick={() => {setModal('downloads');setDownloadOpen(false)}}>Centro de descargas</button></div>}</div>
        <button className="icon-button" onClick={() => {mapRef.current?.fitBounds([[-68.4,-25.8],[-63.7,-22.2]],{padding:35});notify('Vista centrada en Salta')}} aria-label="Encuadrar provincia"><Map size={19}/></button>
        <button className="icon-button" onClick={() => setLight(!light)} aria-label="Cambiar tema">{light ? <Moon size={18}/> : <Sun size={18}/>}</button>
        <button className="open-data" onClick={() => setModal('open')}><Users size={15}/> Datos abiertos</button>
      </div>
    </header>

    <aside className={mobileMenu ? 'sidebar open' : 'sidebar'}>
      <nav>{nav.map(([label, Icon, id]) => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => goTo(label,id)}><Icon size={17}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-story"><div className="story-image"/><div className="story-copy"><p>El agua<br/>de la Puna<br/>con datos,<br/>para decisiones<br/>informadas.</p><button onClick={() => setModal('project')}>Conocer el proyecto <ArrowRight size={15}/></button></div></div>
      <div className="demo-badge"><span/> PROTOTIPO · DATOS DEMO</div>
    </aside>

    <main id="inicio">
      <section className="kpis" aria-label="Indicadores territoriales">
        {[['CUENCAS','28','intersectan Salta','basin'],['SALARES','34','polígonos cartografiados','salar'],['COMUNIDADES','299','puntos georreferenciados','community'],['PROYECTOS DE LITIO','12*','registros ilustrativos','project'],['VEGAS Y HUMEDALES','221','polígonos de vegetación','wetland']].map(([label,value,desc,kind]) => <button className="kpi" key={label} onClick={() => notify(`${label}: cifra de demostración del mockup`)}><div><small>{label}</small><strong>{value}</strong><p>{desc}</p></div><span className={`kpi-art ${kind}`}>{kind === 'community' ? <Users/> : kind === 'project' ? <Mountain/> : kind === 'wetland' ? <Leaf/> : <svg viewBox="0 0 50 50"><path d="M13 5 28 3l8 7 9 5-2 13 4 8-12 9-13-2-8 3-9-11 3-11-3-9Z"/></svg>}</span></button>)}
      </section>

      <section className="explorer-grid" id="explorador">
        <div className="map-panel">
          <div className="map-toolbar"><div className="segmented"><button className={mode==='2d'?'selected':''} onClick={() => setMode('2d')}>Mapa 2D</button><button className={mode==='3d'?'selected':''} onClick={() => setMode('3d')}>Mapa 3D</button><button className={base==='satellite'?'selected':''} onClick={() => setBase('satellite')}>Satélite</button><button className={base==='terrain'?'selected':''} onClick={() => setBase('terrain')}>Terreno</button></div><span className="map-status"><i/> {mode === '3d' ? 'Rota 360° · arrastra para explorar' : 'Vista interactiva'}</span></div>
          <TerritoryMap mode={mode} base={base} layers={layers} onSelect={selectSalar} onReady={m => mapRef.current = m}/>
          <div className="map-zoom"><button onClick={() => mapRef.current?.zoomIn()} aria-label="Acercar"><Plus/></button><button onClick={() => mapRef.current?.zoomOut()} aria-label="Alejar"><Minus/></button><button onClick={() => mapRef.current?.easeTo({center:salar.coords,zoom:8,duration:600})} aria-label="Centrar selección"><LocateFixed/></button>{mode === '3d' && <button onClick={() => { const map = mapRef.current; if (map) map.easeTo({ bearing: map.getBearing() + 359.9, duration: 12000, essential: true }) }} aria-label="Girar mapa 360 grados" title="Girar 360°"><RotateCw/></button>}<button onClick={() => notify(`${Object.values(layers).filter(Boolean).length} capas visibles`)} aria-label="Información de capas"><Layers3/></button></div>
          <div className="map-scale"><span>N</span><div>⌃</div><i/> <small>0&nbsp;&nbsp;&nbsp;50&nbsp;&nbsp;&nbsp;100 km</small></div>
          <div className={`layers-panel${layersOpen ? '' : ' collapsed'}`}><button className="layers-toggle" onClick={() => setLayersOpen(!layersOpen)} aria-expanded={layersOpen}><Layers3 size={15}/> <span>Capas del mapa</span></button>{layersOpen && <>{[['Límite Salta','salta','#df4770'],['Cuencas hidrográficas','cuencas','#49b9c5'],['Salares','salares','#d68c67'],['Proyectos de litio','proyectos','#d1a46a'],['Comunidades indígenas','comunidades','#e9b9ca'],['Vegetación hidrófila','vegetacion','#76b899'],['Estaciones meteorológicas','estaciones','#a6a9b2'],['Red hidrográfica','red','#49b9c5']].map(([label,key,color]) => <label key={key}><span><i style={{background:color}}/>{label}</span><input type="checkbox" checked={layers[key]} onChange={() => setLayers({...layers,[key]:!layers[key]})}/><b/></label>)}<h4>Base de mapa</h4><div className="basemap-options">{[['Oscuro','dark'],['Satélite','satellite'],['Terreno','terrain']].map(([label,value]) => <button className={base===value?'chosen':''} key={value} onClick={() => setBase(value as any)}><span className={`base-preview ${value}`}/>{label}</button>)}</div></>}</div>
          <div className="map-demo">GEOMETRÍAS ESQUEMÁTICAS · SELECCIONE UN SALAR</div>
        </div>

        <aside className="territory-card">
          <div className="territory-photo"><img src="/salar-arizaro.jpg" alt="Paisaje del salar y cordillera"/><span>FICHA TERRITORIAL</span></div>
          <div className="territory-body"><h2>{salar.name}</h2><div className="tabs">{['Resumen','Hidroclima','Ecosistemas','Proyectos'].map(t => <button className={activeTab===t?'active':''} onClick={() => setActiveTab(t)} key={t}>{t}</button>)}</div>
            {activeTab === 'Resumen' && <dl><div><dt>Superficie</dt><dd>{salar.surface} km²</dd></div><div><dt>Cuenca</dt><dd>{salar.basin}</dd></div><div><dt>Altitud media</dt><dd>{salar.altitude} m s. n. m.</dd></div><div><dt>Tipo</dt><dd>Salar</dd></div><div><dt>Proyectos cercanos</dt><dd className="accent">{salar.projects} <small>(ver detalle)</small></dd></div><div><dt>Comunidades</dt><dd>{salar.communities} <small>(en cuenca)</small></dd></div></dl>}
            {activeTab === 'Hidroclima' && <div className="tab-detail"><CloudRain/><strong>Serie 2002–{period}</strong><p>Precipitación, SPI-6 y almacenamiento regional. Valores de demostración; consulte los gráficos vinculados.</p><button onClick={() => goTo('Hidroclima','hidroclima')}>Explorar series <ArrowRight size={14}/></button></div>}
            {activeTab === 'Ecosistemas' && <div className="tab-detail"><Leaf/><strong>Vegetación hidrófila</strong><p>NDVI mensual y tendencia regional. La variabilidad observada no implica causalidad minera.</p><button onClick={() => goTo('Ecosistemas','ecosistemas')}>Ver indicador <ArrowRight size={14}/></button></div>}
            {activeTab === 'Proyectos' && <div className="tab-detail"><Mountain/><strong>{salar.projects} registros ilustrativos</strong><p>La cercanía territorial no acredita consumo hídrico ni impacto. Inventario pendiente de validación.</p><button onClick={() => goTo('Territorio y litio','territorio')}>Ver distribución <ArrowRight size={14}/></button></div>}
            <button className="full-record" onClick={() => {setModal('project');notify(`Ficha ampliada: ${salar.name}`)}}>Ver ficha completa <ArrowRight size={15}/></button>
          </div>
        </aside>
      </section>

      <section className="charts-grid" id="hidroclima">
        <Chart title="Precipitación anual · Salta (CHIRPS)" icon={<CloudRain/>} selector={precipScope} options={['Provincia','Puna salteña','Sistema Arizaro']} onSelect={setPrecipScope} onDownload={() => exportCsv()}><ReactECharts option={precipOption} style={{height:'100%'}}/></Chart>
        <Chart title="Índice de sequía (SPI-6)" icon={<Droplets/>} selector={spiScope} options={['Cuenca seleccionada','Sistema Arizaro','Sistema Cauchari']} onSelect={setSpiScope} onDownload={() => exportCsv('agua-en-salta-spi6')}><ReactECharts option={spiOption} style={{height:'100%'}}/><div className="heatmap-legend"><span>Sequía</span><i/><span>Húmedo</span></div></Chart>
        <div id="ecosistemas"><Chart title="NDVI · Vegetación hidrófila" icon={<Leaf/>} selector={salar.name} options={salars.map(s=>s.name)} onSelect={v => selectSalar(salars.find(s=>s.name===v)?.id || 'arizaro')} onDownload={() => exportCsv('agua-en-salta-ndvi')}><ReactECharts option={ndviOption} style={{height:'100%'}}/></Chart></div>
      </section>

      <section className="charts-grid lower" id="territorio">
        <Chart title="Distribución de proyectos de litio" icon={<Mountain/>} onDownload={() => exportCsv('agua-en-salta-proyectos-demo')}><div className="donut-wrap"><ReactECharts option={donutOption} style={{height:'100%'}}/><div className="donut-center"><strong>12*</strong><span>proyectos</span></div><div className="donut-legend">{[['Exploración','6',colors.gold],['Construcción','4','#d47768'],['Operación','2',colors.burgundy]].map(([l,v,c])=><button key={l} onClick={()=>notify(`Filtro aplicado: ${l}`)}><i style={{background:c}}/>{l}<b>{v}</b></button>)}</div></div></Chart>
        <Chart title="Comparación de cuencas" icon={<BarChart3/>} selector="Meses con sequía (SPI-6)" options={['Meses con sequía (SPI-6)','Meses con sequía (SPI-12)']} onSelect={()=>notify('Indicador actualizado')} onDownload={() => exportCsv('agua-en-salta-comparacion')}><ReactECharts option={compareOption} style={{height:'100%'}}/></Chart>
        <Chart className="grace-chart" title="Almacenamiento terrestre de agua (GRACE)" icon={<Waves/>} selector="Región NOA (promedio)" options={['Región NOA (promedio)','Puna (contexto regional)']} onSelect={()=>notify('Región actualizada')} onDownload={() => exportCsv('agua-en-salta-grace')}><ReactECharts option={graceOption} style={{height:'100%'}}/></Chart>
      </section>
      <footer><span><Info size={13}/> Datos y geometrías ilustrativos. No representan resultados científicos calculados.</span><button onClick={() => setModal('method')}>Metodología y fuentes <ExternalLink size={12}/></button><small className="copyright">Gabriela Coronel &amp; Vanina Sulca · Todos los derechos reservados 2026</small></footer>
    </main>

    {toast && <div className="toast" role="status"><Check size={16}/>{toast}</div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)setModal(null)}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {modal === 'project' && <><span className="modal-kicker">AGUA EN SALTA · OBSERVATORIO</span><h2 id="modal-title">Datos para comprender la Puna</h2><p>Una plataforma de investigación geoespacial para integrar clima, territorio, ecosistemas y actividad productiva sin confundir coincidencia espacial con causalidad.</p><div className="modal-stats"><div><strong>2002–2026</strong><span>Ventana de estudio</span></div><div><strong>Multiescala</strong><span>Cuenca · salar · región</span></div></div><h3>{salar.name}</h3><p className="muted">Ficha conceptual de {salar.basin}. Superficie y altitud mostradas con fines de prototipado; requieren validación sobre las fuentes originales.</p></>}
      {modal === 'method' && <><span className="modal-kicker">TRANSPARENCIA CIENTÍFICA</span><h2 id="modal-title">Metodología y evidencia</h2><p>Los indicadores deben conservar fuente, versión, unidad, resolución, cobertura y faltantes. Las visualizaciones actuales son demostrativas.</p><ul><li>CHIRPS: precipitación mensual y anual.</li><li>ERA5-Land: temperatura y demanda evaporativa.</li><li>MODIS / Sentinel-2: vegetación y humedales.</li><li>GRACE / GRACE-FO: almacenamiento regional, no acuíferos locales.</li></ul><div className="notice">La presencia de proyectos no demuestra consumo hídrico ni impacto ambiental.</div></>}
      {modal === 'open' && <><span className="modal-kicker">ACCESO Y REPRODUCIBILIDAD</span><h2 id="modal-title">Datos abiertos</h2><p>Este prototipo no consulta todavía una API científica. Las cifras y curvas son ilustrativas y están identificadas como tales.</p><button className="primary-action" onClick={() => {exportCsv('agua-en-salta-datos-demo');setModal(null)}}>Descargar datos demo <Download size={16}/></button></>}
      {modal === 'downloads' && <><span className="modal-kicker">EXPORTACIÓN</span><h2 id="modal-title">Centro de descargas</h2><p>Descargue una muestra tabular del prototipo. Cada entrega pública deberá incluir metadatos y procedencia.</p>{['Precipitación anual','Índice SPI-6','NDVI vegetación','GRACE regional'].map((n,i)=><button className="download-row" key={n} onClick={()=>exportCsv(`agua-en-salta-${i}`)}><FileText/><span>{n}<small>CSV · datos de demostración</small></span><Download/></button>)}</>}
      {modal === 'communities' && <><span className="modal-kicker">TERRITORIO Y COMUNIDADES</span><h2 id="modal-title">Información con uso responsable</h2><p>Los puntos comunitarios no equivalen a límites territoriales ni prueban acceso al agua. La publicación debe usar únicamente coordenadas apropiadas y autorizadas.</p><div className="notice">299 puntos en Salta: cifra de referencia del documento maestro, pendiente de reproducción automatizada.</div></>}
      <button className="modal-done" onClick={() => setModal(null)}>Entendido</button>
    </section></div>}
  </div>
}

function Chart({ className = '', title, icon, selector, options, onSelect, onDownload, children }: { className?:string, title:string, icon:React.ReactNode, selector?:string, options?:string[], onSelect?:(v:string)=>void, onDownload:()=>void, children:React.ReactNode }) {
  return <article className={`chart-card ${className}`}><header><h3>{icon}{title}</h3><div>{selector && <label className="chart-select"><select value={selector} onChange={e=>onSelect?.(e.target.value)} aria-label={`Filtro de ${title}`}>{options?.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={12}/></label>}<button className="chart-export" onClick={onDownload} aria-label={`Descargar ${title}`}><Download size={13}/></button></div></header><div className="chart-body">{children}</div></article>
}
