/**
 * Automatic synchronization of group members based on their department.
 * Use case: Workaround for the "Dynamic Groups" feature.
 */

function syncDynamicGroup() {
  // --- CONFIGURATION ---
  const TARGET_GROUP_EMAIL = 'your-group@your-domain.com'; 
  const TARGET_DEPARTMENT = 'Operations'; // Must match EXACTLY the Google Directory value (case-sensitive)
  const DOMAIN = 'your-domain.com'; 
  // ---------------------

  Logger.log(`Starting synchronization for group: ${TARGET_GROUP_EMAIL}`);

  // 1. Retrieve all active users from the target department
  let expectedMembers = new Set();
  let pageToken;

  do {
    const response = AdminDirectory.Users.list({
      domain: DOMAIN,
      query: `orgDepartment='${TARGET_DEPARTMENT}' isSuspended=false`, // Exclude suspended accounts
      maxResults: 100,
      pageToken: pageToken
    });

    const users = response.users || [];
    users.forEach(user => {
      expectedMembers.add(user.primaryEmail);
    });
    pageToken = response.nextPageToken;
  } while (pageToken);

  Logger.log(`${expectedMembers.size} users found in department '${TARGET_DEPARTMENT}'.`);

  // 2. Retrieve current group members
  let currentMembers = new Set();
  pageToken = null;

  do {
    try {
      const response = AdminDirectory.Members.list(TARGET_GROUP_EMAIL, {
        maxResults: 100,
        pageToken: pageToken
      });

      const members = response.members || [];
      members.forEach(member => {
        // Only store user members (to avoid accidentally deleting nested groups)
        if (member.type === 'USER') {
          currentMembers.add(member.email);
        }
      });
      pageToken = response.nextPageToken;
    } catch (e) {
      Logger.log(`Error reading the group (does it exist?): ${e.message}`);
      return;
    }
  } while (pageToken);

  // 3. Add missing members
  expectedMembers.forEach(email => {
    if (!currentMembers.has(email)) {
      try {
        AdminDirectory.Members.insert({
          email: email,
          role: 'MEMBER'
        }, TARGET_GROUP_EMAIL);
        Logger.log(`✅ Added: ${email}`);
      } catch (e) {
        Logger.log(`❌ Error adding ${email}: ${e.message}`);
      }
    }
  });

  // 4. Remove users who are no longer in the department
  currentMembers.forEach(email => {
    if (!expectedMembers.has(email)) {
      try {
        AdminDirectory.Members.remove(TARGET_GROUP_EMAIL, email);
        Logger.log(`🗑️ Removed: ${email}`);
      } catch (e) {
        Logger.log(`❌ Error removing ${email}: ${e.message}`);
      }
    }
  });

  Logger.log('Synchronization completed successfully.');
}
