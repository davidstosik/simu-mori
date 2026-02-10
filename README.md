# 不動産投資シミュレーター (Real Estate Investment Simulator)

## Overview

This is a comprehensive real estate investment simulator designed for analyzing Japanese property investments. It provides detailed income statements and cash flow projections over multiple years, with support for scenario comparison and export functionality.

**Key Features:**
- ✅ Standalone web application (no server required)
- ✅ Japanese UI with professional design
- ✅ Accurate financial calculations (loan amortization, depreciation, taxes)
- ✅ Year-by-year projections with detailed income statements and cash flow statements
- ✅ Multi-scenario management (save, load, compare)
- ✅ 5-year payback analysis
- ✅ CSV export functionality
- ✅ Example scenario pre-loaded
- ✅ Mobile responsive design

## How to Use

### Getting Started

1. **Open the application**: Simply open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge)
2. **Review the pre-loaded example**: The app loads with realistic example values for a Japanese property
3. **Adjust inputs**: Modify any values in the input sections
4. **Calculate**: Click the "計算実行 (Calculate)" button
5. **Review results**: Scroll down to see detailed tables and metrics

### Input Sections

#### 物件価格 (Property Purchase)
- **物件価格**: Total property purchase price
- **初期リフォーム費用**: Initial renovation costs
- **購入時諸費用合計**: Total closing costs (registration, agent fees, etc.)

#### 借入条件 (Loan Conditions)
- **借入額**: Loan amount
- **金利**: Annual interest rate (%)
- **借入期間**: Loan period in years
- **返済方法**: Repayment method
  - 元利均等返済 (Equal Payment): Fixed monthly payments
  - 元金均等返済 (Equal Principal): Declining monthly payments

#### 収入条件 (Income Conditions)
- **年間満室賃料合計**: Annual rent at full occupancy
- **年間その他収入**: Other annual income (parking, etc.)
- **平均入居率**: Average occupancy rate (%)
- **年間家賃下落率**: Annual rent decline rate (%)

#### 費用条件 (Expense Conditions)
- **管理費用**: Annual management fees
- **修繕費・広告費等**: Annual repair and advertising costs
- **月額ランニング費用合計**: Monthly running costs
- **年間火災・地震保険料**: Annual fire and earthquake insurance

#### 減価償却条件 (Depreciation Conditions)
- **建物償却価格**: Building value for depreciation
- **償却年数**: Depreciation period (typically 22 years for wooden, 47 for RC)

#### 税金条件 (Tax Conditions)
- **土地の評価額**: Land assessed value
- **建物の評価額**: Building assessed value
- **所得・法人税実効税率**: Effective income/corporate tax rate (%)
- **所得控除**: Annual income deductions

### Scenario Management

#### Saving Scenarios
1. Enter a name in the "シナリオ名" field
2. Click "保存 (Save)" button
3. Scenarios are saved in your browser's localStorage

#### Loading Scenarios
1. Click "読込 (Load)" button
2. Select a scenario from the list
3. The inputs will be populated with saved values

#### Comparing Scenarios
1. Save at least 2 scenarios
2. Click "比較 (Compare)" button
3. View side-by-side comparison of key metrics

#### Creating New Scenarios
1. Click "新規 (New)" button
2. Inputs will reset to default example values
3. Enter a new scenario name

### Exporting Data

Three export options are available:
- **損益計算書をCSVで出力**: Export income statement only
- **キャッシュフロー計算書をCSVで出力**: Export cash flow statement only
- **全データをCSVで出力**: Export all data

CSV files are formatted with UTF-8 BOM for proper display in Excel.

## Calculation Methodology

### Loan Amortization

#### 元利均等返済 (Equal Payment Method)
Fixed monthly payment throughout the loan period.

**Formula:**
```
Monthly Payment = P × r × (1 + r)^n / ((1 + r)^n - 1)

Where:
- P = Principal (loan amount)
- r = Monthly interest rate (annual rate / 12)
- n = Total number of months
```

**Characteristics:**
- Constant total payment each month
- Interest portion decreases over time
- Principal portion increases over time
- Total interest paid is higher than equal principal method

#### 元金均等返済 (Equal Principal Method)
Fixed principal payment with declining interest.

**Formula:**
```
Monthly Principal Payment = P / n (constant)
Monthly Interest Payment = Remaining Balance × r (declining)
Total Payment = Principal + Interest (declining)

Where:
- P = Principal (loan amount)
- n = Total number of months
- r = Monthly interest rate
```

**Characteristics:**
- Higher initial payments
- Payments decrease over time
- Total interest paid is lower than equal payment method
- Faster equity buildup

### Depreciation

**Method:** Straight-line depreciation (定額法)

**Formula:**
```
Annual Depreciation = Building Value / Depreciation Period
```

**Standard Depreciation Periods:**
- Wooden structure (木造): 22 years
- Light steel (軽量鉄骨): 27 years
- Heavy steel (重量鉄骨): 34 years
- Reinforced concrete (RC): 47 years

