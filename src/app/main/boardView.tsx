"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaUserCircle, FaSearch, FaChevronLeft, FaChevronRight, FaRegCommentDots } from "react-icons/fa";
import BoardDetail from './boardDetail';
import BoardWrite from './boardWrite';
import { createClient } from '@/utils/supabase/client';

interface Board {
    boardId: number;
    nickname: string;
    title: string;
    content: string;
    memberId: string;
    createDate: string;
    commentCnt: number;
}

interface BoardViewProps {
    userData?: any;
}

export default function BoardView({ userData }: BoardViewProps) {
    const [board, setBoard] = useState<Board[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'write' | 'detail' | 'edit'>('list');
    const [selectedPost, setSelectedPost] = useState<Board | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 8;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const supabase = createClient();

    const fetchBoardData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('board')
                .select(`
                    boardId:board_id,
                    title,
                    content,
                    memberId:member_id,
                    createDate:create_date,
                    member:member_id (nickname),
                    comment (count)
                `)
                .order('board_id', { ascending: false });

            if (data) {
                const formattedData = data.map((item: any) => ({
                    boardId: item.boardId,
                    nickname: item.member?.nickname || 'Unknown',
                    title: item.title,
                    content: item.content,
                    memberId: item.memberId,
                    createDate: item.createDate,
                    commentCnt: item.comment?.[0]?.count || 0
                }));

                setBoard(formattedData);
            } else if (error) {
                console.error("Supabase 에러:", error);
            }
        } catch (err) {
            console.error("데이터 로딩 에러:", err);
        } finally {
            setIsReady(true);
        }
    }, [supabase]);

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [currentPage]);

    const filteredBoard = useMemo(() => {
        return board.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.nickname.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [board, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredBoard.length / POSTS_PER_PAGE);
    const currentPosts = filteredBoard.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const getPageNumbers = () => {
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handlePostClick = (post: Board) => {
        setSelectedPost(post);
        setViewMode('detail');
    };

    const handleWriteClick = () => {
        if (!userData || !userData.nickname) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }
        setViewMode('write');
    };

    if (!isReady) return null;

    return (
        <div className="w-full h-full flex items-center justify-center pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-8 bg-transparent">
            <div className="w-full max-w-5xl h-[75vh] md:h-187.5 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-4xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden text-slate-900 relative dark:bg-zinc-600/10 dark:border-zinc-400/10 dark:text-white">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full">
                            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar touch-pan-y overflow-x-hidden">
                                <div className="flex flex-col">
                                    <AnimatePresence mode="popLayout">
                                        {currentPosts.map((post) => (
                                            <motion.div
                                                key={post.boardId}
                                                layout
                                                onClick={() => handlePostClick(post)}
                                                className="group flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 md:px-10 py-6 md:py-8 border-b border-white/20 transition-all cursor-pointer  dark:border-zinc-400/10">
                                                <div className="md:col-span-9 flex flex-col gap-1 md:gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg md:text-xl font-[1000] group-hover:text-orange-400 transition-colors tracking-tight truncate">
                                                            {post.title}
                                                        </h3>
                                                        {post.commentCnt > 0 && (
                                                            <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-orange-400 md:text-xs font-black">
                                                                <FaRegCommentDots className="text-[12px]" />
                                                                {post.commentCnt}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-200 font-bold text-[12px] md:text-sm line-clamp-1 opacity-70">{post.content}</p>
                                                </div>
                                                <div className="md:col-span-3 flex items-center md:items-end md:justify-center justify-between mt-2 md:mt-0">
                                                    <div className="flex items-center gap-2">
                                                        <FaUserCircle className="text-slate-700 dark:text-orange-400 text-xl" />
                                                        <span className="font-black text-[11px] md:text-sm tracking-tight">{post.nickname}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {filteredBoard.length === 0 && (
                                        <div className="py-20 text-center font-black text-slate-400">검색 결과 없음.</div>
                                    )}
                                </div>
                            </div>

                            {totalPages > 0 && (
                                <div className="flex justify-center items-center gap-1 md:gap-2 py-4">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="w-8 h-8 flex items-center justify-center disabled:opacity-10 hover:text-orange-400 transition-colors"><div className="flex items-center -space-x-1"><FaChevronLeft size={10} /><FaChevronLeft size={10} /></div></button>
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-8 h-8 flex items-center justify-center disabled:opacity-20 hover:text-orange-400 transition-colors"><FaChevronLeft size={14} /></button>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        {getPageNumbers().map((pageNum) => (
                                            <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl font-black text-xs md:text-sm transition-all ${currentPage === pageNum ? "bg-orange-400 text-white shadow-lg shadow-orange-400/30" : "hover:bg-white/60 dark:bg-zinc-600/60 dark:text-white text-slate-600 bg-white/30 dark:hover:bg-zinc-500"}`}>{pageNum}</button>
                                        ))}
                                    </div>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-8 h-8 flex items-center justify-center disabled:opacity-20 hover:text-orange-400 transition-colors"><FaChevronRight size={14} /></button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 flex items-center justify-center disabled:opacity-10 hover:text-orange-400 transition-colors"><div className="flex items-center -space-x-1"><FaChevronRight size={10} /><FaChevronRight size={10} /></div></button>
                                </div>
                            )}

                            <div className="px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative w-full md:w-72 group">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white group-focus-within:text-orange-400 transition-colors " />
                                    <input type="text" placeholder="SEARCH POSTS" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/50 border border-white/60 rounded-2xl py-3 pl-12 pr-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all placeholder:text-slate-400 dark:bg-zinc-600/30 dark:border-zinc-400/10 dark:text-white" />
                                </div>
                                <button onClick={handleWriteClick} className="w-full md:w-auto px-8 py-4 bg-orange-400 text-white rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 border border-white/20 hover:bg-orange-500 active:scale-95 transition-all duration-300">
                                    <FaEdit className="text-xl md:text-2xl" />
                                    <span className="font-[1000] tracking-tighter text-sm md:text-base uppercase">Write</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : viewMode === 'write' || viewMode === 'edit' ? (
                        <BoardWrite
                            key="write"
                            mode={viewMode}
                            userData={userData}
                            post={viewMode === 'edit' ? selectedPost : null}
                            onBack={() => setViewMode(viewMode === 'edit' ? 'detail' : 'list')}
                            onSuccess={() => {
                                fetchBoardData(); 
                                setViewMode('list');
                            }}
                        />
                    ) : (
                        selectedPost && (
                            <BoardDetail
                                key="detail"
                                post={selectedPost} 
                                userData={userData}
                                onBack={() => setViewMode('list')}
                                onEdit={() => setViewMode('edit')}
                                onDeleteSuccess={() => {
                                    fetchBoardData();
                                    setViewMode('list');
                                }}
                            />
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}