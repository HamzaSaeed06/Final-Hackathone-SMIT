"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { fadeUp } from "../lib/animations";
import Link from "next/link";
import RequestCard from "../components/RequestCard";

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const incrementTime = 30;
      const steps = duration / incrementTime;
      const step = end / steps;

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}+</span>;
}

export default function LandingPage() {
  return (
    <div className="pb-24">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row gap-12 mt-12 mb-20 items-center">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-[55%]">
          <motion.p 
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[11px] font-semibold text-teal-label uppercase tracking-[0.1em] mb-4"
          >
            SMIT Grand Coding Night 2026
          </motion.p>
          <motion.h1 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[clamp(32px,4vw,52px)] font-extrabold text-text-primary leading-[1.1]"
          >
            Find help faster. Become help that matters.
          </motion.h1>
          <motion.p 
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[16px] text-text-body mt-6 mb-8 max-w-lg leading-relaxed"
          >
            Connect instantly with community members to solve blocks, learn directly from experienced peers, and build a trusted reputation through real contributions.
          </motion.p>
          
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
            <Link href="/dashboard" className="bg-teal-primary text-white font-semibold px-[28px] py-[12px] rounded-full hover:bg-teal-dark transition-colors">
              Open product demo
            </Link>
            <Link href="/create" className="bg-white text-text-primary border-[1.5px] border-border-light font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors">
              Post a request
            </Link>
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-4">
            {[
              { label: 'MEMBERS', value: 384, desc: 'Active in the last week' },
              { label: 'REQUESTS', value: 72, desc: 'Open right now' },
              { label: 'SOLVED', value: 69, desc: 'Through community matching' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 flex-1">
                <p className="text-[11px] font-semibold text-teal-label uppercase mb-1">{stat.label}</p>
                <p className="text-[32px] font-extrabold text-text-primary leading-none mb-1">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-[13px] text-text-muted">{stat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="w-full md:w-[45%]">
          <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50">
            <p className="text-[11px] font-semibold text-teal-label uppercase tracking-wider mb-2">LIVE PRODUCT FEEL</p>
            <h2 className="text-[28px] font-extrabold text-text-primary mb-3">More than a form. More like an ecosystem.</h2>
            <p className="text-[#6B7280] text-sm mb-6">Experience intelligent requests that rewrite themselves and helpers matched via proximity and raw skill metrics.</p>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-[15px]">AI request intelligence</p>
                <p className="text-[13px] text-gray-500 mt-1">Automatically categorizes, tags, and evaluates the urgency of your query while writing.</p>
              </div>
              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-[15px]">Community trust graph</p>
                <p className="text-[13px] text-gray-500 mt-1">Every successful interaction mints verifiable trust score points updating live leaderboards.</p>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-[40px] font-extrabold text-teal-primary leading-none">100%</p>
              <p className="text-[13px] font-medium text-gray-600 mt-1">transparent interaction model</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FLOW */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] font-semibold text-teal-label uppercase tracking-widest mb-2">CORE FLOW</p>
            <h2 className="text-[32px] font-extrabold text-text-primary">From struggling alone to solving together</h2>
          </div>
          <Link href="/onboarding" className="bg-teal-primary text-white font-semibold px-[24px] py-[10px] rounded-full hover:bg-teal-dark transition-colors mb-2">
            Try onboarding AI
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Ask for help clearly", desc: "Use embedded AI to structure the perfect problem statement so others know exactly how to assist." },
            { title: "Discover the right people", desc: "Filter visually by matching tech stacks, urgency, and live status of helpers across the grid." },
            { title: "Track real contribution", desc: "Watch your profile badge and community trust level grow organically as you resolve requests." }
          ].map((card, i) => (
            <motion.div 
              key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
              className="bg-white rounded-[16px] p-8 shadow-sm"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-primary font-bold mb-4">{i + 1}</div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-[#6B7280] text-[15px] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED REQUESTS */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] font-semibold text-teal-label uppercase tracking-widest mb-2">FEATURED REQUESTS</p>
            <h2 className="text-[32px] font-extrabold text-text-primary">Community problems currently in motion</h2>
          </div>
          <Link href="/explore" className="bg-white text-text-primary border-[1.5px] border-border-light font-semibold px-[24px] py-[10px] rounded-full hover:bg-gray-50 transition-colors mb-2">
            View full feed
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mock data for the cards as per instructions */}
          {[
            { id: 1, title: "Need help", category: "Web Development", urgency: "High", status: "Solved", desc: "Need support getting my local development server to run effectively without throwing CORS errors.", name: "Ayesha Khan", location: "Karachi", helpers: 1, tags: [] },
            { id: 2, title: "Need help making my portfolio responsive before demo day", category: "Web Development", urgency: "High", status: "Solved", desc: "Struggling with CSS grid alignments on mobile breakpoints. Specifically around the project gallery section.", name: "Sara Noor", location: "Karachi", helpers: 3, tags: [] },
            { id: 3, title: "Looking for Figma feedback on a volunteer event poster", category: "Design", urgency: "Medium", status: "Open", desc: "Need a quick review of typography hierarchy and color contrast for an upcoming tech community event.", name: "Ayesha Khan", location: "Lahore", helpers: 0, tags: [] }
          ].map((req, i) => (
             <motion.div key={req.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
               {/* Rendering the request directly to pass correct mocked props. We will refine RequestCard next. */}
               <RequestCard request={req} />
             </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm">
        HelpHub AI — Advanced Community Synergy Layer. Built for SMIT Grand Coding Night.
      </footer>
    </div>
  );
}
