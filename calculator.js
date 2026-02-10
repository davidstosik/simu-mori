// calculator.js - Core calculation logic

/**
 * Calculate loan amortization schedule
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Loan period in years
 * @param {string} method - 'equal-payment' or 'equal-principal'
 * @returns {Array} Array of yearly payment details
 */
function calculateLoanSchedule(principal, annualRate, years, method) {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const schedule = [];
    let remainingBalance = principal;

    if (method === 'equal-payment') {
        // 元利均等返済 (Equal Payment)
        // Monthly payment = P × r × (1 + r)^n / ((1 + r)^n - 1)
        const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                              (Math.pow(1 + monthlyRate, totalMonths) - 1);

        for (let year = 1; year <= years; year++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;
            let yearStartBalance = remainingBalance;

            for (let month = 1; month <= 12; month++) {
                const interestPayment = remainingBalance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                
                yearlyInterest += interestPayment;
                yearlyPrincipal += principalPayment;
                remainingBalance -= principalPayment;
            }

            schedule.push({
                year: year,
                payment: monthlyPayment * 12,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                remainingBalance: Math.max(0, remainingBalance),
                startBalance: yearStartBalance
            });
        }
    } else {
        // 元金均等返済 (Equal Principal)
        // Principal payment = P / n (constant)
        const monthlyPrincipal = principal / totalMonths;

        for (let year = 1; year <= years; year++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;
            let yearStartBalance = remainingBalance;

            for (let month = 1; month <= 12; month++) {
                const interestPayment = remainingBalance * monthlyRate;
                
                yearlyInterest += interestPayment;
                yearlyPrincipal += monthlyPrincipal;
                remainingBalance -= monthlyPrincipal;
            }

            schedule.push({
                year: year,
                payment: yearlyPrincipal + yearlyInterest,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                remainingBalance: Math.max(0, remainingBalance),
                startBalance: yearStartBalance
            });
        }
    }

    return schedule;
}

/**
 * Calculate annual depreciation
 * @param {number} buildingValue - Building value
 * @param {number} years - Depreciation period
 * @returns {number} Annual depreciation amount
 */
function calculateDepreciation(buildingValue, years) {
    // Straight-line depreciation
    return buildingValue / years;
}

/**
 * Calculate fixed asset tax
 * @param {number} landValue - Land assessed value
 * @param {number} buildingValue - Building assessed value
 * @returns {number} Annual property tax
 */
function calculatePropertyTax(landValue, buildingValue) {
    // Fixed asset tax: 1.4%
    // City planning tax: 0.3%
    // Total: 1.7%
    return (landValue + buildingValue) * 0.017;
}

/**
 * Calculate income tax
 * @param {number} taxableIncome - Taxable income
 * @param {number} taxRate - Tax rate (%)
 * @returns {number} Income tax amount
 */
function calculateIncomeTax(taxableIncome, taxRate) {
    if (taxableIncome <= 0) return 0;
    return taxableIncome * (taxRate / 100);
}

/**
 * Main calculation function
 * @param {Object} inputs - All input parameters
 * @returns {Object} Calculation results
 */
