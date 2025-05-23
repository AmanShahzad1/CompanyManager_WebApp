import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo/App Name */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Company<span className="text-blue-600">Manager</span>
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Streamline your business operations with our all-in-one company management solution
        </p>
        
        {/* Login Button */}
        <Link 
          href="/pages/login" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Login to Continue
        </Link>
        
        
          
        
      </div>
    </main>
  );
}