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
  'trial-balance': rp(
    () => import('../finance/ledgers/TrialBalance'),
    'TrialBalance'
  ),
  'income-expenditure': rp(
    () => import('../finance/ledgers/IncomeExpenditure'),
    'IncomeExpenditure'
  ),
  'profit-loss': rp(
    () => import('../finance/ledgers/ProfitLoss'),
    'ProfitLoss'
  ),
  'balance-sheet': rp(
    () => import('../finance/ledgers/BalanceSheet'),
    'BalanceSheet'
  ),
  'bank-reconciliation': rp(
    () => import('../finance/ledgers/BankReconciliation'),
    'BankReconciliation'
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
  'classwise-fee-status': rp(
    () => import('../finance/fees/ClasswiseFeeStatus'),
    'ClasswiseFeeStatus'
  ),
  'fee-collection-register': rp(
    () => import('../finance/fees/FeeCollectionRegister'),
    'FeeCollectionRegister'
  ),
  'fee-receipt': rp(() => import('../finance/fees/FeeReceipt'), 'FeeReceipt'),
  'fee-opening': rp(() => import('../finance/fees/FeeOpening'), 'FeeOpening'),
  'student-fee-process': rp(
    () => import('../finance/fees/StudentFeeProcess'),
    'StudentFeeProcess'
  ),
  'divisionwise-fee': rp(
    () => import('../finance/fees/DivisionwiseFee'),
    'DivisionwiseFee'
  ),
  'receipt-cheque-clear': rp(
    () => import('../finance/fees/ReceiptChequeClear'),
    'ReceiptChequeClear'
  ),
  'fee-receipt-bulk': rp(
    () => import('../finance/fees/FeeReceiptBulk'),
    'FeeReceiptBulk'
  ),
  'fee-refund-bulk': rp(
    () => import('../finance/fees/FeeRefundBulk'),
    'FeeRefundBulk'
  ),
  'fee-invoice': rp(() => import('../finance/fees/FeeInvoice'), 'FeeInvoice'),
  'fee-invoice-import': rp(
    () => import('../finance/fees/FeeInvoiceImport'),
    'FeeInvoiceImport'
  ),
  'fee-refund': rp(() => import('../finance/fees/FeeRefund'), 'FeeRefund'),
  'assign-exemption-type': rp(
    () => import('../finance/fees/AssignExemptionType'),
    'AssignExemptionType'
  ),
  'late-fee-fine-posting': rp(
    () => import('../finance/fees/LateFeeAndFinePosting'),
    'LateFeeAndFinePosting'
  ),
  'fee-receipt-cancellation': rp(
    () => import('../finance/fees/FeeReceiptCancellation'),
    'FeeReceiptCancellation'
  ),
  'fee-auto-demand-scheduler': rp(
    () => import('../finance/fees/FeeAutoDemandScheduler'),
    'FeeAutoDemandScheduler'
  ),
  'fee-collection-reports': rp(
    () => import('../finance/fees/FeeCollectionReports'),
    'FeeCollectionReports'
  ),
  'fee-defaulter-list': rp(
    () => import('../finance/fees/FeeDefaulterList'),
    'FeeDefaulterList'
  ),
  'fee-discount-exemption-report': rp(
    () => import('../finance/fees/FeeDiscountExemptionReport'),
    'FeeDiscountExemptionReport'
  ),
  'fee-headwise-collection-summary': rp(
    () => import('../finance/fees/FeeHeadwiseCollectionSummary'),
    'FeeHeadwiseCollectionSummary'
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
  'charge-posting': rp(
    () => import('../finance/charge/ChargePosting'),
    'ChargePosting'
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
  'charge-account-mapping': rp(
    () => import('../finance/charge/ChargeAccountMapping'),
    'ChargeAccountMapping'
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
  'select-account': rp(
    () => import('../finance/account/SelectAccount'),
    'SelectAccount'
  ),
  'account-summary-dashboard': rp(
    () => import('../finance/account/AccountSummaryDashboard'),
    'AccountSummaryDashboard'
  ),
  'accounting-year-master': rp(
    () => import('../finance/account/AccountingYearMaster'),
    'AccountingYearMaster'
  ),
  'account-master': rp(
    () => import('../finance/account/AccountMaster'),
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

  // Online Payment
  'online-payment-dashboard': rp(
    () => import('../finance/online-payment/OnlinePaymentDashboard'),
    'OnlinePaymentDashboard'
  ),
  'online-transaction-list': rp(
    () => import('../finance/online-payment/OnlineTransactionList'),
    'OnlineTransactionList'
  ),
  'failed-disputed-transactions': rp(
    () => import('../finance/online-payment/FailedDisputedTransactions'),
    'FailedDisputedTransactions'
  ),
  'initiate-online-payment': rp(
    () => import('../finance/online-payment/InitiateOnlinePayment'),
    'InitiateOnlinePayment'
  ),
  'online-payment-retry-status': rp(
    () => import('../finance/online-payment/OnlinePaymentRetryStatus'),
    'OnlinePaymentRetryStatus'
  ),
  'online-refund-processing': rp(
    () => import('../finance/online-payment/OnlineRefundProcessing'),
    'OnlineRefundProcessing'
  ),
  'gateway-settlement-import': rp(
    () => import('../finance/online-payment/GatewaySettlementImport'),
    'GatewaySettlementImport'
  ),
  'online-payment-reconciliation': rp(
    () => import('../finance/online-payment/OnlinePaymentReconciliation'),
    'OnlinePaymentReconciliation'
  ),
  'online-payment-report': rp(
    () => import('../finance/online-payment/OnlinePaymentReport'),
    'OnlinePaymentReport'
  ),
  'gateway-wise-collection-summary': rp(
    () => import('../finance/online-payment/GatewayWiseCollectionSummary'),
    'GatewayWiseCollectionSummary'
  ),
  'settlement-mismatch-report': rp(
    () => import('../finance/online-payment/SettlementMismatchReport'),
    'SettlementMismatchReport'
  ),
  'payment-gateway-master': rp(
    () => import('../finance/online-payment/PaymentGatewayMaster'),
    'PaymentGatewayMaster'
  ),
  'online-payment-setup': rp(
    () => import('../finance/online-payment/OnlinePaymentSetup'),
    'OnlinePaymentSetup'
  ),
  'online-payment-account-mapping': rp(
    () => import('../finance/online-payment/OnlinePaymentAccountMapping'),
    'OnlinePaymentAccountMapping'
  ),
  'online-payment-notification-templates': rp(
    () =>
    import('../finance/online-payment/OnlinePaymentNotificationTemplates'),
    'OnlinePaymentNotificationTemplates'
  )
};