const fs = require('fs');
const file = 'src/components/simulations/VideoTuongTac.tsx';
let data = fs.readFileSync(file, 'utf8');

const lines = data.split('\n');
lines.forEach((line, i) => {
    if (line.includes('`')) {
        console.log(`Line ${i + 1}: ${line}`);
    }
});
