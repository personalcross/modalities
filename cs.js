function mod(n, m) {
    return ((n % m) + m) % m;
}

function cs(text, shift) {
    return text.split('').map(char => {
        if (char >= 'a' && char <= 'z') {
            return String.fromCharCode(mod((char.charCodeAt(0) - 97 + shift), 26) + 97);
        } else if (char >= 'A' && char <= 'Z') {
            return String.fromCharCode(mod((char.charCodeAt(0) - 65 + shift), 26) + 65);
        } else {
            return char;
        }
    }).join('');
}

function dataToDict(raw) {
    const lines = raw.split('\n');
    const result = {};

    lines.forEach(line => {
        const match = line.match(/^(\w+):\s*"(.+)"$/);
        if (match) {
            const key = match[1];
            const value = match[2];
            result[key] = value;
        }
    });
    return result;
}

// model
const text = `
yngIcw: "YGxyQwAf36HgGql8ws_sWwTZbBRw9AiFBFXAtxY"
ysrfBmkygl: "cqrsbgmncpqmlyjapmqq.dgpczyqcynn.amk"
npmhcarGb: "cqrsbgmncpqmlyjapmqq"
qrmpyecZsaicr: "cqrsbgmncpqmlyjapmqq.dgpczyqcqrmpyec.ynn"
kcqqyegleQclbcpGb: "159764451155"
ynnGb: "1:159764451155:ucz:8b4cy05zdb9c9c8bd41zy6"
`;

const cd = cs(text, 2);
const data = dataToDict(cd);
