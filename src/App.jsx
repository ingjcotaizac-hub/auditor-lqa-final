import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardList, CheckSquare, XSquare, Award, 
  AlertCircle, Hotel, Save, RotateCcw, ZoomIn, ZoomOut, 
  Maximize, Map, Droplets, DoorOpen, ChevronRight, ChevronLeft, CheckCircle, Ban, Eye, Info, FileText, Shuffle
} from 'lucide-react';

// --- BASE DE DATOS DE ESCENARIOS (FOTOS REALES) ---
const SCENARIO_DB = {
  ROOM: [
    { 
      id: 'r1', 
      url: "https://i.postimg.cc/7ZkVS0Jv/Habitacion-perfecta-1.png", 
      title: "Estándar 1",
      feedback: "Esta imagen muestra el estándar ideal: Cama King sin arrugas, simetría perfecta y ausencia de ruido visual." 
    },
    { 
      id: 'r2', 
      url: "https://i.postimg.cc/Hkg2bXcN/Habitacion-perfecta-2.png", 
      title: "Estándar 2",
      feedback: "Ejemplo de habitación correcta. Fíjate en la alineación precisa del tiro de cama y los cojines centrados." 
    },
    { 
      id: 'r3', 
      url: "https://i.postimg.cc/52V38LYn/Habitacion-con-fallo-sutil-1.png", 
      title: "Revisión Detalle A",
      feedback: "Deberías haber notado la pequeña arruga en la esquina inferior del edredón. El resto parece correcto." 
    },
    { 
      id: 'r4', 
      url: "https://i.postimg.cc/Z5Sc6pBc/Habitacion-con-fallo-sutil-2.png", 
      title: "Revisión Detalle B",
      feedback: "Atención a la manta decorativa: está ligeramente asimétrica. Un ojo experto lo corrige antes de salir." 
    },
    { 
      id: 'r5', 
      url: "https://i.postimg.cc/Bn0g2HLc/Habitacion-con-fallo-sutil-3.png", 
      title: "Revisión Limpieza A",
      feedback: "Hay objetos fuera de lugar (percha en silla) y posibles marcas en pared. Detalles que denotan falta de revisión final." 
    },
    { 
      id: 'r6', 
      url: "https://i.postimg.cc/bNbgG3JT/Habitacion-con-fallo-sutil-4.png", 
      title: "Revisión Técnica",
      feedback: "La iluminación es clave. Deberías haber reportado la lámpara de la mesita (posiblemente fundida o apagada) y manchas en mobiliario." 
    },
    { 
      id: 'r7', 
      url: "https://i.postimg.cc/2SDwnhbZ/Habitacion-con-fallo-sutil-5.png", 
      title: "Revisión Montaje",
      feedback: "El montaje de bienvenida (bandeja) no está en su sitio estándar. El faldón de la cama también requería atención." 
    },
    { 
      id: 'r8', 
      url: "https://i.postimg.cc/Hkg2bXcw/Habitacion-con-anomalias-moderadas.png", 
      title: "Incidencia Moderada",
      feedback: "Varios fallos visibles: Almohada hundida (falta ahuecado), toalla olvidada y papelera sin vaciar." 
    },
    { 
      id: 'r9', 
      url: "https://i.postimg.cc/J4JxyPn5/Habitacion-con-error-garrafal-1.png", 
      title: "Estado Crítico A",
      feedback: "Situación inaceptable: Cama sin terminar y restos de comida/bandeja sucia. Requiere intervención inmediata." 
    },
    { 
      id: 'r10', 
      url: "https://i.postimg.cc/sDSmBwXJ/Habitacion-con-error-garrafal-2.png", 
      title: "Estado Crítico B",
      feedback: "Problema grave de limpieza: Objetos bajo la cama (zapatos) y desorden generalizado. No apta para cliente." 
    }
  ],
  BATH: [
    { id: 'b1', url: "https://i.postimg.cc/VvPmWzy1/Bano-perfecto-1.png", title: "Baño Escenario 1", feedback: "Baño en estado correcto y limpio." },
    { id: 'b2', url: "https://i.postimg.cc/Gtndxb0d/Bano-perfecto-2.png", title: "Baño Escenario 2", feedback: "Presentación correcta según estándar." },
    { id: 'b3', url: "https://i.postimg.cc/NFvBkQht/Bano-con-fallo-sutil-1.png", title: "Baño Escenario 3", feedback: "Detalle de limpieza: Gota seca visible en la grifería." },
    { id: 'b4', url: "https://i.postimg.cc/VvPmWmx3/Bano-con-fallo-sutil-2.png", title: "Baño Escenario 4", feedback: "Limpieza de espejos: Hay una huella o marca visible." },
    { id: 'b5', url: "https://i.postimg.cc/SRbkfkB3/Bano-con-fallo-sutil-3.png", title: "Baño Escenario 5", feedback: "Lencería: La toalla presenta una alineación incorrecta o defecto." },
    { id: 'b6', url: "https://i.postimg.cc/W3ksZhHf/Bano-con-fallo-sutil-4.png", title: "Baño Escenario 6", feedback: "Reposición: Falta algún elemento de los amenities o está mal colocado." },
    { id: 'b7', url: "https://i.postimg.cc/V6CztdVV/Bano-con-fallo-sutil-5.png", title: "Baño Escenario 7", feedback: "Detalle en inodoro: Precinto o limpieza final mejorable." },
    { id: 'b8', url: "https://i.postimg.cc/5yWbSbhD/Bano-con-anomalias-moderadas.png", title: "Baño Escenario 8", feedback: "Fallos moderados: Cal visible en grifería y limpieza general." },
    { id: 'b9', url: "https://i.postimg.cc/gjbmHmCM/Bano-con-error-garrafal-1.png", title: "Baño Escenario 9", feedback: "Error crítico: Suciedad grave en suelo y zona WC." },
    { id: 'b10', url: "https://i.postimg.cc/KzMmTRHp/Bano-con-error-garrafal-2.png", title: "Baño Escenario 10", feedback: "Desorden generalizado: Toallas y amenities en estado caótico." },
    { id: 'b11', url: "https://i.postimg.cc/hjdKmf5C/Bano-con-error-garrafal-3.png", title: "Baño Escenario 11", feedback: "Limpieza deficiente en espejo e inodoro." }
  ],
  CLOSET: [
    { id: 'c1', url: "https://i.postimg.cc/8cvV0cQN/Armario-perfecto-1.png", title: "Escenario Armario 1", feedback: "Armario perfectamente ordenado y alineado." },
    { id: 'c2', url: "https://i.postimg.cc/j2frF20R/Armario-perfecto-2.png", title: "Escenario Armario 2", feedback: "Presentación correcta, perchas alineadas." },
    { id: 'c3', url: "https://i.postimg.cc/d3CKx3Pq/Armario-con-fallo-sutil-1.png", title: "Escenario Armario 3", feedback: "Detalle: Una percha está girada o mal colocada." },
    { id: 'c4', url: "https://i.postimg.cc/hvmq5vWP/Armario-con-fallo-sutil-2.png", title: "Escenario Armario 4", feedback: "Detalle de lencería: La manta o zapatillas no están alineadas." },
    { id: 'c5', url: "https://i.postimg.cc/MGSty4HY/Armario-con-fallo-sutil-3.png", title: "Escenario Armario 5", feedback: "Set de planchado: El cable no está recogido correctamente." },
    { id: 'c6', url: "https://i.postimg.cc/mrsVQqk4/Armario-con-fallo-sutil-4.png", title: "Escenario Armario 6", feedback: "Detalle visual: Etiqueta visible o mancha leve." },
    { id: 'c7', url: "https://i.postimg.cc/MGSty4Hq/Armario-con-fallo-sutil-5.png", title: "Escenario Armario 7", feedback: "Mezcla de elementos: Percha de niño o elemento no estándar." },
    { id: 'c8', url: "https://i.postimg.cc/3wT9g6NF/Armario-con-anomal-as-moderadas.png", title: "Escenario Armario 8", feedback: "Anomalía: Mezcla de perchas y polvo visible." },
    { id: 'c9', url: "https://i.postimg.cc/0ymcKxk8/Armario-con-error-garrafal-1.png", title: "Escenario Armario 9", feedback: "Error grave: Ropa tirada, desorden y caja fuerte no reseteada." },
    { id: 'c10', url: "https://i.postimg.cc/CxDmnYh1/Armario-con-error-garrafal-2.png", title: "Escenario Armario 10", feedback: "Error grave: Zapatillas usadas y suciedad evidente." }
  ]
};

