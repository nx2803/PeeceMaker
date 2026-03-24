
import json
import random
import os

file_path = r'src/assets/review.json'

try:
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Flatten the list if it contains nested lists
    flat_data = []
    def flatten(lst):
        for item in lst:
            if isinstance(item, list):
                flatten(item)
            else:
                flat_data.append(item)

    flatten(data)

    # Add data_cd to each item
    for item in flat_data:
        # Generate number between 1 and 422
        num = random.randint(1, 422)
        # Format as PTxxxx
        data_cd = f'PT{num:04d}'
        item['data_cd'] = data_cd

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(flat_data, f, ensure_ascii=False, indent=2)

    print(f'Successfully updated {len(flat_data)} items.')

except Exception as e:
    print(f'Error: {e}')
    exit(1)
