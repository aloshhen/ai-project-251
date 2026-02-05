import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// SafeIcon component for Lucide icons
const SafeIcon = ({ name, size = 24, className, color }) => {
  const LucideIcons = require('lucide-react')
  const IconComponent = LucideIcons[name] || LucideIcons['HelpCircle']
  return <IconComponent size={size} className={className} color={color} />
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Navigation Items
const navItems = [
  { id: 'hero', label: 'Главная', number: '01' },
  { id: 'portfolio', label: 'Портфолио', number: '02' },
  { id: 'about', label: 'О нас', number: '03' },
  { id: 'blog', label: 'Блог', number: '04' },
  { id: 'contact', label: 'Контакты', number: '05' },
]

// Projects Data
const projects = [
  {
    id: 1,
    title: 'Кристалл Тауэр',
    category: 'Коммерческая недвижимость',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    description: 'Высотный офисный комплекс в центре Москвы'
  },
  {
    id: 2,
    title: 'Эко-Резиденция',
    category: 'Жилые комплексы',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    description: 'Экологичный жилой район с зелеными крышами'
  },
  {
    id: 3,
    title: 'Музей Современного Искусства',
    category: 'Культурные объекты',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80',
    description: 'Пространство для выставок и перформансов'
  },
  {
    id: 4,
    title: 'Вилла на Берегу',
    category: 'Частные дома',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    description: 'Минималистичная резиденция у моря'
  },
  {
    id: 5,
    title: 'Техно-Парк',
    category: 'Индустриальная архитектура',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    description: 'Инновационный комплекс для IT-компаний'
  },
  {
    id: 6,
    title: 'Скандинавский Квартал',
    category: 'Градостроительство',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80',
    description: 'Жилой квартал в скандинавском стиле'
  }
]

// Blog Posts Data
const blogPosts = [
  {
    id: 1,
    title: 'Будущее Устойчивой Архитектуры',
    date: '15 Янв 2024',
    category: 'Тренды',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80',
    excerpt: 'Как экологические технологии меняют подход к проектированию зданий'
  },
  {
    id: 2,
    title: 'Минимализм в Интерьерах 2024',
    date: '08 Янв 2024',
    category: 'Дизайн',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    excerpt: 'Новые тенденции в оформлении жилых пространств'
  },
  {
    id: 3,
    title: 'Интервью с Главным Архитектором',
    date: '02 Янв 2024',
    category: 'Интервью',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    excerpt: 'Разговор о вдохновении и творческом процессе'
  }
]

// Animated Section Component
const AnimatedSection = ({ children, className, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Vertical Menu Component
const VerticalMenu = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 lg:hidden w-12 h-12 bg-lime-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-lime-400/30"
      >
        <SafeIcon name={isOpen ? 'X' : 'Menu'} size={24} />
      </button>

      {/* Desktop Vertical Menu - Left Side */}
      <nav className="fixed left-0 top-0 h-screen w-20 lg:w-24 bg-slate-950 border-r border-slate-900 z-40 hidden lg:flex flex-col items-center py-12">
        <div className="mb-12">
          <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center">
            <span className="text-slate-950 font-black text-xl font-display">A</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300",
                activeSection === item.id
                  ? "bg-lime-400 text-slate-950"
                  : "text-slate-500 hover:text-lime-400 hover:bg-slate-900"
              )}
            >
              <span className="font-display text-sm tracking-wider rotate-180 vertical-text">
                {item.label}
              </span>

              {/* Hover Indicator */}
              <span className="absolute left-full ml-2 px-3 py-1 bg-lime-400 text-slate-950 text-sm font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="text-slate-600 text-xs font-display tracking-widest rotate-180 vertical-text">
          ARCHITECTURA
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-slate-950 z-40 lg:hidden flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "text-4xl font-display tracking-wider transition-colors",
                    activeSection === item.id ? "text-lime-400" : "text-white hover:text-lime-400"
                  )}
                >
                  <span className="text-lime-400 text-lg mr-4">{item.number}</span>
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hero Section
const HeroSection = ({ onNavigate }) => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 lg:pl-24">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-10" />
        <img
          src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=80"
          alt="Architecture"
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 z-5 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(163, 230, 53, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(163, 230, 53, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 lg:px-12">
        <motion.div style={{ y: y1 }} className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-lime-400" />
            <span className="text-lime-400 font-display tracking-widest text-lg">АРХИТЕКТУРНАЯ СТУДИЯ</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-white leading-none mb-8"
          >
            СОЗДАЕМ
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-300">
              БУДУЩЕЕ
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
          >
            Проектируем пространства, в которых хочется жить и работать.
            От концепции до реализации.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => onNavigate('portfolio')}
              className="group bg-lime-400 hover:bg-lime-300 text-slate-950 px-8 py-4 rounded-none font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-3 accent-glow"
            >
              Смотреть проекты
              <SafeIcon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="border-2 border-white/20 hover:border-lime-400 text-white px-8 py-4 rounded-none font-bold text-lg transition-all hover:text-lime-400"
            >
              Обсудить проект
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-slate-500 text-sm tracking-widest font-display">СКРОЛЛ</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-lime-400 to-transparent"
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-12 right-6 lg:right-12 z-20 flex gap-8 lg:gap-12"
      >
        <div className="text-right">
          <div className="text-3xl lg:text-5xl font-display text-lime-400">150+</div>
          <div className="text-slate-500 text-sm">Проектов</div>
        </div>
        <div className="text-right">
          <div className="text-3xl lg:text-5xl font-display text-lime-400">12</div>
          <div className="text-slate-500 text-sm">Лет опыта</div>
        </div>
        <div className="text-right">
          <div className="text-3xl lg:text-5xl font-display text-lime-400">25</div>
          <div className="text-slate-500 text-sm">Наград</div>
        </div>
      </motion.div>
    </section>
  )
}

