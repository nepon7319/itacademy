'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  pulseSpeed: number;
  angle: number;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0,
    isHovering: false,
  });
  const wavesRef = useRef<Wave[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      // Density based on screen area
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 120);
      particlesRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.8 + 0.6;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size,
          baseSize: size,
          opacity: Math.random() * 0.45 + 0.15,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          angle: Math.random() * Math.PI * 2,
        };
      });
    };

    resize();
    window.addEventListener('resize', resize);

    let lastMouseX = -1000;
    let lastMouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;

      if (lastMouseX > 0) {
        mouse.vx = (e.clientX - lastMouseX) * 0.2;
        mouse.vy = (e.clientY - lastMouseY) * 0.2;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      wavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 180,
        opacity: 0.5,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Smooth mouse follow (LERP)
      if (mouse.isHovering) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // 1. Draw click shockwaves
      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.radius += 4;
        w.opacity *= 0.94;

        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${w.opacity * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (w.opacity < 0.01 || w.radius >= w.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // 2. Update and draw particles
      particles.forEach((p) => {
        // Natural pulse
        p.angle += p.pulseSpeed;
        const currentSize = p.baseSize + Math.sin(p.angle) * 0.4;

        // Interaction with mouse cursor
        if (mouse.isHovering) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 150;

          if (dist < influenceRadius && dist > 1) {
            // Repel / swirl force
            const force = (influenceRadius - dist) / influenceRadius;
            const normX = dx / dist;
            const normY = dy / dist;

            // Push outward
            p.vx -= normX * force * 0.08;
            p.vy -= normY * force * 0.08;

            // Drag along with mouse velocity
            p.vx += mouse.vx * force * 0.05;
            p.vy += mouse.vy * force * 0.05;

            // Enlarge slightly when close to cursor
            p.size = currentSize + force * 1.8;
          } else {
            p.size = currentSize;
          }
        } else {
          p.size = currentSize;
        }

        // Friction / damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Apply speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.2) {
          p.vx = (p.vx / speed) * 2.2;
          p.vy = (p.vy / speed) * 2.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Screen edge wrapping
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      // 3. Draw inter-particle constellation lines
      const maxConnDist = 110;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < maxConnDist) {
            const alpha = (1 - d / maxConnDist) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect particle to mouse if within distance
        if (mouse.isHovering) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          const mouseConnDist = 140;

          if (md < mouseConnDist) {
            const mAlpha = (1 - md / mouseConnDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 4. Subtle cursor ambient glow
      if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
