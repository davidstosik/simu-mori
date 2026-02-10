// ui.js - UI interactions and rendering

/**
 * Main calculate function triggered by button
 */
function calculate() {
    // Get input values
    const inputs = getInputValues();
    
    // Validate inputs
    if (!validateInputs(inputs)) {
        return;
    }
    
    // Perform calculation
    const results = performCalculation(inputs);
    
    // Store results globally for export
    window.currentResults = results;
    window.currentInputs = inputs;
    
    // Display results
    displayResults(results);
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Smooth scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Validate all inputs
 * @param {Object} inputs - Input values to validate
 * @returns {boolean} True if valid
 */
function validateInputs(inputs) {
    const errors = [];
    
    if (!inputs.propertyPrice || inputs.propertyPrice <= 0) errors.push('物件価格は正の数である必要があります。');
    if (inputs.loanAmount < 0) errors.push('借入額は0以上である必要があります。');
    if (inputs.interestRate < 0) errors.push('金利は0以上である必要があります。');
    if (inputs.loanPeriod < 0) errors.push('借入期間は0以上である必要があります。');
    if (inputs.occupancyRate < 0 || inputs.occupancyRate > 100) errors.push('入居率は0-100の範囲である必要があります。');
    if (inputs.projectionYears < 1) errors.push('予測年数は1年以上である必要があります。');
    
    // Check for NaN in key fields
    const numericFields = ['propertyPrice', 'annualRent', 'occupancyRate'];
    numericFields.forEach(field => {
        if (isNaN(inputs[field])) {
            errors.push(`${field} が無効な値です。数値を入力してください。`);
        }
    });
    
    if (errors.length > 0) {
        alert('入力エラー:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

/**
 * Display all results
 * @param {Object} results - Calculation results
 */
function displayResults(results) {
    displayKeyMetrics(results.metrics);
    displayPaybackAnalysis(results.metrics);
    displayCashFlowChart(results.cashFlows);
    displayIncomeTable(results.incomeStatements);
    displayCashFlowTable(results.cashFlows);
}

/**
 * Display key metrics
 * @param {Object} metrics - Metrics object
 */
function displayKeyMetrics(metrics) {
    const container = document.getElementById('keyMetrics');
    
    const metricsHtml = `
        <div class="metric-card">
            <div class="metric-label">表面利回り (Gross Yield)</div>
            <div class="metric-value">${formatPercent(metrics.grossYield)}</div>
        </div>
        <div class="metric-card">
            <div class="metric-label">初期費用込み表面利回り</div>
            <div class="metric-value">${formatPercent(metrics.grossYieldWithCosts)}</div>
        </div>
        <div class="metric-card">
            <div class="metric-label">返済比率 (Repayment Ratio)</div>
            <div class="metric-value">${formatPercent(metrics.repaymentRatio)}</div>
        </div>
        <div class="metric-card">
            <div class="metric-label">初年度純利益</div>
            <div class="metric-value ${metrics.firstYearNetProfit >= 0 ? 'positive' : 'negative'}">
                ${formatCurrency(metrics.firstYearNetProfit)} 円
            </div>
        </div>
        <div class="metric-card">
            <div class="metric-label">初年度キャッシュフロー</div>
            <div class="metric-value ${metrics.firstYearCashFlow >= 0 ? 'positive' : 'negative'}">
                ${formatCurrency(metrics.firstYearCashFlow)} 円
            </div>
        </div>
        <div class="metric-card">
            <div class="metric-label">最終累積純利益</div>
            <div class="metric-value ${metrics.finalCumulativeProfit >= 0 ? 'positive' : 'negative'}">
                ${formatCurrency(metrics.finalCumulativeProfit)} 円
            </div>
        </div>
        <div class="metric-card">
            <div class="metric-label">最終累積キャッシュフロー</div>
            <div class="metric-value ${metrics.finalCumulativeCashFlow >= 0 ? 'positive' : 'negative'}">
                ${formatCurrency(metrics.finalCumulativeCashFlow)} 円
            </div>
        </div>
    `;
    
    container.innerHTML = metricsHtml;
}

/**
 * Display 5-year payback analysis
 * @param {Object} metrics - Metrics object
 */
function displayPaybackAnalysis(metrics) {
    const container = document.getElementById('paybackAnalysis');
    
    const resultClass = metrics.fiveYearPaybackAchieved ? 'success' : 'failure';
    const resultText = metrics.fiveYearPaybackAchieved ? '✓ 達成' : '✗ 未達成';
    
    const html = `
        <h3>5年間回収分析 (5-Year Payback Analysis)</h3>
        <p><strong>初期投資額:</strong> ${formatCurrency(metrics.initialInvestment)} 円</p>
        <p><strong>2〜5年目の累積キャッシュフロー:</strong> ${formatCurrency(metrics.fiveYearPayback)} 円</p>
        ${metrics.paybackYears > 0 ? `<p><strong>回収年数 (2年目C/Fベース):</strong> ${metrics.paybackYears.toFixed(1)} 年</p>` : ''}
        <div class="payback-result ${resultClass}">
            <strong>回収状況:</strong> ${resultText}
            ${metrics.fiveYearPaybackAchieved ? 
                `<br>5年間で初期投資を回収できます。` : 
                (metrics.paybackYears > 0 ? 
                    `<br>2年目の年間キャッシュフローで計算すると、初期投資の回収には約 ${metrics.paybackYears.toFixed(1)} 年かかります。` :
                    `<br>キャッシュフローがマイナスのため、回収できません。`)
            }
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Display income statement table
 * @param {Array} statements - Income statements array
 */
function displayIncomeTable(statements) {
    const table = document.getElementById('incomeTable');
    
    let html = '<thead><tr><th>項目</th>';
    statements.forEach(s => {
        html += `<th>${s.year}年目</th>`;
    });
    html += '</tr></thead><tbody>';
    
    const rows = [
        { label: '想定賃料収入', key: 'rentIncome', class: '' },
        { label: 'その他収入', key: 'otherIncome', class: '' },
        { label: '売上合計', key: 'totalRevenue', class: 'row-subtotal' },
        { label: '管理費用', key: 'managementFees', class: '' },
        { label: '修繕費・広告費等', key: 'repairAdvertising', class: '' },
        { label: 'ランニング費用', key: 'runningCosts', class: '' },
        { label: '火災・地震保険料', key: 'insurance', class: '' },
        { label: '固定資産・都市計画税', key: 'propertyTax', class: '' },
        { label: '購入時諸費用', key: 'closingCosts', class: '' },
        { label: '支払金利', key: 'interestPayment', class: '' },
        { label: '減価償却費', key: 'depreciation', class: '' },
        { label: '費用合計', key: 'totalExpenses', class: 'row-subtotal' },
        { label: '控除・課税前所得', key: 'preTaxIncome', class: 'row-highlight' },
        { label: '所得控除', key: 'incomeDeduction', class: '' },
        { label: '課税所得', key: 'taxableIncome', class: '' },
        { label: '所得税額', key: 'incomeTax', class: '' },
        { label: '当期純利益', key: 'netProfit', class: 'row-total' },
        { label: '累積純利益', key: 'cumulativeNetProfit', class: 'row-total' }
    ];
    
    rows.forEach(row => {
        html += `<tr class="${row.class}"><td>${row.label}</td>`;
        statements.forEach(s => {
            html += `<td>${formatCurrency(s[row.key])}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

/**
 * Display cash flow table
 * @param {Array} cashFlows - Cash flows array
 */
function displayCashFlowTable(cashFlows) {
    const table = document.getElementById('cashflowTable');
    
    let html = '<thead><tr><th>項目</th>';
    cashFlows.forEach(cf => {
        html += `<th>${cf.year}年目</th>`;
    });
    html += '</tr></thead><tbody>';
    
    const rows = [
        { label: '想定家賃収入', key: 'rentIncome', class: '' },
        { label: 'その他収入', key: 'otherIncome', class: '' },
        { label: '収入合計', key: 'totalIncome', class: 'row-subtotal' },
        { label: '管理費用', key: 'managementFees', class: '' },
        { label: '修繕費・広告費等', key: 'repairAdvertising', class: '' },
        { label: 'ランニング費用', key: 'runningCosts', class: '' },
        { label: '火災・地震保険料', key: 'insurance', class: '' },
        { label: '固定資産・都市計画税', key: 'propertyTax', class: '' },
        { label: '購入時諸費用', key: 'closingCosts', class: '' },
        { label: '元本返済', key: 'principalRepayment', class: '' },
        { label: '支払金利', key: 'interestPayment', class: '' },
        { label: '初期リフォーム費用', key: 'renovationCosts', class: '' },
        { label: '所得税額', key: 'incomeTax', class: '' },
        { label: '支出合計', key: 'totalExpenses', class: 'row-subtotal' },
        { label: '年間手残りC/F', key: 'annualNetCashFlow', class: 'row-total' },
        { label: '累積C/F', key: 'cumulativeCashFlow', class: 'row-total' },
        { label: '残存借入額', key: 'remainingLoan', class: 'row-highlight' }
    ];
    
    rows.forEach(row => {
        html += `<tr class="${row.class}"><td>${row.label}</td>`;
        cashFlows.forEach(cf => {
            html += `<td>${formatCurrency(cf[row.key])}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

/**
 * Export results to CSV
 * @param {string} type - 'income', 'cashflow', or 'all'
 */
function exportToCSV(type) {
    if (!window.currentResults) {
        alert('計算を実行してから出力してください。');
        return;
    }
    
    let csvContent = '';
    const BOM = '\uFEFF'; // UTF-8 BOM for Excel
    
    if (type === 'income' || type === 'all') {
        csvContent += generateIncomeCSV();
    }
    
    if (type === 'all') {
        csvContent += '\n\n';
    }
    
    if (type === 'cashflow' || type === 'all') {
        csvContent += generateCashFlowCSV();
    }
    
    // Create download link
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const scenarioName = document.getElementById('scenarioName').value || 'シナリオ';
    const timestamp = new Date().toISOString().slice(0, 10);
    let filename = `${scenarioName}_${timestamp}`;
    
    if (type === 'income') filename += '_損益計算書.csv';
    else if (type === 'cashflow') filename += '_キャッシュフロー計算書.csv';
    else filename += '_全データ.csv';
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generate income statement CSV
 * @returns {string} CSV content
 */
function generateIncomeCSV() {
    const statements = window.currentResults.incomeStatements;
    let csv = '損益計算書 (Income Statement)\n';
    
    // Header
    csv += '項目';
    statements.forEach(s => {
        csv += `,${s.year}年目`;
    });
    csv += '\n';
    
    const rows = [
        { label: '想定賃料収入', key: 'rentIncome' },
        { label: 'その他収入', key: 'otherIncome' },
        { label: '売上合計', key: 'totalRevenue' },
        { label: '管理費用', key: 'managementFees' },
        { label: '修繕費・広告費等', key: 'repairAdvertising' },
        { label: 'ランニング費用', key: 'runningCosts' },
        { label: '火災・地震保険料', key: 'insurance' },
        { label: '固定資産・都市計画税', key: 'propertyTax' },
        { label: '購入時諸費用', key: 'closingCosts' },
        { label: '支払金利', key: 'interestPayment' },
        { label: '減価償却費', key: 'depreciation' },
        { label: '費用合計', key: 'totalExpenses' },
        { label: '控除・課税前所得', key: 'preTaxIncome' },
        { label: '所得控除', key: 'incomeDeduction' },
        { label: '課税所得', key: 'taxableIncome' },
        { label: '所得税額', key: 'incomeTax' },
        { label: '当期純利益', key: 'netProfit' },
        { label: '累積純利益', key: 'cumulativeNetProfit' }
    ];
    
    rows.forEach(row => {
        csv += row.label;
        statements.forEach(s => {
            csv += `,${Math.round(s[row.key])}`;
        });
        csv += '\n';
    });
    
    return csv;
}

/**
 * Generate cash flow CSV
 * @returns {string} CSV content
 */
function generateCashFlowCSV() {
    const cashFlows = window.currentResults.cashFlows;
    let csv = 'キャッシュフロー計算書 (Cash Flow Statement)\n';
    
    // Header
    csv += '項目';
    cashFlows.forEach(cf => {
        csv += `,${cf.year}年目`;
    });
    csv += '\n';
    
    const rows = [
        { label: '想定家賃収入', key: 'rentIncome' },
        { label: 'その他収入', key: 'otherIncome' },
        { label: '収入合計', key: 'totalIncome' },
        { label: '管理費用', key: 'managementFees' },
        { label: '修繕費・広告費等', key: 'repairAdvertising' },
        { label: 'ランニング費用', key: 'runningCosts' },
        { label: '火災・地震保険料', key: 'insurance' },
        { label: '固定資産・都市計画税', key: 'propertyTax' },
        { label: '購入時諸費用', key: 'closingCosts' },
        { label: '元本返済', key: 'principalRepayment' },
        { label: '支払金利', key: 'interestPayment' },
        { label: '初期リフォーム費用', key: 'renovationCosts' },
        { label: '所得税額', key: 'incomeTax' },
        { label: '支出合計', key: 'totalExpenses' },
        { label: '年間手残りC/F', key: 'annualNetCashFlow' },
        { label: '累積C/F', key: 'cumulativeCashFlow' },
        { label: '残存借入額', key: 'remainingLoan' }
    ];
    
    rows.forEach(row => {
        csv += row.label;
        cashFlows.forEach(cf => {
            csv += `,${Math.round(cf[row.key])}`;
        });
        csv += '\n';
    });
    
    return csv;
}

/**
 * Display cumulative cash flow chart
 * @param {Array} cashFlows - Cash flows array
 */
function displayCashFlowChart(cashFlows) {
    const canvas = document.getElementById('cashflowChart');
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.cashFlowChartInstance) {
        window.cashFlowChartInstance.destroy();
    }
    
    // Prepare data and filter out NaN values
    const years = cashFlows.map(cf => `${cf.year}年目`);
    const cumulativeCF = cashFlows.map(cf => {
        const value = cf.cumulativeCashFlow;
        return (isNaN(value) || !isFinite(value)) ? 0 : value;
    });
    
    // Determine color based on positive/negative
    const pointColors = cumulativeCF.map(value => value >= 0 ? '#28a745' : '#dc3545');
    
    // Create chart
    window.cashFlowChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: '累積キャッシュフロー (円)',
                data: cumulativeCF,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('ja-JP').format(context.parsed.y) + ' 円';
                            return label;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('ja-JP', {
                                notation: 'compact',
                                compactDisplay: 'short'
                            }).format(value) + '円';
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}
