import React, { useState } from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Link as LinkIcon, CheckCircle2, Zap, Lock, Globe, Users, Code } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Marquee from 'react-fast-marquee';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Real-time Scanning",
    description: "Instant URL analysis with advanced AI technology"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Get results in milliseconds with our optimized scanning engine"
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Secure Analysis",
    description: "Your data is encrypted and protected throughout the scanning process"
  }
];



const safeList = [
  "https://google.com",
  "https://www.designbombs.com",
  "https://facebook.com",
  "https://www.ewtnreligiouscatalogue.com",
  "https://youtube.com",
  "https://www.anhnbt.com",
  "https://linkedin.com",
  "https://www.lila.art",
  "https://wikipedia.org"
]

const maliciousList = [
  "http://www.pro.ac",
  "http://u1965047.plsk.regruhosting.ru/49/",
  "http://www.f0539494.xsph.ru",
  "http://www.sosacres.com",
  "http://www.hldns.ru",
  "https://www.craft.do/s/z8eavvjmh29aht",
  "http://go0gle.coom/query?login=1",
  "https://walletupdate-online.com/",
  "https://my-business-101992-104377.square.site/",
  "https://spam-site.com",
  "http://www.lnip.org"
]

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const [activeSection, setActiveSection] = useState('hero');
  const [chartAnimationComplete, setChartAnimationComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlClick = (selectedUrl: string) => {
    setUrl(selectedUrl);
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setChartAnimationComplete(false);
    try {
      const response = await axios.post('http://127.0.0.1:5000/detect', { url });
      setResult(response.data.malicious);
      
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-lg font-semibold fill-white">
        {chartAnimationComplete ? `${(percent * 100).toFixed(0)}%` : ''}
      </text>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Parallax Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
            backgroundSize: 'cover'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">URLGuard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-block mb-8"
            >
              <Shield className="w-20 h-20 text-blue-400" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              URL Security Scanner
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Protect yourself and your organization from malicious URLs with our advanced AI-powered scanning technology
            </p>
          </motion.div>

          {/* URL Scanner Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="flex gap-4">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL to scan..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-s</div>emibold hover:opacity-90 transition-opacity hover:scale-105 transition ease-in-out"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Scanning...' : 'Scan URL'}
              </button>
            </div>
          </motion.form>

          {/* Scan Results */}
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto bg-gray-800 rounded-2xl p-8 mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Scan Results</h2>
                  <p className="text-gray-400">URL Security Analysis</p>
                </div>
                <motion.div
                  animate={{
                    rotate: result > 50 ? [0, 360] : 0,
                  }}
                  transition={{ duration: 1 }}
                >
                  {result > 50 ? (
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                  ) : (
                    <Shield className="w-12 h-12 text-green-500" />
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Malicious Percentage Donut */}
                <div className="h-[300px] relative">
                  <h3 className="text-xl font-semibold mb-4 text-center text-red-400">Malicious</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: result }, { value: 100 - result }]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={50} // Makes the pie round
                      >
                        <Cell fill="#EF4444" /> {/* Active progress color */}
                        <Cell fill="#1F2937" /> {/* Background color */}
                      </Pie>
                      {/* Percentage Text in the Center */}
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={24}
                        fill="white"
                      >
                        {`${(result).toFixed(2)}%`}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Safe Percentage Donut */}
                <div className="h-[300px] relative">
                  <h3 className="text-xl font-semibold mb-4 text-center text-green-400">Safe</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 100 - result }, { value: result }]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        cornerRadius={50} // Makes the pie round
                      >
                        <Cell fill="#02ad19" /> {/* Active progress color */}
                        <Cell fill="#1F2937" /> {/* Background color */}
                      </Pie>
                      {/* Percentage Text in the Center */}
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={24}
                        fill="white"
                      >
                        {`${(100 - result).toFixed(2)}%`}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {result > 50 ? 'High Risk Detected!' : 'URL Appears Safe'}
                </h3>
                <p className="text-gray-400">
                  This URL is {result}% likely to be malicious
                </p>
              </div>
            </motion.div>
          )}

           <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gradient">
        Suggested URLs to Check
      </h2>

      <div className="space-y-4">
        {/* Safe URLs */}
        <div className="bg-green-950 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-center">✅ Safe URLs</h3>
          <Marquee speed={50} pauseOnHover={true}>
            {safeList.map((url, index) => (
              <p
                className="me-6 px-4 py-2 bg-green-700 rounded-lg shadow-lg text-white cursor-pointer transition-transform hover:scale-105"
                key={index}
                onClick={() => handleUrlClick(url)}
              >
                {url}
              </p>
            ))}
          </Marquee>
        </div>

        {/* Malicious URLs */}
        <div className="bg-red-950 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-center">⚠️ Malicious URLs</h3>
          <Marquee speed={50} pauseOnHover={true} direction="right">
            {maliciousList.map((url, index) => (
              <p
                className="me-6 px-4 py-2 bg-red-700 rounded-lg shadow-lg text-white cursor-pointer transition-transform hover:scale-105"
                key={index}
                onClick={() => handleUrlClick(url)}
              >
                {url}
              </p>
            ))}
          </Marquee>
        </div>
      </div>
    </div>


          {/* Features Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Secure Your URLs?</h2>
              <p className="text-xl mb-8">Start scanning now and protect yourself from malicious content</p>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-400">
            <div className="mb-8">
              <Shield className="w-8 h-8 text-blue-400 inline-block" />
              <p className="mt-4">© 2025 URLGuard. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;