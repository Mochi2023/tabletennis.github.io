// 会员数据存储
let members = [
    {
        id: 1,
        name: '王小明',
        racketType: '直板',
        rubberType: '反膠',
        playYears: 5,
        winRate: 0.75,
        phone: '0912-345-678',
        joinDate: '2023-01-15',
        notes: '每週二、四固定訓練'
    },
    {
        id: 2,
        name: '李小花',
        racketType: '橫板',
        rubberType: '正膠',
        playYears: 8,
        winRate: 0.82,
        phone: '0923-456-789',
        joinDate: '2022-11-05',
        notes: '參加過全國比賽'
    },
    {
        id: 3,
        name: '張大山',
        racketType: '橫板',
        rubberType: '生膠',
        playYears: 1,
        winRate: 0.35,
        phone: '0934-567-890',
        joinDate: '2023-03-20',
        notes: '新手，需要基礎訓練'
    },
    {
        id: 4,
        name: '陳小雨',
        racketType: '直板',
        rubberType: '長膠',
        playYears: 10,
        winRate: 0.90,
        phone: '0945-678-901',
        joinDate: '2022-08-10',
        notes: '俱樂部贊助商'
    }
];

// 添加對戰記錄數據
const matchRecords = [
    { id: 1, player1: 1, player2: 2, winner: 1, score: "11-9,11-7,9-11,11-8", date: '2023-05-10' },
    { id: 2, player1: 1, player2: 3, winner: 1, score: "11-5,11-4,11-6", date: '2023-05-12' },
    { id: 3, player1: 1, player2: 4, winner: 4, score: "9-11,7-11,11-13", date: '2023-05-15' },
    { id: 4, player1: 2, player2: 3, winner: 2, score: "11-3,11-5,11-2", date: '2023-05-18' },
    { id: 5, player1: 2, player2: 4, winner: 4, score: "8-11,9-11,11-9,8-11", date: '2023-05-20' },
    { id: 6, player1: 3, player2: 4, winner: 4, score: "5-11,7-11,6-11", date: '2023-05-22' },
    { id: 7, player1: 1, player2: 2, winner: 2, score: "11-13,9-11,11-8,9-11", date: '2023-05-25' },
    { id: 8, player1: 1, player2: 3, winner: 1, score: "11-7,11-5,11-9", date: '2023-05-28' },
    { id: 9, player1: 1, player2: 4, winner: 4, score: "8-11,11-13,7-11", date: '2023-06-01' },
    { id: 10, player1: 2, player2: 3, winner: 2, score: "11-4,11-6,11-5", date: '2023-06-03' },
    { id: 11, player1: 2, player2: 4, winner: 2, score: "11-9,9-11,11-7,11-8", date: '2023-06-05' },
    { id: 12, player1: 3, player2: 4, winner: 4, score: "6-11,8-11,7-11", date: '2023-06-08' },
    { id: 13, player1: 1, player2: 2, winner: 1, score: "11-8,11-9,9-11,11-7", date: '2023-06-10' },
    { id: 14, player1: 1, player2: 3, winner: 1, score: "11-3,11-5,11-4", date: '2023-06-12' },
    { id: 15, player1: 1, player2: 4, winner: 1, score: "12-10,11-9,11-8", date: '2023-06-15' }
];

// DOM元素
const membersTableBody = document.getElementById('membersTableBody');
const memberFormModal = document.getElementById('memberFormModal');
const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const matchRecordsModal = document.getElementById('matchRecordsModal');
const recordsTableBody = document.getElementById('recordsTableBody');
const recordsModalTitle = document.getElementById('recordsModalTitle');
const memberForm = document.getElementById('memberForm');
const modalTitle = document.getElementById('modalTitle');
const addMemberBtn = document.getElementById('addMemberBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const closeBtn = document.querySelector('.close');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// 当前选中的会员ID（用于编辑和删除操作）
let currentMemberId = null;

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderMembersTable(members);
    setupEventListeners();
    
    // 设置默认的加入日期为今天
    document.getElementById('joinDate').valueAsDate = new Date();
    
    // 初始计算所有会员胜率
    updateAllMembersWinRate();
});

