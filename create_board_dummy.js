const fs = require('fs');
const path = require('path');

// Configuration
const MEMBER_FILE_PATH = path.join(__dirname, 'src/assets/member.json');
// Output to both locations to be helpful
const OUTPUT_FILE_PATH_ASSETS = path.join(__dirname, 'src/assets/board_dummy.json');
const OUTPUT_FILE_PATH_PUBLIC = path.join(__dirname, 'public/data/board.json');
const TOTAL_ITEMS = 100; 

// Helper to shuffle array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper to get random integer
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const padNumber = (num, size) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

// 100 Custom Title & Content Pairs
const posts = [
    // Existing 50
    { t: "안돌오름 화장실 폼 미쳤다 ㅋㅋㅋ", c: "들어갔는데 클래식 나오고 향기남;; 우리집보다 좋음 ㄹㅇ" },
    { t: "급똥쟁이들아 노형 오거리 근처면 여기 꼭 기억해라", c: "개방화장실인데 관리 개잘되어있음. 비데도 있다." },
    { t: "용눈이오름 화장실 ㅁㅊ 휴지 없는거 실화냐?", c: "다행히 가방에 물티슈 있어서 살았다... 니들은 꼭 챙겨가라" },
    { t: "도두봉 근처 화장실 절대 가지마라;;", c: "냄새 진짜 선넘음 헛구역질 나옴 비위 약하면 딴데 가셈" },
    { t: "제주도 화장실 인심 좋네", c: "무료 개방인데 온수도 콸콸 나옴 굿굿" },
    { t: "밤에 용두암 화장실 가지마셈 개무서움", c: "가로등 깜빡거리는데 귀신 나올거같음 지릴뻔" },
    { t: "애월 해안도로 화장실 뷰가 무슨 오션뷰 카페임?", c: "볼일 보는데 파도 소리 들림 ㅋㅋㅋ 힐링 스팟 인정" },
    { t: "형들 함덕 서우봉 해변 화장실 앞 주차 되냐?", c: "급해서 차 아무데나 대고 뛰었는데 딱지 떼일까봐 불안하다" },
    { t: "비데 있는 화장실 지도 공유한다", c: "엉따 없으면 볼일 못 보는 사람들 참고해라" },
    { t: "별도봉 공원 화장실 문 잠겨있는데 이거 맞음?", c: "24시간 개방이라며... 사기 당했다 내 방광 책임져" },
    { t: "한림 공원 화장실 청소하시는 분 상 줘야됨", c: "반짝반짝 광이 남. 쾌적 그 자체" },
    { t: "서귀포 쪽에 장애인 화장실 잘 되어있는 곳 추천좀", c: "휠체어 들어가기 편한 곳 찾고 있는데 정보가 없네 ㅠ" },
    { t: "렛츠런파크 화장실 기저귀 교환대 있는 곳 찾았다 휴", c: "애기 데리고 여행하기 힘들다... 여기 시설 좋음" },
    { t: "탑동 광장 화장실 흡연충들아 담배 좀 피지마라", c: "들어갔다가 담배 냄새 때문에 질식할 뻔 매너 좀 지키자" },
    { t: "이호테우 등대 화장실 세면대 물 안나옴 ㅡㅡ", c: "손 씻으려는데 물 한 방울도 안 나옴 고장난듯" },
    { t: "노형 슈퍼마켓 화장실 거울 셀카 맛집임 ㅋㅋㅋ", c: "조명 좋아서 사진 잘 나옴 ㅋㅋㅋ 볼일 말고 사진 찍으러 옴" },
    { t: "탑동 공원 남자 화장실 소변기 상태 왜이럼?", c: "물 안 내려가서 찌린내 진동함... 관리 좀 해라" },
    { t: "동문시장 여자 화장실 줄 개김 주의", c: "주말이라 그런가 20분 기다림... 급하면 딴 데 가라" },
    { t: "공항 근처 깨끗한 화장실 추천함", c: "렌트카 반납하기 전에 들리기 딱 좋음" },
    { t: "올레길 걷다가 지옥을 맛봄", c: "주변에 화장실 1도 없음... 미리미리 다녀와라" },
    { t: "천지연 폭포 화장실 휴지 자판기 고장남 ㅋㅋㅋ", c: "동전 먹튀 당함... 천원 기부했다 셈 친다" },
    { t: "비번 걸려있는 화장실 뚫는 법 공유함", c: "은 뻥이고 그냥 상가 이용하고 당당하게 써라" },
    { t: "한라산 어리목 화장실 찬물만 나와서 손 얼어 터지는 줄", c: "겨울엔 온수 좀 틀어주라 인간적으로" },
    { t: "외돌개 화장실 문 틈 너무 넓은데?", c: "밖에서 보일까봐 불안해서 폰으로 가리고 쌈" },
    { t: "몰카 걱정 없는 안심 화장실 어디임?", c: "요즘 세상이 흉흉해서 공중화장실 가기 무섭다 ㅠ" },
    { t: "우도 하고수동 해수욕장 변기 수압 약하니까 조심해라", c: "휴지 많이 넣으면 100퍼 막힘... 내가 막아봐서 암" },
    { t: "제주 월드컵 경기장 화장실 핸드드라이어 바람 세기 태풍급 ㅋㅋㅋ", c: "손 넣었다가 살 가죽 벗겨지는 줄" },
    { t: "급똥 신호 왔을 때 대처법 알려줌", c: "다리 꼬고 상체 숙이고... 는 개뿔 그냥 뛰어라" },
    { t: "제주시청 근처 화장실 지도 만든다", c: "술 먹다 화장실 찾아 삼만리 하기 싫어서 내가 만듬" },
    { t: "제주공항 1층 화장실 에어컨 24시간 풀가동임?", c: "여름에 더위 피하러 여기로 피신옴 ㅋㅋㅋ 개꿀" },
    { t: "화장실 휴지통 없는 거 적응 안됨", c: "휴지 변기에 버리라는데 자꾸 잊어버림 나만 그럼?" },
    { t: "남녀공용이라 좀 민망함;;", c: "문 하나 두고 마주치면 세상 어색함... 분리 좀 해줘라" },
    { t: "화장실 낙서 보는 재미 쏠쏠하네", c: "철수♡영희 언제적 감성이냐 ㅋㅋㅋ 추억 돋네" },
    { t: "사라봉 공원 화장실 가려면 등산해야됨", c: "계단 개많음 급똥일 땐 절대 못 감 무릎 나갈듯" },
    { t: "제주도민 픽 화장실 리스트 푼다", c: "관광객들은 모르는 숨은 꿀스팟임 지워지기 전에 봐라" },
    { t: "와 폰 두고 나왔는데 아직 있네", c: "한국 치안 클라스 ㅋㅋㅋ 30분 뒤에 갔는데 그대로 있음" },
    { t: "화장실 물내림 버튼 어디있는지 한참 찾음", c: "요즘엔 발로 밟는 게 대세냐? 촌놈이라 몰랐다" },
    { t: "제주대학교 구관 화장실 귀신 괴담 아는 사람?", c: "밤 12시에 3번째 칸 들어가면 소리 들린다는데 ㄹㅇ?" },
    { t: "화장실 타일 색깔 눈 아픔 ㅋㅋㅋ", c: "형광 핑크색 도배해놈 정신병 걸릴 거 같음" },
    { t: "가방 걸이 없어서 입에 물고 쌈", c: "바닥에 두긴 싫고... 옷걸이 하나만 달아주라 좀" },
    { t: "서귀포 매일올레시장 화장실 라디오에서 트로트 나옴 ㅋㅋㅋ", c: "볼일 보는데 내 나이가 어때서 나옴 흥얼거리면서 쌈" },
    { t: "화장실 문 잠금장치 고장남 조심", c: "볼일 보는데 누가 문 열어서 아이컨택함 죽고싶다" },
    { t: "세면대에 발 씻는 아저씨 봄 ㅡㅡ", c: "제발 매너 좀... 세수하기도 찝찝하네" },
    { t: "제주 도립 미술관 화장실 휴지 2겹이라 좋음", c: "1겹짜리는 닦아도 닦은 거 같지 않은데 여긴 혜자네" },
    { t: "급해서 남자화장실 들어간 썰 푼다", c: "아무도 없어서 다행이지 마주쳤으면 경찰서 갈 뻔" },
    { t: "화장실 평가하고 다니는 사람인데 질문 받는다", c: "제주도 내 화장실 데이터 다 있음 궁금한 거 물어봐" },
    
    // New 50
    { t: "제주 드림타워 화장실 와 스타벅스 화장실인줄", c: "인테리어 개이쁨 조명 맛집임 여기서 살고싶다" },
    { t: "공중화장실에서 칫솔질 좀 하지마라", c: "거울에 다 튀고 난리남 집 가서 닦아라 좀" },
    { t: "비데 물살 너무 쎄서 관장 당함", c: "약으로 해도 뚫고 들어올 기세임 조절 잘해라" },
    { t: "제주 현대 미술관 화장실 문이 투명 유리임?", c: "은 아니고 매직미러인가? 밖에서 안 보이겠지? 개불안" },
    { t: "휴지 훔쳐가는 도둑놈들 뭐냐", c: "공용 물품인데 집에 가져가서 뭐하게 그지냐?" },
    { t: "화장실에서 이상한 소리 들림", c: "꾸르륵 쾅쾅 전쟁난 줄... 누구냐 장건강 챙겨라" },
    { t: "제주 오일장 화장실 사람 개많음", c: "장날이라 그런가 줄 서서 기다림... 미리 싸고 와라" },
    { t: "해수욕장 화장실 모래 테러 ㄷㄷ", c: "바닥이 그냥 모래사장임 맨발로 들어가지 마셈" },
    { t: "함덕 해수욕장 화장실 노래 선곡 누가함?", c: "이별 노래 연속으로 나옴 볼일 보다 울 뻔" },
    { t: "화장실 문고리 잡기 싫어서 발로 엶", c: "코로나 이후로 결벽증 생김 나 같은 사람 있냐?" },
    { t: "와이파이 터지는 화장실 개꿀", c: "유튜브 보면서 느긋하게 쌈 데이터 아낌" },
    { t: "중문 면세점 화장실 방향제 냄새 머리아픔", c: "라벤더 향이라는데 독가스 수준임 코 막고 쌈" },
    { t: "세면대 수도꼭지 센서 고장남", c: "손 갖다 대도 반응 없음 춤춰야 나옴" },
    { t: "화장실 거울에 '살려주세요' 써있음", c: "장난이겠지? 소름 돋아서 바로 나옴" },
    { t: "제주 시외버스터미널 휠체어 리프트 작동 되나요?", c: "장애인용 화장실 가려는데 계단만 보임 ㅠ" },
    { t: "아기 의자 있는 칸 어디임?", c: "애 데리고 볼일 보기 너무 힘들다 육아맘들 화이팅" },
    { t: "화장실 벽 뚫려있는 구멍 뭐냐", c: "휴지로 막아놓긴 했는데 찝찝함 몰카 아니겠지?" },
    { t: "제주 시민회관 화장실 밤 10시에 잠김", c: "급해서 갔다가 문 닫혀서 낭패 봄 시간 확인 잘해라" },
    { t: "편의점 화장실 열쇠 받아가야됨", c: "알바생 눈치 보임... 물건 하나 사면서 물어봐라" },
    { t: "주유소 화장실 기름 냄새 쩐다", c: "오래 있으면 취할 거 같음 환기 좀 시켜주세요" },
    { t: "도서관 화장실 공부하는 사람 있음?", c: "안에서 책 읽는 소리 남 독서실인줄" },
    { t: "한라 수목원 화장실 물 내리는 소리 개큼", c: "폭포수 떨어지는 줄 깜짝 놀람 심약자 주의" },
    { t: "손 건조기 밑에 물 흥건함", c: "미끄러져서 머리 깨질 뻔 조심해라" },
    { t: "화장실 입구에 CCTV 있어도 되냐?", c: "범죄 예방이라는데 좀 찝찝하긴 함" },
    { t: "제주 넥슨 컴퓨터 박물관 화장실 휴지통 뚜껑 자동임", c: "손 갖다 대면 열림 신문물 영접함 ㅋㅋㅋ" },
    { t: "변기 커버 차가워서 소리지름", c: "엉덩이 동상 걸리는 줄 겨울엔 커버 씌워주라" },
    { t: "화장실 세면대 거울 너무 높음", c: "키 작은 사람은 정수리만 보임 180 이상만 오라는 거냐" },
    { t: "삼양 해수욕장 화장실 비누 없음 챙겨가라", c: "물로만 씻으니까 찝찝함 종이비누 필수템" },
    { t: "화장실 칸막이 너무 낮아서 눈 마주침", c: "옆 칸 사람이랑 인사할 뻔 민망하다 진짜" },
    { t: "공원 화장실 벌레 퇴치기 있음?", c: "모기한테 헌혈하고 옴 간지러워 죽겠다" },
    { t: "제주 민속 오일장 화장실 에어컨 고장남 찜통임", c: "땀 흘리면서 쌈 사우나 온 줄 살 빠지는 기분" },
    { t: "화장실 문 안 열려서 갇힐 뻔함", c: "식은땀 줄줄... 발로 차서 겨우 나옴 폰 꼭 챙겨가라" },
    { t: "청소 시간 피해서 가라 쫓겨남", c: "아주머니 포스 장난 아님 급해도 얄짤 없음" },
    { t: "곽지 해수욕장 화장실 옷 갈아입기 좋음?", c: "탈의실 못 찾아서 여기서 갈아입으려는데 바닥 깨끗하냐" },
    { t: "화장실 거울 조명 셀카 잘 나옴?", c: "오늘 화장 잘 먹어서 사진 남겨야됨 추천 좀" },
    { t: "남자 화장실 소변기 칸막이 좀 해줘라", c: "옆 사람 시선 느껴져서 안 나옴 프라이버시 존중 좀" },
    { t: "제주항 여객터미널 화장실 변기 막힘 자주 일어남?", c: "물 내리기 무섭다 역류할까봐 조마조마함" },
    { t: "화장실 냄새 제거 꿀팁 공유함", c: "성냥 하나 켜면 직빵임 근데 화재 경보기 울릴 수도 ㅋㅋㅋ" },
    { t: "오설록 티뮤지엄 화장실 가글 기계 있음 대박", c: "입 텁텁했는데 개운함 데이트 전에 들러라" },
    { t: "화장실에 우산 두고 옴 ㅠㅠ", c: "다시 갔는데 없음... 내 우산 가져간 놈 잘 먹고 잘 살아라" },
    { t: "신화월드 화장실 비데 리모컨 고장남", c: "물줄기 안 멈춰서 당황함 엉덩이 물고문 당함" },
    { t: "화장실 문에 명언 적혀있음 ㅋㅋㅋ", c: "'신은 용기 있는 자를 버리지 않는다' 힘주고 쌈" },
    { t: "절물 자연 휴양림 화장실 세면대 온수 조절 안됨", c: "용암 나오거나 얼음물 나옴 중간이 없음" },
    { t: "화장실 휴지 삼각형으로 접어놓음", c: "호텔인 줄 청소하시는 분 센스 굿" },
    { t: "천제연 폭포 화장실 바닥 미끄럼 방지 됨?", c: "슬리퍼 신고 갔다가 트리플 악셀 뜀 조심해라" },
    { t: "화장실 환풍기 소리 탱크 지나감", c: "너무 시끄러워서 귀 먹먹함 볼일 집중 안됨" },
    { t: "제주 도서관 화장실 칫솔 살균기 있음?", c: "점심 먹고 양치해야 되는데 위생 상태 궁금함" },
    { t: "화장실 칸 안에 가방 걸이 부러짐", c: "가방 안고 쌈... 팔 저려 죽는 줄 고쳐주세요" },
    { t: "송악산 전망대 화장실 뷰 맛집 2탄 올림", c: "이번엔 산 뷰임 피톤치드 마시면서 쾌변 가능" },
    { t: "화장실 후기 남기는 앱 여기밖에 없냐?", c: "다른 데는 정보가 없네 여기가 짱인듯" }
];

