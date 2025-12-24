"use client";

import { Search } from "lucide-react";

export default function SearchByName({ value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Search by name</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name..."
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="border rounded pl-8 pr-2 py-1 w-full"
        />
        <Search
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
    </div>
  );
}
