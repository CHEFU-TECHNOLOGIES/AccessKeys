export type KeyStatus = 'active' | 'expiring_soon' | 'expired' | 'revoked';
export type Permission = 'send_email' | 'view_logs' | 'manage_templates' | 'api_access';
export type ActivityType =
  | 'key_generated' | 'key_revoked' | 'key_regenerated' | 'key_expired'
  | 'employee_added' | 'employee_removed' | 'permission_changed' | 'workspace_created';

export interface AccessKey {
  id: string;
  name: string;
  employee: string;
  employeeId: string;
  workspace: string;
  keyMasked: string;
  keyLastFour: string;
  status: KeyStatus;
  permissions: Permission[];
  created: string;
  expires: string | null;
  lastUsed: string;
  createdBy: string;
  createdFrom: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  workspace: string;
  workspaceId: string;
  activeKeys: number;
  lastActivity: string;
  status: 'active' | 'inactive';
  role: string;
  joinedDate: string;
}

export interface Workspace {
  id: string;
  name: string;
  members: number;
  activeKeys: number;
  lastActivity: string;
  status: 'active' | 'inactive';
  description: string;
  createdDate: string;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  event: string;
  actor: string;
  target: string;
  workspace: string;
  timestamp: string;
  ip: string;
  result: 'success' | 'failed';
}

export const PERMISSION_LABELS: Record<Permission, string> = {
  send_email: 'Send emails',
  view_logs: 'View email logs',
  manage_templates: 'Manage templates',
  api_access: 'API access',
};

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  send_email: 'Send transactional and marketing emails via the platform',
  view_logs: 'Access delivery reports, bounces, and event logs',
  manage_templates: 'Create, edit, and delete email templates',
  api_access: 'Direct API access for programmatic integrations',
};

export const employees: Employee[] = [
  { id: 'emp_01', name: 'Sarah Mokoena', email: 'sarah.mokoena@company.io', workspace: 'Marketing', workspaceId: 'ws_01', activeKeys: 2, lastActivity: '12 min ago', status: 'active', role: 'Campaign Manager', joinedDate: 'Mar 12, 2025' },
  { id: 'emp_02', name: 'James Nkosi', email: 'james.nkosi@company.io', workspace: 'Engineering', workspaceId: 'ws_02', activeKeys: 3, lastActivity: '2 hours ago', status: 'active', role: 'Senior Engineer', joinedDate: 'Jan 5, 2025' },
  { id: 'emp_03', name: 'Michael Dlamini', email: 'michael.dlamini@company.io', workspace: 'Engineering', workspaceId: 'ws_02', activeKeys: 1, lastActivity: '3 days ago', status: 'active', role: 'DevOps Engineer', joinedDate: 'Apr 18, 2025' },
  { id: 'emp_04', name: 'Emily van der Merwe', email: 'emily.vandermerwe@company.io', workspace: 'Operations', workspaceId: 'ws_03', activeKeys: 1, lastActivity: '1 day ago', status: 'active', role: 'Operations Lead', joinedDate: 'Feb 28, 2025' },
  { id: 'emp_05', name: 'Thabo Sithole', email: 'thabo.sithole@company.io', workspace: 'Marketing', workspaceId: 'ws_01', activeKeys: 0, lastActivity: '12 days ago', status: 'inactive', role: 'Content Strategist', joinedDate: 'May 3, 2025' },
  { id: 'emp_06', name: 'Nomsa Khumalo', email: 'nomsa.khumalo@company.io', workspace: 'Engineering', workspaceId: 'ws_02', activeKeys: 2, lastActivity: '5 hours ago', status: 'active', role: 'Backend Engineer', joinedDate: 'Jun 10, 2025' },
  { id: 'emp_07', name: 'Andile Ntuli', email: 'andile.ntuli@company.io', workspace: 'Operations', workspaceId: 'ws_03', activeKeys: 1, lastActivity: '8 hours ago', status: 'active', role: 'Systems Analyst', joinedDate: 'Jul 22, 2025' },
  { id: 'emp_08', name: 'Precious Molefe', email: 'precious.molefe@company.io', workspace: 'Support', workspaceId: 'ws_04', activeKeys: 1, lastActivity: '30 min ago', status: 'active', role: 'Support Lead', joinedDate: 'Aug 1, 2025' },
];

