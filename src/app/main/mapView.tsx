"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Map, CustomOverlayMap, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect, useMemo } from "react";
import { 
    X, 
    User, 
    Accessibility, 
    Baby, 
    ShieldCheck, 
    Layers, 
    Filter, 
    LocateFixed,
    MapPin
} from "lucide-react";
import dynamic from 'next/dynamic';
const ToiletPopup = dynamic(() => import('./ToiletPopup'), { ssr: false });
import { useTheme } from "next-themes";
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
    emgncBellInstlYn?: string;
    toiletEntrncCctvInstlYn?: string;

}

let cachedToilets: Toilet[] = [];

interface MapViewProps {
    isRealLocation: boolean;
    Pos: { lat: number; lng: number };
    userData?: any;
}

export default function MapView({ Pos, userData }: MapViewProps) {
    const [loading] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string,
        libraries: ["services", "clusterer"],
    });

    const [toilets, setToilets] = useState<Toilet[]>(cachedToilets);
    const [level, setLevel] = useState(3);
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const { resolvedTheme } = useTheme();
    const supabase = createClient();

    const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);

    //필터
    const [mainFilter, setMainFilter] = useState<'all' | 'secure' | 'accessible' | 'family'>('all');
    const [hasMale, setHasMale] = useState(false);
    const [hasFemale, setHasFemale] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const Spinner = () => (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-7 h-7 mx-auto border-4 border-white/10 border-t-orange-400 border-l-orange-400 rounded-full flex justify-center items-center"
        />
    );

    useEffect(() => {
        if (map && Pos) {
            const moveLatLng = new kakao.maps.LatLng(Pos.lat, Pos.lng);
            map.setCenter(moveLatLng);
        }
    }, [Pos, map]);


    useEffect(() => {
        if (cachedToilets.length > 0) return;

        const fetchToilets = async () => {
            try {
                const { data, error } = await supabase
                    .from('toilet_info')
                    .select('*');

                if (data) {
                    console.log("Toilets fetched:", data.length);
                    // snake_case -> camelCase 변환
                    const list = data.map((item: any) => {
                        const newItem: any = {};
                        for (const key in item) {
                            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                            newItem[camelKey] = item[key];
                        }
                        return newItem;
                    });
                    setToilets(list);
                    cachedToilets = list;
                } else if (error) {
                    console.error("Supabase 에러:", error);
                }
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            }
        };

        fetchToilets();
    }, [supabase]);


    // 필터
    const filteredToilets = useMemo(() => {
        return toilets.filter(t => {

            const matchesMain =
                mainFilter === 'all' ||
                (mainFilter === 'secure' && (t.emgncBellInstlYn === 'Y' || t.toiletEntrncCctvInstlYn === 'Y')) ||
                (mainFilter === 'accessible' && (Number(t.maleDspsnClosetCnt) > 0 || Number(t.femaleDspsnClosetCnt) > 0)) ||
                (mainFilter === 'family' && t.diaperExhgTablYn === 'Y');


            const matchesMale = !hasMale || (Number(t.maleClosetCnt) > 0 || Number(t.maleUrinalCnt) > 0);
            const matchesFemale = !hasFemale || (Number(t.femaleClosetCnt) > 0);

            const result = matchesMain && matchesMale && matchesFemale;
            return result;
        });
    }, [toilets, mainFilter, hasMale, hasFemale]);

    console.log("Rendering filtered toilets:", filteredToilets.length);




    if (loading) return (
        <div className="flex h-full items-center justify-center font-black text-orange-400 animate-pulse text-2xl tracking-widest bg-white/10 backdrop-blur-md">
            <Spinner />
        </div>
    );


    return (
        <div className="w-full h-full relative">

            <div className="absolute top-20 left-4 md:top-30 md:left-8  z-50 flex flex-col gap-3 items-start pointer-events-none">

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all hover:bg-white/80 group dark:bg-zinc-600/40 dark:border-zinc-400/10 dark:hover:bg-zinc-500/40"
                >
                    <div className={`rounded-lg transition-colors ${isFilterOpen ? ' text-orange-400' : ' text-slate-500 '}`}>
                        <Filter className="w-5 h-5" />
                    </div>
                    <span className=" font-[1000] text-slate-700 dark:text-white uppercase tracking-[0.15em]">
                        Filter
                    </span>
                </motion.button>

                {/* 필터 메뉴 */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="pointer-events-auto w-72 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] p-7 flex flex-col gap-8 dark:bg-zinc-600/40 dark:border-zinc-400/10"
                        >
                            {/* 시설 필터 섹션 */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Type</span>
                                    {mainFilter !== 'all' && (
                                        <button onClick={() => setMainFilter('all')} className="text-[10px] font-bold text-slate-400 hover:text-orange-400">Reset</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { id: 'all', label: '전체', icon: <MapPin className="w-5 h-5" /> },
                                        { id: 'secure', label: '안심시설', icon: <ShieldCheck className="w-5 h-5" /> },
                                        { id: 'accessible', label: '장애인용', icon: <Accessibility className="w-5 h-5" /> },
                                        { id: 'family', label: '유아동반', icon: <Baby className="w-5 h-5" /> },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setMainFilter(item.id as any)}
                                            className={`flex flex-col items-center justify-center py-4 rounded-3xl transition-all ${mainFilter === item.id
                                                ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/20'
                                                : 'bg-white/40 border-transparent text-slate-500 hover:bg-white/60 dark:bg-zinc-900/70 dark:text-slate-400 dark:hover:bg-zinc-600'
                                                }`}
                                        >
                                            <span className="text-xl mb-1.5">{item.icon}</span>
                                            <span className="text-[10px] font-black">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                                    
                            {/* 성별 유무*/}
                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gender Availability</span>
                                <div className="flex gap-2.5">
                                    {[
                                        { state: hasMale, setter: setHasMale, icon: <User className="w-4 h-4" />, label: '남성용', color: 'bg-cyan-500' },
                                        { state: hasFemale, setter: setHasFemale, icon: <User className="w-4 h-4" />, label: '여성용', color: 'bg-rose-500' }
                                    ].map((gen, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => gen.setter(!gen.state)}
                                            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-3xl border transition-all font-black text-[11px] ${gen.state
                                                ? `${gen.color} border-white/20 text-white shadow-lg`
                                                : 'bg-white/40 border-transparent text-slate-400 dark:bg-zinc-900/70'
                                                }`}
                                        >
                                            <span className="text-sm">{gen.icon}</span> {gen.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>





            <Map
                center={Pos}
                style={{ width: "100%", height: "100%", filter: resolvedTheme === 'dark' ? 'invert(100%) hue-rotate(180deg)' : 'none' }}
                level={3}
                onCreate={(map) => {
                    setMap(map);
                    map.setDraggable(true);
                    map.setZoomable(true);
                }}
                draggable={true}
                zoomable={true}

                onZoomChanged={(map) => setLevel(map.getLevel())}
                onClick={() => setSelectedToilet(null)}>

                {/* 자기 위치 */}
                <CustomOverlayMap position={Pos} zIndex={100}>
                    <div className="relative flex items-center justify-center ">
                        <div className="absolute w-10 h-10 bg-stone-700/30 rounded-full animate-ping" />
                        <div className="relative w-6 h-6 bg-stone-700/95 backdrop-blur-2xl rounded-full border border-white shadow-lg flex justify-center items-center">
                            <User className="w-4 h-4 text-stone-100" />
                        </div>
                    </div>
                </CustomOverlayMap>

                <MarkerClusterer
                    averageCenter={true}
                    minLevel={3}
                    styles={[
                        {
                            width: '40px',
                            height: '40px',
                            background: 'rgba(251, 146, 60, 0.7)',
                            borderRadius: '50%',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            lineHeight: '40px',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)'
                        },
                        {
                            width: '50px',
                            height: '50px',
                            background: 'rgba(251, 146, 60, 0.85)',
                            borderRadius: '50%',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            lineHeight: '50px',
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 6px 20px rgba(251, 146, 60, 0.4)'
                        },
                        {
                            width: '60px',
                            height: '60px',
                            background: 'rgba(249, 115, 22, 0.95)',
                            borderRadius: '50%',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            lineHeight: '60px',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.5)'
                        }
                    ]}
                >
                    {filteredToilets.map((toilet, index) => (
                        <CustomOverlayMap
                            key={`toilet-${toilet.dataCd}-${index}`}
                            position={{ lat: toilet.laCrdnt, lng: toilet.loCrdnt }}
                        >

                            <div className={`relative w-0 flex flex-col h-0 items-center justify-end ${resolvedTheme === 'dark' ? 'invert hue-rotate-180' : ''
                                }`}
                                onClick={(e) => {
                                    if (!map) return;
                                    const targetPos = new kakao.maps.LatLng(toilet.laCrdnt, toilet.loCrdnt);
                                    if (map.getLevel() > 2) {
                                        map.setLevel(2);
                                    }
                                    map.panTo(targetPos);
                                    setSelectedToilet(toilet);
                                }}
                            >
                                {(level <= 5) && (
                                    <div className="relative flex flex-col items-center px-2 py-1.5 rounded-3xl bg-white/90 backdrop-blur-4xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/70 group-hover:border-orange-400/50 group-hover:shadow-orange-200/50 group-hover:scale-115 transition-all duration-300 z-20 mb-1 dark:bg-zinc-700/90 dark:border-zinc-400/10 ">
                                        <span className="text-[14px] font-[1000] text-slate-900 dark:text-white tracking-tight  mb-2 max-w-37 truncate">
                                            {toilet.toiletNm}
                                        </span>
                                        <div className="flex gap-1.5 items-center pt-2 border-t border-white/80 dark:border-white/20 w-full justify-center">
                                            {(Number(toilet.maleClosetCnt) > 0) && (
                                                <div className="w-10 h-7 flex items-center justify-center bg-cyan-50 rounded-xl text-cyan-600 shadow-sm border border-cyan-100/50">
                                                    <User className="w-4 h-4" />
                                                </div>
                                            )}
                                            {(Number(toilet.femaleClosetCnt) > 0) && (
                                                <div className="w-10 h-7 flex items-center justify-center bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100/50">
                                                    <User className="w-4 h-4" />
                                                </div>
                                            )}
                                            {(Number(toilet.maleDspsnClosetCnt) > 0 || Number(toilet.femaleDspsnClosetCnt) > 0) && (
                                                <div className="w-10 h-7 flex items-center justify-center bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100/50">
                                                    <Accessibility className="w-4 h-4" />
                                                </div>
                                            )}
                                            {toilet.diaperExhgTablYn === "Y" && (
                                                <div className="w-10 h-7 flex items-center justify-center bg-amber-50 rounded-xl text-amber-600 shadow-sm border border-amber-100/50">
                                                    <Baby className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="relative h-6 w-6 flex items-center justify-center">
                                    <div className="w-3.5 h-3.5 bg-orange-400 rounded-full shadow-md z-10 border border-white/50 dark:border-zinc-800/50 flex justify-center items-center text-center" />
                                    <div className="absolute w-7 h-7 bg-orange-400/30 rounded-full animate-ping" />
                                </div>
                            </div>
                        </CustomOverlayMap>
                    ))}
                </MarkerClusterer>
            </Map>

            <AnimatePresence>
                {selectedToilet && (
                    <ToiletPopup
                        data={selectedToilet}
                        onClose={() => setSelectedToilet(null)}
                        myPos={Pos}
                        userData={userData}
                    />
                )}
            </AnimatePresence>

            <div className="absolute bottom-30 md:bottom-8 md:right-10 right-2 z-50">
                <button
                    onClick={() => {
                        if (!map) return;
                        const pos = new kakao.maps.LatLng(Pos.lat, Pos.lng);
                        if (map.getLevel() > 6) {
                            map.setLevel(3);
                        }
                        map.panTo(pos);
                    }}
                    className="group relative w-12 h-12 md:w-14 md:h-14 bg-white/40 backdrop-blur-2xl border border-white/60  rounded-full   shadow-[0_0_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all active:scale-90 hover:border-orange-400/50 cursor-pointer dark:bg-zinc-600/30 dark:border-zinc-400/10"
                >
                    <LocateFixed className="w-6 h-6 text-slate-700 dark:text-white group-hover:text-orange-400 transition-colors" />
                </button>
            </div>
        </div>
    );
}