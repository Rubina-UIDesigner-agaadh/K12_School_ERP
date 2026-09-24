import { rp } from './registryHelper';

export const myDetailsRegistry: Record<string, () => any> = {
  // Communication
  'my-messages-inbox': rp(
    () => import('../my-details/communication/MyMessagesInbox'),
    'MyMessagesInbox'
  ),
  'my-sent-drafts': rp(
    () => import('../my-details/communication/MySentDrafts'),
    'MySentDrafts'
  ),
  'my-notification-centre': rp(
    () => import('../my-details/communication/MyNotificationCentre'),
    'MyNotificationCentre'
  ),
  'my-announcement-subscriptions': rp(
    () => import('../my-details/communication/MyAnnouncementSubscriptions'),
    'MyAnnouncementSubscriptions'
  ),
  'my-meeting-requests': rp(
    () => import('../my-details/communication/MyMeetingRequests'),
    'MyMeetingRequests'
  ),
  'my-communication-history': rp(
    () => import('../my-details/communication/MyCommunicationHistory'),
    'MyCommunicationHistory'
  ),
  'my-feedback-suggestions': rp(
    () => import('../my-details/communication/MyFeedbackSuggestions'),
    'MyFeedbackSuggestions'
  ),

  // Policies & Forms
  'my-policy-library': rp(
    () => import('../my-details/policies-forms/MyPolicyLibrary'),
    'MyPolicyLibrary'
  ),
  'my-code-of-conduct': rp(
    () => import('../my-details/policies-forms/MyCodeOfConduct'),
    'MyCodeOfConduct'
  ),
  'my-health-safety-policies': rp(
    () => import('../my-details/policies-forms/MyHealthSafetyPolicies'),
    'MyHealthSafetyPolicies'
  ),
  'my-it-privacy-policies': rp(
    () => import('../my-details/policies-forms/MyItPrivacyPolicies'),
    'MyItPrivacyPolicies'
  ),
  'my-forms-library': rp(
    () => import('../my-details/policies-forms/MyFormsLibrary'),
    'MyFormsLibrary'
  ),
  'my-online-form-submissions': rp(
    () => import('../my-details/policies-forms/MyOnlineFormSubmissions'),
    'MyOnlineFormSubmissions'
  ),
  'my-policy-acknowledgements': rp(
    () => import('../my-details/policies-forms/MyPolicyAcknowledgements'),
    'MyPolicyAcknowledgements'
  ),

  // Settings
  'my-account-settings': rp(
    () => import('../my-details/settings/MyAccountSettings'),
    'MyAccountSettings'
  ),
  'my-password-security': rp(
    () => import('../my-details/settings/MyPasswordSecurity'),
    'MyPasswordSecurity'
  ),
  'my-notification-preferences': rp(
    () => import('../my-details/settings/MyNotificationPreferences'),
    'MyNotificationPreferences'
  ),
  'my-display-language': rp(
    () => import('../my-details/settings/MyDisplayLanguage'),
    'MyDisplayLanguage'
  ),
  'my-linked-accounts': rp(
    () => import('../my-details/settings/MyLinkedAccounts'),
    'MyLinkedAccounts'
  ),
  'my-device-sessions': rp(
    () => import('../my-details/settings/MyDeviceSessions'),
    'MyDeviceSessions'
  ),
  'my-data-access-log': rp(
    () => import('../my-details/settings/MyDataAccessLog'),
    'MyDataAccessLog'
  )
};