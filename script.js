
        const diceInput = document.getElementById('diceInput');
        const diceOutput = document.getElementById('resultOutput');
        
        function parseDiceExpression(expression) {
            // �Ƴ����пո񲢲�ֱ��ʽΪ�����ŵ���
            const cleaned = expression.replace(/\s+/g, '');
            const terms = cleaned.split(/(?=[+-])/g);

            let total = 0;
            const expandedTerms = [];

            for (const term of terms) {
                // ��ȡ���ź�����
                let sign = '+';
                let content = term;
                if (['+', '-'].includes(term[0])) {
                    sign = term[0];
                    content = term.slice(1);
                }

                // ���������������
                const diceMatch = content.match(/^(\d*)d(\d+)$/i);

                if (diceMatch) {
                    // ������������������
                    const times = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
                    const sides = parseInt(diceMatch[2], 10);
      
                    // �������ӽ���������ܺ�
                    
                    for (let i = 0; i < times; i++) {
                        let res = Math.floor(Math.random() * sides) + 1;
                        let termValue = sign === '+' ? res : -res;
                        expandedTerms.push(termValue);
                        total += termValue;
                    }

                    

                } else {
                    // ��������
                    const num = parseInt(content, 10);
                    if (isNaN(num)) throw new Error(`Invalid term: ${term}`);
                    let termValue = sign === '+' ? num : -num;
                    expandedTerms.push(termValue);
                    total += termValue;

                }

                
            }   

            // ����չ�����ʽ�ַ���
            const expressionParts = expandedTerms.map((val, index) => {   
                if (index === 0) return val.toString();
                return val >= 0 ? `+${val}` : `${val}`;
            });

            return {
                total: total,
                expression: expressionParts.join(' ')
            };
        }


        // ��ȡҳ��Ԫ��
        
        const buttons = {
            d20: document.getElementById('d20'),
            d10: document.getElementById('d10'),
            d8: document.getElementById('d8'),
            d6: document.getElementById('d6'),
            d4: document.getElementById('d4'),
            d100: document.getElementById('d100'),
        };

        
        // Ϊÿ����ť��ӵ���¼�
        Object.keys(buttons).forEach(diceType => {
            buttons[diceType].addEventListener('click', () => {
                diceInput.value += "+" + buttons[diceType].innerText;
            });
        });

        document.getElementById('clearButton').addEventListener('click', () => {
            diceInput.value = '';
            diceOutput.value = '';
        });

        document.getElementById('rollButton').addEventListener('click', () => {
            result = parseDiceExpression(diceInput.value);
            diceOutput.value = "Expression:" +result.expression + "\n" + "Total: " + result.total;
        });


