import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import brokerImage from './assets/images/대표이미지.jpg';
import FeaturedListings from './components/FeaturedListings';
import CommunityNews from './components/CommunityNews';
import LoginForm from './components/admin/LoginForm';
import AdminPanel from './components/admin/AdminPanel';
import NewsBoard from './pages/NewsBoard';
import NewsDetail from './pages/NewsDetail';
import { isAuthenticated } from './utils/api';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NewsDetailWrapper() {
  const { id } = useParams();
  const numericId = parseInt(id || '', 10);
  return <NewsDetail id={numericId} />;
}

// ==========================================
// 1. Navigation Bar
// ==========================================
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed w-full z-50 glass-nav transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="h-10 w-10 relative flex items-center justify-center bg-secondary dark:bg-white rounded-sm">
              <span className="material-symbols-outlined text-white dark:text-secondary text-2xl">roofing</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-secondary dark:text-white tracking-wide">고덕그라시움 큰문부동산</span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-primary font-medium">Real Estate</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" to="/">
              홈
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" href="#">
              매물 검색
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" href="#">
              소개
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" href="#">
              서비스
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" to="/news">
              커뮤니티
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors relative group" href="#">
              연락처
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <div className="flex items-center gap-2 text-secondary dark:text-primary font-bold ml-4">
              <span className="material-symbols-outlined text-lg">call</span>
              <span className="tracking-widest">02.441.1110</span>
            </div>
            <a className="bg-secondary hover:bg-navy-dark text-white px-5 py-2.5 rounded transition-all transform hover:scale-105 font-medium shadow-md border border-primary/30" href="tel:02-441-1110">문의하기</a>
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-gray-500 hover:text-primary">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
// ==========================================
// 2. Hero Section (Main Banner & Search)
// ==========================================
function Hero() {
  return (
    <div className="relative pt-40 h-[85vh] flex items-center justify-center hero-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/80 to-background-light dark:to-background-dark"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-1/4 right-10 w-64 h-64 border-8 border-primary/10 rounded-full blur-3xl hidden lg:block"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 45 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-1/4 left-10 w-48 h-48 bg-primary/10 hidden lg:block"
      ></motion.div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-7xl font-display font-extrabold text-white mb-8 leading-[1.3] drop-shadow-xl tracking-tight"
        >
          <span className="gold-gradient-text pr-2">큰문부동산</span>은 매물 먼저<br />
          <span className="relative inline-block mt-2">
            권하는 중개사가 아닙니다
            <svg className="absolute w-full h-3 -bottom-2 left-0 text-primary opacity-60" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
            </svg>
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-16 font-light leading-relaxed"
        >
          수많은 상담을 하면서 늘 저한테 먼저 물어봤습니다.<br className="hidden sm:block" />
          <span className="text-white font-medium">"내가 고객님 상황이라면 가장 좋은 선택이 뭘까?"</span><br className="hidden sm:block" />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <a
            href="tel:02-441-1110"
            className="flex items-center justify-center gap-2.5 bg-primary hover:bg-yellow-500 text-navy-dark font-bold py-4 px-10 rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-lg"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            가장 좋은 선택 물어보기
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Featured Listings (추천 매물) - imported from components
// ==========================================

// --- Animation Variants ---
const statsContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const statItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ==========================================
// 4. Statistics (통계)
// ==========================================
function Stats() {
  return (
    <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary/5 rounded-tr-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-gray-700"
        >
          <motion.div variants={statItem} className="group cursor-default">
            <p className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-primary mb-2 transition-transform group-hover:scale-110 duration-300">87</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider font-medium">진행중인 매물</p>
          </motion.div>
          <motion.div variants={statItem} className="group cursor-default">
            <p className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-primary mb-2 transition-transform group-hover:scale-110 duration-300 delay-75">128</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider font-medium">누적 거래 건</p>
          </motion.div>
          <motion.div variants={statItem} className="group cursor-default">
            <p className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-primary mb-2 transition-transform group-hover:scale-110 duration-300 delay-100">6</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider font-medium">경력 (년)</p>
          </motion.div>
          <motion.div variants={statItem} className="group cursor-default">
            <p className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-primary mb-2 transition-transform group-hover:scale-110 duration-300 delay-150">98%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider font-medium">고객 만족도</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 5. Neighborhood Guide (입지 환경)
// ==========================================
function NeighborhoodGuide() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary font-bold tracking-widest text-sm mb-2">WHY DIFFERENT</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white mb-4">큰문부동산이 다른 이유</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">같은 매물이라도 어떤 중개사를 만나느냐에 따라 결과가 달라집니다.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-navy-dark transition-colors duration-300">
              <span className="material-symbols-outlined text-3xl">handshake</span>
            </div>
            <h4 className="text-xl font-bold text-secondary dark:text-white mb-3">팔지 않는 중개</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              빨리 계약하려고 서두르지 않습니다. 고객님의 상황을 먼저 파악하고, 진짜 필요한 매물만 제안합니다.
            </p>
            <div className="bg-secondary/5 dark:bg-white/5 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-secondary dark:text-gray-300 text-sm font-medium leading-relaxed">
                "내가 고객님 상황이라면 가장 좋은 선택이 뭘까?"<br />
                <span className="text-gray-500 text-xs mt-1 inline-block">이 질문이 모든 상담의 시작점입니다.</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-navy-dark transition-colors duration-300">
              <span className="material-symbols-outlined text-3xl">campaign</span>
            </div>
            <h4 className="text-xl font-bold text-secondary dark:text-white mb-3">광범위한 매물 노출</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              대부분의 부동산은 네이버부동산 광고에만 의존합니다. 큰문부동산은 자체 홈페이지, 블로그, 다양한 채널을 통해 매물을 노출합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {['자체 홈페이지', '네이버 블로그', '네이버 부동산', '직방', 'SNS 채널'].map((ch) => (
                <span key={ch} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium border border-primary/20">
                  {ch}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-surface-dark p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-navy-dark transition-colors duration-300">
              <span className="material-symbols-outlined text-3xl">home</span>
            </div>
            <h4 className="text-xl font-bold text-secondary dark:text-white mb-3">입주민 중개사</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              고덕그라시움에 직접 거주하는 중개사입니다. 내가 사는 곳의 가치를 깎는 일은 절대 하지 않습니다.
            </p>
            <div className="bg-secondary/5 dark:bg-white/5 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-secondary dark:text-gray-300 text-sm font-medium leading-relaxed">
                단지의 장단점, 동별 조망, 생활 편의성까지<br />
                <span className="text-gray-500 text-xs mt-1 inline-block">실거주 경험에서 나오는 진짜 정보를 드립니다.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 6. Market Trends (시장 동향)
// ==========================================
interface MonthlyData {
  month: string;
  yearMonth: string;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  transactions: number;
}

interface RecentTx {
  dong: string;
  floor: string;
  area: string;
  price: string;
  priceRaw: number;
  date: string;
}

interface MarketStats {
  currentAvgPrice: number;
  currentMaxPrice: number;
  currentMinPrice: number;
  priceChange: string;
  priceChangePercent: string;
  totalTransactions: number;
  trend: 'up' | 'down' | 'flat';
  lastUpdated: string;
  baseArea: string;
}

interface MarketData {
  monthlyData: MonthlyData[];
  recentTransactions: RecentTx[];
  statistics: MarketStats;
}

interface MarketTrendResponse {
  area84: MarketData;
  area59: MarketData;
}

function MarketTrendCard({ data, title }: { data: MarketData, title: string }) {
  const monthlyData = data?.monthlyData || [];
  const recentTx = data?.recentTransactions || [];
  const stats = data?.statistics;

  const validMaxPrices = monthlyData.map(m => m.maxPrice);
  const globalMax = validMaxPrices.length > 0 ? Math.max(...validMaxPrices) : 1;
  const validMinPrices = monthlyData.map(m => m.minPrice).filter(p => p > 0);
  const globalMin = validMinPrices.length > 0 ? Math.min(...validMinPrices) : 0;

  const chartPadding = (globalMax - globalMin) * 0.15 || 5;
  const chartMax = globalMax + chartPadding;
  const chartMin = Math.max(0, globalMin - chartPadding);
  const chartRange = chartMax - chartMin || 1;

  const trendColor = stats?.trend === 'up' ? 'green' : stats?.trend === 'down' ? 'red' : 'gray';
  const trendIcon = stats?.trend === 'up' ? 'trending_up' : stats?.trend === 'down' ? 'trending_down' : 'trending_flat';

  function formatPrice(v: number) {
    if (v === 0) return '-';
    const rounded = Math.round(v * 10) / 10;
    const eok = Math.floor(rounded);
    const rem = Math.round((rounded - eok) * 10);
    if (eok === 0) return `${Math.round(v * 10000)}만`;
    if (rem === 0) return `${eok}억`;
    return `${eok}.${rem}억`;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12 last:mb-0 h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:col-span-2 bg-background-light dark:bg-navy-dark rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 shrink-0">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{title} 가격 동향</h4>
              <p className="text-xs text-gray-500 mt-1">최근 {monthlyData.length}개월 실거래가 기준</p>
            </div>
            {stats && (
              <span className={`bg-${trendColor}-100 dark:bg-${trendColor}-900/30 text-${trendColor}-700 dark:text-${trendColor}-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center border border-${trendColor}-200 dark:border-${trendColor}-800 whitespace-nowrap w-fit`}>
                <span className="material-symbols-outlined text-sm mr-1">{trendIcon}</span>
                전월대비 {stats.priceChangePercent}
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[350px] w-full bg-white dark:bg-gray-800/50 rounded-xl relative px-4 sm:px-6 pt-4 pb-4 border border-gray-100 dark:border-gray-700 overflow-visible">
            {monthlyData.length > 0 ? (() => {
              const svgW = 600;
              const svgH = 300;
              const padL = 50;
              const padR = 10;
              const padTop = 70;
              const padBot = 30;
              const drawW = svgW - padL - padR;
              const drawH = svgH - padTop - padBot;
              const barGap = 10;
              const barW = Math.min(44, (drawW / monthlyData.length) - barGap);
              const maxBarH = drawH * 0.85;

              return (
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = padTop + (drawH / 4) * i;
                    const val = chartMax - (chartRange / 4) * i;
                    return (
                      <g key={i}>
                        <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="0.5" strokeDasharray="4 3" />
                        <text x={padL - 6} y={y + 4} textAnchor="end" fill="currentColor" className="text-gray-400" fontSize="10">{formatPrice(val)}</text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id={`bgGrad-normal-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" className="[stop-color:#8A99A8] dark:[stop-color:#2A3755]" />
                      <stop offset="100%" className="[stop-color:#6C7F93] dark:[stop-color:#1B2A4A]" />
                    </linearGradient>
                    <linearGradient id={`bgGrad-latest-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" className="[stop-color:#E6C87E]" />
                      <stop offset="100%" className="[stop-color:#C8A359]" />
                    </linearGradient>
                  </defs>

                  {monthlyData.map((m, idx) => {
                    const centerX = padL + (drawW / monthlyData.length) * (idx + 0.5);
                    const rawBarH = ((m.avgPrice - chartMin) / chartRange) * drawH;
                    const barH = Math.min(rawBarH, maxBarH);
                    const barY = padTop + drawH - barH;
                    const isLast = idx === monthlyData.length - 1;
                    const tooltipW = 130;
                    const tooltipH = 74;
                    const tooltipX = Math.max(5, Math.min(svgW - tooltipW - 5, centerX - tooltipW / 2));
                    const tooltipY = barY - tooltipH - 24;
                    const fillUrl = `url(#${isLast ? `bgGrad-latest-${title.replace(/[^a-zA-Z0-9]/g, '')}` : `bgGrad-normal-${title.replace(/[^a-zA-Z0-9]/g, '')}`})`;

                    return (
                      <g key={m.yearMonth} className="group/bar cursor-pointer">
                        <rect x={centerX - barW / 2} y={barY} width={barW} height={barH} rx={5} fill={fillUrl} className="transition-all duration-200 group-hover/bar:brightness-110" />

                        <text x={centerX} y={barY - 10} textAnchor="middle" fill={isLast ? '#C8A359' : '#1B2A4A'} fontSize="11" fontWeight="700" className="dark:fill-gray-300">{formatPrice(m.avgPrice)}</text>

                        <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200" style={{ pointerEvents: 'none' }}>
                          <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="8" fill="#1B2A4A" stroke="#C8A359" strokeWidth="1.5" />
                          <text x={tooltipX + tooltipW / 2} y={tooltipY + 22} textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700">▲ 최고 {formatPrice(m.maxPrice)}</text>
                          <text x={tooltipX + tooltipW / 2} y={tooltipY + 42} textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="700">▼ 최저 {formatPrice(m.minPrice)}</text>
                          <text x={tooltipX + tooltipW / 2} y={tooltipY + 62} textAnchor="middle" fill="#e5e7eb" fontSize="12" fontWeight="700">거래량 {m.transactions}건</text>
                        </g>

                        <text x={centerX} y={svgH - 6} textAnchor="middle" fill="currentColor" className={isLast ? 'text-primary' : 'text-gray-500'} fontSize="11" fontWeight={isLast ? '700' : '500'}>{m.month}</text>
                      </g>
                    );
                  })}
                </svg>
              );
            })() : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-400 text-sm">거래 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-6 h-full"
      >
        <div className="bg-secondary dark:bg-navy-dark rounded-xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group shrink-0 h-[220px] flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="text-center relative z-10 w-full mb-5">
            <h4 className="text-sm font-bold opacity-80 mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
              평균 거래가
              <span className="material-symbols-outlined text-primary">analytics</span>
            </h4>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              {stats ? formatPrice(stats.currentAvgPrice) : '-'}
            </div>
            <p className="text-xs text-gray-300 opacity-80">{stats?.baseArea}</p>
          </div>

          <div className="pt-3 border-t border-white/10 w-full relative z-10 px-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">최고가</span>
              <span className="font-bold text-red-300">{stats ? formatPrice(stats.currentMaxPrice) : '-'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1.5">
              <span className="text-gray-300">최저가</span>
              <span className="font-bold text-blue-300">{stats ? formatPrice(stats.currentMinPrice) : '-'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1.5">
              <span className="text-gray-300">월 거래량</span>
              <span className="font-bold text-gray-200">{monthlyData.length > 0 ? `${monthlyData[monthlyData.length - 1].transactions}건` : '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mt-4 -mr-4 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
            <h4 className="text-lg font-bold text-[#1B2A4A] dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full"></span>
              최근 실거래가
            </h4>
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full font-medium tracking-wide">공공데이터</span>
          </div>

          <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar relative z-10">
            {recentTx.length > 0 ? (
              <ul className="space-y-1">
                {recentTx.map((tx, i) => (
                  <li key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors px-2 cursor-pointer group">
                    <div>
                      <p className="font-bold text-[13px] text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-primary transition-colors">
                        {tx.dong ? `${tx.dong}${tx.dong.includes('동') ? '' : '동'} ` : ''}{tx.floor}
                      </p>
                      <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#1B2A4A] dark:text-gray-400 opacity-70">{tx.area}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="opacity-70">{tx.date}</span>
                      </div>
                    </div>
                    <span className="text-[#1B2A4A] dark:text-white font-extrabold text-[14px] shrink-0 ml-2 group-hover:text-primary transition-colors">
                      {tx.price}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-20">receipt_long</span>
                <p className="text-xs">최근 거래 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MarketTrends() {
  const [data, setData] = useState<MarketTrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<'84' | '59'>('84');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/market-trends');
        const result = await response.json();
        if (result.success && result.data && result.data.area84 && result.data.area59) {
          setData(result.data);
        } else {
          setError(result.error || '데이터 형식이 올바르지 않거나 불러올 수 없습니다.');
        }
      } catch {
        setError('서버 연결에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h2 className="text-primary font-bold tracking-widest text-sm mb-2">MARKET TRENDS</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white">최신 시세 리포트</h3>
            {data && data[`area${selectedArea}`] && (
              <p className="text-xs text-gray-500 mt-2">
                공공데이터포털 실거래가 기준 · 마지막 업데이트: {new Date(data[`area${selectedArea}`].statistics.lastUpdated).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-inner w-full md:w-auto">
            <button
              onClick={() => setSelectedArea('84')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${selectedArea === '84'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              전용 84㎡
            </button>
            <button
              onClick={() => setSelectedArea('59')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${selectedArea === '59'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              전용 59㎡
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400">실거래가 데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4 block">cloud_off</span>
              <p className="text-gray-500 dark:text-gray-400 mb-2">{error}</p>
              <p className="text-xs text-gray-400">서버가 실행 중인지 확인해주세요.</p>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-16">
            <MarketTrendCard data={data[`area${selectedArea}`]} title={`고덕그라시움 (${selectedArea}㎡)`} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ==========================================
// 7. About Broker (중개사 소개)
// ==========================================
function AboutBroker() {
  return (
    <section className="py-24 bg-background-light dark:bg-background-dark relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white dark:bg-surface-dark hidden lg:block"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <img alt="이선규 공인중개사" className="w-full h-[500px] object-cover object-top transition-transform duration-700 group-hover:scale-105" src={brokerImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-primary font-bold tracking-widest text-sm mb-1">REPRESENTATIVE BROKER</p>
                <h3 className="text-3xl font-bold">이선규 대표</h3>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-primary z-0 opacity-60"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-secondary dark:border-white z-20 opacity-60"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary"></div>
              <span className="text-primary font-bold tracking-widest text-sm uppercase">About Broker</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-secondary dark:text-white mb-6">
              <span className="relative inline-block z-10">
                차별화된 중개 서비스
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10"></span>
              </span>로<br />
              최고의 가치를 만들어드립니다.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              큰문부동산은 고덕그라시움 및 고덕동, 상일동 일대의 프리미엄 아파트 전문 부동산입니다.
              단순한 중개를 넘어 고객님의 소중한 자산을 위한 정확한 시세 분석과
              맞춤형 컨설팅을 제공합니다. 프롭테크 기술을 활용한 데이터 분석과
              오랜 현장 경험을 바탕으로 최적의 매물을 매칭해드립니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-secondary/10 dark:bg-white/10 p-2 rounded text-secondary dark:text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary dark:text-white">정직과 신뢰</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">투명한 거래 절차와 책임 중개</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-secondary/10 dark:bg-white/10 p-2 rounded text-secondary dark:text-primary">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary dark:text-white">데이터 기반 분석</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">철저한 시장 분석 및 시세 리포트</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full"></div>
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">smartphone</span>
                  <span className="text-xl font-bold text-secondary dark:text-white tracking-wide">010.9345.4108</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <span className="text-xl font-bold text-secondary dark:text-white tracking-wide">02.441.1110</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8. Client Reviews (고객 후기)
// ==========================================
const reviewsData = [
  {
    name: '조** 님',
    location: '래미안강동팰리스',
    badge: '계약고객',
    initial: 'J',
    bgColor: 'bg-primary',
    textColor: 'text-navy-dark',
    review: '처음에 강동구 쪽 알아보기 시작하면서 연락을 드렸는데, 제가 찾는 집 조건을 상세히 문의하셨고 또 조건에 맞는 적당한 다른 후보지를 4~5곳 이상 따로 찾아주셔서 결국은 제가 처음에 봤던 곳이 아닌 중개사님이 추천해주신 곳으로 계약을 하게 됐어요. 이선규 중개사님은 제가 필요로 하는 평수부터, 지역, 뷰, 구조, 아이와 지내기 좋은 곳으로 꼼꼼히 파악해주시고 실제로 만나기 전까지 약 한달동안 매물 상황 체크해주셔서 정말 든든했습니다.',
  },
  {
    name: '김** 님',
    location: '고덕아르테온',
    badge: '계약고객',
    initial: 'K',
    bgColor: 'bg-secondary border border-primary',
    textColor: 'text-white',
    review: '이선규 중개사님을 만나서 참 좋았습니다. 인상도 좋으시고 다정하시게 설명도 잘 해주시고 무엇보다 믿음이 가서 다른 중개소 문은 두드리지도 않았습니다. 여러 아파트를 돌러봐 기억이 뒤범벅이 되는데 꼼꼼하게 메모 정리해서 보내주셔서 감사했습니다. 앞으로도 좋은일만 가득하시길 바랍니다.',
  },
  {
    name: '송** 님',
    location: '고덕센트럴푸르지오',
    badge: '계약고객',
    initial: 'S',
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    review: '급하게 집을 구해야해서 조급한 마음에 여기저기 알아보다가 직방에서 상담신청 했는데요. 예산에 맞춰 깨끗하고 좋은집만 보여주시고 중간에 우여곡절이 있었지만 중개사님 덕에 무사히 끝낼 수 있었어요. 제가 잘 모르는 것도 정말 꼼꼼하게 하나하나 다 챙겨주시고 이사하는 날도 오셔서 끝까지 마무리해주시고 너무 감동이고 감사하고.. 진짜 복받으실거에요!',
  },
  {
    name: '조** 님',
    location: '고덕그라시움',
    badge: '계약고객',
    initial: 'C',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    review: '매물 나오자마자 좋은 조건으로 빠르게 연락 주셔서 바로 집계약 할 수 있었습니당!!!!!!! 꼼꼼하게 하나하나 다 체크 해 주시고 너무 감사합니다. 저보다 더 계약 당사자처럼 임해주시고 친절하십니다.',
  },
  {
    name: '천** 님',
    location: '고덕그라시움',
    badge: '계약고객',
    initial: 'C',
    bgColor: 'bg-gray-700',
    textColor: 'text-white',
    review: '오랜 시간동안 섬세하고 알아봐주셔서 너무 감사했습니다. 날짜, 비용, 의견 등등을 너무 잘 조율해주셨어요. 너무 너무 고맙습니다. 중개사님, 번창하세요!',
  },
];

function ClientReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalSlides = reviewsData.length;
  const visibleDesktop = 3;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goPrev = () => goTo((currentIndex - 1 + totalSlides) % totalSlides);
  const goNext = () => goTo((currentIndex + 1) % totalSlides);

  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < visibleDesktop; i++) {
      indices.push((currentIndex + i) % totalSlides);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-20 bg-secondary dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C8A359 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary font-bold tracking-widest text-sm mb-2">CLIENT REVIEWS</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">고객 후기</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">실제 고객분들이 직접 남겨주신 큰문부동산의 후기입니다.</p>
        </motion.div>

        <div className="relative">
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/50 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
          >
            {visibleIndices.map((reviewIdx) => {
              const r = reviewsData[reviewIdx];
              return (
                <div
                  key={`${currentIndex}-${reviewIdx}`}
                  className="bg-navy-dark border border-white/10 p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 relative flex flex-col justify-between min-h-[340px]"
                >
                  <span className="material-symbols-outlined text-primary/20 text-6xl absolute top-4 right-4">format_quote</span>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-primary/70 font-medium bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm relative z-10 mb-6 line-clamp-6">
                      "{r.review}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
                    <div className={`w-10 h-10 rounded-full ${r.bgColor} flex items-center justify-center ${r.textColor} font-bold shrink-0`}>
                      {r.initial}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{r.name}</p>
                      <p className="text-gray-500 text-xs">{r.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <div className="flex items-center justify-center gap-2.5 mt-10">
            {reviewsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`rounded-full transition-all duration-300 ${idx === currentIndex
                  ? 'w-8 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 9. Our Services (맞춤형 서비스)
// ==========================================
function Services() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary font-bold tracking-widest text-sm mb-2">OUR SERVICES</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary dark:text-white mb-4">맞춤형 부동산 서비스</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">매수부터 매도까지, 고객님의 상황에 맞는 최적의 솔루션을 제공합니다.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-background-light dark:bg-navy-dark rounded-2xl p-10 border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
            <h4 className="text-2xl font-bold text-secondary dark:text-white mb-2">매수인를 위한 서비스</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-8">내 집 마련의 꿈, 안전하고 확실하게 이루어 드립니다.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">맞춤형 매물 추천</h5>
                  <p className="text-sm text-gray-500">예산과 라이프스타일에 맞는 최적의 매물 선별</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">대출 및 부가서비스 제공</h5>
                  <p className="text-sm text-gray-500">최신 금리 정보 및 주택 구매 관련 서비스 상담</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">안전한 권리 분석</h5>
                  <p className="text-sm text-gray-500">철저한 등기부등본 외 권리분석 및 하자 체크리스트 진행</p>
                </div>
              </li>
            </ul>
            <a href="tel:02-441-1110" className="inline-flex items-center justify-center w-full py-3 px-6 bg-white dark:bg-surface-dark text-secondary dark:text-white font-bold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-secondary hover:text-white hover:border-secondary dark:hover:bg-secondary dark:hover:border-secondary transition-colors">
              매수 상담하기
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-secondary dark:bg-navy-dark text-white rounded-2xl p-10 relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
            <h4 className="text-2xl font-bold mb-2">매도인을 위한 서비스</h4>
            <p className="text-gray-300 mb-8">성공적인 매도, 최고의 가치로 보답하겠습니다.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-white">정확한 시세 평가</h5>
                  <p className="text-sm text-gray-400">실거래가 및 시장 동향 기반의 최적 매도 가격 산정</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-white">프리미엄 마케팅</h5>
                  <p className="text-sm text-gray-400">온/오프라인 다각적 매물 홍보</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                <div>
                  <h5 className="font-bold text-white">세무 컨설팅 지원</h5>
                  <p className="text-sm text-gray-400">양도소득세 등 복잡한 세금 문제 해결을 위한 조언</p>
                </div>
              </li>
            </ul>
            <a href="tel:02-441-1110" className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary text-navy-dark font-bold rounded-lg hover:bg-yellow-500 transition-colors">
              매도 상담하기
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 10. Community News (커뮤니티 소식) - imported from components
// ==========================================

// ==========================================
// 11. Call to Action (상담 예약)
// ==========================================
function CTA() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-secondary transform rotate-12"></div>
        <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[200%] bg-primary transform -rotate-12"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-white mb-6">내 편인 중개사를 원하시나요?</h2>
        <p className="text-gray-500 dark:text-gray-300 text-lg mb-10 max-w-2xl mx-auto">매물이 아닌 고객님의 이야기를 먼저 듣겠습니다.<br className="hidden sm:block" /> 편하게 연락 주세요. 큰문부동산이 내 편이 되어드립니다.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a className="bg-secondary hover:bg-navy-dark text-white font-bold py-4 px-10 rounded shadow-lg transition-transform transform hover:-translate-y-1" href="tel:02-441-1110">
            내 편과 상담 시작하기
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// ==========================================
// 12. Footer (푸터)
// ==========================================
function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-navy-dark pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 relative flex items-center justify-center bg-primary rounded-sm">
                <span className="material-symbols-outlined text-white text-lg">roofing</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-secondary dark:text-white tracking-wide">큰문부동산</span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              "내가 고객님 상황이라면 가장 좋은 선택이 뭘까?" 를 생각하는 부동산
            </p>
            <div className="flex space-x-4">
              <a className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all" href="#">
                <span className="text-xs font-bold">B</span>
              </a>
              <a className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all" href="#">
                <span className="text-xs font-bold">Y</span>
              </a>
              <a className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all" href="#">
                <span className="text-xs font-bold">I</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-secondary dark:text-white mb-6 tracking-wider text-sm uppercase relative inline-block">
              빠른 링크
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">매물 찾기</a></li>
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">시세 리포트</a></li>
              <li><Link className="hover:text-primary transition-colors hover:pl-1" to="/news">커뮤니티 소식</Link></li>
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">회사 소개</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-secondary dark:text-white mb-6 tracking-wider text-sm uppercase relative inline-block">
              서비스
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">매수 상담</a></li>
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">매도 의뢰</a></li>
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">임대 관리</a></li>
              <li><a className="hover:text-primary transition-colors hover:pl-1" href="#">투자 컨설팅</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-secondary dark:text-white mb-6 tracking-wider text-sm uppercase relative inline-block">
              연락처
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></span>
            </h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                <span>서울시 강동구 고덕로 353, 114호<br />(고덕동, 고덕그라시움 1상가 1층)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">call</span>
                <span className="font-bold text-secondary dark:text-white text-base">02.441.1110</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">smartphone</span>
                <span className="font-bold">010.9345.4108</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">© 2024 큰문부동산 공인중개사사무소. All rights reserved. | 대표: 이선규 | 등록번호: 11110-2024-00000</p>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border-l border-gray-300 dark:border-gray-700 pl-4">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>한국공인중개사협회 정회원</span>
            </div>
          </div>
          <div className="flex space-x-6 text-xs text-gray-500 dark:text-gray-500">
            <a className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors" href="#">개인정보처리방침</a>
            <a className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors" href="#">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// 13. Main App Component
// ==========================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="font-sans bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Navbar />
            <Hero />
            <Stats />
            <FeaturedListings />
            <NeighborhoodGuide />
            <MarketTrends />
            <AboutBroker />
            <ClientReviews />
            <Services />
            <CommunityNews />
            <CTA />
            <Footer />
          </div>
        } />

        <Route path="/news" element={
          <div className="font-sans bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow pt-20">
              <NewsBoard />
            </div>
            <Footer />
          </div>
        } />

        <Route path="/news/:id" element={
          <div className="font-sans bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow pt-20">
              <NewsDetailWrapper />
            </div>
            <Footer />
          </div>
        } />

        <Route path="/admin" element={
          isLoggedIn ? (
            <AdminPanel onLogout={handleLogout} />
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