const ZONES = { 
  HABITACION: "Habitación", 
  BANO: "Baño",
  ARMARIO: "Armario / Entrada",
  GENERAL: "General" 
};

// Checklist de observación (sin juicio crítico automático)
const AUDIT_ITEMS = [
  { id: 'hab_cama', zone: ZONES.HABITACION, label: "Presentación Cama" },
  { id: 'hab_mesitas', zone: ZONES.HABITACION, label: "Orden Mesitas" },
  { id: 'hab_iluminacion', zone: ZONES.HABITACION, label: "Iluminación" },
  
  { id: 'bano_limpieza', zone: ZONES.BANO, label: "Limpieza Sanitarios" },
  { id: 'bano_toallas', zone: ZONES.BANO, label: "Colocación Toallas" },
  
  { id: 'arm_perchas', zone: ZONES.ARMARIO, label: "Orden Perchas" },
  { id: 'arm_caja', zone: ZONES.ARMARIO, label: "Caja Fuerte" },
  
  { id: 'gen_suelo', zone: ZONES.GENERAL, label: "Limpieza Suelos" },
  { id: 'gen_objetos', zone: ZONES.GENERAL, label: "Objetos Olvidados" }
];

export default function GobernantaProApp() {
  const [currentView, setCurrentView] = useState('ROOM');
  const [activeScenario, setActiveScenario] = useState({ ROOM: null, BATH: null, CLOSET: null });
  const [auditData, setAuditData] = useState({}); 
  const [showReport, setShowReport] = useState(false);
  
  // Visor States
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  // --- MOTOR ALEATORIO ---
  const generateNewAudit = () => {
    // Selección aleatoria independiente para cada zona
    const randomRoom = SCENARIO_DB.ROOM[Math.floor(Math.random() * SCENARIO_DB.ROOM.length)];
    const randomBath = SCENARIO_DB.BATH[Math.floor(Math.random() * SCENARIO_DB.BATH.length)];
    const randomCloset = SCENARIO_DB.CLOSET[Math.floor(Math.random() * SCENARIO_DB.CLOSET.length)];

    setActiveScenario({
      ROOM: randomRoom,
      BATH: randomBath,
      CLOSET: randomCloset
    });

    setAuditData({});
    setShowReport(false);
    resetView();
  };

  useEffect(() => { generateNewAudit(); }, []);

  const resetView = () => {
    setScale(1);
    setPosition({x:0, y:0});
  };

  // --- AUDITORÍA ---
  const handleAudit = (id, status) => {
    setAuditData(prev => ({ ...prev, [id]: status }));
  };

  // --- VISOR ---
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(1, scale + (e.deltaY * -0.001)), 5);
    setScale(newScale);
    if(newScale === 1) setPosition({x:0, y:0});
  };
  const startDrag = (e) => {
    if(scale === 1) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };
  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };
  const stopDrag = () => setIsDragging(false);

  const getCurrentImage = () => activeScenario[currentView] || {};

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* IZQUIERDA: VISOR DE IMÁGENES */}
      <div className="md:w-3/5 h-1/2 md:h-full relative bg-slate-900 overflow-hidden border-r border-slate-300 flex flex-col">
        
        {/* Tabs Superiores */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg gap-1 pointer-events-auto">
            {['ROOM', 'BATH', 'CLOSET'].map(view => (
               <button 
                key={view}
                onClick={() => { setCurrentView(view); resetView(); }} 
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currentView === view ? 'bg-white text-black shadow-md' : 'text-white hover:bg-white/20'}`}
               >
                 {view === 'ROOM' ? 'HABITACIÓN' : view === 'BATH' ? 'BAÑO' : 'ARMARIO'}
               </button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-lg">
          <button onClick={() => setScale(s => Math.min(s + 0.5, 5))} className="p-2 hover:bg-white/20 rounded text-white"><ZoomIn className="w-5 h-5"/></button>
          <button onClick={() => setScale(s => Math.max(s - 0.5, 1))} className="p-2 hover:bg-white/20 rounded text-white"><ZoomOut className="w-5 h-5"/></button>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center cursor-move bg-neutral-900"
          onWheel={handleWheel} onMouseDown={startDrag} onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
          onTouchStart={startDrag} onTouchMove={onDrag} onTouchEnd={stopDrag}
        >
          <div style={{ transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getCurrentImage().url ? (
              <img 
                src={getCurrentImage().url} 
                className="max-w-full max-h-full object-contain pointer-events-none select-none shadow-2xl"
                alt="Escenario"
                style={{ imageRendering: 'high-quality' }} 
              />
            ) : (
              <div className="text-white text-center"><p>Cargando...</p></div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-slate-300 p-2 text-center text-xs border-t border-slate-700 z-20 truncate px-4">
          <span className="opacity-75">Visualizando:</span> <span className="text-white font-medium">{getCurrentImage().title}</span>
        </div>
      </div>

      {/* DERECHA: AUDITORÍA */}
      <div className="md:w-2/5 h-1/2 md:h-full bg-white flex flex-col shadow-2xl z-10 relative">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0 shadow-md z-20">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2"><ClipboardList className="text-yellow-400" /> Gobernanta Pro</h1>
            <p className="text-xs text-slate-400">Auditoría Visual</p>
          </div>
          <div className="text-right">
             <button onClick={generateNewAudit} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded flex items-center gap-2 transition border border-slate-700"><Shuffle className="w-3 h-3" /> Generar Caso Aleatorio</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p><strong>Instrucción:</strong> Observa la foto. ¿Detectas algún fallo en estos puntos? Marca OK si está bien, KO si ves un error.</p>
          </div>

          {/* Renderizado de Items por Zona */}
          {Object.entries(AUDIT_ITEMS.filter(i => 
             (currentView === 'ROOM' && i.zone === ZONES.HABITACION) ||
             (currentView === 'BATH' && i.zone === ZONES.BANO) ||
             (currentView === 'CLOSET' && i.zone === ZONES.ARMARIO) ||
             i.zone === ZONES.GENERAL
          ).reduce((acc, item) => { acc[item.zone] = acc[item.zone] || []; acc[item.zone].push(item); return acc; }, {})).map(([zone, items]) => (
            <div key={zone} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">{zone}</div>
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-sm text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAudit(item.id, 'ok')} className={`flex-1 py-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all ${auditData[item.id] === 'ok' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200 hover:border-green-400 hover:text-green-600'}`}>
                        <CheckSquare className="w-3.5 h-3.5" /> OK
                      </button>
                      <button onClick={() => handleAudit(item.id, 'ko')} className={`flex-1 py-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition-all ${auditData[item.id] === 'ko' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-400 border border-red-400 hover:border-red-400 hover:text-red-600'}`}>
                        <XSquare className="w-3.5 h-3.5" /> KO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <button onClick={() => setShowReport(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95"><Save className="w-4 h-4" /> VERIFICAR AUDITORÍA</button>
        </div>
      </div>

      {/* MODAL REPORTE */}
      {showReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-6 shrink-0">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="w-6 h-6 text-yellow-400"/> Informe de Observación</h2>
              <p className="text-sm text-slate-400 mt-1">Retroalimentación del Experto</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
              
              {/* FEEDBACK POR ZONA */}
              {['ROOM', 'BATH', 'CLOSET'].map(zoneKey => {
                const zoneData = activeScenario[zoneKey];
                const zoneIcon = zoneKey === 'ROOM' ? <Hotel className="w-4 h-4"/> : zoneKey === 'BATH' ? <Droplets className="w-4 h-4"/> : <DoorOpen className="w-4 h-4"/>;
                const zoneName = zoneKey === 'ROOM' ? 'Habitación' : zoneKey === 'BATH' ? 'Baño' : 'Armario';
                
                return (
                  <div key={zoneKey} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">{zoneIcon} {zoneName}</h3>
                      <span className="text-xs font-mono text-slate-400">{zoneData?.id}</span>
                    </div>
                    
                    {/* Nota del Experto */}
                    <div className="p-3 bg-blue-50 text-blue-900 text-sm rounded border border-blue-100 flex gap-3 mb-4">
                      <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600"/>
                      <div>
                        <span className="font-bold block mb-1">Nota del Experto (Lo que debías ver):</span>
                        {zoneData?.feedback}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
            
            <div className="p-4 border-t bg-white shrink-0 flex justify-end">
               <button onClick={() => { setShowReport(false); setAuditData({}); generateNewAudit(); }} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2">
                 <RotateCcw className="w-4 h-4"/> Siguiente Caso Aleatorio
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}