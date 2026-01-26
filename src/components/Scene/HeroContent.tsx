import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HeroContent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const stats = [
    { value: 150, suffix: '+', label: 'Proyectos Entregados', icon: Sparkles },
    { value: 98, suffix: '%', label: 'Tasa de Conversión', icon: TrendingUp },
    { value: 3, suffix: 'x', label: 'ROI Promedio', icon: Zap },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const controls = animate(0, target, {
        duration: 2,
        delay: 0.8,
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }, []);

    return <>{count}{suffix}</>;
  };

  return (
    <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-32 md:pt-40 pb-20">
      
      {/* Efectos de fondo interactivos */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0099ff]/20 to-[#a855f7]/20 rounded-full blur-[120px] animate-pulse-slow" />
      </motion.div>

      {/* Badge de disponibilidad */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-gradient-to-r from-[#00E5FF]/10 to-[#a855f7]/10 px-5 py-2.5 mb-8 hover:border-[#00E5FF]/50 transition-all duration-300 group cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
        </span>
        <span className="text-sm font-semibold bg-gradient-to-r from-[#00E5FF] to-[#a855f7] bg-clip-text text-transparent">
          Aceptando nuevos proyectos 2026
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] group-hover:rotate-12 transition-transform" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6 relative"
      >
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
          <span className="block text-white mb-2">
            No es una Web.
          </span>
          <span className="block relative">
            <span className="relative inline-block bg-gradient-to-r from-[#00E5FF] via-[#0099ff] to-[#a855f7] bg-clip-text text-transparent animate-gradient">
              Es tu Máquina de Ventas.
            </span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent blur-sm"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
      >
        Creamos <span className="text-white font-semibold">experiencias digitales</span> que transforman visitantes en clientes.{' '}
        <span className="text-[#00E5FF]">SEO técnico</span>, <span className="text-[#a855f7]">IA integrada</span> y velocidad de carga perfecta.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20 px-4"
      >
        <motion.a
          href="/contacto"
          className="group relative px-8 py-4 bg-gradient-to-r from-[#0099ff] to-[#a855f7] text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,153,255,0.6)] w-full sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#0099ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%', skewX: -20 }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
            <Zap className="w-4 h-4" />
            Iniciar Proyecto
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.a>

        <motion.a
          href="/demo"
          className="group px-8 py-4 border-2 border-[#00E5FF]/30 text-white font-semibold rounded-full hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] transition-all duration-300 w-full sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Ver Demo
          </span>
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0099ff]/10 to-[#a855f7]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-300">
              <div className="mb-3 flex justify-center">
                <div className="p-2 bg-gradient-to-br from-[#0099ff]/20 to-[#a855f7]/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-5 h-5 text-[#00E5FF]" />
                </div>
              </div>
              
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              
              <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer group"
        >
          <span className="text-xs uppercase tracking-widest font-medium group-hover:text-[#00E5FF] transition-colors">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1 group-hover:border-[#00E5FF] transition-colors">
            <motion.div
              className="w-1.5 h-2 bg-gradient-to-b from-[#00E5FF] to-transparent rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};