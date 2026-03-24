const fs = require('fs');
const path = require('path');

// Use relative path from project root
const filePath = path.join('src', 'assets', 'review.json');

try {
  console.log(`Checking file at: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let data = JSON.parse(fileContent);

  // Flatten the list if it contains nested lists
  let flatData = [];
  function flatten(lst) {
    for (const item of lst) {
      if (Array.isArray(item)) {
        flatten(item);
      } else {
        flatData.push(item);
      }
    }
  }

  if (Array.isArray(data)) {
    flatten(data);
  } else {
    flatData = [data]; 
  }

  console.log(`Found ${flatData.length} items.`);

  // Add data_cd to each item
  for (const item of flatData) {
    // Generate number between 1 and 422
    const num = Math.floor(Math.random() * 422) + 1;
    // Format as PTxxxx
    const data_cd = `PT${String(num).padStart(4, '0')}`;
    item['data_cd'] = data_cd;
  }

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(flatData, null, 2), 'utf-8');

  console.log(`Successfully updated ${flatData.length} items.`);

} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}