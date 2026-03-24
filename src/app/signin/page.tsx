"use client";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";


export default function signinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warning("모든 정보를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: name,
          },
        },
      });

      if (!error) {
        toast.success("가입 성공! 이메일을 확인해 주세요.");
        router.push("/login");
      } else {
        console.error(error);
        toast.error(`가입 실패: ${error.message}`);
      }
    } catch (error) {
      toast.error(`가입 도중 오류가 발생했습니다.`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
    },
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <main className="fixed inset-0 overflow-hidden flex items-center justify-center p-6">

      <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#e1fbff] via-[#ffe9c5] to-[#e0f5ff]" />
      {resolvedTheme === 'dark' && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-zinc-950/80 mix-blend-multiply" />
      )}



      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-lg z-10"
      >
        <div className="relative overflow-hidden rounded-[40px] bg-white/30 backdrop-blur-[30px] border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] p-12 md:p-16 dark:bg-zinc-600/30 dark:border-zinc-400/10">
          <form onSubmit={handleSignin} className="relative z-10">
            {/* HEADER */}
            <motion.div variants={itemVars} className="mb-14">
              <h2 className="text-5xl font-[950] tracking-tighter uppercase text-slate-800 dark:text-white">
                SIGN <span className="text-orange-400">IN</span>
              </h2>
              <p className="mt-6 text-[11px] font-black tracking-[0.5em] text-slate-500 dark:text-slate-200 uppercase leading-relaxed">
                For your <br />Royal Road
              </p>
            </motion.div>


            <motion.div variants={itemVars} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NICK NAME"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-white/40 dark:bg-zinc-800/50 dark:border-zinc-400/10 border border-white/20 px-7 py-5 rounded-2xl outline-none focus:bg-white/80 dark:focus:bg-zinc-800/80 ring-2 ring-transparent focus:ring-orange-400 transition-all text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 text-sm tracking-widest font-bold"
              />
            </motion.div>


            <motion.div variants={itemVars} className="group relative w-full mt-10">
              <button type="submit" disabled={isLoading} className="relative w-full py-6 cursor-pointer active:scale-95 transition-all duration-500 rounded-2xl overflow-hidden shadow-orange-200/30">

                <div className="absolute inset-0 bg-orange-400 transition-colors duration-500 group-hover:bg-orange-500" />
                <div className="absolute inset-0 rounded-2xl border border-white/20 z-20" />
                <span className="relative z-30 text-white font-[950] tracking-[0.5em] uppercase text-sm">
                  {isLoading ? "가입중..." : "Sign In"}
                </span>
              </button>
            </motion.div>
          </form>
          <motion.div variants={itemVars} className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 tracking-[0.5em] uppercase hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Return
            </button>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}