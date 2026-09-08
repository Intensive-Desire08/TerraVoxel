import { useEffect, useRef } from 'react';

export default function CarbonCreditsModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animState = 'FORMING'; 
    let cw, ch;
    let modalRect = { x: 0, y: 0, w: 840, h: 540 };
    let animationFrameId;

    const resize = () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
      modalRect.x = cw / 2 - modalRect.w / 2;
      modalRect.y = ch / 2 - modalRect.h / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    class Leaf {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        this.x = Math.random() * cw;
        this.y = initial ? -Math.random() * ch - 100 : -50;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = Math.random() * 2 + 2;
        this.size = Math.random() * 15 + 8;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.15;
        
        const greens = ['#059669', '#047857', '#064e3b', '#10b981', '#34d399'];
        this.color = greens[Math.floor(Math.random() * greens.length)];
        this.opacity = Math.random() * 0.4 + 0.6;
        
        this.targetX = modalRect.x + Math.random() * modalRect.w;
        this.targetY = modalRect.y + Math.random() * modalRect.h;
        this.inPosition = false;
      }

      update() {
        if (animState === 'FORMING') {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist > 15) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
            this.angle += this.spin;
          } else {
            this.inPosition = true;
          }
        } else if (animState === 'DISSOLVING') {
          this.inPosition = false;
          this.vy += 0.05; 
          this.x += this.vx + Math.sin(this.y * 0.01) * 2;
          this.y += this.vy;
          this.angle += this.spin * 1.5;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 1800; i++) {
        particles.push(new Leaf());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);
      
      let allInPosition = true;
      particles.forEach(p => {
        p.update();
        p.draw();
        if (!p.inPosition) allInPosition = false;
      });
      
      if (animState === 'FORMING' && allInPosition) {
        animState = 'FORMED';
        const modalContent = document.getElementById('carbon-modal-content');
        if (modalContent) modalContent.style.opacity = 1;
      }
      
      if (animState !== 'IDLE') {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    initParticles();
    animate();

    const handleCloseClick = () => {
      animState = 'DISSOLVING';
      const modalContent = document.getElementById('carbon-modal-content');
      if (modalContent) modalContent.style.opacity = 0;
      
      setTimeout(() => {
        animState = 'IDLE';
        ctx.clearRect(0, 0, cw, ch);
        onClose();
      }, 2500);
    };

    // Bind close logic to the DOM button we render
    const closeBtn = document.getElementById('carbon-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', handleCloseClick);

    return () => {
      window.removeEventListener('resize', resize);
      if (closeBtn) closeBtn.removeEventListener('click', handleCloseClick);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="carbon-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} id="leaves-canvas" className="absolute inset-0 z-0 pointer-events-none"></canvas>
      
      <div id="carbon-modal-content" className="relative z-10 w-full max-w-3xl flex flex-col justify-center items-center text-center p-8 transition-opacity duration-1000 opacity-0 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white font-headline mb-6 tracking-tight drop-shadow-md">How Carbon Credits Actually Work</h2>
        <div className="text-white/95 text-lg leading-relaxed space-y-4 bg-emerald-950/80 p-10 backdrop-blur-md border border-emerald-400/40 shadow-2xl font-sans text-left">
          <p>It’s a pretty straightforward exchange. Trees naturally pull carbon pollution out of the air as they grow. When you plant trees on empty or degraded land, you earn <strong>"carbon credits"</strong> based on how much carbon your new forest captures. Big companies that can't easily reduce their own pollution will buy these credits from you to balance things out. Basically, you get paid to restore the environment.</p>
          
          <p className="font-bold text-emerald-200 text-2xl pt-4">What You Can Do Today</p>
          <p>Right now, you can find out if your empty land is a good fit. Just enter your location, and our tool will check the local soil and weather to tell you exactly what kind of trees to plant, how much it will cost to get started, and the potential profit you could make over the next decade.</p>
        </div>
        <button id="carbon-modal-close" className="mt-8 border border-white bg-emerald-900/40 backdrop-blur-sm text-white px-8 py-3 font-label-code text-xs tracking-wider hover:bg-white hover:text-emerald-brand transition-colors font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
          ACKNOWLEDGE & CLOSE
        </button>
      </div>
    </div>
  );
}
