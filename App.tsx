import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ACHIEVEMENTS, MAIN_POSTER_CONFIG, HARDCODED_POEM } from './constants';
import PosterCard from './components/PosterCard';
import { generatePosterImage, generateSpecificImage } from './services/geminiService';
import { AIPoemResponse } from './types';

/** 
 * Thành phần Fireworks: Tạo hiệu ứng pháo hoa rực rỡ và lãng mạn trên Canvas.
 * Bao gồm cả pháo hoa hình tròn truyền thống và pháo hoa hình trái tim.
 */
const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number; y: number; sx: number; sy: number; color: string; life: number; size: number;
      twinkle: boolean;
      
      constructor(x: number, y: number, color: string, isHeart: boolean = false, angle: number = 0) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = 1;
        this.size = Math.random() * 2 + 1;
        this.twinkle = Math.random() > 0.8;

        if (isHeart) {
          // Công thức toán học tạo hình trái tim lãng mạn
          const t = angle;
          const heartX = 16 * Math.pow(Math.sin(t), 3);
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const force = 0.18 + Math.random() * 0.05;
          this.sx = heartX * force;
          this.sy = heartY * force;
        } else {
          const a = Math.random() * Math.PI * 2;
          const s = Math.random() * 5 + 2;
          this.sx = Math.cos(a) * s;
          this.sy = Math.sin(a) * s;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        const opacity = this.twinkle ? (Math.random() > 0.5 ? this.life : this.life * 0.3) : this.life;
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = this.twinkle ? 15 : 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.sx;
        this.y += this.sy;
        this.sy += 0.08; // Trọng lực
        this.life -= 0.012; // Phai dần
      }
    }

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.1);
      const isHeart = Math.random() > 0.4; // 60% cơ hội nổ hình trái tim
      const colors = ['#ff1e56', '#ffacb7', '#ffd700', '#ffffff', '#e879f9'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const count = isHeart ? 100 : 70;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        particles.push(new Particle(x, y, color, isHeart, angle));
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 2, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.07) createFirework();
      
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

/**
 * Thành phần RosePetals: Tạo những cánh hoa hồng rơi lãng mạn.
 */
