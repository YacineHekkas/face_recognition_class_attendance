"use client"

import { useEffect } from "react"

export default function PrintStyles() {
  useEffect(() => {
    // Create a style element for print styles
    const style = document.createElement("style")
    style.type = "text/css"
    style.media = "print"

    // Add print-specific styles
    style.innerHTML = `
      @page {
        size: auto;
        margin: 20mm;
      }
      
      body {
        font-family: Arial, sans-serif;
        color: #000;
        background-color: #fff;
      }
      
      /* Hide everything except the print content */
      body > *:not(.print-content) {
        display: none !important;
      }
      
      .print-content {
        display: block !important;
      }
      
      h1 {
        color: #10b981;
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      
      th {
        background-color: #10b981 !important;
        color: white !important;
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      td {
        padding: 10px;
        border: 1px solid #ddd;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      tr:nth-child(even) {
        background-color: #f9fafb;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `

    // Add the style element to the document head
    document.head.appendChild(style)

    // Clean up on unmount
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
