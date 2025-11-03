// 獲取元素
const incinerator = document.getElementById('incinerator');
const jossPapers = document.querySelectorAll('.joss-paper');
const scoreDisplay = document.getElementById('score');
const inventoryContainer = document.getElementById('joss-paper-inventory');

let currentScore = 0;

// 儲存紙錢類型和數值的映射
const paperTypes = {};
jossPapers.forEach(paper => {
    // 使用 DOM 元素的 data-value 和 innerText 作為映射
    const value = parseInt(paper.dataset.value);
    const key = paper.innerText.trim(); // 使用 emoji 或標籤作為 key，例如 '💰', '💵', '👑'
    
    // 假設我們知道這些紙錢的順序對應 1, 2, 3 鍵
    if (key === '💰') paperTypes['1'] = value;
    if (key === '💵') paperTypes['2'] = value;
    if (key === '👑') paperTypes['3'] = value;
});

// ====================================
// 核心函數：處理燒紙錢的邏輯和動畫
// ====================================
function burnJossPaper(value) {
    // 增加功德值
    currentScore += value;
    scoreDisplay.textContent = currentScore;
    
    // 1. 播放燒紙錢動畫
    const fireEffect = document.createElement('div');
    fireEffect.classList.add('pixel-fire-animation'); // 應用 CSS 定義的火焰動畫
    incinerator.appendChild(fireEffect);
    
    // 2. 創建一個臨時的「燒掉」訊息
    const message = document.createElement('p');
    message.classList.add('burn-message');
    message.textContent = `+${value} 兩`;
    incinerator.appendChild(message);

    // 3. 短暫延遲後移除動畫和訊息
    setTimeout(() => {
        if (incinerator.contains(fireEffect)) {
            incinerator.removeChild(fireEffect);
        }
        if (incinerator.contains(message)) {
            incinerator.removeChild(message);
        }
    }, 1000); // 1秒後火焰和訊息消失
}


// ====================================
// 鍵盤快速鍵監聽器
// ====================================
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // 檢查按下的鍵是否為數字鍵 1, 2, 或 3
    if (key === '1' || key === '2' || key === '3') {
        e.preventDefault(); // 阻止瀏覽器預設行為（例如部分瀏覽器的快速尋找）
        
        // 根據按鍵獲取對應的紙錢數值
        const valueToBurn = paperTypes[key];

        if (valueToBurn) {
            // 執行燒紙錢的動作
            burnJossPaper(valueToBurn);

            // 視覺回饋：在紙錢庫存區模擬按鍵被按下的效果 (可選)
            const paperElement = Array.from(jossPapers).find(p => p.innerText.trim() === (key === '1' ? '💰' : key === '2' ? '💵' : '👑'));
            if (paperElement) {
                paperElement.style.transform = 'translateY(2px)';
                setTimeout(() => {
                    paperElement.style.transform = 'translateY(0)';
                }, 100);
            }
        }
    }
});


// ====================================
// 拖曳與放置功能 (保留)
// ====================================
jossPapers.forEach(paper => {
    paper.draggable = true;
    
    // 拖曳開始事件
    paper.addEventListener('dragstart', (e) => {
        // 儲存被拖曳紙錢的數值
        e.dataTransfer.setData('text/plain', paper.dataset.value);
    });
});

// 啟用金爐的放置區域
incinerator.addEventListener('dragover', (e) => {
    e.preventDefault(); // 允許放置
});

// 放置事件 (燒紙錢)
incinerator.addEventListener('drop', (e) => {
    e.preventDefault();
    
    // 獲取紙錢數值
    const value = parseInt(e.dataTransfer.getData('text/plain'));
    
    // 執行燒紙錢的動作
    if (value) {
        burnJossPaper(value);
    }
});