// Portfolio Section
const PortfolioSection = () => {
  const [filter, setFilter] = useState('Все')
  const categories = ['Все', 'Жилые комплексы', 'Коммерческая', 'Культурные объекты']

  const filteredProjects = filter === 'Все'
    ? projects
    : projects.filter(p => p.category.includes(filter) || filter.includes(p.category))

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-slate-950 lg:pl-24 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <span className="text-lime-400 font-display tracking-widest text-lg mb-4 block">ПОРТФОЛИО</span>
              <h2 className="text-5xl lg:text-7xl font-display text-white">
                НАШИ <span className="text-lime-400">ПРОЕКТЫ</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-none text-sm font-medium transition-all border",
                    filter === cat
                      ? "bg-lime-400 text-slate-950 border-lime-400"
                      : "bg-transparent text-slate-400 border-slate-800 hover:border-lime-400 hover:text-lime-400"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative aspect-[4/5] overflow-hidden bg-slate-900 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-lime-400 text-sm font-medium mb-2 block">{project.category}</span>
                    <h3 className="text-2xl lg:text-3xl font-display text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">{project.year}</span>
                      <button className="w-10 h-10 bg-lime-400 text-slate-950 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 accent-glow">
                        <SafeIcon name="ArrowUpRight" size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Border Accent */}
                <div className="absolute inset-0 border border-slate-800 group-hover:border-lime-400/50 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <button className="group inline-flex items-center gap-3 border-2 border-lime-400 text-lime-400 px-8 py-4 rounded-none font-bold text-lg transition-all hover:bg-lime-400 hover:text-slate-950">
            Все проекты
            <SafeIcon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </AnimatedSection>
      </div>
    </section>
  )
}

