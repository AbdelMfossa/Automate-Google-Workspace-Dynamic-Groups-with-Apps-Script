# Automate Google Workspace Dynamic Groups with Apps Script
Automate your Google Workspace Dynamic Groups (even without an Enterprise licence) with Google Apps Script

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google Workspace](https://img.shields.io/badge/Google%20Workspace-0F9D58?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A lightweight Google Apps Script to automate group membership based on user attributes (like `orgDepartment`). 

This script serves as a powerful workaround for Google Workspace **Business Starter** and **Business Standard** editions, which do not natively support the "Dynamic Groups" feature (reserved for Enterprise editions).

## Features
* **Auto-Discovery:** Scans your Google Workspace Directory for active users matching a specific department.
* **Auto-Sync:** Compares expected members with current group members.
* **Add & Remove:** Automatically adds missing users and removes those who have left the department or the company.
* **Suspended Users Filter:** Excludes suspended accounts from being added to active operational groups.

## Prerequisites
1. A Google Workspace account with **Super Admin** privileges.
2. Access to [Google Apps Script](https://script.google.com/).
3. A standardized user directory (users must have the `Department` field correctly filled in their profiles).

## Installation & Setup

1. Create a new project on [script.google.com](https://script.google.com/).
2. Copy the content of `Code.gs` from this repository into your script editor.
3. **Crucial Step:** Enable the Admin SDK API.
   * On the left sidebar, click the **+** next to **Services**.
   * Search for **Admin SDK API** and click **Add**.
4. (Optional) Copy the `appsscript.json` to match the required OAuth scopes and timezone.

## Configuration
At the top of the `Code.gs` file, update the configuration block with your organization's details:

```javascript
// --- CONFIGURATION ---
const TARGET_GROUP_EMAIL = 'your-group@your-domain.com'; 
const TARGET_DEPARTMENT = 'Operations'; // Must match EXACTLY the Google Directory value (case-sensitive)
const DOMAIN = 'your-domain.com'; 
// ---------------------
```
## Automation (Triggers)
To make the group truly "dynamic", you need to run this script automatically.
1. In the Apps Script editor, go to **Triggers** (the clock icon on the left).
2. Click **Add Trigger** (bottom right).
3. Choose the function syncDynamicGroup.
4. Select event source: **Time-driven**.
5. Select a frequency (e.g., **Day timer** -> Midnight to 1 AM, or **Hour timer**).

## Read the Full Article
For a complete step-by-step tutorial and the philosophy behind this script, read my full article on Medium: [Link](https://medium.com/@abdelmfossa/automatiser-vos-groupes-dynamiques-dans-google-workspace-meme-sans-licence-enterprise-avec-apps-script-cc7d36f35ca8)

## Author
* **Abdel Aziz Mfossa**
* Consultant Cloud & Google Workspace

Feel free to connect or reach out if you need help with Google Workspace automation!

## License
This project is licensed under the MIT License - see the LICENSE file for details.
