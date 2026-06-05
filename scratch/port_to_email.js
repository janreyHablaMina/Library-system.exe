import fs from 'fs';

let content = fs.readFileSync('./src/pages/SmsLogsPage.tsx', 'utf8');

content = content.replace(/SmsLogsPage/g, 'EmailLogsPage');
content = content.replace(/SmsLog/g, 'EmailLog');
content = content.replace(/smsLog/g, 'emailLog');
content = content.replace(/smsType/g, 'emailType');
content = content.replace(/listSmsLogs/g, 'listEmailLogs');
content = content.replace(/SMS Messages/g, 'System Messages');
content = content.replace(/SMS Details/g, 'Email Details');
content = content.replace(/SMS Reports/g, 'Email Reports');
content = content.replace(/Send SMS/g, 'Send Email');
content = content.replace(/Retry Failed SMS/g, 'Retry Failed Email');
content = content.replace(/phoneNumber/g, 'emailAddress');
content = content.replace(/sms/gi, 'email');
content = content.replace(/SMS/g, 'Email');
// Icons
content = content.replace(/MessageSquare/g, 'Mail');
content = content.replace(/<MessageSquare/g, '<Mail');

fs.writeFileSync('./src/pages/EmailLogsPage.tsx', content, 'utf8');
console.log('Ported to EmailLogsPage.tsx');
