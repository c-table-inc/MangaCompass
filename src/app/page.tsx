export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          MangaCompass
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover Your Next Favorite Manga
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 text-lg rounded-lg transition-colors">
            See Demo
          </button>
        </div>
      </div>
    </div>
  )
}