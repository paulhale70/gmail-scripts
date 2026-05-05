# Visual Dashboard & Filter Builder Guide

Complete guide for the visual analytics dashboard and saved query system.

## Overview

Two powerful new features to enhance your Gmail analysis:

### 📊 Visual Dashboard
- Interactive charts and graphs
- Email patterns visualization
- Storage usage analysis
- Trend identification

### 🔍 Filter Builder / Saved Queries
- Save frequently used searches
- Query template library
- One-click access to complex searches
- Batch query execution

---

## 📊 Visual Dashboard

### What It Does

Creates a visual analytics dashboard with 4 interactive charts and summary statistics:

1. **Top 10 Senders Pie Chart** - See who emails you most at a glance
2. **Email Distribution by Hour** - Column chart showing hourly patterns
3. **Email Distribution by Day** - Bar chart showing weekly patterns
4. **Top 10 Sender Domains** - Bar chart of most common domains
5. **Summary Statistics Card** - Key metrics overview

### Usage

**Menu:** Gmail Analyzer > 📊 Visual Dashboard

1. Click the menu option
2. Wait for analysis (30-90 seconds)
3. View the "Visual Dashboard" sheet
4. See interactive charts!

### What You'll See

#### Chart 1: Top 10 Senders (Pie Chart)
- 3D pie chart visualization
- Shows email distribution by sender
- Hover over slices for details
- Legend on the right

**Use Case:** Quickly identify who dominates your inbox

#### Chart 2: Emails by Hour of Day (Column Chart)
- 24-hour distribution (0:00 - 23:00)
- Column height = number of emails
- Identifies peak email times
- Blue color scheme

**Use Cases:**
- Find when you get most emails
- Schedule focused work during quiet hours
- Understand communication patterns

#### Chart 3: Emails by Day of Week (Bar Chart)
- Monday through Sunday distribution
- Horizontal bars for easy comparison
- Green color scheme
- Shows weekly patterns

**Use Cases:**
- Identify busiest days
- Plan email processing time
- Understand work/life patterns

#### Chart 4: Top 10 Sender Domains (Bar Chart)
- Most common email domains
- Horizontal bars sorted by count
- Yellow/orange color scheme
- Shows organizational patterns

**Use Cases:**
- Identify work vs personal email ratio
- See which services email you most
- Understand email sources

#### Summary Statistics Card

Located on the right side, shows:
- **Total Threads** - Number of conversations
- **Total Messages** - Individual emails
- **Unread** - Unread count
- **Read** - Read count
- **With Attachments** - Emails with files
- **Attachment Size** - Total size of attachments
- **Avg Msgs/Thread** - Average conversation length
- **Unique Senders** - Number of different senders
- **Unique Domains** - Number of different domains

### Customization

#### Analyze Different Time Periods

```javascript
// Last 30 days
createVisualDashboard(30);

// Last 6 months
createVisualDashboard(180);

// Last year
createVisualDashboard(365);
```

#### Change Chart Types

You can modify the chart types in the code:

```javascript
// Change pie chart to donut chart
.setOption('pieHole', 0.4)

// Change colors
.setOption('colors', ['#FF6384', '#36A2EB', '#FFCE56'])

// Add data labels
.setOption('pieSliceText', 'value')
```

### Tips for Best Results

1. **Start with 30-90 days** - Good balance of data and speed
2. **Run monthly** - Track trends over time
3. **Export charts** - Right-click chart > Save image
4. **Compare periods** - Run for different date ranges
5. **Share insights** - Great for presentations

### Advanced Usage

#### Scheduled Dashboard Updates

```javascript
function weeklyDashboardUpdate() {
  // Create dashboard
  createVisualDashboard(7);

  // Email to yourself
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url = ss.getUrl();

  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: 'Weekly Email Dashboard',
    body: `Your weekly dashboard is ready: ${url}`
  });
}

// Set up trigger: Extensions > Apps Script > Triggers
// Function: weeklyDashboardUpdate
// Event: Time-driven, Week timer
```

#### Compare Two Time Periods

```javascript
function compareTimePeriods() {
  // This month
  createVisualDashboard(30);
  const thisMonth = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Visual Dashboard');
  thisMonth.setName('Dashboard - This Month');

  // Last month
  createVisualDashboard(60);
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Visual Dashboard');
  sheet.setName('Dashboard - Last 60 Days');

  // Now you have both for comparison
}
```

---

## 🔍 Saved Queries / Filter Builder

### What It Does

Allows you to:
- Save frequently used Gmail searches
- Create a library of custom queries
- Run multiple searches at once
- Access query templates

### Usage

#### Saving a Query

**Menu:** Gmail Analyzer > 💾 Save Current Query

1. Click the menu option
2. Enter a name for your query
3. Enter the Gmail search query
4. Add optional description
5. Query is saved!

**Example:**
- **Name:** "Unread Work Emails"
- **Query:** `is:unread from:@company.com`
- **Description:** "All unread emails from work"

