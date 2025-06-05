"use client"

import { useState } from "react"
import { FaFileExport, FaFileCsv, FaFilePdf, FaFileExcel } from "react-icons/fa"

export default function ExportButton({ students, attendanceList, className, classDetails }) {
  const [showOptions, setShowOptions] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Prepare attendance data in tabular format
  const prepareAttendanceData = () => {
    // Create headers for the table
    const headers = ["Matricule", "Student Name", "Session 1", "Session 2", "Session 3", "Session 4", "Total"]

    // Create rows for each student
    const rows = students.map((student) => {
      const attendance = attendanceList.find((a) => a.student === Number(student.id))
      const sessionsCount = attendance?.history?.length || 0

      // Create an array for each row with attendance status
      return [
        student.matricule,
        student.name,
        sessionsCount >= 1 ? "Present" : "Absent",
        sessionsCount >= 2 ? "Present" : "Absent",
        sessionsCount >= 3 ? "Present" : "Absent",
        sessionsCount >= 4 ? "Present" : "Absent",
        `${sessionsCount}/4`,
      ]
    })

    return { headers, rows }
  }

  const exportToCSV = () => {
    setExporting(true)
    try {
      const { headers, rows } = prepareAttendanceData()

      // Convert to CSV
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance_${classDetails?.name || "class"}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      alert("Failed to export to CSV. Please try again.")
    } finally {
      setExporting(false)
      setShowOptions(false)
    }
  }

  const exportToPDF = () => {
    setExporting(true)
    try {
      const { headers, rows } = prepareAttendanceData()

      // Create a hidden div for printing
      const printContent = document.createElement("div")
      printContent.style.display = "none"
      printContent.className = "print-content"

      // Add class details
      const title = document.createElement("h1")
      title.textContent = classDetails?.name || "Class Attendance"
      title.style.fontSize = "24px"
      title.style.marginBottom = "8px"
      title.style.color = "#10b981" // emerald-500

      const classCode = document.createElement("p")
      classCode.textContent = `Class Code: ${classDetails?.code || ""}`
      classCode.style.fontSize = "16px"
      classCode.style.marginBottom = "16px"

      const date = document.createElement("p")
      date.textContent = `Report Generated: ${new Date().toLocaleDateString()}`
      date.style.fontSize = "14px"
      date.style.marginBottom = "24px"
      date.style.color = "#6b7280" // gray-500

      // Create attendance table
      const table = document.createElement("table")
      table.style.width = "100%"
      table.style.borderCollapse = "collapse"
      table.style.marginBottom = "24px"

      // Add header row
      const thead = document.createElement("thead")
      const headerRow = document.createElement("tr")

      headers.forEach((headerText) => {
        const th = document.createElement("th")
        th.textContent = headerText
        th.style.backgroundColor = "#10b981" // emerald-500
        th.style.color = "white"
        th.style.padding = "10px"
        th.style.textAlign = "left"
        th.style.border = "1px solid #e5e7eb"
        headerRow.appendChild(th)
      })

      thead.appendChild(headerRow)
      table.appendChild(thead)

      // Add data rows
      const tbody = document.createElement("tbody")

      rows.forEach((rowData, i) => {
        const tr = document.createElement("tr")
        tr.style.backgroundColor = i % 2 === 0 ? "#f9fafb" : "#ffffff"

        rowData.forEach((cellData, j) => {
          const td = document.createElement("td")
          td.textContent = cellData
          td.style.padding = "10px"
          td.style.border = "1px solid #e5e7eb"

          // Style present/absent cells
          if (j >= 2 && j <= 5) {
            if (cellData === "Present") {
              td.style.color = "#059669" // emerald-600
              td.style.backgroundColor = "#d1fae5" // emerald-100
            } else {
              td.style.color = "#dc2626" // red-600
              td.style.backgroundColor = "#fee2e2" // red-100
            }
          }

          tr.appendChild(td)
        })

        tbody.appendChild(tr)
      })

      table.appendChild(tbody)

      // Add summary
      const summary = document.createElement("div")
      summary.style.marginTop = "24px"
      summary.style.fontSize = "14px"

      const totalStudents = document.createElement("p")
      totalStudents.textContent = `Total Students: ${students.length}`
      totalStudents.style.marginBottom = "8px"

      summary.appendChild(totalStudents)

      // Assemble the print content
      printContent.appendChild(title)
      printContent.appendChild(classCode)
      printContent.appendChild(date)
      printContent.appendChild(table)
      printContent.appendChild(summary)

      // Add to document and print
      document.body.appendChild(printContent)

      const originalTitle = document.title
      document.title = `${classDetails?.name || "Class"} Attendance Report`

      window.print()

      // Clean up
      document.title = originalTitle
      document.body.removeChild(printContent)
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      alert("Failed to export to PDF. Please try again.")
    } finally {
      setExporting(false)
      setShowOptions(false)
    }
  }

  const exportToExcel = () => {
    setExporting(true)
    try {
      const { headers, rows } = prepareAttendanceData()

      // Create Excel content with proper formatting
      let excelContent =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"
      excelContent +=
        "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Attendance</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>"
      excelContent += "<body>"

      // Add title and class info
      excelContent += `<h1>${classDetails?.name || "Class"} Attendance</h1>`
      excelContent += `<p>Class Code: ${classDetails?.code || ""}</p>`
      excelContent += `<p>Generated: ${new Date().toLocaleDateString()}</p>`

      // Create table
      excelContent += "<table border='1'>"

      // Add header row
      excelContent += "<tr style='background-color:#10b981; color:white;'>"
      headers.forEach((header) => {
        excelContent += `<th>${header}</th>`
      })
      excelContent += "</tr>"

      // Add data rows
      rows.forEach((row, i) => {
        excelContent += `<tr${i % 2 === 0 ? " style='background-color:#f9fafb;'" : ""}>`

        row.forEach((cell, j) => {
          // Style present/absent cells
          if (j >= 2 && j <= 5) {
            if (cell === "Present") {
              excelContent += `<td style='color:#059669; background-color:#d1fae5;'>${cell}</td>`
            } else {
              excelContent += `<td style='color:#dc2626; background-color:#fee2e2;'>${cell}</td>`
            }
          } else {
            excelContent += `<td>${cell}</td>`
          }
        })

        excelContent += "</tr>"
      })

      excelContent += "</table>"
      excelContent += "</body></html>"

      // Create a Blob with the Excel content
      const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" })
      const url = URL.createObjectURL(blob)

      // Create download link
      const a = document.createElement("a")
      a.href = url
      a.download = `${classDetails?.name || "class"}_attendance.xls`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export to Excel. Please try again.")
    } finally {
      setExporting(false)
      setShowOptions(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={exporting}
        className={`btn-primary flex items-center justify-center ${className} ${exporting ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        {exporting ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Exporting...
          </>
        ) : (
          <>
            <FaFileExport className="mr-2" /> Export
          </>
        )}
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg dark:shadow-dark-lg z-10 py-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={exportToCSV}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FaFileCsv className="mr-2 text-green-600 dark:text-green-500" /> Export as CSV
          </button>
          <button
            onClick={exportToPDF}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FaFilePdf className="mr-2 text-red-600 dark:text-red-500" /> Export as PDF
          </button>
          <button
            onClick={exportToExcel}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FaFileExcel className="mr-2 text-emerald-600 dark:text-emerald-500" /> Export as Excel
          </button>
        </div>
      )}
    </div>
  )
}
