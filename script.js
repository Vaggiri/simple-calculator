// Calculator state
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;
        let memoryValue = 0;
        
        // DOM elements
        const resultDisplay = document.getElementById('result');
        const historyDisplay = document.getElementById('history');
        const tabs = document.querySelectorAll('.tab');
        const panels = document.querySelectorAll('.panel');
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-tab');
                
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${targetPanel}-panel`).classList.add('active');
            });
        });
        
        // Calculator functions
        function appendNumber(number) {
            if (currentInput === '0' || resetScreen) {
                currentInput = number;
                resetScreen = false;
            } else {
                currentInput += number;
            }
            updateDisplay();
        }
        
        function appendDecimal() {
            if (resetScreen) {
                currentInput = '0.';
                resetScreen = false;
                return;
            }
            
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
            updateDisplay();
        }
        
        function appendOperator(op) {
            if (operation !== null) calculate();
            previousInput = currentInput;
            operation = op;
            resetScreen = true;
            updateHistory();
        }
        
        function calculate() {
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    computation = prev / current;
                    break;
                case 'pow':
                    computation = Math.pow(prev, current);
                    break;
                case 'mod':
                    computation = prev % current;
                    break;
                default:
                    return;
            }
            
            currentInput = computation.toString();
            operation = null;
            resetScreen = true;
            updateHistory(true);
        }
        
        function calculateFunction(func) {
            const value = parseFloat(currentInput);
            let computation;
            
            switch (func) {
                case 'sin':
                    computation = Math.sin(value * (Math.PI / 180)); // Convert to radians if needed
                    break;
                case 'cos':
                    computation = Math.cos(value * (Math.PI / 180));
                    break;
                case 'tan':
                    computation = Math.tan(value * (Math.PI / 180));
                    break;
                case 'asin':
                    computation = Math.asin(value) * (180 / Math.PI); // Convert to degrees
                    break;
                case 'acos':
                    computation = Math.acos(value) * (180 / Math.PI);
                    break;
                case 'atan':
                    computation = Math.atan(value) * (180 / Math.PI);
                    break;
                case 'log':
                    computation = Math.log10(value);
                    break;
                case 'ln':
                    computation = Math.log(value);
                    break;
                case 'sqrt':
                    computation = Math.sqrt(value);
                    break;
                case 'fact':
                    computation = factorial(value);
                    break;
                case 'pi':
                    computation = Math.PI;
                    break;
                case 'e':
                    computation = Math.E;
                    break;
                case 'exp':
                    computation = Math.exp(value);
                    break;
                case 'rand':
                    computation = Math.random();
                    break;
                default:
                    return;
            }
            
            currentInput = computation.toString();
            updateDisplay();
            updateHistory(true, `${func}(${value})`);
        }
        
        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
        
        function clearDisplay() {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay();
            historyDisplay.textContent = '';
        }
        
        function backspace() {
            if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay();
        }
        
        function toggleSign() {
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay();
        }
        
        function percentage() {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay();
        }
        
        // Memory functions
        function memoryStore() {
            memoryValue = parseFloat(currentInput);
        }
        
        function memoryRecall() {
            currentInput = memoryValue.toString();
            updateDisplay();
        }
        
        function memoryClear() {
            memoryValue = 0;
        }
        
        function memoryAdd() {
            memoryValue += parseFloat(currentInput);
        }
        
        // Display functions
        function updateDisplay() {
            resultDisplay.value = currentInput;
        }
        
        function updateHistory(clear = false, customOperation = null) {
            if (clear) {
                historyDisplay.textContent = '';
                return;
            }
            
            if (operation) {
                if (customOperation) {
                    historyDisplay.textContent = customOperation;
                } else {
                    historyDisplay.textContent = `${previousInput} ${operation} ${currentInput}`;
                }
            }
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
            else if (e.key === '.') appendDecimal();
            else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') 
                appendOperator(e.key);
            else if (e.key === 'Enter' || e.key === '=') calculate();
            else if (e.key === 'Escape') clearDisplay();
            else if (e.key === 'Backspace') backspace();
            else if (e.key === '%') percentage();
        });