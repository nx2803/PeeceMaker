
const fs = require('fs');
const path = require('path');

// Target file path
const filePath = path.join(__dirname, 'src', 'assets', 'review.json');

try {
    // 1. Read the file
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found at ${filePath}`);
        process.exit(1);
    }
    const rawData = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawData);

    // 2. Flatten the array (handle the nested array structure)
    let flatList = [];
    
    // Recursive flatten function
    const flatten = (items) => {
        if (Array.isArray(items)) {
            items.forEach(item => {
                if (Array.isArray(item)) {
                    flatten(item);
                } else {
                    flatList.push(item);
                }
            });
        } else {
            // If the root wasn't an array (unlikely given the file), push it
            flatList.push(items);
        }
    };

    flatten(json);

    // 3. Add data_cd with random value PT0001 - PT0422
    const updatedList = flatList.map(item => {
        const randomNum = Math.floor(Math.random() * 422) + 1; // 1 to 422
        // Pad with leading zeros (e.g., 1 -> "PT0001", 42 -> "PT0042")
        const dataCd = `PT${String(randomNum).padStart(4, '0')}`;
        
        return {
            ...item,
            data_cd: dataCd
        };
    });

    // 4. Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedList, null, 2), 'utf8');
    
    console.log(`Successfully processed ${updatedList.length} items.`);
    console.log(`File saved to: ${filePath}`);

} catch (error) {
    console.error('An error occurred:', error);
}
