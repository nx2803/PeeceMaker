"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FaUserCircle, FaChevronLeft, FaPaperPlane } from "react-icons/fa";
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

interface DetailProps {
    post: Board;
    onBack: () => void;
    onEdit: () => void;
    onDeleteSuccess: () => void;
    userData?: any;
}

interface Comments {
    commentId: number,
    content: string,
    member: {
        memberId: string;
        nickname: string;
    }
    createTime: string;
}

export default function BoardDetail({ post, onBack, onEdit, onDeleteSuccess, userData }: DetailProps) {
    const [commentText, setCommentText] = useState("");
    const [comment, setComment] = useState<Comments[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const supabase = createClient();

    
    // 댓글 목록 가져오기
    const fetchCommentData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('comment')
                .select(`
                    commentId:comment_id,
                    content,
                    createTime:create_time,
                    member:member_id (
                        memberId:member_id,
                        nickname
                    )
                `)
                .eq('board_id', post.boardId)
                .order('comment_id', { ascending: true });

            if (data) {
                const formattedData = data.map((item: any) => ({
                    commentId: item.commentId,
                    content: item.content,
                    member: {
                        memberId: item.member?.memberId || 'Unknown',
                        nickname: item.member?.nickname || 'Unknown',
                    },
                    createTime: item.createTime
                }));
                setComment(formattedData);
            } else if (error) {
                console.error("Supabase 에러:", error);
            }
        } catch (err) {
            console.error("데이터 로딩 에러:", err);
        }
    }, [post.boardId, supabase]);

    useEffect(() => {
        fetchCommentData();
    }, [fetchCommentData]);

    //댓글 작성 
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        if (!userData?.memberId) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const { error } = await supabase
                .from('comment')
                .insert({
                    content: commentText,
                    board_id: post.boardId,
                    member_id: userData.memberId,
                    create_time: new Date().toISOString()
                });

            if (!error) {
                setCommentText("");
                fetchCommentData();
            } else {
                console.error("작성 실패:", error);
                alert(`작성 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("댓글 작성 에러:", err);
        }
    };

    //댓글 수정
    const handleCommentUpdate = async (commentId: number) => {
        if (!editText.trim()) return;

        try {
            const { error } = await supabase
                .from('comment')
                .update({
                    content: editText,
                })
                .eq('comment_id', commentId);

            if (!error) {
                setEditingId(null);
                fetchCommentData();
            } else {
                alert(`수정 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("댓글 수정 에러:", err);
        }
    };

    //댓글 삭제
    const handleCommentDelete = async (commentId: number) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const { error } = await supabase
                .from('comment')
                .delete()
                .eq('comment_id', commentId);

            if (!error) {
                fetchCommentData();
            } else {
                alert(`삭제 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("댓글 삭제 에러:", err);
        }
    };

    // [DELETE] 게시글 삭제
    const handleDelete = async () => {
        if (!confirm("삭제하시겠습니까?")) return;

        try {
            // In a real scenario, you might need to handle cascading deletes for comments.
            // But if Supabase/DB is set up with ON DELETE CASCADE, it works.
            const { error } = await supabase
                .from('board')
                .delete()
                .eq('board_id', post.boardId);

            if (!error) {
                onDeleteSuccess();
            } else {
                alert(`삭제 실패: ${error.message}`);
            }
        } catch (err) {
            console.error("삭제 통신 오류:", err);
        }
    };

    const canManagePost = userData?.memberId === post?.memberId || userData?.role === 'ROLE_ADMIN';

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    if (!post) return null;

    return (
        <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 ">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/60 rounded-2xl hover:text-white transition-all shadow-sm active:scale-90 text-slate-700 flex items-center gap-2 font-black text-sm dark:bg-zinc-600/30 dark:border-zinc-400/10 dark:text-white hover:bg-orange-400 group"
                >
                    <FaChevronLeft className='group-hover:-translate-x-1 transition-transform' />
                    <span className="hidden md:inline group-hover:-translate-x-1 transition-transform">BACK</span>
                </button>

                {canManagePost && (
                    <div className="flex items-center gap-2">
                        <button onClick={onEdit} className="px-4 py-2 bg-white/60 text-slate-700 font-black text-xs md:text-sm rounded-xl hover:bg-orange-400 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-zinc-300">
                            EDIT
                        </button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-white/60 text-red-500 font-black text-xs md:text-sm rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-red-400">
                            DELETE
                        </button>
                    </div>
                )}
            </div>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-10">
                <section className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-[1000] text-slate-800 dark:text-white tracking-tighter leading-tight wrap-break-words">
                            {post.title}
                        </h2>
                        <div className="flex items-center justify-between pb-6">
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-4xl text-slate-700 dark:text-orange-400" />
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-800 dark:text-white text-base leading-none mb-1">{post.nickname}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        {formatDate(post.createDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-lg md:text-xl text-slate-800 dark:text-white font-medium leading-relaxed whitespace-pre-wrap min-h-50 bg-white/40 dark:bg-zinc-800/40 p-8 rounded-4xl border border-white/20  dark:border-zinc-400/10">
                        {post.content}
                    </div>
                </section>

                {/* 댓글 섹션 */}
                <section className="space-y-6 pb-10">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        COMMENTS
                        <span className="text-orange-400 bg-orange-100 dark:bg-zinc-500/30 px-3 py-1 rounded-full text-sm">
                            {comment.length}
                        </span>
                    </h3>

                    <div className="space-y-4">
                        {comment.length > 0 ? (
                            comment.map((item, index) => {
                                const isCommentAuthor = userData?.memberId === item.member.memberId || userData?.role === 'ROLE_ADMIN';
                                const isEditing = editingId === item.commentId;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={`comment-${item.commentId}`}
                                        className="flex gap-4 items-start"
                                    >
                                        <FaUserCircle className="text-slate-700 dark:text-orange-400 text-3xl shrink-0 mt-1" />
                                        <div className="flex flex-col p-5 rounded-3xl shadow-sm border border-white/80 w-full dark:border-zinc-400/10 bg-white/40 dark:bg-zinc-800/40">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-black text-sm text-slate-700 dark:text-white">{item.member.nickname}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    {new Date(item.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="w-full p-3 rounded-xl border-2 border-orange-400 bg-white dark:bg-zinc-700 dark:text-white focus:outline-none font-bold text-sm"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingId(null)} className="text-xs font-bold text-slate-400">CANCEL</button>
                                                        <button onClick={() => handleCommentUpdate(item.commentId)} className="text-xs font-black text-orange-400">SAVE</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base leading-normal">
                                                    {item.content}
                                                </p>
                                            )}

                                            {isCommentAuthor && !isEditing && (
                                                <div className="flex justify-end gap-3 mt-2 pt-2  dark:border-zinc-700">
                                                    <button
                                                        onClick={() => { setEditingId(item.commentId); setEditText(item.content); }}
                                                        className="text-[10px] font-black text-slate-400 hover:text-orange-400 transition-colors uppercase"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleCommentDelete(item.commentId)}
                                                        className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-16  rounded-4xl text-slate-400 font-black ">
                                <p>NO COMMENTS YET.</p>
                                <p className="text-xs opacity-70">WRITE THE FIRST COMMENT</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* 하단 댓글 입력창 */}
            <div className="p-6">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCommentSubmit();
                            }
                        }}
                        placeholder="LEAVE A COMMENT"
                        className="w-full p-5 pr-16 rounded-3xl border-2 border-white/50 bg-white/80 focus:outline-none focus:border-orange-400 font-black text-slate-700 placeholder:text-slate-400 transition-all  dark:bg-zinc-800/50 dark:border-zinc-600/10 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim()}
                        className={`absolute right-3 p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${commentText.trim()
                            ? "bg-orange-400 text-white hover:bg-orange-500"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-zinc-600 dark:text-white"
                            }`}
                    >
                        <FaPaperPlane size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}