const generateDataCd = () => `PT${padNumber(getRandomInt(1, 422), 4)}`;

const generateDate = () => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - 90);
    const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime).toISOString();
};


// Main function
const main = () => {
    try {
        // Read member file
        const memberData = fs.readFileSync(MEMBER_FILE_PATH, 'utf8');
        let members = JSON.parse(memberData);
        
        if (!members || members.length === 0) {
            console.error("Error: No members found in member.json");
            return;
        }

        // Shuffle members to ensure random assignment
        members = shuffleArray(members);

        let dummyData = [];

        // 1. Generate Items with random dates
        for (let i = 0; i < TOTAL_ITEMS; i++) {
            const post = posts[i % posts.length]; 
            const member = members[i % members.length];
            
            const item = {
                // Temporary place holder, will be overwritten
                board_id: 0, 
                create_date: generateDate(),
                title: post.t,
                content: post.c,
                data_cd: generateDataCd(),
                member_id: member.member_id
            };
            
            dummyData.push(item);
        }

        // 2. Sort by create_date ASCENDING (Oldest first)
        dummyData.sort((a, b) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime());

        // 3. Assign board_id sequentially (1 for oldest, 100 for newest)
        dummyData = dummyData.map((item, index) => ({
            ...item,
            board_id: index + 1
        }));

        // 4. (Optional) Sort by board_id DESCENDING (Newest first) for final output, 
        //    as that is how boards are usually displayed.
        //    But based on the user request, "board_id higher = recent date". 
        //    So ID 100 is newest. If we save it ID 1...100 it's fine.
        //    Let's save it sorted by ID DESC (Newest first) so it looks good in JSON preview.
        dummyData.sort((a, b) => b.board_id - a.board_id);

        // Write to files
        fs.writeFileSync(OUTPUT_FILE_PATH_ASSETS, JSON.stringify(dummyData, null, 2), 'utf8');
        console.log(`Successfully generated ${TOTAL_ITEMS} items in ${OUTPUT_FILE_PATH_ASSETS}`);

        // Try writing to public/data if directory exists
        const publicDir = path.dirname(OUTPUT_FILE_PATH_PUBLIC);
        if (fs.existsSync(publicDir)) {
             fs.writeFileSync(OUTPUT_FILE_PATH_PUBLIC, JSON.stringify(dummyData, null, 2), 'utf8');
             console.log(`Successfully generated ${TOTAL_ITEMS} items in ${OUTPUT_FILE_PATH_PUBLIC}`);
        }

    } catch (err) {
        console.error("Error generating dummy data:", err);
    }
};

main();