const RosePetals = () => {
  const petals = useMemo(() => [...Array(40)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 14 + Math.random() * 20,
    delay: Math.random() * 20,
    duration: 12 + Math.random() * 15,
    isDark: Math.random() > 0.5,
    rotation: Math.random() * 360,
    sway: 40 + Math.random() * 60
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map(p => (
        <div 
          key={p.id}
          className={`rose-petal ${p.isDark ? 'bg-rose-600' : 'bg-pink-400/80'}`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--sway-amount': `${p.sway}px`,
            '--init-rotate': `${p.rotation}deg`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [aiContent] = useState<AIPoemResponse>(HARDCODED_POEM);
  const [posterImg, setPosterImg] = useState<string | null>(MAIN_POSTER_CONFIG.imageUrl || null);
  const [achievementBgs, setAchievementBgs] = useState<Record<string, string | null>>(() => {
    const initialBgs: Record<string, string | null> = {};
    ACHIEVEMENTS.forEach(ach => {
      initialBgs[ach.id] = ach.imageUrl || null;
    });
    return initialBgs;
  });
  const [loading, setLoading] = useState(true);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    // Tự động ẩn pháo hoa sau 10 giây để nhìn rõ nội dung
    const fwTimer = setTimeout(() => setShowFireworks(false), 10000);

    const fetchData = async () => {
      setLoading(true);
      try {
        const mainImgPromise = !MAIN_POSTER_CONFIG.imageUrl 
          ? generatePosterImage(MAIN_POSTER_CONFIG.imagePrompt) 
          : Promise.resolve(MAIN_POSTER_CONFIG.imageUrl);

        const bgPromises = ACHIEVEMENTS.map(async (ach) => {
          if (ach.imageUrl) return { id: ach.id, img: ach.imageUrl };
          const img = await generateSpecificImage(ach.imagePrompt);
          return { id: ach.id, img };
        });

        const [mainImg, ...bgs] = await Promise.all([
          mainImgPromise,
          ...bgPromises
        ]);
        
        if (mainImg) setPosterImg(mainImg);
        
        const bgsMap: Record<string, string | null> = {};
        bgs.forEach(item => {
          bgsMap[item.id] = item.img;
        });
        setAchievementBgs(bgsMap);
        
      } catch (err) {
        console.error("Failed to load visual magic", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => clearTimeout(fwTimer);
  }, []);

  return (
    <div className="min-h-screen text-[#fce7f3] selection:bg-rose-900/50 relative font-body bg-[#08020a]">
      {showFireworks && <Fireworks />}
      <RosePetals />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl">
          <div className="flex justify-center mb-12 animate-pulse">
             <span className="inline-block px-10 py-3 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-[11px] font-black tracking-[0.5em] uppercase backdrop-blur-xl">
              2025 • HÀNH TRÌNH HẠNH PHÚC
            </span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-romantic-main font-bold mb-12 gradient-text leading-none drop-shadow-2xl">
            Thành Tựu <br className="md:hidden" /> 2025
          </h1>
          
          <p className="text-2xl md:text-5xl font-calligraphy text-rose-200/95 mb-14 max-w-4xl mx-auto leading-relaxed italic px-4">
            "Khi những giấc mơ đẹp nhất về em đều trở thành sự thật trong năm nay..."
          </p>
          
          <div className="flex justify-center gap-6 mt-8">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,114,182,1)]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20"></div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-40">
           <span className="text-[10px] tracking-widest font-black uppercase">Cuộn để xem tiếp</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-rose-500 to-transparent"></div>
        </div>
      </section>

      {/* Achievement Grid */}
      <section id="poster-grid" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28">
            <h2 className="text-7xl md:text-9xl font-calligraphy font-bold text-white mb-8">Những cột mốc ngọt ngào</h2>
            <p className="font-serif-elegant italic text-rose-300/60 text-xl tracking-widest">Ghi dấu lại từng khoảnh khắc đáng nhớ nhất của chúng ta</p>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {ACHIEVEMENTS.map((achievement, index) => (
              <PosterCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index} 
                bgImage={achievementBgs[achievement.id]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Poetry & Final Poster */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#120616]/90 backdrop-blur-3xl rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/5 soft-glow-box">
            <div className="relative h-[600px] md:h-[900px] group overflow-hidden bg-[#15051a]">
              {!posterImg ? (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-rose-400 font-bold tracking-[0.5em] text-xs animate-pulse">ĐANG VẼ LỜI YÊU CHO EM...</p>
                   </div>
                </div>
              ) : (
                <img 
                  src={posterImg} 
                  alt="Romantic Vision 2025" 
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                  style={{ opacity: posterImg ? 1 : 0, transition: 'opacity 1.5s ease-in-out' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120616] via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute top-12 right-12 bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl text-center shadow-2xl">
                 <p className="text-[10px] tracking-[0.4em] font-black text-rose-400 uppercase mb-2">Final Poster 2025</p>
                 <p className="text-2xl font-romantic-main text-white">Chương Hạnh Phúc</p>
              </div>
            </div>

            <div className="p-12 md:p-24 text-center md:text-left">
              <div className="mb-20">
                <div className="flex items-center justify-center md:justify-start gap-6 mb-12 opacity-80">
                  <div className="h-[1px] w-16 bg-rose-500"></div>
                  <h3 className="text-rose-400 font-bold uppercase tracking-[0.6em] text-xs">LỜI TỪ TRÁI TIM ANH</h3>
                </div>
                
                <div className="text-4xl md:text-[4.5rem] font-calligraphy text-white leading-[1.6] md:leading-[1.8] drop-shadow-2xl whitespace-pre-line italic">
                   {aiContent.poem}
                </div>
              </div>

              <div className="pt-16 border-t border-white/5 relative">
                <div className="absolute top-[-15px] left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-10 h-10 bg-[#120616] flex items-center justify-center">
                   <span className="text-rose-500 text-3xl">❦</span>
                </div>
                
                <p className="text-2xl md:text-3xl text-rose-100/80 font-serif-elegant italic leading-relaxed max-w-5xl mx-auto md:mx-0">
                  "{aiContent.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sweet Footer */}
      <footer className="py-48 text-center px-4 relative z-10 bg-black">
        <div className="text-7xl mb-12 icon-glow animate-bounce">❤️</div>
        <h2 className="text-white font-calligraphy text-7xl md:text-[10rem] mb-12 drop-shadow-2xl">
          Anh yêu em Trần Khánh Chi!
        </h2>
        <div className="flex flex-col items-center gap-6">
            <p className="font-serif-elegant text-rose-200/50 tracking-[0.4em] text-xl italic">Mãi mãi là bao xa? Là cho đến khi tim ngừng đập.</p>
            <p className="text-[11px] text-rose-500/40 tracking-[1em] font-black uppercase mt-12 border-y border-rose-500/10 py-4 px-8">Forever Yours • Anniversary 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