export const workspaces: Workspace[] = [
  { id: 'ws_01', name: 'Marketing', members: 12, activeKeys: 8, lastActivity: '12 min ago', status: 'active', description: 'Campaign and communication teams', createdDate: 'Jan 2, 2025' },
  { id: 'ws_02', name: 'Engineering', members: 18, activeKeys: 11, lastActivity: '2 hours ago', status: 'active', description: 'Platform and infrastructure engineering', createdDate: 'Jan 2, 2025' },
  { id: 'ws_03', name: 'Operations', members: 7, activeKeys: 5, lastActivity: '1 day ago', status: 'active', description: 'Internal operations and systems', createdDate: 'Feb 14, 2025' },
  { id: 'ws_04', name: 'Support', members: 5, activeKeys: 2, lastActivity: '30 min ago', status: 'active', description: 'Customer support and success', createdDate: 'Mar 1, 2025' },
  { id: 'ws_05', name: 'Analytics', members: 4, activeKeys: 3, lastActivity: '4 hours ago', status: 'active', description: 'Data analytics and reporting', createdDate: 'Apr 5, 2025' },
];

export const accessKeys: AccessKey[] = [
  { id: 'ak_01', name: 'Campaign Sender', employee: 'Sarah Mokoena', employeeId: 'emp_01', workspace: 'Marketing', keyMasked: 'FLOW_••••••••••••9F42', keyLastFour: '9F42', status: 'active', permissions: ['send_email'], created: 'Aug 18, 2026', expires: 'Nov 18, 2026', lastUsed: '12 min ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_02', name: 'Analytics Viewer', employee: 'James Nkosi', employeeId: 'emp_02', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••K71B', keyLastFour: 'K71B', status: 'active', permissions: [ 'view_logs'], created: 'Aug 10, 2026', expires: 'Sep 10, 2026', lastUsed: '2 hours ago', createdBy: 'Admin', createdFrom: 'API' },
  { id: 'ak_03', name: 'Template Manager', employee: 'Emily van der Merwe', employeeId: 'emp_04', workspace: 'Operations', keyMasked: 'FLOW_••••••••••••M85C', keyLastFour: 'M85C', status: 'expiring_soon', permissions: ['manage_templates', 'send_email'], created: 'Jun 1, 2026', expires: 'Sep 1, 2026', lastUsed: '1 day ago', createdBy: 'Sarah Mokoena', createdFrom: 'Dashboard' },
  { id: 'ak_04', name: 'Dev API Access', employee: 'Michael Dlamini', employeeId: 'emp_03', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••N93A', keyLastFour: 'N93A', status: 'active', permissions: ['api_access', 'send_email', 'view_logs'], created: 'Jul 15, 2026', expires: 'Jul 15, 2027', lastUsed: '3 days ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_05', name: 'Newsletter Key', employee: 'Sarah Mokoena', employeeId: 'emp_01', workspace: 'Marketing', keyMasked: 'FLOW_••••••••••••P64D', keyLastFour: 'P64D', status: 'revoked', permissions: ['send_email'], created: 'Jan 1, 2026', expires: 'Jul 1, 2026', lastUsed: '45 days ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_06', name: 'Reporting Access', employee: 'James Nkosi', employeeId: 'emp_02', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••Q17E', keyLastFour: 'Q17E', status: 'expired', permissions: ['send_email'], created: 'Feb 1, 2026', expires: 'May 1, 2026', lastUsed: '92 days ago', createdBy: 'Admin', createdFrom: 'API' },
  { id: 'ak_07', name: 'Email Automation', employee: 'Nomsa Khumalo', employeeId: 'emp_06', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••R28F', keyLastFour: 'R28F', status: 'active', permissions: ['send_email', 'manage_templates', 'api_access'], created: 'Aug 1, 2026', expires: 'Feb 1, 2027', lastUsed: '5 hours ago', createdBy: 'James Nkosi', createdFrom: 'Dashboard' },
  { id: 'ak_08', name: 'Support Sender', employee: 'Precious Molefe', employeeId: 'emp_08', workspace: 'Support', keyMasked: 'FLOW_••••••••••••S39G', keyLastFour: 'S39G', status: 'active', permissions: ['send_email', 'view_logs'], created: 'Aug 5, 2026', expires: 'Nov 5, 2026', lastUsed: '30 min ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_09', name: 'Analytics Full Access', employee: 'Andile Ntuli', employeeId: 'emp_07', workspace: 'Operations', keyMasked: 'FLOW_••••••••••••T40H', keyLastFour: 'T40H', status: 'active', permissions: [ 'view_logs'], created: 'Jul 22, 2026', expires: 'Oct 22, 2026', lastUsed: '8 hours ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_10', name: 'CI/CD Mailer', employee: 'Michael Dlamini', employeeId: 'emp_03', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••U51I', keyLastFour: 'U51I', status: 'expiring_soon', permissions: ['send_email', 'api_access'], created: 'Jun 15, 2026', expires: 'Sep 15, 2026', lastUsed: '1 day ago', createdBy: 'James Nkosi', createdFrom: 'API' },
  { id: 'ak_11', name: 'Old Dev Key', employee: 'James Nkosi', employeeId: 'emp_02', workspace: 'Engineering', keyMasked: 'FLOW_••••••••••••V62J', keyLastFour: 'V62J', status: 'revoked', permissions: ['api_access', 'send_email', 'view_logs',  'manage_templates'], created: 'Dec 1, 2025', expires: null, lastUsed: '120 days ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
  { id: 'ak_12', name: 'Marketing Campaigns', employee: 'Thabo Sithole', employeeId: 'emp_05', workspace: 'Marketing', keyMasked: 'FLOW_••••••••••••W73K', keyLastFour: 'W73K', status: 'revoked', permissions: ['send_email', 'manage_templates'], created: 'Apr 10, 2026', expires: 'Oct 10, 2026', lastUsed: '60 days ago', createdBy: 'Admin', createdFrom: 'Dashboard' },
];

export const activityEvents: ActivityEvent[] = [
  { id: 'evt_01', type: 'key_generated', event: 'Access key generated', actor: 'Admin', target: 'Campaign Sender', workspace: 'Marketing', timestamp: '2 min ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_02', type: 'key_generated', event: 'Access key generated', actor: 'Admin', target: 'Analytics Viewer', workspace: 'Engineering', timestamp: '18 min ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_03', type: 'key_revoked', event: 'Access key revoked', actor: 'Admin', target: 'Newsletter Key', workspace: 'Marketing', timestamp: '2 hours ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_04', type: 'key_generated', event: 'Access key generated', actor: 'James Nkosi', target: 'Email Automation', workspace: 'Engineering', timestamp: '1 day ago', ip: '41.203.xxx.xxx', result: 'success' },
  { id: 'evt_05', type: 'key_expired', event: 'Access key expired', actor: 'System', target: 'Reporting Access', workspace: 'Engineering', timestamp: '2 days ago', ip: '—', result: 'success' },
  { id: 'evt_06', type: 'employee_added', event: 'Employee added', actor: 'Admin', target: 'Precious Molefe', workspace: 'Support', timestamp: '3 days ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_07', type: 'key_regenerated', event: 'Access key regenerated', actor: 'Admin', target: 'Dev API Access', workspace: 'Engineering', timestamp: '5 days ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_08', type: 'permission_changed', event: 'Permission changed', actor: 'Admin', target: 'Template Manager', workspace: 'Operations', timestamp: '1 week ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_09', type: 'workspace_created', event: 'Workspace created', actor: 'Admin', target: 'Analytics', workspace: 'Analytics', timestamp: '1 week ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_10', type: 'key_revoked', event: 'Access key revoked', actor: 'Admin', target: 'Old Dev Key', workspace: 'Engineering', timestamp: '2 weeks ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_11', type: 'employee_added', event: 'Employee added', actor: 'Admin', target: 'Andile Ntuli', workspace: 'Operations', timestamp: '3 weeks ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_12', type: 'key_generated', event: 'Access key generated', actor: 'Sarah Mokoena', target: 'Template Manager', workspace: 'Operations', timestamp: '3 weeks ago', ip: '105.214.xxx.xxx', result: 'success' },
  { id: 'evt_13', type: 'permission_changed', event: 'Permission changed', actor: 'Admin', target: 'Support Sender', workspace: 'Support', timestamp: '1 month ago', ip: '196.24.xxx.xxx', result: 'success' },
  { id: 'evt_14', type: 'key_revoked', event: 'Access key revoked', actor: 'Admin', target: 'Marketing Campaigns', workspace: 'Marketing', timestamp: '1 month ago', ip: '196.24.xxx.xxx', result: 'failed' },
  { id: 'evt_15', type: 'employee_removed', event: 'Employee removed', actor: 'Admin', target: 'Former Employee', workspace: 'Marketing', timestamp: '2 months ago', ip: '196.24.xxx.xxx', result: 'success' },
];
