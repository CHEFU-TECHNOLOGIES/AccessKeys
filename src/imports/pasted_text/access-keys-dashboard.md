Create a **high-fidelity, production-quality SaaS web application** called **AccessKeys**.

This is an internal security dashboard for an existing **email-sending platform**. Administrators use it to generate, manage, expire, rotate, and revoke secure access keys for employees and workspaces that need access to the existing email application.

The result should look like a **real finished product**, not a wireframe, concept, or generic admin dashboard.

## 1. Design language

Use a premium developer/SaaS aesthetic inspired by products such as **Vercel, Stripe, Linear, GitHub, and Sentry**.

The visual language should be:

* Minimal
* Sophisticated
* Technical
* Trustworthy
* Security-focused
* Clean and spacious
* Excellent typography
* Strong information hierarchy
* Subtle borders
* Very restrained shadows
* Refined hover and active states
* Professional iconography
* Consistent 8px spacing system
* High-quality responsive layouts

Avoid:

* Generic dashboard templates
* Huge decorative illustrations
* Excessive gradients
* Neon colors
* Overly rounded “AI startup” cards
* Excessive glassmorphism
* Fake 3D graphics
* Unnecessary visual decoration

The interface should feel like software that handles **real production credentials**.

## 2. Application shell

Create a persistent application layout with:

### Left sidebar

Logo/product name:

**AccessKeys**

Navigation:

* Overview
* Access Keys
* Employees
* Workspaces
* Activity
* Settings

Bottom section:

* Organization switcher
* Admin profile
* Account menu

The sidebar should collapse responsively.

### Top navigation

Include:

* Page title
* Breadcrumb where appropriate
* Search
* Notifications
* Admin avatar/menu

## 3. Overview dashboard

Create the main dashboard at `/`.

Header:

**Good afternoon, Admin**

Subtitle:

**Manage secure access to your email infrastructure.**

Primary CTA:

**+ Generate access key**

Create four clean statistics cards:

**Active Keys**
`24`

**Expiring Soon**
`3`

**Expired**
`7`

**Revoked**
`12`

Add subtle trend/context information where appropriate.

Below the statistics, create:

### Recent Access Keys

A professional data table with:

* Employee / Workspace
* Key name
* Key
* Status
* Permissions
* Created
* Expires
* Last used
* Actions

Example rows:

`Sarah Mokoena`
`Marketing`
`Campaign Sender`
`FLOW_••••••••9F42`
`Active`
`Send Email`
`Aug 18, 2026`
`Nov 18, 2026`
`12 min ago`

Use realistic sample data.

Add:

* Search
* Status filter
* Workspace filter
* Expiry filter
* Sort
* Pagination

## 4. Generate Access Key flow

This is one of the most important interactions.

When the user clicks:

**Generate Access Key**

open a polished modal/drawer or dedicated creation screen.

Title:

**Generate access key**

Subtitle:

**Create a secure credential for an employee or workspace.**

Fields:

### Employee / Workspace

A searchable combobox.

Example:

`Sarah Mokoena — Marketing`

Allow switching between:

**Employee**

and

**Workspace**

### Key Name

Placeholder:

`e.g. Marketing Email Sender`

### Expiration

Provide selectable options:

* 7 days
* 30 days
* 90 days
* 1 year
* Never
* Custom date

### Permissions

Create a clean permission selector.

Permissions:

* Send emails
* View email logs
* Manage templates
* API access

Show a short description beneath each permission.

Primary button:

**Generate key**

Secondary:

**Cancel**

## 5. Key generated success screen

After generation, transition to a dedicated secure success state.

Header:

**Access key generated**

Description:

**Copy this key now. For security, the complete key will only be shown once.**

Display the full generated key in a secure monospace container:

`FLOW_7f82d9c1••••••••••••••••`

Include:

**Copy key**

as the primary action.

Show a copy confirmation state:

**Copied**

Also provide:

**Download**

and

**Done**

Clearly display a subtle security warning:

**Save this credential somewhere secure. You won't be able to view the complete key again.**

Make this screen feel polished and trustworthy.

## 6. Access Keys page

Create a dedicated `/access-keys` page.

Header:

**Access Keys**

Subtitle:

**Manage credentials that provide access to your email infrastructure.**

Primary button:

**Generate access key**

Create a full-width professional data table.

Columns:

* Name
* Employee / Workspace
* Key
* Status
* Permissions
* Created
* Expires
* Last used
* Actions

Statuses:

**Active**

**Expiring soon**

**Expired**

**Revoked**

Use subtle status indicators.

Each row should have a contextual `•••` menu containing:

* View details
* Copy key
* Regenerate
* Revoke

Do not display complete secrets in the table.

## 7. Key details

Create a detailed key page/drawer.

Header:

**Campaign Sender**

Status:

**Active**

Show:

### Key information

* Key ID
* Employee / Workspace
* Created by
* Created date
* Expiry date
* Last used
* Created from
* Permissions

Secret:

`FLOW_••••••••••••9F42`

Button:

