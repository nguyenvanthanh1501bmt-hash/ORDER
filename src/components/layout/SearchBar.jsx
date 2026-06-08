'use client';

import { Search, Calendar, DollarSign } from "lucide-react";

export default function Filterlist({
  searchName,
  setSearchName,
  showSearchName = false,

  searchCreate,
  setSearchCreate,
  showSearchCreate = false,

  searchPrice,
  setSearchPrice,
  showSearchPrice = false,

  className = ''
}) {
  const baseInput = `
    w-full rounded-lg border border-gray-200
    bg-white
    pl-10 pr-3 py-2.5 text-sm
    shadow-sm
    outline-none
    transition
    placeholder:text-gray-400
    hover:border-gray-300
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
  `

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>

      {showSearchName && (
        <div className="relative w-64">
          <Search size={16} className={iconClass} />
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={baseInput}
          />
        </div>
      )}

      {showSearchCreate && (
        <div className="relative">
          <Calendar size={16} className={iconClass} />
          <input
            type="date"
            value={searchCreate}
            onChange={(e) => setSearchCreate(e.target.value)}
            className={baseInput}
          />
        </div>
      )}

      {showSearchPrice && (
        <div className="relative w-48">
          <DollarSign size={16} className={iconClass} />
          <input
            type="number"
            placeholder="Max price"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            className={baseInput}
          />
        </div>
      )}

    </div>
  );
}
