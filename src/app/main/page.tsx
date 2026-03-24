'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaMapMarkedAlt, FaClipboardList, FaChartPie } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import MapView from './mapView';
import BoardView from './boardView';
import ChartView from './chartView';
import { createClient } from '@/utils/supabase/client';
import { IoMdSettings } from 'react-icons/io';
import { MdComputer, MdDarkMode, MdLightMode } from 'react-icons/md';

interface UserData {
	nickname?: string;
	role?: string;
	username?: string;
	memberId?: string;
}

const jejuPos = {
	lat: 33.497,
	lng: 126.537,
};

export default function MainPage() {
	const router = useRouter();

	const [activeTab, setActiveTab] = useState(0);
	const [isClient, setIsClient] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userData, setUserData] = useState<UserData>({});
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const supabase = createClient();
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [isRealLocation, setIsRealLocation] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('isRealLocation');
			return saved === 'true';
		}
		return false;
	});

	const [currentPos, setCurrentPos] = useState(jejuPos);
	useEffect(() => {
		setMounted(true);
		setIsClient(true);

		const saved = localStorage.getItem('activeTab');
		if (saved) {
			setActiveTab(parseInt(saved));
		}
		const savedLocation = localStorage.getItem('isRealLocation');
		if (savedLocation !== null) {
			setIsRealLocation(savedLocation === 'true');
		}
		const checkAuth = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser();

				if (user) {
					const mappedData: UserData = {
						nickname: user.user_metadata.nickname || user.email?.split('@')[0],
						username: user.email,
						memberId: user.id,
						role: user.user_metadata.role || 'ROLE_USER'
					};
					setUserData(mappedData);
					setIsLoggedIn(true);
					localStorage.setItem('user_nickname', mappedData.nickname || "");
					console.log('✅ 인증 성공:', mappedData);
				}
				else {
					setIsLoggedIn(false);
				}
			}
			catch (err) {
				console.error('🚨 인증 체크 실패:', err);
				setIsLoggedIn(false);
			}
		};
		checkAuth();
	}, []);

	useEffect(() => {
		const justLoggedIn = localStorage.getItem('just_logged_in');
		const params = new URLSearchParams(window.location.search);
		if (params.get('loginSuccess') === 'true') {
			window.history.replaceState({}, '', window.location.pathname);
		}
		if (justLoggedIn === 'true') {
			localStorage.removeItem('just_logged_in');
			window.location.reload();
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	useEffect(() => {
		if (isClient) {
			localStorage.setItem('activeTab', activeTab.toString());
			localStorage.setItem('isRealLocation', isRealLocation.toString());
		}
	}, [activeTab, isClient, isRealLocation]);

	useEffect(() => {
		if (isRealLocation) {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						const newPos = {
							lat: pos.coords.latitude,
							lng: pos.coords.longitude,
						};
						setCurrentPos(newPos);
					},
					(error) => {
						console.error('GPS error', error);
						setIsRealLocation(false);
					},
					{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
				);
			}
		}
		else {
			setCurrentPos({ ...jejuPos });
		}
	}, [isRealLocation]);

	if (!mounted) {

		return null;
	}
	const menuItems = [
		{ icon: <FaMapMarkedAlt />, id: 0 },
		{ icon: <FaChartPie />, id: 1 },
		{ icon: <FaClipboardList />, id: 2 },
	];

	const themeItems = [
		{ icon: <MdComputer />, value: 'system' },
		{ icon: <MdLightMode />, value: 'light' },
		{ icon: <MdDarkMode />, value: 'dark' },
	];

	const renderContent = () => {
		if (!isClient) return <MapView key={`map-${isRealLocation}`} Pos={currentPos} isRealLocation={isRealLocation} userData={userData} />;
		switch (activeTab) {
			case 0:
				return <MapView key={`map-${isRealLocation}`} Pos={currentPos} isRealLocation={isRealLocation} userData={userData} />;
			case 1:
				return <ChartView />;
			case 2:
				return <BoardView userData={userData} />;
			default:
				return <MapView key={`map-${isRealLocation}`} Pos={currentPos} isRealLocation={isRealLocation} userData={userData} />;
		}
	};

	const handleAuth = async () => {
		if (isLoggedIn) {
			if (!confirm('로그아웃 하시겠습니까?')) return;

			try {
				const { error } = await supabase.auth.signOut();

				if (!error) {
					localStorage.clear();
					setIsLoggedIn(false);
					setUserData({});
					setIsMenuOpen(false);
					localStorage.removeItem('user_nickname');
					console.log('로그아웃 성공');
					localStorage.removeItem('activeTab');

					window.location.href = '/main';
				}
				else {
					alert(`로그아웃 실패: ${error.message}`);
				}
			}
			catch (err) {
				console.error('🚨 로그아웃 통신 실패:', err);
				alert('로그아웃 중 오류가 발생했습니다.');
				localStorage.clear();
			}
		}
	};

	return (
		<main className='relative w-screen h-screen overflow-hidden inset-0 z-0 bg-linear-to-tr from-[#e0f5ff] via-[#ffe9c5] to-[#e0f5ff] text-black font-sans selection:bg-orange-100 dark:text-white'>
			{mounted && resolvedTheme === 'dark' && <div className='absolute inset-0 z-10 pointer-events-none bg-zinc-950/80 mix-blend-multiply' />}
			<motion.nav initial={{ y: -120, opacity: 1 }} animate={{ y: 0, opacity: 1 }} className='absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-30 flex justify-between items-center pointer-events-none'>
				<div className='flex gap-2 md:gap-4 pointer-events-auto'>
					<div onClick={() => router.push('/')} className='group relative flex items-center gap-2 px-5 py-3 md:px-8 md:py-5 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-full md:rounded-[40px] shadow-2xl cursor-pointer transition-all duration-300  active:scale-95 dark:bg-zinc-600/40 dark:border-zinc-400/10 hover:bg-write/50 dark:hover:bg-zinc-500/40'>
						<h1 className='text-lg md:text-3xl font-[1000] tracking-widest uppercase leading-none'>
							<span className='text-orange-400'>PEECE</span>
							<span className='ml-1 text-slate-700 dark:text-white'>MAKER</span>
						</h1>
					</div>
				</div>

				<div ref={menuRef} className='relative pointer-events-auto flex flex-col items-end'>
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} className='group relative px-6 py-3 md:px-10 md:py-5 bg-orange-400/85 backdrop-blur-md text-white font-[950] md:text-base tracking-widest uppercase rounded-full md:rounded-[40px] border border-white/20 shadow-lg hover:bg-orange-400/85 active:scale-95 transition-all cursor-pointer overflow-hidden flex flex-row justify-center items-center'>
						{isLoggedIn && <p className='mr-3 text-2xl'>{userData?.nickname}</p>}
						<IoMdSettings className='text-3xl' />
					</button>

					<AnimatePresence>
						{isMenuOpen && (
							<motion.div initial={{ opacity: 0, y: -15, scale: 1 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 1 }} transition={{ duration: 0.2, ease: 'easeOut' }} className='absolute top-[calc(100%+12px)] right-0 w-64 md:w-72 bg-white/20 backdrop-blur-2xl border border-white/50 rounded-3xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-6 space-y-5 dark:bg-zinc-600/40 dark:border-zinc-400/10'>
								<div className='space-y-3'>
									<p className='text-[10px] font-black text-slate-400 dark:text-white/80 uppercase tracking-widest px-1'>Appearance</p>
									<div className='flex items-center p-1  backdrop-blur-md border border-black/5 rounded-2xl relative'>
										{themeItems.map((item) => (
											<button key={item.value} onClick={() => setTheme(item.value)} className='relative flex-1 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer z-20'>
												<span className={`text-xl transition-all duration-300 z-40 ${mounted && theme === item.value ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}>{item.icon}</span>

												{mounted && theme === item.value && <motion.div layoutId='theme-pill' className='absolute inset-0 bg-orange-400 rounded-xl z-10 shadow-lg' transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
											</button>
										))}
									</div>
								</div>

								<div className='h-px bg-slate-400/50 dark:bg-white/30' />

								{/* 섹션 2 GPS 토글 */}

								{activeTab === 0 && (
									<div className='overflow-hidden'>
										<div className='space-y-3'>
											<p className='text-[10px] font-black text-slate-400 dark:text-white/80 uppercase tracking-widest px-1'>GPS Settings</p>
											<div className='flex items-center justify-between px-4 py-4 transition-all'>
												<div className='flex flex-col'>
													<span className='text-sm font-bold text-slate-700 dark:text-white/90'>{isRealLocation ? '현 위치' : '제주도'}</span>
												</div>
												<div onClick={() => setIsRealLocation(!isRealLocation)} className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-500 flex items-center px-1.5 ${isRealLocation ? 'bg-orange-400 ' : 'bg-slate-400 dark:bg-zinc-700'}`}>
													<motion.div animate={{ x: isRealLocation ? 24 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className='w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center' />
												</div>
											</div>
										</div>
										<div className='h-px bg-slate-400/50 dark:bg-white/30' />
									</div>
								)}

								{/* 섹션 3: 회원 메뉴  */}
								<div className='space-y-1'>
									<p className='text-[10px] font-black text-slate-400 dark:text-white/80 uppercase tracking-widest px-1'>Account</p>
									{isLoggedIn ? (
										<div className='flex flex-col gap-1'>
											<button
												onClick={() => {
													setIsMenuOpen(false);
													router.push('/changeinfo');
												}}
												className='w-full text-left px-3 py-3 text-sm font-bold text-slate-700 dark:text-white/90 hover:text-orange-400 rounded-xl transition-all'
											>
												회원 정보 변경
											</button>
											<button onClick={handleAuth} className='w-full text-left px-3 py-3 text-sm font-bold text-slate-700 dark:text-white/90 hover:text-orange-400 rounded-xl transition-all'>
												로그아웃
											</button>
										</div>
									) : (
										<button
											onClick={() => {
												setIsMenuOpen(false);
												router.push('/login');
											}}
											className='w-full mt-2 py-3 bg-orange-400 text-white rounded-2xl text-xl font-black tracking-widest uppercase hover:bg-orange-400 transition-all shadow-lg active:scale-95'
										>
											Log In
										</button>
									)}
								</div>

							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.nav>

			<div className='w-full h-full relative z-10 overflow-hidden'>
				<AnimatePresence mode='wait'>
					<motion.div key={activeTab} initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.25 }} className='w-full h-full'>
						{renderContent()}
					</motion.div>
				</AnimatePresence>
			</div>

			<motion.div initial={{ y: 120, opacity: 1 }} animate={{ y: 0, opacity: 1 }} className='absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none'>
				<div className='flex items-center p-1.5 bg-white/20 backdrop-blur-2xl border border-white/60 rounded-[30px] md:rounded-[40px] shadow-2xl pointer-events-auto relative dark:bg-zinc-600/40 dark:border-zinc-400/10'>
					{menuItems.map((item) => (
						<button key={item.id} onClick={() => setActiveTab(item.id)} className={`relative px-7 py-4 md:px-10 md:py-5 rounded-[25px] md:rounded-[35px] transition-colors duration-300 flex items-center justify-center cursor-pointer ${activeTab === item.id ? 'text-white' : 'text-slate-700 hover:text-black'}`}>
							<span className={`text-2xl md:text-3xl relative z-30 transition-all duration-300 active:scale-75 ${activeTab === item.id ? 'text-white' : 'text-zinc-500'}`}>{item.icon}</span>
							{activeTab === item.id && <motion.div layoutId='active-pill' className='absolute inset-0 bg-orange-400/90 rounded-[25px] md:rounded-[35px] z-10' transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
						</button>
					))}
				</div>
			</motion.div>
		</main>
	);
}
