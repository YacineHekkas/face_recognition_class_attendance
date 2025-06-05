"use client"

import { useState, useEffect } from "react"
import { useStudents } from "../contexts/StudentsContext"
import { FaUserCheck, FaUserTimes, FaSync } from "react-icons/fa"

export default function PresentScreen() {
  const { students, presentIds, refreshStudents } = useStudents()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const present = students.filter((s) => presentIds.includes(s.id))
  const absent = students.filter((s) => !presentIds.includes(s.id))

  // Set up automatic refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshStudents()
      setLastUpdated(new Date())
    }, 10000)

    return () => clearInterval(intervalId)
  }, [refreshStudents])

  const handleManualRefresh = () => {
    refreshStudents()
    setLastUpdated(new Date())
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Attendance Status</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={handleManualRefresh}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaSync />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 p-2 rounded-full mr-2">
              <FaUserCheck className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Present Students ({present.length})</h3>
          </div>

          {present.length === 0 ? (
            <p className="text-gray-500 text-sm ml-10">No students present yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-10">
              {present.map((s) => (
                <div key={s.id} className="flex items-center p-2 bg-green-50 rounded-lg">
                  <div className="bg-green-100 text-green-700 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm">{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-3">
            <div className="bg-red-100 p-2 rounded-full mr-2">
              <FaUserTimes className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Absent Students ({absent.length})</h3>
          </div>

          {absent.length === 0 ? (
            <p className="text-gray-500 text-sm ml-10">All students are present.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-10">
              {absent.map((s) => (
                <div key={s.id} className="flex items-center p-2 bg-red-50 rounded-lg">
                  <div className="bg-red-100 text-red-700 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm">{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
