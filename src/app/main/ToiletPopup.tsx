"use client";
import React from 'react'

import { AnimatePresence, motion } from "framer-motion";
import { Map, CustomOverlayMap, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import { FaMale, FaFemale, FaWheelchair, FaBaby, FaTimes, FaUserCircle } from "react-icons/fa";
import { MdBabyChangingStation } from "react-icons/md";
import Image from "next/image";
import kmap from '@/assets/map.png';
import { createClient } from '@/utils/supabase/client';

interface Toilet {
    dataCd: string;
    toiletNm: string;
    laCrdnt: number;
    loCrdnt: number;
    maleClosetCnt: number;
    maleUrinalCnt: number;
    femaleClosetCnt: number;
    maleDspsnClosetCnt: number;
    femaleDspsnClosetCnt: number;
    diaperExhgTablYn: string;
    photo?: string;
    rnAdres?: string;
    lnmAdres?: string;
    opnTimeInfo?: string;
    telno?: string;
    etcCn?: string;
}

interface Review {
    reviewId: number;
    user: string;
    rating: number;
    content: string;
    createDate: string;
    member: {
        memberId: string;
        nickname: string;
    }
    point: number;
}

interface ToiletPopupProps {
    data: Toilet;
    myPos: { lat: number; lng: number };
    onClose: () => void;
    User?: any;
}

export default function ToiletPopup({ data, myPos, onClose, User }: ToiletPopupProps) {

    const kakaoMapUrl = `https://map.kakao.com/link/from/현재위치,${myPos.lat},${myPos.lng}/to/${data.toiletNm},${data.laCrdnt},${data.loCrdnt}`;
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const supabase = createClient();
    const fetchReviews = async () => {
        try {
            const { data: reviewData, error } = await supabase
                .from('review')
                .select(`
                    reviewId:review_id,
                    content,
                    point,
                    createDate:create_date,
                    member:member_id (
                        memberId:member_id,
                        nickname
                    )
                `)
                .eq('data_cd', data.dataCd)
                .order('review_id', { ascending: false });

            if (reviewData) {
                const formatted = reviewData.map((rev: any) => ({
                    reviewId: rev.reviewId,
                    content: rev.content,
                    point: rev.point,
                    createDate: rev.createDate,
                    member: {
                        memberId: rev.member?.memberId || 'Unknown',
                        nickname: rev.member?.nickname || 'Unknown'
                    }
                }));
                setReviews(formatted as any);
            } else if (error) {
                console.error("Supabase 에러:", error);
            }
        } catch (err) {
            console.error("리뷰 로드 실패: ", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [data.dataCd]);


    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.point, 0) / reviews.length).toFixed(1)
        : "0.0";


    //리뷰 작성
    const handleSubmitReview = async () => {
        if (!comment.trim() || isSubmitting) return;
        if (!User?.memberId) {
            alert("로그인이 필요합니다.");
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('review')
                .insert({
                    data_cd: data.dataCd,
                    content: comment,
                    point: rating,
                    member_id: User.memberId,
                    create_date: new Date().toISOString()
                });

            if (!error) {
                setComment("");
                setRating(5);
                await fetchReviews();
            } else {
                alert(`제출 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("리뷰 제출 실패: ", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 리뷰 수정
    const handleUpdateReview = async (reviewId: number) => {
        try {
            const { error } = await supabase
                .from('review')
                .update({
                    content: editContent,
                    point: editRating
                })
                .eq('review_id', reviewId);

            if (!error) {
                setEditingReviewId(null);
                await fetchReviews();
                console.log("수정 완료!");
            } else {
                alert(`수정 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("🚨 수정 에러:", err);
        }
    };

    // 리뷰 삭제
    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("리뷰를 삭제하시겠습니까?")) return;

        try {
            const { data, error } = await supabase
                .from('review')
                .delete()
                .eq('review_id', reviewId);

            if (!error) {
                console.log("삭제 완료");
                await fetchReviews(); // Re-fetch reviews after deletion
            } else {
                alert(`삭제 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("삭제 통신 오류:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 0, x: "-50%", scale: 0 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 0, x: "-50%", scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-32 left-1/2 z-9999 w-[80%] h-[75%] overflow-y-auto bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl scrollbar-hide dark:bg-zinc-600/30 dark:border-zinc-400/10"

        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/10 backdrop-blur-md rounded-full text-white hover:bg-orange-400 transition-all"
            >
                <FaTimes size={16} />
            </button>
            <div className="relative h-60 w-full">
                <img
                    src={"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"}
                    alt={data.toiletNm}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop";
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">

                    <h2 className="flex flex-wrap items-center gap-2 text-2xl md:text-4xl font-[1000] text-white tracking-tighter drop-shadow-lg leading-tight">

                        <span className="shrink-0">{data.toiletNm}</span>

                        <a
                            href={kakaoMapUrl}
                            className="inline-flex ml-2 items-center transition-transform active:scale-90"
                            target="_blank">
                            <Image
                                src={kmap}
                                alt="카카오맵"
                                width={30}
                                height={30}
                                className="md:w-8.5 md:h-8.5 rounded-xl" />
                        </a>
                    </h2>
                </div>

            </div>
            <div className="p-6 space-y-4   ">
                <div className="flex flex-row items-center w-full justify-between ic">
                    <div className="flex flex-row gap-1.5">
                        {(Number(data.maleClosetCnt) > 0) && (
                            <div className="w-10 h-7 md:w-14 md:h-9 flex items-center justify-center bg-cyan-50 rounded-xl text-cyan-600 shadow-sm border border-cyan-100/50">
                                <FaMale size={22} />
                            </div>
                        )}
                        {(Number(data.femaleClosetCnt) > 0) && (
                            <div className="w-10 h-7 md:w-14 md:h-9 flex items-center justify-center bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100/50">
                                <FaFemale size={22} />
                            </div>
                        )}
                        {(Number(data.maleDspsnClosetCnt) > 0 || Number(data.femaleDspsnClosetCnt) > 0) && (
                            <div className="w-10 h-7 md:w-14 md:h-9 flex items-center justify-center bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100/50">
                                <FaWheelchair size={22} />
                            </div>
                        )}
                        {data.diaperExhgTablYn === "Y" && (
                            <div className="w-10 h-7 md:w-14 md:h-9 flex items-center justify-center bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100/50">
                                <MdBabyChangingStation size={27} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center bg-orange-400 text-white px-3 py-1 rounded-full shadow-lg transform ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                        </svg>
                        <span className="font-black text-lg">{averageRating}</span>
                    </div>

                </div>
                <div className="flex flex-col   mt-5">
                    <span className="text-4xl font-black text-orange-400 uppercase">Address</span>
                    <p className="text-slate-700 dark:text-white font-bold text-xl leading-tight">
                        {data.rnAdres || data.lnmAdres || "주소 정보 없음"}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col text-slate-700 dark:text-white">
                        <span className="text-4xl font-black uppercase text-orange-400 ">Opening</span>
                        <p className="text-xl font-extrabold   ">{data.opnTimeInfo || "정보없음"}</p>
                    </div>

                    <div className="flex flex-col border-white/20 text-slate-700 dark:text-white">
                        <span className="text-4xl font-black uppercase text-orange-400 ">Contact</span>
                        <p className="text-2xl font-extrabold ">{data.telno || "번호없음"}</p>
                    </div>
                </div>
                {data.etcCn && (
                    <div className="flex flex-col text-slate-700 dark:text-white ">
                        <span className="text-4xl font-black uppercase  text-orange-400">ETC</span>
                        <p className="text-xl font-extrabold ">{data.etcCn}</p>
                    </div>
                )}



                <div className="mt-4 border-t border-white/20 pt-2 pb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                        <h3 className="text-3xl md:text-4xl font-[1000] text-slate-700 dark:text-white uppercase ">
                            Review
                        </h3>
                        <div className="flex gap-1   p-2 self-start sm:self-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-all duration-200 ${star <= rating ? "text-orange-400 scale-110" : "text-slate-300"}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-7 h-7 md:w-8 md:h-8"
                                    >
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="리뷰 작성"
                            className="w-full bg-white/50 backdrop-blur-md border-2 border-white/50 rounded-4xl px-6 py-5 pr-20 font-bold text-slate-800 outline-none focus:border-orange-400/50 focus:bg-white/50 transition-all resize-none dark:bg-zinc-600/30 dark:border-zinc-400/10 dark:text-white focus:dark:bg-zinc-800/50"
                        />
                        <button
                            onClick={handleSubmitReview}
                            className="absolute right-4 bottom-4 px-6 py-3 bg-orange-400 text-white rounded-2xl font-black text-sm hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all shadow-lg "
                        >
                            POST
                        </button>
                    </div>

                    <div className="space-y-4 mt-5">
                        {reviews.length > 0 ? (reviews.map((rev) => (
                            <div key={rev.reviewId} className="relative bg-white/40 backdrop-blur-md p-5 rounded-4xl border border-white/70 dark:bg-zinc-600/30 dark:border-zinc-400/10 ">
                                {editingReviewId === rev.reviewId ? (
                                    /* 수정 모드 UI */
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button key={num} onClick={() => setEditRating(num)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${num <= editRating ? "text-orange-400" : "text-slate-300"}`}>
                                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full p-4 rounded-3xl bg-white/60 focus:border-2 focus:border-orange-400/50 outline-none dark:bg-zinc-800/50 dark:text-white  resize-none"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingReviewId(null)} className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase">Cancel</button>
                                            <button onClick={() => handleUpdateReview(rev.reviewId)} className="px-4 py-2 text-[10px] font-black text-orange-400 uppercase">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 일반 모드 UI */
                                    <>
                                        <div className="flex justify-between items-center mb-2 ">
                                            <span className="font-black text-slate-800 dark:text-white flex flex-row">
                                                <div className="w-5 h-5 md:w-6 md:h-6 mr-1 rounded-full text-slate-700 dark:text-orange-400 flex items-center justify-center text-5xl overflow-hidden">
                                                    <FaUserCircle />
                                                </div>{rev.member.nickname}</span>
                                            <div className="flex text-orange-400">
                                                {[...Array(rev.point)].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-700 dark:text-zinc-200 font-bold leading-relaxed pr-16">{rev.content}</p>
                                        <span className="text-[10px] text-slate-400 mt-2 block font-black uppercase tracking-tighter">{rev.createDate}</span>

                                        {(User && (rev.member.memberId === User.memberId || User.role === "ROLE_ADMIN")) && (
                                            <div className="absolute bottom-4 right-6 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingReviewId(rev.reviewId);
                                                        setEditContent(rev.content);
                                                        setEditRating(rev.point);
                                                    }}
                                                    className="text-[10px] font-black text-slate-400 hover:text-orange-400 transition-colors uppercase"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(rev.reviewId)}
                                                    className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))) : (<div className="text-center py-10 text-slate-500 font-bold">아직 리뷰가 없어요... 첫 리뷰를 남겨보세요!</div>)}

                    </div>
                </div>
            </div>
        </motion.div>
    )
}