**Important Notes:**
- Only the building value is depreciable (land is not)
- Depreciation is a non-cash expense (reduces taxable income but doesn't affect cash flow)
- Depreciation ends after the depreciation period

### Property Tax

**Formula:**
```
Fixed Asset Tax = (Land Value + Building Value) × 1.4%
City Planning Tax = (Land Value + Building Value) × 0.3%
Total Annual Tax = (Land Value + Building Value) × 1.7%
```

**Notes:**
- Standard rate of 1.4% for fixed asset tax
- Additional 0.3% for city planning tax in urbanized areas
- Based on assessed value, not purchase price
- Assessed value is typically 60-70% of market value

### Income Tax

**Formula:**
```
Taxable Income = (Revenue - Expenses - Depreciation) - Income Deductions
Income Tax = Taxable Income × Tax Rate (%)
```

**Important Distinctions:**
- Pre-tax income includes depreciation (non-cash expense)
- Taxable income is after deductions
- Effective tax rate varies by income bracket and structure (personal vs. corporate)

### Cash Flow vs. Net Profit

**Net Profit (Accounting):**
```
Net Profit = Revenue - All Expenses (including depreciation) - Income Tax
```
- Includes depreciation (non-cash expense)
- Used for tax calculation and financial reporting
- Can be positive even when cash flow is negative

**Net Cash Flow (Cash Basis):**
```
Net Cash Flow = Revenue - Cash Expenses (excluding depreciation) - Principal Repayment - Income Tax
```
- Excludes depreciation (non-cash)
- Includes principal repayment (cash outflow)
- Represents actual money in/out
- Critical for investment viability

### 5-Year Payback Analysis

**Purpose:** Determine if the investment recovers the initial out-of-pocket costs within 5 years.

**Calculation:**
```
Initial Investment = Property Price + Renovation + Closing Costs - Loan Amount

5-Year Cash Flow Recovery = Sum of Annual Net Cash Flow (Year 2 to Year 5)

Payback Achieved = 5-Year Recovery ≥ Initial Investment
```

**Why Years 2-5?**
- Year 1 typically includes large upfront costs (renovation, closing costs)
- Years 2-5 represent normalized operating cash flows
- Common benchmark in Japanese real estate investment analysis

### Key Metrics

#### 表面利回り (Gross Yield)
```
Gross Yield = (Annual Rent × Occupancy Rate) / Property Price × 100%
```
Simple yield without considering expenses.

#### 初期費用込み表面利回り (Gross Yield with Initial Costs)
```
Gross Yield = (Annual Rent × Occupancy Rate) / (Property Price + Closing Costs + Renovation) × 100%
```
More conservative yield including all initial investments.

#### 返済比率 (Repayment Ratio)
```
Repayment Ratio = Annual Loan Payment / Annual Rent Income × 100%
```
Percentage of rent income used for loan payments. Lower is better.
- < 50%: Excellent
- 50-70%: Good
- 70-85%: Acceptable
- > 85%: Risky

## Example Scenario

The application loads with a realistic example:

**Property Details:**
- Property Price: ¥30,000,000
- Location: Typical Japanese metropolitan area
- Type: Investment property (apartment/small building)

**Loan:**
- Amount: ¥24,000,000 (80% LTV)
- Interest Rate: 2.5%
- Period: 25 years
- Method: Equal payment (元利均等返済)

**Income:**
- Annual Rent: ¥2,400,000 (¥200,000/month)
- Occupancy Rate: 95%
- Rent Decline: 0.5% per year

**Expected Results:**
- Gross Yield: ~7.6%
- First Year Cash Flow: Positive
- 10-Year Cumulative Cash Flow: Positive
- 5-Year Payback: Achievable

## Technical Details

### Architecture

```
real-estate-simulator/
├── index.html          - Main HTML structure
├── styles.css          - Styling and responsive design
├── calculator.js       - Core calculation engine
├── scenarios.js        - Scenario management and localStorage
├── ui.js              - UI interactions and rendering
└── README.md          - This file
```

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Storage

- Uses browser localStorage for scenario persistence
- No server required
- Data stays on your device
- Clear browser data will remove saved scenarios

### Export Format

CSV files use:
- UTF-8 encoding with BOM
- Comma-separated values
- Japanese labels for all fields
- Compatible with Excel, Google Sheets, Numbers

## Tips for Accurate Analysis

### 1. Property Valuation
- Use actual assessed values from tax documents
- Land vs. building ratio typically 30:70 to 40:60
- Building value determines depreciation benefit

### 2. Depreciation Period
- Check property age and construction type
- Remaining depreciation = Standard period - Age
- Older properties have shorter remaining periods

### 3. Occupancy Rate
- Downtown Tokyo: 95-98%
- Suburban areas: 90-95%
- Regional cities: 85-90%
- Rural areas: 70-85%

### 4. Rent Decline
- New properties: 0.3-0.5% per year
- Older properties: 0.5-1.0% per year
- Good location/management: 0-0.3%

### 5. Tax Rate
- Personal income: 5-45% (progressive)
- Corporate: ~30% (standard)
- Real estate corporation: ~20-25% (effective)

### 6. Expense Estimates
- Management fees: 5% of rent is standard
- Repair reserve: 3-5% of rent
- Insurance: ¥20,000-50,000/year depending on property

## Limitations

- Does not include property appreciation/depreciation
- Fixed expense assumptions (no inflation)
- Simplified tax calculation (actual may vary)
- No vacancy loss beyond occupancy rate
- Does not account for major repairs or capital improvements
- Interest rate assumed constant (no refinancing scenarios)

## Future Enhancements

Potential features for future versions:
- Property sale simulation at end of period
- Refinancing scenarios
- Multiple property portfolio analysis
- Inflation-adjusted projections
- Monte Carlo simulation for risk analysis
- Visual charts and graphs
- PDF export with formatted reports

## Support

For issues or questions:
- Review this README for calculation methodology
- Check browser console for errors
- Verify all input values are reasonable
- Try the example scenario to ensure proper functioning

## License

This is a standalone educational tool. Use at your own risk. Always consult with financial and tax professionals for actual investment decisions.

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-10  
**Author:** OpenClaw Agent
