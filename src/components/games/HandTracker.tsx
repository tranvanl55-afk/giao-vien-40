import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

interface HandTrackerProps {
  onDetectedFingers: (count: number) => void;
}

export const HandTracker: React.FC<HandTrackerProps> = ({ onDetectedFingers }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Track stable finger count over time
  const lastFingerCount = useRef<number>(0);
  const stableStartTime = useRef<number>(0);

  useEffect(() => {
    let handLandmarker: HandLandmarker;
    let animationFrameId: number;
    let stream: MediaStream;

    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
        );
        
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        setIsLoaded(true);
        startCamera();
      } catch (err: any) {
        console.error("Error loading MediaPipe:", err);
        setError("Không thể tải mô hình AI: " + err.message);
      }
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: "user" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (err: any) {
        setError("Không thể truy cập Camera. Vui lòng cấp quyền.");
      }
    };

    let lastVideoTime = -1;
    const predictWebcam = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !handLandmarker) return;

      // Ensure video is ready and has valid dimensions to avoid MediaPipe ROI assertion error
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameId = requestAnimationFrame(predictWebcam);
        return;
      }

      // Sync canvas dimensions to match video stream
      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        
        const startTimeMs = performance.now();
        let results;
        try {
          results = handLandmarker.detectForVideo(video, startTimeMs);
        } catch (detectErr) {
          console.warn("HandLandmarker detection error:", detectErr);
          animationFrameId = requestAnimationFrame(predictWebcam);
          return;
        }

        // Draw results
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0]; // First hand

            // Draw landmarks for debug/feedback
            ctx.fillStyle = "#00FF00";
            for (const lm of landmarks) {
              ctx.beginPath();
              ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fill();
            }

            // Count fingers
            let count = 0;
            const dist = (p1: any, p2: any) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const wrist = landmarks[0];

            // Thumb (tip 4, mcp 2)
            if (dist(wrist, landmarks[4]) > dist(wrist, landmarks[2])) count++;
            
            // Index (tip 8, pip 6)
            if (dist(wrist, landmarks[8]) > dist(wrist, landmarks[6])) count++;
            
            // Middle (tip 12, pip 10)
            if (dist(wrist, landmarks[12]) > dist(wrist, landmarks[10])) count++;
            
            // Ring (tip 16, pip 14)
            if (dist(wrist, landmarks[16]) > dist(wrist, landmarks[14])) count++;
            
            // Pinky (tip 20, pip 18)
            if (dist(wrist, landmarks[20]) > dist(wrist, landmarks[18])) count++;

            // Draw count text
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            const text = count.toString();
            ctx.strokeText(text, 50, 80);
            ctx.fillText(text, 50, 80);

            // Stable detection logic
            if (count > 0 && count === lastFingerCount.current) {
              if (performance.now() - stableStartTime.current > 1500) {
                onDetectedFingers(count);
                stableStartTime.current = performance.now();
              } else {
                const progress = (performance.now() - stableStartTime.current) / 1500;
                ctx.beginPath();
                ctx.arc(100, 60, 30, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                ctx.strokeStyle = "#00FFFF";
                ctx.lineWidth = 6;
                ctx.stroke();
              }
            } else {
              lastFingerCount.current = count;
              stableStartTime.current = performance.now();
            }
          } else {
            lastFingerCount.current = 0;
          }
          ctx.restore();
        }
      }
      
      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    initMediaPipe();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (handLandmarker) {
        handLandmarker.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-cyan-400 font-medium">Đang tải mô hình AI nhận diện tay...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10 px-6 text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      <video 
        ref={videoRef} 
        className="absolute w-full h-full object-cover" 
        autoPlay 
        playsInline 
        muted 
        style={{ transform: 'scaleX(-1)' }} // Mirror video
      />
      
      <canvas 
        ref={canvasRef} 
        className="absolute w-full h-full object-cover"
        width={640}
        height={480}
        style={{ transform: 'scaleX(-1)' }} // Mirror canvas to match video
      />

      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="bg-black/50 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-white/80 text-sm border border-white/10">
          Giơ tay rõ ràng trước ống kính và giữ yên trong 1.5 giây
        </p>
      </div>
    </div>
  );
};