#### Managing Saved Queries

**Menu:** Gmail Analyzer > 🔍 Manage Saved Queries

**To Run Queries:**
1. Open "Saved Queries" sheet
2. Check boxes next to queries to run
3. Click "Manage Saved Queries"
4. Click "YES" to run
5. Results appear in "Query Results" sheet

**To Delete Queries:**
1. Open "Saved Queries" sheet
2. Check boxes next to queries to delete
3. Click "Manage Saved Queries"
4. Click "NO" to delete
5. Selected queries are removed

### Query Templates

Pre-built query library for common searches.

#### Available Template Categories

**Unread Emails:**
- All unread
- Unread from specific person
- Old unread (30+ days)

**By Sender:**
- From specific person
- From domain
- Excluding sender

**By Date:**
- After date
- Before date
- Date range
- Last 7 days
- Older than 30 days

**Attachments:**
- Has any attachment
- Large files (10MB+)
- Specific file type
- Multiple file types

**Categories:**
- Promotions
- Social
- Updates
- Forums

**Status:**
- Starred
- Important
- Read

**Content:**
- Subject contains
- Body contains
- Exact phrase

**Combined:**
- Old read promotions
- Large unread attachments
- Work emails this week

### Gmail Query Syntax Reference

#### Basic Syntax

| Query | Meaning |
|-------|---------|
| `from:email@domain.com` | Emails from sender |
| `to:email@domain.com` | Emails to recipient |
| `subject:keyword` | Subject contains keyword |
| `keyword` | Body contains keyword |
| `"exact phrase"` | Exact phrase match |

#### Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `OR` | Either condition | `from:alice OR from:bob` |
| `-` | Exclude | `-from:spam@email.com` |
| `( )` | Grouping | `(from:alice OR from:bob) is:unread` |

#### Date Filters

| Query | Meaning |
|-------|---------|
| `after:2024/01/01` | After date |
| `before:2024/12/31` | Before date |
| `newer_than:7d` | Last 7 days |
| `older_than:30d` | Older than 30 days |

#### Attachment Filters

| Query | Meaning |
|-------|---------|
| `has:attachment` | Has any attachment |
| `larger:10M` | Larger than 10MB |
| `smaller:1M` | Smaller than 1MB |
| `filename:pdf` | PDF files |
| `filename:jpg OR filename:png` | Images |

#### Status Filters

| Query | Meaning |
|-------|---------|
| `is:unread` | Unread emails |
| `is:read` | Read emails |
| `is:starred` | Starred |
| `is:important` | Marked important |
| `is:snoozed` | Snoozed emails |

#### Category Filters

| Query | Meaning |
|-------|---------|
| `category:promotions` | Promotional |
| `category:social` | Social media |
| `category:updates` | Updates |
| `category:forums` | Forums |
| `category:primary` | Primary inbox |

### Example Saved Queries

#### Work & Professional

```
Name: Urgent Work Emails
Query: is:unread from:@company.com subject:(urgent OR important)
Description: Unread urgent emails from work

Name: Boss Emails
Query: from:boss@company.com newer_than:7d
Description: Recent emails from my boss

Name: Project Alpha
Query: subject:"Project Alpha" after:2024/01/01
Description: All Project Alpha emails this year
```

#### Personal & Organization

```
Name: Family Photos
Query: from:@family.com has:attachment filename:jpg
Description: Photo attachments from family

Name: Bills to Pay
Query: subject:(bill OR invoice OR payment) is:unread
Description: Unpaid bills and invoices

Name: Newsletter Cleanup
Query: category:promotions is:read older_than:30d
Description: Old read promotional emails to delete
```

#### Maintenance & Cleanup

```
Name: Large Old Emails
Query: older_than:180d larger:5M
Description: Old emails with large attachments

Name: Unread from Year Ago
Query: is:unread older_than:365d
Description: Really old unread emails

Name: Social Media Noise
Query: category:social is:read older_than:60d
Description: Old social media notifications
```

### Advanced Query Examples

#### Complex Combined Queries

```
# Unread work emails with attachments from last week
is:unread from:@company.com has:attachment newer_than:7d

# Important emails not yet archived
is:important -label:archived

# Large promotional emails to clean up
category:promotions is:read larger:1M older_than:30d

# Receipts and invoices from Q1
(subject:receipt OR subject:invoice) after:2024/01/01 before:2024/03/31

# Unread emails from key contacts
is:unread (from:alice@company.com OR from:bob@company.com OR from:carol@company.com)

# Old vacation emails to archive
(subject:vacation OR subject:"out of office") is:read older_than:90d
```

#### Negation Examples

```
# All emails except from boss
-from:boss@company.com

# Unread emails not in spam
is:unread -in:spam

# Emails with attachments but not images
has:attachment -filename:jpg -filename:png -filename:gif

# Work emails excluding automated messages
from:@company.com -from:noreply -from:automated
```

## Common Scenarios

### Scenario 1: Weekly Email Review

