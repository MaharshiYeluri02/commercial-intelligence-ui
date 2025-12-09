import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Reusable AnimatedSection component
const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated Counter for metrics
const AnimatedCounter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = React.useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      let startTime;
      const duration = 2000;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * parseFloat(end)));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// ============================================
// SECTION 1: Hero Section
// ============================================
const HeroSection = () => {
  const [isTyping, setIsTyping] = React.useState(true);
  const [showResponse, setShowResponse] = React.useState(false);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setIsTyping(false), 2500);
    const timer2 = setTimeout(() => setShowResponse(true), 3000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div id="hero" className="relative bg-gradient-to-b from-purple-50 to-white pt-32 pb-24 overflow-hidden scroll-mt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6 border border-purple-200">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
              Pharma BYOB Extension
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Your AI Co-Pilot, Now With{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                Complete HCP Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Rep Planner extends Pharma BYOB with deep physician insights, personalized meeting playbooks, and visit optimization—so every rep walks into every call fully prepared.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                See It In Action
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-purple-600 rounded-xl font-semibold text-lg border-2 border-purple-200 hover:bg-purple-50 transition-all"
              >
                Request Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Animated BYOB Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-200">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Pharma BYOB Co-Pilot</span>
              </div>
              
              {/* Chat Content */}
              <div className="p-6 space-y-4 min-h-[320px]">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-purple-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-gray-800 font-medium">Prep me for my meeting with Dr. Carter</p>
                  </div>
                </div>

                {/* AI Response */}
                {isTyping ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Loading HCP Intelligence...</span>
                  </div>
                ) : showResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-2xl rounded-tl-sm p-4 border border-purple-200"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Dr. Emily Carter</p>
                        <p className="text-sm text-gray-600">Oncologist - NSCLC | City General Hospital</p>
                      </div>
                      <div className="ml-auto bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">92</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>3 Meeting Topics Ready</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>78% EGFR Testing Rate</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>$2.1M Annual Opportunity</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                      View Full Profile →
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-current text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

// ============================================
// SECTION 2: Problem Statement
// ============================================
const ProblemSection = () => {
  const painPoints = [
    {
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Information Overload",
      description: "Reps spend 2+ hours daily hunting through CRM, claims data, and emails just to prepare for calls",
      color: "red"
    },
    {
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Missed Opportunities",
      description: "Without real-time intelligence, high-potential HCPs slip through the cracks",
      color: "orange"
    },
    {
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Generic Pitches",
      description: "One-size-fits-all messaging fails to resonate with individual physician needs",
      color: "yellow"
    },
    {
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Suboptimal Visit Allocation",
      description: "Reps don't know which HCPs need more visits vs. fewer to maximize Rx impact",
      color: "purple"
    }
  ];

  const colorClasses = {
    red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', iconBg: 'bg-red-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', iconBg: 'bg-orange-100' },
    yellow: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', iconBg: 'bg-amber-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', iconBg: 'bg-purple-100' }
  };

  return (
    <div id="problem" className="bg-gradient-to-b from-white to-red-50 py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Your Reps Are Flying Blind Into{' '}
              <span className="text-red-600">High-Stakes Conversations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Without the right intelligence at their fingertips, every call becomes a guessing game
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${colorClasses[point.color].bg} ${colorClasses[point.color].border} border-2 rounded-2xl p-6 h-full transition-all duration-300`}
              >
                <div className={`${colorClasses[point.color].iconBg} ${colorClasses[point.color].icon} p-4 rounded-xl inline-block mb-4`}>
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">{point.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 3: Solution Architecture
// ============================================
const SolutionArchitecture = () => {
  return (
    <div id="solution" className="bg-white py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Pharma BYOB +{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                Powerful Extensions
              </span>{' '}
              for Field Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pharma BYOB is your reps' conversational interface to territory intelligence. Rep Planner and Rep Call Planning extend BYOB with deep HCP preparation and visit optimization capabilities.
            </p>
          </div>
        </AnimatedSection>

        {/* Architecture Diagram */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-4xl mx-auto">
            {/* BYOB Central Hub */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-center shadow-2xl mb-8"
            >
              <div className="flex items-center justify-center space-x-3 text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-2xl font-bold">PHARMA BYOB</span>
              </div>
              <p className="text-indigo-100 mt-2">Conversational Interface for Reps</p>
            </motion.div>

            {/* Connection Lines */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-8">
                <div className="w-32 h-1 bg-gradient-to-r from-indigo-300 to-blue-400"></div>
                <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
              </div>
            </div>

            {/* Extension Modules */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Rep Planner */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-3 rounded-xl text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">REP PLANNER</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>HCP Intel & Opportunity Scores</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Meeting Playbooks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>Analytics & Competitive Intel</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>360° HCP Profiles</span>
                  </li>
                </ul>
              </motion.div>

              {/* Rep Call Planning */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">REP CALL PLANNING</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Visit Impact Simulation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Optimal Visit Frequency</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Territory ROI Optimization</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

// ============================================
// SECTION 4: BYOB HCP List Demo
// ============================================
const BYOBHCPListDemo = () => {
  const hcpData = [
    { name: "Dr. Emily Carter", specialty: "Oncology", hospital: "Mount Sinai Hospital", location: "New York, NY", score: 92, patients: 450, experience: "12 years", lastContact: "3 days ago", insight: "High patient volume & recent competitor prescribing dip" },
    { name: "Dr. Michael Chen", specialty: "Neurology", hospital: "Johns Hopkins Medicine", location: "Baltimore, MD", score: 87, patients: 320, experience: "15 years", lastContact: "1 week ago", insight: "Recent publication aligns with product benefits" },
    { name: "Dr. Sarah Johnson", specialty: "Oncology", hospital: "MD Anderson Cancer Center", location: "Houston, TX", score: 78, patients: 280, experience: "9 years", lastContact: "2 weeks ago", insight: "New patient cohort matches product indication" }
  ];

  return (
    <div id="hcp-list" className="bg-gray-50 py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Ask Your Co-Pilot.{' '}
              <span className="text-indigo-600">Get Instant Intelligence.</span>
            </h2>
            <p className="text-xl text-gray-600">
              Natural language queries surface AI-ranked HCP priorities instantly
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Hi, Alex. Your top opportunities</h3>
                    <p className="text-indigo-200">AI-ranked to maximize your impact</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 border-b border-gray-200">
              {[
                { value: "1,247", label: "Total HCPs", change: "+12%", icon: "👥" },
                { value: "28", label: "High Priority", change: "+5", icon: "🎯" },
                { value: "12", label: "This Week", change: "Planned", icon: "📅" },
                { value: "78.4", label: "Avg Score", change: "+3.2", icon: "📈" }
              ].map((stat, i) => (
                <div key={i} className="p-4 text-center border-r last:border-r-0 border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                  <div className="text-xs text-green-600 font-medium mt-1">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* HCP Cards */}
            <div className="p-6 space-y-4">
              {hcpData.map((hcp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                        👨‍⚕️
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${hcp.score >= 90 ? 'bg-indigo-600' : hcp.score >= 80 ? 'bg-blue-600' : 'bg-purple-600'}`}>
                        {hcp.score}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{hcp.name}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{hcp.specialty}</span>
                        <span className="text-gray-500">🏥 {hcp.hospital}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>📍 {hcp.location}</span>
                        <span>👥 {hcp.patients} Patients</span>
                        <span>⏰ {hcp.lastContact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-xs text-amber-600 font-medium">⭐ AI Insight:</p>
                      <p className="text-sm text-gray-700">{hcp.insight}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <span>📋</span>
                      <span>View Plan</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

// ============================================
// SECTION 5: Rep Planner Tabs Demo
// ============================================
const RepPlannerTabsDemo = () => {
  const [activeTab, setActiveTab] = React.useState('precall');

  const tabs = [
    { id: 'precall', label: 'Pre-Call Brief', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div id="call-prep" className="bg-white py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Click Into Any HCP.{' '}
              <span className="text-indigo-600">Get Complete Call Preparation.</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore Dr. Emily Carter's intelligence profile
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* HCP Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">👩‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Dr. Emily Carter</h3>
                    <p className="text-gray-600">Oncologist - NSCLC | City General Hospital</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Opportunity Score</div>
                    <div className="text-sm text-gray-400">Top 5% in Territory</div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    92
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-gray-700 text-sm">
                  High-volume NSCLC practice with strong EGFR testing rates (78%) and growing resection volumes. Currently underutilizing ADAURA in the adjuvant setting despite having 45+ eligible patients per quarter.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                      : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'precall' && <PreCallBriefTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
              {activeTab === 'profile' && <ProfileTab />}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

// Pre-Call Brief Tab Content
const PreCallBriefTab = () => {
  const playbooks = [
    {
      title: "Discuss ADAURA Adjuvant Opportunity",
      type: "In-Person",
      typeColor: "bg-green-500",
      rationale: "Dr. Carter has 45+ eligible Stage Ib-IIIA EGFR+ patients post-resection but only a 12% adoption rate. Clinical data shows ADAURA can reduce recurrence risk by 89%.",
      impact: "+8-10 Potential New Patient Starts / Quarter",
      starter: '"Dr. Carter, I noticed your excellent EGFR testing rate of 78%. Given your focus on molecular testing and your significant post-surgical EGFR+ patient volume, I wanted to discuss how ADAURA\'s 89% recurrence risk reduction could benefit this specific patient group."',
      resource: "ADAURA Adjuvant Trial Data"
    },
    {
      title: "Present FLAURA2 Combination Data",
      type: "In-Person",
      typeColor: "bg-green-500",
      rationale: "New PFS data (25.5 months vs 16.7 months) for 1L advanced NSCLC. Perfect for her high-volume practice.",
      impact: "+5-7 Potential New Patient Starts / Quarter",
      starter: '"Your recent paper on precision medicine in NSCLC caught my attention. The FLAURA2 combination data we just released aligns perfectly with your approach to personalized therapy - would love to get your thoughts."',
      resource: "FLAURA2 Combination Results"
    },
    {
      title: "Address CNS Penetration Benefits",
      type: "Email",
      typeColor: "bg-blue-500",
      rationale: "Share blood-brain barrier penetration data relevant to her patients with brain metastases concerns.",
      impact: "+2-3 Potential New Patient Starts / Quarter",
      starter: '"I see you\'ve been increasing your use of competitive TKIs. With the new FLAURA2 data showing superior PFS and enhanced CNS penetration, I\'d be interested in understanding what factors drive your current treatment decisions."',
      resource: "NSCLC Treatment Algorithm 2025"
    }
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Meeting Playbook */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-lg font-bold text-gray-900 flex items-center">
          <span className="mr-2">📋</span> Meeting Playbook
        </h4>
        {playbooks.map((playbook, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-gray-900">{playbook.title}</h5>
              <span className={`${playbook.typeColor} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {playbook.type}
              </span>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-3">
              <p className="text-sm text-gray-700"><strong>Rationale:</strong> {playbook.rationale}</p>
            </div>
            <p className="text-sm text-green-600 font-medium mb-3">Est. Impact: {playbook.impact}</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-indigo-600 font-medium mb-1">Conversation Starter:</p>
              <p className="text-sm text-gray-700 italic">{playbook.starter}</p>
              <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to clipboard
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-medium">PDF</span>
                <span>{playbook.resource}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-gray-600">📧 Email</button>
                <button className="text-gray-400 hover:text-gray-600">+ Add</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Interaction Timeline */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🕐</span> Interaction Timeline
          </h4>
          <div className="space-y-4">
            {[
              { date: "Aug 1, 2025", type: "In-Person Meeting", details: ["Discussed initial FLAURA2 data", "Dr. Carter expressed concern about CNS penetration"] },
              { date: "Jul 15, 2025", type: "Email", details: ["Shared link to recent KOL webinar"] },
              { date: "Jun 22, 2025", type: "In-Person Meeting", details: ["Initial introduction", "Discussed her NSCLC patient demographics"] }
            ].map((item, index) => (
              <div key={index} className="flex space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {item.type.includes('Meeting') ? '👤' : '📧'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.date} - {item.type}</p>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-xs text-gray-600">• {detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HCP Profile Snapshot */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span> HCP Profile Snapshot
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Communication Style</p>
              <p className="text-sm text-gray-700">Data-driven, prefers clinical evidence over marketing claims. Appreciates brevity.</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Key Professional Interests</p>
              <p className="text-sm text-gray-700">Precision medicine, adjuvant therapies, reducing recurrence risk.</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Referral Network</p>
              <p className="text-sm text-gray-700">Frequently refers patients to Dr. Alan Grant (Radiation Oncology) at City General. This insight can fuel new conversation starters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Content
const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Opportunity Score", value: "92", subtext: "92nd percentile nationally", icon: "📈", color: "indigo" },
          { label: "EGFR Testing Rate", value: "78%", subtext: "vs 52% national avg", icon: "🧬", color: "blue" },
          { label: "EGFR+ Rate", value: "23%", subtext: "45 patients/quarter", icon: "⚡", color: "purple" },
          { label: "Resection Rate", value: "67%", subtext: "30 surgeries/quarter", icon: "🏥", color: "indigo" }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2 text-gray-500 text-sm mb-1">
              <span>{metric.icon}</span>
              <span>{metric.label}</span>
            </div>
            <div className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</div>
            <div className="text-xs text-gray-400">{metric.subtext}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Eligible Patient Volume */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4">Eligible Patient Volume by Therapy</h4>
          {[
            { name: "ADAURA (Adjuvant)", patients: 30, adoption: 12, color: "indigo" },
            { name: "FLAURA (1L Advanced)", patients: 15, adoption: 67, color: "blue" },
            { name: "FLAURA2 (Combination)", patients: 8, adoption: 25, color: "purple" }
          ].map((therapy, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{therapy.name}</span>
                <span className="text-indigo-600 font-medium">{therapy.patients} patients/quarter</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${therapy.adoption}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full bg-gradient-to-r from-${therapy.color}-400 to-${therapy.color}-600 rounded-full`}
                  style={{ width: `${therapy.adoption}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Current adoption: {therapy.adoption}% ({Math.round(therapy.patients * therapy.adoption / 100)} patients)</p>
            </div>
          ))}
        </div>

        {/* Treatment Landscape Trends */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4">Treatment Landscape Trends</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-40 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">Prescription Trend (Q3 2025)</p>
              <div className="flex items-end justify-center space-x-2 h-20">
                {[40, 55, 60, 75, 85, 90, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-6 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Steady growth in prescriptions with 15% increase over Q2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why High Opportunity */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📊</span> Why This HCP Represents a High Opportunity
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Underutilized Adjuvant Opportunity", desc: "Dr. Carter performs 30 EGFR+ resections quarterly but only prescribes ADAURA to 12% of eligible patients. With ADAURA's 89% reduction in recurrence risk, there's significant potential to improve 26+ patient outcomes per quarter." },
            { title: "Excellent Testing Infrastructure", desc: "78% EGFR testing rate (vs 52% national average) demonstrates commitment to precision medicine and molecular diagnostics, making her receptive to biomarker-driven therapies." },
            { title: "FLAURA2 Expansion Potential", desc: "Only 25% adoption of combination therapy despite treating 15 advanced EGFR+ patients quarterly. New PFS data (25.5 vs 16.7 months) provides compelling clinical rationale for switching 6+ additional patients." },
            { title: "Competitive Displacement Opportunity", desc: "Competitor TKI usage declining 12% in territory while Luminara grows 18% QoQ. Dr. Carter's high patient volume (195 NSCLC patients/year) makes her a key influencer for market share expansion." }
          ].map((item, index) => (
            <div key={index} className="flex space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-indigo-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">💡 Key Insight:</span> This HCP represents a $2.1M annual opportunity across all indications, with immediate potential to increase ADAURA adoption by 20+ patients and FLAURA2 by 6+ patients within the next two quarters.
          </p>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Content
const ProfileTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span> Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Full Name</span><p className="font-medium">Dr. Emily Carter</p></div>
            <div><span className="text-gray-500">Credentials</span><p className="font-medium">MD, PhD, FASCO</p></div>
            <div><span className="text-gray-500">Years of Experience</span><p className="font-medium">15 years</p></div>
            <div><span className="text-gray-500">License Number</span><p className="font-medium">NY-54789-MD</p></div>
            <div><span className="text-gray-500">Date of Birth</span><p className="font-medium">March 15, 1978</p></div>
            <div><span className="text-gray-500">Gender</span><p className="font-medium">Female</p></div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📍</span> Contact & Location
          </h4>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Primary Hospital</span><p className="font-medium">City General Hospital</p><p className="text-gray-600">1234 Medical Center Drive, New York, NY 10001</p></div>
            <div><span className="text-gray-500">Office Phone</span><p className="font-medium">(555) 123-4567</p></div>
            <div><span className="text-gray-500">Email</span><p className="font-medium">e.carter@citygen.health</p></div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Preferred Contact:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">Email</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Education & Training */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🎓</span> Education & Training
          </h4>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Medical School</span><p className="font-medium">Harvard Medical School</p><p className="text-gray-600">MD, 2005</p></div>
            <div><span className="text-gray-500">Residency</span><p className="font-medium">Johns Hopkins Hospital</p><p className="text-gray-600">Internal Medicine, 2005-2008</p></div>
            <div><span className="text-gray-500">Fellowship</span><p className="font-medium">Memorial Sloan Kettering</p><p className="text-gray-600">Medical Oncology, 2008-2011</p></div>
            <div><span className="text-gray-500">PhD</span><p className="font-medium">MIT</p><p className="text-gray-600">Cancer Biology, 2003</p></div>
          </div>
        </div>

        {/* Professional Affiliations */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏛️</span> Professional Affiliations
          </h4>
          <div className="space-y-2 text-sm">
            {[
              { org: "American Society of Clinical Oncology", role: "Fellow" },
              { org: "International Association for Lung Cancer", role: "Member" },
              { org: "American Medical Association", role: "Member" },
              { org: "NYC Thoracic Oncology Society", role: "Board Member" },
              { org: "EGFR Research Consortium", role: "Advisory Panel" }
            ].map((aff, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{aff.org}</span>
                <span className="text-gray-500 text-xs">{aff.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research & Clinical Trial Profile */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔬</span> Research & Clinical Trial Profile
        </h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600">47</div>
            <div className="text-sm text-gray-500">Published Papers</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600">12</div>
            <div className="text-sm text-gray-500">Active Clinical Trials</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">847</div>
            <div className="text-sm text-gray-500">Citations (H-Index: 23)</div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Research Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {["EGFR Mutations", "Targeted Therapy", "Precision Medicine", "Brain Metastases", "Adjuvant Therapy"].map((tag, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Current Clinical Trials (PI)</p>
          <div className="space-y-2">
            {[
              { name: "ADAURA-REAL: Real-world outcomes of adjuvant osimertinib", phase: "Phase IV", enrolled: 153, status: "Active" },
              { name: "CNS-PENETRATION: Brain metastases prevention study", phase: "Phase III", enrolled: 89, status: "Recruiting" },
              { name: "COMBO-NSCLC: Novel combination therapy trial", phase: "Phase II", enrolled: 45, status: "Active" }
            ].map((trial, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <p className="font-medium text-gray-900">{trial.name}</p>
                  <p className="text-gray-500">{trial.phase} • {trial.enrolled} patients enrolled • Status: {trial.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 6: Rep Call Planning Demo
// ============================================
const RepCallPlanningDemo = () => {
  return (
    <div id="call-planning" className="bg-gradient-to-b from-white to-blue-50 py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Optimize Every Visit for{' '}
              <span className="text-blue-600">Maximum Impact</span>
            </h2>
            <p className="text-xl text-gray-600">
              AI predicts Rx impact based on visit frequency for each HCP
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Label */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Rep Call Planning</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Simulation-driven insights for optimal HCP visit planning</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Visit Impact Simulation</h4>
                    <p className="text-sm text-blue-700">AI predicts Rx impact based on visit frequency for each HCP</p>
                  </div>
                </div>
              </div>

              {/* HCP Cards */}
              <div className="lg:col-span-2 space-y-4">
                {[
                  { name: "HCP1", specialty: "Cardiologist", priority: "High Priority", priorityColor: "bg-red-100 text-red-700", current: { visits: 2, rx: 45 }, optimal: { visits: 4, rx: 72 }, impact: "+27 Rx (+60%)", insight: "Steep response after 3rd visit" },
                  { name: "HCP2", specialty: "General Practitioner", priority: "Medium Priority", priorityColor: "bg-yellow-100 text-yellow-700", current: { visits: 1, rx: 28 }, optimal: { visits: 2, rx: 38 }, impact: "+10 Rx (+36%)", insight: "Quick saturation at 2 visits" }
                ].map((hcp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{hcp.name}</h4>
                        <p className="text-gray-500">{hcp.specialty}</p>
                      </div>
                      <span className={`${hcp.priorityColor} px-3 py-1 rounded-full text-sm font-medium`}>
                        {hcp.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Current ({hcp.current.visits} visits/month):</p>
                        <p className="text-2xl font-bold text-gray-900">{hcp.current.rx} Rx</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600">Optimal ({hcp.optimal.visits} visits/month):</p>
                        <p className="text-2xl font-bold text-blue-600">{hcp.optimal.rx} Rx</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600">Incremental Impact:</p>
                        <p className="text-2xl font-bold text-green-600">{hcp.impact}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <span className="font-medium">Curve insight:</span> {hcp.insight}
                    </div>
                  </motion.div>
                ))}

                {/* Territory Impact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Territory Optimization Impact</h4>
                      <p className="text-indigo-100">Following simulation-based visit recommendations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold">+37 Rx/month</p>
                      <p className="text-indigo-100">+48% territory growth</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

// ============================================
// SECTION 7: Value Proposition
// ============================================
const ValueProposition = () => {
  const pillars = [
    { step: "Ask → Discover", description: "Use Pharma BYOB to query your territory in natural language. Get AI-ranked HCP opportunities instantly.", icon: "💬", color: "indigo" },
    { step: "Click → Prepare", description: "Rep Planner delivers complete call preparation—playbooks, analytics, and profiles for every HCP.", icon: "📋", color: "purple" },
    { step: "Optimize → Maximize", description: "Rep Call Planning ensures you're visiting the right HCPs at the right frequency for maximum Rx impact.", icon: "📈", color: "blue" }
  ];

  const metrics = [
    { value: "70", suffix: "%", label: "Reduction in call prep time" },
    { value: "2.3", suffix: "x", label: "Improvement in HCP engagement" },
    { value: "48", suffix: "%", label: "Territory growth with optimized visits" }
  ];

  return (
    <div id="value" className="bg-gradient-to-br from-gray-900 to-indigo-900 py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              From Question to Preparation to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Optimization
              </span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-full"
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{pillar.step}</h3>
                <p className="text-gray-300">{pillar.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <AnimatedSection key={index} delay={index * 0.1 + 0.3}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <p className="text-gray-400 text-lg">{metric.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 8: Capability Summary Cards
// ============================================
const CapabilitySummary = () => {
  const capabilities = [
    { title: "Conversational Interface", source: "BYOB", description: "Natural language access to all territory intelligence", icon: "💬", gradient: "from-indigo-500 to-purple-500" },
    { title: "AI Opportunity Scoring", source: "Rep Planner", description: "50+ signals analyzed to rank HCPs by conversion potential", icon: "🎯", gradient: "from-purple-600 via-indigo-600 to-blue-600" },
    { title: "Personalized Playbooks", source: "Rep Planner", description: "Auto-generated discussion topics with clinical rationale", icon: "📋", gradient: "from-purple-600 via-indigo-600 to-blue-600" },
    { title: "360° HCP Profiles", source: "Rep Planner", description: "Research, trials, affiliations, and preferences in one view", icon: "👤", gradient: "from-purple-600 via-indigo-600 to-blue-600" },
    { title: "Visit Optimization", source: "Rep Call Planning", description: "Simulation-driven insights for optimal visit frequency", icon: "📈", gradient: "from-blue-500 to-cyan-500" }
  ];

  return (
    <div id="capabilities" className="bg-white py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Complete Capabilities at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600">
              Everything your reps need, powered by AI
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {capabilities.map((cap, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 h-full hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${cap.gradient} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {cap.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cap.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{cap.source}</p>
                <p className="text-sm text-gray-600">{cap.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 9: Final CTA
// ============================================
const FinalCTA = () => {
  return (
    <div id="cta" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Empower Your Field Force?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              See how Pharma BYOB with Rep Planner and Rep Call Planning can transform your commercial execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Schedule a Live Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold text-lg border border-white/30 hover:bg-white/20 transition-all"
              >
                Download Product Brief
              </motion.button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const RepPlannerLandingPage = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      <HeroSection />
      <ProblemSection />
      <SolutionArchitecture />
      <BYOBHCPListDemo />
      <RepPlannerTabsDemo />
      <RepCallPlanningDemo />
      <ValueProposition />
      <CapabilitySummary />
      <FinalCTA />
    </div>
  );
};

export default RepPlannerLandingPage;

