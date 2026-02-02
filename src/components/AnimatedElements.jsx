import React, { useEffect, useState, useRef } from 'react';

// Floating Food Icons Animation
export const FloatingFoods = () => {
  const foods = ['🍕', '🍔', '🍟', '🌮', '🍜', '🍣', '🍰', '🍩', '🥗', '🍝', '☕', '🧁', '🥤', '🍱'];
  
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = foods.map((food, i) => ({
      id: i,
      emoji: food,
      left: Math.random() * 100,
      animationDuration: 15 + Math.random() * 20,
      animationDelay: Math.random() * 10,
      size: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float-up"
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

// Promo Ticker / Marquee
export const PromoTicker = ({ messages = [] }) => {
  const defaultMessages = [
    "🔥 FREE DELIVERY on orders above ₹500!",
    "🎉 Use code WELCOME10 for 10% off your first order!",
    "⚡ Lightning fast delivery in 30 minutes!",
    "🍕 New arrivals: Check out our Chef's Special menu!",
    "💝 Weekend Special: Buy 1 Get 1 Free on select items!",
    "🌟 Rated 4.8★ by 10,000+ happy customers!",
  ];

  const promos = messages.length > 0 ? messages : defaultMessages;
  const duplicatedPromos = [...promos, ...promos]; // Duplicate for seamless loop

  return (
    <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {duplicatedPromos.map((message, index) => (
          <span key={index} className="mx-8 text-sm font-semibold inline-flex items-center">
            {message}
            <span className="mx-8 text-orange-300">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Scroll Reveal Animation Wrapper
export const ScrollReveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.9)';
      default: return 'translateY(40px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Animated Counter
export const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Pulse Ring Animation (for buttons/icons)
export const PulseRing = ({ children, color = 'orange' }) => {
  const colorClasses = {
    orange: 'bg-orange-400',
    red: 'bg-red-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
  };

  return (
    <div className="relative inline-flex">
      <div className={`absolute inset-0 ${colorClasses[color]} rounded-full animate-ping opacity-30`} />
      <div className={`absolute inset-0 ${colorClasses[color]} rounded-full animate-pulse opacity-20`} />
      {children}
    </div>
  );
};

// Sparkle Effect
export const SparkleText = ({ children, className = '' }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span className="absolute -top-1 -right-1 text-yellow-400 animate-sparkle text-xs">✨</span>
      <span className="absolute -bottom-1 -left-1 text-yellow-400 animate-sparkle-delayed text-xs">✨</span>
    </span>
  );
};

// Bouncing Arrow
export const BouncingArrow = ({ direction = 'down' }) => {
  const rotations = {
    up: 'rotate-180',
    down: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <div className={`animate-bounce ${rotations[direction]}`}>
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
};

// Gradient Text Animation
export const GradientText = ({ children, className = '' }) => {
  return (
    <span className={`bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% ${className}`}>
      {children}
    </span>
  );
};

// Loading Dots
export const LoadingDots = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

// Confetti Explosion (for order success)
export const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'];
  
  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: 50 + (Math.random() - 0.5) * 100,
        animationDuration: 1 + Math.random() * 2,
        size: 5 + Math.random() * 10,
        angle: Math.random() * 360,
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 3000);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '50%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.animationDuration}s`,
            transform: `rotate(${particle.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Ripple Effect Button
export const RippleButton = ({ children, onClick, className = '' }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
};

// Wave Divider
export const WaveDivider = ({ color = '#fff', flip = false }) => {
  return (
    <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-16"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill={color}
          className="animate-wave"
        />
      </svg>
    </div>
  );
};

// Typing Effect
export const TypeWriter = ({ texts, speed = 100, pauseDuration = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pauseDuration]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="animate-blink ml-1 text-orange-500">|</span>
    </span>
  );
};