```
1. Save query: "This Week's Important"
   Query: is:important newer_than:7d

2. Save query: "Unread This Week"
   Query: is:unread newer_than:7d

3. Run both queries every Monday morning
4. Review results in one place
```

### Scenario 2: Project Tracking

```
1. Save query for each project:
   - "Project Alpha Updates"
   - "Project Beta Reviews"
   - "Project Gamma Reports"

2. Run all at once to see project status
3. Create dashboard for each project
```

### Scenario 3: Monthly Cleanup

```
1. Save cleanup queries:
   - "Old Promotions" (category:promotions is:read older_than:30d)
   - "Old Social" (category:social is:read older_than:60d)
   - "Large Old Attachments" (has:attachment larger:10M older_than:90d)

2. Run monthly
3. Review results
4. Bulk delete from Auto-Manage
```

### Scenario 4: Client Management

```
1. Save query for each client:
   - "Client A Emails" (from:clienta.com OR subject:"Client A")
   - "Client B Emails" (from:clientb.com OR subject:"Client B")

2. Run to see all client communications
3. Track response times
4. Ensure nothing missed
```

## Tips & Best Practices

### For Saved Queries

1. **Use descriptive names** - "Q1 Receipts" not "Query 1"
2. **Add descriptions** - Help future you remember
3. **Test before saving** - Make sure query works
4. **Organize by category** - Group related queries
5. **Clean up regularly** - Delete unused queries

### For Dashboard

1. **Run regularly** - Monthly or weekly
2. **Compare periods** - See trends
3. **Export charts** - Save for records
4. **Share insights** - Show your team
5. **Adjust timeframes** - Match your needs

### For Query Building

1. **Start simple** - Add filters incrementally
2. **Test incrementally** - Verify each addition
3. **Use parentheses** - Group complex conditions
4. **Save variations** - Keep successful queries
5. **Document** - Add notes about what works

## Troubleshooting

### Dashboard Issues

**Problem:** Charts not appearing

**Solutions:**
- Refresh the spreadsheet
- Check if data exists in columns 1-2
- Verify chart positions aren't overlapping
- Try recreating dashboard

**Problem:** Dashboard is slow

**Solutions:**
- Reduce days analyzed (90 → 30)
- Reduce MAX_THREADS (500 → 200)
- Run during off-peak times
- Close other browser tabs

### Query Issues

**Problem:** Query returns no results

**Solutions:**
- Test query in Gmail first
- Check date format (YYYY/MM/DD)
- Verify sender email address
- Remove quotation marks and try again

**Problem:** Query returns too many results

**Solutions:**
- Add more filters
- Narrow date range
- Add status filters (is:read, etc.)
- Use exact phrases with quotes

## Performance Notes

### Dashboard Generation

| Threads | Time | Charts |
|---------|------|--------|
| 100 | 15-20 sec | 4 |
| 500 | 60-90 sec | 4 |
| 1000 | 2-3 min | 4 |

### Query Execution

| Queries | Time |
|---------|------|
| 1 query | 2-5 sec |
| 5 queries | 10-15 sec |
| 10 queries | 20-30 sec |

## FAQ

### Dashboard

**Q: Can I customize chart colors?**

A: Yes, edit the code and change the `colors` option in each chart builder.

**Q: Can I add more charts?**

A: Yes! Duplicate an existing chart builder section and modify the data source.

**Q: How do I export a chart?**

A: Right-click on the chart > "Save image" or use screenshot.

**Q: Can I email the dashboard automatically?**

A: Yes! See the "Scheduled Dashboard Updates" example above.

### Saved Queries

**Q: How many queries can I save?**

A: Unlimited! They're stored in a Google Sheet.

**Q: Can I share queries with others?**

A: Yes, share the Google Sheet or export the "Saved Queries" sheet.

**Q: Can I import queries?**

A: Yes, copy-paste rows into the "Saved Queries" sheet.

**Q: Do queries work with labels?**

A: Yes! Use `label:labelname` in your query.

## Examples

### Example 1: Client Email Dashboard

```javascript
function clientEmailDashboard() {
  // Create dashboard for client emails only
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);

  // Modify the query in createVisualDashboard
  // Or create custom version
  const query = `from:@client.com after:${formatDateForQuery(cutoffDate)}`;
  const threads = GmailApp.search(query, 0, 500);

  // Process and create dashboard
  // (Use createVisualDashboard logic with custom query)
}
```

### Example 2: Productivity Dashboard

```javascript
function productivityDashboard() {
  // Response times
  // Email volume trends
  // Peak productivity hours
  // This would be a custom implementation
  // using the dashboard framework
}
```

### Example 3: Team Dashboard

```javascript
function teamEmailDashboard() {
  // Emails from team members
  // Project-related emails
  // Meeting-related communications
  const query = 'from:@company.com (subject:project OR subject:meeting)';
  // Create custom dashboard
}
```

---

**Visualize your inbox and save time with smart queries!** 📊🔍✨
