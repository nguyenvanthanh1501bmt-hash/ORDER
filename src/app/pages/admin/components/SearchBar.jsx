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
    return (
        <div className={`flex gap-4 ${className}`}>
          {showSearchName && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="border rounded pl-8 pr-2 py-1 w-full"
              />
            </div>
          )}

          {showSearchCreate && (
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={searchCreate}
                onChange={(e) => setSearchCreate(e.target.value)}
                className="border rounded pl-8 pr-2 py-1"
              />
            </div>
          )}

          {showSearchPrice && (
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="Max price..."
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="border rounded pl-8 pr-2 py-1 w-full"
              />
            </div>
          )}
        </div>
    )
}
