"use client"

import { createContext, useContext, useState, useEffect } from "react"
const API = "http://localhost:8000/api"
const StudentsContext = createContext()

export function StudentsProvider({ classId, children }) {
  const [students, setStudents] = useState([])
  const [presentIds, setPresentIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [classId])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/students/?classe_id=${classId}`)
      if (!res.ok) throw new Error("Failed to fetch students")

      const data = await res.json()
      setStudents(
        data.map((s) => ({
          id: s.id.toString(),
          name: `${s.first_name} ${s.last_name}`,
          matricule: s.matricule,
          firstName: s.first_name,
          lastName: s.last_name,
        })),
      )
      setError(null)
    } catch (err) {
      console.error("Error fetching students:", err)
      setError("Failed to load students. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const addStudent = async ({ matricule, first_name, last_name, files }) => {
    try {
      const res = await fetch(`${API}/students/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule,
          first_name,
          last_name,
          classe: classId,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      const student = await res.json()

      if (files && files.length) {
        const form = new FormData()
        form.append("student", student.id)
        files.forEach((f) => form.append("images", f))

        const photoRes = await fetch(`${API}/photos/`, {
          method: "POST",
          body: form,
        })

        if (!photoRes.ok) {
          console.warn("Failed to upload photos, but student was created")
        }
      }

      setStudents((prev) => [
        ...prev,
        {
          id: student.id.toString(),
          name: `${student.first_name} ${student.last_name}`,
          matricule: student.matricule,
          firstName: student.first_name,
          lastName: student.last_name,
        },
      ])

      return true
    } catch (e) {
      console.error("addStudent error:", e)
      alert("Failed to create student: " + e.message)
      return false
    }
  }

  const markPresent = async (id) => {
    // Update local state immediately
    setPresentIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

    // You can also send this to your API if needed
    try {
      // This is a placeholder - replace with your actual API endpoint
      await fetch(`${API}/attendance/mark-present/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: id,
          class_id: classId,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error marking student present:", error)
    }
  }

  return (
    <StudentsContext.Provider
      value={{
        students,
        presentIds,
        addStudent,
        markPresent,
        loading,
        error,
        refreshStudents: fetchStudents,
      }}
    >
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
