import { Link } from "react-router-dom"
import { FaHome, FaExclamationTriangle } from "react-icons/fa"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-yellow-100 p-4 rounded-full mb-6">
        <FaExclamationTriangle className="text-yellow-500 text-4xl" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow transition-colors"
      >
        <FaHome className="mr-2" /> Go to Dashboard
      </Link>
    </div>
  )
}
