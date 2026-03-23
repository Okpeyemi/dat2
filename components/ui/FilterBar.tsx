import { MapPin, Search, ChevronDown } from "lucide-react";

export function FilterBar() {
  return (
    <div className="flex flex-col gap-5 mb-6">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
        Find your dream apartment
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
        <span className="text-gray-900 font-semibold cursor-pointer">Buy</span>
        <span>/</span>
        <span className="hover:text-gray-900 cursor-pointer transition-colors">Rent</span>
        <span>/</span>
        <span className="hover:text-gray-900 cursor-pointer transition-colors">Sell</span>
        <span>/</span>
        <span className="hover:text-gray-900 cursor-pointer transition-colors">Realtor selection</span>
      </div>

      {/* Filter Pill */}
      <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 w-fit">
        {/* Type */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
          New home
          <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* Price */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors">
          $600 000 - $900 000
          <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* Location */}
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-medium whitespace-nowrap">
          <MapPin className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
          <input 
            type="text" 
            defaultValue="Los Angeles" 
            className="outline-none bg-transparent w-24 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Search Button */}
        <button className="bg-gray-900 text-white p-3 rounded-xl hover:bg-black transition-colors ml-1">
          <Search className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
