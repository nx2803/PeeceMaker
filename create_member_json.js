
const fs = require('fs');
const path = require('path');

const reviewPath = path.join(__dirname, 'src', 'assets', 'review.json');
const memberPath = path.join(__dirname, 'src', 'assets', 'member.json');

try {
    if (!fs.existsSync(reviewPath)) {
        console.error(`Error: File not found at ${reviewPath}`);
        process.exit(1);
    }

    const reviewData = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
    
    // Ensure we have a flat list of reviews
    let reviews = [];
    const flatten = (items) => {
        if (Array.isArray(items)) {
            items.forEach(item => {
                if (Array.isArray(item)) {
                    flatten(item);
                } else {
                    reviews.push(item);
                }
            });
        } else {
            reviews.push(items);
        }
    };
    flatten(reviewData);

    // Track used nicknames to ensure uniqueness
    const usedNicknames = new Set();

    const members = reviews.map((review, index) => {
        const idNum = index + 1;
        const memberId = `LOCAL_member${idNum}`;
        
        // Handle nickname uniqueness
        let nickname = review.user;
        let originalNickname = nickname;
        let counter = 1;
        while (usedNicknames.has(nickname)) {
            nickname = `${originalNickname}_${counter}`;
            counter++;
        }
        usedNicknames.add(nickname);

        // Random create_date within the last year
        const now = new Date();
        const past = new Date(now.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
        
        return {
            member_id: memberId,
            create_date: past.toISOString(),
            tp_cnt: 0,
            password: null, // As per schema allowing null
            role: 'USER',
            nickname: nickname,
            provider: 'LOCAL',
            username: `user${idNum}@example.com`, // Unique email
            enabled: true
        };
    });

    fs.writeFileSync(memberPath, JSON.stringify(members, null, 2), 'utf8');
    
    console.log(`Successfully created member.json with ${members.length} records.`);
    console.log(`File saved to: ${memberPath}`);

} catch (error) {
    console.error('An error occurred:', error);
}
