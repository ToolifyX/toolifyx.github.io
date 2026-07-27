"use client";

import React, { useState } from 'react';
import {
  Camera,
  Languages,
  Zap,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronDown,
  Download,
  Smartphone,
  Star,
  Trophy,
  Quote,
  HelpCircle,
  QrCode,
  Lock,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { DynamicIcon } from '@/components/DynamicIcon';

// Mock data for Scenarios
const scenarios = [
  {
    id: 'home',
    icon: '🏠',
    title: 'Everyday Moments',
    description: 'Transform your home into a classroom. Label your furniture, appliances, and kitchen items to learn vocabulary in context.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'travel',
    icon: '✈️',
    title: 'Travel & Discovery',
    description: 'Navigate foreign cities with ease. Translate menus, street signs, and transit info just by pointing your camera.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'urban',
    icon: '🏙️',
    title: 'Urban Adventures',
    description: 'The city is your textbook. Learn names of shops, trees, and architecture as you walk through the neighborhood.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'campus',
    icon: '🎓',
    title: 'Work & Study',
    description: 'Boost your professional vocabulary. Capture documents, whiteboard notes, and office equipment to stay ahead.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
  }
];

// FAQ Item Component
const FAQItem = ({ question, answer }: { title: string; question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/60 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h4 className="text-xl font-bold tracking-tight group-hover:text-indigo-500 transition-colors">{question}</h4>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-muted-foreground'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-muted-foreground leading-relaxed text-lg">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function LingoSnapPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground font-sans selection:bg-indigo-500/30">

      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/lingosnap" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-indigo-500/20 shadow-lg group-hover:rotate-6 transition-transform">
               <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">
              Lingo<span className="text-indigo-500">Snap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {/* Navigation links hidden temporarily */}
          </div>

          <a
            href="https://play.google.com/store/apps/dev?id=4762229976399806756"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Get the app
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-12">

          {/* Awards Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in">
             <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Trophy className="w-4 h-4" /> APP STORE: APP OF THE YEAR
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <Star className="w-4 h-4 fill-current" /> DESIGN AWARDS 2025 WINNER
             </div>
          </div>

          <h1 className="text-6xl md:text-[7.5rem] font-black tracking-tighter leading-[0.85] animate-slide-up">
            Learn a new <br />
            language from <br />
            <span className="text-indigo-500">familiar things.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            LingoSnap makes everyday objects your personal textbook. <br className="hidden md:block" />
            Capture what you see, learn what it means.
          </p>

          <div className="flex flex-col items-center gap-8 pt-8">
            <div className="group relative p-4 bg-white dark:bg-zinc-900 border border-border/60 rounded-[2.5rem] shadow-2xl transition-all hover:shadow-indigo-500/10">
               <div className="w-48 h-48 bg-slate-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center border-2 border-dashed border-border/40 group-hover:border-indigo-500/40 transition-colors">
                  <QrCode className="w-24 h-24 text-muted-foreground/20 group-hover:text-indigo-500/20" />
               </div>
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                 Scan to Download
               </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-tighter flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Available for Android & iOS
            </p>
          </div>
        </div>
      </header>

      {/* Scenario Grid */}
      <section id="features" className="py-32 bg-white dark:bg-black/40">
        <div className="container mx-auto px-6 space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Learn Together, <span className="text-indigo-500">Grow Together.</span></h2>
             <p className="text-xl text-muted-foreground font-medium">Context is king. LingoSnap works wherever you are.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {scenarios.map((item) => (
              <div key={item.id} className="group relative bg-slate-50 dark:bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-border/40 hover:border-indigo-500/40 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden relative">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                   <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center text-2xl shadow-xl">
                     {item.icon}
                   </div>
                   {/* Sticker Effect Overlay */}
                   <div className="absolute bottom-6 left-6 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border-2 border-indigo-500 shadow-[4px_4px_0px_0px_rgba(99,102,241,1)] group-hover:-rotate-2 transition-transform duration-300">
                     <span className="font-black text-xs uppercase tracking-widest">{item.id === 'home' ? 'Kitchen Table' : item.id === 'travel' ? 'Food Menu' : 'Coffee Shop'}</span>
                   </div>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science / Scenario Memory Section */}
      <section id="science" className="py-40 bg-indigo-500 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest">
                    The Science of Learning
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
                    Scenario <br /> Memory Cards.
                  </h2>
              <div className="space-y-6 text-indigo-50 text-xl font-medium leading-relaxed">
                <p>
                  Traditional rote memorization is boring and ineffective. LingoSnap uses the power of <strong>Visual Contextualization</strong>.
                </p>
                <p className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-10 h-10 mb-4 opacity-50" />
                  "Scene + Image + Information = Better Memory."
                  <span className="block mt-4 text-sm font-bold opacity-60 uppercase">Journal of Educational Psychology, 2023</span>
                </p>
                <p>
                  Studies show a <strong>25% boost</strong> in word retention when learners associate vocabulary with real-world objects and physical locations.
                </p>
              </div>
               </div>

               {/* Floating Stickers Mockup */}
               <div className="relative h-[600px] hidden lg:block">
                  {[
                    { label: "Mug / Mága", pos: "top-10 left-10", rot: "-6deg" },
                    { label: "Chair / Silla", pos: "top-40 right-10", rot: "8deg" },
                    { label: "Mirror / Espejo", pos: "bottom-20 left-20", rot: "-3deg" },
                    { label: "Plant / Planta", pos: "bottom-40 right-20", rot: "12deg" }
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`absolute ${s.pos} bg-white text-indigo-600 px-8 py-5 rounded-[2rem] font-black text-2xl shadow-2xl border-4 border-white transform hover:scale-110 transition-all cursor-default select-none animate-float`}
                      style={{ transform: `rotate(${s.rot})`, animationDelay: `${i * 0.5}s` }}
                    >
                      {s.label}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Privacy Section */}
      <section className="py-40">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-slate-50 dark:bg-zinc-900 border border-border/60 rounded-[4rem] p-12 md:p-24 space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-primary" />
             </div>

             <div className="space-y-6 relative z-10">
               <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.9]">Privacy First. <br /><span className="text-indigo-500">Serverless.</span></h2>
               <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                 Your photos stay on your device. We use on-device AI to detect objects and translate text, ensuring your private moments never reach any cloud server.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {[
                  { iconName: "ShieldCheck", title: "On-Device OCR", text: "Text recognition happens locally." },
                  { iconName: "Lock", title: "No Tracking", text: "We don't collect your images or data." },
                  { iconName: "Zap", title: "Swift Local AI", text: "Instant translation without lag." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <DynamicIcon name={item.iconName} className="w-8 h-8 text-indigo-500" />
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-muted-foreground font-medium">{item.text}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-24">
             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">We <Heart className="inline-block w-10 h-10 text-red-500 fill-current mx-2" /> Our Users.</h2>
             <p className="text-xl text-muted-foreground font-medium">Join 500,000+ people learning with LingoSnap.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah K.", role: "Solo Traveler", text: "This app changed the way I travel in Japan. Pointing the camera at menus and getting instant English translations is like magic!" },
              { name: "Marc J.", role: "Expat in Berlin", text: "The sticker concept is brilliant. I've literally labeled my entire apartment and I'm learning German nouns 3x faster than with Duolingo." },
              { name: "Emma L.", role: "Language Student", text: "Clean, beautiful, and respects my privacy. The voice memory cards are super helpful for pronunciation too!" }
            ].map((rev, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-border/60 shadow-xl space-y-6 relative hover:-translate-y-2 transition-transform">
                <Quote className="w-10 h-10 text-indigo-500/20 absolute top-8 right-10" />
                <div className="flex gap-1 text-amber-500">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg font-medium leading-relaxed italic">"{rev.text}"</p>
                <div>
                   <h4 className="font-black text-lg">{rev.name}</h4>
                   <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-40 bg-white dark:bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="text-center space-y-4 mb-20">
             <HelpCircle className="w-12 h-12 text-indigo-500 mx-auto" />
             <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Questions? <br /><span className="text-indigo-500">We’ve got answers.</span></h2>
           </div>

           <div className="space-y-2">
             <FAQItem
               title="basics"
               question="What exactly is LingoSnap?"
               answer="LingoSnap is an AI-powered camera application that helps you learn languages by identifying real-world objects and translating them instantly. It creates 'visual stickers' that help you associate words with their physical counterparts."
             />
             <FAQItem
               title="privacy"
               question="Is it safe for kids to use?"
               answer="Absolutely. LingoSnap was designed with privacy and safety as core principles. Since all processing happens on-device and we don't require an account or cloud storage, your child's photos never leave the phone."
             />
             <FAQItem
               title="languages"
               question="Which languages are supported?"
               answer="We currently support over 100 languages, including Spanish, French, Japanese, Chinese, German, Korean, and many more. Our AI models are updated monthly for better accuracy."
             />
             <FAQItem
               title="subscription"
               question="Does it require a subscription?"
               answer="LingoSnap offers a generous free tier that allows you to scan and learn daily. We also have a 'Pro' version with unlimited offline packs and advanced neural voices."
             />
           </div>
        </div>
      </section>

      {/* Final Download CTA */}
      <section className="py-40 container mx-auto px-6">
        <div className="bg-indigo-600 rounded-[5rem] p-12 md:p-32 text-center text-white space-y-12 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
           <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
             Ready to <br /> speak the <br /> <span className="text-indigo-300">world?</span>
           </h2>
           <p className="text-xl md:text-2xl text-indigo-100 max-w-xl mx-auto font-medium">
             Download LingoSnap today and start your journey toward fluency, one capture at a time.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#" className="flex items-center gap-4 bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-2xl">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8 w-auto" />
              </a>
              <a href="#" className="flex items-center gap-4 bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest border-2 border-white/20 hover:bg-zinc-900 transition-all">
                 <Download className="w-6 h-6" /> App Store
              </a>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                 <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">LingoSnap</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
               {/* Footer links hidden temporarily */}
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-border/20 text-center">
             <p className="text-[11px] text-muted-foreground/40 font-black uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} LingoSnap • Built by s2olstice
             </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-20px) rotate(calc(var(--rot, 0deg) + 2deg)); }
          100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