**Copy**

Create a security section:

### Credential management

**Regenerate key**

Description:

Generate a new credential and invalidate the current one.

**Revoke key**

Description:

Immediately remove access associated with this credential.

Make revoke visually destructive but still professional.

## 8. Revoke confirmation

Create a high-quality confirmation modal.

Title:

**Revoke access key?**

Message:

**This key will immediately stop working. Any application or employee using this credential will lose access. This action cannot be undone.**

Buttons:

**Cancel**

**Revoke key**

Make the destructive action unmistakable.

## 9. Employees page

Create `/employees`.

Header:

**Employees**

Subtitle:

**Manage people who have access to your email infrastructure.**

Primary button:

**Add employee**

Table:

* Employee
* Email
* Workspace
* Active keys
* Last activity
* Status
* Actions

Example employees:

* Sarah Mokoena
* James Nkosi
* Michael Dlamini
* Emily van der Merwe

Clicking an employee should open a profile/details view showing:

* Employee information
* Assigned workspace
* Active keys
* Recent activity
* Access status

## 10. Workspaces page

Create `/workspaces`.

Show workspace cards or a clean table.

Example:

**Marketing**
12 members
8 active keys

**Engineering**
18 members
11 active keys

**Operations**
7 members
5 active keys

Each workspace should show:

* Name
* Members
* Active keys
* Last activity
* Status

Include:

**Create workspace**

## 11. Activity / Audit Log

Create `/activity`.

Header:

**Activity**

Subtitle:

**Track security and access events across your organization.**

Create a professional audit log.

Events:

* Access key generated
* Access key revoked
* Access key regenerated
* Key expired
* Employee added
* Employee removed
* Permission changed
* Workspace created

Each event displays:

* Event
* Actor
* Employee / Workspace
* Timestamp
* IP address
* Result

Example:

**Access key generated**

Sarah Mokoena

2 minutes ago

`196.24.xxx.xxx`

**Successful**

Include filtering by:

* Event
* Actor
* Workspace
* Date

## 12. Settings

Create `/settings`.

Sections:

### Organization

* Organization name
* Organization ID
* Default workspace

### Security

* Key expiration policy
* Require expiration
* Maximum key lifetime
* Session timeout

### Notifications

* Expiring key notifications
* Key revoked notifications
* Security alerts

## 13. Responsive behavior

Design the complete experience responsively.

Desktop:

* Persistent sidebar
* Full data tables
* Multi-column dashboard

Tablet:

* Collapsible sidebar
* Condensed tables

Mobile:

* Bottom navigation or compact navigation
* Cards instead of overly compressed tables
* Full-screen modals
* Touch-friendly controls

Make sure nothing feels like a desktop interface simply squeezed onto a phone.

## 14. States

Create polished states for:

* Loading
* Skeleton loading
* Empty
* Success
* Error
* Expired key
* Revoked key
* Expiring key
* No employees
* No workspaces
* No activity

Example empty state:

**No access keys**

Create your first credential to give an employee or workspace secure access to the email platform.

**Generate access key**

## 15. Interaction design

Make the prototype interactive.

At minimum:

* Sidebar navigation works
* Generate key button opens creation flow
* Employee/workspace selector works
* Expiration selector works
* Permission selectors work
* Generate button transitions to success screen
* Copy key changes to “Copied”
* Access key rows open details
* Actions menus open
* Revoke opens confirmation
* Revoke changes key status to Revoked
* Search/filter controls visually respond
* Workspace/employee navigation works
* Settings controls respond

Use realistic transitions and subtle animations.

## 16. Component system

Create reusable components rather than designing every screen independently.

Components should include:

* Sidebar
* Topbar
* Buttons
* Inputs
* Combobox
* Select
* Dropdown
* Modal
* Drawer
* Data table
* Status badge
* Statistic card
* Toast
* Tabs
* Avatar
* Tooltip
* Confirmation dialog
* Permission selector
* Empty state
* Loading state

Maintain consistent spacing, typography, borders, radii, icons, and interaction states throughout the application.

## 17. Security-focused UX

This application manages credentials, so security should be obvious throughout the interface.

Important rules:

* Never show complete secret keys in normal tables
* Mask keys everywhere except the one-time generation screen
* Make expiration highly visible
* Make revocation clearly destructive
* Provide clear regeneration behavior
* Show audit history
* Use monospace typography for key identifiers
* Avoid accidentally exposing secrets through unnecessary UI
* Make copy-to-clipboard interactions obvious
* Clearly communicate one-time secret visibility

## 18. Final quality bar

Do not stop at creating a few attractive screens.

Design a **complete, coherent product experience** with connected screens and realistic interactions.

The finished result should look like something a professional developer-tools company could launch publicly.

Prioritize:

**Premium UI + excellent UX + security + clarity + consistency + realistic data + responsive behavior.**

The user should immediately understand:

**Who has access → Which credentials exist → What they can do → When access expires → What happened → How to safely manage access.**

Build the design as if this will become the actual production interface for a real email infrastructure platform.
