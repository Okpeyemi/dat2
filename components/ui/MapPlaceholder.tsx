import Image from "next/image";

export interface Property {
  id: number;
  imageSrc: string;
  price: string;
  address: string;
  specs: string;
  lat: number;
  lng: number;
}

interface MapPlaceholderProps {
  properties: Property[];
  selectedPropertyId: number | null;
  onSelectProperty: (id: number) => void;
}

// Bounding box for Venice / Marina del Rey
const BBOX = {
  minLng: -118.4800,
  minLat: 33.9700,
  maxLng: -118.4400,
  maxLat: 33.9950
};

function getPercentagePos(lat: number, lng: number) {
  const left = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const top = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return { left: `${left}%`, top: `${top}%` };
}

export function MapPlaceholder({ properties, selectedPropertyId, onSelectProperty }: MapPlaceholderProps) {
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${BBOX.minLng}%2C${BBOX.minLat}%2C${BBOX.maxLng}%2C${BBOX.maxLat}&layer=mapnik`}
        className="absolute inset-0 grayscale-[0.3] opacity-80"
      />
      
      {/* Dynamic Pins */}
      {properties.map(p => {
        const isSelected = p.id === selectedPropertyId;
        const pos = getPercentagePos(p.lat, p.lng);
        return (
          <div 
            key={p.id}
            onClick={() => onSelectProperty(p.id)}
            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
            className={`absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] cursor-pointer transition-all duration-300 hover:scale-125 hover:ring-8 hover:ring-blue-500/20 ${
              isSelected ? 'ring-[12px] ring-blue-500/30 scale-125 z-20 bg-blue-600 border-[3px]' : 'ring-4 ring-blue-500/20 z-10'
            }`}
          ></div>
        );
      })}

      {/* Highlighted Property Card on Map */}
      <div 
         className={`absolute z-30 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] p-3 flex flex-col gap-2 w-[240px] pointer-events-none transition-all duration-300 ${
           selectedProperty ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
         }`}
         style={{
           top: selectedProperty ? `calc(${getPercentagePos(selectedProperty.lat, selectedProperty.lng).top} - 180px)` : '50%',
           left: selectedProperty ? `calc(${getPercentagePos(selectedProperty.lat, selectedProperty.lng).left} - 120px)` : '50%',
           transform: selectedProperty ? 'translate(0, 0)' : 'translate(-50%, -50%)',
         }}
      >
        {selectedProperty && (
          <>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-1">
              <Image 
                src={selectedProperty.imageSrc} 
                alt="Property on Map" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5 px-1 py-1">
              <h4 className="font-bold text-lg text-gray-900 leading-tight">{selectedProperty.price}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <p className="text-xs text-gray-500 font-medium truncate">{selectedProperty.address}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-medium">{selectedProperty.specs}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
