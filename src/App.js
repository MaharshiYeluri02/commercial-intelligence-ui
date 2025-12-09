import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceDot } from 'recharts';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';
import RepPlannerLandingPage from './components/RepPlannerLandingPage';

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        if (typeof end === 'string' && end.includes('x')) {
          const numValue = parseFloat(end.replace('x', ''));
          setCount(Math.floor(progress * numValue));
        } else {
          setCount(Math.floor(progress * parseFloat(end)));
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {typeof end === 'string' && end.includes('x') ? `${count}x` : count}{suffix}
    </span>
  );
};

const PharmaBYOB = () => {
  const [selectedRole, setSelectedRole] = React.useState('field');
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(true);

  const questions = {
    field: [
      "Based on our latest strategy, who are my top 10 highest-potential HCPs to target this week?",
      "Show me doctors in my territory with a high number of eligible patients but low prescribing volume for our SGLT2 inhibitor.",
      "Why did Dr. Evans' prescription volume suddenly drop last month?"
    ],
    hq: [
      "What is our national market share trend versus our top three competitors over the last year?",
      "Show me our quarterly revenue performance by region for the past 2 years.",
      "What are the top 5 territories by prescription volume and their growth rates?"
    ]
  };

  const answers = {
    field: [
      {
        question: "Based on our latest strategy, who are my top 10 highest-potential HCPs to target this week?",
        type: "table",
        data: [
          { rank: 1, name: "Dr. Sarah Chen", specialty: "Cardiologist", score: 92, eligiblePts: 45, penetration: "12%", action: "Visit This Week", priority: "High" },
          { rank: 2, name: "Dr. Michael Rodriguez", specialty: "Endocrinologist", score: 87, eligiblePts: 32, penetration: "8%", action: "Retention Visit", priority: "High" },
          { rank: 3, name: "Dr. Jennifer Kim", specialty: "Nephrologist", score: 84, eligiblePts: 67, penetration: "15%", action: "Follow-up", priority: "Medium" },
          { rank: 4, name: "Dr. Robert Johnson", specialty: "Cardiologist", score: 79, eligiblePts: 28, penetration: "22%", action: "Educational Visit", priority: "Medium" },
          { rank: 5, name: "Dr. Lisa Thompson", specialty: "Endocrinologist", score: 76, eligiblePts: 19, penetration: "5%", action: "Initial Contact", priority: "Medium" }
        ]
      },
      {
        question: "Show me doctors in my territory with a high number of eligible patients but low prescribing volume for our SGLT2 inhibitor.",
        type: "chart",
        data: {
          title: "High Opportunity HCPs - Eligible Patients vs. Current Prescriptions",
          hcps: [
            { name: "Dr. Martinez", eligible: 78, current: 3, opportunity: 75 },
            { name: "Dr. Wilson", eligible: 65, current: 8, opportunity: 57 },
            { name: "Dr. Brown", eligible: 52, current: 5, opportunity: 47 },
            { name: "Dr. Davis", eligible: 48, current: 12, opportunity: 36 },
            { name: "Dr. Taylor", eligible: 41, current: 7, opportunity: 34 }
          ]
        }
      },
      {
        question: "Why did Dr. Evans' prescription volume suddenly drop last month?",
        type: "analysis",
        data: {
          hcp: "Dr. Evans",
          specialty: "Cardiologist",
          previousVolume: 24,
          currentVolume: 8,
          change: -67,
          factors: [
            { factor: "Competitor Launch", impact: "High", description: "New competitor drug launched with aggressive pricing" },
            { factor: "Patient Demographics", impact: "Medium", description: "Shift in patient population to younger demographics" },
            { factor: "Formulary Changes", impact: "Low", description: "Minor formulary restrictions introduced" }
          ],
          timeline: [
            { month: "Jan", volume: 22 },
            { month: "Feb", volume: 24 },
            { month: "Mar", volume: 26 },
            { month: "Apr", volume: 8 }
          ]
        }
      }
    ],
    hq: [
      {
        question: "What is our national market share trend versus our top three competitors over the last year?",
        type: "marketshare",
        data: {
          title: "Market Share Trends - Last 12 Months",
          brands: [
            { name: "SGLT2 Inhibitor (Ours)", current: 23.4, change: +1.2, color: "#4F46E5", data: [22.1, 22.3, 22.8, 23.4] },
            { name: "DPP-4 Inhibitor A", current: 31.2, change: -0.8, color: "#EF4444", data: [32.0, 31.8, 31.5, 31.2] },
            { name: "GLP-1 Agonist B", current: 18.7, change: +0.3, color: "#F59E0B", data: [18.4, 18.5, 18.6, 18.7] },
            { name: "Insulin Analog C", current: 15.1, change: -0.4, color: "#10B981", data: [15.5, 15.3, 15.2, 15.1] }
          ],
          quarters: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"]
        }
      },
      {
        question: "Show me our quarterly revenue performance by region for the past 2 years.",
        type: "revenue",
        data: {
          title: "Quarterly Revenue by Region (2023-2024)",
          regions: [
            { name: "Northeast", q1_23: 45.2, q2_23: 48.1, q3_23: 52.3, q4_23: 49.8, q1_24: 51.2, q2_24: 54.7, q3_24: 58.1, q4_24: 56.3, color: "#4F46E5" },
            { name: "Southeast", q1_23: 38.7, q2_23: 41.2, q3_23: 44.8, q4_23: 42.1, q1_24: 43.9, q2_24: 47.2, q3_24: 50.6, q4_24: 48.9, color: "#10B981" },
            { name: "West", q1_23: 52.1, q2_23: 55.8, q3_23: 59.2, q4_23: 57.4, q1_24: 58.7, q2_24: 62.3, q3_24: 65.9, q4_24: 63.2, color: "#F59E0B" },
            { name: "Central", q1_23: 41.3, q2_23: 43.9, q3_23: 47.1, q4_23: 45.2, q1_24: 46.8, q2_24: 49.5, q3_24: 52.7, q4_24: 51.1, color: "#EF4444" }
          ],
          quarters: ["Q1'23", "Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24"]
        }
      },
      {
        question: "What are the top 5 territories by prescription volume and their growth rates?",
        type: "territories",
        data: {
          title: "Top 5 Territories by Prescription Volume",
          territories: [
            { name: "California North", volume: 12847, growth: 18.3, rep: "Sarah Johnson", hcps: 156, color: "#4F46E5" },
            { name: "Texas Metro", volume: 11293, growth: 15.7, rep: "Michael Chen", hcps: 142, color: "#10B981" },
            { name: "Florida East", volume: 10658, growth: 22.1, rep: "Lisa Rodriguez", hcps: 134, color: "#F59E0B" },
            { name: "New York City", volume: 9847, growth: 12.4, rep: "David Kim", hcps: 128, color: "#EF4444" },
            { name: "Illinois Central", volume: 8932, growth: 19.8, rep: "Jennifer Lee", hcps: 119, color: "#8B5CF6" }
          ]
        }
      }
    ]
  };

  // Auto-cycle through questions
  React.useEffect(() => {
    if (!isAnimating) return;

    const questionCycle = setInterval(() => {
      setShowAnswer(false);
      setIsTyping(true);

      setTimeout(() => {
        setCurrentQuestionIndex(prev => (prev + 1) % questions[selectedRole].length);
        setIsTyping(false);
        setShowAnswer(true);
      }, 2000);
    }, 8000); // Change question every 8 seconds

    return () => clearInterval(questionCycle);
  }, [selectedRole, isAnimating, questions]);

  // Initial setup
  React.useEffect(() => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setShowAnswer(true);
    }, 2000);
  }, [selectedRole]);

  const currentQuestion = questions[selectedRole] && questions[selectedRole][currentQuestionIndex];
  const currentAnswer = answers[selectedRole] && answers[selectedRole][currentQuestionIndex];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h1
                  className="text-5xl font-extrabold text-gray-dark leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Go from Complex Business Question to <span className="text-indigo-600">Strategic Answer</span> in Seconds
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-medium leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Introducing <span className="font-bold text-indigo-600">Pharma BYOB</span>, the conversational analytics platform for pharma commercial teams. Stop waiting for static reports and BI queues. Start having a direct, intelligent conversation with your data and get the answers you need, when you need them.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Request a Live Demo
                  </button>
                  <button className="text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-300">
                    How It Works →
                  </button>
                </motion.div>
              </div>

              {/* Animated Chat Interface */}
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="bg-indigo-600 text-white p-4 rounded-t-xl -m-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="font-bold">Pharma BYOB Assistant</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">You:</p>
                    <p className="font-medium">Show me my top performing territories this quarter</p>
                  </div>

                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-indigo-600">Pharma BYOB:</p>
                    <div className="mt-2">
                      {isTyping ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Analyzing your data...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium mb-3">Here are your top 3 performing territories:</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="font-medium">Northeast Metro</span>
                              <span className="text-green-600 font-bold">+23.4%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="font-medium">Southwest Urban</span>
                              <span className="text-green-600 font-bold">+18.7%</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="font-medium">Central Rural</span>
                              <span className="text-green-600 font-bold">+15.2%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-red-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
                The Speed of Business is Faster Than the <span className="text-red-600">Speed of Insight</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Your organization is rich with data, but you're held back by a slow, rigid system of static dashboards and report requests. Urgent business questions turn into a multi-day waiting game, forcing you to make critical decisions with incomplete or outdated information.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "The Data Bottleneck",
                  description: "You can't freely interrogate your data. Every new question requires a ticket to the analytics team, creating long queues and delaying critical insights."
                },
                {
                  icon: (
                    <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  ),
                  title: "The Rigidity of Dashboards",
                  description: "Pre-built reports offer a 'look-but-don't-touch' view. They stifle curiosity and prevent the follow-up questions needed for deep, exploratory analysis."
                },
                {
                  icon: (
                    <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ),
                  title: "The Risk of Misinterpretation",
                  description: "A chart without context is just a number. Without understanding the complex business rules behind the data, your team risks drawing incorrect conclusions."
                }
              ].map((pain, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    {pain.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-4">{pain.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pain.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
                We Built <span className="text-indigo-600">Pharma BYOB</span> to Be Your Intelligent Analytics Partner
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
                We've replaced the friction of BI requests and the inflexibility of dashboards with a simple, natural language interface. Pharma BYOB empowers every business user—from field reps to brand leadership—to have a dynamic, direct conversation with your data in plain English.
              </p>

              {/* Core Innovation Callout */}
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 border-2 border-indigo-200 max-w-4xl mx-auto">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 p-3 rounded-full">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-4">The Core Innovation</h3>
                    <p className="text-lg text-indigo-700 leading-relaxed">
                      The true power lies in our <strong>Context-Aware Intelligence</strong>. Our proprietary Semantic Layer is a "knowledge brain" that understands your unique business rules, clinical guidelines, and KPI definitions. When you ask a question, it doesn't just see keywords; it understands your business intent, ensuring every answer is not just fast, but accurate and reliable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      {/* Role-Based Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                An Answer Engine Built for the <span className="text-indigo-600">Way You Work</span>
              </h2>
            </div>

            {/* Role Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-white p-2 rounded-xl shadow-lg flex gap-2">
                <button
                  onClick={() => setSelectedRole('field')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${selectedRole === 'field'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  Field Force & Sales Leadership
                </button>
                <button
                  onClick={() => setSelectedRole('hq')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${selectedRole === 'hq'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  HQ Brand & Marketing Leads
                </button>
              </div>
            </div>

            {/* Role Content */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Role Description */}
              <motion.div
                key={selectedRole}
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {selectedRole === 'field' ? (
                  <div>
                    <div className="bg-red-100 p-4 rounded-lg mb-6">
                      <h3 className="text-xl font-bold text-red-800 mb-2">Core Anxiety Addressed:</h3>
                      <p className="text-red-700 italic">"Am I wasting my time calling on the wrong physicians?"</p>
                    </div>

                    <h4 className="text-lg font-bold text-gray-dark mb-4">Sample Questions:</h4>
                    <div className="space-y-3 mb-6">
                      {questions.field.map((q, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border transition-all duration-300 ${i === currentQuestionIndex
                            ? 'bg-indigo-100 border-indigo-300 shadow-md'
                            : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <p className={`text-sm ${i === currentQuestionIndex ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                            "{q}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-bold text-gray-dark mb-4">Get Answers That Are:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-green-700">Prescriptive & Prioritized:</p>
                          <p className="text-gray-600">Ranked tables with actionable recommendations</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-blue-700">Visual & Explainable:</p>
                          <p className="text-gray-600">Charts and analysis showing the "why" behind insights</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-purple-700">Instant & On-the-Go:</p>
                          <p className="text-gray-600">Rich dashboards delivered in seconds</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-red-100 p-4 rounded-lg mb-6">
                      <h3 className="text-xl font-bold text-red-800 mb-2">Core Anxiety Addressed:</h3>
                      <p className="text-red-700 italic">"Can I answer the 'why' behind my brand's performance in a leadership meeting?"</p>
                    </div>

                    <h4 className="text-lg font-bold text-gray-dark mb-4">Sample Questions:</h4>
                    <div className="space-y-3 mb-6">
                      {questions.hq.map((q, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border transition-all duration-300 ${i === currentQuestionIndex
                            ? 'bg-indigo-100 border-indigo-300 shadow-md'
                            : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <p className={`text-sm ${i === currentQuestionIndex ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>
                            "{q}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-bold text-gray-dark mb-4">Get Answers That Are:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-green-700">Synthesized & Causal:</p>
                          <p className="text-gray-600">Executive dashboards with root-cause analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-blue-700">Report-Ready:</p>
                          <p className="text-gray-600">Professional charts and insights for presentations</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-purple-700">Holistic:</p>
                          <p className="text-gray-600">Integrated views across all data sources</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Right: Automated Demo */}
              <motion.div
                key={`demo-${selectedRole}-${currentQuestionIndex}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
                  <h4 className="font-bold">Live Demo</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Auto-cycling</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Your Question:</p>
                      <p className="font-medium">"{currentQuestion}"</p>
                    </div>

                    {isTyping ? (
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <p className="text-sm text-indigo-600 mb-2">Pharma BYOB is analyzing...</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Processing your request...</span>
                        </div>
                      </div>
                    ) : (showAnswer && currentAnswer) ? (
                      <motion.div
                        className="bg-indigo-50 rounded-lg border border-indigo-200 overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="p-4 border-b border-indigo-200">
                          <p className="text-sm text-indigo-600 font-medium">Pharma BYOB Answer:</p>
                        </div>

                        {/* Render different answer types */}
                        {currentAnswer && currentAnswer.type === 'table' && (
                          <div className="p-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-indigo-100">
                                  <tr>
                                    <th className="text-left py-2 px-3 font-semibold">#</th>
                                    <th className="text-left py-2 px-3 font-semibold">HCP</th>
                                    <th className="text-center py-2 px-3 font-semibold">Score</th>
                                    <th className="text-center py-2 px-3 font-semibold">Eligible Pts</th>
                                    <th className="text-center py-2 px-3 font-semibold">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentAnswer.data && currentAnswer.data.map((row, i) => (
                                    <tr key={i} className="border-b border-indigo-100 hover:bg-indigo-25">
                                      <td className="py-2 px-3 font-medium">{row.rank}</td>
                                      <td className="py-2 px-3">
                                        <div>
                                          <p className="font-medium">{row.name}</p>
                                          <p className="text-xs text-gray-500">{row.specialty}</p>
                                        </div>
                                      </td>
                                      <td className="py-2 px-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.score >= 90 ? 'bg-green-100 text-green-800' :
                                          row.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                          {row.score}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 text-center font-medium">{row.eligiblePts}</td>
                                      <td className="py-2 px-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                          }`}>
                                          {row.action}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {currentAnswer && currentAnswer.type === 'chart' && (
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-dark mb-4">{currentAnswer.data && currentAnswer.data.title}</h5>
                            <div className="space-y-3">
                              {currentAnswer.data && currentAnswer.data.hcps && currentAnswer.data.hcps.map((hcp, i) => (
                                <div key={i} className="bg-white p-3 rounded border">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{hcp.name}</span>
                                    <span className="text-sm text-gray-600">Opportunity: {hcp.opportunity} pts</span>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Eligible: {hcp.eligible}</span>
                                        <span>Current: {hcp.current}</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-indigo-600 h-2 rounded-full"
                                          style={{ width: `${(hcp.current / hcp.eligible) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentAnswer && currentAnswer.type === 'analysis' && (
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500">Previous Volume</p>
                                <p className="text-2xl font-bold text-gray-700">{currentAnswer.data && currentAnswer.data.previousVolume}</p>
                              </div>
                              <div className="bg-white p-3 rounded border">
                                <p className="text-xs text-gray-500">Current Volume</p>
                                <p className="text-2xl font-bold text-red-600">{currentAnswer.data && currentAnswer.data.currentVolume}</p>
                              </div>
                            </div>

                            <h6 className="font-semibold text-gray-dark mb-3">Impact Factors:</h6>
                            <div className="space-y-2">
                              {currentAnswer.data && currentAnswer.data.factors && currentAnswer.data.factors.map((factor, i) => (
                                <div key={i} className="bg-white p-3 rounded border">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{factor.factor}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                                      factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                      {factor.impact}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{factor.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentAnswer && currentAnswer.type === 'marketshare' && (
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-dark mb-4">{currentAnswer.data && currentAnswer.data.title}</h5>

                            {/* Market Share Chart */}
                            <div className="bg-white rounded-lg border p-4 mb-4">
                              <div className="h-48 relative">
                                <svg viewBox="0 0 400 200" className="w-full h-full">
                                  {/* Grid lines */}
                                  {[0, 10, 20, 30, 40].map(y => (
                                    <line key={y} x1="40" y1={180 - y * 3.5} x2="380" y2={180 - y * 3.5} stroke="#E5E7EB" strokeWidth="1" />
                                  ))}

                                  {/* Y-axis labels */}
                                  {[0, 10, 20, 30, 40].map(y => (
                                    <text key={y} x="35" y={185 - y * 3.5} textAnchor="end" className="text-xs fill-gray-500">{y}%</text>
                                  ))}

                                  {/* X-axis labels */}
                                  {currentAnswer.data && currentAnswer.data.quarters && currentAnswer.data.quarters.map((quarter, i) => (
                                    <text key={i} x={60 + i * 80} y="195" textAnchor="middle" className="text-xs fill-gray-500">{quarter}</text>
                                  ))}

                                  {/* Lines for each brand */}
                                  {currentAnswer.data && currentAnswer.data.brands && currentAnswer.data.brands.map((brand, brandIndex) => (
                                    <g key={brandIndex}>
                                      <polyline
                                        fill="none"
                                        stroke={brand.color}
                                        strokeWidth="3"
                                        points={brand.data.map((value, i) => `${60 + i * 80},${180 - value * 3.5}`).join(' ')}
                                      />
                                      {/* Data points */}
                                      {brand.data.map((value, i) => (
                                        <circle
                                          key={i}
                                          cx={60 + i * 80}
                                          cy={180 - value * 3.5}
                                          r="4"
                                          fill={brand.color}
                                        />
                                      ))}
                                    </g>
                                  ))}
                                </svg>
                              </div>
                            </div>

                            {/* Brand Summary */}
                            <div className="grid grid-cols-2 gap-3">
                              {currentAnswer.data && currentAnswer.data.brands && currentAnswer.data.brands.map((brand, i) => (
                                <div key={i} className="bg-white p-3 rounded border">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }}></div>
                                    <span className="font-medium text-sm">{brand.name}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold">{brand.current}%</span>
                                    <span className={`text-sm font-medium ${brand.change > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                      {brand.change > 0 ? '+' : ''}{brand.change}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentAnswer && currentAnswer.type === 'revenue' && (
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-dark mb-4">{currentAnswer.data && currentAnswer.data.title}</h5>

                            {/* Revenue Chart */}
                            <div className="bg-white rounded-lg border p-4 mb-4">
                              <div className="h-56 relative">
                                <svg viewBox="0 0 500 240" className="w-full h-full">
                                  {/* Grid lines */}
                                  {[0, 20, 40, 60, 80].map(y => (
                                    <line key={y} x1="50" y1={200 - y * 2} x2="480" y2={200 - y * 2} stroke="#E5E7EB" strokeWidth="1" />
                                  ))}

                                  {/* Y-axis labels */}
                                  {[0, 20, 40, 60, 80].map(y => (
                                    <text key={y} x="45" y={205 - y * 2} textAnchor="end" className="text-xs fill-gray-500">${y}M</text>
                                  ))}

                                  {/* X-axis labels */}
                                  {currentAnswer.data && currentAnswer.data.quarters && currentAnswer.data.quarters.map((quarter, i) => (
                                    <text key={i} x={70 + i * 50} y="220" textAnchor="middle" className="text-xs fill-gray-500">{quarter}</text>
                                  ))}

                                  {/* Lines for each region */}
                                  {currentAnswer.data && currentAnswer.data.regions && currentAnswer.data.regions.map((region, regionIndex) => (
                                    <g key={regionIndex}>
                                      <polyline
                                        fill="none"
                                        stroke={region.color}
                                        strokeWidth="2"
                                        points={[region.q1_23, region.q2_23, region.q3_23, region.q4_23, region.q1_24, region.q2_24, region.q3_24, region.q4_24]
                                          .map((value, i) => `${70 + i * 50},${200 - value * 2}`).join(' ')}
                                      />
                                      {/* Data points */}
                                      {[region.q1_23, region.q2_23, region.q3_23, region.q4_23, region.q1_24, region.q2_24, region.q3_24, region.q4_24].map((value, i) => (
                                        <circle
                                          key={i}
                                          cx={70 + i * 50}
                                          cy={200 - value * 2}
                                          r="3"
                                          fill={region.color}
                                        />
                                      ))}
                                    </g>
                                  ))}
                                </svg>
                              </div>
                            </div>

                            {/* Region Legend */}
                            <div className="grid grid-cols-2 gap-3">
                              {currentAnswer.data && currentAnswer.data.regions && currentAnswer.data.regions.map((region, i) => (
                                <div key={i} className="bg-white p-3 rounded border">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }}></div>
                                    <span className="font-medium text-sm">{region.name}</span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Latest: ${region.q4_24}M
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentAnswer && currentAnswer.type === 'territories' && (
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-dark mb-4">{currentAnswer.data && currentAnswer.data.title}</h5>

                            <div className="space-y-3">
                              {currentAnswer.data && currentAnswer.data.territories && currentAnswer.data.territories.map((territory, i) => (
                                <div key={i} className="bg-white p-4 rounded border">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: territory.color }}>
                                        {i + 1}
                                      </div>
                                      <div>
                                        <h6 className="font-semibold text-gray-dark">{territory.name}</h6>
                                        <p className="text-xs text-gray-500">Rep: {territory.rep}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-gray-dark">{territory.volume.toLocaleString()}</p>
                                      <p className="text-xs text-gray-500">prescriptions</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                      <p className="text-sm text-gray-500">Growth Rate</p>
                                      <p className={`font-bold ${territory.growth > 15 ? 'text-green-600' : 'text-blue-600'}`}>
                                        +{territory.growth}%
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">HCPs</p>
                                      <p className="font-bold text-gray-700">{territory.hcps}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Avg per HCP</p>
                                      <p className="font-bold text-gray-700">{Math.round(territory.volume / territory.hcps)}</p>
                                    </div>
                                  </div>

                                  {/* Growth bar */}
                                  <div className="mt-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="h-2 rounded-full"
                                        style={{
                                          width: `${Math.min(territory.growth * 4, 100)}%`,
                                          backgroundColor: territory.color
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
                Powered by a <span className="text-indigo-600">Scalable, Future-Proof</span> Architecture
              </h2>
            </div>

            {/* Technology Flow Animation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12">
              <div className="flex items-center justify-between">
                {[
                  { label: "Question", icon: "💬", color: "bg-blue-500" },
                  { label: "Context Layer", icon: "🧠", color: "bg-indigo-500" },
                  { label: "Orchestration", icon: "⚙️", color: "bg-purple-500" },
                  { label: "Answer", icon: "✨", color: "bg-green-500" }
                ].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white text-2xl mb-2 mx-auto`}>
                        {step.icon}
                      </div>
                      <p className="font-semibold text-gray-dark">{step.label}</p>
                    </div>
                    {i < 3 && (
                      <div className="flex-1 mx-4">
                        <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full relative overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Components */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Decoupled Context Layer",
                  description: "Our 'knowledge brain' that isolates and codifies your business logic, ensuring accuracy and making the platform incredibly efficient to scale to new brands or therapeutic areas.",
                  icon: (
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: "Modular Orchestration Engine",
                  description: "An intelligent agent that breaks down your request and deploys the right tool for the job—from SQL retrieval to Python analysis—allowing it to answer a virtually infinite variety of questions.",
                  icon: (
                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  title: "Interactive Visualization Generator",
                  description: "The 'last mile' of analytics. It automatically renders data as interactive charts and provides a natural language summary, bridging the gap between raw data and human understanding.",
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "Model-Agnostic Design",
                  description: "Future-proofs your investment by allowing us to integrate the newest, most powerful, and cost-efficient large language models as they become available.",
                  icon: (
                    <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map((component, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {component.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-dark mb-3">{component.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{component.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center text-white max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold mb-8">
                Stop Waiting for Data. <span className="text-yellow-300">Start Making Decisions.</span>
              </h2>
              <p className="text-xl mb-12 opacity-90 leading-relaxed">
                Empower your teams with the instant, reliable, and contextual insights they need to outmaneuver the competition. Discover how a direct conversation with your data can transform your commercial strategy.
              </p>
              <motion.button
                className="bg-white text-indigo-600 px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo of Pharma BYOB
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const HCPTargeting = () => {
  const [selectedPillar, setSelectedPillar] = React.useState(0);
  const [selectedHCP, setSelectedHCP] = React.useState(null);

  const therapeuticAreas = [
    {
      area: "Respiratory & Immunology",
      focus: "Asthma, COPD, Systemic Lupus Erythematosus (SLE)",
      brands: "Anti-TSLP mAb, Anti-IL5R mAb, Triple ICS/LABA/LAMA, Anti-IFN mAb"
    },
    {
      area: "Renal & Metabolic",
      focus: "Chronic Kidney Disease (CKD), Type 2 Diabetes, Hyperkalemia",
      brands: "SGLT2 Inhibitor, Potassium Binder"
    },
    {
      area: "Cardiovascular",
      focus: "Heart Failure",
      brands: "SGLT2 Inhibitor"
    },
    {
      area: "Rare Diseases",
      focus: "ATTR Amyloidosis",
      brands: "TTR-targeting ASO"
    }
  ];

  const pillars = [
    {
      id: 1,
      title: "Foundational Universe Design",
      description: "Building a comprehensive and dynamic universe of priority HCPs using predictive models for likelihood to initiate and risk of discontinuation.",
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      mockupData: {
        title: "HCP Universe Dashboard",
        hcps: [
          { name: "Dr. Sarah Chen", specialty: "Cardiologist", volume: "High", startProb: 0.85, stopRisk: 0.12, eligiblePts: 45, priority: "A1" },
          { name: "Dr. Michael Rodriguez", specialty: "Endocrinologist", volume: "Medium", startProb: 0.72, stopRisk: 0.28, eligiblePts: 32, priority: "A2" },
          { name: "Dr. Jennifer Kim", specialty: "Nephrologist", volume: "High", startProb: 0.91, stopRisk: 0.08, eligiblePts: 67, priority: "A1" },
          { name: "Dr. Robert Johnson", specialty: "Cardiologist", volume: "Medium", startProb: 0.68, stopRisk: 0.35, eligiblePts: 28, priority: "B1" },
          { name: "Dr. Lisa Thompson", specialty: "Endocrinologist", volume: "Low", startProb: 0.45, stopRisk: 0.52, eligiblePts: 15, priority: "C1" }
        ]
      }
    },
    {
      id: 2,
      title: "Predictive Trigger Engine",
      description: "Deploying predictive models to identify critical, time-sensitive events such as newly eligible patients, switching risk, and adoption propensity.",
      icon: (
        <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      mockupData: {
        title: "Predictive Triggers Dashboard",
        triggers: [
          { hcp: "Dr. Sarah Chen", trigger: "High Switching Risk", probability: 0.87, urgency: "High", action: "Retention Visit", timeline: "Next 7 days" },
          { hcp: "Dr. Michael Rodriguez", trigger: "New Eligible Patients", probability: 0.92, urgency: "Medium", action: "Educational Visit", timeline: "Next 14 days" },
          { hcp: "Dr. Jennifer Kim", trigger: "Adoption Propensity", probability: 0.78, urgency: "High", action: "Product Demo", timeline: "Next 5 days" },
          { hcp: "Dr. Robert Johnson", trigger: "Competitor Threat", probability: 0.65, urgency: "Medium", action: "Competitive Positioning", timeline: "Next 10 days" }
        ]
      }
    },
    {
      id: 3,
      title: "Advanced Behavioral Segmentation",
      description: "Building sophisticated HCP segmentation models based on prescription behaviors, engagement history, and decision drivers.",
      icon: (
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      mockupData: {
        title: "HCP Behavioral Segments",
        segments: [
          { name: "Early Adopters", count: 156, characteristics: "Quick to try new therapies, high engagement", messaging: "Innovation-focused, clinical evidence", color: "bg-green-500" },
          { name: "Evidence Seekers", count: 243, characteristics: "Data-driven, cautious prescribers", messaging: "Comprehensive studies, peer testimonials", color: "bg-blue-500" },
          { name: "Relationship Driven", count: 189, characteristics: "Values personal connections, loyalty", messaging: "Relationship-building, trust-focused", color: "bg-purple-500" },
          { name: "Cost Conscious", count: 127, characteristics: "Budget-aware, value-focused", messaging: "Economic benefits, cost-effectiveness", color: "bg-orange-500" }
        ]
      }
    },
    {
      id: 4,
      title: "Intelligent Territory Optimization",
      description: "Optimizing and ranking triggered HCPs for each territory, ensuring clear prioritized lists that maximize field capacity.",
      icon: (
        <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7" />
        </svg>
      ),
      mockupData: {
        title: "Territory Optimization View",
        territories: [
          { name: "Northeast Metro", rep: "John Smith", hcpCount: 45, priorityHCPs: 12, coverage: 87, efficiency: 92 },
          { name: "Southwest Rural", rep: "Maria Garcia", hcpCount: 32, priorityHCPs: 8, coverage: 78, efficiency: 85 },
          { name: "Central Urban", rep: "David Lee", hcpCount: 67, priorityHCPs: 18, coverage: 91, efficiency: 88 }
        ]
      }
    }
  ];

  const sampleHCP = {
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    location: "Boston Medical Center",
    overallScore: 92,
    segment: "Early Adopter",
    triggers: [
      { type: "High Switching Risk", score: 87, urgency: "High" },
      { type: "New Eligible Patients", score: 76, urgency: "Medium" }
    ],
    metrics: {
      eligiblePatients: 45,
      currentPrescriptions: 28,
      adoptionPropensity: 0.85,
      competitorRisk: 0.23
    },
    messaging: {
      primary: "Focus on clinical efficacy and patient outcomes",
      secondary: "Emphasize innovation and latest research",
      approach: "Data-driven conversation with peer testimonials"
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h1
                  className="text-5xl font-extrabold text-gray-dark leading-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Precision HCP Targeting <span className="text-purple-600">Powered by AI</span>
                </motion.h1>
                <motion.p
                  className="mt-6 text-xl text-gray-medium leading-relaxed"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Transform static call plans into <span className="font-bold text-purple-600">dynamic, intelligent targeting</span>. Our AutoML-powered platform identifies high-potential HCPs and delivers real-time triggers to maximize field effectiveness.
                </motion.p>
              </div>

              {/* HCP Targeting Visualization */}
              <div className="flex justify-center">
                <motion.div
                  className="relative w-full max-w-[500px] h-96 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-200 shadow-2xl overflow-hidden p-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  {/* HCP Targeting Metrics Visualization */}
                  <div className="flex flex-col h-full justify-center items-center">
                    <div className="text-center mb-6">
                      <div className="text-sm font-semibold text-purple-600 mb-2">AI-Powered HCP Targeting</div>
                      <div className="text-4xl font-bold text-purple-700">2,847 HCPs</div>
                      <div className="text-xs text-gray-600">156 High-Priority Triggers Active</div>
                    </div>

                    {/* Animated bars for targeting metrics */}
                    <div className="w-full space-y-4">
                      {[
                        { label: 'Start Propensity', value: 92, color: 'bg-green-500' },
                        { label: 'Stop Risk Detection', value: 88, color: 'bg-red-500' },
                        { label: 'Behavioral Segmentation', value: 95, color: 'bg-indigo-500' },
                        { label: 'Territory Optimization', value: 85, color: 'bg-purple-500' }
                      ].map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span className="font-medium">{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <motion.div
                            className="h-3 bg-gray-200 rounded-full overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                          >
                            <motion.div
                              className={`h-full ${item.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 1, delay: 1 + index * 0.1, ease: 'easeOut' }}
                            />
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {/* Animated icon at bottom */}
                    <motion.div
                      className="mt-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    >
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="absolute top-8 right-12 w-1 h-1 bg-indigo-400 rounded-full"></div>
                    <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Problem Section - Simplified */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Static call plans can't keep up with <span className="text-purple-600">dynamic markets</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg text-center"
                whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">Outdated Lists</h3>
                <p className="text-gray-600 text-sm">
                  Annual target lists are obsolete before ink dries, missing real-time opportunities
                </p>
              </motion.div>

                <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg text-center"
                whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">Wasted Effort</h3>
                <p className="text-gray-600 text-sm">
                  Reps spend time on low-potential HCPs while high-value opportunities slip away
                </p>
                </motion.div>

                <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg text-center"
                whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">No Context</h3>
                <p className="text-gray-600 text-sm">
                  Generic lists provide no actionable insight on why to engage an HCP now
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* How It Works - Clean Icons */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                How <span className="text-purple-600">Precision Targeting</span> Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                AutoML-powered intelligence that transforms data into actionable HCP priorities
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
                {[
                  {
                    number: "01",
                  title: "Unified Data",
                  description: "Claims, CRM, EHR & HCP data unified in real-time",
                    icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    ),
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    number: "02",
                  title: "AutoML Engine",
                  description: "AI models predict HCP behavior & opportunities",
                    icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    color: "from-indigo-500 to-indigo-600"
                  },
                  {
                    number: "03",
                  title: "Smart Triggers",
                  description: "Real-time alerts for high-value moments",
                    icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    color: "from-purple-600 to-indigo-600"
                  },
                  {
                    number: "04",
                  title: "Territory Optimization",
                  description: "Prioritized lists optimized per rep",
                    icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7" />
                      </svg>
                    ),
                    color: "from-indigo-600 to-purple-600"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                  <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                      {step.icon}
                    </div>
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-dark mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Four Pillars Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                From Data Overload to <span className="text-purple-600">Actionable Intelligence</span>
              </h2>
              <p className="text-xl text-gray-medium">Our Four-Pillar Approach to Precision</p>
            </div>

            <div className="space-y-24">
              {/* Pillar 1: Foundational Universe Design */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-dark mb-2">1. Foundational Universe Design</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We begin by building a comprehensive and dynamic universe of priority HCPs. Moving beyond simple volume, we deploy predictive models—such as <strong>likelihood to initiate</strong> a new patient (<strong>Start</strong>) or <strong>risk of discontinuation</strong> (<strong>Stop</strong>)—to create a data-backed roadmap that forms the strategic foundation for all marketing and sales activities.
                      </p>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Key Features:</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Predictive start/stop probability scoring</li>
                          <li>• Dynamic HCP prioritization (A1, A2, B1, C1)</li>
                          <li>• Eligible patient count analysis</li>
                          <li>• Real-time universe updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                  <div className="bg-purple-600 text-white p-4">
                    <h4 className="font-bold">HCP Universe Dashboard</h4>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">HCP Name</th>
                            <th className="text-left py-2">Specialty</th>
                            <th className="text-center py-2">Start Prob</th>
                            <th className="text-center py-2">Stop Risk</th>
                            <th className="text-center py-2">Eligible Pts</th>
                            <th className="text-center py-2">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pillars[0].mockupData.hcps.map((hcp, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                              <td className="py-2 font-medium">{hcp.name}</td>
                              <td className="py-2 text-gray-600">{hcp.specialty}</td>
                              <td className="py-2 text-center">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  {Math.round(hcp.startProb * 100)}%
                                </span>
                              </td>
                              <td className="py-2 text-center">
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                  {Math.round(hcp.stopRisk * 100)}%
                                </span>
                              </td>
                              <td className="py-2 text-center font-medium">{hcp.eligiblePts}</td>
                              <td className="py-2 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${hcp.priority.startsWith('A') ? 'bg-red-100 text-red-800' :
                                  hcp.priority.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {hcp.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Predictive Trigger Engine */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border order-2 lg:order-1">
                  <div className="bg-purple-600 text-white p-4">
                    <h4 className="font-bold">HCP Trigger Alerts</h4>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {[
                        { hcp: "Dr. Sarah Chen", score: 87, trigger: "High Switching Risk", urgency: "High", color: "red" },
                        { hcp: "Dr. Michael Rodriguez", score: 92, trigger: "New Eligible Patients", urgency: "Medium", color: "yellow" },
                        { hcp: "Dr. Jennifer Kim", score: 78, trigger: "Adoption Propensity", urgency: "High", color: "red" },
                        { hcp: "Dr. Robert Johnson", score: 65, trigger: "Competitor Threat", urgency: "Medium", color: "yellow" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-dark">{item.hcp}</p>
                              <p className="text-sm text-gray-600">{item.trigger}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-purple-600">{item.score}%</p>
                              <p className="text-xs text-gray-500">Probability</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.color === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {item.urgency}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-200 order-1 lg:order-2">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-dark mb-2">2. Predictive Trigger Engine</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        This is the heart of our program. We develop and deploy a suite of predictive models aligned with your core brand objectives. These triggers identify critical, time-sensitive events, such as an HCP with newly <strong>eligible patients</strong>, an HCP <strong>at risk of switching</strong> to a competitor, or an HCP showing a high <strong>propensity to adopt</strong> your brand.
                      </p>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 mb-2">Trigger Types:</h4>
                        <ul className="text-sm text-indigo-700 space-y-1">
                          <li>• High switching risk detection</li>
                          <li>• New eligible patient identification</li>
                          <li>• Adoption propensity scoring</li>
                          <li>• Competitive threat alerts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Advanced Behavioral Segmentation & Patient Pathways */}
              <div className="space-y-8">
                {/* Section Header */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-dark mb-3">
                    3. Advanced Behavioral Intelligence
                  </h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Combining HCP behavioral segmentation with patient pathway analysis to deliver personalized, data-driven engagement strategies
                  </p>
                </div>

                {/* Two-Part Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Part A: HCP Behavioral Segmentation */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-dark mb-2">HCP Behavioral Segmentation</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Sophisticated segmentation models based on past prescription behaviors, engagement history, and decision drivers. Understand the "why" behind HCP decisions to tailor your messaging approach.
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2 text-sm">Key Benefits:</h5>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Personalized messaging strategies</li>
                        <li>• Behavioral pattern recognition</li>
                        <li>• Engagement optimization</li>
                        <li>• Decision driver analysis</li>
                      </ul>
                    </div>
                  </div>

                  {/* Part B: Patient Pathways Analysis */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="bg-teal-100 p-3 rounded-full flex-shrink-0">
                        <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-dark mb-2">Patient Pathways Analysis</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Analyze patient behaviors, treatment journeys, and clinical drivers to surface explainable insights. Equip reps with evidence-based patient stories and clinical rationale for each HCP.
                        </p>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-teal-800 mb-2 text-sm">Key Insights:</h5>
                      <ul className="text-xs text-teal-700 space-y-1">
                        <li>• Patient journey mapping & touchpoints</li>
                        <li>• Clinical driver identification</li>
                        <li>• Treatment pattern explainability</li>
                        <li>• Evidence-based messaging for HCPs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Visual Representation - Combined View */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="grid lg:grid-cols-2 divide-x divide-gray-200">
                    {/* HCP Segments Visual */}
                    <div>
                      <div className="bg-green-600 text-white p-4">
                        <h4 className="font-bold">HCP Behavioral Segments</h4>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: "Early Adopters", count: 156, color: "bg-green-500", avatar: "EA" },
                            { name: "Evidence Seekers", count: 243, color: "bg-blue-500", avatar: "ES" },
                            { name: "Relationship Driven", count: 189, color: "bg-purple-500", avatar: "RD" },
                            { name: "Cost Conscious", count: 127, color: "bg-orange-500", avatar: "CC" }
                          ].map((segment, i) => (
                            <div key={i} className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                              <div className={`w-14 h-14 ${segment.color} rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2`}>
                                {segment.avatar}
                              </div>
                              <h5 className="font-bold text-gray-dark text-sm mb-1">{segment.name}</h5>
                              <p className="text-xs text-gray-600">{segment.count} HCPs</p>
                              <div className="mt-2 flex justify-center space-x-1">
                                {[...Array(3)].map((_, j) => (
                                  <div key={j} className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Patient Pathway Visual */}
                    <div>
                      <div className="bg-teal-600 text-white p-4">
                        <h4 className="font-bold">Patient Pathway Drivers</h4>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {[
                            {
                              driver: "Treatment Resistance",
                              impact: "High",
                              color: "text-red-600",
                              bgColor: "bg-red-50",
                              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            },
                            {
                              driver: "Disease Progression",
                              impact: "High",
                              color: "text-orange-600",
                              bgColor: "bg-orange-50",
                              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            },
                            {
                              driver: "Biomarker Expression",
                              impact: "Medium",
                              color: "text-blue-600",
                              bgColor: "bg-blue-50",
                              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            },
                            {
                              driver: "Prior Treatment Lines",
                              impact: "Medium",
                              color: "text-purple-600",
                              bgColor: "bg-purple-50",
                              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            },
                            {
                              driver: "Comorbidity Burden",
                              impact: "Low",
                              color: "text-teal-600",
                              bgColor: "bg-teal-50",
                              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            }
                          ].map((pathway, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 ${pathway.bgColor} rounded-lg border border-gray-200 hover:shadow-sm transition-shadow`}>
                              <div className="flex items-center space-x-3">
                                <div className={`${pathway.color}`}>
                                  {pathway.icon}
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-dark text-sm">{pathway.driver}</h5>
                                  <p className="text-xs text-gray-500">Clinical Impact: {pathway.impact}</p>
                                </div>
                              </div>
                              <div className={`px-2 py-1 ${pathway.bgColor} rounded-full border ${pathway.color} text-xs font-semibold`}>
                                {pathway.impact}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <strong>Explainable Insights:</strong> Surface patient-level drivers and clinical rationale to empower reps with evidence-based messaging tailored to each HCP's patient population.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Intelligent Territory Optimization */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border order-2 lg:order-1">
                  <div className="bg-orange-600 text-white p-4">
                    <h4 className="font-bold">Territory Performance Optimization</h4>
                  </div>
                  <div className="p-6">
                    {/* Territory Map Visualization */}
                    <div className="relative bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 mb-4">
                      <div className="grid grid-cols-3 gap-4 h-32">
                        {[
                          { name: "Northeast", efficiency: 92, hcps: 45, color: "bg-green-500" },
                          { name: "Southwest", efficiency: 85, hcps: 32, color: "bg-yellow-500" },
                          { name: "Central", efficiency: 88, hcps: 67, color: "bg-blue-500" }
                        ].map((territory, i) => (
                          <div key={i} className="relative">
                            <div className={`${territory.color} rounded-lg p-3 h-full flex flex-col justify-center items-center text-white shadow-lg`}>
                              <h6 className="font-bold text-sm">{territory.name}</h6>
                              <p className="text-xs">{territory.hcps} HCPs</p>
                              <p className="text-xs">{territory.efficiency}% Eff</p>
                            </div>
                            {/* Connection lines */}
                            {i < 2 && (
                              <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimization Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">144</p>
                        <p className="text-xs text-gray-600">Total HCPs</p>
                      </div>
                      <div className="bg-white border rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">38</p>
                        <p className="text-xs text-gray-600">Priority HCPs</p>
                      </div>
                      <div className="bg-white border rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">88%</p>
                        <p className="text-xs text-gray-600">Avg Coverage</p>
                      </div>
                      <div className="bg-white border rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">88%</p>
                        <p className="text-xs text-gray-600">Avg Efficiency</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200 order-1 lg:order-2">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-orange-100 p-4 rounded-full">
                      <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-dark mb-2">4. Intelligent Territory Optimization</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        We translate powerful insights into on-the-ground action. Our engine optimizes and ranks the triggered HCPs for each specific territory, ensuring every sales representative receives a clear, prioritized, and manageable list of opportunities to act on. This maximizes field capacity and ensures focus.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">Optimization Features:</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• Territory-specific HCP ranking</li>
                          <li>• Rep capacity optimization</li>
                          <li>• Geographic efficiency analysis</li>
                          <li>• Performance tracking & adjustment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* HCP Detail View Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Complete <span className="text-blue-600">HCP Intelligence</span> at Your Fingertips
              </h2>
              <p className="text-xl text-gray-medium">Detailed HCP profiles with actionable insights and messaging guidance</p>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border">
              {/* HCP Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{sampleHCP.name}</h3>
                    <p className="text-blue-100">{sampleHCP.specialty} • {sampleHCP.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{sampleHCP.overallScore}</div>
                    <div className="text-sm text-blue-100">Overall Score</div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 p-6">
                {/* Predictive Triggers */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h4 className="font-bold text-gray-dark mb-4 flex items-center">
                    <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Active Triggers
                  </h4>
                  <div className="space-y-3">
                    {sampleHCP.triggers.map((trigger, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{trigger.type}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${trigger.urgency === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {trigger.urgency}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">{trigger.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HCP Metrics */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-dark mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Key Metrics
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Eligible Patients</span>
                        <span className="font-bold">{sampleHCP.metrics.eligiblePatients}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Current Prescriptions</span>
                        <span className="font-bold">{sampleHCP.metrics.currentPrescriptions}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Adoption Propensity</span>
                        <span className="font-bold text-green-600">{Math.round(sampleHCP.metrics.adoptionPropensity * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Competitor Risk</span>
                        <span className="font-bold text-orange-600">{Math.round(sampleHCP.metrics.competitorRisk * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messaging Strategy */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-gray-dark mb-4 flex items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Messaging Strategy
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Segment</span>
                      <p className="font-bold text-green-600">{sampleHCP.segment}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Primary Message</span>
                      <p className="text-sm text-gray-600">{sampleHCP.messaging.primary}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Secondary Focus</span>
                      <p className="text-sm text-gray-600">{sampleHCP.messaging.secondary}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Approach</span>
                      <p className="text-sm text-gray-600">{sampleHCP.messaging.approach}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Outcomes Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Empower Your Field Force, <span className="text-blue-600">Accelerate Brand Growth</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: "Maximize Field Force Effectiveness",
                  description: "Equip your reps to engage the right HCP at the right time with a clear, data-driven reason. This focuses their efforts, optimizes their time, and drives more meaningful clinical conversations."
                },
                {
                  icon: (
                    <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: "Preempt Competitive Threats & Secure Market Share",
                  description: "Our proactive 'risk of switching' and behavioral models identify competitive threats early, allowing for timely intervention to protect and grow your brand's position."
                },
                {
                  icon: (
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  title: "Drive Measurable ROI and Accelerate Adoption",
                  description: "By focusing your entire commercial effort on the HCPs with the highest potential, you optimize promotional investment, shorten the adoption curve for new patients, and achieve sustainable brand growth."
                }
              ].map((outcome, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-gray-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    {outcome.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-4">{outcome.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{outcome.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
      {/* Therapeutic Areas Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Proven Across the <span className="text-blue-600">Biopharmaceutical Landscape</span>
              </h2>
              <p className="text-xl text-gray-medium">
                Expertise You Can Trust, In the Markets That Matter
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold">Therapeutic Area</th>
                      <th className="text-left py-4 px-6 font-bold">Key Focus Areas</th>
                      <th className="text-left py-4 px-6 font-bold">Brand Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {therapeuticAreas.map((area, index) => (
                      <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-dark">{area.area}</td>
                        <td className="py-4 px-6 text-gray-600">{area.focus}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            {area.brands.split(', ').map((brand, i) => (
                              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {brand}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center text-white max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold mb-8">
                Ready to Transform Your Field Engagement Strategy?
              </h2>
              <p className="text-xl mb-12 opacity-90 leading-relaxed">
                Stop relying on static lists and empower your team with the dynamic intelligence needed to win. Let's discuss how our HCP Precision Targeting program can be tailored to your brand's specific objectives.
              </p>
              <motion.button
                className="bg-white text-blue-600 px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Consultation
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

// HCP Channel & Indication Optimizer Component
const HCPChannelIndicationOptimizer = () => {
  const [activeTab, setActiveTab] = React.useState('channel');
  const [selectedHCP, setSelectedHCP] = React.useState(0);

  // Channel optimization data
  const channelData = [
    { channel: 'F2F Visit', cost: 350, avgResponse: 8.5, roi: 2.43, icon: '👤', color: 'from-blue-500 to-indigo-500', optimalFreq: 4 },
    { channel: 'Virtual Call', cost: 120, avgResponse: 5.2, roi: 4.33, icon: '💻', color: 'from-purple-500 to-pink-500', optimalFreq: 6 },
    { channel: 'Email', cost: 15, avgResponse: 1.8, roi: 12.0, icon: '✉️', color: 'from-emerald-500 to-teal-500', optimalFreq: 12 },
    { channel: 'Speaker Program', cost: 2500, avgResponse: 25, roi: 1.0, icon: '🎤', color: 'from-orange-500 to-red-500', optimalFreq: 2 },
  ];

  // HCP-level channel recommendations
  const hcpChannelRecommendations = [
    { 
      name: 'Dr. Sarah Chen', 
      specialty: 'Oncologist', 
      tier: 'Tier 1',
      preferredChannel: 'F2F Visit',
      channelMix: { f2f: 4, virtual: 2, email: 6, speaker: 1 },
      expectedROI: 3.2,
      budgetAllocation: '$2,840',
      insight: 'High response to in-person interactions. Congress attendee.'
    },
    { 
      name: 'Dr. Michael Rodriguez', 
      specialty: 'Oncologist', 
      tier: 'Tier 2',
      preferredChannel: 'Virtual Call',
      channelMix: { f2f: 2, virtual: 5, email: 8, speaker: 0 },
      expectedROI: 4.8,
      budgetAllocation: '$1,420',
      insight: 'Prefers virtual meetings. High email engagement rate.'
    },
    { 
      name: 'Dr. Jennifer Kim', 
      specialty: 'Oncologist', 
      tier: 'Tier 1',
      preferredChannel: 'Email',
      channelMix: { f2f: 3, virtual: 3, email: 12, speaker: 1 },
      expectedROI: 5.1,
      budgetAllocation: '$3,830',
      insight: 'Digital-first. Opens 78% of emails. KOL with speaker potential.'
    },
  ];

  // Indication prioritization data
  const indicationData = [
    { id: 'DB03', name: 'DB03 (Early Stage)', weight: 2.0, color: '#10B981', patients: 245 },
    { id: 'DB04', name: 'DB04 (Metastatic)', weight: 1.2, color: '#3B82F6', patients: 189 },
    { id: 'OLYMPIA', name: 'OLYMPIA', weight: 1.2, color: '#8B5CF6', patients: 156 },
    { id: 'OLYMPIAD', name: 'OLYMPIAD', weight: 1.0, color: '#EC4899', patients: 98 },
    { id: 'TRUQAP', name: 'TRUQAP', weight: 1.0, color: '#F59E0B', patients: 134 },
  ];

  // HCP indication priorities
  const hcpIndicationPriorities = [
    {
      name: 'Dr. Sarah Chen',
      priorities: [
        { indication: 'DB03', score: 67, rank: 1, reason: 'High patient volume + Awareness stage' },
        { indication: 'OLYMPIA', score: 55, rank: 2, reason: 'Strong trial history' },
        { indication: 'DB04', score: 42, rank: 3, reason: 'Growing patient base' },
        { indication: 'TRUQAP', score: 31, rank: 4, reason: 'New indication opportunity' },
      ],
      totalNPS: 225,
      adoptionStage: 'Trial'
    },
    {
      name: 'Dr. Michael Rodriguez',
      priorities: [
        { indication: 'OLYMPIAD', score: 58, rank: 1, reason: 'Specialist focus area' },
        { indication: 'DB04', score: 45, rank: 2, reason: 'High predicted NPS' },
        { indication: 'DB03', score: 38, rank: 3, reason: 'Moderate patient volume' },
        { indication: 'OLYMPIA', score: 24, rank: 4, reason: 'Emerging interest' },
      ],
      totalNPS: 178,
      adoptionStage: 'Awareness'
    },
    {
      name: 'Dr. Jennifer Kim',
      priorities: [
        { indication: 'DB03', score: 72, rank: 1, reason: 'KOL for early-stage' },
        { indication: 'TRUQAP', score: 48, rank: 2, reason: 'Clinical trial investigator' },
        { indication: 'OLYMPIA', score: 41, rank: 3, reason: 'Publication history' },
        { indication: 'DB04', score: 33, rank: 4, reason: 'Secondary focus' },
      ],
      totalNPS: 245,
      adoptionStage: 'Advocate'
    },
  ];

  // Budget allocation simulation
  const [budgetAmount, setBudgetAmount] = React.useState(100000);
  const calculateOptimalMix = (budget) => {
    // Simulated optimal allocation based on ROI
    const emailBudget = Math.min(budget * 0.15, 15000);
    const virtualBudget = Math.min(budget * 0.25, 25000);
    const f2fBudget = Math.min(budget * 0.45, 45000);
    const speakerBudget = budget - emailBudget - virtualBudget - f2fBudget;
    
    return {
      email: { budget: emailBudget, units: Math.floor(emailBudget / 15), revenue: emailBudget * 12 },
      virtual: { budget: virtualBudget, units: Math.floor(virtualBudget / 120), revenue: virtualBudget * 4.33 },
      f2f: { budget: f2fBudget, units: Math.floor(f2fBudget / 350), revenue: f2fBudget * 2.43 },
      speaker: { budget: speakerBudget, units: Math.floor(speakerBudget / 2500), revenue: speakerBudget * 1.0 },
    };
  };

  const optimalMix = calculateOptimalMix(budgetAmount);
  const totalRevenue = Object.values(optimalMix).reduce((sum, ch) => sum + ch.revenue, 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
          <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
          >
                  <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
              Extension to Commercial Budget Optimizer
                </motion.div>

                <motion.h1
                  className="text-5xl font-extrabold text-gray-dark leading-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Optimize <span className="text-purple-600">Channel Mix</span> & <span className="text-indigo-600">Messaging Priority</span>
                </motion.h1>

                <motion.p
                  className="mt-6 text-xl text-gray-medium leading-relaxed"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Beyond visit frequency — optimize <span className="font-bold text-purple-600">which channel</span> to use and <span className="font-bold text-indigo-600">what indications to prioritize</span> for every HCP interaction, maximizing engagement and ROI.
                </motion.p>

              </div>

            {/* Two Key Capabilities */}
              <div className="space-y-4">
              <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg">
                  📡
                </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-900 mb-2">Channel Optimizer</h3>
                      <p className="text-purple-700">
                  Find the right mix of F2F visits, virtual calls, emails, and speaker programs for each HCP — maximizing ROI per dollar spent.
                </p>
                    </div>
                  </div>
              </motion.div>

              <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg">
                  🎯
                </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900 mb-2">Indication Prioritizer</h3>
                      <p className="text-indigo-700">
                  Know which indications to lead with for each HCP — based on patient opportunity, predicted NPS, and adoption stage.
                </p>
                    </div>
            </div>
          </motion.div>
        </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-purple-200 inline-flex">
            <button
              onClick={() => setActiveTab('channel')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'channel'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              <span className="text-xl">📡</span>
              Channel Optimization
            </button>
            <button
              onClick={() => setActiveTab('indication')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'indication'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              <span className="text-xl">🎯</span>
              Indication Prioritization
            </button>
          </div>
        </div>

        {/* Channel Optimization Tab */}
        {activeTab === 'channel' && (
          <div className="space-y-16">
            {/* The Business Question */}
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                  The Right Channel, The Right Investment
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Different channels have different costs and different response rates. We help you find the mix that maximizes revenue for your budget.
                </p>
              </div>

              {/* Channel Comparison Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {channelData.map((channel, index) => (
                  <motion.div
                    key={channel.channel}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className={`bg-gradient-to-r ${channel.color} p-4`}>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{channel.icon}</span>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                          ROI: {channel.roi}x
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 mb-3">{channel.channel}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cost per unit</span>
                          <span className="font-semibold text-gray-800">${channel.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Avg. Response</span>
                          <span className="font-semibold text-gray-800">{channel.avgResponse} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Optimal Freq.</span>
                          <span className="font-semibold text-gray-800">{channel.optimalFreq} per cycle</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Budget Simulator */}
            <AnimatedSection>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Budget-to-Channel Simulator</h3>
                  <p className="text-slate-400">See how your budget gets optimally allocated across channels</p>
                </div>

                {/* Budget Slider */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-lg">Adjust Your Budget</span>
                    <div className="bg-purple-600/30 border border-purple-500/50 rounded-xl px-6 py-3">
                      <span className="text-4xl font-bold text-white">${(budgetAmount / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={500000}
                    step={10000}
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    className="w-full h-3 rounded-full cursor-pointer accent-purple-500"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((budgetAmount - 50000) / (500000 - 50000)) * 100}%, #475569 ${((budgetAmount - 50000) / (500000 - 50000)) * 100}%, #475569 100%)`
                    }}
                  />
                  <div className="flex justify-between mt-3 text-sm text-slate-400">
                    <span>$50K</span>
                    <span>$250K</span>
                    <span>$500K</span>
                  </div>
                </div>

                {/* Optimal Allocation */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">👤</div>
                    <div className="text-white font-semibold text-sm mb-1">F2F Visits</div>
                    <div className="text-blue-400 text-xl font-bold">{optimalMix.f2f.units}</div>
                    <div className="text-slate-400 text-xs">interactions</div>
                    <div className="text-slate-500 text-xs mt-1">${(optimalMix.f2f.budget / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">💻</div>
                    <div className="text-white font-semibold text-sm mb-1">Virtual Calls</div>
                    <div className="text-purple-400 text-xl font-bold">{optimalMix.virtual.units}</div>
                    <div className="text-slate-400 text-xs">interactions</div>
                    <div className="text-slate-500 text-xs mt-1">${(optimalMix.virtual.budget / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">✉️</div>
                    <div className="text-white font-semibold text-sm mb-1">Emails</div>
                    <div className="text-emerald-400 text-xl font-bold">{optimalMix.email.units}</div>
                    <div className="text-slate-400 text-xs">interactions</div>
                    <div className="text-slate-500 text-xs mt-1">${(optimalMix.email.budget / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🎤</div>
                    <div className="text-white font-semibold text-sm mb-1">Speaker Programs</div>
                    <div className="text-orange-400 text-xl font-bold">{optimalMix.speaker.units}</div>
                    <div className="text-slate-400 text-xs">interactions</div>
                    <div className="text-slate-500 text-xs mt-1">${(optimalMix.speaker.budget / 1000).toFixed(1)}K</div>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-6 text-center">
                  <div className="text-emerald-400 text-sm font-medium mb-1">Expected Revenue</div>
                  <div className="text-white text-4xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-emerald-300 text-lg font-semibold mt-2">
                    Overall ROI: {(totalRevenue / budgetAmount).toFixed(1)}x
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Saturation Curves & Optimal Allocation Section */}
            <AnimatedSection>
              <div className="mb-20">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    The Science Behind Optimal Allocation
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
                    Understanding Channel Saturation Curves
                  </h2>
                  <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    Every channel has a saturation point. We identify the "best next move" — the channel interaction that delivers maximum incremental ROI for every dollar invested.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  {/* Saturation Curve Visual Explanation */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">📈</span>
                      Diminishing Returns by Channel
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Each channel shows diminishing returns as frequency increases. The first F2F visit might generate $850 in revenue, but the 5th visit might only add $200. Our algorithm finds where to stop.
                    </p>
                    
                    {/* Simple visual representation */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">1st F2F Visit</span>
                            <span className="font-semibold text-purple-700">$850 revenue</span>
                          </div>
                          <div className="h-2 bg-purple-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">2nd F2F Visit</span>
                            <span className="font-semibold text-purple-700">$620 revenue</span>
                          </div>
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: '73%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">3rd F2F Visit</span>
                            <span className="font-semibold text-purple-700">$400 revenue</span>
                          </div>
                          <div className="h-2 bg-purple-400 rounded-full" style={{ width: '47%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">4th F2F Visit</span>
                            <span className="font-semibold text-purple-700">$200 revenue</span>
                          </div>
                          <div className="h-2 bg-purple-300 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">5th F2F Visit</span>
                            <span className="font-semibold text-amber-600">$50 revenue (not worth $350 cost)</span>
                          </div>
                          <div className="h-2 bg-amber-400 rounded-full" style={{ width: '6%' }}></div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          ⚠️ Saturation point reached after 4th visit — additional investment yields negative ROI
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optimal Allocation Strategy */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">🎯</span>
                      Greedy Allocation Algorithm
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We allocate budget by always making the "best next move" — the single channel interaction across all HCPs that delivers the highest incremental ROI.
                    </p>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-4">Example Decision Tree:</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                          <div>
                            <p className="font-medium text-gray-800">Best Move: Email to Dr. Kim</p>
                            <p className="text-sm text-gray-600">Cost: $15 → Revenue: $180 → ROI: 12.0x</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                          <div>
                            <p className="font-medium text-gray-800">Best Move: Virtual Call to Dr. Rodriguez</p>
                            <p className="text-sm text-gray-600">Cost: $120 → Revenue: $520 → ROI: 4.33x</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                          <div>
                            <p className="font-medium text-gray-800">Best Move: F2F Visit to Dr. Chen</p>
                            <p className="text-sm text-gray-600">Cost: $350 → Revenue: $850 → ROI: 2.43x</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                          <div>
                            <p className="font-medium text-gray-800">Next Best: Email to Dr. Chen</p>
                            <p className="text-sm text-gray-600">Cost: $15 → Revenue: $165 → ROI: 11.0x</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          Process continues until budget is exhausted or all channels reach saturation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insight Callout */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">The Result: Maximum Revenue Per Dollar</h4>
                      <p className="text-purple-100 text-lg">
                        By respecting saturation curves and always choosing the highest-ROI move, we ensure every dollar in your budget generates the maximum possible return — no waste on over-saturated channels, no missed opportunities on under-invested ones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* HCP-Level Recommendations */}
            <AnimatedSection>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">HCP-Level Channel Recommendations</h3>
                <p className="text-gray-600">Each HCP gets a personalized channel mix based on their response patterns</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {hcpChannelRecommendations.map((hcp, index) => (
                  <motion.div
                    key={hcp.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white">{hcp.name}</h4>
                          <p className="text-purple-200 text-sm">{hcp.specialty} • {hcp.tier}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                          {hcp.expectedROI}x ROI
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">OPTIMAL CHANNEL MIX</div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <div className="text-lg">👤</div>
                            <div className="text-lg font-bold text-purple-600">{hcp.channelMix.f2f}</div>
                            <div className="text-xs text-gray-500">F2F</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg">💻</div>
                            <div className="text-lg font-bold text-indigo-600">{hcp.channelMix.virtual}</div>
                            <div className="text-xs text-gray-500">Virtual</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg">✉️</div>
                            <div className="text-lg font-bold text-blue-600">{hcp.channelMix.email}</div>
                            <div className="text-xs text-gray-500">Email</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg">🎤</div>
                            <div className="text-lg font-bold text-violet-600">{hcp.channelMix.speaker}</div>
                            <div className="text-xs text-gray-500">Speaker</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Preferred Channel</span>
                          <span className="font-semibold text-purple-700">{hcp.preferredChannel}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 italic">
                        💡 {hcp.insight}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* How It Works */}
            <AnimatedSection>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How Channel Optimization Works</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: 1, title: 'Calculate ROI per Channel', desc: 'We measure the revenue generated per dollar spent on each channel type.' },
                    { step: 2, title: 'Rank All Options', desc: 'Every HCP-channel combination is ranked by "bang for buck" — revenue per cost.' },
                    { step: 3, title: 'Allocate Greedily', desc: 'Starting with the highest ROI moves, we allocate until budget is exhausted.' },
                    { step: 4, title: 'Respect Saturation', desc: 'We stop adding to a channel when diminishing returns make it unprofitable.' },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                        {item.step}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* Indication Prioritization Tab */}
        {activeTab === 'indication' && (
          <div className="space-y-16">
            {/* The Business Question */}
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                  Know Exactly What to Talk About
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  With multiple indications and limited time, reps need clear guidance. We rank which indications to prioritize for each HCP based on where the biggest opportunity lies.
                </p>
              </div>

              {/* Simple Value Prop Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">👥</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Patient Opportunity</h3>
                  <p className="text-gray-600 text-sm">Which indication has the most eligible patients with this HCP?</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-indigo-200 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📈</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Growth Potential</h3>
                  <p className="text-gray-600 text-sm">Where is this HCP in their adoption journey? Early adopters get priority.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Strategic Focus</h3>
                  <p className="text-gray-600 text-sm">Your brand's priority indications get weighted emphasis.</p>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* HCP Priority Cards - The Main Output */}
            <AnimatedSection>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Rep Gets a Clear Priority List</h3>
                <p className="text-gray-600">Click an HCP to see their personalized indication ranking</p>
              </div>

              {/* HCP Selector */}
              <div className="flex justify-center gap-4 mb-8">
                {hcpIndicationPriorities.map((hcp, index) => (
                  <button
                    key={hcp.name}
                    onClick={() => setSelectedHCP(index)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedHCP === index
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {hcp.name}
                  </button>
                ))}
              </div>

              {/* Selected HCP Priority View - Simplified */}
              <motion.div
                key={selectedHCP}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-xl border border-purple-200 overflow-hidden max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                      👩‍⚕️
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{hcpIndicationPriorities[selectedHCP].name}</h4>
                      <p className="text-purple-200">
                        {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Advocate' && '⭐ Established Advocate'}
                        {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Trial' && '🔬 In Trial Phase'}
                        {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Awareness' && '📚 Building Awareness'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Priority List - Simple and Clear */}
                <div className="p-8">
                  <div className="space-y-4">
                    {hcpIndicationPriorities[selectedHCP].priorities.map((priority, index) => {
                      const indicationInfo = indicationData.find(i => i.id === priority.indication);
                      return (
                        <motion.div
                          key={priority.indication}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                            index === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300' :
                            index === 1 ? 'bg-slate-50 border-slate-200' :
                            index === 2 ? 'bg-orange-50/50 border-orange-200' :
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {/* Rank */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-amber-400 text-white' :
                            index === 1 ? 'bg-slate-400 text-white' :
                            index === 2 ? 'bg-orange-400 text-white' :
                            'bg-gray-300 text-gray-600'
                          }`}>
                            #{priority.rank}
                          </div>

                          {/* Indication */}
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: indicationInfo?.color }}
                          >
                            {priority.indication.slice(0,2)}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-800">{priority.indication}</h5>
                            <p className="text-sm text-gray-500">{priority.reason}</p>
                          </div>

                          {/* Action Label */}
                          <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            index === 0 ? 'bg-amber-100 text-amber-800' :
                            index === 1 ? 'bg-slate-200 text-slate-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {index === 0 ? '🎯 Lead with this' : index === 1 ? 'Follow up' : index === 2 ? 'If time allows' : 'Brief mention'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Simple Rep Guidance */}
                  <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h5 className="font-bold text-purple-800 mb-1">Rep Talking Points</h5>
                        <p className="text-purple-700">
                          Open with <strong>{hcpIndicationPriorities[selectedHCP].priorities[0].indication}</strong> — 
                          {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Advocate' && 
                            " this HCP is already an advocate, so focus on what's new and ask about referral opportunities."}
                          {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Trial' && 
                            " they're currently trialing, so share patient outcomes and address any concerns."}
                          {hcpIndicationPriorities[selectedHCP].adoptionStage === 'Awareness' && 
                            " they're early in their journey, so focus on education and key differentiators."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Saturation Curves & Optimal Allocation Section */}
            <AnimatedSection>
              <div className="mb-20">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    The Science Behind Optimal Prioritization
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
                    Understanding Indication Response Curves
                  </h2>
                  <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    Just like channels, indication messaging has diminishing returns. We identify which indication conversation delivers maximum incremental impact for each HCP interaction.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  {/* Saturation Curve Visual Explanation */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">📈</span>
                      Diminishing Returns by Indication Focus
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Repeated messaging on the same indication shows declining impact. The first DB03 conversation might drive 180 NPS points, but the 4th conversation adds only 40 points. We optimize the sequence.
                    </p>
                    
                    {/* Simple visual representation */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">1st DB03 Conversation</span>
                            <span className="font-semibold text-indigo-700">+180 NPS</span>
                          </div>
                          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">2nd DB03 Conversation</span>
                            <span className="font-semibold text-indigo-700">+120 NPS</span>
                          </div>
                          <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">3rd DB03 Conversation</span>
                            <span className="font-semibold text-indigo-700">+75 NPS</span>
                          </div>
                          <div className="h-2 bg-indigo-400 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">4th DB03 Conversation</span>
                            <span className="font-semibold text-amber-600">+40 NPS (diminishing value)</span>
                          </div>
                          <div className="h-2 bg-amber-400 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Better: 1st OLYMPIA Talk</span>
                            <span className="font-semibold text-emerald-600">+150 NPS (higher impact!)</span>
                          </div>
                          <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '83%' }}></div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          ⚠️ After 3 conversations on DB03, switching to OLYMPIA delivers more incremental value
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optimal Allocation Strategy */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">🎯</span>
                      Optimal Indication Sequencing
                    </h3>
                    <p className="text-gray-600 mb-6">
                      For each HCP, we rank all possible indication conversations by incremental NPS impact. Reps always lead with the highest-value message for that specific HCP.
                    </p>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-4">Example for Dr. Chen:</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">1</div>
                          <div>
                            <p className="font-medium text-gray-800">DB03 (Early Stage)</p>
                            <p className="text-sm text-gray-600">245 eligible patients + High awareness stage</p>
                            <p className="text-xs text-emerald-600 font-semibold mt-1">Expected Impact: +180 NPS</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">2</div>
                          <div>
                            <p className="font-medium text-gray-800">OLYMPIA</p>
                            <p className="text-sm text-gray-600">156 eligible patients + Strong trial history</p>
                            <p className="text-xs text-emerald-600 font-semibold mt-1">Expected Impact: +150 NPS</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">3</div>
                          <div>
                            <p className="font-medium text-gray-800">DB04 (Metastatic)</p>
                            <p className="text-sm text-gray-600">189 eligible patients + Growing base</p>
                            <p className="text-xs text-emerald-600 font-semibold mt-1">Expected Impact: +120 NPS</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold flex-shrink-0 text-sm">4</div>
                          <div>
                            <p className="font-medium text-gray-800">TRUQAP</p>
                            <p className="text-sm text-gray-600">134 eligible patients + New opportunity</p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Expected Impact: +85 NPS</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          Ranking updates dynamically based on previous conversations and HCP adoption stage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insight Callout */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">The Result: Maximum Impact Per Interaction</h4>
                      <p className="text-indigo-100 text-lg">
                        By understanding each HCP's patient mix, adoption stage, and conversation history, we ensure every rep interaction focuses on the indication message with the highest incremental NPS — maximizing adoption velocity across your entire portfolio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* How It Works - Now Enhanced */}
            <AnimatedSection>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">How Indication Optimization Works</h3>
                <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                  We combine patient opportunity, adoption stage, and conversation history to dynamically rank which indication delivers maximum impact for each HCP.
                </p>
                <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {[
                    { icon: '👥', title: 'Analyze Patient Opportunity', desc: 'Calculate eligible patient volume for each indication with each HCP based on their practice patterns.' },
                    { icon: '📈', title: 'Score Growth Potential', desc: 'Factor in adoption stage (Awareness → Trial → Advocate) to weight indications where HCP is ready to move.' },
                    { icon: '🎯', title: 'Apply Strategic Weights', desc: 'Layer in your brand priorities and indication launch timing to align rep conversations with company goals.' },
                    { icon: '🏆', title: 'Rank by Incremental Impact', desc: 'Generate a priority list that maximizes total NPS gain across all HCP interactions — the greedy best move.' },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-2xl flex items-center justify-center mx-auto mb-4">
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}

        {/* Combined Value Section */}
        <AnimatedSection>
          <div className="mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                The Complete Picture for Every Rep
              </h2>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Combine channel optimization with indication prioritization to give reps everything they need for every HCP interaction.
              </p>
            </div>

            {/* Combined Output Example */}
            <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl">
                  👩‍⚕️
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Dr. Sarah Chen</h4>
                  <p className="text-gray-500">Oncologist • Tier 1 • Trial Stage</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600 text-sm">📡</span>
                    Recommended Channel Mix
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-2">
                      <span>👤 F2F Visits</span>
                      <span className="font-bold text-purple-700">4x per cycle</span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-2">
                      <span>💻 Virtual Calls</span>
                      <span className="font-bold text-indigo-700">2x per cycle</span>
                    </div>
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
                      <span>✉️ Emails</span>
                      <span className="font-bold text-blue-700">6x per cycle</span>
                    </div>
                    <div className="flex items-center justify-between bg-violet-50 rounded-lg px-4 py-2">
                      <span>🎤 Speaker Program</span>
                      <span className="font-bold text-violet-700">1x per cycle</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">🎯</span>
                    Indication Priority Order
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-2 border-l-4 border-amber-400">
                      <span className="font-bold text-amber-600">#1</span>
                      <span className="font-medium">DB03</span>
                      <span className="text-gray-500 text-sm ml-auto">Lead with this</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2 border-l-4 border-slate-400">
                      <span className="font-bold text-slate-600">#2</span>
                      <span className="font-medium">OLYMPIA</span>
                      <span className="text-gray-500 text-sm ml-auto">Secondary</span>
                    </div>
                    <div className="flex items-center gap-3 bg-orange-50 rounded-lg px-4 py-2 border-l-4 border-orange-400">
                      <span className="font-bold text-orange-600">#3</span>
                      <span className="font-medium">DB04</span>
                      <span className="text-gray-500 text-sm ml-auto">If time permits</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border-l-4 border-gray-300">
                      <span className="font-bold text-gray-500">#4</span>
                      <span className="font-medium">TRUQAP</span>
                      <span className="text-gray-500 text-sm ml-auto">Mention briefly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

const SpeakerProgramOptimization = () => {
  const attendanceData = [
    { month: 'Jan', baseline: 62, optimized: 62 },
    { month: 'Feb', baseline: 64, optimized: 66 },
    { month: 'Mar', baseline: 61, optimized: 65 },
    { month: 'Apr', baseline: 63, optimized: 68 },
    { month: 'May', baseline: 65, optimized: 71 },
    { month: 'Jun', baseline: 64, optimized: 72 },
  ];

  const hcpRecommendations = [
    { name: 'Dr. Sarah Chen', affinity: 94, attendance: 89, topicMatch: 'High', tier: 'Tier 1', status: 'Prescriber', recommendation: 'High Priority' },
    { name: 'Dr. Michael Rodriguez', affinity: 87, attendance: 82, topicMatch: 'High', tier: 'Tier 1', status: 'Prescriber', recommendation: 'High Priority' },
    { name: 'Dr. Jennifer Kim', affinity: 81, attendance: 78, topicMatch: 'Medium', tier: 'Tier 2', status: 'Prescriber', recommendation: 'Medium Priority' },
    { name: 'Dr. Robert Johnson', affinity: 76, attendance: 73, topicMatch: 'High', tier: 'Tier 2', status: 'Non-Prescriber', recommendation: 'Growth Opportunity' },
    { name: 'Dr. Lisa Thompson', affinity: 72, attendance: 71, topicMatch: 'Medium', tier: 'Tier 3', status: 'Prescriber', recommendation: 'Retention' },
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50 via-purple-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <AnimatedSection>
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-semibold text-pink-700">AI/ML-Driven Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
                Speaker Program Optimization
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              AI/ML-driven HCP recommendations to boost high-tier attendance and prescriber participation in speaker programs
            </p>

            {/* Value Proposition Funnel Visual */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mt-12 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-6">
                {/* Target User */}
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-600 mb-2">Target User</h3>
                  <p className="text-sm text-gray-600">Sales reps, marketing teams, and SFO</p>
                </div>

                <div className="hidden md:block text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Opportunity */}
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-600 mb-2">Opportunity</h3>
                  <p className="text-sm text-gray-600">AI-curated HCP attendee lists based on impact and attendance probability</p>
                </div>

                <div className="hidden md:block text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Solution */}
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-blue-600 mb-2">Our Solution</h3>
                  <p className="text-sm text-gray-600">AI/ML recommender ranking HCPs by topic relevance, speaker affinity, and likelihood to attend</p>
                </div>

                <div className="hidden md:block text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Impact */}
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-purple-600 mb-2">Impact</h3>
                  <p className="text-sm text-gray-600">AI-targeted invitations driving high-impact attendance aligned with brand goals</p>
                </div>

                <div className="hidden md:block text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Value Proposition */}
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-600 mb-2">Value Proposition</h3>
                  <p className="text-sm text-gray-600">Boost high-tier HCP attendance and increase prescriber participation</p>
                </div>
              </div>

              {/* Differentiator */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h3 className="text-lg font-bold text-indigo-600">Differentiator</h3>
                </div>
                <p className="text-gray-600">
                  Our platform combines proven recommendation algorithms with guaranteed baseline performance.
                  GenAI technology creates personalized invitations and identifies emerging trends to maximize program effectiveness.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Key Metrics Section */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Measurable Business Impact
              </h2>
              <p className="text-lg text-purple-200">
                Data-driven results that transform speaker program effectiveness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Impact */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Impact</h3>
                  <p className="text-white text-sm mb-4">Improved Engagement and promotional impact</p>
                </div>
              </div>

              {/* Effectiveness */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Effectiveness</h3>
                  <div className="text-4xl font-extrabold text-white mb-2">
                    <AnimatedCounter end={5} duration={2} suffix="-" />
                    <AnimatedCounter end={7} duration={2} suffix="%" />
                  </div>
                  <p className="text-white text-sm">Increase in target attendance</p>
                </div>
              </div>

              {/* Efficiency */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Efficiency</h3>
                  <div className="text-4xl font-extrabold text-white mb-2">
                    <AnimatedCounter end={8} duration={2} suffix="-" />
                    <AnimatedCounter end={10} duration={2} suffix="%" />
                  </div>
                  <p className="text-white text-sm">Budget & time saving via rep effort optimization</p>
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Compliance</h3>
                  <p className="text-white text-sm mb-4">Actively aligning with regulatory and compliance standards</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* AI/ML Solution Workflow */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              AI/ML Solution & Methodology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform speaker programs with advanced machine learning and intelligent optimization
            </p>
          </div>

          {/* Workflow Diagram */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Input Data */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-200 hover:border-pink-400 transition-all duration-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Input Data</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Historical Promotions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Academic Interest</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">HCP Profile</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">HCP Network</span>
                  </li>
                </ul>
              </div>

              {/* AI/ML Prediction */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-200 hover:border-purple-400 transition-all duration-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">AI-Powered Intelligence</h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 text-sm mb-1">Topic Relevance Analysis</h4>
                    <p className="text-xs text-purple-700">Match HCP interests with program topics</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 text-sm mb-1">Attendance Likelihood</h4>
                    <p className="text-xs text-purple-700">Predict who will attend based on historical patterns</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 text-sm mb-1">Speaker-HCP Connections</h4>
                    <p className="text-xs text-purple-700">Identify existing professional relationships</p>
                  </div>
                </div>
              </div>

              {/* Attendee Optimization */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-indigo-200 hover:border-indigo-400 transition-all duration-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Attendee Optimization</h3>
                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 text-sm mb-1">Compliance Check</h4>
                    <p className="text-xs text-indigo-700">Identify eligible attendees based on compliance criteria</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 text-sm mb-1">Prioritization & Selection</h4>
                    <p className="text-xs text-indigo-700">Prioritize Prescribers and High-Tier HCPs by Program Type</p>
                  </div>
                </div>
              </div>

              {/* Business Outcome */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 border-4 border-green-300 text-white">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Business Outcome</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Higher Prescriber Turnout</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Increased Attendance of High-Value HCPs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lower Event Cancellation Rate</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Improved Brand Awareness</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Streamlined Rep Effort</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* HCP Recommendations Table */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                AI-Powered HCP Recommendations
              </h2>
              <p className="text-lg text-gray-600">
                Intelligent prioritization based on speaker affinity, attendance likelihood, and strategic value
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">HCP Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Speaker Affinity</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Attendance Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Topic Match</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">HCP Tier</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hcpRecommendations.map((hcp, index) => (
                      <tr key={index} className="hover:bg-purple-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                              {hcp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{hcp.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-grow bg-gray-200 rounded-full h-2 mr-2" style={{ width: '60px' }}>
                              <div
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${hcp.affinity}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{hcp.affinity}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-grow bg-gray-200 rounded-full h-2 mr-2" style={{ width: '60px' }}>
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${hcp.attendance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{hcp.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${hcp.topicMatch === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {hcp.topicMatch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${hcp.tier === 'Tier 1' ? 'bg-purple-100 text-purple-800' :
                            hcp.tier === 'Tier 2' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {hcp.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${hcp.status === 'Prescriber' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {hcp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <span className={
                            hcp.recommendation === 'High Priority' ? 'text-red-600' :
                              hcp.recommendation === 'Medium Priority' ? 'text-yellow-600' :
                                hcp.recommendation === 'Growth Opportunity' ? 'text-green-600' :
                                  'text-blue-600'
                          }>
                            {hcp.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GenAI Example - Detailed HCP View */}
            <div className="mt-12 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI-Generated Personalization</h3>
                  <p className="text-gray-600">See how our AI creates tailored outreach for each HCP</p>
                </div>
              </div>

              {/* Example HCP Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-300 overflow-hidden">
                {/* HCP Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold">
                        SC
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold">Dr. Sarah Chen</h4>
                        <p className="text-purple-100">Cardiologist • Tier 1 Prescriber</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-sm">94% Speaker Affinity</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">89% Attendance Likelihood</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      High Priority
                    </span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-6 space-y-6">
                  {/* Why This HCP Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">Why This is a Key Opportunity</h5>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                      <p className="text-gray-700 leading-relaxed">
                        Dr. Chen is a highly influential cardiologist with 45 eligible patients and strong academic credentials in heart failure management.
                        She has attended 8 of the last 10 speaker programs and has an existing professional relationship with our featured speaker, Dr. Michael Torres,
                        from their collaborative research at Johns Hopkins. Her recent publication on novel treatment approaches aligns perfectly with our program's
                        focus on advanced therapeutic strategies. With a current penetration rate of only 12%, there's significant growth potential.
                      </p>
                    </div>
                  </div>

                  {/* Personalized Message Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">AI-Generated Personalized Message</h5>
                    </div>
                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 shadow-inner">
                      <div className="space-y-4">
                        <p className="text-gray-800">
                          <span className="font-semibold text-indigo-600">Subject:</span> Invitation: Advanced Heart Failure Strategies with Dr. Michael Torres
                        </p>
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-700 mb-3">Dear Dr. Chen,</p>
                          <p className="text-gray-700 mb-3">
                            Given your groundbreaking work on <span className="bg-yellow-100 px-1">novel heart failure interventions</span> and your
                            collaboration with Dr. Torres at Johns Hopkins, I wanted to personally invite you to an exclusive speaker program.
                          </p>
                          <p className="text-gray-700 mb-3">
                            Dr. Torres will be presenting on <span className="bg-yellow-100 px-1">"Advancing Therapeutic Outcomes in Complex Heart Failure Cases"</span> —
                            a topic that directly aligns with your recent publication in the Journal of Cardiology. This session will explore innovative
                            treatment protocols that could benefit your patient population.
                          </p>
                          <p className="text-gray-700 mb-3">
                            The program will take place on <strong>March 15th at 7:00 PM</strong> at the Downtown Medical Center. We'll have an intimate
                            Q&A session where you can reconnect with Dr. Torres and discuss the latest clinical evidence.
                          </p>
                          <p className="text-gray-700 mb-3">
                            I believe this will be a valuable opportunity for you and would be delighted to have your expertise as part of the discussion.
                          </p>
                          <p className="text-gray-700">
                            Looking forward to your participation.<br />
                            Best regards,<br />
                            <span className="font-semibold">Jennifer Martinez</span><br />
                            Territory Manager
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Personalization Factors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Academic Research</p>
                          <p className="text-xs text-gray-600">Referenced her recent publication</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                      <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Speaker Connection</p>
                          <p className="text-xs text-gray-600">Highlighted past collaboration with speaker</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Engagement History</p>
                          <p className="text-xs text-gray-600">Noted high past attendance rate</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Patient Relevance</p>
                          <p className="text-xs text-gray-600">Connected topic to her patient population</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Attendance Impact Chart */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Speaker Program Attendance: Baseline vs. AI-Optimized
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Attendance Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  name="Baseline Attendance"
                  dot={{ fill: '#94a3b8', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="optimized"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="AI-Optimized Attendance"
                  dot={{ fill: '#8b5cf6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Average Baseline</p>
                <p className="text-3xl font-extrabold text-gray-700">63%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Average AI-Optimized</p>
                <p className="text-3xl font-extrabold text-purple-600">68.5%</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Improvement</p>
                <p className="text-3xl font-extrabold text-green-600">+5.5%</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Key Features */}
      <div className="bg-gradient-to-b from-white to-purple-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Platform Capabilities
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive tools to maximize speaker program ROI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Smart Topic Matching',
                  description: 'Automatically match HCP research interests and clinical focus areas with relevant program topics',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  color: 'from-pink-500 to-rose-500'
                },
                {
                  title: 'Attendance Prediction',
                  description: 'Predict which HCPs are most likely to attend based on historical engagement patterns and preferences',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  title: 'Relationship Insights',
                  description: 'Identify and leverage existing professional connections between speakers and HCPs',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ),
                  color: 'from-indigo-500 to-blue-500'
                },
                {
                  title: 'Compliance Integration',
                  description: 'Automated compliance checks ensure all recommendations meet regulatory and company standards',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Prescriber Prioritization',
                  description: 'Focus on high-value HCPs and active prescribers most aligned with your program goals',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ),
                  color: 'from-cyan-500 to-teal-500'
                },
                {
                  title: 'AI-Generated Messages',
                  description: 'Create personalized invitation messages tailored to each HCP\'s unique profile and interests',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: 'from-teal-500 to-green-500'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const AutoML = () => {
  const [showImpactAnimation, setShowImpactAnimation] = React.useState(false);

  const capabilities = [
    {
      id: 1,
      title: "Automated Data Ingestion",
      description: "Seamlessly connect and unify disparate data sources, from massive claims datasets to internal CRM activity, without complex manual scripting.",
      icon: (
        <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16M8 11h8M8 15h8" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Domain-Tuned Feature Engineering",
      description: "The platform automatically generates hundreds of relevant features and custom aggregations specifically tuned for the life sciences domain—from patient journey waypoints to HCP engagement patterns.",
      icon: (
        <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Robust Model Training & Tracking",
      description: "Leverage a powerful engine for automated feature selection, model selection, and hyperparameter tuning. Track every experiment and version with ease to ensure reproducibility and governance.",
      icon: (
        <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Effortless Deployment",
      description: "Our modular, package-like structure allows you to deploy trained models quickly and efficiently, moving from successful experiment to production-ready asset without refactoring code.",
      icon: (
        <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    }
  ];

  const modelTypes = [
    {
      title: "Predictive Models",
      examples: [
        "Forecast HCP brand adoption",
        "Identify patients eligible for a specific therapy",
        "Predict physician risk or prescribing potential"
      ],
      note: "Leverages claims data combined with proprietary CRM and HCP data",
      color: "purple"
    },
    {
      title: "Segmentation Models",
      examples: [
        "Create sophisticated HCP segments based on prescribing behavior",
        "Develop nuanced patient population segments for targeted engagement"
      ],
      note: "Uncover hidden patterns in massive patient-level datasets",
      color: "indigo"
    },
    {
      title: "Data Enrichment Models",
      examples: [
        "Infer missing biomarker status",
        "Predict patient lines of therapy",
        "Fill critical gaps in your data to power more accurate downstream analytics"
      ],
      note: "Turn incomplete data into a strategic asset",
      color: "blue"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h1
                  className="text-5xl font-extrabold text-gray-dark leading-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Build Custom Commercial Models <span className="text-purple-600">70% Faster</span>
                </motion.h1>
                <motion.p
                  className="mt-6 text-xl text-gray-medium leading-relaxed"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Introducing <span className="font-bold text-purple-600">AutoML</span>, the end-to-end platform that automates the entire model-building lifecycle. Purpose-built for pharma and life sciences, our engine automates data ingestion and domain-specific feature engineering, empowering your analytics teams to deliver insights at the speed of business.
                </motion.p>
              </div>

              {/* AutoML Pipeline Visual */}
              <div className="flex justify-center">
                <motion.div
                  className="relative w-[500px] h-96 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-200 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  {/* Input Data Blocks (Left Side) */}
                  <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                    <div className="text-xs font-semibold text-gray-600 mb-4 text-center">Raw Data Sources</div>
                    {[
                      { label: 'Claims', color: 'bg-gray-400', delay: 0 },
                      { label: 'CRM', color: 'bg-gray-500', delay: 0.3 },
                      { label: 'EHR', color: 'bg-gray-400', delay: 0.6 },
                      { label: 'HCP', color: 'bg-gray-500', delay: 0.9 }
                    ].map((block, i) => (
                      <motion.div
                        key={i}
                        className={`${block.color} text-white text-xs font-bold rounded-lg p-3 mb-2 w-16 text-center shadow-md`}
                        animate={{
                          x: [0, 160, 160, 160, 0],
                          opacity: [1, 1, 0.3, 0, 1],
                        }}
                        transition={{
                          duration: 4,
                          delay: block.delay,
                          repeat: Infinity,
                          repeatType: 'loop',
                          ease: 'easeInOut'
                        }}
                      >
                        {block.label}
                      </motion.div>
                    ))}
                  </div>

                  {/* AutoML Brain Engine (Center) */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 360],
                        boxShadow: [
                          '0 0 0 0 rgba(124, 58, 237, 0)',
                          '0 0 0 15px rgba(124, 58, 237, 0.2)',
                          '0 0 0 0 rgba(124, 58, 237, 0)'
                        ]
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity, repeatType: 'loop' },
                        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                        boxShadow: { duration: 2, repeat: Infinity, repeatType: 'loop' }
                      }}
                    >
                      {/* Brain/AI Icon */}
                      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>

                      {/* Pulsing rings around the brain */}
                      <motion.div
                        className="absolute inset-0 border-2 border-purple-300 rounded-full"
                        animate={{
                          scale: [1, 1.5, 2],
                          opacity: [0.8, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 border-2 border-indigo-300 rounded-full"
                        animate={{
                          scale: [1, 1.5, 2],
                          opacity: [0.8, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: 0.5,
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                      />
                    </motion.div>

                    {/* AutoML Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 whitespace-nowrap">
                      AutoML Engine
                    </div>
                  </div>

                  {/* Output Models (Right Side) */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <div className="text-xs font-semibold text-purple-600 mb-4 text-center">ML Models</div>
                    {[
                      { label: 'Predictive', color: 'from-purple-500 to-purple-600', delay: 2 },
                      { label: 'Segment', color: 'from-indigo-500 to-indigo-600', delay: 2.3 },
                      { label: 'Enrichment', color: 'from-blue-500 to-blue-600', delay: 2.6 }
                    ].map((model, i) => (
                      <motion.div
                        key={i}
                        className={`bg-gradient-to-r ${model.color} text-white text-xs font-bold rounded-lg p-3 mb-2 w-20 text-center shadow-lg`}
                        initial={{ opacity: 0, scale: 0, x: -50 }}
                        animate={{
                          opacity: [0, 1, 1],
                          scale: [0, 1.1, 1],
                          x: [-50, 0, 0]
                        }}
                        transition={{
                          duration: 0.8,
                          delay: model.delay,
                          repeat: Infinity,
                          repeatDelay: 1.2,
                          ease: 'easeOut'
                        }}
                      >
                        {model.label}
                      </motion.div>
                    ))}
                  </div>

                  {/* Data Flow Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Left to center flow */}
                    <motion.path
                      d="M 120 192 Q 180 192 220 192"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                      }}
                    />

                    {/* Center to right flow */}
                    <motion.path
                      d="M 280 192 Q 340 192 380 192"
                      stroke="url(#gradient2)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{
                        duration: 2,
                        delay: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                      }}
                    />

                    {/* Gradients for the flow lines */}
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9CA3AF" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="absolute top-8 right-12 w-1 h-1 bg-indigo-400 rounded-full"></div>
                    <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-indigo-400 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
                Your business needs answers. <span className="text-purple-600">Your data scientists are stuck in the pipeline.</span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  In the competitive pharma landscape, speed and precision are everything. Your commercial teams need to predict HCP adoption, segment patient populations, and identify at-risk providers. But building the custom models to deliver these insights is a slow, manual, and repetitive marathon of data wrangling and coding.
                </p>
                <p>
                  The process is bogged down by disconnected data sources (Claims, CRM, EHR), redundant feature engineering logic for every new project, and generic tools that don't understand the nuances of pharma data. This analytics bottleneck means valuable time is spent on data prep instead of strategic analysis, delaying critical decisions.
                </p>
              </div>

              {/* Problem Icons */}
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: (
                      <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    ),
                    title: "Disconnected Data",
                    description: "Multiple data sources that don't talk to each other"
                  },
                  {
                    icon: (
                      <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ),
                    title: "Redundant Work",
                    description: "Repeating the same data prep for every project"
                  },
                  {
                    icon: (
                      <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Slow Progress",
                    description: "Months to build what should take days"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-gray-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 text-center">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
                Stop building from scratch. Start accelerating with <span className="text-purple-600">intelligent automation.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                AutoML is our platform designed specifically to break the analytics bottleneck for pharma commercial teams. We've streamlined the entire process, from raw data to deployed model, by automating the most time-consuming and complex steps.
              </p>

              {/* Key Differentiator Callout */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border-l-4 border-purple-500">
                <p className="text-lg font-semibold text-gray-dark">
                  Natively integrating with essential data sources like <span className="text-purple-600 font-bold">IQVIA claims</span> and your own <span className="text-purple-600 font-bold">proprietary data (CRM activity, HCP segments)</span>, AutoML provides the foundational speed and intelligence your team needs to operate at scale.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      {/* Impact Section - Traditional vs AutoML Comparison */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Traditional vs <span className="text-purple-600">AutoML</span>: The Dramatic Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                See how AutoML transforms the entire machine learning lifecycle, reducing development time from weeks to days while delivering superior results
              </p>
            </div>

            {/* Key Metric Card */}
            <div className="flex justify-center mb-12">
              <motion.div
                className="max-w-lg bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200 shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                onViewportEnter={() => setShowImpactAnimation(true)}
              >
                <motion.div
                  className="text-5xl font-extrabold text-purple-600 mb-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <AnimatedCounter end="3" duration={2} suffix="x" />
                </motion.div>
                <p className="text-lg font-bold text-gray-dark text-center mb-2">Reduction in Development Time</p>
                <p className="text-sm text-gray-600 text-center">From 15-20 weeks to potentially 5-7 weeks</p>
              </motion.div>
            </div>

            {/* High-Fidelity Infographic */}
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-lg mb-16">
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-dark mb-2">Traditional vs. AutoML</h2>
                <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full"></div>
              </div>

              {/* Top Section: Typical Process */}
              <div className="mb-16">
                <div className="text-left mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">Typical Process</h3>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center">
                    {[
                      { step: "Data Prep" },
                      { step: "Hypothesis Generation" },
                      { step: "Hand-crafted feature Engg." },
                      { step: "Iterative Modelling" },
                      { step: "Inference" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-blue-500 text-white px-4 py-3 rounded-md shadow-md text-center flex-1 mx-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <span className="text-sm font-medium">{item.step}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottleneck Loop */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[40%] mt-2">
                    <div className="relative h-8 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center bg-blue-50/30">
                      <span className="text-xs text-blue-600 font-medium">Iterative Loop</span>
                      <div className="absolute -top-[9px] left-1/4 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-blue-300"></div>
                      <div className="absolute -top-[9px] right-1/4 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-blue-300"></div>
                    </div>
                  </div>
                </div>

                {/* Segmented Timeline */}
                <div className="relative mt-14">
                  <div className="bg-blue-800 h-6 rounded-md flex">
                    <div className="w-[20%] bg-blue-500 rounded-l-md"></div>
                    <div className="w-[60%] bg-blue-600"></div>
                    <div className="w-[20%] bg-blue-500 rounded-r-md"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600 px-1">
                    <span>2-3 Weeks</span>
                    <span className="flex-grow text-center">12-16 Weeks</span>
                    <span>1 Week</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Using AutoML */}
              <div>
                <div className="text-left mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">Using AutoML</h3>
                </div>

                {/* Streamlined Data Pipeline */}
                <div className="relative mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-16 rounded-lg shadow-lg flex items-center justify-between px-6">
                    <div className="text-center text-white">
                      <div className="text-sm font-medium">Data Pre Processing</div>
                      <div className="text-xs opacity-80">Cohort Creation + Defining Labels</div>
                    </div>
                    <div className="text-center text-white flex-1 mx-4">
                      <div className="text-sm font-medium">AutoML Platform</div>
                      <div className="text-xs opacity-80">Large Scale Feature Discovery + Predictive Modelling + Deployment for inference</div>
                    </div>
                    <div className="text-center text-white">
                      <div className="text-sm font-medium">Automated deployment for inference</div>
                    </div>
                  </div>
                </div>

                {/* Benefit Callout */}
                <div className="relative h-10">
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-lg border border-purple-200">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                      <span className="text-md font-bold text-purple-700">Up to 3X reduction in Weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Key Capabilities */}
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-dark mb-4">
                Key Capabilities of <span className="text-purple-600">AutoML</span>
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The engine that powers faster, smarter models with end-to-end automation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: "Automated Data Ingestion",
                  description: "Seamlessly connect and unify disparate data sources, from massive claims datasets to internal CRM activity, without complex manual scripting.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16M8 11h8M8 15h8" />
                    </svg>
                  ),
                  color: "bg-purple-600",
                  lightColor: "bg-purple-50",
                  borderColor: "border-purple-100"
                },
                {
                  id: 2,
                  title: "Domain-Tuned Feature Engineering",
                  description: "Automatically generate hundreds of life-sciences-specific features and aggregations—from patient journey waypoints to HCP engagement patterns.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  color: "bg-indigo-600",
                  lightColor: "bg-indigo-50",
                  borderColor: "border-indigo-100"
                },
                {
                  id: 3,
                  title: "Feature Selection & Model Training",
                  description: "Automated feature selection, model selection, and hyperparameter tuning with full experiment tracking for reproducibility and governance.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                  color: "bg-blue-600",
                  lightColor: "bg-blue-50",
                  borderColor: "border-blue-100"
                },
                {
                  id: 4,
                  title: "ML Tasks & Capabilities",
                  description: "Comprehensive suite covering predictive analytics, segmentation, and enrichment models—tailored for pharmaceutical commercial use cases.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  ),
                  color: "bg-violet-600",
                  lightColor: "bg-violet-50",
                  borderColor: "border-violet-100"
                },
                {
                  id: 5,
                  title: "Explainable AI",
                  description: "Transparent insights that surface best-fit drivers of outcomes, enabling clinical interpretability and trustworthy decisions.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  color: "bg-pink-600",
                  lightColor: "bg-pink-50",
                  borderColor: "border-pink-100"
                },
                {
                  id: 6,
                  title: "Effortless Deployment",
                  description: "Modular packaging to deploy trained models quickly at scale—moving from successful experiments to production-ready assets without refactoring.",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: "bg-emerald-600",
                  lightColor: "bg-emerald-50",
                  borderColor: "border-emerald-100"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`relative bg-white rounded-2xl p-8 border ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <span className={`text-4xl font-black opacity-10 ${item.color.replace('bg-', 'text-')}`}>
                      0{item.id}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className={`absolute bottom-0 left-0 w-full h-1 ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl origin-left`}></div>
                </motion.div>
              ))}
            </div>

            {/* Proven Impact & Scale */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">
                  Proven <span className="text-purple-600">Impact & Scale</span>
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Real-world results across the pharmaceutical landscape—from cost savings to massive data processing at scale
                </p>
              </div>

              {/* Two-Column Stats Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Column 1: Performance & Business Value */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-dark mb-6">Performance & Business Value</h4>

                  {[
                    {
                      metric: "50%",
                      label: "Faster",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    },
                    {
                      metric: "40%",
                      label: "Cheaper in production",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    },
                    {
                      metric: "15B",
                      label: "Claims record in one run",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    },
                    {
                      metric: "5+",
                      label: "Non-oncology markets",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    },
                    {
                      metric: "$570k",
                      label: "In annual cost savings",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    },
                    {
                      metric: "3X",
                      label: "Reduction in dev time",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mr-4 flex-shrink-0 text-white">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-700">{stat.metric}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Column 2: Scale & Data Mastery */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-dark mb-6">Scale & Data Mastery</h4>

                  {[
                    {
                      metric: "336B",
                      label: "Patient records",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    },
                    {
                      metric: "242TB",
                      label: "Data",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    },
                    {
                      metric: "50M",
                      label: "Proven patient scale",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    },
                    {
                      metric: "80+",
                      label: "Models built / productionised",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    },
                    {
                      metric: "4+",
                      label: "Data science use cases in Oncology",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    },
                    {
                      metric: "1.2B",
                      label: "Patient data points in Pharma",
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg mr-4 flex-shrink-0 text-white">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-700">{stat.metric}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* The AutoML Advantage */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">
                  The <span className="text-purple-600">AutoML Advantage</span>
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Experience the transformative impact of automated machine learning across your entire analytics workflow
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Accelerate Timelines",
                    description: "Deliver the first cut of any model—predictive, segmentation, or enrichment—up to 3x faster, allowing your team to iterate and refine in days, not months."
                  },
                  {
                    title: "Eliminate Redundant Work",
                    description: "Free your data scientists from repetitive data prep and feature engineering. Let them focus on high-value strategic analysis while AutoML handles the heavy lifting."
                  },
                  {
                    title: "Increase Model Power & Consistency",
                    description: "Leverage a standardized, best-practice approach to feature engineering and training that is tuned specifically for pharma data, resulting in more robust and reliable models."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-xl font-bold text-gray-dark mb-4">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Precision Targeting Models Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark mb-4">
                Precision Targeting: <span className="text-purple-600">Fast-tracked using AutoML</span>
              </h2>
              <p className="text-xl text-gray-medium max-w-4xl mx-auto">
                From data enrichment to territory-level outreach, AutoML powers the complete spectrum of predictive models that drive commercial success across the pharmaceutical landscape.
              </p>
            </div>


            {/* Sophisticated Model Categories */}
            <div className="space-y-12">
              {/* Data Enrichment Models */}
              <motion.div
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-3xl p-8 border border-purple-100 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-dark mb-2">Data Enrichment Models</h3>
                      <p className="text-lg text-gray-600">Transform incomplete datasets into comprehensive intelligence</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group p-6 bg-white rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-dark mb-2">Missing Event Prediction</h4>
                          <p className="text-gray-600 leading-relaxed">Identify crucial missing events in claims datasets to ensure data completeness and accuracy across patient journeys.</p>
                        </div>
                      </div>
                    </div>

                    <div className="group p-6 bg-white rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-dark mb-2">Biomarker & Lab Test Imputation</h4>
                          <p className="text-gray-600 leading-relaxed">Supplement patient journey with vital biomarker information through intelligent data source matching and imputation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Patient-Level Models */}
              <motion.div
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-3xl p-8 border border-indigo-100 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-dark mb-2">Patient-Level Models</h3>
                      <p className="text-lg text-gray-600">Predictive intelligence for individual patient outcomes and behaviors</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Early Drug Eligibility Predictor",
                        description: "Forecast patient eligibility for specific treatments 30-90 days in advance",
                        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      },
                      {
                        title: "Rare Disease Prediction",
                        description: "Detect rare diseases at earlier stages for improved patient outcomes",
                        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      },
                      {
                        title: "Patient Retention Forecaster",
                        description: "Predict therapy duration and identify at-risk patients for proactive intervention",
                        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      },
                      {
                        title: "Competitor Switch Prediction",
                        description: "Assess likelihood of patients transitioning to alternative treatments",
                        icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      },
                      {
                        title: "Early Event Prediction",
                        description: "Predict disease progression and critical events for timely intervention",
                        icon: "M13 10V3L4 14h7v7l9-11h-7z"
                      }
                    ].map((model, index) => (
                      <div key={index} className="group p-6 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={model.icon} />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-dark mb-2">{model.title}</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">{model.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* HCP Level Models */}
              <motion.div
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-3xl p-8 border border-blue-100 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-dark mb-2">HCP Level Models</h3>
                      <p className="text-lg text-gray-600">Strategic insights for healthcare professional engagement and optimization</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Risk Predictor Models",
                        description: "Forecast HCP likelihood of drifting towards competitive brands and identify intervention opportunities",
                        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      },
                      {
                        title: "HCP Market Potential Estimation",
                        description: "Estimate market potential for new patient treatments and analyze prescription trend patterns",
                        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      },
                      {
                        title: "Early Adopter Identifier",
                        description: "Identify healthcare professionals most likely to adopt new treatments and technologies early",
                        icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      }
                    ].map((model, index) => (
                      <div key={index} className="group p-6 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={model.icon} />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-dark mb-2">{model.title}</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">{model.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Therapeutic Areas Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">
                  Successfully Deployed Across <span className="text-purple-600">Diverse Therapeutic Areas</span>
                </h3>
                <p className="text-lg text-gray-600">Proven capabilities across multiple complex disease states and treatment modalities</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {['Oncology', 'Biologics', 'Asthma', 'CLL', 'Breast Cancer', 'Lung Cancer', 'Rare Diseases', 'Cardiovascular', 'Renal & Metabolic'].map((area, index) => (
                  <motion.span
                    key={index}
                    className="px-6 py-3 bg-white rounded-full text-sm font-medium text-purple-600 border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center text-white max-w-4xl mx-auto">
              <h2 className="text-4xl font-extrabold mb-8">
                Ready to Revolutionize Your Analytics Workflow?
              </h2>
              <p className="text-xl mb-12 opacity-90 leading-relaxed">
                Stop wrestling with data pipelines and start deploying powerful insights. See how AutoML can transform your commercial analytics and give your team an unbeatable competitive edge.
              </p>
              <motion.button
                className="bg-white text-purple-600 px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Your AutoML Demo
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const DataEnrichment = () => {

  const marketData = [
    { name: 'PIK3CA', literature: 40, rawClaims: 4, enriched: 35 },
    { name: 'BRCA', literature: 15, rawClaims: 1, enriched: 7 },
    { name: 'HER2-Low', literature: 55, rawClaims: 0, enriched: 50 },
    { name: 'HR+', literature: 75, rawClaims: 65, enriched: 90 }
  ];

  const [activeTab, setActiveTab] = React.useState('Breast');
  const portfolios = ['Breast', 'Lung', 'Brain', 'Liver T2D', 'HTN'];

  const DataVisualization = ({ data }) => (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
      <h4 className="text-2xl font-bold text-gray-dark mb-8 text-center">
        AI Enrichment Impact: From Invisible to Actionable
      </h4>

      {/* Portfolio Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio}
              onClick={() => setActiveTab(portfolio)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === portfolio
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {portfolio}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Breast' ? (
        <div className="grid md:grid-cols-2 gap-8">
          {data.map((item, index) => (
            <div key={item.name} className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-purple-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-bold text-gray-dark">{item.name} Biomarker</h5>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {item.literature}% Literature Rate
                </span>
              </div>

              {/* Metrics Cards */}
              <div className="space-y-4">
                {/* Raw Claims Data */}
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Raw Claims Visibility</p>
                      <p className="text-2xl font-bold text-red-600">{item.rawClaims}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Market Gap</p>
                      <p className="text-lg font-bold text-red-500">
                        {item.literature - item.rawClaims}% Hidden
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Enriched Data */}
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">AI Enriched Visibility</p>
                      <p className="text-2xl font-bold text-purple-600">{item.enriched}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Improvement</p>
                      <p className="text-lg font-bold text-green-600">
                        +{item.enriched - item.rawClaims}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact Multiplier */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white">
                  <div className="text-center">
                    <p className="text-sm opacity-90">Visibility Multiplier</p>
                    <p className="text-3xl font-extrabold">
                      {item.rawClaims === 0 ? '∞' : `${Math.round(item.enriched / item.rawClaims)}x`}
                    </p>
                    <p className="text-xs opacity-80">
                      {item.rawClaims === 0 ? 'Built from scratch' : 'Times improvement'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar Visualization */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Market Coverage</span>
                  <span>{Math.round((item.enriched / item.literature) * 100)}% of Literature Benchmark</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="relative h-3 rounded-full overflow-hidden">
                    {/* Literature benchmark background */}
                    <div className="absolute inset-0 bg-gray-200"></div>

                    {/* Raw claims - tiny red portion */}
                    <div
                      className="absolute left-0 top-0 h-full bg-red-400 transition-all duration-500"
                      style={{ width: `${(item.rawClaims / item.literature) * 100}%` }}
                    ></div>

                    {/* AI enriched - purple portion */}
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700 delay-300"
                      style={{ width: `${(item.enriched / item.literature) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-gray-600">Raw Claims ({item.rawClaims}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">AI Enriched ({item.enriched}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">Remaining Gap</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              {activeTab} Portfolio Data
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Visualization module under development
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h5 className="text-lg font-bold text-gray-dark mb-4 text-center">Overall Market Transformation</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">18%</p>
            <p className="text-sm text-gray-600">Avg. Raw Visibility</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">46%</p>
            <p className="text-sm text-gray-600">Avg. Enriched Visibility</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">+28%</p>
            <p className="text-sm text-gray-600">Avg. Improvement</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">15x</p>
            <p className="text-sm text-gray-600">Avg. Multiplier</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                className="text-5xl font-extrabold text-gray-dark leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                From <span className="text-purple-600">Data Black Hole</span> to Commercial Clarity
              </motion.h1>
              <motion.p
                className="mt-6 text-xl text-gray-medium leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Standard claims data makes over <span className="font-bold text-purple-600">90% of your target patient populations invisible</span>. Our AI-powered Enrichment solution illuminates the entire market, transforming your commercial strategy from guesswork to precision.
              </motion.p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Discover Your Hidden Market Potential
                </button>
              </motion.div>
            </div>

            {/* Abstract Animation Visual */}
            <div className="flex justify-center">
              <motion.div
                className="relative w-96 h-96 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl border border-purple-200 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {/* Animated dots representing data transformation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gray-400 rounded-full"
                      style={{
                        left: `${20 + (i % 5) * 15}%`,
                        top: `${20 + Math.floor(i / 5) * 15}%`,
                      }}
                      animate={{
                        backgroundColor: ['#9CA3AF', '#7C3AED', '#9CA3AF'],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    />
                  ))}

                  {/* Scanning line */}
                  <motion.div
                    className="absolute w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"
                    animate={{ x: [-200, 400] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* The Data Chasm Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-dark">
              The Clinical Data Chasm: <span className="text-purple-600">Better Targeting</span>
            </h2>
            <p className="mt-6 text-xl text-gray-medium max-w-5xl mx-auto leading-relaxed">
              Claims data suffers with capture rate for key events like <span className="font-semibold text-gray-dark">Treatments, Mutations, Diagnosis, Lab Results</span> and other key events despite having good patient coverage.
            </p>
            <p className="mt-4 text-xl text-gray-medium max-w-5xl mx-auto leading-relaxed">
              The EHR data like <span className="font-semibold text-gray-dark">Tempus, Flatiron</span> has the coverage problem.
            </p>
            <div className="mt-8 inline-block bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-2xl px-8 py-4">
              <p className="text-2xl font-bold text-purple-700">
                We bridge the gap of patient coverage and event capture rate to help with your targeting
              </p>
              <p className="mt-3 text-lg text-gray-700">
                We specialise in <span className="font-semibold">complex oncology</span> and <span className="font-semibold">biopharmaceutical portfolios</span>
              </p>
            </div>
          </div>

          {/* Container to control visual order - comparison cards first, then matrix */}
          <div className="flex flex-col-reverse">
            {/* This will appear SECOND visually - The Critical Gap Matrix */}
            <div className="mb-20">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-extrabold text-gray-dark mb-4">
                  Bridging the Gap: <span className="text-purple-600">The Best of Both Worlds</span>
                </h3>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  We combine the <span className="font-semibold text-blue-600">broad patient coverage of Claims</span> with the <span className="font-semibold text-orange-600">rich clinical detail of EHR</span> to deliver <span className="font-bold text-green-600">Complete Intelligence</span>
                </p>
              </div>

              {/* Simple Formula Presentation */}
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-3xl px-12 py-8 shadow-2xl border-2 border-purple-200">
                  <p className="text-2xl font-bold text-gray-800 text-center">
                    <span className="text-blue-600">Claims (Broad Reach)</span>
                    <span className="text-purple-600 mx-3">+</span>
                    <span className="text-orange-600">EHR (Rich Detail)</span>
                    <span className="text-purple-600 mx-3">=</span>
                    <span className="text-green-600">Enriched Data (Complete Intelligence)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* This will appear FIRST visually - Two Incomplete Pictures */}
            <div className="mb-20">
              <h3 className="text-3xl font-bold text-gray-dark text-center mb-12">
                Two Incomplete Pictures
              </h3>
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Claims Data - Good Coverage, Poor Event Capture */}
                <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-purple-200">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-purple-100 rounded-2xl p-4">
                      <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-purple-900 mb-3 text-center">Claims Data</h4>
                  <p className="text-center text-gray-600 mb-10 leading-relaxed text-sm">
                    Good patient coverage, but critical events like <span className="font-semibold">Mutations</span> and <span className="font-semibold">Lab Results</span> have almost zero capture
                  </p>

                  {/* Visual comparison meters */}
                  <div className="space-y-8">
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Patient Coverage</span>
                        <span className="text-2xl font-black text-purple-600">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-2xl h-8 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-end pr-4"
                          initial={{ width: 0 }}
                          animate={{ width: '95%' }}
                          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        >
                          <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white font-bold text-sm">Excellent</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl px-8 py-3">
                        <div className="text-center flex items-center space-x-2">
                          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          <span className="text-amber-700 font-black text-lg tracking-wider">THE GAP</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Event Capture Rate</span>
                        <span className="text-2xl font-black text-amber-600">27%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-2xl h-8 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end pr-4"
                          initial={{ width: 0 }}
                          animate={{ width: '27%' }}
                          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                        >
                          <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white font-bold text-xs">Poor</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Event breakdown */}
                  <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wide">Event Capture Breakdown:</p>
                    {[
                      { 
                        name: 'Mutations', 
                        captured: 2, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      },
                      { 
                        name: 'Treatments', 
                        captured: 45, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.586V5L7 4z" /></svg>
                      },
                      { 
                        name: 'Lab Results', 
                        captured: 0, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      },
                      { 
                        name: 'Diagnosis', 
                        captured: 55, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      },
                      { 
                        name: 'Other Events', 
                        captured: 35, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      }
                    ].map((event, idx) => (
                      <motion.div
                        key={idx}
                        className="mb-4 last:mb-0 bg-white rounded-xl p-4 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <span className="mr-3 text-purple-600">{event.icon}</span>
                            {event.name}
                          </span>
                          <span className="text-sm font-bold text-amber-600">{event.captured}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${event.captured}%` }}
                            transition={{ duration: 0.8, delay: 0.9 + idx * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* EHR Data - Rich Detail, Limited Coverage */}
                <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-indigo-200">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-indigo-100 rounded-2xl p-4">
                      <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.586V5L7 4z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-indigo-900 mb-3 text-center">EHR Data</h4>
                  <p className="text-center text-gray-600 mb-3 leading-relaxed text-sm">
                    <span className="font-semibold">Tempus, Flatiron</span>
                  </p>
                  <p className="text-center text-gray-600 mb-10 leading-relaxed text-sm">
                    Rich clinical detail but limited patient coverage
                  </p>

                  {/* Visual comparison meters */}
                  <div className="space-y-8">
                    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Patient Coverage</span>
                        <span className="text-2xl font-black text-amber-600">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-2xl h-8 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end pr-4"
                          initial={{ width: 0 }}
                          animate={{ width: '10%' }}
                          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        >
                          <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white font-bold text-xs">Limited</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl px-8 py-3">
                        <div className="text-center flex items-center space-x-2">
                          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          <span className="text-amber-700 font-black text-lg tracking-wider">THE GAP</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Event Capture Rate</span>
                        <span className="text-2xl font-black text-indigo-600">90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-2xl h-8 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-end pr-4"
                          initial={{ width: 0 }}
                          animate={{ width: '90%' }}
                          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                        >
                          <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white font-bold text-sm">Excellent</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Event breakdown */}
                  <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wide">Event Capture Breakdown:</p>
                    {[
                      { 
                        name: 'Mutations', 
                        captured: 92, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      },
                      { 
                        name: 'Treatments', 
                        captured: 88, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 008 10.586V5L7 4z" /></svg>
                      },
                      { 
                        name: 'Lab Results', 
                        captured: 94, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      },
                      { 
                        name: 'Diagnosis', 
                        captured: 85, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      },
                      { 
                        name: 'Other Events', 
                        captured: 82, 
                        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      }
                    ].map((event, idx) => (
                      <motion.div
                        key={idx}
                        className="mb-4 last:mb-0 bg-white rounded-xl p-4 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <span className="mr-3 text-indigo-600">{event.icon}</span>
                            {event.name}
                          </span>
                          <span className="text-sm font-bold text-indigo-600">{event.captured}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${event.captured}%` }}
                            transition={{ duration: 0.8, delay: 0.9 + idx * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of flex-col-reverse container */}

          {/* Deficiencies Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: (
                  <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Missing Biomarker Status",
                description: "Claims capture the billing code for a test, but almost never the result. We know a PIK3CA test was done, but not if the patient is mutated or wild-type."
              },
              {
                icon: (
                  <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                title: "Absence of Disease Staging",
                description: "There is no reliable field to distinguish between an early-stage and a metastatic patient—the crucial first split in the journey."
              },
              {
                icon: (
                  <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Incomplete Patient History",
                description: "Key events like disease progression or treatment switches are not explicitly captured, making it impossible to pinpoint a patient's exact position."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-dark mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shocking Statistic */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-2xl p-8 max-w-4xl mx-auto">
              <p className="text-2xl font-bold text-red-700 mb-4">
                For a PIK3CA inhibitor, where clinical literature suggests a ~40% PIK3CA mutation rate, raw claims data may show explicit results for less than 10% of tested patients.
              </p>
              <p className="text-3xl font-extrabold text-red-800">
                This leaves over <span className="text-4xl">75%</span> of the potential market completely hidden.
              </p>
            </div>
          </div>

          {/* Data Visualization */}
          <DataVisualization data={marketData} />

          {/* Business Consequences */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-dark mb-8">This profound data gap means you are "flying blind," leading directly to:</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "Inaccurate Market Sizing",
                "Massive Resource Misallocation",
                "Ineffective Strategy"
              ].map((consequence, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-lg font-semibold text-red-800">{consequence}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Solution Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-dark">
                From a <span className="text-purple-600">Data Black Hole</span> to a High-Fidelity, Actionable Map
              </h2>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-lg text-gray-600 text-center leading-relaxed">
                Our solution is a suite of sophisticated, machine learning-based <span className="font-bold text-purple-600">Enrichment Models</span>. These are purpose-built algorithms that learn the complex, subtle patterns within claims data—including treatment sequences, diagnostic codes, and care patterns—to predict missing clinical attributes with a high degree of precision and recall.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">For Niche Biomarkers (PIK3CA, gBRCA)</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our models identify "look-alike" patients who, based on their entire clinical journey, have a high probability of carrying the mutation, even without an explicit lab result.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-dark mb-2">For Emerging Biomarkers (HER2-Low)</h3>
                    <p className="text-gray-600 leading-relaxed">
                      For biomarkers with zero presence in claims, we employ an advanced methodology. We link claims data to external lab datasets to create a "seed" population, then build a powerful predictive model to identify the rest of the population within the broader database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Impact Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-dark">
              We Bridged the <span className="text-purple-600">Data Chasm</span>
            </h2>
            <p className="mt-4 text-xl text-gray-medium">
              Turning an Untargetable Market into a Core Strategic Asset
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                stat: "35x",
                subtitle: "VISIBILITY MULTIPLIER",
                title: "BIOMARKER IDENTIFICATION BREAKTHROUGH",
                description: "For the PIK3CA & BRCA biomarker-driven markets (PIK3CA inhibitors and PARP inhibitors), we increased the identifiable patient pool from less than 1% to ~35% for PIK3CA and ~7% for BRCA.",
                highlight: "From invisible to actionable"
              },
              {
                stat: "50%",
                subtitle: "MARKET BUILT FROM ZERO",
                title: "HER2-LOW MARKET CREATION",
                description: "For the emerging HER2-Low market (critical for HER2-targeted ADCs), we moved from zero visibility to over 50% identification, essentially building the market view from scratch.",
                highlight: "Entirely new market segment"
              },
              {
                stat: "90%",
                subtitle: "COVERAGE ACHIEVED",
                title: "FOUNDATIONAL SEGMENT MASTERY",
                description: "We significantly strengthened foundational segments, bringing HR+ patient identification to ~90% and nearly quadrupling visibility into the HER2+ population.",
                highlight: "Near-complete market coverage"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <div className="text-6xl font-extrabold text-purple-600 mb-2">
                    {item.stat}
                  </div>
                  <div className="text-sm font-semibold text-purple-500 uppercase tracking-wide">
                    {item.subtitle}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-dark mb-2">{item.title}</h3>
                  <div className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    {item.highlight}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
      {/* Ultimate Value Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center text-white">
              <h2 className="text-4xl font-extrabold mb-8">
                Enriched Data is Not Just an Exercise; It's the Enabler of Your Entire Commercial Strategy
              </h2>

              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-xl leading-relaxed opacity-90">
                  This newfound clarity is the critical first step that unlocks a new level of strategic execution. By transforming the data to reflect clinical reality, we empower you to:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    number: "1",
                    title: "Accurately Size and Define Markets",
                    description: "Understand the true, addressable patient opportunity for every single indication."
                  },
                  {
                    number: "2",
                    title: "Identify High-Potential HCPs",
                    description: "Find the specific oncologists treating the precise patient subtypes relevant to each brand."
                  },
                  {
                    number: "3",
                    title: "Enable Precision Targeting",
                    description: "Possess the granular, patient-level intelligence required to power sophisticated segmentation and next-best-action models."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                    <div className="text-3xl font-bold mb-4">{item.number}</div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="opacity-90 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Looking Ahead</h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  This high-fidelity map solves the <em>identification</em> problem. It then becomes the foundation for solving the next great challenge: <strong>Intelligent Orchestration</strong>—knowing precisely what to talk about, and in what order, for every HCP interaction.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-dark mb-8">
              Are You Ready to Navigate Your Market with <span className="text-purple-600">Precision</span>?
            </h2>
            <p className="text-xl text-gray-medium mb-12 leading-relaxed">
              Stop making strategic decisions based on an incomplete picture. Let us help you illuminate the hidden patient populations in your market and provide your teams with the intelligent GPS they need to win.
            </p>
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Demo to See Your Data Transformed
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

const tableData = [
  { territory: 'California', spend: -10, revenue: 2, profit: 8, roi: 2.7, mroi: 0.7 },
  { territory: 'Texas', spend: 20, revenue: 60, profit: 38, roi: 5.2, mroi: 2.2 },
  { territory: 'Florida', spend: -12, revenue: 2, profit: 9, roi: 0.6, mroi: 0.3 },
  { territory: 'New York', spend: -2, revenue: 3, profit: 3, roi: 1.23, mroi: 0.7 },
  { territory: 'Illinois', spend: -12, revenue: -10, profit: 1, roi: 0.18, mroi: 0.02 },
  { territory: 'Pennsylvania', spend: 18, revenue: 55, profit: 35, roi: 3.8, mroi: 1.8 },
  { territory: 'Ohio', spend: -1.5, revenue: 3.2, profit: 2.8, roi: 1.23, mroi: 0.7 },
  { territory: 'Georgia', spend: -8, revenue: 2.5, profit: 6.5, roi: 2.9, mroi: 0.5 },
  { territory: 'North Carolina', spend: -11, revenue: 1, profit: 9, roi: 1.2, mroi: 0.3 },
  { territory: 'Michigan', spend: -13, revenue: -8, profit: 0.5, roi: 0.1, mroi: 0.04 }
];

const chartData = [
  { time: 0, "Real world data": 0 },
  { time: 2, "Real world data": 0.5 },
  { time: 4, "Real world data": 1 },
  { time: 6, "Real world data": 2, "Simulate": 2, "Simulate_range": [1.5, 2.5] },
  { time: 7, "Real world data": 3.5, "Simulate": 3.5, "Optimize": 1, "Simulate_range": [2.8, 4.2] },
  { time: 8, "Real world data": 5, "Simulate": 5.5, "Optimize": 2.5, "Simulate_range": [4.5, 6.5] },
  { time: 9, "Real world data": 7, "Simulate": 8, "Optimize": 5, "Simulate_range": [6.8, 9.2] },
  { time: 10, "Real world data": 9, "Simulate": 10.5, "Optimize": 9, "Simulate_range": [9, 12] },
  { time: 11, "Real world data": 11, "Simulate": 13, "Optimize": 13.5, "Simulate_range": [11.5, 14.5] },
  { time: 12, "Real world data": 13, "Simulate": 15, "Optimize": 17.5, "Simulate_range": [13, 17] },
  { time: 13, "Real world data": 15, "Simulate": 17, "Optimize": 21, "Simulate_range": [15, 19] },
  { time: 14, "Real world data": 17, "Simulate": 19, "Optimize": 24, "Simulate_range": [17, 21.5] },
  { time: 15, "Real world data": 19, "Simulate": 21, "Optimize": 27, "Simulate_range": [18.5, 23.5] },
  { time: 16, "Real world data": 21.5, "Simulate": 23, "Optimize": 29.5, "Simulate_range": [20, 26] },
  { time: 17, "Real world data": 24, "Simulate": 25, "Optimize": 32, "Simulate_range": [22, 28] },
  { time: 18, "Real world data": 26, "Simulate": 27, "Optimize": 34, "Simulate_range": [24, 30] },
];

// Data for ROI-optimizing Spend Adjustment visualization - smooth saturation curve
const spendRevenueData = [
  { spendPercent: 0, revenue: 0 },
  { spendPercent: 10, revenue: 4 },
  { spendPercent: 20, revenue: 8 },
  { spendPercent: 30, revenue: 11 },
  { spendPercent: 40, revenue: 14 },
  { spendPercent: 50, revenue: 16 },
  { spendPercent: 60, revenue: 17.5 },
  { spendPercent: 70, revenue: 18.5 },
  { spendPercent: 80, revenue: 19 },  // Profit max point
  { spendPercent: 90, revenue: 25 },
  { spendPercent: 100, revenue: 33 }, // FY23 Spend point  
  { spendPercent: 110, revenue: 36 },
  { spendPercent: 120, revenue: 38 },
  { spendPercent: 140, revenue: 41 },
  { spendPercent: 160, revenue: 43 },
  { spendPercent: 180, revenue: 44.5 },
  { spendPercent: 200, revenue: 45 },
];

// Purple Diamond for Profit Max
const PurpleDiamond = (props) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  const size = 10;
  return (
    <polygon
      points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
      fill="#9333EA"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

// Blue Diamond for FY23 Spend
const BlueDiamond = (props) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  const size = 10;
  return (
    <polygon
      points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
      fill="#3B82F6"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

const ROISpendAdjustment = () => {
  const territoryData = [
    { territory: 'California', spend: -10, revenue: 2, profit: 8, roi: 2.70, mroi: 0.70, status: 'reduce' },
    { territory: 'Texas', spend: 20, revenue: 60, profit: 38, roi: 5.20, mroi: 2.20, status: 'increase' },
    { territory: 'Florida', spend: -12, revenue: 2, profit: 9, roi: 0.60, mroi: 0.30, status: 'reduce' },
    { territory: 'New York', spend: -2, revenue: 3, profit: 3, roi: 1.23, mroi: 0.70, status: 'optimal' },
    { territory: 'Illinois', spend: -12, revenue: -10, profit: 1, roi: 0.18, mroi: 0.02, status: 'reduce' },
    { territory: 'Pennsylvania', spend: 18, revenue: 55, profit: 35, roi: 3.80, mroi: 1.80, status: 'increase' },
    { territory: 'Ohio', spend: -1.5, revenue: 3.2, profit: 2.8, roi: 1.23, mroi: 0.70, status: 'optimal' },
    { territory: 'Georgia', spend: -8, revenue: 2.5, profit: 6.5, roi: 2.90, mroi: 0.50, status: 'reduce' },
    { territory: 'North Carolina', spend: -11, revenue: 1, profit: 9, roi: 1.20, mroi: 0.30, status: 'reduce' },
  ];

  return (
    <div className="mb-16">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Brand x Market Level Panel - The Response Curve */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <div>
                <h3 className="text-lg font-bold">The Response Curve</h3>
                <p className="text-emerald-100 text-sm">Brand-level spend vs. revenue relationship</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Key Insight Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Key Insight</p>
                  <p className="text-sm text-amber-700">Current spend ($10M) is <span className="font-bold">past the optimal point</span>. Reducing to $8M maintains revenue while freeing $2M for reallocation.</p>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-end items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-600">Optimal Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-600">Current Spend</span>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="spendPercent" 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                    ticks={[0, 100, 200]}
                    axisLine={{ stroke: '#d1d5db' }}
                    label={{ value: 'Spend (% of Current)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    domain={[0, 55]}
                    ticks={[0, 10, 20, 30, 40, 50]}
                    axisLine={{ stroke: '#d1d5db' }}
                    width={40}
                    label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fill: '#6b7280' }}
                  />
                  <Line 
                    type="basis" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={false}
                  />
                  <ReferenceDot 
                    x={80} 
                    y={19} 
                    shape={PurpleDiamond}
                    label={{ 
                      value: 'Optimal: $8M → $19M', 
                      position: 'top',
                      fontSize: 11,
                      fill: '#059669',
                      offset: 10
                    }}
                  />
                  <ReferenceDot 
                    x={100} 
                    y={33} 
                    shape={BlueDiamond}
                    label={{ 
                      value: 'Current: $10M → $20M', 
                      position: 'top',
                      fontSize: 11,
                      fill: '#3B82F6',
                      offset: 10
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Key Metrics Row */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Potential Savings</div>
                <div className="text-lg font-bold text-emerald-600">$2M</div>
            </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Maintained Revenue</div>
                <div className="text-lg font-bold text-gray-800">~$19M</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">ROI Improvement</div>
                <div className="text-lg font-bold text-emerald-600">+18%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Territory Level Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <div>
                <h3 className="text-lg font-bold">Territory Recommendations</h3>
                <p className="text-slate-300 text-sm">Where to increase, reduce, or maintain spend</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <div className="text-xs text-emerald-600 font-medium">Increase</div>
                <div className="text-xl font-bold text-emerald-700">2</div>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center">
                <div className="text-xs text-cyan-600 font-medium">Optimal</div>
                <div className="text-xl font-bold text-cyan-700">2</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
                <div className="text-xs text-rose-600 font-medium">Reduce</div>
                <div className="text-xl font-bold text-rose-700">5</div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Territory</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Δ Spend</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Δ Profit</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">mROI</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {territoryData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-800">{row.territory}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${row.spend < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {row.spend > 0 ? '+' : ''}{row.spend}%
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${row.profit > 5 ? 'text-emerald-600' : 'text-gray-600'}`}>
                          +${row.profit}M
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${row.mroi > 1 ? 'bg-emerald-100 text-emerald-700' : row.mroi > 0.5 ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}`}>
                          {row.mroi.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          row.status === 'increase' ? 'bg-emerald-100 text-emerald-700' :
                          row.status === 'optimal' ? 'bg-cyan-100 text-cyan-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {row.status === 'increase' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          )}
                          {row.status === 'reduce' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                          {row.status === 'optimal' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResponseCurves = ({ isROIOptimizationActive }) => {
  // Transform data to create proper area bounds
  const transformedData = chartData.map(item => {
    if (item.Simulate_range) {
      return {
        ...item,
        Simulate_lower: item.Simulate_range[0],
        Simulate_upper: item.Simulate_range[1]
      };
    }
    return item;
  });

  const steps = [
    {
      number: 1,
      title: 'Replicate real-world',
      description: 'Our model analyzes historical data to understand the drivers of past success and accurately replicate real-world outcomes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12c4-4 8-4 12 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 9a1 1 0 11-2 0 1 1 0 012 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 7a1 1 0 11-2 0 1 1 0 012 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a1 1 0 11-2 0 1 1 0 012 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      )
    },
    {
      number: 2,
      title: 'Simulate scenarios',
      description: 'Using the trained model, we can predict the likely outcomes of different strategic actions and scenarios.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10a8 8 0 0113.6-5.6L20 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h6v6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 14a8 8 0 01-13.6 5.6L4 20" />
        </svg>
      )
    },
    {
      number: 3,
      title: 'Optimize actions',
      description: 'By simulating numerous scenarios, we identify the optimal strategy and sequence of actions to maximize your objective function.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l4 4L13 3l4 4L21 3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 21v-7a4 4 0 014-4h6a4 4 0 014 4v7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v7" />
        </svg>
      )
    }
  ];

  const hcp1ChartData = [
    { interactions: 0, predictions: 0, sim1: 0, sim2: 0, sim3: 0, sim4: 0, sim5: 0, sim6: 0, sim7: 0, sim8: 0, sim9: 0, sim10: 0 },
    { interactions: 1, predictions: 1, sim1: 0.5, sim2: 1.2, sim3: 0.8, sim4: 1.5, sim5: 0.2, sim6: 1.8, sim7: 0.9, sim8: 1.1, sim9: 0.4, sim10: 1.6 },
    { interactions: 2, predictions: 2, sim1: 1.5, sim2: 2.5, sim3: 1.8, sim4: 3, sim5: 1, sim6: 4, sim7: 2.2, sim8: 2.8, sim9: 1.3, sim10: 3.5 },
    { interactions: 3, predictions: 6, sim1: 3, sim2: 5, sim3: 4, sim4: 6, sim5: 2.5, sim6: 8, sim7: 5, sim8: 6.5, sim9: 3.8, sim10: 7.5 },
    { interactions: 4, predictions: 12, sim1: 6, sim2: 10, sim3: 8, sim4: 12, sim5: 5, sim6: 15, sim7: 10, sim8: 13, sim9: 8, sim10: 14 },
    { interactions: 5, predictions: 18, sim1: 10, sim2: 16, sim3: 13, sim4: 19, sim5: 9, sim6: 22, sim7: 16, sim8: 20, sim9: 14, sim10: 21 },
  ];

  const hcp2ChartData = [
    { interactions: 0, predictions: 0, sim1: 0, sim2: 0, sim3: 0, sim4: 0, sim5: 0, sim6: 0, sim7: 0, sim8: 0, sim9: 0, sim10: 0 },
    { interactions: 1, predictions: 8, sim1: 5, sim2: 9, sim3: 7, sim4: 10, sim5: 6, sim6: 8.5, sim7: 7.5, sim8: 9.5, sim9: 6.5, sim10: 10.5 },
    { interactions: 2, predictions: 14, sim1: 9, sim2: 15, sim3: 12, sim4: 16, sim5: 10, sim6: 14.5, sim7: 13, sim8: 15.5, sim9: 11, sim10: 16.5 },
    { interactions: 3, predictions: 16, sim1: 11, sim2: 17, sim3: 14, sim4: 18, sim5: 12, sim6: 16.5, sim7: 15, sim8: 17.5, sim9: 13, sim10: 18.5 },
    { interactions: 4, predictions: 17, sim1: 12, sim2: 18, sim3: 15, sim4: 19, sim5: 13, sim6: 17.5, sim7: 16, sim8: 18.5, sim9: 14, sim10: 19.5 },
    { interactions: 5, predictions: 17.5, sim1: 12.5, sim2: 18.5, sim3: 15.5, sim4: 19.5, sim5: 13.5, sim6: 18, sim7: 16.5, sim8: 19, sim9: 14.5, sim10: 20 },
  ];

  const HCPChart = ({ data, lineColor, isROIOptimizationActive }) => (
    <motion.div
      className="w-full h-64"
      animate={isROIOptimizationActive ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 0 rgba(147, 51, 234, 0)',
          '0 0 0 8px rgba(147, 51, 234, 0.3)',
          '0 0 0 0 rgba(147, 51, 234, 0)'
        ]
      } : {}}
      transition={{
        duration: 2,
        repeat: isROIOptimizationActive ? Infinity : 0,
        repeatType: "loop",
        ease: "easeInOut"
      }}
    >
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="interactions" label={{ value: '# F2F interactions', position: 'insideBottom', dy: 20, fill: '#6B7280' }} stroke="#a0a0a0" />
          <YAxis domain={[0, 30]} ticks={[0, 10, 20, 30]} label={{ value: 'Predictions', angle: -90, position: 'insideLeft', dx: 10, fill: '#6B7280' }} stroke="#a0a0a0" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              border: '1px solid #e0e0e0',
              borderRadius: '0.5rem',
            }}
          />
          {[...Array(10)].map((_, i) => (
            <Line key={i} type="monotone" dataKey={`sim${i + 1}`} stroke="#d1d5db" strokeWidth={1} dot={false} />
          ))}
          <Line type="monotone" dataKey="predictions" stroke={lineColor} strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  const hcpData = [
    {
      id: 1,
      name: 'HCP 1',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      chartData: hcp1ChartData,
      lineColor: '#10B981',
      characteristics: 'Cardiologist, KOL, high publication rate, active in medical congresses, high local hospitalization rate.',
      outcomes: [
        'High publication count drives steeper response.',
        'Congress participation raises plateau.',
        'High hospitalization rate boosts neighboring HCPs.',
      ],
      curveDescription: [
        'Low initial response (0-2 visits).',
        'Steeper curve >2, increasing response at 5+ visits.',
      ]
    },
    {
      id: 2,
      name: 'HCP 2',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      chartData: hcp2ChartData,
      lineColor: '#06B6D4',
      characteristics: 'GP, mid-size practice, low email open/click rate, infrequent congress attendance.',
      outcomes: [
        'Faster response to low engagement.',
        'Mid-size practice limits potential.',
        'Email engagement doesn\'t impact F2F.',
        'Congress participation has no impact.',
      ],
      curveDescription: [
        'High initial response (0-2 visits).',
        'Early flattening with minimal incremental response.',
      ]
    }
  ];

  return (
    <div>
      {/* Process + Chart Side by Side */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Process Steps Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Our 3-Step Process</h3>
              <p className="text-sm text-gray-500">From historical data to optimized outcomes</p>
            </div>
          </div>
          
          <div className="relative space-y-4 flex-grow">
            <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-300 via-cyan-300 to-blue-300 z-0"></div>

            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 z-10 hover:shadow-md transition-shadow duration-200">
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                  step.number === 1 ? 'bg-emerald-100 text-emerald-600' :
                  step.number === 2 ? 'bg-cyan-100 text-cyan-600' :
                    'bg-blue-100 text-blue-600'
                } border-2 border-white shadow-md`}>
                  <span className="font-bold text-sm">{step.number}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{step.title}</h4>
                  <p className="mt-1 text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Response Curve Simulation</h3>
              <p className="text-sm text-gray-500">Simulated vs. real-world vs. optimized</p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-orange-500 rounded" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-xs text-gray-600">Real World</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Simulated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-emerald-500 rounded"></div>
              <span className="text-xs text-gray-600">Optimized</span>
            </div>
          </div>

          <div className="w-full flex-grow flex items-center">
            <div className="w-full h-72">
              <ResponsiveContainer>
                <AreaChart data={transformedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="time" label={{ value: 'Time since 1st Rep call', position: 'insideBottom', dy: 15, fill: '#6B7280', fontSize: 11 }} stroke="#a0a0a0" tick={{ fontSize: 11 }} />
                  <YAxis label={{ value: 'Est. Rx', angle: -90, position: 'insideLeft', dx: 5, fill: '#6B7280', fontSize: 11 }} stroke="#a0a0a0" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Simulate_upper"
                    stroke="none"
                    fill="#60A5FA"
                    fillOpacity={0.2}
                    name="Simulate Range"
                    legendType="none"
                    baseLine="Simulate_lower"
                  />
                  <Line type="monotone" dataKey="Real world data" stroke="#F97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="Simulate" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Optimize" stroke="#10B981" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <AnimatedSection>
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Different HCPs, Different Curves</h3>
              <p className="text-sm text-gray-500">Why one-size-fits-all doesn't work</p>
            </div>
                  </div>

          {/* Key Insight */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
                    <div>
                <p className="text-sm font-semibold text-violet-800">Why This Matters</p>
                <p className="text-sm text-violet-700">A KOL cardiologist needs 5+ visits to reach potential, while a GP saturates after 2-3. Applying the same call frequency wastes budget on saturated HCPs and under-invests in high-potential ones.</p>
              </div>
            </div>
                    </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hcpData.map((hcp) => (
              <div key={hcp.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className={`${hcp.id === 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} text-white px-5 py-3`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">{hcp.name}: {hcp.id === 1 ? 'High-Potential KOL' : 'Quick-Saturating GP'}</h4>
                      <p className="text-xs opacity-80">{hcp.id === 1 ? 'Cardiologist, KOL, Congress Speaker' : 'GP, Mid-size Practice'}</p>
                    </div>
                    </div>
                  </div>

                <div className="p-5">
                  {/* Curve Pattern Summary */}
                  <div className="flex gap-4 mb-4">
                    <div className={`flex-1 p-3 rounded-lg ${hcp.id === 1 ? 'bg-emerald-50 border border-emerald-200' : 'bg-cyan-50 border border-cyan-200'}`}>
                      <div className={`text-xs font-medium ${hcp.id === 1 ? 'text-emerald-600' : 'text-cyan-600'} mb-1`}>Pattern</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {hcp.id === 1 ? 'Slow start, steep growth after visit 3' : 'Fast initial response, early plateau'}
                      </div>
                    </div>
                    <div className={`w-24 p-3 rounded-lg ${hcp.id === 1 ? 'bg-emerald-50 border border-emerald-200' : 'bg-cyan-50 border border-cyan-200'} text-center`}>
                      <div className={`text-xs font-medium ${hcp.id === 1 ? 'text-emerald-600' : 'text-cyan-600'} mb-1`}>Saturation</div>
                      <div className="text-lg font-bold text-gray-800">{hcp.id === 1 ? '5+' : '2-3'}</div>
                      <div className="text-xs text-gray-500">visits</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <HCPChart data={hcp.chartData} lineColor={hcp.lineColor} isROIOptimizationActive={isROIOptimizationActive} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};
const FieldForceSizing = () => {
  const [selectedScenario, setSelectedScenario] = React.useState(0);

  const territoryAnalysis = [
    {
      territory: "Metro High-Density",
      region: "Northeast",
      currentReps: 3,
      recommendedReps: 4,
      hcpCount: 245,
      potentialRevenue: "$3.2M",
      currentRevenue: "$2.1M",
      currentCoverage: "78%",
      optimalCoverage: "95%",
      reasoning: "High HCP density with strong response curves justify additional rep investment",
      repUtilization: "92%",
      travelEfficiency: "68%",
      avgResponseCurve: "Steep growth after 3rd visit",
      saturationPoint: "6+ visits",
      territoryType: "Urban Dense",
      recommendation: "Add 1 Rep",
      expectedLift: "+$1.1M",
      roiMonths: 8
    },
    {
      territory: "Rural Sparse",
      region: "Southwest",
      currentReps: 2,
      recommendedReps: 1,
      hcpCount: 89,
      potentialRevenue: "$1.1M",
      currentRevenue: "$0.9M",
      currentCoverage: "85%",
      optimalCoverage: "90%",
      reasoning: "Low HCP density with early saturation curves suggest rep consolidation for efficiency",
      repUtilization: "54%",
      travelEfficiency: "45%",
      avgResponseCurve: "Quick saturation at 2nd visit",
      saturationPoint: "3 visits",
      territoryType: "Rural Spread",
      recommendation: "Reduce 1 Rep",
      expectedLift: "+$0.2M",
      roiMonths: 4
    },
    {
      territory: "Suburban Balanced",
      region: "Midwest",
      currentReps: 2,
      recommendedReps: 3,
      hcpCount: 156,
      potentialRevenue: "$2.4M",
      currentRevenue: "$1.8M",
      currentCoverage: "82%",
      optimalCoverage: "93%",
      reasoning: "Moderate HCP density with untapped specialist potential requires focused coverage",
      repUtilization: "88%",
      travelEfficiency: "72%",
      avgResponseCurve: "Steady growth through 5 visits",
      saturationPoint: "5-6 visits",
      territoryType: "Mixed Density",
      recommendation: "Add 1 Rep",
      expectedLift: "+$0.6M",
      roiMonths: 12
    }
  ];

  const platformFeatures = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Response Curve Analysis",
      description: "Analyze HCP saturation curves to determine optimal visit frequency and rep allocation per territory",
      repBenefit: "Reps get territories sized based on actual HCP responsiveness, not just geography"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Territory Optimization",
      description: "AI-powered rep allocation based on HCP potential and rep capacity",
      repBenefit: "Balanced territories with realistic coverage expectations and achievable targets"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "ROI-Based Sizing",
      description: "Calculate optimal field force size by balancing rep costs against incremental revenue potential",
      repBenefit: "Territories designed for success with achievable targets and clear growth opportunities"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Dynamic Rebalancing",
      description: "Continuous monitoring and recommendations for territory adjustments based on performance data",
      repBenefit: "Proactive territory adjustments to maintain optimal workload and performance potential"
    }
  ];

  const sizingMetrics = {
    totalTerritories: 24,
    totalReps: 67,
    recommendedReps: 71,
    efficiencyGain: "+12%",
    revenueImpact: "+$8.4M",
    costOptimization: "-$2.1M"
  };

  return (
    <div>
      {/* Platform Capabilities - Compact Grid */}
      <div className="mb-12">
        <div className="grid md:grid-cols-4 gap-4">
            {platformFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 bg-gradient-to-br from-violet-100 to-purple-100 p-2 rounded-lg">
                    {feature.icon}
                  </div>
                <h4 className="font-bold text-gray-800 text-sm">{feature.title}</h4>
                    </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

      {/* Container for the three connected sections */}
      <div className="relative">
        {/* Connecting vertical line for the three field force sections */}
        <div className="absolute left-6 -top-8 h-full w-1 bg-gradient-to-b from-purple-300 to-indigo-300 z-0 hidden lg:block"></div>

        {/* Connection dots for each section */}
        <div className="absolute left-5 top-0 w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-5 top-[26.6rem] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-5 top-[53.2rem] w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>

        {/* Generate Optimal Territory Rep Allocation */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row gap-8 mb-12 relative">
            {/* Title Section - Left Side */}
            <div className="lg:w-1/3 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex flex-col justify-start">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">Generate Optimal Territory Rep Allocation</h3>
                <p className="text-gray-600">AI-driven recommendations for optimal rep distribution across territories based on response curve analysis and ROI potential</p>
              </div>
            </div>

            {/* Card Section - Right Side */}
            <div className="lg:w-2/3">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{sizingMetrics.totalTerritories}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Territories</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-600">{sizingMetrics.recommendedReps}</div>
                    <div className="text-sm text-gray-600 mt-1">Recommended Reps</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{sizingMetrics.efficiencyGain}</div>
                    <div className="text-sm text-gray-600 mt-1">Efficiency Gain</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-600">{sizingMetrics.revenueImpact}</div>
                    <div className="text-sm text-gray-600 mt-1">Revenue Impact</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{sizingMetrics.costOptimization}</div>
                    <div className="text-sm text-gray-600 mt-1">Cost Optimization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Field Force Sizing Examples */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row gap-12 mb-12 relative">
            {/* Title Section - Left Side */}
            <div className="lg:w-1/3 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col justify-start">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">Field Force Sizing Illustrations</h3>
                <p className="text-gray-600">Real-world examples of optimal rep allocation per territory based on response curve analysis</p>
              </div>
            </div>

            {/* Content Section - Right Side */}
            <div className="lg:w-2/3">
              {/* Scenario Selection Buttons */}
              <div className="flex justify-start mb-8">
                <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
                  {territoryAnalysis.map((territory, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScenario(index)}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${selectedScenario === index
                        ? 'bg-white text-purple-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      Scenario {index + 1}: {territory.territory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Territory Display */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {(() => {
                  const territory = territoryAnalysis[selectedScenario];
                  return (
                    <>
                      {/* Territory Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-lg font-bold text-gray-dark">{territory.territory}</h4>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                {territory.territoryType}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${territory.recommendation.includes('Add') ? 'bg-accent-light text-accent-dark' :
                                territory.recommendation.includes('Reduce') ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                {territory.recommendation}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs">{territory.region} • {territory.hcpCount} HCPs • {territory.avgResponseCurve}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-accent">{territory.expectedLift}</div>
                            <div className="text-xs text-gray-500">Expected Revenue Lift</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid md:grid-cols-5 gap-6">
                          {/* Current Metrics */}
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center text-xs">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                              Current State
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Reps:</span>
                                <span className="font-bold text-gray-800 text-xs">{territory.currentReps}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Revenue:</span>
                                <span className="font-bold text-gray-800 text-xs">{territory.currentRevenue}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Coverage:</span>
                                <span className="font-medium text-gray-700 text-xs">{territory.currentCoverage}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Utilization:</span>
                                <span className="font-medium text-gray-700 text-xs">{territory.repUtilization}</span>
                              </div>
                            </div>
                          </div>

                          {/* Optimized State */}
                          <div className="bg-white rounded-lg p-3 border-l-4 border-accent">
                            <h5 className="font-medium text-accent-dark mb-3 flex items-center text-xs">
                              <div className="w-2 h-2 bg-accent rounded-full mr-1"></div>
                              Optimized State
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Reps:</span>
                                <span className="font-bold text-accent-dark text-xs">{territory.recommendedReps}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Revenue:</span>
                                <span className="font-bold text-accent-dark text-xs">{territory.potentialRevenue}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Coverage:</span>
                                <span className="font-medium text-accent-dark text-xs">{territory.optimalCoverage}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Efficiency:</span>
                                <span className="font-medium text-accent-dark text-xs">{territory.travelEfficiency}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Response Curve Insights */}
                          <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                            <h5 className="font-medium text-purple-700 mb-3 flex items-center text-xs">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                              Response Pattern
                            </h5>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">Curve Type:</span>
                                <p className="text-primary-dark">{territory.avgResponseCurve}</p>
                              </div>
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">Saturation:</span>
                                <p className="text-gray-600">{territory.saturationPoint}</p>
                              </div>
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">ROI Timeline:</span>
                                <p className="text-gray-600">{territory.roiMonths} months</p>
                              </div>
                            </div>
                          </div>

                          {/* Business Impact */}
                          <div className="bg-white rounded-lg p-3 border-l-4 border-secondary">
                            <h5 className="font-medium text-secondary-dark mb-3 flex items-center text-xs">
                              <div className="w-2 h-2 bg-secondary rounded-full mr-1"></div>
                              Business Impact
                            </h5>
                            <div className="space-y-2">
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">Revenue Lift:</span>
                                <p className="text-secondary-dark font-bold">{territory.expectedLift}</p>
                              </div>
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">HCP Coverage:</span>
                                <p className="text-gray-600">{territory.hcpCount} physicians</p>
                              </div>
                              <div className="text-xs">
                                <span className="font-medium text-gray-700">Territory Type:</span>
                                <p className="text-gray-600">{territory.territoryType}</p>
                              </div>
                            </div>
                          </div>

                          {/* AI Reasoning */}
                          <div className="bg-white rounded-lg p-3 border-l-4 border-orange-500">
                            <h5 className="font-medium text-orange-700 mb-3 flex items-center text-xs">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                              AI Analysis
                            </h5>
                            <p className="text-xs text-gray-700 leading-tight">{territory.reasoning}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </AnimatedSection>
        {/* Rep Call Planning */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row gap-8 mb-12 mt-16 relative">
            {/* Title Section - Left Side */}
            <div className="lg:w-1/3 flex items-start space-x-4">
              <div className="flex-shrink-0 bg-purple-100 p-4 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-col justify-start">
                <h3 className="text-3xl font-bold text-gray-dark mb-4">Rep Call Planning</h3>
                <p className="text-gray-600">Simulation-driven insights for optimal HCP visit planning</p>
              </div>
            </div>

            {/* Content Section - Right Side */}
            <div className="lg:w-2/3">
              {/* Platform Feature: Visit Impact Simulation */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-lighter to-blue-100 p-6 border-b border-gray-200">
                  <h4 className="text-xl font-bold text-gray-dark">Visit Impact Simulation</h4>
                  <p className="text-gray-600">AI predicts Rx impact based on visit frequency for each HCP</p>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* HCP1 - Cardiologist */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h6 className="font-semibold text-gray-700">HCP1</h6>
                          <p className="text-sm text-gray-500">Cardiologist</p>
                        </div>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High Priority</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Current (2 visits/month):</span>
                          <span className="font-medium">45 Rx</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Optimal (4 visits/month):</span>
                          <span className="font-bold text-green-600">72 Rx</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-semibold text-blue-700">Incremental Impact:</span>
                          <span className="font-bold text-blue-600">+27 Rx (+60%)</span>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Curve insight: Steep response after 3rd visit
                      </div>
                    </div>

                    {/* HCP2 - GP */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h6 className="font-semibold text-gray-700">HCP2</h6>
                          <p className="text-sm text-gray-500">General Practitioner</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Medium Priority</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Current (1 visit/month):</span>
                          <span className="font-medium">28 Rx</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Optimal (2 visits/month):</span>
                          <span className="font-bold text-green-600">38 Rx</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-semibold text-blue-700">Incremental Impact:</span>
                          <span className="font-bold text-blue-600">+10 Rx (+36%)</span>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Curve insight: Quick saturation at 2 visits
                      </div>
                    </div>

                  </div>

                  {/* Territory Summary */}
                  <div className="mt-8 bg-white rounded-lg p-6 border-l-4 border-accent shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-accent-dark text-lg">Territory Optimization Impact</h5>
                        <p className="text-sm text-gray-600 mt-1">Following simulation-based visit recommendations</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-accent">+37 Rx/month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div> {/* End of container for the three connected sections */}

    </div>
  );
};

const RxCoreLandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-50 via-white to-gray-50 pt-24 pb-16 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(139, 92, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <RxCoreLogo size="lg" animated={true} theme="light" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-gray-900">Transform </span>
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Commercial Performance</span>
              <br />
              <span className="text-gray-900">with </span>
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">AI-powered Excellence</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-center text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              End to end solutions for <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">pharma commercial teams</span>: precision targeting, resource optimization, and field execution
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <a
                href="#products"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                Explore Solutions
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 shadow-sm"
              >
                Contact Us
              </a>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {[
                { label: "Data to Models", value: "70% Faster" },
                { label: "Targeting Precision", value: "30x Better" },
                { label: "ROI Improvement", value: "15-25%" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
        </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
      </div>
              ))}
            </motion.div>
          </motion.div>
            </div>
      </div>

      {/* Audience Banner */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-6xl mx-auto">
                <motion.div
                className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                  }}></div>
                  </div>
                  
                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

                <div className="relative p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      <span className="text-sm font-bold text-white tracking-wide">DESIGNED FOR YOUR TEAM</span>
                      </div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                      Built for the <span className="text-cyan-200">Commercial Pharma Lifecycle</span>
                    </h3>
                    <p className="text-lg text-indigo-100">From strategy to execution</p>
                  </div>

                  {/* Roles Grid */}
                  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                      {
                        role: "Strategic Leaders",
                        personas: ["Brand Directors", "Marketing VPs"],
                    icon: (
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ),
                        gradient: "from-purple-500 to-indigo-500",
                        accentColor: "purple-200"
                  },
                  {
                        role: "Analytics Teams",
                        personas: ["Data Scientists", "Commercial Analysts"],
                    icon: (
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    ),
                        gradient: "from-blue-500 to-cyan-500",
                        accentColor: "cyan-200"
                      },
                      {
                        role: "Field Force",
                        personas: ["Sales Reps", "District Managers"],
                        icon: (
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ),
                        gradient: "from-indigo-500 to-purple-500",
                        accentColor: "indigo-200"
                      }
                    ].map((group, idx) => (
                  <motion.div
                        key={idx}
                        className="group relative bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {/* Icon */}
                        <div className="flex justify-center mb-3">
                          <div className={`relative bg-gradient-to-br ${group.gradient} text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-500`}>
                            {group.icon}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500"></div>
                      </div>
                    </div>

                        {/* Role Name */}
                        <h4 className={`text-lg font-bold text-center mb-3 bg-gradient-to-r ${group.gradient} bg-clip-text text-transparent`}>
                          {group.role}
                        </h4>

                        {/* Personas */}
                        <div className="space-y-2">
                          {group.personas.map((persona, i) => (
                            <div
                              key={i}
                              className={`text-center py-2 px-3 rounded-lg bg-gray-50 text-gray-700 font-medium text-sm transition-all duration-300 group-hover:bg-${group.accentColor} group-hover:shadow-sm`}
                            >
                              {persona}
                            </div>
                      ))}
                    </div>

                        {/* Animated Border */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${group.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl`}></div>
                  </motion.div>
                ))}
              </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Our <span className="text-purple-600">Pharma Commercial Platform</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                End-to-end solutions organized across three integrated engines to power your pharma commercial success
              </p>
            </div>
          </AnimatedSection>

          {/* Category A: Core Engine */}
          <AnimatedSection>
            <div className="mb-20">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border-2 border-purple-200 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">CORE ENGINE</span>
              </div>
                </motion.div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-3">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Customer Targeting</span>
                </h3>
                <p className="text-gray-600 text-lg">Foundation for precision pharma commercial intelligence</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Data Enrichment",
                    href: "#data-enrichment",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    ),
                    tagline: "Complete patient intelligence for precision targeting",
                    metric: "35x",
                    metricLabel: "Visibility Increase",
                    gradient: "from-purple-600 to-indigo-600"
                  },
                  {
                    name: "AutoML Platform",
                    href: "#automl",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    tagline: "Build ML models 70% faster with automated workflows",
                    metric: "70%",
                    metricLabel: "Faster to Deploy",
                    gradient: "from-indigo-600 to-blue-600"
                  },
                  {
                    name: "HCP Precision Targeting",
                    href: "#hcp-targeting",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    tagline: "Dynamic triggers for real-time HCP engagement",
                    metric: "Real-Time",
                    metricLabel: "Trigger Updates",
                    gradient: "from-blue-600 to-cyan-600"
                  }
                ].map((product, index) => (
                  <motion.a
                    key={index}
                    href={product.href}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = product.href;
                    }}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient}`}></div>
                    
                    {/* Background pattern on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      {/* Icon and metric */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`relative bg-gradient-to-br ${product.gradient} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        {product.icon}
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                      </div>
                        <div className="text-right">
                          <div className={`text-2xl font-extrabold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                            {product.metric}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                            {product.metricLabel}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                          {product.name}
                        </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{product.tagline}</p>

                      {/* CTA */}
                      <div className="flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-2 transition-transform duration-300">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        </div>
                      </div>

                    {/* Bottom gradient line appears on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Category B: Optimization Engine */}
          <AnimatedSection>
            <div className="mb-20">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border-2 border-blue-200 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">OPTIMIZATION ENGINE</span>
              </div>
                </motion.div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-3">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Budget & Resource Planning</span>
                </h3>
                <p className="text-gray-600 text-lg">Maximize ROI and operational efficiency</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    name: "Budget Optimization",
                    href: "#commercial-budget",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    tagline: "AI-powered ROI maximization across all channels",
                    metric: "15-25%",
                    metricLabel: "ROI Increase",
                    gradient: "from-blue-600 to-cyan-600"
                  },
                  {
                    name: "Sales Force Sizing",
                    href: "#field-force-sizing",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                    tagline: "Optimal field force structure and territory design",
                    metric: "+12%",
                    metricLabel: "Efficiency Gain",
                    gradient: "from-cyan-600 to-teal-600"
                  },
                  {
                    name: "Call Planning",
                    href: "#hcp-call-planning",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ),
                    tagline: "Strategic reach & frequency optimization",
                    metric: "Optimal",
                    metricLabel: "Reach Mix",
                    gradient: "from-teal-600 to-blue-600"
                  },
                  {
                    name: "Speaker Programs",
                    href: "#speaker-program",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    ),
                    tagline: "Maximize medical education program impact",
                    metric: "2-3x",
                    metricLabel: "Program ROI",
                    gradient: "from-blue-600 to-indigo-600"
                  }
                ].map((product, index) => (
                  <motion.a
                    key={index}
                    href={product.href}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = product.href;
                    }}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient}`}></div>
                    
                    {/* Background pattern on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      {/* Icon and metric */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`relative bg-gradient-to-br ${product.gradient} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {product.icon}
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                    </div>
                        <div className="text-right">
                          <div className={`text-2xl font-extrabold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                            {product.metric}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                            {product.metricLabel}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                      {product.name}
                    </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{product.tagline}</p>

                      {/* CTA */}
                      <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        </div>
                      </div>

                    {/* Bottom gradient line appears on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Category C: Insight & Actions Layer */}
          <AnimatedSection>
            <div className="mb-20">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border-2 border-pink-200 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">INSIGHT & ACTIONS</span>
              </div>
                </motion.div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-3">
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Decision intelligence</span>
                </h3>
                <p className="text-gray-600 text-lg">Empower teams with actionable insights</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Conversational AI",
                    href: "#pharma-byob",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    ),
                    tagline: "Natural language insights at your fingertips",
                    metric: "Instant",
                    metricLabel: "Query Response",
                    gradient: "from-pink-600 to-purple-600"
                  },
                  {
                    name: "Rep Planner",
                    href: "#rep-planner",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    ),
                    tagline: "Smart planning tools for field teams",
                    metric: "50+",
                    metricLabel: "AI Signals",
                    gradient: "from-purple-600 to-indigo-600"
                  },
                  {
                    name: "Brand Analytics",
                    href: "#brand-insights",
                    icon: (
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    ),
                    tagline: "Real-time performance monitoring & insights",
                    metric: "Live",
                    metricLabel: "Dashboards",
                    gradient: "from-indigo-600 to-blue-600"
                  }
                ].map((product, index) => (
                  <motion.a
                    key={index}
                    href={product.href}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = product.href;
                    }}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${product.gradient}`}></div>
                    
                    {/* Background pattern on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      {/* Icon and metric */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`relative bg-gradient-to-br ${product.gradient} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {product.icon}
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500"></div>
                    </div>
                        <div className="text-right">
                          <div className={`text-2xl font-extrabold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                            {product.metric}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                            {product.metricLabel}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                      {product.name}
                    </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{product.tagline}</p>

                      {/* CTA */}
                      <div className="flex items-center text-sm font-semibold text-pink-600 group-hover:translate-x-2 transition-transform duration-300">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        </div>
                      </div>

                    {/* Bottom gradient line appears on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Therapeutic Area Expertise */}
      <div id="impact" className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Expertise Across <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Complex Therapeutic Areas</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Delivering results in high-complexity disease states
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  area: "Oncology", 
                  description: "Breast, Lung & Biomarker-Driven Therapies",
                  icon: (
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {/* DNA helix representing cancer genetics */}
                      <path d="M6 3c0 0 2 2 2 5s-2 5-2 5" strokeLinecap="round"/>
                      <path d="M18 3c0 0-2 2-2 5s2 5 2 5" strokeLinecap="round"/>
                      <path d="M6 13c0 0 2 2 2 5s-2 5-2 5" strokeLinecap="round"/>
                      <path d="M18 13c0 0-2 2-2 5s2 5 2 5" strokeLinecap="round"/>
                      <line x1="8" y1="5" x2="16" y2="5" strokeLinecap="round"/>
                      <line x1="8" y1="8" x2="16" y2="8" strokeLinecap="round"/>
                      <line x1="8" y1="11" x2="16" y2="11" strokeLinecap="round"/>
                      <line x1="8" y1="15" x2="16" y2="15" strokeLinecap="round"/>
                      <line x1="8" y1="18" x2="16" y2="18" strokeLinecap="round"/>
                      <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round"/>
                    </svg>
                  ),
                  gradient: "from-purple-500 to-pink-500"
                },
                { 
                  area: "Respiratory & Immunology", 
                  description: "Asthma, COPD & Autoimmune",
                  icon: (
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {/* Lungs with bronchial tree */}
                      <path d="M12 3v5" strokeLinecap="round"/>
                      {/* Left lung */}
                      <path d="M12 8c-1 0-2 .5-3 1.5C8 10.5 7 12 7 14c0 2.5 1.5 4.5 3 5.5 1 .5 1.5.5 2 .5" strokeLinecap="round"/>
                      <path d="M10 10.5L8 12M10 13L7.5 14.5M10 15.5L8 17" strokeLinecap="round"/>
                      {/* Right lung */}
                      <path d="M12 8c1 0 2 .5 3 1.5 1 1 2 2.5 2 4.5 0 2.5-1.5 4.5-3 5.5-1 .5-1.5.5-2 .5" strokeLinecap="round"/>
                      <path d="M14 10.5L16 12M14 13L16.5 14.5M14 15.5L16 17" strokeLinecap="round"/>
                      {/* Trachea */}
                      <ellipse cx="12" cy="8" rx="1.5" ry="0.8"/>
                    </svg>
                  ),
                  gradient: "from-blue-500 to-cyan-500"
                },
                { 
                  area: "Renal & Metabolic", 
                  description: "CKD, Diabetes & Metabolic Disorders",
                  icon: (
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {/* Kidneys with ureter */}
                      {/* Left kidney */}
                      <path d="M8 5c-2 0-3.5 1.5-4 3.5C3.5 10.5 3.5 12.5 4 14c.5 1.5 1.5 2.5 3 3 1 .3 1.5.3 2 .3" strokeLinecap="round"/>
                      <ellipse cx="8.5" cy="10" rx="2.5" ry="4" strokeLinecap="round"/>
                      <path d="M9 17v4" strokeLinecap="round"/>
                      {/* Right kidney */}
                      <path d="M16 5c2 0 3.5 1.5 4 3.5.5 2 .5 4-.5 5.5-.5 1.5-1.5 2.5-3 3-1 .3-1.5.3-2 .3" strokeLinecap="round"/>
                      <ellipse cx="15.5" cy="10" rx="2.5" ry="4" strokeLinecap="round"/>
                      <path d="M15 17v4" strokeLinecap="round"/>
                      {/* Bladder connection */}
                      <path d="M9 21h6" strokeLinecap="round"/>
                      <circle cx="12" cy="21" r="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                  gradient: "from-green-500 to-emerald-500"
                },
                { 
                  area: "Cardiovascular", 
                  description: "Heart Failure & CV Conditions",
                  icon: (
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      {/* Anatomical heart with ECG wave */}
                      <path d="M12 5c-1.5-1.5-4-2-6-1-2 1-3 3-3 5 0 3 2 6 5 8.5 2 1.5 3.5 2.5 4 2.5.5 0 2-.5 4-2.5 3-2.5 5-5.5 5-8.5 0-2-1-4-3-5-2-1-4.5-.5-6 1z" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Heart chambers */}
                      <path d="M12 8v5M9.5 10.5c.5-.5 1.5-1 2.5-1s2 .5 2.5 1" strokeLinecap="round"/>
                      {/* ECG line at bottom */}
                      <path d="M4 21h3l1-2 1 4 1-4 1 2h11" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"/>
                    </svg>
                  ),
                  gradient: "from-red-500 to-pink-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`bg-gradient-to-br ${item.gradient} text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.area}</h4>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Transform Your Commercial Strategy?
              </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join leading pharmaceutical companies leveraging RX Amplify's integrated platform to accelerate brand growth, optimize resources, and deliver measurable commercial success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  Schedule a Demo
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                  Contact Sales
                </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

const RxCoreLogo = ({ size = "md", animated = true, theme = "light" }) => {
  const sizes = {
    sm: { container: "h-8 w-8", text: "text-base" },
    md: { container: "h-10 w-10", text: "text-xl" },
    lg: { container: "h-16 w-16", text: "text-3xl" },
    xl: { container: "h-24 w-24", text: "text-5xl" }
  };

  const currentSize = sizes[size];

  // Text color based on theme
  const textColor = theme === "dark"
    ? "text-white drop-shadow-lg"
    : "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600";

  const subtitleColor = theme === "dark"
    ? "text-white/90 drop-shadow-md"
    : "text-gray-600";

  return (
    <div className="flex items-center space-x-3">
      <motion.div
        className={`${currentSize.container} bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}
        animate={animated ? {
          boxShadow: [
            "0 10px 30px rgba(99, 102, 241, 0.3)",
            "0 10px 40px rgba(139, 92, 246, 0.4)",
            "0 10px 30px rgba(99, 102, 241, 0.3)"
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-0"
          animate={animated ? { opacity: [0, 0.3, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rx Symbol */}
        <div className="relative z-10">
          <motion.svg
            className={`${currentSize.container} text-white`}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* R letter */}
            <motion.path
              d="M20 25 L20 75 M20 25 L40 25 C48 25 50 30 50 37.5 C50 45 48 50 40 50 L20 50 M35 50 L50 75"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* X letter */}
            <motion.path
              d="M60 50 L80 75 M80 50 L60 75"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
            />

            {/* Decorative pulse circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={animated ? {
                scale: [0.8, 1.1, 0.8],
                opacity: [0, 0.3, 0]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={animated ? {
            x: ["-100%", "200%"],
            opacity: [0, 0.3, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="flex flex-col leading-tight"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className={`font-extrabold ${currentSize.text} ${textColor}`}>
          RX Amplify
        </span>
        {size === "xl" && (
          <span className={`text-sm font-medium tracking-wide ${subtitleColor}`}>
            Enhanced Commercial Intelligence
          </span>
        )}
      </motion.div>
    </div>
  );
};

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
          <motion.h1
                className="text-5xl font-extrabold text-gray-dark leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Maximize ROI with <span className="text-purple-600">Data-Driven Budget Optimization</span>
          </motion.h1>
          <motion.p
                className="mt-6 text-xl text-gray-medium leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Stop guessing where to allocate your commercial budget. Our <span className="font-bold text-purple-600">AI-powered optimization engine</span> analyzes HCP-level response curves to find your optimal spend—maximizing revenue while eliminating waste beyond saturation points.
          </motion.p>
            </div>

            {/* Budget Optimization Visual */}
            <div className="flex justify-center">
          <motion.div
                className="relative w-full max-w-[500px] h-96 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-200 shadow-2xl overflow-hidden p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {/* Budget Allocation Visualization */}
                <div className="flex flex-col h-full justify-center items-center">
                  <div className="text-center mb-6">
                    <div className="text-sm font-semibold text-purple-600 mb-2">Optimal Budget Allocation</div>
                    <div className="text-4xl font-bold text-purple-700">$10M → $24M</div>
                    <div className="text-xs text-gray-600">140% ROI Increase</div>
                  </div>

                  {/* Animated bars */}
                  <div className="w-full space-y-4">
                    {[
                      { label: 'Brand', value: 70, color: 'bg-purple-500' },
                      { label: 'Territory', value: 85, color: 'bg-indigo-500' },
                      { label: 'HCP', value: 95, color: 'bg-blue-500' },
                      { label: 'Rep', value: 60, color: 'bg-violet-500' }
                    ].map((item, index) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span className="font-medium">{item.label} Level</span>
                          <span>{item.value}%</span>
              </div>
                        <motion.div
                          className="h-3 bg-gray-200 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                        >
                          <motion.div
                            className={`h-full ${item.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.1, ease: 'easeOut' }}
                          />
        </motion.div>
                      </div>
                    ))}
      </div>

                  {/* Icon at bottom */}
                  <motion.div
                    className="mt-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  >
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
                  </motion.div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="absolute top-8 right-12 w-1 h-1 bg-indigo-400 rounded-full"></div>
                  <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-indigo-400 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navCategories = [
    {
      title: "Customer Targeting",
      items: [
        { name: "Data Enrichment", href: "#data-enrichment" },
        { name: "AutoML", href: "#automl" },
        { name: "HCP Precision Targeting", href: "#hcp-targeting" }
      ]
    },
    {
      title: "Commercial Budget Planner",
      items: [
        { name: "Commercial Budget Optimization", href: "#commercial-budget" },
        { name: "HCP Channel & Indication Optimizer", href: "#channel-indication" },
        { name: "Speaker Program Optimization", href: "#speaker-program" }
      ]
    },
    {
      title: "Decision Intelligence",
      items: [
        { name: "Pharma BYOB", href: "#pharma-byob" },
        { name: "REP Planner", href: "#rep-planner" },
        { name: "Brand Insights", href: "#brand-insights" }
      ]
    }
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      window.location.hash = href;
      setOpenDropdown(null);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RxCoreLogo size="sm" animated={true} />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="relative"
                onMouseEnter={() => setOpenDropdown(categoryIndex)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-300 px-4 py-2 rounded-md text-sm font-semibold"
                >
                  <span>{category.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === categoryIndex ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === categoryIndex && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn">
                    {category.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-primary transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {navCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                <div className="px-4 py-2 text-sm font-bold text-gray-900 bg-gray-50 rounded-md">
                  {category.title}
                </div>
                <div className="mt-2 space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="block px-6 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const HCPCallPlan = () => {
  const [activeTab, setActiveTab] = React.useState('sales');

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-indigo-900/50 border border-indigo-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-sm font-medium text-indigo-200">AI-Powered Sales Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                Go Beyond the Data. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Drive Every HCP Conversation with Intelligence.
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Introducing the first sales intelligence platform that transforms fragmented data into your winning strategy. Ask any question, identify top opportunities, and get personalized action plans—all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center">
                  Get Started
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Watch 2-Min Overview
                </button>
              </div>

              {/* Role Toggle */}
              <div className="bg-white/5 p-1 rounded-xl inline-flex backdrop-blur-md border border-white/10">
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'sales' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Sales Rep View
                </button>
                <button
                  onClick={() => setActiveTab('leader')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'leader' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Commercial Leader View
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">Trusted by leading pharmaceutical and life sciences innovators</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-slate-700/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Co-Pilot Demo Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="grid md:grid-cols-12 gap-0">
                {/* Sidebar */}
                <div className="md:col-span-4 bg-slate-50 border-r border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-bold text-gray-900">AI Co-Pilot</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Active Query</p>
                      <p className="text-sm text-indigo-600 font-medium">"Show me my top 5 HCP opportunities this week"</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase pl-2">Recent Insights</p>
                      {['Dr. Sarah Carter', 'Dr. Michael Johnson', 'Dr. Lisa Wang'].map((name, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all cursor-pointer group">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {name.split(' ')[1][0]}
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${i === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {i === 1 ? 'Medium' : 'High'} Impact
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-8 p-8 bg-white">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Top Opportunities Analysis</h3>
                    <div className="flex space-x-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>

                  {/* Mock Chart Area */}
                  <div className="h-64 bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border border-indigo-50 mb-6 relative">
                    <div className="absolute inset-0 flex items-end justify-around p-6">
                      {[65, 45, 75, 55, 85].map((h, i) => (
                        <div key={i} className="w-12 bg-indigo-500/20 rounded-t-lg relative group">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg transition-all duration-1000"
                            style={{ height: `${h}%` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Potential Value', value: '$1.2M', change: '+12%' },
                      { label: 'Engagement Score', value: '8.5', change: '+0.4' },
                      { label: 'Next Best Action', value: 'Visit', change: 'Urgent' }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                          <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                          <span className="text-xs font-medium text-green-600">{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Are You Navigating the Market with an <span className="text-indigo-600">Incomplete Map?</span>
              </h2>
              <p className="text-lg text-gray-600">
                Struggling with unreliable claims and EMR data full of gaps? You can't trust insights from a shaky foundation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Fragmented Data",
                  desc: "Struggling with unreliable claims and EMR data full of gaps? You can't trust insights from a shaky foundation.",
                  icon: (
                    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  )
                },
                {
                  title: "Missed Opportunities",
                  desc: "How many high-potential HCPs are hidden in your territory? Generic targeting leads to wasted time and effort.",
                  icon: (
                    <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )
                },
                {
                  title: "Ineffective Engagement",
                  desc: "Walking into meetings without knowing the best approach? One-size-fits-all messaging fails to resonate.",
                  icon: (
                    <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )
                }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Solution Steps */}
      <div className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold mb-6">
                We Turn Noise into Your <span className="text-indigo-400">Next Best Action</span>
              </h2>
            </div>

            <div className="space-y-24">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-green-500/10 rounded-bl-2xl border-b border-l border-green-500/20">
                      <span className="text-green-400 font-bold text-sm">100% confidence</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                        <span className="font-medium text-slate-300">Data Quality</span>
                        <span className="text-indigo-400 font-bold">Enriched</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Completeness</span>
                          <span className="text-white font-bold">98%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Accuracy</span>
                          <span className="text-white font-bold">99%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-1 rounded-full mb-4">Step 1</div>
                  <h3 className="text-3xl font-bold mb-6">Data Enrichment: From Fragmented to Flawless</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Our platform starts by ingesting your raw insurance claims and EMR data. Proprietary enrichment models get to work, filling critical gaps in diagnoses, treatments, and biomarker testing rates. We transform incomplete data into a single source of truth, benchmarked for national accuracy.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-1 rounded-full mb-4">Step 2</div>
                  <h3 className="text-3xl font-bold mb-6">Predictive Analytics: Uncover Your Hidden Opportunities</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    On top of this enriched data, our AI engine runs specialized models to do the heavy lifting. It identifies the highest-potential HCPs in your territory, prioritizes key oncology indications for discussion, and quantifies the potential impact of each opportunity.
                  </p>
                </div>
                <div>
                  <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                    <h4 className="text-lg font-bold mb-6 border-b border-slate-700 pb-4">Top Territory Opportunities</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Dr. Sarah Carter', impact: 'High', color: 'bg-green-500' },
                        { name: 'Dr. Michael Johnson', impact: 'Medium', color: 'bg-yellow-500' },
                        { name: 'Dr. Lisa Wang', impact: 'High', color: 'bg-green-500' }
                      ].map((hcp, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600 hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-slate-300">
                              {hcp.name.split(' ')[1][0]}
                            </div>
                            <span className="font-medium">{hcp.name}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${hcp.color}`}>
                            {hcp.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                    <h4 className="text-lg font-bold mb-6 border-b border-slate-700 pb-4">Recommended Actions</h4>
                    <div className="space-y-4">
                      {[
                        { action: 'Discuss New Clinical Data', detail: 'High impact - In-Person', icon: '📊' },
                        { action: 'Share Patient Support Program', detail: 'Medium impact - Email', icon: '📧' },
                        { action: 'Address Dosing Concerns', detail: 'High impact - In-Person', icon: '💊' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <p className="font-bold text-white">{item.action}</p>
                            <p className="text-sm text-slate-400">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-1 rounded-full mb-4">Step 3</div>
                  <h3 className="text-3xl font-bold mb-6">Action Planning: Know What to Do, Say, and Expect</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Identifying an opportunity is only half the battle. Our platform provides recommended actions and key talking points tailored to each HCP's profile and past behavior. We even assess the expected impact of these actions, directly linking your efforts to outcomes.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-1 rounded-full mb-4">Step 4</div>
                  <h3 className="text-3xl font-bold mb-6">Conversational Co-Pilot: Your Insights, On Command</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    All this power is at your fingertips through our intuitive conversational AI. Simply ask questions in your own words, by voice or text. Get instant analytics on market share, HCP trends, or territory performance. Your data is no longer a static report.
                  </p>
                </div>
                <div>
                  <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs">
                          "What's my market share for Drug X last quarter?"
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-slate-700 text-white p-3 rounded-2xl rounded-tl-none max-w-xs">
                          <p className="font-bold mb-1">Market Share: 24.5%</p>
                          <p className="text-green-400 text-sm">(+2.3% QoQ)</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs">
                          "Show me biomarker Y testing rates for my top 10 HCPs"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything You Need to Lead Your Territory</h2>
              <p className="text-xl text-gray-600">Built on a Foundation of Proprietary AI</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "The Conversational Co-Pilot",
                  desc: "Your 24/7 analyst. Ask complex questions and get immediate, visual answers. Accessible on any device, anytime.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  )
                },
                {
                  title: "AI-Powered Opportunity Engine",
                  desc: "Receive a dynamic, personalized list of your top HCP opportunities, updated continuously based on growth potential.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  )
                },
                {
                  title: "Strategic Action Planner",
                  desc: "For each opportunity, get a clear plan with indication priorities and evidence-based talking points.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  )
                },
                {
                  title: "Our AutoML Platform",
                  desc: "We've developed a proprietary AutoML platform that dramatically accelerates the training, validation, and deployment of our machine learning models.",
                  icon: (
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  )
                },
                {
                  title: "Intelligent Agent Architecture",
                  desc: "This isn't just a chatbot. It's a true AI agent. In the background, multiple specialized ML models work in concert.",
                  icon: (
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  )
                },
                {
                  title: "AI Architecture Flow",
                  desc: "Raw Data → Enrichment → Models → Analysis → Agent → Insights. A complete pipeline for actionable intelligence.",
                  icon: (
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  )
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="mb-6 bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">The Future of Pharma Sales is Here</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "Boost Sales Rep Efficiency", desc: "Spend less time on data analysis and more time building relationships." },
                { title: "Increase HCP Engagement", desc: "Approach every conversation with personalized, relevant insights." },
                { title: "Exceed Your Sales Goals", desc: "Systematically identify and act on the highest-impact opportunities." },
                { title: "Lead with Confidence", desc: "Make every decision backed by clean, reliable data and predictive analytics." }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-extrabold text-white mb-8">Ready to Empower Your Sales Team with AI?</h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              See the platform in action. Schedule a demo with one of our product experts today.
            </p>
            <button className="bg-white text-indigo-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Request Demo
            </button>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Brand Insights - Narrative-First Component
const BrandInsights = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                className="text-5xl font-extrabold text-gray-dark leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Real-Time Brand Intelligence <span className="text-purple-600">Across Every Level</span>
              </motion.h1>
              <motion.p
                className="mt-6 text-xl text-gray-medium leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                A comprehensive <span className="font-bold text-purple-600">reporting and analytics layer</span> that transforms enriched data into actionable insights. Track key performance metrics—<span className="font-semibold">NPS, TRx, NRx</span>—from regional territories to national headquarters, with AI-powered predictions guiding every decision.
              </motion.p>
          <motion.div
                className="mt-8 grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  { 
                    label: 'HCP Trends',
                    icon: (
                      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Patient Flow',
                    icon: (
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                    )
                  },
                  { 
                    label: 'AI Predictions',
                    icon: (
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border-2 border-purple-100 shadow-sm text-center">
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <div className="text-sm font-semibold text-gray-700">{item.label}</div>
              </div>
                ))}
          </motion.div>
            </div>
          
            {/* Live Dashboard Visual */}
          <motion.div
              className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-200 shadow-2xl p-6 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-gray-600">LIVE PERFORMANCE METRICS</div>
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-emerald-600 font-semibold">Live</span>
                    </div>
                  </div>
                
                {/* Mini KPI Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'NPS', value: '28.4%', trend: '+2.3%', color: 'purple' },
                    { label: 'TRx', value: '142K', trend: '+5.1%', color: 'blue' },
                    { label: 'NRx', value: '18.2K', trend: '+8.7%', color: 'emerald' }
                  ].map((kpi, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-slate-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <div className="text-xs text-gray-500 font-semibold mb-1">{kpi.label}</div>
                      <div className={`text-lg font-bold text-${kpi.color}-600`}>{kpi.value}</div>
                      <div className="text-xs text-emerald-600 font-semibold">{kpi.trend}</div>
                    </motion.div>
              ))}
            </div>

                {/* Mini Trend Chart */}
                <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl p-4 border border-purple-100">
                  <div className="text-xs font-semibold text-gray-600 mb-3">Regional Performance Trends</div>
                  <div className="flex items-end justify-between h-20 gap-2">
                    {[65, 72, 68, 78, 85, 82, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Badge */}
              <motion.div
                className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI-Powered
              </motion.div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Powered By Data & AI Layer */}
      <div className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span className="text-sm font-bold text-purple-700">Powered by Unified Data Layer & AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Built on a Foundation of Intelligence
              </h2>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                Every metric, trend, and insight flows from our integrated data enrichment pipeline, predictive models, and HCP targeting engine.
              </p>
            </motion.div>

            {/* Data Flow Architecture */}
            <div className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-8 md:p-12 border-2 border-purple-100 shadow-xl">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                { 
                  title: 'Data Enrichment', 
                    icon: (
                      <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    ),
                    desc: 'Claims, CRM, labs unified into comprehensive patient pathways'
                  },
                  { 
                    title: 'AI Predictions', 
                    icon: (
                      <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    desc: 'Forecasting models predict HCP behavior and patient demand'
                  },
                  { 
                    title: 'HCP Targeting', 
                    icon: (
                      <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    desc: 'Optimization engine drives territory-level resource allocation'
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                    initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-medium">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Arrow Down to Reporting Layer */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center py-6"
              >
                <svg className="w-8 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-8 8h5v8h6v-8h5z"/>
                </svg>
                <div className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  REPORTING & ANALYTICS LAYER
                  </div>
              </motion.div>

              {/* Output Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    metric: 'NPS / TRx / NRx',
                    icon: (
                      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    )
                  },
                  { 
                    metric: 'HCP Trends',
                    icon: (
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )
                  },
                  { 
                    metric: 'Patient Flow',
                    icon: (
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  { 
                    metric: 'Regional Insights',
                    icon: (
                      <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    )
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center border border-indigo-100"
                  >
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <div className="text-xs font-bold text-gray-700">{item.metric}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights by Persona & Region */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                <span className="text-sm font-bold text-indigo-700">Regional to National Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Insights Tailored by Persona
              </h2>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                Track <span className="font-semibold text-purple-600">NPS, TRx, NRx</span> and HCP/patient trends across every organizational level—from territory to HQ.
              </p>
            </motion.div>

            <div className="space-y-12">
              {/* Rep / Field Rep */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 border-2 border-blue-200 shadow-xl"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
            </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-dark">Field Rep</h3>
                        <p className="text-sm text-blue-600 font-semibold">Individual Rep View</p>
                      </div>
                    </div>
                    <p className="text-gray-medium text-lg mb-6">
                      Daily action plan with priority HCPs, call targets, and individual <span className="font-semibold text-blue-600">NPS, TRx, NRx</span> performance.
                    </p>
                    
                    {/* Rep Personal KPIs */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: 'My NPS', value: '21.8%', trend: '+2.1%', color: 'bg-blue-100 text-blue-700' },
                        { label: 'My TRx', value: '3.2K', trend: '+5.8%', color: 'bg-cyan-100 text-cyan-700' },
                        { label: 'My NRx', value: '425', trend: '+7.2%', color: 'bg-emerald-100 text-emerald-700' }
                      ].map((kpi, i) => (
                        <div key={i} className={`${kpi.color} rounded-xl p-3`}>
                          <div className="text-xs font-bold mb-1">{kpi.label}</div>
                          <div className="text-lg font-bold">{kpi.value}</div>
                          <div className="text-xs font-semibold text-emerald-600">{kpi.trend}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {['Today\'s call targets', 'Priority HCP list', 'Next best actions', 'Daily activity tracker'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Today's Priority HCPs */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs font-bold text-gray-700">TODAY'S PRIORITY HCPs</div>
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">8 visits</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Dr. Anderson', specialty: 'Oncology', score: 92, status: 'High' },
                          { name: 'Dr. Martinez', specialty: 'Oncology', score: 88, status: 'High' },
                          { name: 'Dr. Johnson', specialty: 'Internal Med', score: 76, status: 'Med' },
                          { name: 'Dr. Williams', specialty: 'Cardiology', score: 71, status: 'Med' },
                        ].map((doc, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-sm text-gray-800">{doc.name}</div>
                                <div className="text-xs text-gray-500">{doc.specialty}</div>
                      </div>
                              <div className={`text-xs px-2 py-1 rounded-full font-bold ${
                                doc.status === 'High' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {doc.score}
                              </div>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                                whileInView={{ width: `${doc.score}%` }}
                          viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                    <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-700 mb-4">MY WEEKLY PROGRESS</div>
                      <div className="space-y-3">
                        {[
                          { metric: 'Calls Completed', value: 28, target: 35, percent: 80 },
                          { metric: 'HCPs Engaged', value: 22, target: 25, percent: 88 },
                          { metric: 'Samples Delivered', value: 145, target: 150, percent: 97 }
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">{item.metric}</span>
                              <span className="text-gray-500">{item.value} / {item.target}</span>
                </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.percent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                              />
                </div>
                </div>
                        ))}
              </div>
            </div>
        </div>
      </div>
              </motion.div>

              {/* Territory Manager */}
          <motion.div
                initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 border-2 border-purple-200 shadow-xl"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-dark">Territory Manager</h3>
                        <p className="text-sm text-purple-600 font-semibold">Territory-Level View</p>
                      </div>
                    </div>
                    <p className="text-gray-medium text-lg mb-6">
                      Track territory-specific <span className="font-semibold text-purple-600">NPS, TRx, NRx</span> alongside HCP engagement and patient flow metrics.
                    </p>
                    
                    {/* Territory KPIs */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: 'NPS', value: '24.2%', trend: '+1.8%', color: 'bg-purple-100 text-purple-700' },
                        { label: 'TRx', value: '8.2K', trend: '+4.3%', color: 'bg-blue-100 text-blue-700' },
                        { label: 'NRx', value: '1.1K', trend: '+6.1%', color: 'bg-emerald-100 text-emerald-700' }
                      ].map((kpi, i) => (
                        <div key={i} className={`${kpi.color} rounded-xl p-3`}>
                          <div className="text-xs font-bold mb-1">{kpi.label}</div>
                          <div className="text-lg font-bold">{kpi.value}</div>
                          <div className="text-xs font-semibold text-emerald-600">{kpi.trend}</div>
                        </div>
                      ))}
            </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {['HCP opportunity scores', 'Patient drop-off alerts', 'Weekly territory trends', 'AI-powered daily actions'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                          <span>{item}</span>
                      </div>
                      ))}
                      </div>
                    </div>
                  
                  {/* HCP Trend Chart + Patient Flow */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs font-bold text-gray-700">HCP PRESCRIBING TRENDS (90 Days)</div>
                        <div className="text-xs text-emerald-600 font-semibold">↑ 12.4%</div>
                  </div>
                      <div className="relative h-32">
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          <motion.path
                            d="M0,80 L50,72 L100,75 L150,65 L200,58 L250,45 L300,38"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#6366F1" />
                            </linearGradient>
                          </defs>
                          <motion.path
                            d="M0,80 L50,72 L100,75 L150,65 L200,58 L250,45 L300,38 L300,100 L0,100 Z"
                            fill="url(#gradient2)"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.3 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                          />
                          <defs>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-700 mb-4">PATIENT FUNNEL - TERRITORY</div>
                      {[
                        { stage: 'Diagnosed', value: 420, percent: 100 },
                        { stage: 'Tested', value: 273, percent: 65 },
                        { stage: 'Eligible', value: 189, percent: 45 },
                        { stage: 'On Therapy', value: 105, percent: 25 }
                  ].map((stage, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">{stage.stage}</span>
                            <span className="font-bold text-purple-600">{stage.value}</span>
                      </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stage.percent}%` }}
                          viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Area Manager */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 border-2 border-indigo-200 shadow-xl"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                          </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-dark">Area Manager</h3>
                        <p className="text-sm text-indigo-600 font-semibold">Regional View</p>
                      </div>
                    </div>
                    <p className="text-gray-medium text-lg mb-6">
                      Monitor <span className="font-semibold text-indigo-600">regional NPS, TRx, NRx</span> across multiple territories. Track HCP engagement patterns and identify resource optimization opportunities.
                    </p>
                    
                    {/* Regional Aggregate KPIs */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: 'NPS', value: '26.8%', trend: '+2.1%', color: 'bg-indigo-100 text-indigo-700' },
                        { label: 'TRx', value: '32.5K', trend: '+3.8%', color: 'bg-blue-100 text-blue-700' },
                        { label: 'NRx', value: '4.3K', trend: '+5.4%', color: 'bg-emerald-100 text-emerald-700' }
                      ].map((kpi, i) => (
                        <div key={i} className={`${kpi.color} rounded-xl p-3`}>
                          <div className="text-xs font-bold mb-1">{kpi.label}</div>
                          <div className="text-lg font-bold">{kpi.value}</div>
                          <div className="text-xs font-semibold text-emerald-600">{kpi.trend}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {['Territory comparisons', 'Rep performance benchmarks', 'Regional HCP trends', 'Resource allocation insights'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          <span>{item}</span>
                  </div>
                      ))}
                      </div>
                      </div>

                  <div className="space-y-4">
                    {/* Multi-Territory Trends */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                      <div className="text-xs font-bold text-gray-700 mb-4">MULTI-TERRITORY NRx TRENDS</div>
                      <div className="relative h-32 mb-4">
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          {/* Territory 1 */}
                          <motion.path
                            d="M0,60 L50,55 L100,58 L150,50 L200,45 L250,38 L300,32"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                          {/* Territory 2 */}
                          <motion.path
                            d="M0,70 L50,68 L100,65 L150,60 L200,58 L250,52 L300,48"
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                            transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
                          />
                          {/* Territory 3 */}
                          <motion.path
                            d="M0,80 L50,78 L100,76 L150,72 L200,70 L250,65 L300,60"
                            fill="none"
                            stroke="#A78BFA"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
                          />
                        </svg>
                    </div>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-indigo-500"></div>
                          <span className="text-gray-600">Territory A</span>
                      </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-purple-500" style={{borderTop: '2px dashed'}}></div>
                          <span className="text-gray-600">Territory B</span>
                    </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-purple-300"></div>
                          <span className="text-gray-600">Territory C</span>
                  </div>
                      </div>
                    </div>

                    {/* Regional HCP Performance */}
                    <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-700 mb-4">HCP ENGAGEMENT BY TERRITORY</div>
                      {[
                        { territory: 'Territory A', hcps: 142, engagement: 88 },
                        { territory: 'Territory B', hcps: 128, engagement: 76 },
                        { territory: 'Territory C', hcps: 156, engagement: 82 },
                        { territory: 'Territory D', hcps: 134, engagement: 71 }
                      ].map((t, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700">{t.territory}</span>
                            <span className="font-bold text-indigo-600">{t.hcps} HCPs</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${t.engagement}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* HQ / Strategic */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-12 border-2 border-purple-200 shadow-xl"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-dark">HQ Leadership</h3>
                        <p className="text-sm text-purple-600 font-semibold">National View</p>
                      </div>
                    </div>
                    <p className="text-gray-medium text-lg mb-6">
                      Track <span className="font-semibold text-purple-600">national NPS, TRx, NRx</span> trends, competitive dynamics, and AI-powered market forecasts across all regions.
                    </p>
                    
                    {/* National KPIs */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: 'NPS', value: '28.4%', trend: '+2.3%', color: 'bg-purple-100 text-purple-700' },
                        { label: 'TRx', value: '142K', trend: '+5.1%', color: 'bg-blue-100 text-blue-700' },
                        { label: 'NRx', value: '18.2K', trend: '+8.7%', color: 'bg-emerald-100 text-emerald-700' }
                      ].map((kpi, i) => (
                        <div key={i} className={`${kpi.color} rounded-xl p-3`}>
                          <div className="text-xs font-bold mb-1">{kpi.label}</div>
                          <div className="text-lg font-bold">{kpi.value}</div>
                          <div className="text-xs font-semibold text-emerald-600">{kpi.trend}</div>
                  </div>
                      ))}
                      </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {['Market share forecasting', 'Competitive intelligence', 'Regional ROI modeling', 'Patient demand predictions'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                          <span>{item}</span>
                      </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* National Market Share Trend */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                      <div className="text-xs font-bold text-gray-700 mb-4">NATIONAL NPS TREND (12 Months)</div>
                      <div className="relative h-32 mb-4">
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          {/* Market Share Trend */}
                          <motion.path
                            d="M0,85 L25,82 L50,78 L75,75 L100,72 L125,68 L150,65 L175,62 L200,58 L225,54 L250,50 L275,46 L300,42"
                            fill="none"
                            stroke="url(#gradientNPS)"
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                          <defs>
                            <linearGradient id="gradientNPS" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                          <motion.path
                            d="M0,85 L25,82 L50,78 L75,75 L100,72 L125,68 L150,65 L175,62 L200,58 L225,54 L250,50 L275,46 L300,42 L300,100 L0,100 Z"
                            fill="url(#gradientNPSFill)"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                          />
                          <defs>
                            <linearGradient id="gradientNPSFill" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Q1</span>
                        <span>Q2</span>
                        <span>Q3</span>
                        <span>Q4</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-600">AI Forecast:</span>
                        <span className="text-sm font-bold text-purple-600">31.2% by Q1 next year</span>
                    </div>
                  </div>

                    {/* Regional Roll-up */}
                    <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm">
                      <div className="text-xs font-bold text-gray-700 mb-4">REGIONAL PERFORMANCE SUMMARY</div>
                      {[
                        { region: 'Northeast', nps: 32.1, trx: '45K', trend: '+5.2%' },
                        { region: 'Southeast', nps: 26.4, trx: '38K', trend: '+8.4%' },
                        { region: 'Midwest', nps: 25.8, trx: '28K', trend: '+3.1%' },
                        { region: 'West', nps: 29.7, trx: '31K', trend: '+6.7%' }
                      ].map((r, i) => (
                        <div key={i} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-700">{r.region}</span>
                            <span className="text-xs font-bold text-emerald-600">{r.trend}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                              <span className="text-gray-500">NPS:</span>
                              <span className="font-bold text-purple-600 ml-1">{r.nps}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">TRx:</span>
                              <span className="font-bold text-indigo-600 ml-1">{r.trx}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>


      {/* Core Metrics Dashboard */}
      <div className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span className="text-sm font-bold text-purple-700">Key Performance Indicators</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Track What Matters Most
              </h2>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                Monitor <span className="font-bold text-purple-600">NPS, TRx, NRx</span> alongside patient flows and HCP behaviors—aggregated by time, region, HCP, and hospital.
              </p>
            </motion.div>

            {/* KPI Grid with Examples */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  title: 'Market Performance',
                  kpis: ['New Patient Share (NPS)', 'Total Prescriptions (TRx)', 'New Prescriptions (NRx)', 'Drop-off Rates'],
                  icon: (
                    <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  ),
                  color: 'border-purple-200 bg-purple-50'
                },
                { 
                  title: 'Patient Flow Metrics',
                  kpis: ['Eligible Patients', 'Biomarker Testing Rates', 'Staging Distribution', 'Treatment Initiation'],
                  icon: (
                    <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                  ),
                  color: 'border-indigo-200 bg-indigo-50'
                },
                { 
                  title: 'HCP Intelligence',
                  kpis: ['HCP Segmentation', 'Adoption Patterns', 'Prescriber Velocity', 'Opportunity Scores'],
                  icon: (
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  color: 'border-blue-200 bg-blue-50'
                }
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`${section.color} rounded-2xl p-6 border-2`}
                >
                  <div className="mb-4">{section.icon}</div>
                  <h3 className="text-lg font-bold text-gray-dark mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.kpis.map((kpi, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0"></div>
                        <span>{kpi}</span>
                  </div>
                    ))}
                </div>
                </motion.div>
              ))}
              </div>

            {/* Example Dashboard: Patient & HCP Trends */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-8 md:p-12 border-2 border-purple-200 shadow-2xl"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-dark mb-2">Example: Patient & HCP Analytics Dashboard</h3>
                <p className="text-gray-medium">Real-time reporting with AI-powered insights and trend projections</p>
                  </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Patient Funnel */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-gray-700">PATIENT FUNNEL ANALYSIS</div>
                    <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">↑ 15% vs LM</div>
                </div>
                  <div className="space-y-4">
                    {[
                      { stage: 'Diagnosed', value: 8420, percent: 100, color: 'from-purple-600 to-purple-500' },
                      { stage: 'Biomarker Tested', value: 5895, percent: 70, color: 'from-purple-500 to-indigo-500' },
                      { stage: 'Eligible', value: 3536, percent: 42, color: 'from-indigo-500 to-blue-500' },
                      { stage: 'On Therapy', value: 2357, percent: 28, color: 'from-blue-500 to-cyan-500' }
                    ].map((stage, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-700">{stage.stage}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">{stage.value.toLocaleString()} pts</span>
                            <span className="text-xs font-bold text-purple-600">{stage.percent}%</span>
                      </div>
                        </div>
                        <div className="h-10 bg-gray-100 rounded-xl overflow-hidden shadow-sm relative">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stage.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                            className={`h-full bg-gradient-to-r ${stage.color} flex items-center justify-end pr-3`}
                          >
                            {stage.percent > 15 && (
                              <span className="text-white text-xs font-bold">{stage.percent}%</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">AI Insight:</span>
                    <span className="text-xs text-purple-600 font-semibold">35% testing gap opportunity</span>
                  </div>
              </div>

                {/* HCP Prescribing Trends */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-gray-700">HCP PRESCRIBING VELOCITY</div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Top 25%</div>
                  </div>
                  
                  {/* Trend Line Chart */}
                  <div className="mb-6">
                    <div className="relative h-32 bg-gradient-to-b from-indigo-50 to-white rounded-xl p-4">
                      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <motion.path
                          d="M0,70 L30,68 L60,65 L90,60 L120,58 L150,52 L180,48 L210,42 L240,38 L270,32 L300,28"
                          fill="none"
                          stroke="url(#gradientHCP)"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <defs>
                          <linearGradient id="gradientHCP" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                        {/* Shaded area under curve */}
                        <motion.path
                          d="M0,70 L30,68 L60,65 L90,60 L120,58 L150,52 L180,48 L210,42 L240,38 L270,32 L300,28 L300,100 L0,100 Z"
                          fill="url(#gradientHCPFill)"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                        />
                        <defs>
                          <linearGradient id="gradientHCPFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                    </svg>
                  </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                </div>
                  </div>

                  {/* HCP Breakdown */}
                  <div className="space-y-3">
                    {[
                      { segment: 'High Adopters', count: 142, percent: 35 },
                      { segment: 'Moderate', count: 186, percent: 46 },
                      { segment: 'Low Adopters', count: 78, percent: 19 }
                    ].map((seg, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-xs font-medium text-gray-700 w-28">{seg.segment}</div>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${seg.percent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                      </div>
                        </div>
                        <div className="text-xs font-bold text-indigo-600 ml-3">{seg.count}</div>
                      </div>
                  ))}
                  </div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Regional Intelligence */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span className="text-sm font-bold text-purple-700">Geographic Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Regional Performance at a Glance
              </h2>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                Track <span className="font-semibold text-purple-600">NPS, TRx, NRx</span> trends across regions with localized insights for every market.
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="grid lg:grid-cols-5 gap-6 mb-8">
                {[
                  { region: 'Northeast', nps: 32.1, trend: '+5.2%', score: 85 },
                  { region: 'Southeast', nps: 26.4, trend: '+8.4%', score: 68 },
                  { region: 'Midwest', nps: 25.8, trend: '+3.1%', score: 72 },
                  { region: 'West', nps: 29.7, trend: '+6.7%', score: 78 },
                  { region: 'Southwest', nps: 22.3, trend: '+12.3%', score: 62 },
                  ].map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-sm font-semibold text-white/80 mb-2">{r.region}</div>
                    <div className="text-3xl font-bold mb-1">{r.nps}%</div>
                    <div className="text-xs text-white/60 mb-2">NPS</div>
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-300 text-xs font-bold">{r.trend}</div>
                      <div className="text-xs text-white/60">Score: {r.score}</div>
                      </div>
                    <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${r.score}%` }}
                          viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                        />
                      </div>
                  </motion.div>
                  ))}
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
                {[
                  { 
                    label: 'Market Share by Region', 
                    desc: 'NPS, TRx, NRx tracked regionally',
                    icon: (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'HCP Trends by Geography', 
                    desc: 'Prescriber patterns and adoption',
                    icon: (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Patient Flow by Market', 
                    desc: 'Regional funnel analytics',
                    icon: (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-semibold text-white mb-1">{item.label}</div>
                      <div className="text-xs text-white/70">{item.desc}</div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
        </div>
      </div>

    </div>
  );
};

const App = () => {
  const [isROIOptimizationActive, setIsROIOptimizationActive] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState('home');

  // Handle navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'data-enrichment' || hash === 'automl' || hash === 'hcp-targeting' || hash === 'pharma-byob' || hash === 'speaker-program' || hash === 'commercial-budget' || hash === 'field-force-sizing' || hash === 'hcp-call-plan' || hash === 'rep-planner' || hash === 'channel-indication' || hash === 'brand-insights') {
        setCurrentPage(hash);
      } else if (hash === '') {
        setCurrentPage('home');
      } else {
        setCurrentPage('home');
      }
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show landing page by default
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <RxCoreLandingPage />
        <Footer />
      </div>
    );
  }

  // If we're on data enrichment page, render only that
  if (currentPage === 'data-enrichment') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="data-enrichment">
          <DataEnrichment />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on AutoML page, render only that
  if (currentPage === 'automl') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="automl">
          <AutoML />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on HCP Targeting page, render only that
  if (currentPage === 'hcp-targeting') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="hcp-targeting">
          <HCPTargeting />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on Pharma BYOB page, render only that
  if (currentPage === 'pharma-byob') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="pharma-byob">
          <PharmaBYOB />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on Channel & Indication Optimizer page, render only that
  if (currentPage === 'channel-indication') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="channel-indication">
          <HCPChannelIndicationOptimizer />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on Speaker Program page, render only that
  if (currentPage === 'speaker-program') {
    return (
      <div className="min-h-screen bg-gray-light font-sans">
        <Navbar />
        <div id="speaker-program">
          <SpeakerProgramOptimization />
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPage === 'hcp-call-plan') {
    return (
      <div className="font-sans text-gray-900 antialiased">
        <Navbar />
        <HCPCallPlan />
      </div>
    );
  }

  // If we're on Rep Planner page, render only that
  if (currentPage === 'rep-planner') {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <div id="rep-planner">
          <RepPlannerLandingPage />
        </div>
        <Footer />
      </div>
    );
  }

  // If we're on Brand Insights page, render only that
  if (currentPage === 'brand-insights') {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <div id="brand-insights">
          <BrandInsights />
        </div>
        <Footer />
      </div>
    );
  }

  // Budget Cascade Component - shows the flow from Brand to Rep level
  const BudgetCascade = () => {
    const cascadeLevels = [
    {
        level: "Brand",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
        description: "Overall brand-level budget allocation",
        question: "How much should we invest in this brand?",
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700"
      },
      {
        level: "Territory",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
        description: "Territory-level spend optimization",
        question: "Which territories need more/less investment?",
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-700"
      },
      {
        level: "HCP",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
        description: "HCP-level saturation analysis",
        question: "Where is each HCP on their response curve?",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700"
      },
      {
        level: "Rep",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
        ),
        description: "Rep allocation & call planning",
        question: "How should reps prioritize their time?",
        color: "from-violet-500 to-violet-600",
        bgColor: "bg-violet-50",
        borderColor: "border-violet-200",
        textColor: "text-violet-700"
      }
    ];

  return (
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            The Budget Cascade
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            We build response curves at the HCP level, then aggregate up to give you territory and brand-level insights.
          </p>
        </div>

        {/* Cascade Visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main cascade row */}
          <div className="grid grid-cols-4 gap-4 relative">
            {cascadeLevels.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector arrow (except for first item) */}
                {index > 0 && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-gray-300 hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                <div className={`${item.bgColor} ${item.borderColor} border-2 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${item.textColor} mb-2`}>{item.level} Level</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="bg-white/60 rounded-lg p-3 border border-white">
                    <p className="text-xs text-gray-500 italic">"{item.question}"</p>
                  </div>
                </div>
              </motion.div>
                      ))}
                    </div>

          {/* Aggregation indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl flex items-center gap-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="font-medium">We aggregate HCP-level insights upward to answer brand-level budget questions</span>
                  </div>
          </motion.div>
                </div>
              </div>
    );
  };

  // What-If Scenario Calculator
  const WhatIfCalculator = () => {
    const [spendChange, setSpendChange] = React.useState(0);

    // Calculate expected outcomes based on spend change
    const calculateOutcome = (change) => {
      // Diminishing returns model
      const baseROI = 2.4;
      const currentSpend = 10; // $10M baseline
      const newSpend = currentSpend * (1 + change / 100);

      // Response curve logic - diminishing returns
      let roiMultiplier;
      if (change < -20) {
        roiMultiplier = 1.15; // Under-spending, high marginal ROI
      } else if (change < 0) {
        roiMultiplier = 1.08;
      } else if (change < 20) {
        roiMultiplier = 0.95; // Slight diminishing returns
      } else if (change < 50) {
        roiMultiplier = 0.75; // More diminishing returns
      } else {
        roiMultiplier = 0.5; // Strong diminishing returns
      }

      const expectedROI = baseROI * roiMultiplier;
      const expectedRevenue = newSpend * expectedROI;
      const incrementalRevenue = expectedRevenue - (currentSpend * baseROI);

      return {
        newSpend: newSpend.toFixed(1),
        expectedROI: expectedROI.toFixed(2),
        expectedRevenue: expectedRevenue.toFixed(1),
        incrementalRevenue: incrementalRevenue.toFixed(1),
        status: change < -10 ? 'under' : change > 30 ? 'over' : 'optimal'
      };
    };

    const outcome = calculateOutcome(spendChange);

    return (
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            What If You Changed Your Spend?
                </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Use the simulator below to see the expected impact of budget changes.
                </p>
              </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
            {/* Slider Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-medium">Decrease Spend</span>
                <span className="text-white text-2xl font-bold">
                  {spendChange > 0 ? '+' : ''}{spendChange}%
                </span>
                <span className="text-slate-400 font-medium">Increase Spend</span>
              </div>

              <input
                type="range"
                min="-50"
                max="100"
                value={spendChange}
                onChange={(e) => setSpendChange(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                style={{
                  background: `linear-gradient(to right, 
                    #a855f7 0%, 
                    #a855f7 ${(spendChange + 50) / 1.5}%, 
                    #334155 ${(spendChange + 50) / 1.5}%, 
                    #334155 100%)`
                }}
              />

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
                <span>+100%</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                <div className="text-slate-400 text-sm mb-1">New Spend</div>
                <div className="text-white text-2xl font-bold">${outcome.newSpend}M</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                <div className="text-slate-400 text-sm mb-1">Expected ROI</div>
                <div className={`text-2xl font-bold ${
                  outcome.status === 'optimal' ? 'text-purple-400' : 
                  outcome.status === 'under' ? 'text-indigo-400' : 'text-amber-400'
                }`}>{outcome.expectedROI}x</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                <div className="text-slate-400 text-sm mb-1">Expected Revenue</div>
                <div className="text-white text-2xl font-bold">${outcome.expectedRevenue}M</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                <div className="text-slate-400 text-sm mb-1">Δ Revenue</div>
                <div className={`text-2xl font-bold ${
                  parseFloat(outcome.incrementalRevenue) >= 0 ? 'text-purple-400' : 'text-rose-400'
                }`}>
                  {parseFloat(outcome.incrementalRevenue) >= 0 ? '+' : ''}{outcome.incrementalRevenue}M
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
              outcome.status === 'optimal' ? 'bg-purple-500/20 border border-purple-500/30' :
              outcome.status === 'under' ? 'bg-indigo-500/20 border border-indigo-500/30' :
              'bg-amber-500/20 border border-amber-500/30'
            }`}>
              {outcome.status === 'optimal' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  <span className="text-purple-300 font-medium">Optimal Zone — Balanced spend with strong ROI</span>
                </>
              )}
              {outcome.status === 'under' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                  <span className="text-indigo-300 font-medium">Under-invested — High mROI opportunity, consider increasing spend</span>
                </>
              )}
              {outcome.status === 'over' && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                  <span className="text-amber-300 font-medium">Diminishing Returns — Past saturation point, reallocate to higher-potential areas</span>
                </>
              )}
                      </div>
                      </div>
                    </div>
              </div>
    );
  };
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <div id="commercial-budget" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Section 1: Budget Cascade - How we approach the problem */}
        <AnimatedSection>
          <BudgetCascade />
          </AnimatedSection>

        {/* Section 2: What-If Calculator - Interactive exploration */}
          <AnimatedSection>
          <WhatIfCalculator />
        </AnimatedSection>

        {/* Section 3: The Core Insight - Response Curves */}
        <AnimatedSection>
          <div className="mb-20">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                The Core Insight
              </span>
              <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
                Finding the Optimal Point on the Curve
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Every brand has a spend-response curve. We help you find the sweet spot — where you're not leaving money on the table, and not burning cash past saturation.
              </p>
            </div>
          </div>
            <ROISpendAdjustment />
          </AnimatedSection>

        {/* Section 4: Drill-down - Response Curves */}
          <AnimatedSection>
          <div className="mt-20">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Drill Down: HCP Level
              </span>
              <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
                How We Build the Response Curve
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We model saturation at the individual HCP level, then aggregate up. Different HCPs have different response patterns.
              </p>
            </div>
            <ResponseCurves isROIOptimizationActive={isROIOptimizationActive} />
          </div>
          </AnimatedSection>

        {/* Section 5: Territory & Rep Allocation */}
          <AnimatedSection>
          <div id="field-force-sizing" className="mt-20">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Execution Layer
              </span>
              <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
                From Insights to Rep Allocation
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Once we know the optimal spend by territory, we translate that into actionable rep allocation and call planning.
              </p>
            </div>
              <FieldForceSizing />
            </div>
          </AnimatedSection>

        {/* Next Step: Channel & Indication Optimizer */}
        <AnimatedSection>
          <div className="mt-20 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                  <span>→</span> Continue Your Optimization Journey
        </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Beyond Visit Frequency: Channel & Indication Optimization
                </h3>
                <p className="text-gray-600 mb-4">
                  Now that you know how much to spend, discover <strong>which channels</strong> give the best ROI and <strong>what indications</strong> to prioritize for each HCP.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm">
                    <span>📡</span> Channel Optimization
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-100 text-pink-700 text-sm">
                    <span>🎯</span> Indication Prioritization
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="#channel-indication"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Explore Channel & Indication Optimizer
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Final CTA Section */}
        <AnimatedSection>
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Ready to Optimize Your Next Budget Cycle?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              Stop guessing. Start with data-driven confidence about exactly where your spend should go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
        </div>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
};

export default App;