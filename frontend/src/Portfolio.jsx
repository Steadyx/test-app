import { useState, useEffect } from 'react';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load portfolio data
    fetch('/content/index.json')
      .then(response => response.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    // Smooth scroll and intersection observer setup
    const handleScroll = () => {
      const y = window.scrollY;
      const nav = document.querySelector('nav');
      if (y > 100) {
        nav?.classList.replace('bg-white/95', 'bg-white/100');
        nav?.classList.replace('dark:bg-slate-900/95', 'dark:bg-slate-900/100');
        nav?.classList.add('shadow-xl');
      } else {
        nav?.classList.replace('bg-white/100', 'bg-white/95');
        nav?.classList.replace('dark:bg-slate-900/100', 'dark:bg-slate-900/95');
        nav?.classList.remove('shadow-xl');
      }
      
      const rate = y * -0.5;
      document.querySelectorAll('.animate-float').forEach(el => {
        el.style.transform = `translateY(${rate}px)`;
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.group').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity .6s ease ${i * 0.1}s, transform .6s ease ${i * 0.1}s`;
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [data]);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Header height
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-slate-900 bg-white dark:text-white dark:bg-slate-900 transition-colors duration-300">
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-violet-600 text-white px-3 py-2 rounded-md z-50">
        Skip to main content
      </a>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-40 transition-colors duration-300" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-xl font-bold gradient-text hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              {data.sections.home.title}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {data.nav.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md px-3 py-2"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Desktop Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2" 
                aria-label="Toggle theme"
              >
                <svg className={`w-5 h-5 ${darkMode ? 'hidden' : 'block'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                </svg>
                <svg className={`w-5 h-5 ${darkMode ? 'block' : 'hidden'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay & Full Screen Menu */}
        <div className={`mobile-menu fixed top-0 left-0 w-screen h-screen bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold gradient-text">{data.sections.home.title}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-1 bg-white dark:bg-slate-900 overflow-y-auto">
              {data.nav.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500" 
                  aria-label="Toggle theme"
                >
                  <svg className={`w-5 h-5 ${darkMode ? 'hidden' : 'block'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                  </svg>
                  <svg className={`w-5 h-5 ${darkMode ? 'block' : 'hidden'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 dark:from-slate-900 dark:via-violet-900 dark:to-indigo-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl animate-fadeInUp">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {data.sections.home.title}
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl gradient-text font-semibold mb-6">
              {data.sections.home.subtitle}
            </p>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mb-10 leading-relaxed">
              {data.sections.home.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {data.sections.home.cta.map((cta, index) => (
                <button
                  key={index}
                  onClick={() => cta.target ? scrollToSection(cta.target) : window.open(cta.href)}
                  className={`group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 min-h-[44px] ${
                    index === 0 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white focus:ring-offset-purple-900' 
                      : 'glass hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 focus:ring-white focus:ring-offset-purple-900'
                  }`}
                  aria-label={cta.download ? "Download Edward Kemp's resume as PDF" : undefined}
                >
                  <svg className={`w-5 h-5 mr-2 ${index === 0 ? 'group-hover:rotate-12' : 'group-hover:animate-bounce'} transition-transform`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {index === 0 ? (
                      <>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </>
                    ) : (
                      <>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </>
                    )}
                  </svg>
                  {cta.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <main id="main-content">
        {/* About Section */}
        <section id="about" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">{data.sections.about.heading}</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.sections.about.text}
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">{data.sections.skills.heading}</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                {data.sections.skills.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.sections.skills.categories.map((category, index) => {
                const gradients = [
                  'from-violet-500 to-purple-600',
                  'from-cyan-500 to-blue-600', 
                  'from-emerald-500 to-green-600',
                  'from-amber-500 to-orange-600'
                ];
                const bgGradients = [
                  'from-violet-500/10 to-purple-500/10',
                  'from-cyan-500/10 to-blue-500/10',
                  'from-emerald-500/10 to-green-500/10', 
                  'from-amber-500/10 to-orange-500/10'
                ];
                
                return (
                  <div key={index} className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-4 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{category.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {category.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="skill-tag px-4 py-2 text-white text-sm font-medium rounded-full shadow-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">{data.sections.experience.heading}</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                A track record of delivering scalable solutions and leading technical initiatives across diverse industries and project types.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {data.sections.experience.entries.map((entry, index) => {
                const gradients = [
                  'from-violet-500 to-purple-600',
                  'from-cyan-500 to-blue-600',
                  'from-emerald-500 to-green-600', 
                  'from-amber-500 to-orange-600'
                ];
                const bgGradients = [
                  'from-violet-500/5 to-purple-500/5',
                  'from-cyan-500/5 to-blue-500/5',
                  'from-emerald-500/5 to-green-500/5',
                  'from-amber-500/5 to-orange-500/5'
                ];
                const textColors = [
                  'text-violet-600 dark:text-violet-400',
                  'text-cyan-600 dark:text-cyan-400',
                  'text-emerald-600 dark:text-emerald-400',
                  'text-amber-600 dark:text-amber-400'
                ];
                
                return (
                  <article key={index} className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:transform hover:-translate-y-2 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${gradients[index]} rounded-l-3xl`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="ml-6 relative z-10">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{entry.role}</h3>
                        <p className={`text-lg font-semibold mb-1 ${textColors[index]}`}>{entry.company}, {entry.location}</p>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{entry.period}</p>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <button
                onClick={() => window.open('./resume/Edward_Kemp_Resume.pdf')}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 min-h-[44px]"
              >
                <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                View Full Resume
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 dark:from-slate-900 dark:via-violet-900 dark:to-indigo-900 text-white relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">{data.sections.contact.heading}</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {data.sections.contact.text}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {data.sections.contact.items.map((item, index) => {
                const gradients = [
                  'from-violet-500 to-purple-600',
                  'from-cyan-500 to-blue-600',
                  'from-emerald-500 to-green-600'
                ];
                const hoverColors = [
                  'hover:text-violet-300',
                  'hover:text-cyan-300', 
                  ''
                ];
                const icons = [
                  <path key="phone" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>,
                  <path key="email" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
                  <path key="location" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                ];
                
                return (
                  <div key={index} className="group text-center p-8 glass hover:bg-white/20 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:-translate-y-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {icons[index]}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.type}</h3>
                    <p className="text-white/80">
                      {item.type === 'Phone' ? (
                        <a href={`tel:${item.value}`} className={`${hoverColors[index]} transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-purple-900 rounded-md px-2 py-1`}>
                          {item.value}
                        </a>
                      ) : item.type === 'Email' ? (
                        <a href={`mailto:${item.value}`} className={`${hoverColors[index]} transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-purple-900 rounded-md px-2 py-1`}>
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white/60 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold gradient-text mb-2">{data.sections.home.title}</p>
              <p>&copy; 2025 {data.sections.home.title}. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => window.open('./resume/Edward_Kemp_Resume.pdf')}
                className="text-white/60 hover:text-violet-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-2 py-1"
              >
                Resume
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white/60 hover:text-violet-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-2 py-1"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
