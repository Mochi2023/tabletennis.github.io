// 登入頁面 JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // 登入表單提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 簡單的驗證（實際應用中應使用更安全的方式）
        if (username === 'admin' && password === 'admin123') {
            // 保存登入狀態
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // 顯示登入成功動畫
            const loginCard = document.querySelector('.login-card');
            loginCard.classList.remove('animate__fadeIn');
            loginCard.classList.add('animate__fadeOutUp');
            
            // 延遲跳轉到目錄頁面
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alert('用戶名或密碼錯誤！');
        }
    });
    
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
    }
});