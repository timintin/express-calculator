
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

function mean(numbers) {
    return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
}

function median(numbers) {
    numbers.sort((a, b) => a - b);
    const mid = Math.floor(numbers.length / 2);
    return numbers.length % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;
}

function mode(numbers) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];

    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            modes = [num];
        } else if (frequency[num] === maxFreq) {
            modes.push(num);
        }
    });

    return modes;
}

function parseNumbers(req, res, next) {
    const nums = req.query.nums;
    if (!nums) {
        return res.status(400).json({ error: 'nums are required' });
    }

    const numArray = nums.split(',').map(num => {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) {
            throw new Error(`${num} is not a number`);
        }
        return parsed;
    });

    req.numArray = numArray;
    next();
}

function writeToFile(data) {
    const filePath = path.join(__dirname, 'results.json');
    data.timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get('/mean', parseNumbers, (req, res) => {
    const meanValue = mean(req.numArray);
    res.json({ operation: 'mean', value: meanValue });
});

app.get('/median', parseNumbers, (req, res) => {
    const medianValue = median(req.numArray);
    res.json({ operation: 'median', value: medianValue });
});

app.get('/mode', parseNumbers, (req, res) => {
    const modeValue = mode(req.numArray);
    res.json({ operation: 'mode', value: modeValue });
});

app.get('/all', parseNumbers, (req, res) => {
    const meanValue = mean(req.numArray);
    const medianValue = median(req.numArray);
    const modeValue = mode(req.numArray);
    const result = { operation: 'all', mean: meanValue, median: medianValue, mode: modeValue };

    if (req.query.save === 'true') {
        writeToFile(result);
    }

    res.json(result);
});

app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
