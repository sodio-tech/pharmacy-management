"use client"
import { motion } from "motion/react"
import { Pill, BarChart3, ShieldCheck, Network, Star } from "lucide-react"
import Image from "next/image"

const BrandingPanel = () => {
  const features = [
    {
      icon: <Pill className="w-5 h-5" />,
      title: "AI-Powered OCR",
      description: "Smart prescription processing",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Smart Analytics",
      description: "Predictive insights & reports",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Full Compliance",
      description: "HIPAA, FDA & ISO certified",
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: "Multi-Branch",
      description: "Centralized management",
    },
  ]

  const stats = [
    { value: "2,500+", label: "Pharmacies" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <div className="hidden lg:flex lg:w-1/2 h-screen bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#22d3ee] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col justify-center p-8 xl:p-12 text-white w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div>
              <Image src="/logo.png" alt="logo" width={60} height={60} />
            </div>
            <h1 className="text-4xl mt-2 font-bold mb-2">Pharmy</h1>
            <p className="text-base text-white/90">AI-Powered Pharmacy Management System</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/15 transition-all duration-300 border border-white/10"
            >
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-white/75 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-6 border border-white/10"
        >
          <div className="grid grid-cols-3 divide-x divide-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-3">
                <div className="text-xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-white/75">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Security</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BrandingPanel
