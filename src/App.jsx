import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardList, CheckSquare, XSquare, Award, 
  AlertCircle, Hotel, Save, RotateCcw, ZoomIn, ZoomOut, 
  Maximize, Map, Droplets, DoorOpen, ChevronRight, ChevronLeft, CheckCircle, Ban, Eye, Info, FileText, Check
} from 'lucide-react';

// --- BASE DE DATOS DE ESCENARIOS (FOTOS REALES) ---
const SCENARIO_DB = {
  ROOM: [
    { 
      id: 'r1', 
      url: "https://i.postimg.cc/7ZkVS0Jv/Habitacion-perfecta-1.png", 
      title: "Escenario Habitación 1", 
      feedback: "Esta imagen muestra el estándar ideal: Cama King sin arrugas, simetría perfecta y ausencia de ruido visual.",
      faults: [] 
    },
    { 
      id: 'r2', 
      url: "https://i.postimg.cc/Hkg2bXcN/Habitacion-perfecta-2.png", 
      title: "Escenario Habitación 2", 
      feedback: "Ejemplo de habitación correcta. Fíjate en la alineación precisa del tiro de cama y los cojines centrados.",
      faults: [] 
    },
    { 
      id: 'r3', 
      url: "https://i.postimg.cc/52V38LYn/Habitacion-con-fallo-sutil-1.png", 
      title: "Escenario Habitación 3", 
      feedback: "Deberías haber notado la pequeña arruga en la esquina inferior del edredón. El resto parece correcto.",
      faults: ['hab_cama'] 
    },
    { 
      id: 'r4', 
      url: "https://i.postimg.cc/Z5Sc6pBc/Habitacion-con-fallo-sutil-2.png", 
      title: "Escenario Habitación 4", 
      feedback: "Atención a la manta decorativa: está ligeramente asimétrica. Un ojo experto lo corrige antes de salir.",
      faults: ['hab_cama', 'gen_orden'] 
    },
    { 
      id: 'r5', 
      url: "https://i.postimg.cc/Bn0g2HLc/Habitacion-con-fallo-sutil-3.png", 
      title: "Escenario Habitación 5", 
      feedback: "Hay objetos fuera de lugar (percha en silla) y posibles marcas en pared. Detalles que denotan falta de revisión final.",
      faults: ['gen_orden', 'gen_limpieza'] 
    },
    { 
      id: 'r6', 
      url: "https://i.postimg.cc/bNbgG3JT/Habitacion-con-fallo-sutil-4.png", 
      title: "Escenario Habitación 6", 
      feedback: "La iluminación es clave. Deberías haber reportado la lámpara de la mesita (posiblemente fundida o apagada) y manchas en mobiliario.",
      faults: ['hab_iluminacion', 'hab_mesitas'] 
    },
    { 
      id: 'r7', 
      url: "https://i.postimg.cc/2SDwnhbZ/Habitacion-con-fallo-sutil-5.png", 
      title: "Escenario Habitación 7", 
      feedback: "El montaje de bienvenida (bandeja) no está en su sitio estándar. El faldón de la cama también requería atención.",
      faults: ['gen_orden'] 
    },
    { 
      id: 'r8', 
      url: "https://i.postimg.cc/Hkg2bXcw/Habitacion-con-anomalias-moderadas.png", 
      title: "Escenario Habitación 8", 
      feedback: "Varios fallos visibles: Almohada hundida (falta ahuecado), toalla olvidada y papelera sin vaciar.",
      faults: ['hab_cama', 'gen_orden', 'gen_limpieza'] 
    },
    { 
      id: 'r9', 
      url: "https://i.postimg.cc/J4JxyPn5/Habitacion-con-error-garrafal-1.png", 
      title: "Escenario Habitación 9", 
      feedback: "Situación inaceptable: Cama sin terminar y restos de comida/bandeja sucia. Requiere intervención inmediata.",
      faults: ['hab_cama', 'gen_orden', 'gen_limpieza', 'hab_mesitas'] 
    },
    { 
      id: 'r10', 
      url: "https://i.postimg.cc/sDSmBwXJ/Habitacion-con-error-garrafal-2.png", 
      title: "Escenario Habitación 10", 
      feedback: "Problema grave de limpieza: Objetos bajo la cama (zapatos) y desorden generalizado. No apta para cliente.",
      faults: ['hab_cama', 'gen_limpieza', 'gen_orden'] 
    }
  ],
  BATH: [
    { id: 'b1', url: "https://i.postimg.cc/VvPmWzy1/Bano-perfecto-1.png", title: "Escenario Baño 1", feedback: "Baño en estado correcto y limpio.", faults: [] },
    { id: 'b2', url: "https://i.postimg.cc/Gtndxb0d/Bano-perfecto-2.png", title: "Escenario Baño 2", feedback: "Presentación correcta según estándar.", faults: [] },
    { id: 'b3', url: "https://i.postimg.cc/NFvBkQht/Bano-con-fallo-sutil-1.png", title: "Escenario Baño 3", feedback: "Detalle de limpieza: Gota seca visible en la grifería.", faults: ['bano_grifos'] },
    { id: 'b4', url: "https://i.postimg.cc/VvPmWmx3/Bano-con-fallo-sutil-2.png", title: "Escenario Baño 4", feedback: "Limpieza de espejos: Hay una huella o marca visible.", faults: ['bano_espejo'] },
    { id: 'b5', url: "https://i.postimg.cc/SRbkfkB3/Bano-con-fallo-sutil-3.png", title: "Escenario Baño 5", feedback: "Lencería: La toalla presenta una alineación incorrecta o defecto.", faults: ['toallas_colocacion'] },
    { id: 'b6', url: "https://i.postimg.cc/W3ksZhHf/Bano-con-fallo-sutil-4.png", title: "Escenario Baño 6", feedback: "Reposición: Falta algún elemento de los amenities o está mal colocado.", faults: ['bano_amenities'] },
    { id: 'b7', url: "https://i.postimg.cc/V6CztdVV/Bano-con-fallo-sutil-5.png", title: "Escenario Baño 7", feedback: "Detalle en inodoro: Precinto o limpieza final mejorable.", faults: ['bano_inodoro'] },
    { id: 'b8', url: "https://i.postimg.cc/5yWbSbhD/Bano-con-anomalias-moderadas.png", title: "Escenario Baño 8", feedback: "Fallos moderados: Cal visible en grifería y limpieza general.", faults: ['bano_grifos', 'gen_limpieza'] },
    { id: 'b9', url: "https://i.postimg.cc/gjbmHmCM/Bano-con-error-garrafal-1.png", title: "Escenario Baño 9", feedback: "Error crítico: Suciedad grave en suelo y zona WC.", faults: ['gen_limpieza', 'bano_inodoro', 'toallas_colocacion'] },
    { id: 'b10', url: "https://i.postimg.cc/KzMmTRHp/Bano-con-error-garrafal-2.png", title: "Escenario Baño 10", feedback: "Desorden generalizado: Toallas y amenities en estado caótico.", faults: ['toallas_colocacion', 'gen_orden', 'bano_amenities'] },
    { id: 'b11', url: "https://i.postimg.cc/hjdKmf5C/Bano-con-error-garrafal-3.png", title: "Escenario Baño 11", feedback: "Limpieza deficiente en espejo e inodoro.", faults: ['gen_limpieza', 'bano_espejo', 'bano_inodoro'] }
  ],
  CLOSET: [
    { id: 'c1', url: "https://i.postimg.cc/8cvV0cQN/Armario-perfecto-1.png", title: "Escenario Armario 1", feedback: "Armario perfectamente ordenado y alineado.", faults: [] },
    { id: 'c2', url: "https://i.postimg.cc/j2frF20R/Armario-perfecto-2.png", title: "Escenario Armario 2", feedback: "Presentación correcta, perchas alineadas.", faults: [] },
    { id: 'c3', url: "https://i.postimg.cc/d3CKx3Pq/Armario-con-fallo-sutil-1.png", title: "Escenario Armario 3", feedback: "Detalle: Una percha está girada o mal colocada.", faults: ['armario_perchas'] },
    { id: 'c4', url: "https://i.postimg.cc/hvmq5vWP/Armario-con-fallo-sutil-2.png", title: "Escenario Armario 4", feedback: "Detalle de lencería: La manta o zapatillas no están alineadas.", faults: ['gen_orden', 'armario_perchas'] },
    { id: 'c5', url: "https://i.postimg.cc/MGSty4HY/Armario-con-fallo-sutil-3.png", title: "Escenario Armario 5", feedback: "Set de planchado: El cable no está recogido correctamente.", faults: ['armario_plancha'] },
    { id: 'c6', url: "https://i.postimg.cc/mrsVQqk4/Armario-con-fallo-sutil-4.png", title: "Escenario Armario 6", feedback: "Detalle visual: Etiqueta visible o mancha leve.", faults: ['armario_perchas', 'gen_limpieza'] },
    { id: 'c7', url: "https://i.postimg.cc/MGSty4Hq/Armario-con-fallo-sutil-5.png", title: "Escenario Armario 7", feedback: "Mezcla de elementos: Percha de niño o elemento no estándar.", faults: ['armario_perchas'] },
    { id: 'c8', url: "https://i.postimg.cc/3wT9g6NF/Armario-con-anomal-as-moderadas.png", title: "Escenario Armario 8", feedback: "Anomalía: Mezcla de perchas y polvo visible.", faults: ['armario_perchas', 'gen_limpieza'] },
    { id: 'c9', url: "https://i.postimg.cc/0ymcKxk8/Armario-con-error-garrafal-1.png", title: "Escenario Armario 9", feedback: "Error grave: Ropa tirada, desorden y caja fuerte no reseteada.", faults: ['gen_orden', 'armario_perchas', 'caja_fuerte'] },
    { id: 'c10', url: "https://i.postimg.cc/CxDmnYh1/Armario-con-error-garrafal-2.png", title: "Escenario Armario 10", feedback: "Error grave: Zapatillas usadas y suciedad evidente.", faults: ['gen_limpieza', 'gen_orden'] }
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

// Componente para mostrar el resultado de un ítem individual
const ItemResultRow = ({ item, userStatus, isFaulty }) => {
  let statusIcon, statusText, statusClass;

  if (isFaulty) {
    if (userStatus === 'ko') {
      statusIcon = <CheckCircle className="w-4 h-4" />;
      statusText = "DETECTADO";
      statusClass = "text-green-600 bg-green-50 border-green-200";
    } else {
      statusIcon = <XSquare className="w-4 h-4" />;
      statusText = "NO DETECTADO";
      statusClass = "text-red-600 bg-red-50 border-red-200";
    }
  } else {
    if (userStatus === 'ok') {
      statusIcon = <CheckCircle className="w-4 h-4" />;
      statusText = "CORRECTO";
      statusClass = "text-green-600 bg-green-50 border-green-200";
    } else if (userStatus === 'ko') {
      statusIcon = <AlertCircle className="w-4 h-4" />;
      statusText = "FALSA ALARMA";
      statusClass = "text-orange-600 bg-orange-50 border-orange-200";
    } else {
      statusIcon = <AlertCircle className="w-4 h-4" />;
      statusText = "SIN REVISAR";
      statusClass = "text-gray-500 bg-gray-50 border-gray-200";
    }
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 text-sm">
      <span className="text-slate-700">{item.label}</span>
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${statusClass}`}>
        {statusIcon} {statusText}
      </div>
    </div>
  );
};

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

  // --- AUDITORÍA (Solo observación) ---
  const handleAudit = (id, status) => {
    setAuditData(prev => ({ ...prev, [id]: status }));
  };

  const calculateResults = () => {
    let agreementCount = 0;
    
    // Lista de fallos reales de la imagen actual
    const activeFaults = [
      ...(activeScenario.ROOM?.faults || []),
      ...(activeScenario.BATH?.faults || []),
      ...(activeScenario.CLOSET?.faults || [])
    ];
    
    // Filtramos items relevantes para la auditoría (todos en este caso porque se auditan las 3 zonas)
    const relevantItems = AUDIT_ITEMS;

    relevantItems.forEach(item => {
      const userStatus = auditData[item.id];
      const isFaulty = activeFaults.includes(item.id);

      if (isFaulty) {
        if (userStatus === 'ko') agreementCount++; 
      } else {
        if (userStatus === 'ok') agreementCount++;
      }
    });

    const total = relevantItems.length;
    // Cálculo de porcentaje solo para color del encabezado, no para mostrar nota
    const percentage = total > 0 ? Math.round((agreementCount/total)*100) : 0;
    
    return { agreementCount, total, percentage, activeFaults };
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
  const result = showReport ? calculateResults() : null;
  const isAuditEmpty = Object.keys(auditData).length === 0;

  if (!activeScenario.ROOM) return <div className="p-10 text-center">Cargando simulador...</div>;

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
             <button onClick={generateNewAudit} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded flex items-center gap-2 transition border border-slate-700"><RotateCcw className="w-3 h-3" /> Generar Caso Aleatorio</button>
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
          <div className="flex flex-col gap-2">
             {isAuditEmpty && (
                <p className="text-xs text-center text-red-500 animate-pulse">
                   ⚠️ Marca al menos un punto para finalizar
                </p>
             )}
             <button 
               onClick={() => setShowReport(true)} 
               disabled={isAuditEmpty} 
               className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95 ${isAuditEmpty ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
             >
               <Save className="w-4 h-4" /> FIRMAR REVISIÓN
             </button>
          </div>
        </div>
      </div>

      {/* MODAL REPORTE */}
      {showReport && result && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className={`p-6 text-white text-center ${result.percentage >= 85 ? 'bg-green-600' : 'bg-slate-700'} shrink-0`}>
              <h2 className="text-2xl font-bold mb-1">Resumen de Criterio</h2>
              <p className="text-lg opacity-90 font-medium">Coincidimos en {result.agreementCount} de {result.total} puntos de control</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
              
              {/* FEEDBACK POR ZONA */}
              {['ROOM', 'BATH', 'CLOSET'].map(zoneKey => {
                const zoneData = activeScenario[zoneKey];
                const zoneIcon = zoneKey === 'ROOM' ? <Hotel className="w-4 h-4"/> : zoneKey === 'BATH' ? <Droplets className="w-4 h-4"/> : <DoorOpen className="w-4 h-4"/>;
                const zoneName = zoneKey === 'ROOM' ? 'Habitación' : zoneKey === 'BATH' ? 'Baño' : 'Armario';
                const zoneItems = AUDIT_ITEMS.filter(i => 
                  (zoneKey === 'ROOM' && i.zone === ZONES.HABITACION) ||
                  (zoneKey === 'BATH' && i.zone === ZONES.BANO) ||
                  (zoneKey === 'CLOSET' && i.zone === ZONES.ARMARIO) ||
                  (i.zone === ZONES.GENERAL && zoneKey === 'ROOM') // Mostrar generales solo en una zona o duplicar si se quiere
                );
                
                // Mostrar solo si hay items relevantes para esta zona
                if (zoneItems.length === 0) return null;

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
                        <span className="font-bold block mb-1">💡 Criterio de Otaingenio:</span>
                        {zoneData?.feedback}
                      </div>
                    </div>

                    {/* Tabla de Detalle */}
                    <div className="space-y-1">
                      {zoneItems.map(item => {
                         const isFaulty = result.activeFaults.includes(item.id);
                         const userStatus = auditData[item.id];
                         return <ItemResultRow key={item.id} item={item} userStatus={userStatus} isFaulty={isFaulty} />;
                      })}
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