// 比賽系統 JavaScript

// 全局變量
let currentPlayers = {
    player1: null,
    player2: null
};
let matchFormat = 3; // 默認3局2勝
let currentSet = 1;
let matchScore = { player1: 0, player2: 0 };
let setScores = []; // 儲存每局的比分
let currentSetScore = { player1: 0, player2: 0 };
let servingPlayer = null; // 當前發球方
let pointHistory = []; // 用於撤銷功能
let gameState = 'setup'; // setup, playing, result

// DOM 元素
const matchSetupSection = document.getElementById('matchSetup');
const matchInProgressSection = document.getElementById('matchInProgress');
const matchResultSection = document.getElementById('matchResult');
const player1Select = document.getElementById('player1');
const player2Select = document.getElementById('player2');
const matchFormatSelect = document.getElementById('matchFormat');
const startMatchBtn = document.getElementById('startMatchBtn');
const player1ScoreBtn = document.getElementById('player1ScoreBtn');
const player2ScoreBtn = document.getElementById('player2ScoreBtn');
const undoBtn = document.getElementById('undoBtn');
const endMatchBtn = document.getElementById('endMatchBtn');
const saveResultBtn = document.getElementById('saveResultBtn');
const newMatchBtn = document.getElementById('newMatchBtn');
const confirmEndMatchModal = document.getElementById('confirmEndMatchModal');
const cancelEndMatchBtn = document.getElementById('cancelEndMatchBtn');
const confirmEndMatchBtn = document.getElementById('confirmEndMatchBtn');
const setTransitionModal = document.getElementById('setTransitionModal');

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    setupEventListeners();
});

// 載入會員資料
function loadMembers() {
    // 從會員管理系統獲取會員資料
    const memberOptions1 = members.map(member => 
        `<option value="${member.id}">${member.name} (${member.racketType}/${member.rubberType || '未設置'})</option>`
    ).join('');
    
    const memberOptions2 = members.map(member => 
        `<option value="${member.id}">${member.name} (${member.racketType}/${member.rubberType || '未設置'})</option>`
    ).join('');
    
    player1Select.innerHTML = '<option value="">-- 選擇選手 --</option>' + memberOptions1;
    player2Select.innerHTML = '<option value="">-- 選擇選手 --</option>' + memberOptions2;
}

// 設置事件監聽器
function setupEventListeners() {
    // 開始比賽按鈕
    startMatchBtn.addEventListener('click', startMatch);
    
    // 得分按鈕
    player1ScoreBtn.addEventListener('click', () => addPoint('player1'));
    player2ScoreBtn.addEventListener('click', () => addPoint('player2'));
    
    // 撤銷按鈕
    undoBtn.addEventListener('click', undoLastPoint);
    
    // 結束比賽按鈕
    endMatchBtn.addEventListener('click', () => openModal(confirmEndMatchModal));
    
    // 取消結束比賽
    cancelEndMatchBtn.addEventListener('click', () => closeModal(confirmEndMatchModal));
    
    // 確認結束比賽
    confirmEndMatchBtn.addEventListener('click', endMatch);
    
    // 保存結果按鈕
    saveResultBtn.addEventListener('click', saveMatchResult);
    
    // 新比賽按鈕
    newMatchBtn.addEventListener('click', resetMatch);
    
    // 選手選擇變更時檢查
    player1Select.addEventListener('change', validatePlayerSelection);
    player2Select.addEventListener('change', validatePlayerSelection);
    
    // 比賽局數選擇
    matchFormatSelect.addEventListener('change', () => {
        matchFormat = parseInt(matchFormatSelect.value);
    });
}

// 驗證選手選擇（不能選擇同一個選手）
function validatePlayerSelection() {
    const player1Id = player1Select.value;
    const player2Id = player2Select.value;
    
    if (player1Id && player2Id && player1Id === player2Id) {
        alert('不能選擇同一個選手！');
        player2Select.value = '';
    }
    
    // 啟用/禁用開始按鈕
    startMatchBtn.disabled = !(player1Id && player2Id && player1Id !== player2Id);
}

