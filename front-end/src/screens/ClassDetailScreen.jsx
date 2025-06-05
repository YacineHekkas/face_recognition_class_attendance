"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { StudentsProvider, useStudents } from "../contexts/StudentsContext"
import Modal from "../components/Modal"
import { FaUserPlus, FaCamera, FaChevronLeft, FaCheck, FaTimes } from "react-icons/fa"
import AttendanceStats from "../components/AttendanceStats"
import SearchBar from "../components/SearchBar"
import ExportButton from "../components/ExportButton"
import PrintStyles from "../components/PrintStyles"

const API = "http://localhost:8000/api"

export default function ClassDetailWrapper() {
  const { id } = useParams()
  return (
    <StudentsProvider classId={id}>
      <ClassDetailScreen classId={id} />
    </StudentsProvider>
  )
}

function ClassDetailScreen({ classId }) {
  // Add PrintStyles component for PDF export
  return (
    <>
      <PrintStyles />
      <ClassDetailContent classId={classId} />
    </>
  )
}

function ClassDetailContent({ classId }) {
  const { students, addStudent, loading, error } = useStudents()
  const [attendanceList, setAttendanceList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [matricule, setMatricule] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [files, setFiles] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(true)
  const [classDetails, setClassDetails] = useState(null)
  const [activeTab, setActiveTab] = useState("attendance")
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Fetch class details
    fetch(`${API}/classes/${classId}/`)
      .then((res) => res.json())
      .then(setClassDetails)
      .catch(console.error)
  }, [classId])

  const fetchAttendance = useCallback(() => {
    setAttendanceLoading(true)
    fetch(`${API}/attendance/?classe_id=${classId}`)
      .then((res) => res.json())
      .then((data) => {
        setAttendanceList(data)
        setAttendanceLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err)
        setAttendanceLoading(false)
      })
  }, [classId])

  // Set up polling for attendance updates
  useEffect(() => {
    // Initial fetch
    fetchAttendance()

    // Set up polling every 10 seconds
    const intervalId = setInterval(() => {
      fetchAttendance()
    }, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [classId, fetchAttendance])

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = students.filter(
      (student) => student.name.toLowerCase().includes(query) || student.matricule.toLowerCase().includes(query),
    )
    setFilteredStudents(filtered)
  }, [students, searchQuery])

  const sessionsCount = (id) => attendanceList.find((a) => a.student === Number(id))?.history.length || 0

  const handleAdd = async () => {
    const success = await addStudent({
      matricule,
      first_name: firstName,
      last_name: lastName,
      files,
    })

    if (success) {
      // refresh attendance
      fetchAttendance()
      setMatricule("")
      setFirstName("")
      setLastName("")
      setFiles([])
      setShowModal(false)
    }
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  if (loading || attendanceLoading) {
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
      <div className="mb-6">
        <Link
          to="/classes"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mb-4"
        >
          <FaChevronLeft className="mr-1" /> Back to Classes
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {classDetails?.name || "Class Details"}
            </h2>
            {classDetails && <p className="text-gray-500 dark:text-gray-400">Code: {classDetails.code}</p>}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={fetchAttendance} className="btn-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            <ExportButton students={students} attendanceList={attendanceList} classDetails={classDetails} />

            <Link
              to={`/classes/${classId}/camera`}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition-colors"
            >
              <FaCamera className="mr-2" /> Start Detection
            </Link>

            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center justify-center">
              <FaUserPlus className="mr-2" /> Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Student List and Attendance Record - Now BEFORE the stats */}
      <div className="card mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "attendance"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Attendance Record
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "students"
                  ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Student List
            </button>
          </nav>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar onSearch={handleSearch} />
        </div>

        {activeTab === "attendance" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  {[1, 2, 3, 4].map((n) => (
                    <th
                      key={n}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Session {n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((s) => {
                  const count = sessionsCount(s.id)
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {s.matricule}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{s.name}</td>
                      {[1, 2, 3, 4].map((n) => (
                        <td key={n} className="px-6 py-4 whitespace-nowrap text-center">
                          {count >= n ? (
                            <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 h-8 w-8 rounded-full">
                              <FaCheck className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 h-8 w-8 rounded-full">
                              <FaTimes className="h-4 w-4" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      {students.length === 0
                        ? "No students found. Add students to track attendance."
                        : "No matching students found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full h-10 w-10 flex items-center justify-center">
                      {student.firstName.charAt(0)}
                      {student.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.matricule}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  {students.length === 0
                    ? "No students found. Add students to get started."
                    : "No matching students found."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Component - Now AFTER the student list */}
      <AttendanceStats classId={classId} students={students} attendanceList={attendanceList} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <div className="space-y-4">
          <div>
            <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matricule
            </label>
            <input
              id="matricule"
              type="text"
              placeholder="Enter student ID"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Photos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaCamera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                  >
                    <span>Upload photos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                {files.length > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {files.length} {files.length === 1 ? "file" : "files"} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button onClick={handleAdd} className="btn-primary flex items-center">
              <FaUserPlus className="mr-2" /> Add Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
