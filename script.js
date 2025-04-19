// DOM 元素
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.querySelector('.search-input');
const cardContainer = document.getElementById('cardContainer');
const contextMenu = document.getElementById('contextMenu');
const modal = document.getElementById('newCardModal');
const addButton = document.getElementById('addButton');
const quickAdd = document.querySelector('.quick-add');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close-btn');

// 主题切换
themeToggle.addEventListener('click', () => {
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// 搜索功能
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card:not(.quick-add)');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const content = card.querySelector('.card-content').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(searchTerm) || 
                       content.includes(searchTerm) || 
                       tags.some(tag => tag.includes(searchTerm));
        
        card.style.display = matches ? 'block' : 'none';
    });
});

// 卡片拖拽功能
let draggedCard = null;

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedCard = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const card = e.target.closest('.card');
    if (card && card !== draggedCard && !card.classList.contains('quick-add')) {
        const rect = card.getBoundingClientRect();
        const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
        
        if (next) {
            card.parentNode.insertBefore(draggedCard, card.nextSibling);
        } else {
            card.parentNode.insertBefore(draggedCard, card);
        }
    }
}

// 右键菜单
function showContextMenu(e, card) {
    e.preventDefault();
    
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    
    // 确保菜单不会超出视窗
    const rect = contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        contextMenu.style.left = `${window.innerWidth - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
        contextMenu.style.top = `${window.innerHeight - rect.height}px`;
    }
    
    // 绑定菜单项事件
    const menuItems = contextMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.onclick = () => handleContextMenuAction(item, card);
    });
}

function handleContextMenuAction(menuItem, card) {
    const action = menuItem.querySelector('span').textContent;
    
    switch(action) {
        case '编辑':
            showEditModal(card);
            break;
        case '收藏':
            toggleFavorite(card);
            break;
        case '删除':
            if (confirm('确定要删除这张卡片吗？')) {
                card.remove();
            }
            break;
    }
    
    contextMenu.style.display = 'none';
}

// 模态框操作
function showModal() {
    modal.style.display = 'flex';
    document.getElementById('cardTitle').focus();
}

function hideModal() {
    modal.style.display = 'none';
    document.getElementById('cardTitle').value = '';
    document.getElementById('cardContent').value = '';
}

function createCard(title, content, tags = []) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon">📝</div>
            <div class="card-actions">
                <button class="card-action-btn favorite">
                    <i class="far fa-star"></i>
                </button>
                <button class="card-action-btn more">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
        <div class="card-title">${title}</div>
        <div class="card-content">${content}</div>
        <div class="card-footer">
            <div class="card-tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-meta">
                <span class="date">${new Date().toLocaleDateString()}</span>
            </div>
        </div>
    `;
    
    // 添加拖拽事件监听器
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    // 添加右键菜单
    card.addEventListener('contextmenu', (e) => showContextMenu(e, card));
    
    return card;
}

// 事件监听器
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

addButton.addEventListener('click', showModal);
quickAdd.addEventListener('click', showModal);
closeBtn.addEventListener('click', hideModal);
cancelBtn.addEventListener('click', hideModal);

saveBtn.addEventListener('click', () => {
    const title = document.getElementById('cardTitle').value;
    const content = document.getElementById('cardContent').value;
    
    if (title && content) {
        const card = createCard(title, content);
        cardContainer.insertBefore(card, cardContainer.firstChild.nextSibling);
        hideModal();
    }
});

// 视图切换
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.view-btn.active').classList.remove('active');
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        cardContainer.className = `card-grid ${view}-view`;
    });
});

// 侧边栏项目点击
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.sidebar-item.active').classList.remove('active');
        item.classList.add('active');
    });
});

// 标签输入
const tagInput = document.querySelector('.tag-input input');
const tagSuggestions = document.querySelectorAll('.tag-suggestion');

tagSuggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
        const tagText = suggestion.textContent;
        // 这里可以添加标签到卡片
        console.log('添加标签:', tagText);
    });
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置默认主题
    document.body.classList.add('light-theme');
    
    // 添加拖拽区域事件监听
    cardContainer.addEventListener('dragover', handleDragOver);
}); 