// 開始比賽
function startMatch() {
    const player1Id = parseInt(player1Select.value);
    const player2Id = parseInt(player2Select.value);
    
    if (!player1Id || !player2Id || player1Id === player2Id) {
        alert('請選擇兩位不同的選手！');
        return;
    }
    
    // 設置當前選手
    currentPlayers.player1 = members.find(m => m.id === player1Id);
    currentPlayers.player2 = members.find(m => m.id === player2Id);
    
    // 設置比賽局數
    matchFormat = parseInt(matchFormatSelect.value);
    
    // 隨機決定首局發球方
    servingPlayer = Math.random() < 0.5 ? 'player1' : 'player2';
    
    // 初始化比賽數據
    currentSet = 1;
    matchScore = { player1: 0, player2: 0 };
    setScores = [];
    currentSetScore = { player1: 0, player2: 0 };
    pointHistory = [];
    gameState = 'playing';
    
    // 更新界面
    updateMatchInterface();
    
    // 切換到比賽進行界面
    matchSetupSection.classList.add('hidden');
    matchInProgressSection.classList.remove('hidden');
    matchResultSection.classList.add('hidden');
}

// 更新比賽界面
function updateMatchInterface() {
    // 更新選手信息
    document.getElementById('player1Name').textContent = currentPlayers.player1.name;
    document.getElementById('player2Name').textContent = currentPlayers.player2.name;
    document.getElementById('player1RacketType').textContent = `${currentPlayers.player1.racketType}/${currentPlayers.player1.rubberType || '未設置'}`;
    document.getElementById('player2RacketType').textContent = `${currentPlayers.player2.racketType}/${currentPlayers.player2.rubberType || '未設置'}`;
    document.getElementById('player1WinRate').textContent = `勝率: ${((currentPlayers.player1.winRate || 0) * 100).toFixed(1)}%`;
    document.getElementById('player2WinRate').textContent = `勝率: ${((currentPlayers.player2.winRate || 0) * 100).toFixed(1)}%`;
    
    // 更新當前局數和比賽比分
    document.getElementById('currentSet').textContent = `第 ${currentSet} 局`;
    document.getElementById('matchScore').textContent = `${matchScore.player1} - ${matchScore.player2}`;
    
    // 更新當前局比分
    document.getElementById('player1Score').textContent = currentSetScore.player1;
    document.getElementById('player2Score').textContent = currentSetScore.player2;
    
    // 更新發球方指示器
    document.getElementById('player1Serving').classList.toggle('active', servingPlayer === 'player1');
    document.getElementById('player2Serving').classList.toggle('active', servingPlayer === 'player2');
    
    // 更新局分記錄
    updateSetScoresDisplay();
}

// 更新局分記錄顯示
function updateSetScoresDisplay() {
    const setScoresContainer = document.getElementById('setScores');
    setScoresContainer.innerHTML = '';
    
    setScores.forEach((score, index) => {
        const setScoreItem = document.createElement('div');
        setScoreItem.className = 'set-score-item';
        setScoreItem.textContent = `第${index + 1}局: ${score.player1}-${score.player2}`;
        setScoresContainer.appendChild(setScoreItem);
    });
}

// 添加得分
function addPoint(player) {
    // 記錄歷史，用於撤銷
    pointHistory.push({
        currentSetScore: { ...currentSetScore },
        matchScore: { ...matchScore },
        servingPlayer,
        currentSet
    });
    
    // 增加得分
    currentSetScore[player]++;
    
    // 添加得分動畫
    const scoreElement = document.getElementById(`${player}Score`);
    scoreElement.classList.add('animate');
    setTimeout(() => {
        scoreElement.classList.remove('animate');
    }, 300);
    
    // 檢查是否達到局點
    checkSetPoint();
    
    // 更新發球方
    updateServingPlayer();
    
    // 更新界面
    updateMatchInterface();
}

