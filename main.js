
const diceInput = document.getElementById('diceInput');
const diceOutputs = document.querySelectorAll('.result');

const numberButtons = document.querySelectorAll('.number-button');

const dices = {
    d20: document.getElementById('d20'),
    d10: document.getElementById('d10'),
    d8: document.getElementById('d8'),
    d6: document.getElementById('d6'),
    d4: document.getElementById('d4'),
    d100: document.getElementById('d100'),
};

function parseDiceExpression(expression) {
    // 移除所有空格并拆分表达式为带符号的项
    const cleaned = expression.replace(/\s+/g, '');
    const terms = cleaned.split(/(?=[+-])/g);

    let total = 0;
    const expandedTerms = [];

    for (const term of terms) {
        // 提取符号和内容
        let sign = '+';
        let content = term;
        if (['+', '-'].includes(term[0])) {
            sign = term[0];
            content = term.slice(1);
        }

        // 处理骰子项或常数项
        const diceMatch = content.match(/^(\d*)d(\d+)$/i);

        if (diceMatch) {
            // 解析骰子数量和面数
            const times = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
            const sides = parseInt(diceMatch[2], 10);

            // 生成骰子结果并计算总和
            
            for (let i = 0; i < times; i++) {
                let res = Math.floor(Math.random() * sides) + 1;
                let termValue = sign === '+' ? res : -res;
                expandedTerms.push(termValue);
                total += termValue;
            }

            

        } else {
            // 处理常数项
            const num = parseInt(content, 10);
            if (isNaN(num)) throw new Error(`Invalid term: ${term}`);
            let termValue = sign === '+' ? num : -num;
            expandedTerms.push(termValue);
            total += termValue;

        }

        
    }   

    // 生成展开表达式字符串
    const expressionParts = expandedTerms.map((val, index) => {   
        if (index === 0) return val.toString();
        return val >= 0 ? `+ ${val}` : `${val}`;
    });

    return {
        total: total,
        expression: expressionParts.join(' ')
    };
}


// 为每个骰子添加点击事件
Object.keys(dices).forEach(diceType => {
    dices[diceType].addEventListener('click', () => {
        diceInput.value += " + " + dices[diceType].innerText;
    });
});

// 为每个数字按钮添加点击事件
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        diceInput.value += button.innerText;
    });
});

document.getElementById('clearButton').addEventListener('click', () => {
    diceInput.value = '';
    for (const output of diceOutputs) {
        output.value = '';
    }
});

function RandomAnimation(text){
    text.value = '';
    characters = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0 ; i < 20 ; i ++){
        text.value += characters.charAt(Math.floor(Math.random() * characters.length));
    }
}

function OutputRandomResult(input, output) {
    let result = parseDiceExpression(input.value);
    let anim = setInterval(() => RandomAnimation(output), 20);
    setTimeout(() => {
        clearInterval(anim);
        output.value = '';
    }, 200);
    setTimeout(() => {
        result = parseDiceExpression(input.value);
        if(result.expression == result.total.toString()){
            output.value = "= " + result.expression;
        }else{
            output.value = "= " + result.expression + "\n" + "= " + result.total;
        }
    }, 200);

}

document.getElementById('rollButton').addEventListener('click', () => {

    for (const output of diceOutputs) {
        OutputRandomResult(diceInput, output);
    }

});


