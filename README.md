# Gmail Analysis and Management Tool

A comprehensive Google Apps Script for analyzing, managing, and automating your Gmail inbox.

## Features

### 📊 Email Pattern Analysis
- Analyze email senders and their frequency
- Identify most active senders
- Track email timing patterns (hour of day, day of week)
- Calculate average emails per week from each sender
- Discover when you receive the most emails

### 📧 Bulk Unsubscribe
- Automatically find all emails with unsubscribe links
- Batch process unsubscribe requests
- Archive unwanted subscription emails
- Track and manage newsletter subscriptions

### 📤 CSV Export
- Export complete email data to CSV format
- Include metadata: date, time, sender, subject, labels
- Track attachments and read status
- Perfect for external analysis in Excel, Python, or R

### 🗑️ Auto-Delete/Archive
- Create custom rules for automatic email management
- Delete old promotional emails automatically
- Archive read social media notifications
- Clean up large attachments
- Configure multiple criteria-based rules

### 🔄 Duplicate Email Detection
- Find emails with same subject + sender + similar time
- Identify forwarded email chains
- Detect CC'd/BCC'd duplicates across threads
- Bulk delete or archive duplicate emails
- Free up Gmail storage space

### 📈 Custom Reports
- Comprehensive inbox statistics
- Top sender domains analysis
- Email distribution by hour and day
- Label usage statistics
- Visual insights into your email habits

## Installation

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Gmail Analyzer"

### Step 2: Add the Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `GmailAnalyzer.gs`
4. Paste it into the Apps Script editor
5. Click the **Save** button (💾)
6. Name your project "Gmail Analyzer"

### Step 3: Grant Permissions

1. Click **Run** > **Run function** > **testAnalyzer**
2. You'll see a dialog: "Authorization required"
3. Click **Review Permissions**
4. Select your Google account
5. Click **Advanced** > **Go to Gmail Analyzer (unsafe)**
6. Click **Allow**

The script now has permission to access your Gmail account.

### Step 4: Refresh Your Sheet

1. Close and reopen your Google Sheet
2. You should now see a new menu: **Gmail Analyzer**

## Usage

### 📊 Analyze Email Patterns

**Menu:** Gmail Analyzer > 📊 Analyze Email Patterns

This analyzes the last 90 days of emails and creates a report showing:
- Each sender's email and name
- Total email count from each sender
- Date range of emails
- Average emails per week
- Most active time of day
- Most active day of week

**Output:** Creates/updates "Email Pattern Analysis" sheet

**Use Case:** Find out who emails you the most and when they typically send emails.

### 📧 Export to CSV

**Menu:** Gmail Analyzer > 📧 Export to CSV

Exports detailed email data including:
- Date and time of each email
- Sender information
- Recipients
- Subject lines
- Labels
- Read status
- Attachment status
- Thread and message IDs

**Output:** Creates/updates "Email Export" sheet

**Download:** File > Download > Comma Separated Values (.csv)

**Use Case:** Perform advanced analysis in Excel, import into a database, or use with data analysis tools.

### 🔍 Find Unsubscribe Links

**Menu:** Gmail Analyzer > 🔍 Find Unsubscribe Links

Searches your inbox for emails containing unsubscribe links and creates a list with:
- Checkboxes to select emails
- Sender details
- Subject lines
- Extracted unsubscribe links
- Thread IDs

**Output:** Creates/updates "Unsubscribe Links" sheet

**Use Case:** Identify all newsletter and promotional subscriptions in one place.

### 🗑️ Bulk Unsubscribe

**Menu:** Gmail Analyzer > 🗑️ Bulk Unsubscribe

**Prerequisites:** Run "Find Unsubscribe Links" first

**Steps:**
1. Go to the "Unsubscribe Links" sheet
2. Check the boxes next to emails you want to unsubscribe from
3. Run this function from the menu
4. The function will:
   - Log all unsubscribe links (check View > Logs)
   - Archive the selected threads

**Note:** You'll need to manually click the unsubscribe links logged in the execution log. Automated clicking is not possible due to security restrictions.

**Use Case:** Clean up your inbox from unwanted subscriptions in bulk.

### 🗂️ Auto Archive/Delete

**Menu:** Gmail Analyzer > 🗂️ Auto Archive/Delete

