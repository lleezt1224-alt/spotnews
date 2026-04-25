// ===== 導覽欄活跃效果 =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-links a').forEach(l => l.style.borderBottomColor = 'transparent');
        this.style.borderBottomColor = 'var(--accent-color)';
    });
});

// 页面滚动时更新导航
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.borderBottomColor = 'transparent';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.borderBottomColor = 'var(--accent-color)';
        }
    });
});

// ===== 數據卡片交互 =====
const dataCards = document.querySelectorAll('.data-card');

dataCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    card.addEventListener('click', function() {
        const value = this.querySelector('.data-value').textContent;
        const title = this.querySelector('.data-title').textContent;
        showNotification(`${title}: ${value}`);
    });
});

// ===== 圖表懶加載 =====
const chartImages = document.querySelectorAll('.chart-image');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.animation = 'fadeInUp 0.6s ease-out';
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

chartImages.forEach(img => {
    imageObserver.observe(img);
});

// ===== 內容區塊進入視圖動畫 =====
const contentBlocks = document.querySelectorAll('.content-block');

const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
            contentObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

contentBlocks.forEach(block => {
    block.style.opacity = '0';
    contentObserver.observe(block);
});

// ===== 回到頂部按鈕 =====
function createScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

createScrollTopButton();

// ===== 通知訊息 =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== 添加滑動動畫 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .content-block {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ===== 統計數字動畫 =====
function animateStatNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const numericValue = parseFloat(finalValue);
                let currentValue = 0;
                const increment = numericValue / 50;

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = currentValue.toFixed(1) + (isPercentage ? '%' : '');
                    }
                }, 30);

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        observer.observe(stat);
    });
}

animateStatNumbers();

// ===== 品類銷售指數圖表 =====
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categories = [
        '電器及其他未分類耐用消費品',
        '耐用消費品',
        '珠寶首飾、鐘鍊及名貴禮物',
        '汽車及汽車零件',
        '傢具及固定裝置',
        '酒類飲品及煙草',
        '眼鏡店',
        '服裝',
        '所有零售商別',
        '書籍、文具及印品',
        '其他未分類消費品',
        '其他消費品',
        '美物及化妝品',
        '衣物、鞋類及有關製品',
        '超級市場',
        '新鮮蔬菜',
        '新鮮或急凍魚類及禽畜肉類',
        '超級市場及百貨公司內的超級市場部門 (1)',
        '中藥',
        '食品、酒類飲品及煙草 (超級市場除外)',
        '百貨公司',
        '燃料',
        '麵包、糕餅、糖果及餅乾',
        '其他未分類食品',
        '鞋類、有關製品及其他衣物配件'
    ];
    
    const values = [38.7, 31.1, 30.5, 18.5, 16.4, 16.2, 15.7, 12.3, 10.8, 8.6, 5.2, 2.1, -0.8, -2.3, -5.1, -5.6, -7.8, -9.2, -10.5, -11.1, -11.3, -17.5, -25.3, -28.4, -19.9];
    
    // 创建颜色数组 - 使用红绿渐变色
    const getColor = (value) => {
        const minValue = -19.9;
        const maxValue = 38.7;
        const range = maxValue - minValue;
        const normalized = (value - minValue) / range;
        
        // 从红色 (#d32f2f) 到绿色 (#7cb342)
        if (normalized < 0.5) {
            // 红色到白色
            const r = Math.round(211 + (255 - 211) * (normalized * 2));
            const g = Math.round(47 + (255 - 47) * (normalized * 2));
            const b = Math.round(47 + (255 - 47) * (normalized * 2));
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // 白色到绿色
            const r = Math.round(255 - (255 - 124) * ((normalized - 0.5) * 2));
            const g = Math.round(255 - (255 - 179) * ((normalized - 0.5) * 2));
            const b = Math.round(255 - (255 - 66) * ((normalized - 0.5) * 2));
            return `rgb(${r}, ${g}, ${b})`;
        }
    };
    
    const colors = values.map(v => getColor(v));
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: '按年變動百分率(%)',
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 0,
                borderRadius: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x.toFixed(2) + '%';
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 10,
                    borderRadius: 4
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 11
                        },
                        color: '#666'
                    },
                    grid: {
                        drawBorder: true,
                        color: '#e0e0e0',
                        lineWidth: 0.5
                    },
                    min: -40,
                    max: 80
                },
                y: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#333'
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// ===== 頁面加載完成後的初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('數據新聞網站已加載完成');
    
    // 初始化圖表
    initializeCategoryChart();
    
    // 添加頁面加載動畫
    document.body.style.animation = 'fadeIn 0.6s ease-out';
});

// ===== 添加淡入動畫 =====
const stylesheet = document.createElement('style');
stylesheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    body {
        opacity: 1;
    }
`;
document.head.appendChild(stylesheet);

// ===== 圖表點擊放大功能 =====
chartImages.forEach(img => {
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease-out;
        `;

        const largeImg = document.createElement('img');
        largeImg.src = this.src;
        largeImg.alt = this.alt;
        largeImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            cursor: pointer;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#f0f0f0';
            this.style.transform = 'scale(1.1)';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'white';
            this.style.transform = 'scale(1)';
        });

        function closeModal() {
            modal.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => modal.remove(), 300);
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        modal.appendChild(largeImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    });
});

// 添加淡出動畫
const sheet = document.createElement('style');
sheet.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(sheet);
