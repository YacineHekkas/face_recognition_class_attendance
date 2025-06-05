"use client"

import { useState, useEffect } from "react"
import { FaCalendarAlt, FaUserCheck, FaUserTimes, FaChartBar } from "react-icons/fa"

export default function AttendanceStats({ classId, students, attendanceList }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    lastSessionAttendance: 0,
    attendanceTrend: [],
  })

  useEffect(() => {
    if (!students.length || !attendanceList.length) return

    // Calculate statistics
    const totalStudents = students.length

    // Get attendance counts for each session
    const sessionCounts = {}
    attendanceList.forEach((record) => {
      const historyLength = record.history?.length || 0
      for (let i = 1; i <= historyLength; i++) {
        sessionCounts[i] = (sessionCounts[i] || 0) + 1
      }
    })

    // Calculate average attendance
    const sessionValues = Object.values(sessionCounts)
    const averageAttendance = sessionValues.length
      ? Math.round((sessionValues.reduce((a, b) => a + b, 0) / sessionValues.length / totalStudents) * 100)
      : 0

    // Get last session attendance
    const lastSession = Math.max(...Object.keys(sessionCounts).map(Number), 0)
    const lastSessionAttendance = lastSession ? Math.round((sessionCounts[lastSession] / totalStudents) * 100) : 0

    // Create attendance trend data (for last 4 sessions)
    const attendanceTrend = []
    for (let i = 1; i <= 4; i++) {
      if (sessionCounts[i]) {
        attendanceTrend.push({
          session: i,
          percentage: Math.round((sessionCounts[i] / totalStudents) * 100),
        })
      }
    }

    setStats({
      totalStudents,
      averageAttendance,
      lastSessionAttendance,
      attendanceTrend,
    })
  }, [students, attendanceList])

  return (
    <div className="card mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
          <FaChartBar className="mr-2 text-emerald-500 dark:text-emerald-400" />
          Attendance Overview
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center mb-2">
              <div className="bg-emerald-100 dark:bg-emerald-800/50 p-2 rounded-full mr-2">
                <FaUserCheck className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Total Students</h4>
            </div>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.totalStudents}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-2">
                <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Average Attendance</h4>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.averageAttendance}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 dark:bg-purple-800/50 p-2 rounded-full mr-2">
                <FaUserTimes className="text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Last Session</h4>
            </div>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.lastSessionAttendance}%</p>
          </div>
        </div>

        {stats.attendanceTrend.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Attendance Trend</h4>

            {/* COMPLETELY REDESIGNED CHART WITH NO GAP */}
            <div className="mt-2" style={{ height: "180px" }}>
              <div className="flex h-full">
                {stats.attendanceTrend.map((item) => (
                  <div key={item.session} className="flex-1 flex flex-col items-center justify-end mx-2">
                    {/* Percentage label */}
                    <div className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      {item.percentage}%
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-md"
                      style={{
                        height: `${Math.max(item.percentage, 5)}%`,
                        minHeight: "10px",
                        transition: "height 0.5s ease-in-out",
                      }}
                    ></div>

                    {/* Session label */}
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                      Session {item.session}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
