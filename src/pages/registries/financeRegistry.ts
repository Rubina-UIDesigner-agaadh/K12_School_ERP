import { rp } from './registryHelper';

export const financeRegistry: Record<string, () => any> = {
  // Ledgers
  'general-ledger': rp(
    () => import('../finance/ledgers/GeneralLedger'),
    'GeneralLedger'
  ),
  'day-book': rp(() => import('../finance/ledgers/DayBook'), 'DayBook'),
  'cash-book': rp(() => import('../finance/ledgers/CashBook'), 'CashBook'),
  'bank-book': rp(() => import('../finance/ledgers/BankBook'), 'BankBook'),
  'income-expenditure': rp(
    () => import('../finance/ledgers/IncomeExpenditure'),
    'IncomeExpenditure'
  ),
  'balance-sheet': rp(
    () => import('../finance/ledgers/BalanceSheet'),
    'BalanceSheet'
  ),
  'ledger-audit-trail': rp(
    () => import('../finance/ledgers/LedgerAuditTrail'),
    'LedgerAuditTrail'
  ),

  // Fees
  'fee-summary-dashboard': rp(
    () => import('../finance/fees/FeeSummaryDashboard'),
    'FeeSummaryDashboard'
  ),
  'fee-receipt-list': rp(
    () => import('../finance/fees/FeeReceiptList'),
    'FeeReceiptList'
  ),
  'fee-pending-list': rp(
    () => import('../finance/fees/FeePendingList'),
    'FeePendingList'
  ),
  'fee-collection-register': rp(
    () => import('../finance/fees/FeeCollectionRegister'),
    'FeeCollectionRegister'
  ),
  'fee-receipt': rp(() => import('../finance/fees/FeeReceipt'), 'FeeReceipt'),
  'student-fee-process': rp(
    () => import('../finance/fees/StudentFeeProcess'),
    'StudentFeeProcess'
  ),
  'fee-receipt-bulk': rp(
    () => import('../finance/fees/FeeReceiptBulk'),
    'FeeReceiptBulk'
  ),
  'fee-refund': rp(() => import('../finance/fees/FeeRefund'), 'FeeRefund'),
  'assign-exemption-type': rp(
    () => import('../finance/fees/AssignExemptionType'),
    'AssignExemptionType'
  ),
  'fee-collection-reports': rp(
    () => import('../finance/fees/FeeCollectionReports'),
    'FeeReportsPage'
  ),
  'branch-transfer': rp(
    () => import('../finance/fees/BranchTransfer'),
    'BranchTransfer'
  ),
  'fee-structure': rp(
    () => import('../finance/fees/FeeStructure'),
    'FeeStructure'
  ),
  'royalty-collection': rp(
    () => import('../finance/fees/RoyaltyCollection'),
    'RoyaltyCollection'
  ),
  'fee-receipt-template': rp(
    () => import('../finance/fees/FeeReceiptTemplate'),
    'FeeReceiptTemplate'
  ),

  // Charge
  'charge-summary-dashboard': rp(
    () => import('../finance/charge/ChargeSummaryDashboard'),
    'ChargeSummaryDashboard'
  ),
  'charge-list': rp(() => import('../finance/charge/ChargeList'), 'ChargeList'),
  'charge-receipt': rp(
    () => import('../finance/charge/ChargeReceipt'),
    'ChargeReceipt'
  ),
  'charge-receipt-import': rp(
    () => import('../finance/charge/ChargeReceiptImport'),
    'ChargeReceiptImport'
  ),
  'charge-receipt-report': rp(
    () => import('../finance/charge/ChargeReceiptReport'),
    'ChargeReceiptReport'
  ),
  'charge-receipt-book-master': rp(
    () => import('../finance/charge/ChargeReceiptBookMaster'),
    'ChargeReceiptBookMaster'
  ),
  'charge-master': rp(
    () => import('../finance/charge/ChargeMaster'),
    'ChargeMaster'
  ),
  // Scholarship
  'scholarship-summary-dashboard': rp(
    () => import('../finance/scholarship/ScholarshipSummaryDashboard'),
    'ScholarshipSummaryDashboard'
  ),
  'student-scholarship-list': rp(
    () => import('../finance/scholarship/StudentScholarshipList'),
    'StudentScholarshipList'
  ),
  'scholarship-application-list': rp(
    () => import('../finance/scholarship/ScholarshipApplicationList'),
    'ScholarshipApplicationList'
  ),
  'scholarship-application-entry': rp(
    () => import('../finance/scholarship/ScholarshipApplicationEntry'),
    'ScholarshipApplicationEntry'
  ),
  'scholarship-eligibility-evaluation': rp(
    () => import('../finance/scholarship/ScholarshipEligibilityEvaluation'),
    'ScholarshipEligibilityEvaluation'
  ),
  'scholarship-approval-sanction': rp(
    () => import('../finance/scholarship/ScholarshipApprovalSanction'),
    'ScholarshipApprovalSanction'
  ),
  'scholarship-allocation-fee': rp(
    () => import('../finance/scholarship/ScholarshipAllocationFee'),
    'ScholarshipAllocationFee'
  ),
  'scholarship-disbursement': rp(
    () => import('../finance/scholarship/ScholarshipDisbursement'),
    'ScholarshipDisbursement'
  ),
  'bulk-scholarship-allocation': rp(
    () => import('../finance/scholarship/BulkScholarshipAllocation'),
    'BulkScholarshipAllocation'
  ),
  'bulk-scholarship-disbursement': rp(
    () => import('../finance/scholarship/BulkScholarshipDisbursement'),
    'BulkScholarshipDisbursement'
  ),
  'scholarship-adjustment-cancellation': rp(
    () => import('../finance/scholarship/ScholarshipAdjustmentCancellation'),
    'ScholarshipAdjustmentCancellation'
  ),
  'scholarship-report': rp(
    () => import('../finance/scholarship/ScholarshipReport'),
    'ScholarshipReport'
  ),
  'scholarship-utilization-report': rp(
    () => import('../finance/scholarship/ScholarshipUtilizationReport'),
    'ScholarshipUtilizationReport'
  ),
  'pending-rejected-applications-report': rp(
    () => import('../finance/scholarship/PendingRejectedApplicationsReport'),
    'PendingRejectedApplicationsReport'
  ),
  'scholarship-scheme-master': rp(
    () => import('../finance/scholarship/ScholarshipSchemeMaster'),
    'ScholarshipSchemeMaster'
  ),
  'scholarship-quota-master': rp(
    () => import('../finance/scholarship/ScholarshipQuotaMaster'),
    'ScholarshipQuotaMaster'
  ),
  'scholarship-criteria-master': rp(
    () => import('../finance/scholarship/ScholarshipCriteriaMaster'),
    'ScholarshipCriteriaMaster'
  ),
  'scholarship-agency-donor-master': rp(
    () => import('../finance/scholarship/ScholarshipAgencyDonorMaster'),
    'ScholarshipAgencyDonorMaster'
  ),
  'scholarship-account-mapping': rp(
    () => import('../finance/scholarship/ScholarshipAccountMapping'),
    'ScholarshipAccountMapping'
  ),
  'scholarship-setup': rp(
    () => import('../finance/scholarship/ScholarshipSetup'),
    'ScholarshipSetup'
  ),

  // Account
  'account-master': rp(
    () => import('../finance/ledgers/AccountMaster'),
    'AccountMaster'
  ),

  // Expenses
  'expense-summary-dashboard': rp(
    () => import('../finance/expenses/ExpenseSummaryDashboard'),
    'ExpenseSummaryDashboard'
  ),
  'expense-list': rp(
    () => import('../finance/expenses/ExpenseList'),
    'ExpenseList'
  ),
  'expense-voucher-entry': rp(
    () => import('../finance/expenses/ExpenseVoucherEntry'),
    'ExpenseVoucherEntry'
  ),
  'expense-payment': rp(
    () => import('../finance/expenses/ExpensePayment'),
    'ExpensePayment'
  ),
  'petty-cash-issue': rp(
    () => import('../finance/expenses/PettyCashIssue'),
    'PettyCashIssue'
  ),
  'petty-cash-expense-entry': rp(
    () => import('../finance/expenses/PettyCashExpenseEntry'),
    'PettyCashExpenseEntry'
  ),
  'staff-advance-issue': rp(
    () => import('../finance/expenses/StaffAdvanceIssue'),
    'StaffAdvanceIssue'
  ),
  'staff-advance-settlement': rp(
    () => import('../finance/expenses/StaffAdvanceSettlement'),
    'StaffAdvanceSettlement'
  ),
  'recurring-expense-scheduler': rp(
    () => import('../finance/expenses/RecurringExpenseScheduler'),
    'RecurringExpenseScheduler'
  ),
  'bulk-expense-import': rp(
    () => import('../finance/expenses/BulkExpenseImport'),
    'BulkExpenseImport'
  ),
  'expense-approval-workflow': rp(
    () => import('../finance/expenses/ExpenseApprovalWorkflow'),
    'ExpenseApprovalWorkflow'
  ),
  'expense-posting': rp(
    () => import('../finance/expenses/ExpensePosting'),
    'ExpensePosting'
  ),
  'expense-report': rp(
    () => import('../finance/expenses/ExpenseReport'),
    'ExpenseReport'
  ),
  'budget-vs-actual-report': rp(
    () => import('../finance/expenses/BudgetVsActualReport'),
    'BudgetVsActualReport'
  ),
  'department-wise-expense': rp(
    () => import('../finance/expenses/DepartmentWiseExpense'),
    'DepartmentWiseExpense'
  ),
  'vendor-wise-expense': rp(
    () => import('../finance/expenses/VendorWiseExpense'),
    'VendorWiseExpense'
  ),
  'petty-cash-report': rp(
    () => import('../finance/expenses/PettyCashReport'),
    'PettyCashReport'
  ),
  'expense-head-master': rp(
    () => import('../finance/expenses/ExpenseHeadMaster'),
    'ExpenseHeadMaster'
  ),
  'vendor-payee-master': rp(
    () => import('../finance/expenses/VendorPayeeMaster'),
    'VendorPayeeMaster'
  ),
  'expense-budget-master': rp(
    () => import('../finance/expenses/ExpenseBudgetMaster'),
    'ExpenseBudgetMaster'
  ),
  'petty-cash-location-master': rp(
    () => import('../finance/expenses/PettyCashLocationMaster'),
    'PettyCashLocationMaster'
  ),
  'expense-account-mapping': rp(
    () => import('../finance/expenses/ExpenseAccountMapping'),
    'ExpenseAccountMapping'
  ),
  'expense-setup': rp(
    () => import('../finance/expenses/ExpenseSetup'),
    'ExpenseSetup'
  ),

};