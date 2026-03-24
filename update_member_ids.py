import json

file_path = 'public/data/board.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    if 'member_id' in item and item['member_id'].startswith('LOCAL_member'):
        item['member_id'] = item['member_id'].replace('LOCAL_member', 'LOCAL_user') + '@example.com'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Updated member_id in board.json")