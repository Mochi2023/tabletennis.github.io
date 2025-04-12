// 目錄頁面 JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // 檢查登入狀態
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // 顯示用戶名
    const username = localStorage.getItem('username');
    document.getElementById('username').textContent = username || '管理員';
    
    // 登出按鈕
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        
        // 顯示登出動畫
        const container = document.querySelector('.container');
        container.classList.add('animate__animated', 'animate__fadeOut');
        
        // 延遲跳轉到登入頁面
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
    
    // 顯示當前日期
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    document.getElementById('currentDate').textContent = formattedDate;
    
    // 獲取並顯示會員總數和比賽總數
    updateStats();
});

// 更新統計數據
function updateStats() {
    // 從 script.js 獲取會員和比賽數據
    if (typeof members !== 'undefined') {
        document.getElementById('totalMembers').textContent = members.length;
    } else {
        // 如果 script.js 尚未加載，則使用 AJAX 獲取數據或設置默認值
        fetch('js/script.js')
            .then(() => {
                if (typeof members !== 'undefined') {
                    document.getElementById('totalMembers').textContent = members.length;
                }
            })
            .catch(() => {
                document.getElementById('totalMembers').textContent = '4';
            });
    }
    
    if (typeof matchRecords !== 'undefined') {
        document.getElementById('totalMatches').textContent = matchRecords.length;
    } else {
        // 如果 script.js 尚未加載，則使用 AJAX 獲取數據或設置默認值
        fetch('js/script.js')
            .then(() => {
                if (typeof matchRecords !== 'undefined') {
                    document.getElementById('totalMatches').textContent = matchRecords.length;
                }
            })
            .catch(() => {
                document.getElementById('totalMatches').textContent = '15';
            });
    }
}