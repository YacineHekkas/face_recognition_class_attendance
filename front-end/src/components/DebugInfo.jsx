"use client"

import { useState } from "react"

export default function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)
  const [info, setInfo] = useState({
    tailwindLoaded: false,
    iconsLoaded: false,
    reactRouterLoaded: false,
  })

  // Check if Tailwind is loaded
  const checkTailwind = () => {
    // Check if a basic Tailwind class works
    const testElement = document.createElement("div")
    testElement.className = "bg-red-500"
    document.body.appendChild(testElement)
    const styles = window.getComputedStyle(testElement)
    const hasTailwind = styles.backgroundColor === "rgb(239, 68, 68)" || styles.backgroundColor === "rgb(220, 38, 38)"
    document.body.removeChild(testElement)
    return hasTailwind
  }

  // Check if React Icons are loaded
  const checkIcons = () => {
    try {
      // This is a simple check to see if the FaHome component exists
      return typeof window !== "undefined" && !!require("react-icons/fa").FaHome
    } catch (e) {
      return false
    }
  }

  // Check if React Router is loaded
  const checkReactRouter = () => {
    try {
      return typeof window !== "undefined" && !!require("react-router-dom").BrowserRouter
    } catch (e) {
      return false
    }
  }

  const runDiagnostics = () => {
    setInfo({
      tailwindLoaded: checkTailwind(),
      iconsLoaded: checkIcons(),
      reactRouterLoaded: checkReactRouter(),
    })
    setShowDebug(true)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={runDiagnostics}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors"
      >
        Run Diagnostics
      </button>

      {showDebug && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Diagnostics Results</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Tailwind CSS:</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  info.tailwindLoaded
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {info.tailwindLoaded ? "Loaded" : "Not Loaded"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">React Icons:</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  info.iconsLoaded
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {info.iconsLoaded ? "Loaded" : "Not Loaded"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">React Router:</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  info.reactRouterLoaded
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {info.reactRouterLoaded ? "Loaded" : "Not Loaded"}
              </span>
            </li>
          </ul>
          <button
            onClick={() => setShowDebug(false)}
            className="mt-4 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
