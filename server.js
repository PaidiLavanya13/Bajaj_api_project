const express = require('express');
const app = express();
app.use(express.json());

// Helper function for alternating caps
function alternatingCaps(str) {
    let result = "";
    let toUpper = true;
    for (const c of str) {
        result += toUpper ? c.toUpperCase() : c.toLowerCase();
        toUpper = !toUpper;
    }
    return result;
}

app.post('/bfhl', (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body.data)) {
            return res.status(400).json({ is_success: false, message: "Missing valid 'data' array." });
        }

        const { full_name, dob, email, roll_number, data } = req.body;

        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];
        let sum = 0;
        let concatString = "";

        data.forEach(item => {
            if (/^\d+$/.test(item)) { // numeric
                let num = parseInt(item, 10);
                if (num % 2 === 0) {
                    even_numbers.push(item);
                } else {
                    odd_numbers.push(item);
                }
                sum += num;
            } else if (/^[a-zA-Z]+$/.test(item)) { // alphabets
                alphabets.push(item.toUpperCase());
                concatString += item;
            } else { // special chars
                special_characters.push(item);
            }
        });

        let reversed = concatString.split('').reverse().join('');
        let altCaps = alternatingCaps(reversed);

        res.status(200).json({
            is_success: true,
            user_id: `${full_name}_${dob}`,
            email,
            roll_number,
            odd_numbers,
            even_numbers,
            alphabets,
            special_characters,
            sum: String(sum),
            concat_string: altCaps
        });
    } catch (err) {
        res.status(500).json({ is_success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
