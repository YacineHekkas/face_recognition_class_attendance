"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useClasses } from "../contexts/ClassesContext"
import Modal from "../components/Modal"
import { FaPlus, FaChalkboardTeacher, FaUserGraduate, FaCamera } from "react-icons/fa"

export default function ClassListScreen() {
  const { classes, newName, setNewName, newCode, setNewCode, addClass, loading, error } = useClasses()
  const [showModal, setShowModal] = useState(false)

  const handleAddClass = async () => {
    const success = await addClass()
    if (success) {
      setShowModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 dark:border-emerald-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Class Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your classes and track attendance</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center justify-center">
          <FaPlus className="mr-2" /> Add New Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            <FaChalkboardTeacher className="text-emerald-600 dark:text-emerald-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Classes Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first class</p>
          <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center justify-center">
            <FaPlus className="mr-2" /> Add New Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <Link key={c.id} to={`/classes/${c.id}`} className="group card card-hover flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 h-24 flex items-center justify-center">
                <FaUserGraduate className="text-white text-4xl opacity-75" />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {c.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Code: {c.code}</p>
              </div>
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <FaCamera className="mr-2" />
                  <span>View Attendance</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Class">
        <div className="space-y-4">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              placeholder="e.g. Computer Science 101"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="classCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class Code
            </label>
            <input
              id="classCode"
              type="text"
              placeholder="e.g. CS101"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button onClick={handleAddClass} className="btn-primary flex items-center">
              <FaPlus className="mr-2" /> Create Class
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
