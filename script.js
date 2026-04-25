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
        '其他食品',
        '鞋類、有關製品及其他衣物配件',
        '燃料',
        '面包、糕餅、糖果及餅乾',
        '其他食品',
        '食品、酒精飲品及煙草（超級市場除外）',
        '百貨公司',
        '中藥',
        '新鮮或急凍魚類及禽畜肉類',
        '新鮮蔬菜',
        '超級市場'
    ];
    
    const values = [80, 62, 50, 25, 21, 18, 15, 12, 10, 8, 5, 2, -5, -15, -18, -20, -22, -25, -28, -10, -10, -11, -8, -5, -2];
    
    const colors = values.map(v => v >= 0 ? '#7cb342' : '#ef5350');
    
    const chart = new Chart(ctx, {
        type: 'barH',
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
                            return context.parsed.x + '%';
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.7)',
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
                    min: -50,
                    max: 100
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

// ===== 零售銷售趨勢圖表 =====
function initializeRetailTrendsChart() {
    const ctx = document.getElementById('retailTrendsChart');
    if (!ctx) return;
    
    // 時間標籤
    const months = [
        '2020年1月', '2020年2月', '2020年3月', '2020年4月', '2020年5月', '2020年6月', 
        '2020年7月', '2020年8月', '2020年9月', '2020年10月', '2020年11月', '2020年12月',
        '2021年1月', '2021年2月', '2021年3月', '2021年4月', '2021年5月', '2021年6月',
        '2021年7月', '2021年8月', '2021年9月', '2021年10月', '2021年11月', '2021年12月',
        '2022年1月', '2022年2月', '2022年3月', '2022年4月', '2022年5月', '2022年6月',
        '2022年7月', '2022年8月', '2022年9月', '2022年10月', '2022年11月', '2022年12月',
        '2023年1月', '2023年2月', '2023年3月', '2023年4月', '2023年5月', '2023年6月',
        '2023年7月', '2023年8月', '2023年9月', '2023年10月', '2023年11月', '2023年12月',
        '2024年1月', '2024年2月', '2024年3月', '2024年4月', '2024年5月', '2024年6月',
        '2024年7月', '2024年8月', '2024年9月', '2024年10月', '2024年11月', '2024年12月',
        '2025年1月', '2025年2月', '2025年3月', '2025年4月', '2025年5月', '2025年6月',
        '2025年7月', '2025年8月', '2025年9月', '2025年10月', '2025年11月', '2025年12月',
        '2026年1月', '2026年2月'
    ];

    // 價值指數
    const valueIndex = [
        135.1, 81.4, 82.3, 86.3, 95.9, 95.0, 94.8, 91.5, 93.4, 98.2, 102.8, 112.3,
        116.6, 105.7, 98.9, 96.7, 105.9, 100.5, 97.4, 102.4, 100.3, 110.1, 110.1, 119.2,
        121.2, 90.3, 85.3, 108.0, 104.2, 99.2, 101.4, 102.2, 100.7, 114.5, 105.6, 120.6,
        129.5, 118.6, 120.0, 124.1, 123.5, 118.5, 118.3, 116.2, 113.7, 121.2, 122.4, 130.1,
        130.8, 120.9, 111.6, 105.9, 109.5, 107.0, 104.4, 104.6, 105.9, 117.8, 113.4, 117.6,
        126.7, 105.2, 107.8, 103.4, 112.1, 107.8, 106.2, 108.7, 112.2, 126.0, 120.8, 125.4,
        133.7, 125.5
    ];

    // 按年變動百分比
    const yoyChange = [
        -21.5, -44.0, -42.1, -36.1, -32.9, -24.7, -23.1, -13.1, -12.8, -8.7, -4.1, -13.3,
        -13.7, 30.0, 20.2, 12.1, 10.4, 5.8, 2.8, 11.9, 7.4, 12.1, 7.1, 6.1,
        4.0, -14.6, -13.8, 11.7, -1.6, -1.3, 4.1, -0.2, 0.3, 4.0, -4.1, 1.2,
        6.9, 31.3, 40.8, 14.9, 18.5, 19.5, 16.7, 13.7, 13.0, 5.8, 15.9, 7.8,
        0.9, 1.9, -7.0, -14.7, -11.4, -9.7, -11.7, -10.0, -6.9, -2.8, -7.3, -9.6,
        -3.1, -13.0, -3.5, -2.3, 2.4, 0.7, 1.8, 3.9, 6.0, 6.9, 6.5, 6.6,
        5.5, 19.3
    ];

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: '零售業銷貨價值指數',
                    data: valueIndex,
                    backgroundColor: '#4a9d6f',
                    borderColor: '#2d5a3d',
                    borderWidth: 1,
                    borderRadius: 3,
                    order: 2,
                    yAxisID: 'y'
                },
                {
                    label: '按年變動百分率 (%)',
                    data: yoyChange,
                    borderColor: '#d63031',
                    backgroundColor: 'rgba(214, 48, 49, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#d63031',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    order: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 600
                        },
                        color: '#2d5a3d'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(45, 90, 61, 0.9)',
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    borderRadius: 6,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return '價值指數: ' + context.parsed.y.toFixed(1);
                            } else {
                                return '按年變動: ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 10
                        },
                        color: '#666'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '價值指數',
                        color: '#2d5a3d',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        color: '#2d5a3d',
                        font: { weight: '600' }
                    },
                    grid: {
                        color: '#e9ecef',
                        lineWidth: 0.5
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '按年變動百分率 (%)',
                        color: '#d63031',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        color: '#d63031',
                        font: { weight: '600' },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        drawOnChartArea: false
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
    initializeRetailTrendsChart();
    
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