// 设置事件监听器
function setupEventListeners() {
    // 添加会员按钮
    addMemberBtn.addEventListener('click', () => {
        openAddMemberModal();
    });
    
    // 取消按钮
    cancelBtn.addEventListener('click', () => {
        closeModal(memberFormModal);
    });
    
    // 关闭按钮
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 表单提交
    memberForm.addEventListener('submit', handleFormSubmit);
    
    // 搜索功能
    searchInput.addEventListener('input', handleSearch);
    
    // 取消删除
    cancelDeleteBtn.addEventListener('click', () => {
        closeModal(confirmDeleteModal);
    });
    
    // 确认删除
    confirmDeleteBtn.addEventListener('click', () => {
        deleteMember(currentMemberId);
        closeModal(confirmDeleteModal);
    });
}

// 渲染会员表格
function renderMembersTable(membersToRender) {
    membersTableBody.innerHTML = '';
    
    if (membersToRender.length === 0) {
        membersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">沒有找到會員資料</td>
            </tr>
        `;
        return;
    }
    
    membersToRender.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.racketType}/${member.rubberType}</td>
            <td>${member.playYears} 年</td>
            <td>${((member.winRate || 0) * 100).toFixed(1)}%</td>
            <td>
                <button class="btn primary action-btn edit-btn" data-id="${member.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn danger action-btn delete-btn" data-id="${member.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn info action-btn records-btn" data-id="${member.id}">
                    <i class="fas fa-trophy"></i>
                </button>
            </td>
        `;
        
        membersTableBody.appendChild(row);
    });
    
    // 添加编辑和删除按钮的事件监听器
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            openEditMemberModal(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            openDeleteConfirmModal(id);
        });
    });
    
    // 添加对战记录按钮的事件监听器
    document.querySelectorAll('.records-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            openMatchRecordsModal(id);
        });
    });
}

// 打开添加会员模态框
function openAddMemberModal() {
    modalTitle.textContent = '新增會員';
    memberForm.reset();
    document.getElementById('memberId').value = '';
    document.getElementById('joinDate').valueAsDate = new Date();
    openModal(memberFormModal);
}

// 打开编辑会员模态框
function openEditMemberModal(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    modalTitle.textContent = '編輯會員';
    document.getElementById('memberId').value = member.id;
    document.getElementById('name').value = member.name;
    document.getElementById('racketType').value = member.racketType || '直板';
    document.getElementById('rubberType').value = member.rubberType || '正膠';
    document.getElementById('playYears').value = member.playYears || 0;
    document.getElementById('phone').value = member.phone;
    document.getElementById('joinDate').value = member.joinDate;
    document.getElementById('notes').value = member.notes || '';
    
    openModal(memberFormModal);
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    const memberId = document.getElementById('memberId').value;
    const memberData = {
        name: document.getElementById('name').value,
        racketType: document.getElementById('racketType').value,
        rubberType: document.getElementById('rubberType').value,
        playYears: parseInt(document.getElementById('playYears').value),
        phone: document.getElementById('phone').value,
        joinDate: document.getElementById('joinDate').value,
        notes: document.getElementById('notes').value
    };
    
    // 如果是编辑现有会员，保留原有胜率
    if (memberId) {
        const existingMember = members.find(m => m.id === parseInt(memberId));
        if (existingMember) {
            memberData.winRate = existingMember.winRate;
        } else {
            memberData.winRate = 0; // 新会员默认胜率为0
        }
        updateMember(parseInt(memberId), memberData);
    } else {
        // 添加新会员，胜率默认为0
        memberData.winRate = 0;
        addMember(memberData);
    }
    
    closeModal(memberFormModal);
}

