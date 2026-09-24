import { rp } from './registryHelper';

export const adminRegistry: Record<string, () => any> = {
  // Security
  'security-user-profile': rp(
    () => import('../admin/security/SecurityUserProfile'),
    'SecurityUserProfile'
  ),
  'security-summary-dashboard': rp(
    () => import('../admin/security/SecuritySummaryDashboard'),
    'SecuritySummaryDashboard'
  ),
  'user-log': rp(() => import('../admin/security/UserLog'), 'UserLog'),
  'assign-permission': rp(
    () => import('../admin/security/AssignPermission'),
    'AssignPermission'
  ),
  'user-access': rp(() => import('../admin/security/UserAccess'), 'UserAccess'),
  'security-admin': rp(
    () => import('../admin/security/SecurityAdmin'),
    'SecurityAdmin'
  ),
  'role-master': rp(() => import('../admin/security/RoleMaster'), 'RoleMaster'),
  'user-master': rp(() => import('../admin/security/UserMaster'), 'UserMaster'),
  'manage-student-login': rp(
    () => import('../admin/security/ManageStudentLogin'),
    'ManageStudentLogin'
  ),
  'manage-employee-login': rp(
    () => import('../admin/security/ManageEmployeeLogin'),
    'ManageEmployeeLogin'
  ),

  // Configuration
  'institute-policies-rule-overrides': rp(
    () => import('../admin/institute-setup/InstitutePoliciesRuleOverrides'),
    'InstitutePoliciesRuleOverrides'
  ),
  'online-payment-notification-templates': rp(
    () => import('../admin/configuration/OnlinePaymentNotificationTemplates'),
    'OnlinePaymentNotificationTemplates'
  ),
  'expense-setup': rp(
    () => import('../admin/configuration/ExpenseSetup'),
    'ExpenseSetup'
  ),
  'scholarship-setup': rp(
    () => import('../admin/configuration/ScholarshipSetup'),
    'ScholarshipSetup'
  ),
  'online-payment-setup': rp(
    () => import('../admin/configuration/OnlinePaymentSetup'),
    'OnlinePaymentSetup'
  ),
  'student-rules': rp(
    () => import('../admin/configuration/StudentRules'),
    'StudentRules'
  ),
  'promotion-detention-criteria': rp(
    () => import('../admin/configuration/PromotionDetentionCriteria'),
    'PromotionDetentionCriteria'
  ),
  'report-card-progress-templates': rp(
    () => import('../admin/configuration/ReportCardProgressTemplates'),
    'ReportCardProgressTemplates'
  ),
  'ranking-merit-list-rules': rp(
    () => import('../admin/configuration/RankingMeritListRules'),
    'RankingMeritListRules'
  ),
  'fee-behaviour-late-fee-rules': rp(
    () => import('../admin/configuration/FeeBehaviourLateFeeRules'),
    'FeeBehaviourLateFeeRules'
  ),
  'scholarship-concession-rules': rp(
    () => import('../admin/configuration/ScholarshipConcessionRules'),
    'ScholarshipConcessionRules'
  ),
  'online-payment-convenience-fee': rp(
    () => import('../admin/configuration/OnlinePaymentConvenienceFee'),
    'OnlinePaymentConvenienceFee'
  ),
  'discipline-counselling-policy': rp(
    () => import('../admin/configuration/DisciplineCounsellingPolicy'),
    'DisciplineCounsellingPolicy'
  ),
  'custom-fields-dynamic-forms': rp(
    () => import('../admin/configuration/CustomFieldsDynamicForms'),
    'CustomFieldsDynamicForms'
  ),
  'number-series-document-id-settings': rp(
    () => import('../admin/configuration/NumberSeriesDocumentIdSettings'),
    'NumberSeriesDocumentIdSettings'
  ),

  // Administration
  'academic-year-operations-control': rp(
    () => import('../admin/administration/AcademicYearOperationsControl'),
    'AcademicYearOperationsControl'
  ),
  'central-approval-control-desk': rp(
    () => import('../admin/administration/CentralApprovalControlDesk'),
    'CentralApprovalControlDesk'
  ),
  'data-governance-lock-manager': rp(
    () => import('../admin/administration/DataGovernanceLockManager'),
    'DataGovernanceLockManager'
  ),
  'cross-module-mapping-desk': rp(
    () => import('../admin/administration/CrossModuleMappingDesk'),
    'CrossModuleMappingDesk'
  ),
  'bulk-administrative-actions-hub': rp(
    () => import('../admin/administration/BulkAdministrativeActionsHub'),
    'BulkAdministrativeActionsHub'
  ),
  'administrative-control-reports': rp(
    () => import('../admin/administration/AdministrativeControlReports'),
    'AdministrativeControlReports'
  ),

  // Customer Support
  'release-note-detail': rp(
    () => import('../admin/customer-support/ReleaseNoteDetail'),
    'ReleaseNoteDetail'
  ),
  'module-activation': rp(
    () => import('../admin/customer-support/ModuleActivation'),
    'ModuleActivation'
  ),
  ticket: rp(() => import('../admin/customer-support/Ticket'), 'Ticket'),
  'customer-message': rp(
    () => import('../admin/customer-support/CustomerMessage'),
    'CustomerMessage'
  ),
  'support-document': rp(
    () => import('../admin/customer-support/SupportDocument'),
    'SupportDocument'
  ),
  'screen-training': rp(
    () => import('../admin/customer-support/ScreenTraining'),
    'ScreenTraining'
  ),
  'teacher-video-guide': rp(
    () => import('../admin/customer-support/TeacherVideoGuide'),
    'TeacherVideoGuide'
  ),

  // Utilities
  'data-backup-restore-utility': rp(
    () => import('../admin/utilities/DataBackupRestoreUtility'),
    'DataBackupRestoreUtility'
  ),
  'data-archive-management': rp(
    () => import('../admin/utilities/DataArchiveManagement'),
    'DataArchiveManagement'
  ),
  'data-import-wizard': rp(
    () => import('../admin/utilities/DataImportWizard'),
    'DataImportWizard'
  ),
  'bulk-data-update-mass-operation': rp(
    () => import('../admin/utilities/BulkDataUpdateMassOperation'),
    'BulkDataUpdateMassOperation'
  ),
  'log-viewer-audit-export': rp(
    () => import('../admin/utilities/LogViewerAuditExport'),
    'LogViewerAuditExport'
  ),
  'file-document-storage-manager': rp(
    () => import('../admin/utilities/FileDocumentStorageManager'),
    'FileDocumentStorageManager'
  ),
  'notification-queue-resend-utility': rp(
    () => import('../admin/utilities/NotificationQueueResendUtility'),
    'NotificationQueueResendUtility'
  ),
  'barcode-qr-code-generator': rp(
    () => import('../admin/utilities/BarcodeQrCodeGenerator'),
    'BarcodeQrCodeGenerator'
  ),
  'id-number-series-viewer-sync': rp(
    () => import('../admin/utilities/IdNumberSeriesViewerSync'),
    'IdNumberSeriesViewerSync'
  ),

  // Masters - Academic
  'class-section-master': rp(
    () => import('../admin/masters/ClassSectionMaster'),
    'ClassSectionMaster'
  ),
  'stream-subject-group-master': rp(
    () => import('../admin/masters/StreamSubjectGroupMaster'),
    'StreamSubjectGroupMaster'
  ),
  'subject-master': rp(
    () => import('../admin/masters/SubjectMaster'),
    'SubjectMaster'
  ),
  'academic-term-exam-type-master': rp(
    () => import('../admin/masters/AcademicTermExamTypeMaster'),
    'AcademicTermExamTypeMaster'
  ),
  'co-scholastic-area-skill-master': rp(
    () => import('../admin/masters/CoScholasticAreaSkillMaster'),
    'CoScholasticAreaSkillMaster'
  ),

  // Masters - Finance
  'fee-head-master-admin': rp(
    () => import('../admin/masters/FeeHeadMasterAdmin'),
    'FeeHeadMasterAdmin'
  ),
  'fee-category-installment-due-rules-master': rp(
    () => import('../admin/masters/FeeCategoryInstallmentDueRulesMaster'),
    'FeeCategoryInstallmentDueRulesMaster'
  ),
  'fee-structure-template-master': rp(
    () => import('../admin/masters/FeeStructureTemplateMaster'),
    'FeeStructureTemplateMaster'
  ),

  // Masters - Expense
  'expense-head-master': rp(
    () => import('../admin/masters/ExpenseHeadMaster'),
    'ExpenseHeadMaster'
  ),
  'vendor-payee-master': rp(
    () => import('../admin/masters/VendorPayeeMaster'),
    'VendorPayeeMaster'
  ),
  'expense-budget-master': rp(
    () => import('../admin/masters/ExpenseBudgetMaster'),
    'ExpenseBudgetMaster'
  ),
  'petty-cash-location-master': rp(
    () => import('../admin/masters/PettyCashLocationMaster'),
    'PettyCashLocationMaster'
  ),
  'expense-account-mapping': rp(
    () => import('../admin/masters/ExpenseAccountMapping'),
    'ExpenseAccountMapping'
  ),

  // Masters - Scholarship
  'scholarship-agency-donor-master': rp(
    () => import('../admin/masters/ScholarshipAgencyDonorMaster'),
    'ScholarshipAgencyDonorMaster'
  ),
  'scholarship-account-mapping': rp(
    () => import('../admin/masters/ScholarshipAccountMapping'),
    'ScholarshipAccountMapping'
  ),

  // Masters - Payment
  'payment-gateway-master': rp(
    () => import('../admin/masters/PaymentGatewayMaster'),
    'PaymentGatewayMaster'
  ),
  'online-payment-account-mapping': rp(
    () => import('../admin/masters/OnlinePaymentAccountMapping'),
    'OnlinePaymentAccountMapping'
  ),

  // Institute Setup
  'institute-profile-branch-management': rp(
    () => import('../admin/institute-setup/InstituteProfileBranchManagement'),
    'InstituteProfileBranchManagement'
  ),
  'campus-building-room-layout': rp(
    () => import('../admin/institute-setup/CampusBuildingRoomLayout'),
    'CampusBuildingRoomLayout'
  ),
  'academic-session-term-setup': rp(
    () => import('../admin/institute-setup/AcademicSessionTermSetup'),
    'AcademicSessionTermSetup'
  ),
  'class-section-structure-setup': rp(
    () => import('../admin/institute-setup/ClassSectionStructureSetup'),
    'ClassSectionStructureSetup'
  ),
  'department-subject-grouping-setup': rp(
    () => import('../admin/institute-setup/DepartmentSubjectGroupingSetup'),
    'DepartmentSubjectGroupingSetup'
  ),
  'institute-calendar-working-days': rp(
    () => import('../admin/institute-setup/InstituteCalendarWorkingDays'),
    'InstituteCalendarWorkingDays'
  ),
  'timetable-framework-shift-setup': rp(
    () => import('../admin/institute-setup/TimetableFrameworkShiftSetup'),
    'TimetableFrameworkShiftSetup'
  ),
  'house-club-co-curricular-group-setup': rp(
    () => import('../admin/institute-setup/HouseClubCoCurricularGroupSetup'),
    'HouseClubCoCurricularGroupSetup'
  ),

  // Billing
  'subscription-overview': rp(
    () => import('../admin/billing/SubscriptionOverview'),
    'SubscriptionOverview'
  ),
  'usage-insights': rp(
    () => import('../admin/billing/UsageInsights'),
    'UsageInsights'
  ),
  'invoice-archive': rp(
    () => import('../admin/billing/InvoiceArchive'),
    'InvoiceArchive'
  ),
  'payment-configuration': rp(
    () => import('../admin/billing/PaymentConfiguration'),
    'PaymentConfiguration'
  )
};