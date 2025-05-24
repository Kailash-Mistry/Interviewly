import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import kailashImg from './public/assets/kailash.jpg';
import SwastikImg from './public/assets/photo2.jpg';
import illustrationSvg from './public/assets/illustration.svg';
import answersSvg from './public/assets/answers.svg';

const features = [
  {
    title: 'Collaborative Code Editor',
    desc: 'Real-time code collaboration with syntax highlighting, auto-completion, and multi-language support.',
    icon: (
      <svg className="w-10 h-10 text-[#005c4b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
    )
  },
  {
    title: 'In-call Communication',
    desc: 'High-quality video and audio using WebRTC with options to mute, unmute, toggle camera, and share screens.',
    icon: (
      <svg className="w-10 h-10 text-[#005c4b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
    )
  },
  {
    title: 'AI Code Assistant',
    desc: 'Real-time suggestions, complexity estimation, hint generation, and code quality reviews to assist interviewers.',
    icon: (
      <svg className="w-10 h-10 text-[#005c4b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h1a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2h1" /></svg>
    )
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 64; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-[#202c33] shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <button 
            onClick={()=>navigate("/landing")}
            className="flex-shrink-0">

              <h1 className="text-2xl font-bold text-[#5ea8ff] hover:cursor-pointer">Interviewly</h1>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('team')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  Team
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  Contact
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#005c4b] hover:bg-[#006d5b] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#2a3942] focus:outline-none"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left bg-[#005c4b] hover:bg-[#006d5b] text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section */}
        <section id="hero" className="flex flex-col md:flex-row items-center justify-between px-8 py-16 md:py-24 bg-gradient-to-br from-[#111b21] via-[#202c33] to-[#005c4b] relative overflow-hidden">
          <div className="md:w-1/2 z-10 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
              The Ultimate <span className="text-[#5ea8ff]">Technical Interview</span> Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              Seamlessly conduct and participate in technical interviews with our collaborative code editor, video communication, and AI-powered tools.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-[#005c4b] hover:bg-[#006d5b] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 animate-bounce hover:cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center z-10 animate-fadeIn">
            <img
              src={illustrationSvg}
              alt="Interview Illustration"
              className="w-[350px] md:w-[450px] rounded-2xl shadow-2xl border-4 border-[#005c4b] bg-[#202c33] animate-float"
            />
          </div>
          {/* Animated background circles */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#005c4b]/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5ea8ff]/20 rounded-full blur-3xl animate-pulse-slow" />
        </section>
        {/* Features Section */}
        <section id="features" className="py-16 px-4 md:px-16 bg-[#111b21]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white animate-fadeInUp">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-[#202c33] rounded-xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 animate-fadeInUp" style={{ animationDelay: `${0.2 * idx}s` }}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#5ea8ff]">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* About/CTA Section */}
        <section id="about" className="py-16 px-4 md:px-16 bg-gradient-to-t from-[#202c33] to-[#111b21] flex flex-col md:flex-row items-center justify-between animate-fadeIn">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Us?</h2>
            <p className="text-lg text-gray-300 mb-6">
              Our platform is designed to make technical interviews seamless, efficient, and insightful. With real-time collaboration, AI-powered assistance, and robust communication tools, you can focus on what matters most—finding the right talent or showcasing your skills.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <img
              src={answersSvg}
              alt="Why Choose Us"
              className="w-[250px] md:w-[300px] rounded-xl shadow-xl border-2 border-[#5ea8ff] bg-[#202c33] animate-float"
            />
          </div>
        </section>
        {/* Team Section */}
        <section id="team" className="py-16 px-4 md:px-16 bg-[#111b21]">
          <h2 className="text-3xl md:text-4xl font-bold text-center items-center  mb-12 text-white animate-fadeInUp">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-20">
            {/* Example team members, replace with your own */}
            <div className="bg-[#202c33] rounded-xl  hover:scale-105 transition delay-150 duration-300 ease-in-out p-6 shadow-lg flex flex-col items-center w-64 animate-fadeInUp">
              <img src={kailashImg} alt="Team Member" className="w-24 h-24 rounded-full mb-4 border-4 border-[#005c4b] object-cover" />
              <h3 className="text-xl font-semibold text-[#5ea8ff]">Kailash Mistry</h3>
              <p className="text-gray-300">Developer</p>
            </div>
            <div className="bg-[#202c33] rounded-xl hover:scale-105 transition delay-150 duration-300 ease-in-out p-6 shadow-lg flex flex-col items-center w-64 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <img src={SwastikImg} alt="Team Member" className="w-24 h-24 rounded-full mb-4 border-4 border-[#005c4b] object-cover" />
              <h3 className="text-xl font-semibold text-[#5ea8ff]">Swastik Verma</h3>
              <p className="text-gray-300">Developer</p>
            </div>
          </div>
        </section>
        {/* Contact Us Section */}
        <section id="contact" className="py-16 px-4 md:px-16 bg-[#202c33]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white animate-fadeInUp">Contact Us</h2>
          <form className="max-w-2xl mx-auto bg-[#111b21] rounded-xl p-8 shadow-lg space-y-6 animate-fadeInUp">
            <div>
              <label className="block text-white mb-2" htmlFor="name">Name</label>
              <input id="name" type="text" className="w-full px-4 py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="email">Email</label>
              <input id="email" type="email" className="w-full px-4 py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors" placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-white mb-2" htmlFor="message">Message</label>
              <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg bg-[#2a3942] border border-[#2a3942] text-white focus:border-[#005c4b] focus:ring-2 focus:ring-[#005c4b] focus:outline-none transition-colors" placeholder="How can we help you?" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#005c4b] hover:bg-[#006d5b] text-white font-semibold rounded-lg shadow-lg transition-all duration-300">Send Message</button>
          </form>
        </section>
        {/* Footer */}
        <footer className="bg-[#111b21] text-gray-400 py-4 px-4 md:px-16 text-center border-t border-[#202c33] animate-fadeIn">
          
          <div>&copy; {new Date().getFullYear()} Interviewly. All rights reserved.</div>
        </footer>
        {/* Animations */}
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 1s ease both;
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 1.2s ease both;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LandingPage;