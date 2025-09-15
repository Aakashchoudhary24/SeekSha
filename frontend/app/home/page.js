'use client'
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ use Next.js Link
import { 
  Target, 
  BookOpen, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Users,
  Award,
  Globe,
  ArrowRight,
  Play,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 3D Scene Component
function ThreeJSScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let scene, camera, renderer, animationId;
    const currentMount = mountRef.current;
    
    const initThreeJS = async () => {
      const THREE = await import('three');
      
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.6);
      renderer.setClearColor(0x000000, 0);
      
      if (currentMount) {
        currentMount.appendChild(renderer.domElement);
      }

      const objects = [];
      
      // Book
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.2),
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })
      );
      book.position.set(-2, 1, 0);
      scene.add(book);
      objects.push(book);

      // Brain
      const brain = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshLambertMaterial({ color: 0x6B7C32 })
      );
      brain.position.set(2, 0, 0);
      scene.add(brain);
      objects.push(brain);

      // Lightbulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshLambertMaterial({ color: 0xFFD700 })
      );
      bulb.position.set(0, 2, 0);
      scene.add(bulb);
      objects.push(bulb);

      // Pencil
      const pencil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0xFF6347 })
      );
      pencil.position.set(-1, -1, 1);
      pencil.rotation.z = Math.PI / 4;
      scene.add(pencil);
      objects.push(pencil);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      camera.position.z = 5;
      setIsLoaded(true);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        objects.forEach((obj, index) => {
          obj.rotation.x += 0.01 * (index + 1);
          obj.rotation.y += 0.01 * (index + 1);
          obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        });

        renderer.render(scene, camera);
      };

      animate();
    };

    initThreeJS();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (currentMount && renderer) currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 flex items-center justify-center opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#F5F3F0' }}>
      {/* Background 3D Scene */}
      <ThreeJSScene />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-6 py-3 neumorphic rounded-full"
              >
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-semibold text-amber-700">Powered by AI • Backed by Research</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-900 leading-tight">
                Your Personalized
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                  Career & Education
                </span>
                <br />
                Advisor
              </h1>
              
              <p className="text-xl md:text-2xl text-amber-700 max-w-3xl mx-auto leading-relaxed">
                Discover your potential, explore career paths, and build your future with AI-powered guidance tailored just for you.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/quiz">
                <Button 
                  size="lg" 
                  className="neumorphic-button bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl text-lg font-semibold border-0 shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="neumorphic-button px-8 py-4 rounded-xl text-lg font-semibold border-0 text-amber-800"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {[
                { icon: Users, label: "Students Guided", value: "50,000+" },
                { icon: Award, label: "Career Paths", value: "500+" },
                { icon: Globe, label: "Languages", value: "12+" }
              ].map((stat, index) => (
                <div key={index} className="neumorphic p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 neumorphic-pressed rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-amber-700" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-amber-900">{stat.value}</div>
                      <div className="text-sm text-amber-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {/* unchanged */}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="neumorphic border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 neumorphic-pressed rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-10 h-10 text-yellow-600" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-amber-900">
                  Ready to Discover Your Path?
                </h2>
                
                <p className="text-xl text-amber-700 max-w-2xl mx-auto">
                  Join thousands of students who have found their perfect career match. Start your personalized journey today.
                </p>
                
                <Link href="/quiz">
                  <Button 
                    size="lg" 
                    className="neumorphic-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-4 rounded-xl text-lg font-semibold border-0 shadow-xl"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Begin Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
