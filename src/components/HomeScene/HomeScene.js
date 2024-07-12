"use client"
import { useEffect, useRef } from "react";

const GridCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGridlines = () => {
      const maxX = window.innerWidth;
      const maxY = window.innerHeight;
      const yFactor = (window.innerHeight / 2) * (window.innerWidth / 2); 
      const numPoints = 1000;
      const step = maxX / numPoints;
      const numCurves = 40;
      const error = 40;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = `rgba(0, 51, 102, 0.7)`;
      ctx.lineWidth = 2; 

      // Draw the vertical and horizontal gridlines
      ctx.beginPath();
      ctx.moveTo(window.innerWidth / 2, 0); 
      ctx.lineTo(window.innerWidth / 2, window.innerHeight); 
      ctx.stroke();
      ctx.beginPath(); 
      ctx.moveTo(0, window.innerHeight / 2); 
      ctx.lineTo(window.innerWidth, window.innerHeight / 2);
      ctx.stroke(); 

      // Draw the diagonal gridlines
      const center = { x: canvas.width / 2, y: canvas.height / 2 };
      if (canvas.width < canvas.height) {
        ctx.beginPath(); 
        ctx.moveTo(0, center.y - center.x); 
        ctx.lineTo(canvas.width, center.y + center.x);
        ctx.stroke();
        ctx.beginPath(); 
        ctx.moveTo(0, center.x + center.y); 
        ctx.lineTo(canvas.width, center.y - center.x);
        ctx.stroke(); 
      } 
      else {
        ctx.beginPath(); 
        ctx.moveTo(center.x - center.y, 0);
        ctx.lineTo(canvas.width, center.x + center.y); 
        ctx.stroke(); 
        ctx.beginPath(); 
        ctx.moveTo(center.x + center.y, 0);
        ctx.lineTo(center.x - center.y, canvas.height); 
        ctx.stroke(); 
      }
      
      const drawHyperbolas = () => {
        for (let i = 0; i < numCurves; i++) {
          let x = 0;
          ctx.beginPath();
          while (x < maxX + error) {
            let y = (i * (yFactor) / numCurves) / x;
            if (y > 1 && y < maxY + error) {
              ctx.lineTo(x + window.innerWidth / 2, y + window.innerHeight / 2);
            }
            x += step;
          }
          ctx.stroke();
    
          x = 0;
          ctx.beginPath();
          while (x < maxX + error) {
            let y = (i * (yFactor) / numCurves) / x;
            if (y > 1 && y < maxY + error) {
              ctx.lineTo(x + window.innerWidth / 2, -y + window.innerHeight / 2);
            }
            x += step;
          }
          ctx.stroke();
    
          x = 0;
          ctx.beginPath();
          while (x < maxX + error) {
            let y = (i * (yFactor) / numCurves) / x;
            if (y > 1 && y < maxY + error) {
              ctx.lineTo(-x + window.innerWidth / 2, y + window.innerHeight / 2);
            }
            x += step;
          }
          ctx.stroke();
    
          x = 0;
          ctx.beginPath();
          while (x < maxX + error) {
            let y = (i * (yFactor) / numCurves) / x;
            if (y > 1 && y < maxY + error) {
              ctx.lineTo(-x + window.innerWidth / 2, -y + window.innerHeight / 2);
            }
            x += step;
          }
          ctx.stroke();
        }
      };
    
      drawHyperbolas();
      ctx.save();
      ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      ctx.rotate(Math.PI / 4);
      ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);
      drawHyperbolas();
      ctx.restore();
    };

    const handleResize = () => {
      setCanvasSize();
      drawGridlines();
    };
    
    window.addEventListener("resize", handleResize);
    
    setCanvasSize();
    drawGridlines();
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    }, []);
    
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
};

const HomeScene = () => {
  return (
    <div>
      <GridCanvas />
    </div>
  );
};

export default HomeScene;