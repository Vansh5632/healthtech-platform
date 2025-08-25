// In apps/web/src/app/page.tsx
// This will be your new homepage.
// You can move the old `page.tsx` content to `apps/web/src/app/dashboard/page.tsx` if you haven't already.

import Link from 'next/link';

// You can use a library like 'lucide-react' for icons, or use simple SVGs as shown here.
const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);


export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">HealthTech Platform</h1>
          <nav className="space-x-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Accessible Healthcare, Anytime, Anywhere.
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with trusted medical providers through secure video consultations. Manage your health records and appointments all in one place.
            </p>
            <Link href="/register" className="mt-8 inline-block px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Get Started Today
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center text-gray-900">Your Complete Health Hub</h3>
            <p className="mt-2 text-center text-gray-600">Everything you need to manage your healthcare journey.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                  <VideoIcon />
                </div>
                <h4 className="mt-6 text-xl font-bold">Secure Video Consultations</h4>
                <p className="mt-2 text-gray-600">Face-to-face consultations with certified providers from the comfort of your home.</p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                  <CalendarIcon />
                </div>
                <h4 className="mt-6 text-xl font-bold">Easy Appointment Scheduling</h4>
                <p className="mt-2 text-gray-600">Find providers and book appointments that fit your schedule in just a few clicks.</p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                <div className="flex justify-center items-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                  <FileTextIcon />
                </div>
                <h4 className="mt-6 text-xl font-bold">Unified Health Records</h4>
                <p className="mt-2 text-gray-600">Access your medical history, prescriptions, and lab results securely in one place.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center text-gray-900">Getting Started is Simple</h3>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600">1</div>
                <h4 className="mt-4 text-xl font-semibold">Create Your Account</h4>
                <p className="mt-2 text-gray-600">Sign up in minutes to create your secure patient or provider profile.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600">2</div>
                <h4 className="mt-4 text-xl font-semibold">Find a Provider</h4>
                <p className="mt-2 text-gray-600">Browse our network of specialists and book an appointment time that works for you.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600">3</div>
                <h4 className="mt-4 text-xl font-semibold">Start Your Consultation</h4>
                <p className="mt-2 text-gray-600">Join your secure video call from any device, no downloads required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-6">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                <ShieldIcon />
            </div>
            <h3 className="mt-6 text-3xl font-bold text-gray-900">Security You Can Trust</h3>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Your privacy is our top priority. Our platform is built with enterprise-grade security and is designed to be HIPAA-compliant, ensuring your sensitive health information is always protected.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} HealthTech Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
