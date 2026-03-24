"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import { FaShieldAlt, FaWheelchair, FaToilet, FaLayerGroup } from "react-icons/fa";
import { MdBabyChangingStation } from "react-icons/md";
import { useTheme } from 'next-themes';
import { createClient } from '@/utils/supabase/client';

interface Toilet {
    dataCd: string;
    toiletNm: string;
    emgncBellInstlYn: string;
    toiletEntrncCctvInstlYn: string;
    maleClosetCnt: number;
    laCrdnt: number;
    loCrdnt: number;
}
interface ReviewRank {
    toiletNm: string;
    dataCd: string;
    point: number;
    reviewCnt: number;
}


export default function ChartView() {
    const [rawToiletData, setRawToiletData] = useState<any[]>([]);
    const [filterMode, setFilterMode] = useState<'all' | 'secure' | 'accessible' | 'family'>('all');
    const [reviewRank, setReviewRank] = useState<ReviewRank[]>([]);

    const { theme, resolvedTheme } = useTheme();
    const tickColor = resolvedTheme === 'dark' ? '#cbd5e1' : '#1e293b';
    const supabase = createClient();

    useEffect(() => {
        const fetchToilets = async () => {
            try {
                // Fetch all toilets
                const { data: toiletData, error: toiletError } = await supabase
                    .from('toilet_info')
                    .select('*');

                if (toiletError) throw toiletError;

                const list = toiletData || [];
                // snake_case -> camelCase 변환
                const sanitized = list.map((item: any) => {
                    const newItem: any = {};
                    for (const key in item) {
                        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                        newItem[camelKey] = item[key];
                    }
                    return newItem;
                });
                setRawToiletData(sanitized);

                // Fetch all reviews to calculate rankings (Simulation of getreviewstat)
                const { data: reviewData, error: reviewError } = await supabase
                    .from('review')
                    .select('point, data_cd, toilet_info!inner(toilet_nm)');

                if (reviewError) throw reviewError;

                // Aggregate stats
                const stats: Record<string, { toiletNm: string, dataCd: string, totalPoint: number, count: number }> = {};
                reviewData.forEach((rev: any) => {
                    const cd = rev.data_cd;
                    if (!stats[cd]) {
                        stats[cd] = { toiletNm: rev.toilet_info.toilet_nm, dataCd: cd, totalPoint: 0, count: 0 };
                    }
                    stats[cd].totalPoint += Number(rev.point);
                    stats[cd].count += 1;
                });

                const formattedRank: ReviewRank[] = Object.values(stats).map(s => ({
                    toiletNm: s.toiletNm,
                    dataCd: s.dataCd,
                    point: s.totalPoint / s.count,
                    reviewCnt: s.count
                })).sort((a, b) => b.point - a.point);

                setReviewRank(formattedRank);
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            }
        };

        fetchToilets();
    }, [supabase]);


    const totalStats = useMemo(() => {
        if (!rawToiletData.length) return null;
        return {
            all: rawToiletData.length,
            secure: rawToiletData.filter(t => t.emgncBellInstlYn === 'Y' || t.toiletEntrncCctvInstlYn === 'Y').length,
            accessible: rawToiletData.filter(t => (Number(t.maleDspsnClosetCnt) > 0) || (Number(t.femaleDspsnClosetCnt) > 0)).length,
            family: rawToiletData.filter(t => t.diaperExhgTablYn === 'Y').length,
        };
    }, [rawToiletData]);


    const filteredData = useMemo(() => {
        switch (filterMode) {
            case 'secure': return rawToiletData.filter(t => t.emgncBellInstlYn === 'Y' || t.toiletEntrncCctvInstlYn === 'Y');
            case 'accessible': return rawToiletData.filter(t => (Number(t.maleDspsnClosetCnt) > 0) || (Number(t.femaleDspsnClosetCnt) > 0));
            case 'family': return rawToiletData.filter(t => t.diaperExhgTablYn === 'Y');
            default: return rawToiletData;
        }
    }, [rawToiletData, filterMode]);



    const emdStats = useMemo(() => {
        const counts: any = {};
        filteredData.forEach(t => { counts[t.emdNm] = (counts[t.emdNm] || 0) + 1; });
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
            .sort((a: any, b: any) => b.value - a.value).slice(0, 7);
    }, [filteredData]);

    const genderStats = useMemo(() => {
        let male = 0, female = 0;
        filteredData.forEach(t => {
            male += (Number(t.maleClosetCnt) || 0) + (Number(t.maleUrinalCnt) || 0);
            female += (Number(t.femaleClosetCnt) || 0);
        });
        return [
            { name: '남성', value: male, fill: '#00b8db' },
            { name: '여성', value: female, fill: '#ff2056' }
        ];
    }, [filteredData]);

    const filteredIds = useMemo(() => {
        if (!filteredData.length) return new Set();
        return new Set(filteredData.map(t => String(t.toiletNm)));
    }, [filteredData]);

    // 리뷰 랭킹
    const RankItem = ({ item, index, type }: { item: any, index: number, type: 'top' | 'worst' }) => (
        <motion.div
            className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/20 transition-all min-w-0 w-full dark:bg-zinc-600/30 dark:border-zinc-400/10"
        >
            {/* 왼쪽 섹션: 등수 + 이름 */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`text-xl font-black shrink-0 w-8 ${type === 'top' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base md:text-lg truncate block" title={item.name}>
                        {item.name}
                    </h4>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        {item.reviewCount} Reviews
                    </p>
                </div>
            </div>

            {/* 오른쪽 섹션: 평점 */}
            <div className={`flex items-center gap-1 bg-white dark:bg-zinc-600 px-3 py-1 rounded-xl shadow-sm shrink-0 ml-2  `}>
                <span className={`text-xs ${type === 'top' ? 'text-emerald-500' : 'text-red-500'}`}>★</span>
                <span className="font-black text-slate-800 dark:text-white text-sm">{item.score}</span>
            </div>
        </motion.div>
    );



    const top5 = useMemo(() => {
        if (!reviewRank.length || filteredIds.size === 0) return [];

        return reviewRank
            .filter(item => filteredIds.has(String(item.toiletNm)))
            .slice(0, 5)
            .map(item => ({
                name: item.toiletNm,
                score: item.point.toFixed(1),
                reviewCount: item.reviewCnt
            }));
    }, [reviewRank, filteredIds]);

    const worst5 = useMemo(() => {
        if (!reviewRank.length || filteredIds.size === 0) return [];

        return reviewRank
            .filter(item => filteredIds.has(String(item.toiletNm))).sort((a, b) => Number(a.point) - Number(b.point))
            .slice(0, 5)
            .map(item => ({
                name: item.toiletNm,
                score: item.point.toFixed(1),
                reviewCount: item.reviewCnt
            }));
    }, [reviewRank, filteredIds]);

    return (
        <div className="w-full h-full relative overflow-y-auto pb-40 pt-32 px-4 md:px-8 custom-scrollbar bg-transparent text-slate-800 dark:text-white">
            <div className="max-w-5xl mx-auto flex flex-col gap-12">


                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { id: 'all', label: '전체 시설', icon: <FaToilet />, count: totalStats?.all, color: 'ring-slate-400/50' },
                        { id: 'secure', label: '비상벨, CCTV 설치 시설', icon: <FaShieldAlt />, count: totalStats?.secure, color: 'ring-emerald-500/50' },
                        { id: 'accessible', label: '장애인 편의 시설', icon: <FaWheelchair />, count: totalStats?.accessible, color: 'ring-blue-500/50' },
                        { id: 'family', label: '유아 편의 시설', icon: <MdBabyChangingStation />, count: totalStats?.family, color: 'ring-orange-400/50' },
                    ].map((btn) => (
                        <motion.button
                            key={btn.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFilterMode(btn.id as any)}
                            className={`p-6 rounded-2xl backdrop-blur-md transition-all flex flex-col items-center gap-2 shadow-xl border-none outline-none isolate transform-gpu 
                                ${filterMode === btn.id
                                    ? `bg-white/60 dark:bg-zinc-600/60 ring-4 ring-inset ${btn.color}`
                                    : 'bg-white/20 dark:bg-zinc-600/40 opacity-50 hover:opacity-100'}`}>
                            <span className="text-2xl mb-1 shrink-0">{btn.icon}</span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 text-center break-keep">
                                {btn.label}
                            </span>
                            <span className="text-3xl font-[1000]  shrink-0">{btn.count}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                    {/* 지역별 분포 */}
                    <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-xl shadow-2xl h-[400px] flex flex-col dark:bg-zinc-600/30 dark:border-zinc-400/10">
                        <h3 className="text-xl font-black mb-6 uppercase tracking-tight">
                            지역별 분포
                        </h3>

                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emdStats}>
                                {/* <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" /> */}
                                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: tickColor }} fontSize={12} />
                                <YAxis hide />
                                <Bar dataKey="value" fill="#fb9928" radius={[10, 10, 0, 0]} barSize={40} isAnimationActive={true}>
                                    <LabelList
                                        dataKey="value"
                                        position="middle"
                                        style={{ fill: '#ffffff', fontWeight: '900', fontSize: '14px' }}
                                        offset={10} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    </motion.div>

                    {/* 남녀 변기 비율 */}
                    <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-2xl h-[400px] flex flex-col dark:bg-zinc-600/30 dark:border-zinc-400/10">
                        <h3 className="text-xl font-black mb-6 uppercase tracking-tight">
                            남녀 수용력
                        </h3>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={genderStats} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value"  isAnimationActive={true} animationEasing="ease-out" animationDuration={500} stroke="none"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle = 0, innerRadius, outerRadius, value }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x} y={y}
                                                fill="white"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className="font-black text-sm">
                                                {value}
                                            </text>
                                        );
                                    }}>
                                    {genderStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>

                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 col-span-1 md:col-span-2">

                        {/* TOP 5 */}
                        <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-3xl shadow-2xl dark:bg-zinc-600/30 dark:border-zinc-400/10">
                            <h3 className="text-2xl font-[1000] text-emerald-500 uppercase tracking-tighter mb-8">Top 5 Rated</h3>
                            <div className="flex flex-col gap-4">
                                {top5.map((item, index) => (
                                    <RankItem key={`top-${index}`} item={item} index={index} type="top" />
                                ))}
                            </div>
                        </motion.div>

                        {/* WORST 5 */}
                        <motion.div layout className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-3xl shadow-2xl dark:bg-zinc-600/30 dark:border-zinc-400/10">
                            <h3 className="text-2xl font-[1000] text-rose-500 uppercase tracking-tighter mb-8">Worst 5 Rated</h3>
                            <div className="flex flex-col gap-4">
                                {worst5.map((item, index) => (
                                    <RankItem key={`worst-${index}`} item={item} index={index} type="worst" />
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}