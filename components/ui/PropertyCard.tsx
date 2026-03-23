import { MapPin } from "lucide-react";
import Image from "next/image";

interface PropertyCardProps {
  imageSrc: string;
  price: string;
  address: string;
  specs: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PropertyCard({ imageSrc, price, address, specs, isSelected, onClick }: PropertyCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col gap-3 group cursor-pointer p-3 rounded-2xl transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-50/50 ring-2 ring-blue-500/30' 
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
        <Image 
          src={imageSrc} 
          alt={address} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900">{price}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-4 h-4 shrink-0" strokeWidth={2.5} />
          <span className="truncate">{address}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 font-medium">{specs}</p>
      </div>
    </div>
  );
}
