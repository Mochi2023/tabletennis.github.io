// 首頁 JavaScript 和 Anime.js 動畫

document.addEventListener('DOMContentLoaded', () => {
    // 初始化頁面
    initializeHomePage();
    
    // 啟動動畫
    startAnimations();
});

// 初始化頁面
function initializeHomePage() {
    // 獲取並顯示會員總數和比賽總數
    updateStats();
}

// 更新統計數據
function updateStats() {
    // 從 script.js 獲取會員和比賽數據
    if (typeof members !== 'undefined') {
        animateCounter('memberCount', members.length);
    } else {
        animateCounter('memberCount', 4);
    }
    
    if (typeof matchRecords !== 'undefined') {
        animateCounter('matchCount', matchRecords.length);
    } else {
        animateCounter('matchCount', 15);
    }
}

// 數字增長動畫
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    
    anime({
        targets: { value: 0 },
        value: targetValue,
        duration: 2000,
        easing: 'easeInOutExpo',
        round: 1,
        update: function(anim) {
            element.textContent = Math.round(anim.animations[0].currentValue);
        }
    });
}

// 啟動所有動畫
function startAnimations() {
    // Logo 和標題動畫
    anime({
        targets: '.logo-container',
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 1500,
        easing: 'easeOutExpo'
    });
    
    // 選單動畫
    anime({
        targets: '.menu-container',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1500,
        delay: 500,
        easing: 'easeOutExpo'
    });
    
    // 統計區域動畫
    anime({
        targets: '.stats-container',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1500,
        delay: 1000,
        easing: 'easeOutExpo'
    });
    
    // 頁腳動畫
    anime({
        targets: 'footer',
        opacity: [0, 1],
        duration: 1500,
        delay: 1500,
        easing: 'easeOutExpo'
    });
    
    // 乒乓球動畫
    animatePingPong();
}

// 乒乓球動畫
function animatePingPong() {
    // 球拍左右移動動畫
    anime({
        targets: '.paddle-left',
        translateY: [
            { value: -30, duration: 700, easing: 'easeOutQuad' },
            { value: 30, duration: 700, easing: 'easeInOutQuad' },
            { value: 0, duration: 700, easing: 'easeInQuad' }
        ],
        loop: true
    });
    
    anime({
        targets: '.paddle-right',
        translateY: [
            { value: 30, duration: 700, easing: 'easeOutQuad' },
            { value: -30, duration: 700, easing: 'easeInOutQuad' },
            { value: 0, duration: 700, easing: 'easeInQuad' }
        ],
        loop: true
    });
    
    // 球的移動動畫
    const ballAnimation = anime({
        targets: '.ball',
        translateX: [
            { value: 230, duration: 1000, easing: 'easeOutQuad' },
            { value: 0, duration: 1000, easing: 'easeOutQuad' }
        ],
        translateY: [
            { value: -30, duration: 500, easing: 'easeOutQuad' },
            { value: 30, duration: 500, easing: 'easeInQuad' },
            { value: -30, duration: 500, easing: 'easeOutQuad' },
            { value: 0, duration: 500, easing: 'easeInQuad' }
        ],
        loop: true
    });
    
    // 添加球的旋轉效果
    anime({
        targets: '.ball',
        rotateZ: '360deg',
        duration: 1000,
        loop: true,
        easing: 'linear'
    });
    
    // 菜單項目懸停效果
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({
                targets: item,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutElastic(1, .5)'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            anime({
                targets: item,
                scale: 1,
                duration: 300,
                easing: 'easeOutElastic(1, .5)'
            });
        });
    });
}