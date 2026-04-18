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

const FEATURED_REQUESTS = [
  {
    id: "1",
    title: "Need help",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    description: "helpn needed",
    userName: "Ayesha Khan",
    userLocation: "Karachi",
    helpers: [{}],
    tags: [],
  },
  {
    id: "2",
    title: "Need help making my portfolio responsive before demo day",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    description:
      "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
    userName: "Sara Noor",
    userLocation: "Karachi",
    helpers: [{}],
    tags: ["HTML/CSS", "Responsive", "Portfolio"],
  },
  {
    id: "3",
    title: "Looking for Figma feedback on a volunteer event poster",
    category: "Design",
    urgency: "Medium",
    status: "Open",
    description:
      "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
    userName: "Ayesha Khan",
    userLocation: "Lahore",
    helpers: [{}],
    tags: ["Figma", "Poster", "Design Review"],
  },
];

export default function LandingPage() {
  return (
    <div className="pb-24">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row gap-10 mt-10 mb-20 items-start">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-[55%]">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-4"
          >
            SMIT GRAND CODING NIGHT 2026
          </motion.p>
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(36px,4vw,52px)] font-black text-[#0F1A17] leading-[1.1] mb-6"
          >
            Find help faster. Become help that matters.
          </motion.h1>
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[15px] text-[#374151] mb-8 max-w-[440px] leading-relaxed"
          >
            HelpHub AI is a community-powered support network for students, mentors, creators, and
            builders. Ask for help, offer help, track impact, and let AI surface smarter matches
            across the platform.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Link
              href="/dashboard"
              className="bg-teal-primary text-white font-semibold px-[28px] py-[12px] rounded-full hover:bg-teal-dark transition-colors text-[15px]"
            >
              Open product demo
            </Link>
            <Link
              href="/create"
              className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] font-semibold px-[28px] py-[11px] rounded-full hover:bg-gray-50 transition-colors text-[15px]"
            >
              Post a request
            </Link>
          </motion.div>

          {/* STATS ROW */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex gap-4"
          >
            {[
              {
                label: "MEMBERS",
                value: 384,
                desc: "Students, mentors, and helpers in the loop.",
              },
              {
                label: "REQUESTS",
                value: 72,
                desc: "Support posts shared across learning journeys.",
              },
              {
                label: "SOLVED",
                value: 69,
                desc: "Problems resolved through fast community action.",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-[16px] p-5 shadow-card flex-1 min-w-0"
              >
                <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.08em] mb-1">
                  {stat.label}
                </p>
                <p className="text-[32px] font-black text-[#0F1A17] leading-none mb-1">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-[12px] text-[#6B7280] leading-snug">{stat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN — dark hero card */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full md:w-[45%]"
        >
          <div className="bg-hero rounded-[20px] p-8 relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] rounded-full bg-amber-400/80" />

            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.1em] mb-3 relative">
              LIVE PRODUCT FEEL
            </p>
            <h2 className="text-[28px] font-black text-white leading-[1.15] mb-3 relative">
              More than a form. More like an ecosystem.
            </h2>
            <p className="text-[14px] text-gray-400 mb-6 leading-relaxed relative">
              A polished multi-page experience inspired by product platforms, with AI summaries,
              trust scores, contribution signals, notifications, and leaderboard momentum built
              directly in HTML, CSS, JavaScript, and LocalStorage.
            </p>

            <div className="flex flex-col gap-3 relative">
              <div className="bg-white/10 border border-white/10 rounded-[12px] p-4">
                <p className="font-bold text-white text-[14px] mb-1">AI request intelligence</p>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  Auto-categorization, urgency detection, tags, rewrite suggestions, and trend
                  snapshots.
                </p>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-[12px] p-4">
                <p className="font-bold text-white text-[14px] mb-1">Community trust graph</p>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  Badges, helper rankings, trust score boosts, and visible contribution history.
                </p>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-[12px] p-4">
                <p className="text-[28px] font-black text-white leading-none mb-1">100%</p>
                <p className="text-[13px] text-gray-400">
                  Top trust score currently active across the sample mentor network.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FLOW */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">
              CORE FLOW
            </p>
            <h2 className="text-[32px] font-black text-[#0F1A17]">
              From struggling alone to solving together
            </h2>
          </div>
          <Link
            href="/onboarding"
            className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] font-semibold px-[20px] py-[9px] rounded-full hover:bg-gray-50 transition-colors text-[14px] shrink-0 ml-4"
          >
            Try onboarding AI
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Ask for help clearly",
              desc: "Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.",
            },
            {
              title: "Discover the right people",
              desc: "Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.",
            },
            {
              title: "Track real contribution",
              desc: "Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="bg-white rounded-[16px] p-7 shadow-card"
            >
              <h3 className="text-[17px] font-bold text-[#0F1A17] mb-2">{card.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED REQUESTS */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] font-semibold text-teal-primary uppercase tracking-[0.1em] mb-2">
              FEATURED REQUESTS
            </p>
            <h2 className="text-[32px] font-black text-[#0F1A17]">
              Community problems currently in motion
            </h2>
          </div>
          <Link
            href="/explore"
            className="bg-white text-[#0F1A17] border-[1.5px] border-[#E5E7EB] font-semibold px-[20px] py-[9px] rounded-full hover:bg-gray-50 transition-colors text-[14px] shrink-0 ml-4"
          >
            View full feed
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_REQUESTS.map((req, i) => (
            <motion.div
              key={req.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
            >
              <RequestCard request={req} />
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-[#6B7280] text-[13px] border-t border-[#E5E7EB]">
        HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS,
        JavaScript, and LocalStorage.
      </footer>
    </div>
  );
}
