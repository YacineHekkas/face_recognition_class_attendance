"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useClasses } from "../contexts/ClassesContext"
import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaCamera } from "react-icons/fa"

const API = "http://localhost:8000/api"

export default function DashboardScreen() {
  const { classes, loading: classesLoading } = useClasses()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // In a real app, you would have a dedicated endpoint for dashboard stats
        // This is a simulation using the existing endpoints

        // Get all students
        const studentsRes = await fetch(`${API}/students/`)
        const students = await studentsRes.json()

        // Get attendance data
        const attendanceRes = await fetch(`${API}/attendance/`)
        const attendance = await attendanceRes.json()

        // Calculate stats
        const totalStudents = students.length
        const totalAttendance = attendance.reduce((sum, record) => sum + (record.history?.length || 0), 0)

        // Create recent activity (simulated)
        const recentActivity = [
          { id: 1, type: "attendance", message: "John Doe was marked present in CS101", time: "10 minutes ago" },
          { id: 2, type: "class", message: 'New class "Machine Learning" was created', time: "1 hour ago" },
          { id: 3, type: "student", message: "Sarah Johnson was added to Database Systems", time: "3 hours ago" },
          {
            id: 4,
            type: "attendance",
            message: "Attendance report for Web Development was generated",
            time: "5 hours ago",
          },
        ]

        setStats({
          totalStudents,
          totalAttendance,
          recentActivity,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading || classesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-500">
            <FaChalkboardTeacher className="text-white text-3xl" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Classes</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{classes.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-500">
            <FaUserGraduate className="text-white text-3xl" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-purple-500 to-pink-500">
            <FaCalendarAlt className="text-white text-3xl" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Attendances</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalAttendance}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-yellow-500 to-orange-500">
            <FaCamera className="text-white text-3xl" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Detection Rate</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">95%</p>
          </div>
        </div>
      </div>

      {/* Recent Classes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-white">Recent Classes</h3>
          <Link
            to="/classes"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View All
          </Link>
        </div>

        <div className="p-6">
          {classes.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No classes found. Create your first class to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={`/classes/${c.id}`}
                  className="group bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-200 p-4 flex items-center space-x-3"
                >
                  <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 p-3 rounded-full">
                    <FaChalkboardTeacher />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Code: {c.code}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start">
                <div className="mr-3">
                  {activity.type === "attendance" && (
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <FaUserGraduate className="text-green-600 dark:text-green-400" />
                    </div>
                  )}
                  {activity.type === "class" && (
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  {activity.type === "student" && (
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <FaUserGraduate className="text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