// About Section
const AboutSection = () => {
  const values = [
    { icon: 'Lightbulb', title: 'Инновации', desc: 'Применяем передовые технологии проектирования' },
    { icon: 'Leaf', title: 'Устойчивость', desc: 'Экологичные решения для будущего поколений' },
    { icon: 'Users', title: 'Команда', desc: '50+ профессионалов с международным опытом' },
    { icon: 'Award', title: 'Качество', desc: 'Строгий контроль на всех этапах работы' }
  ]

  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-900 lg:pl-24 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image Side */}
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt="Office"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-lime-400/10 mix-blend-multiply" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-lime-400 text-slate-950 p-6 lg:p-8"
              >
                <div className="text-4xl lg:text-6xl font-display font-black">12</div>
                <div className="text-sm font-medium">Лет на рынке</div>
              </motion.div>

              {/* Decorative Border */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-lime-400/30 -z-10" />
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <div>
            <AnimatedSection delay={0.2}>
              <span className="text-lime-400 font-display tracking-widest text-lg mb-4 block">О КОМПАНИИ</span>
              <h2 className="text-5xl lg:text-7xl font-display text-white mb-8">
                МЫ СОЗДАЕМ <span className="text-lime-400">ПРОСТРАНСТВА</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Architectura — это команда архитекторов, дизайнеров и инженеров,
                объединенных общей идеей создания уникальных пространств.
                Мы верим, что архитектура способна менять жизни людей к лучшему.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-12">
                Наш подход сочетает функциональность, эстетику и устойчивое развитие.
                Каждый проект — это результат глубокого анализа, творческого поиска
                и внимания к деталям.
              </p>
            </AnimatedSection>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} delay={0.4 + index * 0.1}>
                  <div className="group p-4 border border-slate-800 hover:border-lime-400/50 transition-colors bg-slate-950/50">
                    <SafeIcon
                      name={value.icon}
                      size={24}
                      className="text-lime-400 mb-3 group-hover:scale-110 transition-transform"
                    />
                    <h4 className="text-white font-display text-xl mb-1">{value.title}</h4>
                    <p className="text-slate-500 text-sm">{value.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Blog Section
const BlogSection = () => {
  return (
    <section id="blog" className="py-24 lg:py-32 bg-slate-950 lg:pl-24">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <span className="text-lime-400 font-display tracking-widest text-lg mb-4 block">БЛОГ</span>
              <h2 className="text-5xl lg:text-7xl font-display text-white">
                ИДЕИ И <span className="text-lime-400">ИНСАЙТЫ</span>
              </h2>
            </div>
            <button className="group flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors font-medium">
              Все статьи
              <SafeIcon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimatedSection key={post.id} delay={index * 0.1}>
              <article className="group cursor-pointer">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden mb-6 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-lime-400 text-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-4 text-slate-500 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <SafeIcon name="Calendar" size={14} />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display text-white mb-3 group-hover:text-lime-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-lime-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-2 duration-300">
                    Читать далее
                    <SafeIcon name="ArrowRight" size={16} />
                  </span>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
const ContactSection = () => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  const contactInfo = [
    { icon: 'MapPin', label: 'Адрес', value: 'Москва, ул. Архитектора Власова, 12' },
    { icon: 'Phone', label: 'Телефон', value: '+7 (495) 123-45-67' },
    { icon: 'Mail', label: 'Email', value: 'info@architectura.ru' },
    { icon: 'Clock', label: 'Часы работы', value: 'Пн-Пт: 9:00 - 19:00' }
  ]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-slate-900 lg:pl-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div>
            <AnimatedSection>
              <span className="text-lime-400 font-display tracking-widest text-lg mb-4 block">КОНТАКТЫ</span>
              <h2 className="text-5xl lg:text-7xl font-display text-white mb-8">
                ДАВАЙТЕ <span className="text-lime-400">ОБСУДИМ</span>
                <br />ВАШ ПРОЕКТ
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-lg">
                Готовы начать работу над вашим проектом?
                Свяжитесь с нами любым удобным способом или заполните форму.
              </p>
            </AnimatedSection>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <AnimatedSection key={item.label} delay={0.1 + index * 0.1}>
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 group-hover:border-lime-400 transition-colors flex items-center justify-center flex-shrink-0">
                      <SafeIcon name={item.icon} size={20} className="text-lime-400" />
                    </div>
                    <div>
                      <div className="text-slate-500 text-sm mb-1">{item.label}</div>
                      <div className="text-white text-lg font-medium">{item.value}</div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Social Links */}
            <AnimatedSection delay={0.5} className="mt-12">
              <div className="flex gap-4">
                {['Instagram', 'Telegram', 'Youtube'].map((social) => (
                  <button
                    key={social}
                    className="w-12 h-12 border border-slate-800 hover:border-lime-400 hover:bg-lime-400 hover:text-slate-950 text-slate-400 transition-all flex items-center justify-center"
                  >
                    <SafeIcon name={social} size={20} />
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Form Side */}
          <AnimatedSection delay={0.3}>
            <div className="bg-slate-950 p-8 lg:p-12 border border-slate-800 relative">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lime-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lime-400" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-500 text-sm mb-2">Имя</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors"
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-sm mb-2">Телефон</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-sm mb-2">Сообщение</label>
                      <textarea
                        name="message"
                        rows="4"
                        required
                        className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors resize-none"
                        placeholder="Расскажите о вашем проекте..."
                      />
                    </div>

                    {isError && (
                      <div className="text-red-400 text-sm flex items-center gap-2">
                        <SafeIcon name="AlertCircle" size={16} />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-lime-400 hover:bg-lime-300 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-950 font-bold py-4 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 accent-glow"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <SafeIcon name="Send" size={20} />
                          Отправить сообщение
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SafeIcon name="CheckCircle" size={40} className="text-lime-400" />
                    </div>
                    <h3 className="text-3xl font-display text-white mb-4">
                      Сообщение отправлено!
                    </h3>
                    <p className="text-slate-400 mb-8">
                      Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-lime-400 hover:text-lime-300 font-medium transition-colors"
                    >
                      Отправить еще сообщение
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-slate-950 py-12 lg:pl-24 border-t border-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-black text-lg font-display">A</span>
            </div>
            <span className="text-2xl font-display text-white tracking-wider">ARCHITECTURA</span>
          </div>

          <div className="text-slate-600 text-sm">
            © 2024 Architectura. Все права защищены.
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-slate-500 hover:text-lime-400 transition-colors"
          >
            Наверх
            <SafeIcon name="ArrowUp" size={16} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('hero')

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigate = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = window.innerWidth >= 1024 ? 0 : 0 // Account for vertical menu on desktop
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <VerticalMenu activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <HeroSection onNavigate={handleNavigate} />
        <PortfolioSection />
        <AboutSection />
        <BlogSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

export default App