// 檢查是否達到局點
function checkSetPoint() {
    const pointsToWin = 11;
    const player1Score = currentSetScore.player1;
    const player2Score = currentSetScore.player2;
    
    // 檢查是否有一方達到11分且領先2分以上
    if ((player1Score >= pointsToWin && player1Score - player2Score >= 2) || 
        (player2Score >= pointsToWin && player2Score - player1Score >= 2)) {
        
        // 確定獲勝方
        const setWinner = player1Score > player2Score ? 'player1' : 'player2';
        
        // 記錄本局比分
        setScores.push({ ...currentSetScore });
        
        // 更新比賽比分
        matchScore[setWinner]++;
        
        // 檢查比賽是否結束
        if (checkMatchEnd()) {
            endMatch();
            return;
        }
        
        // 準備下一局
        prepareNextSet();
    }
}

// 檢查比賽是否結束
function checkMatchEnd() {
    const setsToWin = Math.ceil(matchFormat / 2);
    return matchScore.player1 >= setsToWin || matchScore.player2 >= setsToWin;
}

// 準備下一局
function prepareNextSet() {
    // 設置局間過場動畫
    document.getElementById('setEndMessage').textContent = `第 ${currentSet} 局結束`;
    document.getElementById('setPlayer1Name').textContent = currentPlayers.player1.name;
    document.getElementById('setPlayer2Name').textContent = currentPlayers.player2.name;
    document.getElementById('setPlayer1Score').textContent = currentSetScore.player1;
    document.getElementById('setPlayer2Score').textContent = currentSetScore.player2;
    
    // 顯示局間過場
    openModal(setTransitionModal);
    
    // 倒計時
    let countdown = 5;
    document.getElementById('countdown').textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeModal(setTransitionModal);
            
            // 進入下一局
            currentSet++;
            currentSetScore = { player1: 0, player2: 0 };
            
            // 交換發球權
            servingPlayer = servingPlayer === 'player1' ? 'player2' : 'player1';
            
            // 更新界面
            updateMatchInterface();
        }
    }, 1000);
}

// 更新發球方
function updateServingPlayer() {
    const totalPoints = currentSetScore.player1 + currentSetScore.player2;
    
    // 修改發球規則：
    // 1. 每獲得2分後交換發球權
    // 2. 當比分10-10平時改為每人輪流發1球
    if (currentSetScore.player1 >= 10 && currentSetScore.player2 >= 10) {
        // 10-10平後，每人輪流發1球
        servingPlayer = servingPlayer === 'player1' ? 'player2' : 'player1';
    } else if (totalPoints % 2 === 0 && totalPoints > 0) {
        // 正常情況下每2分交換發球權
        servingPlayer = servingPlayer === 'player1' ? 'player2' : 'player1';
    }
}

// 撤銷上一個得分
function undoLastPoint() {
    if (pointHistory.length === 0) return;
    
    const lastState = pointHistory.pop();
    currentSetScore = { ...lastState.currentSetScore };
    matchScore = { ...lastState.matchScore };
    servingPlayer = lastState.servingPlayer;
    currentSet = lastState.currentSet;
    
    // 如果撤銷後局數變少，需要移除多餘的局分記錄
    while (setScores.length >= currentSet) {
        setScores.pop();
    }
    
    updateMatchInterface();
}

