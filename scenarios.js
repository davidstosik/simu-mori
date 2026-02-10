// scenarios.js - Scenario management with localStorage

const STORAGE_KEY = 'realEstateScenarios';
const CURRENT_SCENARIO_KEY = 'currentScenario';

/**
 * Get all input values from the form
 * @returns {Object} All input values
 */
function getInputValues() {
    return {
        propertyPrice: parseFloat(document.getElementById('propertyPrice').value),
        initialRenovation: parseFloat(document.getElementById('initialRenovation').value),
        closingCosts: parseFloat(document.getElementById('closingCosts').value),
        loanAmount: parseFloat(document.getElementById('loanAmount').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        loanPeriod: parseInt(document.getElementById('loanPeriod').value),
        repaymentMethod: document.getElementById('repaymentMethod').value,
        annualRent: parseFloat(document.getElementById('annualRent').value),
        otherIncome: parseFloat(document.getElementById('otherIncome').value),
        occupancyRate: parseFloat(document.getElementById('occupancyRate').value),
        rentDeclineRate: parseFloat(document.getElementById('rentDeclineRate').value),
        managementFeesType: document.getElementById('managementFeesType').value,
        managementFeesPercent: parseFloat(document.getElementById('managementFeesPercent').value),
        managementFees: parseFloat(document.getElementById('managementFees').value),
        repairAdvertisingType: document.getElementById('repairAdvertisingType').value,
        repairAdvertisingPercent: parseFloat(document.getElementById('repairAdvertisingPercent').value),
        repairAdvertising: parseFloat(document.getElementById('repairAdvertising').value),
        runningCosts: parseFloat(document.getElementById('runningCosts').value),
        insurance: parseFloat(document.getElementById('insurance').value),
        buildingAge: parseInt(document.getElementById('buildingAge').value),
        buildingType: parseInt(document.getElementById('buildingType').value),
        buildingAssessedValue: parseFloat(document.getElementById('buildingAssessedValue').value),
        buildingDepreciationBase: parseFloat(document.getElementById('buildingDepreciationBase').value),
        depreciationPeriod: parseInt(document.getElementById('depreciationPeriod').value),
        landValue: parseFloat(document.getElementById('landValue').value),
        buildingValue: parseFloat(document.getElementById('buildingValue').value),
        taxRate: parseFloat(document.getElementById('taxRate').value),
        incomeDeduction: parseFloat(document.getElementById('incomeDeduction').value),
        projectionYears: parseInt(document.getElementById('projectionYears').value)
    };
}

/**
 * Set input values in the form
 * @param {Object} values - Input values to set
 */
function setInputValues(values) {
    document.getElementById('propertyPrice').value = values.propertyPrice;
    document.getElementById('initialRenovation').value = values.initialRenovation;
    document.getElementById('closingCosts').value = values.closingCosts;
    document.getElementById('loanAmount').value = values.loanAmount;
    document.getElementById('interestRate').value = values.interestRate;
    document.getElementById('loanPeriod').value = values.loanPeriod;
    document.getElementById('repaymentMethod').value = values.repaymentMethod;
    document.getElementById('annualRent').value = values.annualRent;
    document.getElementById('otherIncome').value = values.otherIncome;
    document.getElementById('occupancyRate').value = values.occupancyRate;
    document.getElementById('rentDeclineRate').value = values.rentDeclineRate;
    if (values.managementFeesType !== undefined) {
        document.getElementById('managementFeesType').value = values.managementFeesType;
        toggleExpenseType('management');
    }
    if (values.managementFeesPercent !== undefined) {
        document.getElementById('managementFeesPercent').value = values.managementFeesPercent;
    }
    document.getElementById('managementFees').value = values.managementFees || 120000;
    
    if (values.repairAdvertisingType !== undefined) {
        document.getElementById('repairAdvertisingType').value = values.repairAdvertisingType;
        toggleExpenseType('repair');
    }
    if (values.repairAdvertisingPercent !== undefined) {
        document.getElementById('repairAdvertisingPercent').value = values.repairAdvertisingPercent;
    }
    document.getElementById('repairAdvertising').value = values.repairAdvertising || 100000;
    document.getElementById('runningCosts').value = values.runningCosts;
    document.getElementById('insurance').value = values.insurance;
    if (values.buildingAge !== undefined) document.getElementById('buildingAge').value = values.buildingAge;
    if (values.buildingType !== undefined) document.getElementById('buildingType').value = values.buildingType;
    if (values.buildingAssessedValue !== undefined) document.getElementById('buildingAssessedValue').value = values.buildingAssessedValue;
    document.getElementById('buildingDepreciationBase').value = values.buildingDepreciationBase;
    document.getElementById('depreciationPeriod').value = values.depreciationPeriod;
    document.getElementById('landValue').value = values.landValue;
    document.getElementById('buildingValue').value = values.buildingValue;
    document.getElementById('taxRate').value = values.taxRate;
    document.getElementById('incomeDeduction').value = values.incomeDeduction;
    document.getElementById('projectionYears').value = values.projectionYears;
    
    // Recalculate depreciation if new fields exist
    if (values.buildingAge !== undefined || values.buildingType !== undefined || values.buildingAssessedValue !== undefined) {
        calculateDepreciation();
    }
}

/**
 * Save current scenario to localStorage
 */
function saveScenario() {
    const scenarioName = document.getElementById('scenarioName').value.trim();
    
    if (!scenarioName) {
        alert('シナリオ名を入力してください。');
        return;
    }
    
    const scenario = {
        name: scenarioName,
        inputs: getInputValues(),
        timestamp: new Date().toISOString()
    };
    
    // Get existing scenarios
    const scenarios = getSavedScenarios();
    
    // Update or add scenario
    const existingIndex = scenarios.findIndex(s => s.name === scenarioName);
    if (existingIndex >= 0) {
        if (confirm(`"${scenarioName}" は既に存在します。上書きしますか？`)) {
            scenarios[existingIndex] = scenario;
        } else {
            return;
        }
    } else {
        scenarios.push(scenario);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    localStorage.setItem(CURRENT_SCENARIO_KEY, scenarioName);
    
    alert(`シナリオ "${scenarioName}" を保存しました。`);
}

/**
 * Get all saved scenarios from localStorage
 * @returns {Array} Array of scenarios
 */
function getSavedScenarios() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

/**
 * Load a specific scenario
 * @param {string} scenarioName - Name of scenario to load
 */
function loadScenario(scenarioName) {
    const scenarios = getSavedScenarios();
    const scenario = scenarios.find(s => s.name === scenarioName);
    
    if (scenario) {
        document.getElementById('scenarioName').value = scenario.name;
        setInputValues(scenario.inputs);
        localStorage.setItem(CURRENT_SCENARIO_KEY, scenarioName);
        closeLoadModal();
        alert(`シナリオ "${scenarioName}" を読み込みました。`);
    }
}

/**
 * Delete a scenario
 * @param {string} scenarioName - Name of scenario to delete
 */
function deleteScenario(scenarioName) {
    if (!confirm(`シナリオ "${scenarioName}" を削除しますか？`)) {
        return;
    }
    
    let scenarios = getSavedScenarios();
    scenarios = scenarios.filter(s => s.name !== scenarioName);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    
    // Refresh the modal
    loadScenarioModal();
    alert(`シナリオ "${scenarioName}" を削除しました。`);
}

/**
 * Show load scenario modal
 */
function loadScenarioModal() {
    const scenarios = getSavedScenarios();
    const modal = document.getElementById('loadModal');
    const listDiv = document.getElementById('scenarioList');
    
    if (scenarios.length === 0) {
        listDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">保存されたシナリオがありません。</p>';
    } else {
        listDiv.innerHTML = scenarios.map(scenario => {
            const date = new Date(scenario.timestamp).toLocaleString('ja-JP');
            return `
                <div class="scenario-item">
                    <button class="delete-scenario" onclick="deleteScenario('${scenario.name}'); event.stopPropagation();">削除</button>
                    <div class="scenario-item-name" onclick="loadScenario('${scenario.name}')">${scenario.name}</div>
                    <div class="scenario-item-date" onclick="loadScenario('${scenario.name}')">${date}</div>
                </div>
            `;
        }).join('');
    }
    
    modal.style.display = 'flex';
}

/**
 * Close load scenario modal
 */
function closeLoadModal() {
    document.getElementById('loadModal').style.display = 'none';
}

/**
 * Create new scenario with default values
 */
function newScenario() {
    if (confirm('新しいシナリオを作成しますか？現在の入力内容はリセットされます。')) {
        document.getElementById('scenarioName').value = '新規シナリオ';
        
        // Load default example values
        loadExampleScenario();
        
        // Clear results
        document.getElementById('results').style.display = 'none';
    }
}

/**
 * Compare multiple scenarios
 */
function compareScenarios() {
    const scenarios = getSavedScenarios();
    
    if (scenarios.length < 2) {
        alert('比較するには2つ以上のシナリオを保存してください。');
        return;
    }
    
    const modal = document.getElementById('compareModal');
    const content = document.getElementById('compareContent');
    
    // Calculate all scenarios
    const results = scenarios.map(scenario => {
        const calc = performCalculation(scenario.inputs);
        return {
            name: scenario.name,
            metrics: calc.metrics
        };
    });
    
    // Create comparison table
    let html = '<table class="comparison-table"><thead><tr>';
    html += '<th>指標 (Metric)</th>';
    results.forEach(r => {
        html += `<th>${r.name}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Add metrics
    const metrics = [
        { key: 'grossYield', label: '表面利回り (Gross Yield)', format: 'percent' },
        { key: 'grossYieldWithCosts', label: '初期費用込み表面利回り', format: 'percent' },
        { key: 'repaymentRatio', label: '返済比率 (Repayment Ratio)', format: 'percent' },
        { key: 'firstYearNetProfit', label: '初年度純利益', format: 'currency' },
        { key: 'firstYearCashFlow', label: '初年度キャッシュフロー', format: 'currency' },
        { key: 'finalCumulativeProfit', label: '最終累積純利益', format: 'currency' },
        { key: 'finalCumulativeCashFlow', label: '最終累積C/F', format: 'currency' },
        { key: 'fiveYearPayback', label: '5年間回収額', format: 'currency' },
        { key: 'fiveYearPaybackAchieved', label: '5年回収達成', format: 'boolean' }
    ];
    
    metrics.forEach(metric => {
        html += `<tr><td>${metric.label}</td>`;
        results.forEach(r => {
            const value = r.metrics[metric.key];
            let formatted;
            
            if (metric.format === 'percent') {
                formatted = formatPercent(value);
            } else if (metric.format === 'currency') {
                formatted = formatCurrency(value) + ' 円';
            } else if (metric.format === 'boolean') {
                formatted = value ? '✓ 達成' : '✗ 未達成';
            } else {
                formatted = value;
            }
            
            html += `<td>${formatted}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    content.innerHTML = html;
    modal.style.display = 'flex';
}

/**
 * Close compare modal
 */
function closeCompareModal() {
    document.getElementById('compareModal').style.display = 'none';
}

/**
 * Load example scenario with realistic Japanese property numbers
 */
function loadExampleScenario() {
    const example = {
        propertyPrice: 30000000,
        initialRenovation: 500000,
        closingCosts: 900000,
        loanAmount: 24000000,
        interestRate: 2.5,
        loanPeriod: 25,
        repaymentMethod: 'equal-payment',
        annualRent: 2400000,
        otherIncome: 0,
        occupancyRate: 95,
        rentDeclineRate: 0.5,
        managementFeesType: 'percent',
        managementFeesPercent: 5,
        managementFees: 120000,
        repairAdvertisingType: 'percent',
        repairAdvertisingPercent: 4,
        repairAdvertising: 100000,
        runningCosts: 15000,
        insurance: 30000,
        buildingAge: 10,
        buildingType: 22,
        buildingAssessedValue: 20000000,
        buildingDepreciationBase: 1428571,
        depreciationPeriod: 14,
        landValue: 10000000,
        buildingValue: 18000000,
        taxRate: 20,
        incomeDeduction: 0,
        projectionYears: 10
    };
    
    setInputValues(example);
}

// Load example scenario on page load
window.addEventListener('DOMContentLoaded', function() {
    // Check if there's a current scenario
    const currentScenario = localStorage.getItem(CURRENT_SCENARIO_KEY);
    
    if (currentScenario) {
        const scenarios = getSavedScenarios();
        const scenario = scenarios.find(s => s.name === currentScenario);
        if (scenario) {
            document.getElementById('scenarioName').value = scenario.name;
            setInputValues(scenario.inputs);
            calculateDepreciation(); // Ensure depreciation is calculated
            return;
        }
    }
    
    // Otherwise load example
    loadExampleScenario();
    calculateDepreciation(); // Ensure depreciation is calculated
});
