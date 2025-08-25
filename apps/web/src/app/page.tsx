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
    <div className="bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-teal-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              HealthTech Platform
            </h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200">
              Sign In
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200 text-teal-700 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Healthcare Made Simple
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Accessible Healthcare,
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Anytime</span>,
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Anywhere</span>
              </h2>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with trusted medical providers through secure video consultations. 
                Manage your health records and appointments all in one place with our comprehensive healthcare platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started Today
                </Link>
                <Link href="/login" className="bg-white text-gray-700 px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900">Your Complete Health Hub</h3>
              <p className="mt-4 text-xl text-gray-600">Everything you need to manage your healthcare journey efficiently.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex justify-center items-center h-16 w-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white mx-auto group-hover:scale-110 transition-transform duration-300">
                  <VideoIcon />
                </div>
                <h4 className="mt-6 text-2xl font-bold text-gray-900">Secure Video Consultations</h4>
                <p className="mt-4 text-gray-600 leading-relaxed">Face-to-face consultations with certified providers from the comfort of your home. HD video quality with end-to-end encryption.</p>
              </div>
              
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex justify-center items-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mx-auto group-hover:scale-110 transition-transform duration-300">
                  <CalendarIcon />
                </div>
                <h4 className="mt-6 text-2xl font-bold text-gray-900">Easy Appointment Scheduling</h4>
                <p className="mt-4 text-gray-600 leading-relaxed">Find providers and book appointments that fit your schedule in just a few clicks. Smart scheduling with automated reminders.</p>
              </div>
              
              <div className="group p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex justify-center items-center h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FileTextIcon />
                </div>
                <h4 className="mt-6 text-2xl font-bold text-gray-900">Unified Health Records</h4>
                <p className="mt-4 text-gray-600 leading-relaxed">Access your medical history, prescriptions, and lab results securely in one place. Complete digital health portfolio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gradient-to-br from-gray-50 to-teal-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900">Getting Started is Simple</h3>
              <p className="mt-4 text-xl text-gray-600">Three easy steps to better healthcare</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    1
                  </div>
                  {/* Connector line */}
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-teal-300 to-transparent"></div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h4>
                <p className="text-gray-600 leading-relaxed">Sign up in minutes to create your secure patient or provider profile with bank-level security.</p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    2
                  </div>
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Find a Provider</h4>
                <p className="text-gray-600 leading-relaxed">Browse our network of verified specialists and book an appointment time that works perfectly for your schedule.</p>
              </div>
              
              <div className="text-center group">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    3
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Start Your Consultation</h4>
                <p className="text-gray-600 leading-relaxed">Join your secure video call from any device with our browser-based platform. No downloads required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center items-center h-20 w-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white mx-auto mb-8 shadow-lg">
                <ShieldIcon />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Security You Can Trust</h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">
                Your privacy is our top priority. Our platform is built with enterprise-grade security and is designed to be 
                <span className="font-semibold text-teal-600"> HIPAA-compliant</span>, ensuring your sensitive health information is always protected with the highest standards of care.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">256-bit Encryption</h4>
                  <p className="text-sm text-gray-600 mt-2">Bank-level security for all communications</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">HIPAA Compliant</h4>
                  <p className="text-sm text-gray-600 mt-2">Full compliance with healthcare regulations</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">24/7 Monitoring</h4>
                  <p className="text-sm text-gray-600 mt-2">Continuous security monitoring and updates</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">HealthTech Platform</h3>
            </div>
            <p className="text-gray-400 mb-8">Making healthcare accessible, secure, and convenient for everyone.</p>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400">&copy; {new Date().getFullYear()} HealthTech Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
