import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const CricketHeroAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stageText, setStageText] = useState('Run-up & Delivery');
  const [runsHighlight, setRunsHighlight] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0; // time in frames (60fps)
    const cycleDuration = 360; // 6 seconds per full sequence

    const render = () => {
      if (!isPlaying) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      t = (t + 1) % cycleDuration;
      const progress = t / cycleDuration; // 0 to 1

      // Canvas dimensions
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Pitch geometry
      const pitchY = h * 0.72;
      const pitchStartX = w * 0.15;
      const pitchEndX = w * 0.85;

      // 1. Draw subtle pitch ground
      ctx.save();
      const pitchGrad = ctx.createLinearGradient(0, pitchY - 10, 0, pitchY + 30);
      pitchGrad.addColorStop(0, '#1E2C48');
      pitchGrad.addColorStop(1, '#0C1322');
      ctx.fillStyle = pitchGrad;
      ctx.beginPath();
      ctx.ellipse(w / 2, pitchY + 10, (pitchEndX - pitchStartX) * 0.6, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pitch strip
      ctx.fillStyle = '#C2B280';
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(pitchStartX + 40, pitchY - 4);
      ctx.lineTo(pitchEndX - 40, pitchY - 4);
      ctx.lineTo(pitchEndX - 20, pitchY + 6);
      ctx.lineTo(pitchStartX + 20, pitchY + 6);
      ctx.closePath();
      ctx.fill();

      // Popping creases
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(pitchStartX + 60, pitchY - 6);
      ctx.lineTo(pitchStartX + 60, pitchY + 8);
      ctx.moveTo(pitchEndX - 60, pitchY - 6);
      ctx.lineTo(pitchEndX - 60, pitchY + 8);
      ctx.stroke();

      // Stumps (Non-striker & Striker)
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#E2E8F0';
      // Non-striker wickets (left)
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(pitchStartX + 52 + i * 4, pitchY - 26, 2, 26);
      }
      ctx.fillRect(pitchStartX + 50, pitchY - 27, 12, 2); // Bails

      // Striker wickets (right)
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(pitchEndX - 56 + i * 4, pitchY - 26, 2, 26);
      }
      ctx.fillRect(pitchEndX - 58, pitchY - 27, 12, 2); // Bails

      ctx.restore();

      // SEQUENCE TIMELINE
      // Stage 1 (0 to 90): Bowler run-up from left to delivery crease
      // Stage 2 (90 to 160): Ball trajectory toward batsman with motion blur
      // Stage 3 (160 to 180): Batsman swing and high-impact contact
      // Stage 4 (180 to 280): Ball races to boundary
      // Stage 5 (280 to 360): Scoreboard pulse & boundary display

      let bowlerX = pitchStartX - 60;
      let bowlerArmAngle = 0;

      let batsmanBatAngle = -0.2;
      let contactOccurred = false;

      let ballX = 0;
      let ballY = 0;
      let ballVisible = false;
      let ballTrail: { x: number; y: number; alpha: number }[] = [];

      if (t < 90) {
        // Stage 1: Bowler running up
        const p1 = t / 90;
        bowlerX = pitchStartX - 80 + p1 * 130;
        bowlerArmAngle = Math.sin(p1 * Math.PI * 4) * 0.8;
        if (p1 > 0.8) {
          bowlerArmAngle = (p1 - 0.8) * 15; // Arm windmill release
        }
        setStageText('Bowler in delivery stride...');
        setRunsHighlight(null);
      } else if (t >= 90 && t < 165) {
        // Stage 2: Ball flying to striker
        const p2 = (t - 90) / 75;
        bowlerX = pitchStartX + 50;
        bowlerArmAngle = Math.PI * 1.2;

        const startX = pitchStartX + 55;
        const startY = pitchY - 35;
        const bounceX = pitchStartX + (pitchEndX - pitchStartX) * 0.65;
        const bounceY = pitchY;
        const endX = pitchEndX - 45;
        const endY = pitchY - 18;

        if (p2 < 0.65) {
          // Pre-bounce
          const subP = p2 / 0.65;
          ballX = startX + (bounceX - startX) * subP;
          ballY = startY + (bounceY - startY) * (subP * subP);
        } else {
          // Post-bounce
          const subP = (p2 - 0.65) / 0.35;
          ballX = bounceX + (endX - bounceX) * subP;
          ballY = bounceY + (endY - bounceY) * subP - Math.sin(subP * Math.PI) * 14;
        }

        ballVisible = true;
        setStageText('Good length delivery traveling at 144 km/h');
      } else if (t >= 165 && t < 185) {
        // Stage 3: Batter swings bat and makes contact!
        bowlerX = pitchStartX + 50;
        contactOccurred = true;
        const p3 = (t - 165) / 20;
        batsmanBatAngle = -0.2 + p3 * 1.8; // Downswing across the line

        ballX = pitchEndX - 45 + p3 * 20;
        ballY = pitchY - 18 - p3 * 10;
        ballVisible = true;
        setStageText('Mighty cover drive into the gap!');
      } else if (t >= 185 && t < 280) {
        // Stage 4: Ball travels to the boundary
        bowlerX = pitchStartX + 50;
        batsmanBatAngle = 1.4; // Follow through

        const p4 = (t - 185) / 95;
        const hitStartX = pitchEndX - 25;
        const hitStartY = pitchY - 28;
        const boundaryX = w * 0.96;
        const boundaryY = pitchY - 45;

        ballX = hitStartX + (boundaryX - hitStartX) * p4;
        ballY = hitStartY + (boundaryY - hitStartY) * p4 - Math.sin(p4 * Math.PI) * 20;
        ballVisible = true;
        setStageText('Ball racing across the turf to the boundary rope...');
      } else {
        // Stage 5: Four signalled!
        bowlerX = pitchStartX + 50;
        batsmanBatAngle = 1.2;
        ballVisible = false;
        setStageText('BOUNDARY! 4 Runs to the total');
        setRunsHighlight(4);
      }

      // Draw Bowler Silhouette (Left)
      ctx.save();
      ctx.translate(bowlerX, pitchY - 8);
      ctx.fillStyle = '#B8FF4D';
      ctx.shadowColor = '#B8FF4D';
      ctx.shadowBlur = 8;
      // Head
      ctx.beginPath();
      ctx.arc(0, -50, 7, 0, Math.PI * 2);
      ctx.fill();
      // Torso
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#B8FF4D';
      ctx.beginPath();
      ctx.moveTo(0, -43);
      ctx.lineTo(-4, -20);
      ctx.stroke();
      // Legs
      ctx.beginPath();
      ctx.moveTo(-4, -20);
      ctx.lineTo(-12, 8);
      ctx.moveTo(-4, -20);
      ctx.lineTo(8, 6);
      ctx.stroke();
      // Bowling Arm
      ctx.save();
      ctx.translate(0, -40);
      ctx.rotate(bowlerArmAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -22);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // Draw Batsman Silhouette (Right)
      ctx.save();
      const batsmanX = pitchEndX - 42;
      ctx.translate(batsmanX, pitchY - 8);
      ctx.fillStyle = '#37D5F5';
      ctx.strokeStyle = '#37D5F5';
      ctx.shadowColor = '#37D5F5';
      ctx.shadowBlur = 8;
      // Head with helmet shape
      ctx.beginPath();
      ctx.arc(0, -52, 7.5, 0, Math.PI * 2);
      ctx.fill();
      // Visor
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -50);
      ctx.lineTo(9, -48);
      ctx.stroke();
      // Torso leaning into shot
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(3, -20);
      ctx.stroke();
      // Stance legs
      ctx.beginPath();
      ctx.moveTo(3, -20);
      ctx.lineTo(-10, 8); // Back leg
      ctx.moveTo(3, -20);
      ctx.lineTo(12, 8); // Front stride
      ctx.stroke();

      // Batsman's Bat
      ctx.save();
      ctx.translate(2, -36);
      ctx.rotate(batsmanBatAngle);
      // Handle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 10);
      ctx.stroke();
      // Blade
      ctx.fillStyle = '#F59E0B';
      ctx.shadowColor = '#F59E0B';
      ctx.fillRect(-2.5, 10, 5, 24);
      ctx.restore();

      ctx.restore();

      // Impact Sparks at contact point
      if (contactOccurred && t >= 165 && t < 185) {
        ctx.save();
        const sparkCenterX = pitchEndX - 40;
        const sparkCenterY = pitchY - 24;
        ctx.strokeStyle = '#B8FF4D';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#B8FF4D';
        ctx.shadowBlur = 15;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const len = 6 + Math.random() * 12;
          ctx.beginPath();
          ctx.moveTo(sparkCenterX, sparkCenterY);
          ctx.lineTo(sparkCenterX + Math.cos(angle) * len, sparkCenterY + Math.sin(angle) * len);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Ball & Subtle Motion Trail
      if (ballVisible) {
        ctx.save();
        // Motion Trail
        ctx.strokeStyle = '#B8FF4D';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.45;
        ctx.shadowColor = '#B8FF4D';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(ballX - 16, ballY + 4);
        ctx.lineTo(ballX, ballY);
        ctx.stroke();

        // Ball itself (Red leather ball with subtle white seam)
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#DC2626';
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Seam line
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4.5, 0.4, Math.PI + 0.4);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#080D1B] to-[#080D1B] border border-white/10 shadow-2xl">
      {/* Stadium Floodlights & Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-36 bg-[#37D5F5]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 right-1/4 w-96 h-36 bg-[#B8FF4D]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Canvas Scene */}
      <canvas
        ref={canvasRef}
        width={960}
        height={260}
        className="w-full h-[220px] sm:h-[260px] object-cover block"
      />

      {/* Simulation Info Strip */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B8FF4D] animate-ping" />
          <span className="font-mono text-slate-200">{stageText}</span>
        </div>

        <div className="flex items-center gap-3">
          {runsHighlight && (
            <span className="bg-[#B8FF4D] text-[#080D1B] font-extrabold px-2.5 py-0.5 rounded text-xs tracking-wider animate-bounce">
              +{runsHighlight} RUNS
            </span>
          )}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
