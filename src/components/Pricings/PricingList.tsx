// src/components/pricing/PricingList.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Crown, Rocket, ArrowRight, X } from 'lucide-react';

const plans = [
  {
    id: 'impulso',
    name: 'Impulso',
    price: '$0',
    period: 'Permanencia 6 meses',
    description: 'Para emprendedores que inician su presencia digital.',
    icon: Rocket,
    features: [
      'Landing Page Optimizada', 'Diseño Responsive', 'SEO Básico',
      'SSL Incluido', 'Hosting 1 Año', 'Soporte por Email',
    ],
    notIncluded: ['IA Integrada', 'Dashboard Analytics', 'Desarrollo a Medida'],
    highlight: false,
  },
  {
    id: 'autoridad',
    name: 'Autoridad',
    price: '$200k',
    period: 'MXN / Pago único',
    description: 'Para negocios listos para escalar y dominar su mercado.',
    icon: Sparkles,
    popular: true,
    features: [
      'Web App Completa', 'Diseño UI/UX Premium', 'SEO Técnico Avanzado',
      'Core Web Vitals Perfectos', 'Integración con CRM', 'Chatbot IA Básico',
      'Dashboard Analytics', 'Soporte Prioritario', '3 Meses de Optimización',
    ],
    notIncluded: [],
    highlight: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$450k',
    period: 'MXN / Pago único',
    description: 'Solución empresarial completa. Sin límites.',
    icon: Crown,
    elite: true,
    features: [
      'Todo de Autoridad +', 'Desarrollo Full-Stack', 'IA Avanzada Personalizada',
      'Integraciones Ilimitadas', 'Panel Administrativo', 'App Móvil (iOS/Android)',
      'Consultor Dedicado', '6 Meses de Soporte VIP', 'Capacitación del Equipo',
    ],
    notIncluded: [],
    highlight: true,
  },
];

export const PricingList = () => {
  const [openForm, setOpenForm] = useState<string | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group
              ${plan.popular || plan.elite 
                ? 'bg-dark-200 border-primary shadow-primary' 
                : 'bg-dark-100 border-white/10 hover:border-primary/50'
              }
            `}
          >
            {/* Badges */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-dark-200 shadow-primary">
                  <Sparkles className="h-4 w-4" /> Más Popular
                </span>
              </div>
            )}
            {plan.elite && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-4 py-1.5 text-sm font-semibold text-dark-200 shadow-lg">
                  <Crown className="h-4 w-4" /> Premium
                </span>
              </div>
            )}

            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mb-8">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 
                  ${plan.elite ? 'bg-brand-gold text-dark-200' : 'bg-primary/20 text-primary'}`}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`font-heading text-4xl font-bold 
                    ${plan.elite ? 'text-brand-gold' : 'text-primary'}`}>
                    {plan.price}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{plan.period}</p>
              </div>

              <p className="text-gray-400 mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 shrink-0 ${plan.elite ? 'text-brand-gold' : 'text-primary'}`} />
                    <span className="text-sm text-gray-200">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 opacity-40">
                    <X className="h-5 w-5 shrink-0 text-gray-500" />
                    <span className="text-sm text-gray-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setOpenForm(plan.id)}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                  ${plan.elite 
                    ? 'bg-brand-gold text-dark-200 hover:brightness-110' 
                    : plan.popular
                      ? 'bg-primary text-dark-200 shadow-primary hover:shadow-primary-hover'
                      : 'border border-white/20 text-white hover:border-primary hover:text-primary'
                  }`}
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Start Form Modal */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-dark-200/90 backdrop-blur-sm"
              onClick={() => setOpenForm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-dark-100 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setOpenForm(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="font-heading text-2xl font-bold mb-2 text-white">
                Inicio Rápido - <span className="text-primary">{plans.find(p => p.id === openForm)?.name}</span>
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Completa tus datos y te contactamos en menos de 24 horas.
              </p>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Tu nombre" className="w-full bg-dark-200 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                <input type="email" placeholder="tu@email.com" className="w-full bg-dark-200 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                <input type="tel" placeholder="Teléfono / WhatsApp" className="w-full bg-dark-200 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                <button type="submit" className="w-full bg-primary text-dark-200 font-bold py-3 rounded-lg hover:shadow-primary transition-shadow">
                  Enviar Solicitud
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};