function performCalculation(inputs) {
    const {
        propertyPrice,
        initialRenovation,
        closingCosts,
        loanAmount,
        interestRate,
        loanPeriod,
        repaymentMethod,
        annualRent,
        otherIncome,
        occupancyRate,
        rentDeclineRate,
        managementFees,
        repairAdvertising,
        runningCosts,
        insurance,
        buildingDepreciationBase,
        depreciationPeriod,
        landValue,
        buildingValue,
        taxRate,
        incomeDeduction,
        projectionYears
    } = inputs;

    // Calculate loan schedule
    const loanSchedule = calculateLoanSchedule(loanAmount, interestRate, loanPeriod, repaymentMethod);
    
    // Annual depreciation
    const annualDepreciation = calculateDepreciation(buildingDepreciationBase, depreciationPeriod);
    
    // Property tax
    const propertyTax = calculatePropertyTax(landValue, buildingValue);
    
    // Initialize results arrays
    const incomeStatements = [];
    const cashFlows = [];
    
    // Year-by-year calculation
    let cumulativeNetProfit = 0;
    let cumulativeCashFlow = -propertyPrice - initialRenovation; // Initial investment
    
    for (let year = 1; year <= projectionYears; year++) {
        // Rent decline over years
        const rentMultiplier = Math.pow(1 - rentDeclineRate / 100, year - 1);
        const currentAnnualRent = annualRent * rentMultiplier * (occupancyRate / 100);
        
        // Income Statement Calculation
        const totalRevenue = currentAnnualRent + otherIncome;
        
        // Get loan payment for this year
        const loanPayment = year <= loanPeriod ? loanSchedule[year - 1] : { interest: 0, principal: 0, remainingBalance: 0 };
        
        // Depreciation (only during depreciation period)
        const depreciation = year <= depreciationPeriod ? annualDepreciation : 0;
        
        // Expenses
        const yearlyRunningCosts = runningCosts * 12;
        const yearlyClosingCosts = year === 1 ? closingCosts : 0;
        
        const totalExpenses = managementFees + repairAdvertising + yearlyRunningCosts + 
                             insurance + propertyTax + yearlyClosingCosts + 
                             loanPayment.interest + depreciation;
        
        // Pre-tax income
        const preTaxIncome = totalRevenue - totalExpenses;
        
        // Taxable income (after deductions)
        const taxableIncome = Math.max(0, preTaxIncome - incomeDeduction);
        
        // Income tax
        const incomeTax = calculateIncomeTax(taxableIncome, taxRate);
        
        // Net profit
        const netProfit = preTaxIncome - incomeTax;
        cumulativeNetProfit += netProfit;
        
        // Income Statement
        incomeStatements.push({
            year: year,
            rentIncome: currentAnnualRent,
            otherIncome: otherIncome,
            totalRevenue: totalRevenue,
            managementFees: managementFees,
            repairAdvertising: repairAdvertising,
            runningCosts: yearlyRunningCosts,
            insurance: insurance,
            propertyTax: propertyTax,
            closingCosts: yearlyClosingCosts,
            interestPayment: loanPayment.interest,
            depreciation: depreciation,
            totalExpenses: totalExpenses,
            preTaxIncome: preTaxIncome,
            incomeDeduction: incomeDeduction,
            taxableIncome: taxableIncome,
            incomeTax: incomeTax,
            netProfit: netProfit,
            cumulativeNetProfit: cumulativeNetProfit
        });
        
        // Cash Flow Calculation
        const yearlyRenovation = year === 1 ? initialRenovation : 0;
        
        const cashExpenses = managementFees + repairAdvertising + yearlyRunningCosts + 
                            insurance + propertyTax + yearlyClosingCosts + 
                            loanPayment.principal + loanPayment.interest + 
                            yearlyRenovation + incomeTax;
        
        const annualNetCashFlow = totalRevenue - cashExpenses;
        cumulativeCashFlow += annualNetCashFlow;
        
        // Cash Flow Statement
        cashFlows.push({
            year: year,
            rentIncome: currentAnnualRent,
            otherIncome: otherIncome,
            totalIncome: totalRevenue,
            managementFees: managementFees,
            repairAdvertising: repairAdvertising,
            runningCosts: yearlyRunningCosts,
            insurance: insurance,
            propertyTax: propertyTax,
            closingCosts: yearlyClosingCosts,
            principalRepayment: loanPayment.principal,
            interestPayment: loanPayment.interest,
            renovationCosts: yearlyRenovation,
            incomeTax: incomeTax,
            totalExpenses: cashExpenses,
            annualNetCashFlow: annualNetCashFlow,
            cumulativeCashFlow: cumulativeCashFlow,
            remainingLoan: loanPayment.remainingBalance
        });
    }
    
    // Calculate key metrics
    const firstYearRent = annualRent * (occupancyRate / 100);
    const grossYield = (firstYearRent / propertyPrice) * 100;
    const grossYieldWithCosts = (firstYearRent / (propertyPrice + closingCosts + initialRenovation)) * 100;
    
    // Repayment ratio (first year)
    const firstYearLoanPayment = loanPeriod > 0 ? loanSchedule[0].payment : 0;
    const repaymentRatio = firstYearRent > 0 ? (firstYearLoanPayment / firstYearRent) * 100 : 0;
    
    // 5-Year Payback Analysis
    let fiveYearPayback = 0;
    let fiveYearPaybackAchieved = false;
    let paybackYears = 0;
    
    if (projectionYears >= 2) {
        const initialInvestment = propertyPrice + initialRenovation + closingCosts - loanAmount;
        
        // Calculate payback years needed based on year 2 cash flow
        if (cashFlows.length >= 2) {
            const year2CashFlow = cashFlows[1].annualNetCashFlow;
            if (year2CashFlow > 0) {
                paybackYears = initialInvestment / year2CashFlow;
            }
        }
        
        // Sum of cash flows from year 2 to 5
        if (projectionYears >= 5) {
            for (let i = 1; i < 5 && i < cashFlows.length; i++) {
                fiveYearPayback += cashFlows[i].annualNetCashFlow;
            }
            fiveYearPaybackAchieved = fiveYearPayback >= initialInvestment;
        }
    }
    
    return {
        incomeStatements,
        cashFlows,
        metrics: {
            grossYield,
            grossYieldWithCosts,
            repaymentRatio,
            firstYearNetProfit: incomeStatements[0].netProfit,
            firstYearCashFlow: cashFlows[0].annualNetCashFlow,
            finalCumulativeProfit: cumulativeNetProfit,
            finalCumulativeCashFlow: cumulativeCashFlow,
            fiveYearPayback,
            fiveYearPaybackAchieved,
            paybackYears,
            initialInvestment: propertyPrice + initialRenovation + closingCosts - loanAmount
        }
    };
}

/**
 * Format number as Japanese currency
 * @param {number} value - Number to format
 * @returns {string} Formatted string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('ja-JP').format(Math.round(value));
}

/**
 * Format number as percentage
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
function formatPercent(value, decimals = 2) {
    return value.toFixed(decimals) + '%';
}

/**
 * Calculate depreciation period and amount based on building age and type
 */
function calculateDepreciation() {
    const buildingAge = parseInt(document.getElementById('buildingAge').value) || 0;
    const standardPeriod = parseInt(document.getElementById('buildingType').value) || 22;
    const assessedValue = parseFloat(document.getElementById('buildingAssessedValue').value) || 0;
    
    // Remaining depreciation period = Standard period - Building age
    const remainingPeriod = Math.max(0, standardPeriod - buildingAge);
    
    // Annual depreciation = Assessed value / Remaining period (if period > 0)
    const annualDepreciation = remainingPeriod > 0 ? assessedValue / remainingPeriod : 0;
    
    // Update readonly fields
    document.getElementById('depreciationPeriod').value = remainingPeriod;
    document.getElementById('buildingDepreciationBase').value = Math.round(annualDepreciation);
}
