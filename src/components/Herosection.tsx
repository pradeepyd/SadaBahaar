import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Music, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll('.animate-on-load');
    
    if (elements) {
      elements.forEach((el, index) => {
        setTimeout(() => {
          (el as HTMLElement).classList.add('animate-fade-in');
        }, index * 100);
      });
    }
    
    return () => {};
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background elements with waveform-like shapes */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
      
      {/* Sound wave animation background */}
      <div className="absolute inset-0 z-0">
        {/* Musical pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-repeat" 
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        
        {/* Animated gradient circles for a dynamic background */}
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -left-20 top-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
        
        {/* Sound wave elements */}
        <div className="absolute left-0 right-0 top-1/2 flex justify-center space-x-1 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-primary rounded-full"
              style={{ 
                height: `${Math.sin(i * 0.3) * 20 + 30}px`,
                animationName: 'soundWave',
                animationDuration: '1.5s',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.05}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="section-container relative z-10 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 max-w-2xl stagger-animation text-center lg:text-left">
            <span className="inline-block animate-on-load px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Redefine Your Music Streams
            </span>
            
            <h1 className="animate-on-load text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Let Your Fans Choose the Music <span className="text-gradient">You Stream</span>
            </h1>
            
            <p className="animate-on-load text-lg text-muted-foreground mb-6 leading-relaxed">
              Create interactive streams where your audience votes on what plays next. Build deeper connections with your fans through shared musical experiences.
            </p>
            
            <div className="animate-on-load flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300">
                <span>Get Started Free</span>
                <Play className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                See Demo
              </Button>
            </div>
            
            <div className="animate-on-load mt-6 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">10K+ Active Users</span>
              </div>
              <div className="flex items-center">
                <Music className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">1M+ Songs Played</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Main image with vinyl record design */}
              <div className={cn(
                "relative glass-card rounded-full overflow-hidden shadow-xl opacity-0 aspect-square",
                "animate-fade-in animation-delay-500"
              )}>
                {/* Record vinyl effect */}
                <div className="absolute inset-0 bg-black rounded-full z-0">
                  {/* Vinyl grooves */}
                  <div className="absolute inset-5 rounded-full border-2 border-gray-800"></div>
                  <div className="absolute inset-10 rounded-full border-2 border-gray-800"></div>
                  <div className="absolute inset-16 rounded-full border-2 border-gray-800"></div>
                  <div className="absolute inset-24 rounded-full border-2 border-gray-800"></div>
                  
                  {/* Center hole */}
                  <div className="absolute inset-0 m-auto w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute inset-0 m-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                    <Music className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Sound beat animation - concentric circles that pulse out */}
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-primary/30 opacity-0"
                    style={{ 
                      animation: `beat-out 3s ease-out infinite`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  ></div>
                ))}
                
                {/* Animated rotation */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}></div>
                
                {/* Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              
              {/* Floating UI elements */}
              <div className={cn(
                "absolute -bottom-5 -left-5 glass-card p-4 rounded-lg opacity-0",
                "animate-fade-in animation-delay-700 animate-float"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Now Playing</p>
                    <p className="text-xs text-muted-foreground">Selected by fans</p>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "absolute -top-4 -right-4 glass-card p-3 rounded-lg opacity-0",
                "animate-fade-in animation-delay-900 animate-float"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">426 listeners</span>
                </div>
              </div>
              
              {/* Sound wave animation */}
              <div className="absolute -right-10 md:-right-14 top-1/2 -translate-y-1/2 opacity-0 animate-fade-in animation-delay-800">
                <div className="flex items-center h-20 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 bg-primary rounded-full"
                      style={{ 
                        height: `${15 + (i % 3) * 10}px`,
                        animation: `soundWave 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;