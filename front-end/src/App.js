"use client"

import { Routes, Route, Link, Navigate } from "react-router-dom"
import { ClassesProvider } from "./contexts/ClassesContext"
import ClassListScreen from "./screens/ClassListScreen"
import ClassDetailWrapper from "./screens/ClassDetailScreen"
import NotFound from "./screens/NotFound"
import CameraDetectionScreen from "./screens/CameraDetectionScreen"
import DashboardScreen from "./screens/DashboardScreen"
import { FaChalkboardTeacher, FaUserGraduate, FaTachometerAlt } from "react-icons/fa"
import ThemeToggle from "./components/ThemeToggle"
import NotificationBell from "./components/NotificationBell"
import { useState } from "react"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ClassesProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm dark:shadow-dark-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white p-2 rounded-lg shadow-sm">
                    <FaChalkboardTeacher className="text-xl" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">FaceAttend</h1>
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/classes"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <FaUserGraduate />
                  <span>Classes</span>
                </Link>
              </nav>

              <div className="flex items-center space-x-3">
                <NotificationBell />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="absolute top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-dark-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white p-2 rounded-lg shadow-sm">
                  <FaChalkboardTeacher className="text-xl" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">FaceAttend</h1>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/classes"
                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaUserGraduate />
                    <span>Classes</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/classes" element={<ClassListScreen />} />
            <Route path="/classes/:id" element={<ClassDetailWrapper />} />
            <Route path="/classes/:id/camera" element={<CameraDetectionScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 shadow-sm dark:shadow-dark-sm">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FaceAttend - Attendance Management System
          </div>
        </footer>
      </div>
    </ClassesProvider>
  )
}