// 結束比賽
function endMatch() {
    closeModal(confirmEndMatchModal);
    
    // 如果當前局有進行中的比分且尚未結束，記錄本局
    // 修改：只在比賽尚未結束且當前局有進行中的比分時才記錄本局
    if ((currentSetScore.player1 > 0 || currentSetScore.player2 > 0) && !checkMatchEnd()) {
        setScores.push({ ...currentSetScore });
    }
    
    // 確定獲勝方
    const winner = matchScore.player1 > matchScore.player2 ? 'player1' : 'player2';
    
    // 更新結果界面
    document.getElementById('winnerName').textContent = currentPlayers[winner].name;
    document.getElementById('finalPlayer1Name').textContent = currentPlayers.player1.name;
    document.getElementById('finalPlayer2Name').textContent = currentPlayers.player2.name;
    document.getElementById('finalPlayer1Score').textContent = matchScore.player1;
    document.getElementById('finalPlayer2Score').textContent = matchScore.player2;
    
    // 更新詳細比分
    updateSetDetails();
    
    // 切換到結果界面
    matchInProgressSection.classList.add('hidden');
    matchResultSection.classList.remove('hidden');
    
    gameState = 'result';
}

// 更新詳細比分
function updateSetDetails() {
    const setDetailsContainer = document.getElementById('setDetails');
    setDetailsContainer.innerHTML = '';
    
    // 只顯示實際進行的局數，而不是預設的全部局數
    setScores.forEach((score, index) => {
        const setDetailItem = document.createElement('div');
        setDetailItem.className = 'set-detail-item';
        
        const winner = score.player1 > score.player2 ? 'player1' : 'player2';
        const winnerName = currentPlayers[winner].name;
        
        setDetailItem.innerHTML = `
            <span>第 ${index + 1} 局</span>
            <span>${currentPlayers.player1.name} ${score.player1} - ${score.player2} ${currentPlayers.player2.name}</span>
            <span class="${winner === 'player1' ? 'win' : 'lose'}">${winnerName} 勝</span>
        `;
        
        setDetailsContainer.appendChild(setDetailItem);
    });
}

// 保存比賽結果
function saveMatchResult() {
    // 生成比賽記錄
    const matchDate = new Date().toISOString().split('T')[0];
    const player1Id = currentPlayers.player1.id;
    const player2Id = currentPlayers.player2.id;
    const winnerId = matchScore.player1 > matchScore.player2 ? player1Id : player2Id;
    
    // 生成比分字符串
    const scoreString = setScores.map(score => `${score.player1}-${score.player2}`).join(',');
    
    // 創建新的比賽記錄
    const newMatchRecord = {
        id: matchRecords.length > 0 ? Math.max(...matchRecords.map(m => m.id)) + 1 : 1,
        player1: player1Id,
        player2: player2Id,
        winner: winnerId,
        score: scoreString,
        date: matchDate
    };
    
    // 添加到比賽記錄
    matchRecords.push(newMatchRecord);
    
    // 更新選手勝率
    updatePlayerWinRates();
    
    // 顯示成功消息
    alert('比賽結果已保存！');
    
    // 重置比賽
    resetMatch();
}

// 更新選手勝率
function updatePlayerWinRates() {
    // 更新所有會員的勝率
    members.forEach(member => {
        const memberMatches = matchRecords.filter(match => 
            match.player1 === member.id || match.player2 === member.id
        );
        
        if (memberMatches.length > 0) {
            const wins = memberMatches.filter(match => match.winner === member.id).length;
            member.winRate = wins / memberMatches.length;
        }
    });
}

// 重置比賽
function resetMatch() {
    // 重置所有比賽數據
    currentPlayers = { player1: null, player2: null };
    matchFormat = 3;
    currentSet = 1;
    matchScore = { player1: 0, player2: 0 };
    setScores = [];
    currentSetScore = { player1: 0, player2: 0 };
    servingPlayer = null;
    pointHistory = [];
    gameState = 'setup';
    
    // 重置選擇
    player1Select.value = '';
    player2Select.value = '';
    matchFormatSelect.value = '3';
    
    // 切換到設置界面
    matchSetupSection.classList.remove('hidden');
    matchInProgressSection.classList.add('hidden');
    matchResultSection.classList.add('hidden');
}

// 打開模態框
function openModal(modal) {
    modal.style.display = 'block';
}

// 關閉模態框
function closeModal(modal) {
    modal.style.display = 'none';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}