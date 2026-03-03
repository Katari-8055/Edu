import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-4xl text-indigo-700 font-bold mb-4">Welcome to Your Edu Portal</h1>
      <p className="text-gray-600 max-w-lg">Engage in community discussion and enroll in high-quality next-generation courses today!</p>
    </div>
  );
}

function Courses() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Our Courses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded shadow bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg">Next.js Development</h3>
            <p className="text-gray-500 my-2">Master fullstack development today.</p>
          </div>
          <button className="bg-indigo-600 px-4 py-2 mt-4 text-white rounded hover:bg-indigo-700 transition">Enroll for $49</button>
        </div>
      </div>
    </div>
  );
}

function Community() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Community Board</h2>
      <div className="bg-white border p-4 rounded mb-6">
        <textarea className="w-full border p-2 rounded mb-2 focus:ring focus:ring-indigo-100 transition focus:outline-none" placeholder="Start a discussion..." rows={3} />
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">Submit Post</button>
      </div>

      <div className="space-y-4">
        { /* Example Mock Post */}
        <div className="bg-white border p-4 rounded shadow-sm">
          <h4 className="font-bold">John Doe</h4>
          <p className="text-gray-600 text-sm mt-1">Hello world! Looking forward to the courses.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center text-gray-800">
        <Link to="/" className="text-xl font-bold text-indigo-700 hover:text-indigo-800 transition">EduPlatform</Link>
        <div className="space-x-4 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/courses" className="hover:text-indigo-600 transition">Courses</Link>
          <Link to="/community" className="hover:text-indigo-600 transition">Community</Link>
        </div>
        <div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition">Login</button>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </main>

      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EduPlatform. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
