/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface RainCanvasOverlayProps {
  density?: number; // 20 to 80
  className?: string;
  speed?: number;
}

export const RainCanvasOverlay: React.FC<RainCanvasOverlayProps> = ({
  density = 40,
  className = '',
  speed = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Rain drop particles
    interface Drop {
      x: number;
      y: number;
      l: number; // length
      xs: number; // x speed
      ys: number; // y speed
      opacity: number;
    }

    const drops: Drop[] = [];
    for (let i = 0; i < density; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 14 + 10,
        xs: -1.5 - Math.random() * 1.0, // slight left wind
        ys: (Math.random() * 10 + 12) * speed,
        opacity: Math.random() * 0.35 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#DCE7F5';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.globalAlpha = d.opacity;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.xs, d.y + d.l);
        ctx.stroke();

        d.x += d.xs;
        d.y += d.ys;

        if (d.x < -10 || d.y > height + 20) {
          d.x = Math.random() * (width + 50);
          d.y = -20;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-10 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};
