const lib = {A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 14,
    M: 15,N: 16,O: 17,P: 18,Q: 19,R: 20,S: 21,T: 22, U: 23, V: 23, W: 25, X: 26, Y: 27, Z: 28, a: 29, b: 30,
    c: 31, d: 32, e: 33, f: 34, g: 35, h: 36, i: 37, j: 38, k: 39, l: 40, m: 41, n: 42, o: 43, p: 44, q: 45,
    r: 46, s: 47, t: 48, u: 49, v: 50, w: 51, x: 52, y: 53, z: 54, 0: 55, 1: 56, 2: 57, 3: 58, 4: 59, 5: 60,
    6: 61, 7: 62, 8: 63, 9: 64};

const newExt = (text) => {
    let newText = '';
    for (let i = 0; i < text.length; i++) {
        let x = text.charAt(i);
        newText += lib[x];
    }
    return newText;
};

const seeExt = (t) => {
    let gr = t.length / 2;
    let nExt = '';

    for (let i = 0; i < gr; i++) {
        let pair = parseInt(`${t[0]}${t[1]}`);
        for (let [key, value] of Object.entries(lib)) {
            if(value === pair) {
                nExt += key;
                t = t.substr(2, t.length);
            }
        }
    }

    return nExt;
};

module.exports = {
  newExt, seeExt
};
