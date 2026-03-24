"use client";

import { motion, useScroll, Variants } from 'framer-motion';
import React, { useRef } from 'react';
import { useRouter } from "next/navigation";
import {
    FaMapMarkedAlt, FaClipboardList, FaChartPie, FaCode, FaTerminal,
    FaMapMarkerAlt, FaExternalLinkAlt, FaGithub
} from "react-icons/fa";
import { SiGoogle, SiNaver, SiNextdotjs, SiSpring, SiSpringboot } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { VscVscode } from "react-icons/vsc";
import { BiLogoPostgresql } from "react-icons/bi";

export default function Page() {
    const router = useRouter();
    const containerRef = useRef<HTMLElement>(null);

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVars: Variants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const { scrollYProgress } = useScroll();

    return (
        <main ref={containerRef} className="relative w-full bg-black flex flex-col items-center justify-center overflow-x-hidden scrollbar-hide">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-orange-400 origin-left z-9999"
                style={{ scaleX: scrollYProgress }}
            />

            <div className="fixed inset-0 z-0">
                <video
                    autoPlay loop muted playsInline preload="auto"
                    poster="/jeju.png"
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/jeju.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80" />
            </div>

            <section className="relative z-20 min-h-screen w-full flex items-center justify-center">
                <motion.div
                    variants={containerVars}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="relative z-20 flex flex-col justify-center items-center text-center px-4 w-full min-h-screen py-20"
                >
                    <div className="flex flex-col items-center my-auto">
                        <motion.h1
                            variants={itemVars}
                            className="text-[12vw] md:text-[8vw] font-[1000] tracking-widest uppercase leading-none text-orange-400/95"
                        >
                            PEECE<span className="text-white/95">MAKER</span>
                        </motion.h1>

                        <motion.div variants={itemVars} className="w-24 h-1 bg-transparent my-6 md:my-4" />

                        <motion.div variants={itemVars} className="space-y-6">
                            <p className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
                                THE GUARDIAN OF YOUR PRESTIGE
                            </p>
                            <div className="text-[14px] md:text-lg text-zinc-300/90 font-light leading-relaxed break-keep">
                                <p>
                                    제주도에서 신나는 여행을 즐기고 계신다 하더라도 당신에게 찾아올 생리적 위협은 이를 고려해주지 않습니다. <br />
                                    PEECEMAKER와 함께 당신이 평생 지켜온 사회적 지위를 수호할 은밀하고 위대한 작전을 계획해보십시오.
                                </p>
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVars}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/main')}
                            className="mt-12 px-10 md:px-24 py-5 md:py-6 bg-white/20 backdrop-blur-2xl text-white border border-white/20 text-sm md:text-lg rounded-full hover:text-orange-400 transition-colors cursor-pointer font-[950] tracking-[0.2em] md:tracking-[0.5em] uppercase"
                        >
                            EXPLORE YOUR HEAVEN
                        </motion.button>
                    </div>

                    <motion.div
                        variants={itemVars}
                        className="cursor-pointer group mt-auto pt-10"
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        <motion.div
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center gap-3"
                        >
                            <span className="text-white text-[11px] md:text-[13px] font-bold tracking-[1.2em] uppercase ml-[1.2em] whitespace-nowrap">
                                DOWN TO DETAIL
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            <section className="relative z-20 container mx-auto px-6 max-w-7xl">
                <section className="space-y-10 py-20">
                    <motion.div
                        variants={itemVars}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center space-y-4 mb-16"
                    >
                        <h3 className="text-sm font-black tracking-[0.5em] text-orange-400 uppercase">Architecture</h3>
                        <h2 className="text-5xl font-[1000] tracking-tighter text-white leading-none uppercase">THE KEY FUNCTIONS</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <FaMapMarkedAlt />, title: "Toilet Map", desc: "카카오 맵 API를 통해 주변의 지도를 화면에 띄우고 주변의 화장실에 대한 정보와 위치를 가져와 마커로 띄워 보여줍니다. 마커를 클릭시 해당 화장실에 대한 상세 정보와 사용자들이 남긴 리뷰를 볼 수 있으며 리뷰 작성과 화장실 특성에 따른 필터링 기능이 제공됩니다." },
                            { icon: <FaChartPie />, title: "Toilet Chart", desc: "Recharts 라이브러리를 활용해 시각화된 차트를 통해 화장실에 대한 여러 각종 통계들을 제공합니다. 통계로는 화장실이 많은 지역 순위, 남녀별 화장실 칸수, 리뷰 점수 상위 5등과 하위 5등을 볼 수 있습니다." },
                            { icon: <FaClipboardList />, title: "Toilet Board", desc: "사용자들이 정보나 대화를 나눌 수 있는 커뮤니티 공간을 제공합니다. 글과 댓글을 작성할 수 있으며 수정 및 삭제도 가능합니다." }
                        ].map((page, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVars}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-xl group hover:bg-white/15 transition-colors"
                            >
                                <div className="text-3xl text-orange-400 mb-6">{page.icon}</div>
                                <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter text-white">{page.title}</h4>
                                <p className="text-zinc-300 font-bold leading-relaxed">{page.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="py-20">
                    <motion.div
                        variants={itemVars}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center space-y-4 mb-16"
                    >
                        <h3 className="text-sm font-black tracking-[0.5em] text-orange-400 uppercase">Data Source</h3>
                        <h2 className="text-5xl font-[1000] tracking-tighter text-white leading-none uppercase">REGIONAL DATA INTEGRATION</h2>
                    </motion.div>

                    <motion.div
                        variants={itemVars}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h3 className="text-4xl md:text-5xl font-[1000] text-white leading-tight tracking-tighter">
                                    제주특별자치도<br /> 제주시 제공<br />
                                    <span className="text-orange-400">공중화장실 현황</span> 데이터
                                </h3>
                                <p className="text-xl text-zinc-100 font-bold leading-relaxed">
                                    PEECE MAKER는 제주시 내의 모든 공중화장실의 위치와 상세 시설 정보를 포함한 공공데이터를 기반으로 합니다. 위도, 경도를 통한 위치찾기, 화장실 내 시설통계나 비상벨 여부 등 상세 정보를 제공합니다.
                                </p>
                            </div>

                            <div className="bg-zinc-900/20 rounded-[3rem] p-8 border border-white/5 space-y-6">
                                <h4 className="text-orange-400 font-black tracking-widest uppercase text-xl flex items-center gap-2">
                                    <FaTerminal /> Dataset Specifications
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        { label: "데이터 명칭", value: "제주특별자치도 제주시_공중화장실" },
                                        { label: "제공 기관", value: "제주특별자치도 제주시" },
                                        { label: "출처", value: "공공 데이터 포털" },
                                        { label: "핵심 컬럼", value: "위도좌표, 경도좌표, 화장실입구CCTV설치여부, 개방시간 등" },
                                    ].map((item, i) => (
                                        <li key={i} className="flex flex-col border-b border-white/5 pb-3">
                                            <span className="text-lg text-orange-400 font-bold tracking-widest">{item.label}</span>
                                            <span className="text-white font-bold tracking-tighter">{item.value}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="https://www.data.go.kr/data/15110521/fileData.do"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-5 bg-orange-400 text-white font-[1000] rounded-2xl hover:bg-orange-500 transition-all group"
                                >
                                    데이터 확인 <FaExternalLinkAlt />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <footer className="pt-40 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                    >
                        <p className="text-zinc-500 font-bold tracking-[0.2em] text-xs uppercase">
                            © 2026 KDT-03 PEECE MAKER. ALL RIGHTS RESERVED.
                        </p>
                    </motion.div>
                </footer>
            </section>
        </main>
    );
}