// 渲染对战记录表格
function renderMatchRecordsTable(matches, memberId) {
    recordsTableBody.innerHTML = '';
    
    if (matches.length === 0) {
        recordsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">沒有找到對戰記錄</td>
            </tr>
        `;
        return;
    }
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        
        // 确定对手ID
        const opponentId = match.player1 === memberId ? match.player2 : match.player1;
        const opponent = members.find(m => m.id === opponentId);
        
        // 确定比赛结果
        const result = match.winner === memberId ? '勝' : '敗';
        const resultClass = match.winner === memberId ? 'win' : 'lose';
        
        row.innerHTML = `
            <td>${formatDate(match.date)}</td>
            <td>${opponent ? opponent.name : '未知對手'}</td>
            <td>${match.score}</td>
            <td class="${resultClass}">${result}</td>
        `;
        
        recordsTableBody.appendChild(row);
    });
}

// 计算会员胜率
function calculateWinRate(memberId) {
    const memberMatches = matchRecords.filter(match => 
        match.player1 === memberId || match.player2 === memberId
    );
    
    if (memberMatches.length === 0) return 0;
    
    const wins = memberMatches.filter(match => match.winner === memberId).length;
    return wins / memberMatches.length;
}

// 更新所有会员的胜率
function updateAllMembersWinRate() {
    members.forEach(member => {
        member.winRate = calculateWinRate(member.id);
    });
    renderMembersTable(members);
}

// 添加会员
function addMember(memberData) {
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    const newMember = {
        id: newId,
        ...memberData
    };
    
    members.push(newMember);
    renderMembersTable(members);
    showNotification('會員新增成功！', 'success');
}

// 更新会员
function updateMember(id, memberData) {
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
        members[index] = {
            ...members[index],
            ...memberData
        };
        renderMembersTable(members);
        showNotification('會員資料已更新！', 'success');
    }
}

// 删除会员
function deleteMember(id) {
    members = members.filter(m => m.id !== id);
    renderMembersTable(members);
    showNotification('會員已刪除！', 'warning');
}

// 处理搜索
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderMembersTable(members);
        return;
    }
    
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.phone.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.level.toLowerCase().includes(searchTerm)
    );
    
    renderMembersTable(filteredMembers);
}

// 打开模态框
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复背景滚动
}

// 格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        z-index: 1100;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background-color: var(--success-color);
    }
    
    .notification.warning {
        background-color: var(--warning-color);
    }
    
    .notification.error {
        background-color: var(--danger-color);
    }
    
    .notification.info {
        background-color: var(--secondary-color);
    }
    
    .win {
        color: var(--success-color);
        font-weight: bold;
    }
    
    .lose {
        color: var(--danger-color);
    }
    
    .records-container {
        max-height: 400px;
        overflow-y: auto;
    }
    
    #recordsTable {
        width: 100%;
        border-collapse: collapse;
    }
    
    #recordsTable th, #recordsTable td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    #recordsTable th {
        background-color: var(--primary-color);
        color: white;
    }
    
    .btn.info {
        background-color: var(--secondary-color);
        color: white;
    }
    
    .btn.info:hover {
        background-color: #2980b9;
    }
`;
document.head.appendChild(style);

// 打开对战记录模态框
function openMatchRecordsModal(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    recordsModalTitle.textContent = `${member.name} 的近十場對戰記錄`;
    
    // 获取该会员的最近10场比赛记录
    const recentMatches = getRecentMatches(id, 10);
    
    // 渲染对战记录表格
    renderMatchRecordsTable(recentMatches, id);
    
    openModal(matchRecordsModal);
}

// 获取最近的比赛记录
function getRecentMatches(memberId, limit) {
    // 筛选出包含该会员的比赛
    const memberMatches = matchRecords.filter(match => 
        match.player1 === memberId || match.player2 === memberId
    );
    
    // 按日期排序（最新的在前）
    memberMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 返回最近的limit场比赛
    return memberMatches.slice(0, limit);
}

// 渲染对战记录表格
function renderMatchRecordsTable(matches, memberId) {
    recordsTableBody.innerHTML = '';
    
    if (matches.length === 0) {
        recordsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">沒有找到對戰記錄</td>
            </tr>
        `;
        return;
    }
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        
        // 确定对手ID
        const opponentId = match.player1 === memberId ? match.player2 : match.player1;
        const opponent = members.find(m => m.id === opponentId);
        
        // 确定比赛结果
        const result = match.winner === memberId ? '勝' : '敗';
        const resultClass = match.winner === memberId ? 'win' : 'lose';
        
        row.innerHTML = `
            <td>${formatDate(match.date)}</td>
            <td>${opponent ? opponent.name : '未知對手'}</td>
            <td class="${resultClass}">${result}</td>
        `;
        
        recordsTableBody.appendChild(row);
    });
}

// 点击模态框外部关闭模态框
window.addEventListener('click', (e) => {
    if (e.target === memberFormModal) {
        closeModal(memberFormModal);
    }
    if (e.target === confirmDeleteModal) {
        closeModal(confirmDeleteModal);
    }
    if (e.target === matchRecordsModal) {
        closeModal(matchRecordsModal);
    }
});