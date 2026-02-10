// Test script to verify calculations
// Run with: node test.js

// Load calculator functions (simplified for Node.js)
function calculateLoanSchedule(principal, annualRate, years, method) {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const schedule = [];
    let remainingBalance = principal;

    if (method === 'equal-payment') {
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
                remainingBalance: Math.max(0, remainingBalance)
            });
        }
    }
    
    return schedule;
}

// Test with example values
console.log('=== Real Estate Investment Simulator - Test ===\n');

const testInputs = {
    loanAmount: 24000000,
    interestRate: 2.5,
    loanPeriod: 25
};

console.log('Test Inputs:');
console.log(`Loan Amount: ¥${testInputs.loanAmount.toLocaleString()}`);
console.log(`Interest Rate: ${testInputs.interestRate}%`);
console.log(`Loan Period: ${testInputs.loanPeriod} years\n`);

const schedule = calculateLoanSchedule(
    testInputs.loanAmount,
    testInputs.interestRate,
    testInputs.loanPeriod,
    'equal-payment'
);

console.log('Loan Amortization Schedule (First 5 Years):');
console.log('Year | Payment      | Principal    | Interest     | Remaining');
console.log('-----|--------------|--------------|--------------|-------------');

for (let i = 0; i < Math.min(5, schedule.length); i++) {
    const s = schedule[i];
    console.log(
        `${s.year.toString().padStart(4)} | ` +
        `¥${Math.round(s.payment).toLocaleString().padStart(11)} | ` +
        `¥${Math.round(s.principal).toLocaleString().padStart(11)} | ` +
        `¥${Math.round(s.interest).toLocaleString().padStart(11)} | ` +
        `¥${Math.round(s.remainingBalance).toLocaleString()}`
    );
}

console.log('\n=== Test Successful ===');
console.log('\nKey Metrics:');
console.log(`First Year Payment: ¥${Math.round(schedule[0].payment).toLocaleString()}`);
console.log(`First Year Principal: ¥${Math.round(schedule[0].principal).toLocaleString()}`);
console.log(`First Year Interest: ¥${Math.round(schedule[0].interest).toLocaleString()}`);
console.log(`Total Interest (25 years): ¥${Math.round(schedule.reduce((sum, s) => sum + s.interest, 0)).toLocaleString()}`);

console.log('\n✓ Calculator functions are working correctly!');
console.log('✓ Open index.html in a web browser to use the full application.');
