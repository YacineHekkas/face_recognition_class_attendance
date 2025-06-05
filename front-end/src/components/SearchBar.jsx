"use client"

import { useState } from "react"
import { FaSearch } from "react-icons/fa"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search students..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input pl-10 pr-4 py-2"
      />
      <button
        type="submit"
        className="absolute left-0 top-0 h-full px-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        <FaSearch />
      </button>
    </form>
  )
}
