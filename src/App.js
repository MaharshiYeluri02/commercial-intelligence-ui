import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer';

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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          '0 0 0 0 rgba(59, 130, 246, 0)',
          '0 0 0 8px rgba(59, 130, 246, 0.3)',
          '0 0 0 0 rgba(59, 130, 246, 0)'
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
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
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
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-dark sm:text-4xl">
          Response curves
        </h2>
        <p className="mt-4 text-xl text-gray-medium max-w-3xl mx-auto">
          Model physician level saturation curves
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        {/* Process Steps Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-dark mb-8 text-center">Our AI Process</h3>
          <div className="relative space-y-6 flex-grow">
            {/* Connecting vertical line */}
            <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gray-300 z-0"></div>
            
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start space-x-6 p-4 bg-gray-50 rounded-xl border border-gray-100 z-10 hover:shadow-md transition-shadow duration-200">
                <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full ${
                  step.number === 1 ? 'bg-secondary-lighter text-secondary' : 
                  step.number === 2 ? 'bg-primary-lighter text-primary' : 
                  'bg-accent-lighter text-accent'
                } border-4 border-white shadow-lg`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-dark">{step.title}</h4>
                  <p className="mt-1 text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-dark mb-6 text-center">Response Curve Simulation</h3>
          <div className="w-full flex-grow flex items-center">
            <div className="w-full h-96">
            <ResponsiveContainer>
                <AreaChart data={transformedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" label={{ value: 'Time since 1st Rep call (cumulative)', position: 'insideBottom', dy: 20, fill: '#6B7280' }} stroke="#a0a0a0" />
                    <YAxis label={{ value: 'estimate Rx prescriptions', angle: -90, position: 'insideLeft', dx: -10, fill: '#6B7280' }} stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        backdropFilter: 'blur(5px)',
                        border: '1px solid #e0e0e0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend verticalAlign="top" height={40} wrapperStyle={{ paddingBottom: '20px' }}/>
                    <Area 
                      type="monotone" 
                      dataKey="Simulate_upper" 
                      stroke="none" 
                      fill="#60A5FA" 
                      fillOpacity={0.3}
                      name="Simulate"
                      legendType="none"
                      baseLine="Simulate_lower"
                    />
                    <Line type="monotone" dataKey="Real world data" stroke="#F97316" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="Simulate" stroke="#3B82F6" strokeWidth={2} dot={false} name="Simulate" />
                    <Line type="monotone" dataKey="Optimize" stroke="#10B981" strokeWidth={3} dot={false} />
                </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <AnimatedSection>
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-dark sm:text-4xl">
              Illustrative Response Curves
            </h2>
            <p className="mt-4 text-xl text-gray-medium max-w-3xl mx-auto">
              Simulating response curves for different HCP profiles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {hcpData.map((hcp) => (
              <AnimatedSection key={hcp.id}>
                <div className="flex flex-col space-y-6 bg-gray-50/70 p-6 rounded-2xl border border-gray-200/80">
                  <div className="flex items-center space-x-4">
                    <div className={`${hcp.iconBg} p-3 rounded-full`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${hcp.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{hcp.name}</h2>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <h3 className="font-semibold text-gray-700">Characteristics & Behaviors</h3>
                      <p className="mt-2 text-gray-600 text-sm">{hcp.characteristics}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700">Driving Outcomes</h3>
                      <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside text-sm">
                        {hcp.outcomes.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border flex-grow">
                    <h3 className="font-semibold text-gray-700">Response Curve Simulation</h3>
                    {hcp.curveDescription.map((item, index) => <p key={index} className="mt-1 text-xs text-gray-500">{item}</p>)}
                    <HCPChart data={hcp.chartData} lineColor={hcp.lineColor} isROIOptimizationActive={isROIOptimizationActive} />
                  </div>
                </div>
              </AnimatedSection>
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Response Curve Analysis",
      description: "Analyze HCP saturation curves to determine optimal visit frequency and rep allocation per territory",
      repBenefit: "Reps get territories sized based on actual HCP responsiveness, not just geography"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <div className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-dark sm:text-4xl">
          Field Force Sizing
        </h2>
        <p className="mt-4 text-xl text-gray-medium max-w-3xl mx-auto">
          Optimize rep allocation and territory design using AI-driven response curve analysis
        </p>
      </div>

      {/* Platform Capabilities */}
      <AnimatedSection>
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-dark mb-8 text-center">Platform Capabilities</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-gray-50 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-dark mb-2">{feature.title}</h4>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-blue-800">Rep Benefit:</p>
                      <p className="text-sm text-blue-700">{feature.repBenefit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Container for the three connected sections */}
      <div className="relative">
        {/* Connecting vertical line for the three field force sections */}
        <div className="absolute left-6 -top-8 h-full w-1 bg-gray-300 z-0 hidden lg:block"></div>
        
        {/* Connection dots for each section */}
        <div className="absolute left-5 top-0 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-5 top-[26.6rem] w-3 h-3 bg-accent rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-5 top-[53.2rem] w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>

        {/* Generate Optimal Territory Rep Allocation */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row gap-8 mb-12 relative">
          {/* Title Section - Left Side */}
          <div className="lg:w-1/3 flex items-start space-x-4">
            <div className="flex-shrink-0 bg-blue-100 p-4 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{sizingMetrics.totalTerritories}</div>
            <div className="text-sm text-gray-600 mt-1">Total Territories</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-accent">{sizingMetrics.recommendedReps}</div>
            <div className="text-sm text-gray-600 mt-1">Recommended Reps</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{sizingMetrics.efficiencyGain}</div>
            <div className="text-sm text-gray-600 mt-1">Efficiency Gain</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-accent">{sizingMetrics.revenueImpact}</div>
            <div className="text-sm text-gray-600 mt-1">Revenue Impact</div>
          </div>
          <div className="text-center bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-secondary">{sizingMetrics.costOptimization}</div>
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
            <div className="flex-shrink-0 bg-green-100 p-4 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                      selectedScenario === index
                        ? 'bg-white text-primary shadow-md'
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
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {territory.territoryType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          territory.recommendation.includes('Add') ? 'bg-accent-light text-accent-dark' : 
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
                    <div className="bg-white rounded-lg p-3 border-l-4 border-primary">
                      <h5 className="font-medium text-primary-dark mb-3 flex items-center text-xs">
                        <div className="w-2 h-2 bg-primary rounded-full mr-1"></div>
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
                  <div className="text-sm text-gray-500">+48% territory growth</div>
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

const Hero = () => {
  return (
    <div className="bg-primary-lighter pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block bg-white p-4 rounded-full text-primary shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 14v4m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <motion.h1 
            className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-dark tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Commercial Budget Optimizer
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            An AI-driven platform to help you unlock growth opportunities and make data-driven decisions to deploy field force effectively.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const navLinks = [
    { name: "Commercial Budget Optimization", href: "#" },
    { name: "Sales Force Sizing", href: "#field-force-sizing" },
    { name: "HCP Call Planning", href: "#" },
    { name: "REP Planner", href: "#" },
    { name: "Pharma BYOB", href: "#" },
    { name: "Portfolio Use Case", href: "#" }
  ];

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
             <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-bold text-xl text-gray-800">Commercial Intelligence</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-500 hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [isROIOptimizationActive, setIsROIOptimizationActive] = React.useState(false);
  
  const sections = [
    {
      id: 'investment',
      title: 'Investment',
      subtitle: 'Budget optimisation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      details: {
        title: 'Recommended optimal sales force investment per cycle on territory level per brand x market',
        points: [
          { text: 'Heatmap showing territories with highest potential for incremental investment', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )},
          { text: 'Insights on ROI optimizing sales force investment', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
        ]
      }
    },
    {
      id: 'call_plan',
      title: 'Call Plan',
      subtitle: 'HCP trigger program',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      details: {
        title: "Predictive modelling with AI insights on HCP's projected Rx, and drivers",
        points: [
          { text: 'Adding granularity on adoption funnel and potential based on differences in responsiveness / market share', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          )},
          { text: 'Adding granularity on behavioral segmentation based on insights on drivers', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        ]
      }
    },
    {
      id: 'sales_force_sizing',
      title: 'Sales force sizing',
      subtitle: 'Engagement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" />
        </svg>
      ),
      details: {
        title: 'Optimized interaction plan for all channels at HCP based on responsiveness and saturation predictions.',
        points: [
          { text: 'Prioritization of HCPs with highest impact.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          )},
          { text: 'Optimal channel mix.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )},
          { text: 'Optimal frequency.', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          )}
        ]
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-light font-sans">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Connecting vertical line for the first three sections */}
        <div className="absolute left-20 top-32 h-[60rem] w-1 bg-gray-300 z-0 hidden lg:block"></div>
        
        {/* Connection dots for each section */}
        <div className="absolute left-[4.75rem] top-40 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-[4.75rem] top-[32rem] w-3 h-3 bg-accent rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>
        <div className="absolute left-[4.75rem] top-[56rem] w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-lg z-10 hidden lg:block"></div>

        {/* Sections */}
        <div className="space-y-24">
          {sections.map((section) => (
            <AnimatedSection key={section.id}>
              <div className="grid md:grid-cols-12 gap-x-8 gap-y-12 items-center relative">
                {/* Left Panel */}
                <div className="md:col-span-5 flex items-start space-x-6">
                  <div className="flex-shrink-0 bg-primary-lighter p-4 rounded-2xl border-4 border-white shadow-lg z-20 relative">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-dark">{section.title}</h2>
                    <p className="text-primary-dark font-semibold text-lg">{section.subtitle}</p>
                  </div>
                </div>
                {/* Right Panel */}
                <div className="md:col-span-7">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80">
                    <h3 className="text-xl font-bold text-gray-dark">{section.details.title}</h3>
                    <div className="mt-6 space-y-5">
                      {section.details.points.map((point, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 bg-primary-lighter p-3 rounded-full">
                            {point.icon}
                          </div>
                          <p className="text-gray-600 text-lg pt-2">{point.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
          
          <AnimatedSection>
            <div className="pt-16">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-dark sm:text-4xl">
                  Budget Optimizer
                </h2>
                <p className="mt-4 text-xl text-gray-medium max-w-3xl mx-auto">
                  Unlock growth opportunities with our powerful optimization tools.
                </p>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {[
                  { 
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    title: 'Identify Optimal Spend',
                    text: 'Pinpoint the most effective promotional spend for any brand in any market.'
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ),
                    title: 'Understand ROI & Growth',
                    text: 'Analyze the mROI curve to understand the trade-offs between investment and expected growth.'
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    ),
                    title: 'Right-Size Resources',
                    text: 'Make data-driven decisions to deploy resources based on the growth potential of brands and markets.'
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    ),
                    title: 'Multi-Level Optimization',
                    text: 'Optimize across brands, territories, and your portfolio with a scalable and repeatable approach.'
                  }
                ].map((item, index) => (
                  <AnimatedSection key={index}>
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 flex items-start space-x-5 hover:shadow-xl hover:border-primary transition-all duration-300">
                      <div className="flex-shrink-0 bg-primary-lighter p-4 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-dark">{item.title}</h3>
                        <p className="text-gray-medium mt-1">{item.text}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-24 relative">
                <AnimatedSection>
                  <div className="hidden lg:flex justify-center absolute w-full -top-4 z-10">
                    <button 
                      onClick={() => setIsROIOptimizationActive(!isROIOptimizationActive)}
                      className={`bg-white border border-gray-300 text-gray-dark p-3 rounded-full shadow-2xl text-center w-72 relative font-semibold transition-all duration-300 hover:shadow-3xl hover:scale-105 ${
                        isROIOptimizationActive ? 'bg-primary text-white border-primary' : 'hover:border-primary hover:text-primary'
                      }`}
                    >
                      <span>ROI-optimizing Spend Adjustment</span>
                      {isROIOptimizationActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Brand x market level */}
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xl flex flex-col h-full">
                      <div className="bg-primary text-white p-5">
                        <h2 className="text-xl font-bold">Brand x Market Level</h2>
                      </div>
                      <div className="p-6 flex-grow">
                        <h3 className="font-semibold text-gray-dark">Spend-Revenue Response Curve for FF interactions</h3>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-medium">Incremental revenue, $M</span>
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center">
                                <svg width="12" height="12" viewBox="0 0 12 12" className="mr-2">
                                  <path d="M6 0L12 6L6 12L0 6L6 0Z" className="fill-current text-secondary" />
                                </svg>
                                <span className="text-gray-dark font-medium">Profit max</span>
                              </div>
                              <div className="flex items-center">
                                <svg width="12" height="12" viewBox="0 0 12 12" className="mr-2">
                                  <path d="M6 0L12 6L6 12L0 6L6 0Z" className="fill-current text-primary" />
                                </svg>
                                <span className="text-gray-dark font-medium">Fy23 Spend</span>
                              </div>
                            </div>
                        </div>
        
                        <div className="relative mt-4 h-64">
                            {/* Chart SVG */}
                            <svg viewBox="0 0 500 300" className="w-full h-full">
                              {/* Y-axis labels */}
                              {[...Array(12)].map((_, i) => (
                                  <text key={i} x="35" y={250 - i * 20} textAnchor="end" className="text-xs fill-current text-gray-medium">{i * 5}</text>
                              ))}
                              {/* X-axis labels */}
                              <text x="50" y="270" textAnchor="middle" className="text-xs fill-current text-gray-medium">0%</text>
                              <text x="275" y="270" textAnchor="middle" className="text-xs fill-current text-gray-medium">100%</text>
                              <text x="480" y="270" textAnchor="end" className="text-xs fill-current text-gray-medium">200%</text>
                              <text x="450" y="285" textAnchor="end" className="text-xs fill-current text-gray-400 font-medium">Spend, % Current</text>
        
                              {/* Grid lines */}
                              <line x1="40" y1="250" x2="500" y2="250" className="stroke-current text-gray-200" strokeWidth="1"/>
                              
                              {/* Curve */}
                              <path d="M 50 250 Q 200 100 480 70" stroke="#3B82F6" fill="none" strokeWidth="4" />
        
                              {/* Profit Max Point */}
                              <g transform="translate(220, 168)">
                                  <polygon points="0,-8 8,0 0,8 -8,0" className="fill-current text-secondary" />
                                  <text x="15" y="5" className="text-sm font-semibold fill-current text-gray-dark">(S: $8M, R: $19M)</text>
                              </g>
                              
                              {/* Current Spend Point */}
                              <g transform="translate(350, 115)">
                                  <polygon points="0,-8 8,0 0,8 -8,0" className="fill-current text-primary" />
                                  <text y="24" textAnchor="middle" className="text-sm font-semibold fill-current text-gray-dark">(S: $10M, R: $20M)</text>
                              </g>

                              {/* Arrow at the end of the curve */}
                              <g transform="translate(480, 70) rotate(20)">
                                  <polygon points="0,0 -12,-5 -12,5" fill="#3B82F6"/>
                              </g>
                            </svg>
                        </div>
                        <div className="text-center mt-4">
                          <div className="inline-block bg-white py-2 px-4 text-sm text-gray-dark rounded-lg shadow-lg font-bold border border-gray-200">
                            FY23 Carryover sales $22M
                          </div>
                        </div>
                      </div>
                  </div>
                </AnimatedSection>
          
                {/* Territory level */}
                <AnimatedSection>
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xl flex flex-col h-full">
                      <div className="bg-primary text-white p-5">
                        <h2 className="text-xl font-bold">Territory Level</h2>
                      </div>
                      <div className="p-6 flex-grow">
                        <h3 className="font-semibold text-gray-dark">US Brand 1</h3>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-sm text-left">
                              <thead className="border-b-2 border-gray-200">
                                  <tr>
                                    <th scope="col" className="py-3 pr-2 font-bold text-gray-dark uppercase tracking-wider">Territory</th>
                                    <th scope="col" colSpan="3" className="py-3 px-2 font-bold text-center border-l border-r border-gray-200 text-gray-dark uppercase tracking-wider">Delta 2024-23, in EURm</th>
                                    <th scope="col" className="py-3 px-2 font-bold text-right text-gray-dark uppercase tracking-wider">ROI 2024</th>
                                    <th scope="col" className="py-3 pl-2 font-bold text-right text-gray-dark uppercase tracking-wider">mROI 2024</th>
                                  </tr>
                                  <tr className="border-b border-gray-200">
                                    <th className="py-2 pr-2"></th>
                                    <th className="py-2 px-2 text-center font-semibold text-gray-medium">Spend</th>
                                    <th className="py-2 px-2 text-center font-semibold text-gray-medium">Revenue</th>
                                    <th className="py-2 px-2 text-center font-semibold text-gray-medium">Profit</th>
                                    <th className="py-2 px-2"></th>
                                    <th className="py-2 pl-2"></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {tableData.map((row, index) => (
                                  <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                      <td className="py-3 pr-2 whitespace-nowrap text-gray-dark font-medium">{row.territory}</td>
                                      <td className="py-3 px-1 text-center"><span className={`px-3 py-1 text-sm rounded-md font-bold ${row.spend < 0 ? 'bg-primary-lighter text-primary-dark' : 'bg-red-100 text-red-800'}`}>{row.spend}</span></td>
                                      <td className="py-3 px-1 text-center"><span className={`px-3 py-1 text-sm rounded-md font-bold ${row.revenue < 0 ? 'bg-primary-lighter text-primary-dark' : 'bg-red-100 text-red-800'}`}>{row.revenue}</span></td>
                                      <td className="py-3 px-1 text-center"><span className={`px-3 py-1 text-sm rounded-md font-bold ${row.profit < 5 ? 'bg-gray-200 text-gray-800' : 'bg-accent-light text-accent-dark'}`}>{row.profit}</span></td>
                                      <td className="py-3 px-2 text-right"><span className={`px-3 py-1 text-sm rounded-md font-bold ${row.roi < 1 ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-red-800'}`}>{row.roi.toFixed(2)}</span></td>
                                      <td className="py-3 pl-2 text-right">
                                        <motion.span 
                                          className={`px-3 py-1 text-sm rounded-md font-bold ${row.mroi < 1 ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-red-800'}`}
                                          animate={isROIOptimizationActive ? {
                                            scale: [1, 1.2, 1],
                                            backgroundColor: ['#fef3c7', '#f59e0b', '#fef3c7'],
                                            color: ['#92400e', '#ffffff', '#92400e']
                                          } : {}}
                                          transition={{
                                            duration: 1.5,
                                            repeat: isROIOptimizationActive ? Infinity : 0,
                                            repeatType: "loop",
                                            ease: "easeInOut"
                                          }}
                                        >
                                          {row.mroi.toFixed(2)}
                                        </motion.span>
                                      </td>
                                  </tr>
                                  ))}
                              </tbody>
                            </table>
                        </div>
                      </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <ResponseCurves isROIOptimizationActive={isROIOptimizationActive} />
          </AnimatedSection>
          <AnimatedSection>
            <div id="field-force-sizing">
              <FieldForceSizing />
            </div>
          </AnimatedSection>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
