
import json
import random
import os

# Paths
board_path = 'public/data/board.json'
toilets_path = 'public/data/toilets.json'

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    board_data = load_json(board_path)
    toilets_data = load_json(toilets_path)
    
    # Map data_cd to toilet_nm
    toilet_map = {t['data_cd']: t['toilet_nm'] for t in toilets_data.get('toilet_info', [])}
    
    # Extensions for longer content
    extensions = [
        " 진짜 처음 와봤는데 이런 곳이 있는 줄 몰랐어. 다들 참고했으면 좋겠네.",
        " 주변에 있다가 급하면 여기로 오는 게 나을 것 같아. 다른 곳은 상태가 영 아니더라고.",
        " 관리가 잘 되어 있어서 기분 좋게 이용했어. 앞으로도 계속 이렇게 유지됐으면 좋겠다.",
        " 솔직히 말해서 기대 안 했는데 생각보다 괜찮았어. 나중에 또 올 일이 있을지는 모르겠지만.",
        " 친구가 알려줘서 왔는데 역시 믿을만하네. 너희들도 근처 지나갈 때 기억해둬.",
        " 근데 여기 주차하기가 조금 애매할 수도 있어. 차 가지고 오는 사람들은 미리 확인해보고 와.",
        " 밤에 오면 좀 무서울 수도 있겠다 싶더라. 가로등이 좀 더 밝았으면 좋겠는데.",
        " 휴지는 넉넉하게 있는지 꼭 확인하고 들어가. 저번에 없어서 낭패 볼 뻔했거든.",
        " 화장실 입구 찾기가 좀 헷갈릴 수도 있어. 표지판 잘 보고 찾아가야 해.",
        " 청결 상태는 그날그날 다를 수 있으니까 내 말만 너무 믿지는 마. 참고만 하라고."
    ]
    
    prefixes = [
        "여기 {name}인데, ",
        "지금 {name} 와봤는데, ",
        "방금 {name} 이용하고 나옴. ",
        "{name} 화장실 실시간이다. ",
        "다들 {name} 알지? ",
        "{name} 쪽 지나가다 들렀는데, "
    ]

    for item in board_data:
        data_cd = item.get('data_cd')
        original_content = item.get('content', "")
        
        if data_cd and data_cd in toilet_map:
            toilet_name = toilet_map[data_cd]
            
            # Choose a prefix
            prefix = random.choice(prefixes).format(name=toilet_name)
            
            # Possibly extend content (30% chance)
            extension = ""
            if random.random() < 0.3:
                extension = random.choice(extensions)
            
            new_content = f"{prefix}{original_content}{extension}"
            item['content'] = new_content
        
        # Update member_id
        if 'member_id' in item:
            item['member_id'] = item['member_id'].replace('LOCAL_member', 'LOCAL_user') + '@example.com'

        # Remove data_cd
        if 'data_cd' in item:
            del item['data_cd']

    save_json(board_path, board_data)
    print("Successfully modified board.json")

if __name__ == "__main__":
    main()
