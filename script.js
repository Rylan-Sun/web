// 主题切换功能
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// 搜索功能
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const blocks = document.querySelectorAll('.block');
    
    blocks.forEach(block => {
        const content = block.textContent.toLowerCase();
        if (content.includes(searchTerm)) {
            block.style.display = 'block';
        } else {
            block.style.display = 'none';
        }
    });
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置默认主题
    document.body.classList.add('light-theme');
    
    // 为所有可点击元素添加悬停效果
    const clickableElements = document.querySelectorAll('.nav-item, .action-btn');
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-1px)';
            element.style.transition = 'transform 0.2s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
}); 