Creates and executes automated rules for email management.

**First Run:** Creates default rules in "Auto-Manage Rules" sheet

**Default Rules (disabled by default):**
- Delete read promotional emails older than 30 days
- Archive read social emails older than 60 days
- Archive read update emails older than 90 days
- Archive read emails with large attachments (>10MB) older than 180 days
- Delete read "noreply" emails older than 14 days
- Delete read newsletters older than 30 days

**Customization:**
1. Go to "Auto-Manage Rules" sheet
2. Enable rules by checking the "Enabled" column
3. Modify queries, actions, or day thresholds as needed
4. Add new custom rules

**Gmail Query Examples:**
- `category:promotions is:read` - Promotional emails that have been read
- `from:example.com` - Emails from a specific domain
- `subject:"daily digest"` - Emails with specific subject text
- `has:attachment larger:5M` - Emails with attachments larger than 5MB
- `is:unread older_than:30d` - Unread emails older than 30 days

**Use Case:** Automatically maintain a clean inbox by removing old, read emails based on categories.

### 📈 Generate Reports

**Menu:** Gmail Analyzer > 📈 Generate Reports

Generates a comprehensive statistical report including:
- **Summary Statistics:** Total threads, messages, unread count, attachment stats
- **Top 10 Sender Domains:** Which domains email you the most
- **Email Distribution by Hour:** When you receive the most emails (0-23 hours)
- **Email Distribution by Day:** Which days are busiest (Monday-Sunday)
- **Top 10 Labels:** Most-used labels in your inbox

**Output:** Creates/updates "Inbox Statistics" sheet

**Use Case:** Understand your email patterns and optimize your inbox management strategy.

### 🔄 Find Duplicate Emails

**Menu:** Gmail Analyzer > 🔄 Find Duplicate Emails

Scans your inbox for duplicate emails and groups them for review:
- **Exact Duplicates:** Same sender, subject, and timestamp
- **Near Duplicates:** Same sender/subject within 5 minutes
- **Forwarded Chains:** Multiple "Fwd:" versions of same email
- **CC'd/BCC'd Duplicates:** Same email received via different methods

**Output:** Creates/updates "Duplicate Emails" sheet with:
- Interactive checkboxes for selection (oldest unchecked by default)
- Duplicate type classification
- Storage space calculations
- Color-coded groups for easy review

**Use Case:** Find and remove duplicate emails to free up Gmail storage and clean up your inbox.

### 🧹 Clean Up Duplicates

**Menu:** Gmail Analyzer > 🧹 Clean Up Duplicates

**Prerequisites:** Run "Find Duplicate Emails" first

**Steps:**
1. Review the "Duplicate Emails" sheet
2. Adjust checkboxes (checked = will be removed, unchecked = keep)
3. Run this function from the menu
4. Confirm the action
5. Choose to DELETE (move to trash) or ARCHIVE

**Safety Features:**
- Oldest email in each group is kept by default
- Confirmation dialog before any action
- Option to archive instead of delete
- Detailed summary of actions taken

**Use Case:** Bulk remove selected duplicates to reclaim storage space and organize your inbox.

**See Also:** Check `DUPLICATE_DETECTION.md` for detailed guide and advanced usage.

## Configuration

You can modify the configuration constants at the top of the script:

```javascript
const CONFIG = {
  MAX_THREADS: 500,           // Maximum threads to process per run
  DAYS_TO_ANALYZE: 90,        // Default days to analyze
  BATCH_SIZE: 100,            // Batch size for processing
  REPORT_FOLDER: 'Gmail Reports', // Folder name for reports
  DUPLICATE_TIME_WINDOW: 300, // Seconds to consider emails as duplicates (5 min)
  SIMILARITY_THRESHOLD: 0.85  // Subject similarity threshold (0-1)
};
```

To analyze different time periods, you can modify the `DAYS_TO_ANALYZE` value, or call functions directly from the script editor with custom parameters.

## Advanced Usage

### Running Functions Programmatically

You can run functions directly from the Apps Script editor with custom parameters:

```javascript
// Analyze last 30 days instead of default 90
analyzeEmailPatterns(30);

// Export last 7 days
exportEmailsToCSV(7);

// Generate report for last 180 days
generateInboxReport(180);

// Find duplicates in last 60 days
findDuplicateEmails(60);
```

