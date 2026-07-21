"use client";

import React from 'react';
import { Shield, Zap, Globe, Lock, Heart, Code, Mail, Send } from 'lucide-react';

const sections = [
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Privacy First",
    description: "Unlike other online tools, ToolifyX processes all your data locally in your browser. Your files and information never leave your device. No uploads, no servers, no tracking."
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Instant Speed",
    description: "Because there's no data transfer to a server, our tools work at the speed of your device. Instant results, every time, even with large files."
  },
  {
    icon: <Lock className="w-6 h-6 text-primary" />,
    title: "Secure by Design",
    description: "Our browser-native approach means there's no risk of your sensitive data being intercepted during transit or stored on a third-party server."
  },
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "Works Offline",
    description: "Once the page is loaded, most of our tools can work without an internet connection. True portability for your workflow."
  }
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Tools for <span className="text-primary">Everyone</span>,<br />
          Built for <span className="text-primary">Privacy</span>.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ToolifyX is a collection of 100+ browser-native utilities designed to make your digital life easier without compromising your data security.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4 p-6 rounded-3xl border bg-card/50 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold">{section.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Mission */}
      <div className="space-y-12 border-t pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" /> Our Mission
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                The internet is full of utility tools that seem free but often come at a hidden cost: your data. Every time you upload a PDF to be merged or a JSON file to be formatted, you're handing over your information to someone else's server.
              </p>
              <p>
                <strong>ToolifyX was created to change that.</strong>
              </p>
              <p>
                We believe that powerful digital tools should be accessible to everyone, everywhere, without the need for high-speed internet or expensive subscriptions—and most importantly, without the fear of data leaks.
              </p>
            </div>
          </div>
          <div className="bg-primary/5 rounded-3xl p-8 flex flex-col justify-center border border-primary/10">
             <Code className="w-12 h-12 text-primary mb-6" />
             <h4 className="text-lg font-bold mb-2">Technical Insight</h4>
             <p className="text-sm text-muted-foreground leading-relaxed">
               ToolifyX uses modern web technologies like WebAssembly, Client-side JS, and Local Storage to ensure everything happens right in your browser tab.
             </p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="space-y-8 text-center bg-muted/30 rounded-[3rem] p-12">
        <h2 className="text-3xl font-bold">Need Help or Have Feedback?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          We're always looking for ways to improve ToolifyX. Reach out to us for support, feature requests, or just to say hi!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <a
            href="mailto:ssolstice216@gmail.com"
            className="flex items-center gap-3 bg-card border px-8 py-4 rounded-2xl font-bold hover:border-primary transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase font-black">Email Us</p>
              <p className="text-sm">ssolstice216@gmail.com</p>
            </div>
          </a>
          <a
            href="https://t.me/S2olstice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border px-8 py-4 rounded-2xl font-bold hover:border-primary transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Send className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase font-black">Telegram</p>
              <p className="text-sm">@S2olstice</p>
            </div>
          </a>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-foreground text-background rounded-[3rem] p-10 md:p-16 text-center space-y-8 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Ready to start?</h2>
        <p className="text-background/70 max-w-lg mx-auto text-lg">
          Explore our collection of 100+ secure, fast, and free tools designed for creators and developers.
        </p>
        <div className="flex justify-center pt-4">
           <a href="/" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">
              Browse All Tools
           </a>
        </div>
      </div>
    </div>
  );
}
