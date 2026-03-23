"use client";

import { useState } from "react";
import Image from "next/image";
import { FilterBar } from "@/components/ui/FilterBar";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { MapPlaceholder, Property } from "@/components/ui/MapPlaceholder";
import { ChevronLeft, ChevronRight, ArrowLeft, MapPin } from "lucide-react";

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const properties: Property[] = [
    {
      id: 1,
      imageSrc: "/prop1.png",
      price: "$495 000",
      address: "684 Fifth Ave, Venice",
      specs: "3 beds / 2 baths / 1 520 sqft",
      lat: 33.9920,
      lng: -118.4750
    },
    {
      id: 2,
      imageSrc: "/prop2.png",
      price: "$650 000",
      address: "418 Carroll Canal, Venice",
      specs: "2 beds / 1.5 baths / Canal-side home",
      lat: 33.9845,
      lng: -118.4656
    },
    {
      id: 3,
      imageSrc: "/prop3.png",
      price: "$940 000",
      address: "2200 Dell Ave, Venice",
      specs: "2 beds / 2 baths / 2 060 sqft",
      lat: 33.9810,
      lng: -118.4600
    },
    {
      id: 4,
      imageSrc: "/prop4.png",
      price: "$850 000",
      address: "3100 Washington Blvd, Marina del Rey",
      specs: "3 beds / 2 baths / 1 940 sqft",
      lat: 33.9880,
      lng: -118.4550
    }
  ];

  const handleSelectProperty = (id: number) => {
    setSelectedPropertyId(id);
    setIsPanelOpen(true);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <main className="flex w-full h-screen overflow-hidden font-sans bg-gray-100">
      {/* Map Container (takes remaining space) */}
      <div className="relative flex-1 h-full z-0 transition-all duration-500">
         <MapPlaceholder 
           properties={properties} 
           selectedPropertyId={selectedPropertyId} 
           onSelectProperty={handleSelectProperty} 
         />

         {/* Toggle Panel Button floating over the map */}
         <button 
           onClick={() => setIsPanelOpen(!isPanelOpen)}
           className="absolute top-6 right-6 z-30 bg-white p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all duration-500 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-200/50"
         >
           {isPanelOpen ? <ChevronRight className="w-5 h-5 text-gray-700" /> : <ChevronLeft className="w-5 h-5 text-gray-700" />}
         </button>
      </div>

      {/* Embedded Panel (FilterBar & Properties List/Details) on the right */}
      <div 
        style={{ width: isPanelOpen ? 'max(400px, min(40vw, 600px))' : '0px' }}
        className="h-full bg-white overflow-hidden shadow-2xl border-l border-gray-200 transition-all duration-500 ease-in-out shrink-0 z-10"
      >
        <div 
          style={{ width: 'max(400px, min(40vw, 600px))' }} 
          className="flex flex-col h-full overflow-y-auto p-6 scrollbar-hide relative"
        >
          {!selectedProperty ? (
            <>
              <FilterBar />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-6 mt-4 pb-8">
                {properties.map(p => (
                  <PropertyCard 
                    key={p.id} 
                    imageSrc={p.imageSrc}
                    price={p.price}
                    address={p.address}
                    specs={p.specs}
                    isSelected={selectedPropertyId === p.id}
                    onClick={() => handleSelectProperty(p.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setSelectedPropertyId(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit font-medium"
              >
                <ArrowLeft className="w-5 h-5" /> Back to search
              </button>

              <div className="flex flex-col gap-4">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                  <Image 
                    src={selectedProperty.imageSrc} 
                    alt={selectedProperty.address} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">{selectedProperty.price}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" /> 
                    <span className="text-lg leading-tight">{selectedProperty.address}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-2">
                  <p className="font-semibold text-gray-700">{selectedProperty.specs}</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 active:scale-[0.98]">
                    Contact Agent
                  </button>
                  <button className="px-6 bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
