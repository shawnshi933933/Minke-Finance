import { useEffect, useRef } from 'react';

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let renderer: import('three').WebGLRenderer | null = null;

    const init = async () => {
      try {
        const THREE = await import('three');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (!mountRef.current) return;
        mountRef.current.appendChild(renderer.domElement);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 800;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color('#0088FE');
        const color2 = new THREE.Color('#59B9FF');

        for (let i = 0; i < particlesCount * 3; i += 3) {
          posArray[i] = (Math.random() - 0.5) * 100;
          posArray[i + 1] = (Math.random() - 0.5) * 100;
          posArray[i + 2] = (Math.random() - 0.5) * 50;

          const mixedColor = color1.clone().lerp(color2, Math.random());
          colorArray[i] = mixedColor.r;
          colorArray[i + 1] = mixedColor.g;
          colorArray[i + 2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          particleMesh.rotation.y += 0.0005;
          particleMesh.rotation.x += 0.0002;

          const positions = particleMesh.geometry.attributes.position.array as Float32Array;
          for (let i = 2; i < particlesCount * 3; i += 3) {
            positions[i] += 0.05;
            if (positions[i] > 30) positions[i] = -50;
          }
          particleMesh.geometry.attributes.position.needsUpdate = true;
          renderer!.render(scene, camera);
        };

        animate();

        const handleResize = () => {
          if (!renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
          if (mountRef.current && renderer) {
            try { mountRef.current.removeChild(renderer.domElement); } catch {}
          }
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          renderer?.dispose();
        };
      } catch {
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });

    return () => {
      cancelAnimationFrame(animationFrameId);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 hidden md:block"
      style={{ opacity: 0.8 }}
      aria-hidden="true"
    />
  );
}
