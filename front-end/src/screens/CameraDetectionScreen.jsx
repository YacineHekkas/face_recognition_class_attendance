"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { StudentsProvider, useStudents } from "../contexts/StudentsContext"
import { FaChevronLeft, FaCamera, FaUserCheck, FaCog, FaExpand, FaCompress } from "react-icons/fa"

const API = "http://localhost:8000/api"

export default function CameraDetectionWrapper() {
  const { id } = useParams()
  return (
    <StudentsProvider classId={id}>
      <CameraDetectionScreen classId={id} />
    </StudentsProvider>
  )
}

function CameraDetectionScreen({ classId }) {
  const { students, markPresent, presentIds } = useStudents()
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedFaces, setDetectedFaces] = useState([])
  const [classDetails, setClassDetails] = useState(null)
  const [lastDetection, setLastDetection] = useState(null)
  const [settings, setSettings] = useState({
    showSettings: false,
    detectionThreshold: 0.7,
    detectionFrequency: 1000,
    cameraResolution: "hd",
  })
  const [fullscreen, setFullscreen] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const containerRef = useRef(null)

  // Fetch class details
  useEffect(() => {
    fetch(`${API}/classes/${classId}/`)
      .then((res) => res.json())
      .then(setClassDetails)
      .catch(console.error)
  }, [classId])

  // Start/stop camera
  const toggleCamera = async () => {
    if (isDetecting) {
      // Stop detection
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      setIsDetecting(false)
      return
    }

    try {
      // Get camera constraints based on settings
      const constraints = {
        video: {
          facingMode: "user",
          width: settings.cameraResolution === "hd" ? 1280 : 640,
          height: settings.cameraResolution === "hd" ? 720 : 480,
        },
        audio: false,
      }

      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsDetecting(true)

      // In a real app, you would start face detection here
      // For demo purposes, we'll simulate detections
      simulateFaceDetection()
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Simulate face detection (in a real app, this would be replaced with actual face detection)
  const simulateFaceDetection = () => {
    if (!isDetecting) return

    // This is just a simulation - in a real app you would use a face detection library
    const detectInterval = setInterval(() => {
      if (!isDetecting) {
        clearInterval(detectInterval)
        return
      }

      // Randomly select a student to "detect" (for demo purposes)
      const undetectedStudents = students.filter((s) => !presentIds.includes(s.id))

      if (undetectedStudents.length > 0) {
        const randomIndex = Math.floor(Math.random() * undetectedStudents.length)
        const detectedStudent = undetectedStudents[randomIndex]

        // Mark the student as present
        markPresent(detectedStudent.id)

        // Update UI
        setDetectedFaces((prev) =>
          [
            {
              id: detectedStudent.id,
              name: detectedStudent.name,
              time: new Date(),
              confidence: Math.random() * 0.3 + 0.7,
            },
            ...prev,
          ].slice(0, 10),
        )

        setLastDetection({
          id: detectedStudent.id,
          name: detectedStudent.name,
          time: new Date(),
          confidence: Math.random() * 0.3 + 0.7,
        })
      }
    }, settings.detectionFrequency) // Use the detection frequency from settings

    return () => clearInterval(detectInterval)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setFullscreen(false)
    }
  }

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement,
      )
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  return (
    <div ref={containerRef} className={`${fullscreen ? "fixed inset-0 z-50 bg-gray-900 p-4" : ""}`}>
      <div className={`mb-6 ${fullscreen ? "text-white" : ""}`}>
        {!fullscreen && (
          <Link
            to={`/classes/${classId}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mb-4"
          >
            <FaChevronLeft className="mr-1" /> Back to Class Details
          </Link>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Face Detection</h2>
            {classDetails && <p className="text-gray-500 dark:text-gray-400">Class: {classDetails.name}</p>}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setSettings({ ...settings, showSettings: !settings.showSettings })}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              aria-label="Settings"
            >
              <FaCog />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <FaCompress /> : <FaExpand />}
            </button>

            <button
              onClick={toggleCamera}
              className={`flex items-center justify-center ${
                isDetecting ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
              } text-white px-4 py-2 rounded-lg shadow transition-colors`}
            >
              <FaCamera className="mr-2" /> {isDetecting ? "Stop Camera" : "Start Camera"}
            </button>
          </div>
        </div>
      </div>

      {settings.showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">Detection Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detection Threshold ({settings.detectionThreshold})
              </label>
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.05"
                value={settings.detectionThreshold}
                onChange={(e) => setSettings({ ...settings, detectionThreshold: Number.parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Higher values require more confidence for a positive match
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detection Frequency (ms)
              </label>
              <select
                value={settings.detectionFrequency}
                onChange={(e) => setSettings({ ...settings, detectionFrequency: Number.parseInt(e.target.value) })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="500">Fast (500ms)</option>
                <option value="1000">Normal (1000ms)</option>
                <option value="2000">Slow (2000ms)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Camera Resolution
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="resolution"
                    value="standard"
                    checked={settings.cameraResolution === "standard"}
                    onChange={() => setSettings({ ...settings, cameraResolution: "standard" })}
                    className="form-radio h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Standard (640x480)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="resolution"
                    value="hd"
                    checked={settings.cameraResolution === "hd"}
                    onChange={() => setSettings({ ...settings, cameraResolution: "hd" })}
                    className="form-radio h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">HD (1280x720)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${fullscreen ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6`}>
        <div className={`${fullscreen ? "lg:col-span-3" : "lg:col-span-2"}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-white">Camera Feed</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">{isDetecting ? "Active" : "Inactive"}</div>
            </div>
            <div className="p-4">
              {isDetecting ? (
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>

                  {lastDetection && (
                    <div className="absolute bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-lg shadow-lg animate-fadeIn">
                      <div className="flex items-center">
                        <FaUserCheck className="mr-2" />
                        <div>
                          <p className="font-medium">{lastDetection.name}</p>
                          <div className="flex items-center">
                            <p className="text-xs opacity-80">Marked present</p>
                            <span className="ml-2 text-xs bg-white bg-opacity-20 px-1 rounded">
                              {Math.round(lastDetection.confidence * 100)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center aspect-video">
                  <div className="text-center p-6">
                    <FaCamera className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Click "Start Camera" to begin face detection</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">Recent Detections</h3>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: fullscreen ? "calc(100vh - 250px)" : "400px" }}>
              {detectedFaces.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No faces detected yet</p>
                  <p className="text-sm">Start the camera to begin detection</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detectedFaces.map((face, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                        {face.name.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800 dark:text-white">{face.name}</p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{face.time.toLocaleTimeString()}</p>
                          <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-1 rounded">
                            {Math.round(face.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                        Present
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
