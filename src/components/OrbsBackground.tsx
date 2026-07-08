import { useEffect, useRef } from 'react';
import { useStore } from '../store';

export default function OrbsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { themeMode } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position with lerped targets for organic parallax
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Orb definition with luxury shades based on current theme
    interface Orb {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color1: string;
      color2: string;
      baseX: number;
      baseY: number;
      noiseScale: number;
      angle: number;
    }

    let orbs: Orb[] = [];

    if (themeMode === 'galaxy') {
      // Cosmic Nebula Colors
      orbs = [
        {
          x: width * 0.25,
          y: height * 0.25,
          vx: 0.12,
          vy: 0.08,
          radius: Math.min(width, height) * 0.55,
          color1: 'rgba(99, 102, 241, 0.15)', // Indigo Nebula
          color2: 'rgba(0, 0, 0, 0)',
          baseX: width * 0.25,
          baseY: height * 0.25,
          noiseScale: 60,
          angle: 0,
        },
        {
          x: width * 0.75,
          y: height * 0.35,
          vx: -0.08,
          vy: 0.1,
          radius: Math.min(width, height) * 0.6,
          color1: 'rgba(168, 85, 247, 0.14)', // Purple Galaxy
          color2: 'rgba(0, 0, 0, 0)',
          baseX: width * 0.75,
          baseY: height * 0.35,
          noiseScale: 70,
          angle: Math.PI / 4,
        },
        {
          x: width * 0.5,
          y: height * 0.8,
          vx: 0.05,
          vy: -0.12,
          radius: Math.min(width, height) * 0.5,
          color1: 'rgba(236, 72, 153, 0.1)', // Pink Stardust
          color2: 'rgba(0, 0, 0, 0)',
          baseX: width * 0.5,
          baseY: height * 0.8,
          noiseScale: 50,
          angle: Math.PI / 2,
        }
      ];
    } else if (themeMode === 'dark') {
      // Dark Slate Mode Colors
      orbs = [
        {
          x: width * 0.2,
          y: height * 0.3,
          vx: 0.15,
          vy: 0.1,
          radius: Math.min(width, height) * 0.4,
          color1: 'rgba(128, 203, 196, 0.08)', // Faint Teal
          color2: 'rgba(0, 0, 0, 0)',
          baseX: width * 0.2,
          baseY: height * 0.3,
          noiseScale: 40,
          angle: 0,
        },
        {
          x: width * 0.8,
          y: height * 0.25,
          vx: -0.1,
          vy: 0.12,
          radius: Math.min(width, height) * 0.45,
          color1: 'rgba(186, 104, 200, 0.06)', // Faint Violet
          color2: 'rgba(0, 0, 0, 0)',
          baseX: width * 0.8,
          baseY: height * 0.25,
          noiseScale: 50,
          angle: Math.PI / 3,
        }
      ];
    } else {
      // Light Mode Luxury Pastel shades
      orbs = [
        {
          x: width * 0.2,
          y: height * 0.3,
          vx: 0.15,
          vy: 0.1,
          radius: Math.min(width, height) * 0.4,
          color1: 'rgba(230, 215, 255, 0.35)', // Soft Lavender
          color2: 'rgba(255, 255, 255, 0)',
          baseX: width * 0.2,
          baseY: height * 0.3,
          noiseScale: 40,
          angle: 0,
        },
        {
          x: width * 0.8,
          y: height * 0.25,
          vx: -0.1,
          vy: 0.12,
          radius: Math.min(width, height) * 0.45,
          color1: 'rgba(255, 222, 210, 0.35)', // Peach Blush
          color2: 'rgba(255, 255, 255, 0)',
          baseX: width * 0.8,
          baseY: height * 0.25,
          noiseScale: 50,
          angle: Math.PI / 3,
        },
        {
          x: width * 0.45,
          y: height * 0.75,
          vx: 0.08,
          vy: -0.14,
          radius: Math.min(width, height) * 0.5,
          color1: 'rgba(215, 248, 240, 0.35)', // Warm Mint
          color2: 'rgba(255, 255, 255, 0)',
          baseX: width * 0.45,
          baseY: height * 0.75,
          noiseScale: 60,
          angle: (Math.PI * 2) / 3,
        }
      ];
    }

    // Stars & Dust Particles Floating
    interface Particle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speedY: number;
      speedX: number;
      wobbleSpeed: number;
      wobbleAmount: number;
      angle: number;
      twinkleSpeed?: number;
      twinklePhase?: number;
    }

    const particleCount = themeMode === 'galaxy' ? 45 : 24;

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: themeMode === 'galaxy' 
        ? Math.random() * 2.5 + 0.5 
        : Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: themeMode === 'galaxy' 
        ? -(Math.random() * 0.12 + 0.04) // slower star drift
        : -(Math.random() * 0.25 + 0.1),
      speedX: Math.random() * 0.15 - 0.075,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      wobbleAmount: Math.random() * 1.5 + 0.5,
      angle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2
    }));

    // Animation Loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates for lazy elastic follow
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // Mouse Parallax factor
      const parallaxX = (mouse.x - width / 2) * 0.035;
      const parallaxY = (mouse.y - height / 2) * 0.035;

      // Draw and update Orbs
      orbs.forEach((orb) => {
        orb.angle += 0.002;
        const driftX = Math.sin(orb.angle) * orb.noiseScale;
        const driftY = Math.cos(orb.angle * 1.2) * orb.noiseScale;

        const targetX = orb.baseX + driftX + parallaxX;
        const targetY = orb.baseY + driftY + parallaxY;

        orb.x += (targetX - orb.x) * 0.05;
        orb.y += (targetY - orb.y) * 0.05;

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        grad.addColorStop(0, orb.color1);
        grad.addColorStop(1, orb.color2);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update delicate sand-dust/stars
      particles.forEach((p) => {
        p.y += p.speedY;
        p.angle += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.angle) * 0.15;

        if (p.twinklePhase !== undefined && p.twinkleSpeed !== undefined) {
          p.twinklePhase += p.twinkleSpeed;
        }

        // Reset if drifted off screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        let finalAlpha = p.alpha;
        if (themeMode === 'galaxy' && p.twinklePhase !== undefined) {
          // Beautiful twinkling amplitude
          finalAlpha = p.alpha * (0.4 + 0.6 * Math.sin(p.twinklePhase));
        }

        if (themeMode === 'galaxy') {
          // Star Glow Sparkle
          ctx.fillStyle = `rgba(224, 231, 255, ${finalAlpha})`;
          ctx.shadowColor = 'rgba(165, 180, 252, 0.7)';
          ctx.shadowBlur = p.size > 1.8 ? 8 : 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (themeMode === 'dark') {
          ctx.fillStyle = `rgba(129, 230, 217, ${finalAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Warm sand-dust Light Mode
          ctx.fillStyle = `rgba(180, 160, 130, ${finalAlpha})`;
          ctx.shadowColor = 'rgba(230, 200, 160, 0.4)';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeMode]);

  const getCanvasBgClass = () => {
    if (themeMode === 'galaxy') {
      return 'bg-[#05040F]';
    }
    if (themeMode === 'dark') {
      return 'bg-[#0E0D12]';
    }
    return 'bg-[#FAF8F5]'; // Luxury off-white
  };

  const getBlendMode = () => {
    if (themeMode === 'galaxy' || themeMode === 'dark') {
      return 'screen';
    }
    return 'multiply';
  };

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-all duration-700 ${getCanvasBgClass()}`}
      style={{ mixBlendMode: getBlendMode() }}
    />
  );
}
