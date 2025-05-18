const input = process.argv[2];

function sum (numbersArray) {
    if(!!numbersArray.length) {
        return numbersArray.reduce((acc, currentVal) => {
            acc += Array.isArray(currentVal) ? sum(currentVal) : currentVal
            return  acc
        });
    }
}

try {
    const sumInput = sum(JSON.parse(input));
    console.log(`Output: ${sumInput}`);
} catch (e) {
    console.error("Error");
    process.exit(1);
}


