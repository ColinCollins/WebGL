var StringParse = function (str) {
    this.str;       // 将参数字符串保存下来
    this.index;
    this.init(str);
}

let prop = StringParse.prototype;

prop.init = function (str) {
    this.str = str;
    this.index = 0;
}
// 从这里看的出，传入的对象一般是 一个句子而不是一整个文本。跳过特殊字符
prop.skipDelimiters = function () {
    for (var i = this.index, len = this.str.length; i < len; i++) {
        var c = this.str.charAt(i);
        if (c === '\t' || c === ' ' || c === '(' || c === ')' || c === '"') continue;
        break;
    }
    this.index = i;
}

prop.skipToNextWord = function () {
    this.skipDelimiters();
    let n = getWordLength(this.str, this.index);
    this.index += (n + 1);
}

prop.getWord = function () {
    this.skipDelimiters();
    let n = getWordLength(this.str, this.index);
    if (n === 0) return null;
    let word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
}

prop.getInt = function () {
    return parseInt(this.getWord());
}

prop.getFloat = function () {
    return parseFloat(this.getWord());
}

function getWordLength (str, start) {
    let n = 0;
    for (var i = start, len = str.length; i < len; i++) {
        let c = str.charAt(i);
        if (c === '\t' || c === ' ' || c === '(' || c === ')' || c === '"') {
            break;
        }
    }
    return i - start;
}

module.exports = StringParse;