### Automated Scheduling

You can set up automatic execution using Apps Script triggers:

1. In Apps Script editor, click **Triggers** (clock icon)
2. Click **+ Add Trigger**
3. Choose function to run (e.g., `autoManageEmails`)
4. Select event source: **Time-driven**
5. Choose frequency (e.g., daily, weekly)
6. Click **Save**

**Example:** Run `autoManageEmails()` daily to automatically clean up your inbox.

### Gmail Query Syntax Reference

The auto-manage feature uses Gmail's search operators:

- `from:` - Emails from a specific sender
- `to:` - Emails to a specific recipient
- `subject:` - Words in the subject line
- `label:` - Emails with a specific label
- `category:` - Categories (promotions, social, updates, forums)
- `has:attachment` - Emails with attachments
- `larger:` - Emails larger than specified size (e.g., `larger:10M`)
- `smaller:` - Emails smaller than specified size
- `is:read` / `is:unread` - Read/unread status
- `is:starred` - Starred emails
- `is:important` - Important emails
- `older_than:` - Emails older than specified period (e.g., `older_than:30d`)
- `newer_than:` - Emails newer than specified period
- `before:` / `after:` - Date ranges (YYYY/MM/DD format)

**Combine with AND/OR:**
- `category:promotions is:read` - Promotional emails that are read
- `from:noreply OR from:no-reply` - Emails from noreply addresses
- `has:attachment larger:5M` - Attachments larger than 5MB

## Limitations

### Gmail API Quotas

Google Apps Script has daily quotas:
- **Gmail Read/Write:** 20,000 emails per day (consumer accounts)
- **Script Runtime:** 6 minutes per execution (consumer accounts)
- **Trigger Runtime:** 90 minutes total per day

If you have a very large inbox, you may need to:
- Run the script multiple times
- Reduce `MAX_THREADS` or `DAYS_TO_ANALYZE`
- Use more specific Gmail queries to filter emails

### Unsubscribe Automation

Due to security restrictions, the script cannot automatically click unsubscribe links. You must:
1. Run "Find Unsubscribe Links" to identify subscriptions
2. Run "Bulk Unsubscribe" to log the links and archive emails
3. Manually visit the logged unsubscribe URLs (View > Logs)

Alternatively, you can use Gmail's built-in "Unsubscribe" button that appears on some emails.

## Troubleshooting

### "Exception: Service invoked too many times"

This means you've hit the quota limit. Solutions:
- Wait 24 hours for quota to reset
- Reduce `MAX_THREADS` in the CONFIG
- Process fewer days at a time

### "TypeError: Cannot read property 'length' of null"

This usually means no emails were found matching the criteria:
- Check your date range
- Verify your Gmail query syntax
- Ensure you have emails in the specified period

### Permissions Dialog Appears Again

If you see the authorization dialog again:
- Your script may have been updated
- You may need to reauthorize
- Follow Step 3 of installation again

### Function Not Found in Menu

If the menu doesn't appear:
- Close and reopen the Google Sheet
- Check that the script is saved
- Run `onOpen()` manually from the script editor

## Privacy & Security

- **All data stays in your Google account** - nothing is sent to external servers
- The script only accesses your Gmail messages
- All analysis is performed client-side in Google Apps Script
- You can review the entire source code before running
- Revoke access anytime: [Google Account Permissions](https://myaccount.google.com/permissions)

## Tips & Best Practices

1. **Start Small:** Test with 7-30 days before analyzing 90+ days
2. **Regular Cleanup:** Run auto-manage weekly to keep inbox clean
3. **Custom Rules:** Tailor auto-manage rules to your email habits
4. **Export Regularly:** Back up important email data to CSV
5. **Monitor Patterns:** Check pattern analysis monthly to identify trends
6. **Unsubscribe Ruthlessly:** Use bulk unsubscribe to eliminate noise
7. **Use Labels:** Organize with labels, then use reports to track usage

## Support

For issues, questions, or contributions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Open an issue on GitHub if you find bugs

## License

This script is provided as-is for personal use. Feel free to modify and adapt to your needs.

---

**Happy Email Managing!** 📧✨
