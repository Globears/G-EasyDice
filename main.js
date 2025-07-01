const rollModules = document.querySelectorAll('.roll-module');

for (const module of rollModules) {
    const rollButton = module.querySelector('#roll-button');
    const clearButton = module.querySelector('#clear-button');
    const copyButton = module.querySelector('#copy-button');
    const inputField = module.querySelector('.dice-input');
    const outputFields = module.querySelectorAll('.dice-output');

    rollButton.addEventListener('click', () => {
        Roll(inputField, outputFields, false);
    });

    rollButton.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        Roll(inputField, outputFields, true);
    });

    rollButton.addEventListener('click', () => {
        setTimeout(() => {
            CopyResult(inputField,outputFields);
        }, 500);
    });

    rollButton.addEventListener('contextmenu', () => {
        setTimeout(() => {
            CopyResult(inputField,outputFields);
        }, 500);
    });

    clearButton.addEventListener('click', () => {
        inputField.value = '';
        outputFields.forEach(outputField => outputField.value = '');
    });

    copyButton.addEventListener('click', () => {
        CopyResult(inputField, outputFields);
    });

    const diceButtons = module.querySelectorAll('.dice-button');
    diceButtons.forEach(button => {
        button.addEventListener('click', () => {
            inputField.value += " + " + button.innerText;
        });
    });

}

const addCharacterButton = document.querySelector('#add-character-button');
const rollInitiativeButton = document.querySelector('#roll-initiative-button');
const characterList = document.querySelector('.characters');
const characterTemplate = document.querySelector('.character');

addCharacterButton.addEventListener('click', () => {
    let newCharacter = characterTemplate.cloneNode(true);
    newCharacter.querySelector('#remove-character-button').addEventListener('click', () => {
        newCharacter.remove();
    });
    characterList.appendChild(newCharacter);
});

rollInitiativeButton.addEventListener('click', () => {
    const characters = characterList.querySelectorAll('.character');
    for(const character of characters){
        
        const total = character.querySelector('#character-initiative');
        const bonus = character.querySelector('#character-initiative-bonus').value;
        let rolled = Math.random() * 20 + 1; // 随机掷骰子1d20
        rolled = Math.floor(rolled);

        total.value = rolled + (Number(bonus) || 0); // 计算总和

    }

    // 按照总和排序
    const sortedCharacters = Array.from(characters).sort((a, b) => {
        const totalA = parseInt(a.querySelector('#character-initiative').value, 10);
        const totalB = parseInt(b.querySelector('#character-initiative').value, 10);
        return totalB - totalA; // 降序排序
    });
    // 清空列表并重新添加排序后的角色
    characterList.innerHTML = ''; // 清空列表
    sortedCharacters.forEach(character => {
        characterList.appendChild(character);
    });
});

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


function RandomAnimation(output){
    output.value = '';
    characters = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0 ; i < 20 ; i ++){
        output.value += characters.charAt(Math.floor(Math.random() * characters.length));
    }
}

function Roll(input, outputs, advantage) {
    outputs[0].value = '';
    outputs[1].value = '';
    let anim = setInterval(() => RandomAnimation(outputs[0]), 20);
    setTimeout(() => {
        clearInterval(anim);
        outputs[0].value = '';
        let result = parseDiceExpression(input.value);
        if(result.expression == result.total.toString()){
            outputs[0].value = "= " + result.expression;
        }else{
            outputs[0].value = "= " + result.expression + "\n" + "= " + result.total;
        }
    }, 200);

    if (advantage){
        let anim = setInterval(() => RandomAnimation(outputs[1]), 20);
        setTimeout(() => {
            clearInterval(anim);
            outputs[1].value = '';
            let result = parseDiceExpression(input.value);
            if(result.expression == result.total.toString()){
                outputs[1].value = "= " + result.expression;
            }else{
                outputs[1].value = "= " + result.expression + "\n" + "= " + result.total;
            }
        }, 200);
    }
}

function CopyResult(input, outputs){
    if(outputs[1].value != ''){
        res = '[骰点结果]\n';
        res += input.value + '\n';
        res += '------第一骰------\n';
        res += outputs[0].value + '\n';
        res += '------第二骰------\n';
        res += outputs[1].value;
    }else{
        res = '[骰点结果]\n';
        res += input.value + '\n';
        res += outputs[0].value;
    }
    navigator.clipboard.writeText(res);
}

