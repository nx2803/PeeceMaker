"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { User, ChevronLeft, Send, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const supabase = createClient();
    const queryClient = useQueryClient();

    // 댓글 목록 가져오기
    const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
        queryKey: ['comments', post.boardId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('comment')
                .select(`
                    commentId:comment_id,
                    content,
                    createTime:create_time,
                    member_id,
                    member_profile (
                        member_id,
                        nickname,
                        username
                    )
                `)
                .eq('board_id', post.boardId)
                .order('comment_id', { ascending: true });

            if (error) throw error;

            return data.map((item: any) => ({
                commentId: item.commentId,
                content: item.content,
                member: {
                    memberId: item.member_id || item.member_profile?.member_id || 'Unknown',
                    nickname: (() => {
                        const m = Array.isArray(item.member_profile) ? item.member_profile[0] : item.member_profile;
                        if (m?.nickname) return m.nickname;
                        if (m?.username) return m.username.split('@')[0];
                        if (item.member_id) return `User_${String(item.member_id).substring(0, 5)}`;
                        return 'Unknown';
                    })()
                },
                createTime: item.createTime
            })) as Comments[];
        }
    });

    // 댓글 작성 Mutation
    const addCommentMutation = useMutation({
        mutationFn: async (text: string) => {
            const { error } = await supabase
                .from('comment')
                .insert({
                    content: text,
                    board_id: post.boardId,
                    member_id: userData.memberId,
                    create_time: new Date().toISOString()
                });
            if (error) throw error;
        },
        onSuccess: () => {
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: ['comments', post.boardId] });
            queryClient.invalidateQueries({ queryKey: ['board'] }); // 메인 목록의 댓글 수 업데이트
            toast.success("댓글이 등록되었습니다.");
        },
        onError: (error) => {
            toast.error("댓글 작성 실패: " + error.message);
        }
    });

    // 댓글 수정 Mutation
    const updateCommentMutation = useMutation({
        mutationFn: async ({ id, text }: { id: number, text: string }) => {
            const { error } = await supabase
                .from('comment')
                .update({ content: text })
                .eq('comment_id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['comments', post.boardId] });
            toast.success("댓글이 수정되었습니다.");
        },
        onError: (error) => {
            toast.error("댓글 수정 실패: " + error.message);
        }
    });

    // 댓글 삭제 Mutation
    const deleteCommentMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('comment')
                .delete()
                .eq('comment_id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', post.boardId] });
            queryClient.invalidateQueries({ queryKey: ['board'] });
            toast.success("댓글이 삭제되었습니다.");
        },
        onError: (error) => {
            toast.error("댓글 삭제 실패: " + error.message);
        }
    });

    // 게시글 삭제 Mutation
    const deletePostMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('board')
                .delete()
                .eq('board_id', post.boardId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("게시글이 삭제되었습니다.");
            onDeleteSuccess();
        },
        onError: (error) => {
            toast.error("게시글 삭제 실패: " + error.message);
        }
    });

    
    //댓글 작성 
    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        if (!userData?.memberId) {
            toast.warning("로그인이 필요합니다.");
            return;
        }
        addCommentMutation.mutate(commentText);
    };

    //댓글 수정
    const handleCommentUpdate = (commentId: number) => {
        if (!editText.trim()) return;
        updateCommentMutation.mutate({ id: commentId, text: editText });
    };

    //댓글 삭제
    const handleCommentDelete = (commentId: number) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        deleteCommentMutation.mutate(commentId);
    };

    // [DELETE] 게시글 삭제
    const handleDelete = () => {
        if (!confirm("게시글을 삭제하시겠습니까?")) return;
        deletePostMutation.mutate();
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
                    <ChevronLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                    <span className="hidden md:inline group-hover:-translate-x-1 transition-transform">BACK</span>
                </button>

                {canManagePost && (
                    <div className="flex items-center gap-2">
                        <button onClick={onEdit} className="flex items-center gap-1 px-4 py-2 bg-white/60 text-slate-700 font-black text-xs md:text-sm rounded-xl hover:bg-orange-400 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-zinc-300">
                            <Edit2 className="w-3.5 h-3.5" />
                            EDIT
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-1 px-4 py-2 bg-white/60 text-red-500 font-black text-xs md:text-sm rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm dark:bg-zinc-600/30 dark:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
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
                                <User className="w-10 h-10 text-slate-700 dark:text-orange-400" />
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
                            {comments.length}
                        </span>
                    </h3>

                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((item, index) => {
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
                                        <User className="w-8 h-8 text-slate-700 dark:text-orange-400 shrink-0 mt-1" />
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
                        disabled={!commentText.trim() || addCommentMutation.isPending}
                        className={`absolute right-3 p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${commentText.trim() && !addCommentMutation.isPending
                            ? "bg-orange-400 text-white hover:bg-orange-500"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-zinc-600 dark:text-white"
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}