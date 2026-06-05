use chrono::{Duration, NaiveDate, Utc};
use lettre::{
    message::Mailbox, transport::smtp::authentication::Credentials, Message, SmtpTransport,
    Transport,
};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{Emitter, Manager};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Book {
    id: i64,
    title: String,
    author: String,
    category: Option<String>,
    isbn: Option<String>,
    cover_data: Option<String>,
    shelf_location: Option<String>,
    available: i64,
    total_copies: i64,
    is_archived: bool,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateBookPayload {
    title: String,
    author: String,
    category: Option<String>,
    isbn: Option<String>,
    cover_data: Option<String>,
    shelf_location: Option<String>,
    total_copies: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateBookPayload {
    id: i64,
    title: String,
    author: String,
    category: Option<String>,
    isbn: Option<String>,
    cover_data: Option<String>,
    shelf_location: Option<String>,
    available: i64,
    total_copies: i64,
    is_archived: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LoginPayload {
    username: String,
    password: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SessionUser {
    username: String,
    role: String,
    login_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LoginTrailRow {
    username: String,
    role: String,
    login_at: String,
    logout_at: Option<String>,
    is_active: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ChangePasswordPayload {
    current_password: String,
    new_password: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SystemUserRow {
    id: i64,
    username: String,
    full_name: String,
    email: String,
    profile_photo_data: Option<String>,
    role: String,
    is_active: bool,
    created_at: String,
    last_login_at: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateSystemUserPayload {
    username: String,
    full_name: String,
    email: String,
    profile_photo_data: Option<String>,
    password: String,
    role: String,
    is_active: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateSystemUserPayload {
    id: i64,
    full_name: String,
    email: String,
    profile_photo_data: Option<String>,
    role: String,
    is_active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NotificationRow {
    id: i64,
    notification_type: String,
    title: String,
    message: String,
    is_read: bool,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SettingActivityRow {
    key: String,
    value: String,
    updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Member {
    id: i64,
    full_name: String,
    member_type: String,
    member_id: String,
    department: Option<String>,
    contact_number: Option<String>,
    email: Option<String>,
    address: Option<String>,
    profile_photo_data: Option<String>,
    status: String,
    borrowed: i64,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateMemberPayload {
    full_name: String,
    member_type: String,
    member_id: String,
    department: Option<String>,
    contact_number: Option<String>,
    email: Option<String>,
    address: Option<String>,
    profile_photo_data: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateMemberPayload {
    id: i64,
    full_name: String,
    member_type: String,
    department: Option<String>,
    contact_number: Option<String>,
    email: Option<String>,
    address: Option<String>,
    profile_photo_data: Option<String>,
    status: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Author {
    id: i64,
    name: String,
    email: Option<String>,
    nationality: Option<String>,
    dob: Option<String>,
    profile_photo_data: Option<String>,
    status: String,
    biography: Option<String>,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateAuthorPayload {
    name: String,
    email: Option<String>,
    nationality: Option<String>,
    dob: Option<String>,
    profile_photo_data: Option<String>,
    status: Option<String>,
    biography: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Category {
    id: i64,
    name: String,
    description: Option<String>,
    status: String,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCategoryPayload {
    name: String,
    description: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateCategoryPayload {
    id: i64,
    name: String,
    description: Option<String>,
    status: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BorrowTransactionRow {
    id: i64,
    member_id: i64,
    member_name: String,
    member_code: String,
    member_profile_photo_data: Option<String>,
    book_id: i64,
    book_title: String,
    book_cover_data: Option<String>,
    borrow_date: String,
    due_date: String,
    return_date: Option<String>,
    notes: Option<String>,
    status: String,
    fine: f64,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EmailLogRow {
    id: i64,
    borrower_name: String,
    email_address: String,
    book_title: String,
    email_type: String,
    status: String,
    sent_at: String,
    error_message: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EmailLogStats {
    sent_today: i64,
    failed: i64,
    pending: i64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateBorrowPayload {
    member_id: i64,
    book_id: i64,
    borrow_date: String,
    due_date: String,
    notes: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExtendDueDatePayload {
    transaction_id: i64,
    new_due_date: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReturnBorrowPayload {
    transaction_id: i64,
    return_date: String,
    fine: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReservationRow {
    id: i64,
    member_id: i64,
    member_name: String,
    member_code: String,
    book_id: i64,
    book_title: String,
    book_author: String,
    reservation_date: String,
    expires_on: String,
    status: String,
    branch: String,
    priority: String,
    notes: Option<String>,
    notify_email: bool,
    notify_sms: bool,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateReservationPayload {
    member_id: i64,
    book_id: i64,
    reservation_date: String,
    expires_on: String,
    branch: Option<String>,
    priority: Option<String>,
    notes: Option<String>,
    notify_email: Option<bool>,
    notify_sms: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateReservationStatusPayload {
    id: i64,
    status: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateReservationPayload {
    id: i64,
    member_id: i64,
    book_id: i64,
    reservation_date: String,
    expires_on: String,
    status: String,
    branch: String,
    priority: String,
    notes: Option<String>,
    notify_email: bool,
    notify_sms: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StaffRow {
    id: i64,
    staff_code: String,
    full_name: String,
    email: String,
    role: String,
    branch: String,
    status: String,
    phone: Option<String>,
    emergency_contact: Option<String>,
    employee_type: Option<String>,
    start_date: Option<String>,
    username: Option<String>,
    temp_password: Option<String>,
    require_password_reset: bool,
    profile_photo_data: Option<String>,
    created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateStaffPayload {
    staff_code: Option<String>,
    full_name: String,
    email: String,
    role: String,
    branch: String,
    status: String,
    phone: Option<String>,
    emergency_contact: Option<String>,
    employee_type: Option<String>,
    start_date: Option<String>,
    username: Option<String>,
    temp_password: Option<String>,
    require_password_reset: Option<bool>,
    profile_photo_data: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpdateStaffPayload {
    id: i64,
    staff_code: Option<String>,
    full_name: String,
    email: String,
    role: String,
    branch: String,
    status: String,
    phone: Option<String>,
    emergency_contact: Option<String>,
    employee_type: Option<String>,
    start_date: Option<String>,
    username: Option<String>,
    temp_password: Option<String>,
    require_password_reset: bool,
    profile_photo_data: Option<String>,
}

fn open_db(path: &PathBuf) -> Result<Connection, String> {
    Connection::open(path).map_err(|e| format!("open db failed: {e}"))
}

fn database_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let db_path = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("app data dir not available: {e}"))?
        .join("library_system.db");
    if let Some(parent_dir) = db_path.parent() {
        fs::create_dir_all(parent_dir).map_err(|e| format!("create app data dir failed: {e}"))?;
    }
    Ok(db_path)
}

fn init_schema(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT,
        isbn TEXT,
        cover_data TEXT,
        shelf_location TEXT,
        available INTEGER NOT NULL DEFAULT 1,
        total_copies INTEGER NOT NULL DEFAULT 1,
        is_archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Admin',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        role TEXT NOT NULL,
        login_at TEXT NOT NULL,
        logout_at TEXT,
        is_active INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        member_type TEXT NOT NULL,
        member_id TEXT NOT NULL UNIQUE,
        department TEXT,
        contact_number TEXT,
        email TEXT,
        address TEXT,
        profile_photo_data TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        borrowed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        nationality TEXT,
        dob TEXT,
        profile_photo_data TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        biography TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS borrow_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        borrow_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        return_date TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        fine REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        reservation_date TEXT NOT NULL,
        expires_on TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        branch TEXT NOT NULL DEFAULT 'Central Library',
        priority TEXT NOT NULL DEFAULT 'Normal',
        notes TEXT,
        notify_email INTEGER NOT NULL DEFAULT 1,
        notify_sms INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS staff_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_code TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        branch TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        phone TEXT,
        emergency_contact TEXT,
        employee_type TEXT,
        start_date TEXT,
        username TEXT,
        temp_password TEXT,
        require_password_reset INTEGER NOT NULL DEFAULT 1,
        profile_photo_data TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        notification_type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        unique_key TEXT UNIQUE,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS email_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        borrow_transaction_id INTEGER,
        borrower_name TEXT NOT NULL,
        email_address TEXT NOT NULL,
        book_title TEXT NOT NULL,
        email_type TEXT NOT NULL,
        status TEXT NOT NULL,
        sent_at TEXT NOT NULL,
        error_message TEXT,
        automatic_key TEXT UNIQUE,
        FOREIGN KEY(borrow_transaction_id) REFERENCES borrow_transactions(id) ON DELETE SET NULL
      );
      ",
    )
    .map_err(|e| format!("init schema failed: {e}"))?;

    // Schema migrations
    let _ = conn.execute("ALTER TABLE books ADD COLUMN shelf_location TEXT", []);

    // Backward-compatible migration for older local DBs created before cover_data existed.
    if let Err(e) = conn.execute("ALTER TABLE books ADD COLUMN cover_data TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("books migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE books ADD COLUMN category TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("books category migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute(
        "ALTER TABLE books ADD COLUMN total_copies INTEGER NOT NULL DEFAULT 1",
        [],
    ) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("books total_copies migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute(
        "ALTER TABLE books ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0",
        [],
    ) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("books is_archived migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE members ADD COLUMN profile_photo_data TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("members migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE authors ADD COLUMN profile_photo_data TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("authors migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute(
        "ALTER TABLE staff_members ADD COLUMN profile_photo_data TEXT",
        [],
    ) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("staff migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE notifications ADD COLUMN unique_key TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("notifications migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute(
        "ALTER TABLE users ADD COLUMN full_name TEXT NOT NULL DEFAULT ''",
        [],
    ) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("users full_name migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute(
        "ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''",
        [],
    ) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("users email migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE users ADD COLUMN profile_photo_data TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("users profile photo migration failed: {e}"));
        }
    }
    if let Err(e) = conn.execute("ALTER TABLE email_logs ADD COLUMN automatic_key TEXT", []) {
        let msg = e.to_string();
        if !msg.contains("duplicate column name") {
            return Err(format!("email logs migration failed: {e}"));
        }
    }

    conn.execute(
        "
      INSERT INTO users (username, password, role, is_active, created_at)
      VALUES (?1, ?2, 'Admin', 1, ?3)
      ON CONFLICT(username) DO NOTHING
      ",
        params!["admin", "admin", Utc::now().to_rfc3339()],
    )
    .map_err(|e| format!("seed admin user failed: {e}"))?;
    conn
    .execute(
      "UPDATE users SET full_name = CASE WHEN TRIM(full_name) = '' THEN username ELSE full_name END, email = CASE WHEN TRIM(email) = '' THEN username || '@local.library' ELSE email END",
      [],
    )
    .map_err(|e| format!("backfill users profile fields failed: {e}"))?;

    Ok(())
}

fn upsert_notification(
    conn: &Connection,
    ntype: &str,
    title: &str,
    message: &str,
    unique_key: &str,
) -> Result<(), String> {
    conn
    .execute(
      "
      INSERT INTO notifications (notification_type, title, message, is_read, unique_key, created_at)
      VALUES (?1, ?2, ?3, 0, ?4, ?5)
      ON CONFLICT(unique_key) DO UPDATE SET
        title = excluded.title,
        message = excluded.message,
        is_read = CASE
          WHEN notifications.title <> excluded.title OR notifications.message <> excluded.message THEN 0
          ELSE notifications.is_read
        END,
        created_at = CASE
          WHEN notifications.title <> excluded.title OR notifications.message <> excluded.message THEN excluded.created_at
          ELSE notifications.created_at
        END
      ",
      params![ntype, title, message, unique_key, Utc::now().to_rfc3339()],
    )
    .map_err(|e| format!("upsert notification failed: {e}"))?;
    Ok(())
}

fn emit_notifications_refresh(app: &tauri::AppHandle) {
    let _ = app.emit("notifications:refresh", ());
}

fn setting_bool(conn: &Connection, key: &str, default_value: bool) -> bool {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |row| row.get::<_, String>(0),
    )
    .map(|value| value == "true")
    .unwrap_or(default_value)
}

fn email_template(
    email_type: &str,
    member_name: &str,
    book_title: &str,
    due_date: &str,
) -> (String, String) {
    match email_type {
    "Due Tomorrow" => (
      "Library Book Due Reminder".to_string(),
      format!(
        "Hello {member_name},\n\nThis is a reminder that your borrowed book \"{book_title}\" is due on {due_date}.\n\nPlease return the book on or before the due date.\n\nThank you,\nLibrary Management System"
      ),
    ),
    "Due Today" => (
      "Library Book Due Today".to_string(),
      format!(
        "Hello {member_name},\n\nYour borrowed book \"{book_title}\" is due today ({due_date}).\n\nPlease return it to the library to avoid penalties.\n\nThank you,\nLibrary Management System"
      ),
    ),
    _ => (
      "Overdue Library Book Notice".to_string(),
      format!(
        "Hello {member_name},\n\nYour borrowed book \"{book_title}\" was due on {due_date} and is now overdue.\n\nPlease return the book as soon as possible.\n\nThank you,\nLibrary Management System"
      ),
    ),
  }
}

fn log_email(
    conn: &Connection,
    tx_id: Option<i64>,
    borrower_name: &str,
    email_address: &str,
    book_title: &str,
    email_type: &str,
    status: &str,
    error_message: Option<&str>,
    automatic_key: Option<&str>,
) -> Result<(), String> {
    conn.execute(
        "
      INSERT INTO email_logs (
        borrow_transaction_id, borrower_name, email_address, book_title,
        email_type, status, sent_at, error_message, automatic_key
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
      ON CONFLICT(automatic_key) DO NOTHING
      ",
        params![
            tx_id,
            borrower_name,
            email_address,
            book_title,
            email_type,
            status,
            Utc::now().to_rfc3339(),
            error_message,
            automatic_key
        ],
    )
    .map_err(|e| format!("log email failed: {e}"))?;
    Ok(())
}


fn wrap_in_onyx_html(subject: &str, body_text: &str) -> String {
    let mut body_html = body_text.replace("\n\n", "</p><p>").replace("\n", "<br/>");
    if !body_html.starts_with("<p>") {
        body_html = format!("<p>{}</p>", body_html);
    }
    
    format!(r#"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{
            background-color: #18181B;
            color: #e4e4e7;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background-color: #27272A;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid #3F3F46;
        }}
        .header {{
            background-color: #18181B;
            padding: 24px;
            text-align: center;
            border-bottom: 2px solid #10b981;
        }}
        .header h1 {{
            margin: 0;
            color: #f4f4f5;
            font-size: 20px;
            font-weight: 600;
        }}
        .content {{
            padding: 32px 24px;
            line-height: 1.6;
            font-size: 15px;
            color: #d4d4d8;
        }}
        .content p {{
            margin-top: 0;
            margin-bottom: 16px;
        }}
        .footer {{
            background-color: #18181B;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #71717a;
            border-top: 1px solid #3F3F46;
        }}
        .accent {{
            color: #10b981;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Library <span class="accent">System</span></h1>
        </div>
        <div class="content">
            {}
        </div>
        <div class="footer">
            &copy; 2026 Library Management System. All rights reserved.
        </div>
    </div>
</body>
</html>
"#, body_html)
}

fn send_email_from_settings(
    conn: &Connection,
    to: &str,
    subject: &str,
    body: &str,
) -> Result<(), String> {
    let enabled = setting_bool(conn, "email.enabled", false);
    if !enabled {
        return Err("Email notifications are disabled.".to_string());
    }
    let smtp_host = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.smtp_host'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();
    let smtp_port = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.smtp_port'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_else(|_| "587".to_string());
    let smtp_username = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.smtp_username'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();
    let smtp_password = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.smtp_password'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();
    let sender_name = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.sender_name'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_else(|_| "Library Management System".to_string());
    let sender_email = conn
        .query_row(
            "SELECT value FROM settings WHERE key = 'email.sender_email'",
            [],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();
    if smtp_host.trim().is_empty()
        || sender_email.trim().is_empty()
        || smtp_username.trim().is_empty()
        || smtp_password.trim().is_empty()
    {
        return Err("SMTP host, sender email, username, and password are required.".to_string());
    }
    let port = smtp_port.trim().parse::<u16>().unwrap_or(587);
    let from = Mailbox::new(
        Some(sender_name),
        sender_email
            .parse()
            .map_err(|e| format!("invalid sender email: {e}"))?,
    );
    let to = to
        .parse()
        .map_err(|e| format!("invalid recipient email: {e}"))?;
    let html_body = wrap_in_onyx_html(subject, body);
    let message = Message::builder()
        .from(from)
        .to(to)
        .subject(subject)
        .header(lettre::message::header::ContentType::TEXT_HTML)
        .body(html_body)
        .map_err(|e| format!("build email failed: {e}"))?;
    let tls_params = lettre::transport::smtp::client::TlsParameters::builder(smtp_host.trim().to_string())
        .build()
        .map_err(|e| format!("tls builder failed: {e}"))?;

    let tls_config = if port == 465 {
        lettre::transport::smtp::client::Tls::Wrapper(tls_params)
    } else {
        lettre::transport::smtp::client::Tls::Required(tls_params)
    };

    let mailer = SmtpTransport::builder_dangerous(smtp_host.trim())
        .port(port)
        .tls(tls_config)
        .credentials(Credentials::new(smtp_username, smtp_password))
        .build();
    mailer
        .send(&message)
        .map_err(|e| format!("smtp send failed: {e}"))?;
    Ok(())
}

fn send_reminder_for_transaction(
    conn: &Connection,
    transaction_id: i64,
    email_type: &str,
    automatic_key: Option<String>,
) -> Result<String, String> {
    let (member_name, email, book_title, due_date, return_date): (
        String,
        Option<String>,
        String,
        String,
        Option<String>,
    ) = conn
        .query_row(
            "
      SELECT m.full_name, m.email, b.title, t.due_date, t.return_date
      FROM borrow_transactions t
      INNER JOIN members m ON m.id = t.member_id
      INNER JOIN books b ON b.id = t.book_id
      WHERE t.id = ?1
      ",
            params![transaction_id],
            |row| {
                Ok((
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                ))
            },
        )
        .map_err(|e| format!("fetch reminder transaction failed: {e}"))?;

    if return_date.is_some() {
        return Err("Book has already been returned.".to_string());
    }

    let email_address = email.unwrap_or_default();
    if email_address.trim().is_empty() {
        log_email(
            conn,
            Some(transaction_id),
            &member_name,
            "",
            &book_title,
            email_type,
            "Failed",
            Some("Member has no email address."),
            automatic_key.as_deref(),
        )?;
        return Err("Member has no email address.".to_string());
    }

    let due_label = NaiveDate::parse_from_str(&due_date[..due_date.len().min(10)], "%Y-%m-%d")
        .map(|date| date.format("%b %d, %Y").to_string())
        .unwrap_or(due_date.clone());
    let (subject, body) = email_template(email_type, &member_name, &book_title, &due_label);
    match send_email_from_settings(conn, &email_address, &subject, &body) {
        Ok(()) => {
            log_email(
                conn,
                Some(transaction_id),
                &member_name,
                &email_address,
                &book_title,
                email_type,
                "Sent",
                None,
                automatic_key.as_deref(),
            )?;
            Ok(format!("Email reminder sent to {member_name}."))
        }
        Err(error) => {
            log_email(
                conn,
                Some(transaction_id),
                &member_name,
                &email_address,
                &book_title,
                email_type,
                "Failed",
                Some(&error),
                automatic_key.as_deref(),
            )?;
            Err(error)
        }
    }
}

#[tauri::command]
fn init_db(app: tauri::AppHandle) -> Result<String, String> {
    let db_path = database_path(&app)?;
    let conn = open_db(&db_path)?;
    init_schema(&conn)?;
    Ok(format!("database ready at {}", db_path.display()))
}

#[tauri::command]
fn set_setting(app: tauri::AppHandle, key: String, value: String) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      INSERT INTO settings (key, value, updated_at)
      VALUES (?1, ?2, ?3)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      ",
        params![key, value, Utc::now().to_rfc3339()],
    )
    .map_err(|e| format!("set setting failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn get_setting(app: tauri::AppHandle, key: String) -> Result<Option<String>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let mut stmt = conn
        .prepare("SELECT value FROM settings WHERE key = ?1")
        .map_err(|e| format!("prepare query failed: {e}"))?;
    let mut rows = stmt
        .query(params![key])
        .map_err(|e| format!("query failed: {e}"))?;
    if let Some(row) = rows.next().map_err(|e| format!("row read failed: {e}"))? {
        let value: String = row.get(0).map_err(|e| format!("value read failed: {e}"))?;
        Ok(Some(value))
    } else {
        Ok(None)
    }
}

#[tauri::command]
fn list_system_users(
    app: tauri::AppHandle,
    limit: Option<i64>,
) -> Result<Vec<SystemUserRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(200).clamp(1, 1000);
    let mut stmt = conn
        .prepare(
            "
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.email,
        u.profile_photo_data,
        u.role,
        u.is_active,
        u.created_at,
        (
          SELECT s.login_at
          FROM sessions s
          WHERE s.username = u.username
          ORDER BY s.id DESC
          LIMIT 1
        ) AS last_login_at
      FROM users u
      ORDER BY u.id DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare list system users query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(SystemUserRow {
                id: row.get(0)?,
                username: row.get(1)?,
                full_name: row.get(2)?,
                email: row.get(3)?,
                profile_photo_data: row.get(4)?,
                role: row.get(5)?,
                is_active: row.get::<_, i64>(6)? == 1,
                created_at: row.get(7)?,
                last_login_at: row.get(8)?,
            })
        })
        .map_err(|e| format!("list system users failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect system users failed: {e}"))
}

#[tauri::command]
fn create_system_user(
    app: tauri::AppHandle,
    payload: CreateSystemUserPayload,
) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let username = payload.username.trim();
    let full_name = payload.full_name.trim();
    let email = payload.email.trim();
    let password = payload.password.trim();
    let role = payload.role.trim();
    if username.is_empty()
        || full_name.is_empty()
        || email.is_empty()
        || password.is_empty()
        || role.is_empty()
    {
        return Err("username, fullName, email, password and role are required".to_string());
    }
    if password.len() < 8 {
        return Err("password must be at least 8 characters".to_string());
    }

    conn
    .execute(
      "
      INSERT INTO users (username, password, role, is_active, created_at, full_name, email, profile_photo_data)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      ",
      params![
        username,
        password,
        role,
        if payload.is_active { 1 } else { 0 },
        Utc::now().to_rfc3339(),
        full_name,
        email,
        payload.profile_photo_data
      ],
    )
    .map_err(|e| format!("create system user failed: {e}"))?;
    let id = conn.last_insert_rowid();
    emit_notifications_refresh(&app);
    Ok(id)
}

#[tauri::command]
fn update_system_user(
    app: tauri::AppHandle,
    payload: UpdateSystemUserPayload,
) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let full_name = payload.full_name.trim();
    let email = payload.email.trim();
    let role = payload.role.trim();
    if full_name.is_empty() || email.is_empty() || role.is_empty() {
        return Err("fullName, email and role are required".to_string());
    }
    conn.execute(
        "
      UPDATE users
      SET full_name = ?1, email = ?2, profile_photo_data = ?3, role = ?4, is_active = ?5
      WHERE id = ?6
      ",
        params![
            full_name,
            email,
            payload.profile_photo_data,
            role,
            if payload.is_active { 1 } else { 0 },
            payload.id
        ],
    )
    .map_err(|e| format!("update system user failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn delete_system_user(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM users WHERE id = ?1", params![id])
        .map_err(|e| format!("delete system user failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn reset_system_user_password(
    app: tauri::AppHandle,
    id: i64,
    new_password: String,
) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let password = new_password.trim();
    if password.len() < 8 {
        return Err("new password must be at least 8 characters".to_string());
    }
    conn.execute(
        "UPDATE users SET password = ?1 WHERE id = ?2",
        params![password, id],
    )
    .map_err(|e| format!("reset system user password failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn list_settings_activity(
    app: tauri::AppHandle,
    limit: Option<i64>,
) -> Result<Vec<SettingActivityRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(12).clamp(1, 100);
    let mut stmt = conn
        .prepare(
            "
      SELECT key, value, updated_at
      FROM settings
      ORDER BY datetime(updated_at) DESC, updated_at DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare settings activity query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(SettingActivityRow {
                key: row.get(0)?,
                value: row.get(1)?,
                updated_at: row.get(2)?,
            })
        })
        .map_err(|e| format!("list settings activity failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect settings activity failed: {e}"))
}

#[tauri::command]
fn create_book(app: tauri::AppHandle, payload: CreateBookPayload) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn
    .execute(
      "INSERT INTO books (title, author, category, isbn, cover_data, shelf_location, available, total_copies, is_archived, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 0, ?9)",
      params![
        payload.title,
        payload.author,
        payload.category.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.isbn,
        payload.cover_data,
        payload.shelf_location,
        payload.total_copies.unwrap_or(1),
        payload.total_copies.unwrap_or(1),
        Utc::now().to_rfc3339()
      ],
    )
    .map_err(|e| format!("create book failed: {e}"))?;
    let id = conn.last_insert_rowid();
    emit_notifications_refresh(&app);
    Ok(id)
}

#[tauri::command]
fn list_books(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<Book>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(50).clamp(1, 500);
    let mut stmt = conn
    .prepare(
      "SELECT id, title, author, category, isbn, cover_data, shelf_location, available, total_copies, is_archived, created_at
       FROM books
       ORDER BY id DESC
       LIMIT ?1",
    )
    .map_err(|e| format!("prepare list query failed: {e}"))?;
    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(Book {
                id: row.get(0)?,
                title: row.get(1)?,
                author: row.get(2)?,
                category: row.get(3)?,
                isbn: row.get(4)?,
                cover_data: row.get(5)?,
                shelf_location: row.get(6)?,
                available: row.get(7)?,
                total_copies: row.get(8)?,
                is_archived: row.get::<_, i64>(9)? == 1,
                created_at: row.get(10)?,
            })
        })
        .map_err(|e| format!("list books failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect rows failed: {e}"))
}

#[tauri::command]
fn search_books(
    app: tauri::AppHandle,
    query: String,
    limit: Option<i64>,
) -> Result<Vec<Book>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(5).clamp(1, 50);
    let like_pattern = format!("%{}%", query.trim());
    let mut stmt = conn
    .prepare(
      "SELECT id, title, author, category, isbn, cover_data, shelf_location, available, total_copies, is_archived, created_at
       FROM books
       WHERE title LIKE ?1 OR author LIKE ?1
       ORDER BY id DESC
       LIMIT ?2",
    )
    .map_err(|e| format!("prepare search query failed: {e}"))?;
    let rows = stmt
        .query_map(params![like_pattern, max_rows], |row| {
            Ok(Book {
                id: row.get(0)?,
                title: row.get(1)?,
                author: row.get(2)?,
                category: row.get(3)?,
                isbn: row.get(4)?,
                cover_data: row.get(5)?,
                shelf_location: row.get(6)?,
                available: row.get(7)?,
                total_copies: row.get(8)?,
                is_archived: row.get::<_, i64>(9)? == 1,
                created_at: row.get(10)?,
            })
        })
        .map_err(|e| format!("search books failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect rows failed: {e}"))
}

#[tauri::command]
fn update_book(app: tauri::AppHandle, payload: UpdateBookPayload) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      UPDATE books
      SET title = ?1,
          author = ?2,
          category = ?3,
          isbn = ?4,
          cover_data = ?5,
          shelf_location = ?6,
          available = ?7,
          total_copies = ?8,
          is_archived = ?9
      WHERE id = ?10
      ",
        params![
            payload.title,
            payload.author,
            payload
                .category
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload.isbn,
            payload.cover_data,
            payload.shelf_location,
            payload.available,
            payload.total_copies,
            if payload.is_archived { 1 } else { 0 },
            payload.id
        ],
    )
    .map_err(|e| format!("update book failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn delete_book(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM books WHERE id = ?1", params![id])
        .map_err(|e| format!("delete book failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn create_member(app: tauri::AppHandle, payload: CreateMemberPayload) -> Result<i64, String> {
    let full_name = payload.full_name.trim();
    let member_type = payload.member_type.trim();
    let member_id = payload.member_id.trim();
    let email = payload.email.as_deref().unwrap_or("").trim();
    if full_name.is_empty() || member_type.is_empty() || member_id.is_empty() || email.is_empty() {
        return Err("fullName, memberType, memberId, and email are required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn
    .execute(
      "
      INSERT INTO members (full_name, member_type, member_id, department, contact_number, email, address, profile_photo_data, status, borrowed, created_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 0, ?10)
      ",
      params![
        full_name,
        member_type,
        member_id,
        payload.department.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.contact_number.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        email,
        payload.address.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.profile_photo_data,
        payload.status.unwrap_or_else(|| "Active".to_string()),
        Utc::now().to_rfc3339()
      ],
    )
    .map_err(|e| format!("create member failed: {e}"))?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn list_members(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<Member>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 1000);
    let mut stmt = conn
    .prepare(
      "
      SELECT id, full_name, member_type, member_id, department, contact_number, email, address, profile_photo_data, status, borrowed, created_at
      FROM members
      ORDER BY id DESC
      LIMIT ?1
      ",
    )
    .map_err(|e| format!("prepare list members query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(Member {
                id: row.get(0)?,
                full_name: row.get(1)?,
                member_type: row.get(2)?,
                member_id: row.get(3)?,
                department: row.get(4)?,
                contact_number: row.get(5)?,
                email: row.get(6)?,
                address: row.get(7)?,
                profile_photo_data: row.get(8)?,
                status: row.get(9)?,
                borrowed: row.get(10)?,
                created_at: row.get(11)?,
            })
        })
        .map_err(|e| format!("list members failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect members failed: {e}"))
}

#[tauri::command]
fn search_members(
    app: tauri::AppHandle,
    query: String,
    limit: Option<i64>,
) -> Result<Vec<Member>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(5).clamp(1, 50);
    let like_pattern = format!("%{}%", query.trim());
    let mut stmt = conn
    .prepare(
      "
      SELECT id, full_name, member_type, member_id, department, contact_number, email, address, profile_photo_data, status, borrowed, created_at
      FROM members
      WHERE full_name LIKE ?1 OR member_id LIKE ?1
      ORDER BY id DESC
      LIMIT ?2
      ",
    )
    .map_err(|e| format!("prepare search members query failed: {e}"))?;

    let rows = stmt
        .query_map(params![like_pattern, max_rows], |row| {
            Ok(Member {
                id: row.get(0)?,
                full_name: row.get(1)?,
                member_type: row.get(2)?,
                member_id: row.get(3)?,
                department: row.get(4)?,
                contact_number: row.get(5)?,
                email: row.get(6)?,
                address: row.get(7)?,
                profile_photo_data: row.get(8)?,
                status: row.get(9)?,
                borrowed: row.get(10)?,
                created_at: row.get(11)?,
            })
        })
        .map_err(|e| format!("search members failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect members failed: {e}"))
}

#[tauri::command]
fn update_member(app: tauri::AppHandle, payload: UpdateMemberPayload) -> Result<(), String> {
    let full_name = payload.full_name.trim();
    let member_type = payload.member_type.trim();
    if full_name.is_empty() || member_type.is_empty() {
        return Err("fullName and memberType are required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      UPDATE members
      SET full_name = ?1,
          member_type = ?2,
          department = ?3,
          contact_number = ?4,
          email = ?5,
          address = ?6,
          profile_photo_data = ?7,
          status = ?8
      WHERE id = ?9
      ",
        params![
            full_name,
            member_type,
            payload
                .department
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .contact_number
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .email
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .address
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload.profile_photo_data,
            payload.status,
            payload.id
        ],
    )
    .map_err(|e| format!("update member failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn create_author(app: tauri::AppHandle, payload: CreateAuthorPayload) -> Result<i64, String> {
    let name = payload.name.trim();
    if name.is_empty() {
        return Err("name is required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn
    .execute(
      "
      INSERT INTO authors (name, email, nationality, dob, profile_photo_data, status, biography, created_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      ",
      params![
        name,
        payload.email.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.nationality.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.dob.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.profile_photo_data,
        payload.status.unwrap_or_else(|| "Active".to_string()),
        payload.biography.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        Utc::now().to_rfc3339(),
      ],
    )
    .map_err(|e| format!("create author failed: {e}"))?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn list_authors(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<Author>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 1000);
    let mut stmt = conn
        .prepare(
            "
      SELECT id, name, email, nationality, dob, profile_photo_data, status, biography, created_at
      FROM authors
      ORDER BY id DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare list authors query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(Author {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                nationality: row.get(3)?,
                dob: row.get(4)?,
                profile_photo_data: row.get(5)?,
                status: row.get(6)?,
                biography: row.get(7)?,
                created_at: row.get(8)?,
            })
        })
        .map_err(|e| format!("list authors failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect authors failed: {e}"))
}

#[tauri::command]
fn search_authors(
    app: tauri::AppHandle,
    query: String,
    limit: Option<i64>,
) -> Result<Vec<Author>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(5).clamp(1, 50);
    let like_pattern = format!("%{}%", query.trim());
    let mut stmt = conn
        .prepare(
            "
      SELECT id, name, email, nationality, dob, profile_photo_data, status, biography, created_at
      FROM authors
      WHERE name LIKE ?1
      ORDER BY id DESC
      LIMIT ?2
      ",
        )
        .map_err(|e| format!("prepare search authors query failed: {e}"))?;

    let rows = stmt
        .query_map(params![like_pattern, max_rows], |row| {
            Ok(Author {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                nationality: row.get(3)?,
                dob: row.get(4)?,
                profile_photo_data: row.get(5)?,
                status: row.get(6)?,
                biography: row.get(7)?,
                created_at: row.get(8)?,
            })
        })
        .map_err(|e| format!("search authors failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect authors failed: {e}"))
}

#[tauri::command]
fn delete_author(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM authors WHERE id = ?1", params![id])
        .map_err(|e| format!("delete author failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn create_category(app: tauri::AppHandle, payload: CreateCategoryPayload) -> Result<i64, String> {
    let name = payload.name.trim();
    if name.is_empty() {
        return Err("name is required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      INSERT INTO categories (name, description, status, created_at)
      VALUES (?1, ?2, ?3, ?4)
      ",
        params![
            name,
            payload
                .description
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload.status.unwrap_or_else(|| "Active".to_string()),
            Utc::now().to_rfc3339(),
        ],
    )
    .map_err(|e| format!("create category failed: {e}"))?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn list_categories(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<Category>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 1000);
    let mut stmt = conn
        .prepare(
            "
      SELECT id, name, description, status, created_at
      FROM categories
      ORDER BY id DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare list categories query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                status: row.get(3)?,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| format!("list categories failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect categories failed: {e}"))
}

#[tauri::command]
fn update_category(app: tauri::AppHandle, payload: UpdateCategoryPayload) -> Result<(), String> {
    let name = payload.name.trim();
    if name.is_empty() {
        return Err("name is required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      UPDATE categories
      SET name = ?1,
          description = ?2,
          status = ?3
      WHERE id = ?4
      ",
        params![
            name,
            payload
                .description
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload.status,
            payload.id
        ],
    )
    .map_err(|e| format!("update category failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn delete_category(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM categories WHERE id = ?1", params![id])
        .map_err(|e| format!("delete category failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn create_borrow_transaction(
    app: tauri::AppHandle,
    payload: CreateBorrowPayload,
) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let tx = conn
        .unchecked_transaction()
        .map_err(|e| format!("start borrow transaction failed: {e}"))?;

    let available = tx
        .query_row(
            "SELECT available FROM books WHERE id = ?1",
            params![payload.book_id],
            |row| row.get::<_, i64>(0),
        )
        .map_err(|e| format!("fetch book availability failed: {e}"))?;

    if available < 1 {
        return Err("Book is not available for borrowing.".to_string());
    }

    tx
    .execute(
      "
      INSERT INTO borrow_transactions (member_id, book_id, borrow_date, due_date, notes, status, fine, created_at)
      VALUES (?1, ?2, ?3, ?4, ?5, 'Active', 0, ?6)
      ",
      params![
        payload.member_id,
        payload.book_id,
        payload.borrow_date,
        payload.due_date,
        payload.notes.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        Utc::now().to_rfc3339()
      ],
    )
    .map_err(|e| format!("create borrow transaction failed: {e}"))?;

    let borrow_id = tx.last_insert_rowid();

    tx.execute(
        "UPDATE books SET available = available - 1 WHERE id = ?1",
        params![payload.book_id],
    )
    .map_err(|e| format!("update book availability failed: {e}"))?;

    tx.execute(
        "UPDATE members SET borrowed = borrowed + 1 WHERE id = ?1",
        params![payload.member_id],
    )
    .map_err(|e| format!("update member borrowed count failed: {e}"))?;

    tx.commit()
        .map_err(|e| format!("commit borrow transaction failed: {e}"))?;
    let member_name = conn
        .query_row(
            "SELECT full_name FROM members WHERE id = ?1",
            params![payload.member_id],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_else(|_| "A member".to_string());
    let book_title = conn
        .query_row(
            "SELECT title FROM books WHERE id = ?1",
            params![payload.book_id],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_else(|_| "a book".to_string());
    upsert_notification(
        &conn,
        "borrow",
        "Book Borrowed",
        &format!("{member_name} borrowed \"{book_title}\"."),
        &format!("tx:borrow:{borrow_id}"),
    )?;
    emit_notifications_refresh(&app);
    Ok(borrow_id)
}

#[tauri::command]
fn extend_borrow_due_date(
    app: tauri::AppHandle,
    payload: ExtendDueDatePayload,
) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let mut stmt = conn
        .prepare(
            "UPDATE borrow_transactions SET due_date = ?1 WHERE id = ?2 AND return_date IS NULL",
        )
        .map_err(|e| format!("prepare extend due date failed: {e}"))?;

    stmt.execute(params![payload.new_due_date, payload.transaction_id])
        .map_err(|e| format!("execute extend due date failed: {e}"))?;

    Ok(())
}

#[tauri::command]
fn return_borrow_transaction(
    app: tauri::AppHandle,
    payload: ReturnBorrowPayload,
) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let tx = conn
        .unchecked_transaction()
        .map_err(|e| format!("start return transaction failed: {e}"))?;

    let (member_id, book_id, status): (i64, i64, String) = tx
        .query_row(
            "SELECT member_id, book_id, status FROM borrow_transactions WHERE id = ?1",
            params![payload.transaction_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .map_err(|e| format!("fetch borrow transaction failed: {e}"))?;

    if status != "Active" && status != "Overdue" {
        return Err("This transaction is already returned.".to_string());
    }

    tx.execute(
        "
      UPDATE borrow_transactions
      SET return_date = ?1, fine = ?2, status = 'Returned'
      WHERE id = ?3
      ",
        params![
            payload.return_date,
            payload.fine.unwrap_or(0.0),
            payload.transaction_id
        ],
    )
    .map_err(|e| format!("update borrow transaction failed: {e}"))?;

    tx.execute(
        "UPDATE books SET available = available + 1 WHERE id = ?1",
        params![book_id],
    )
    .map_err(|e| format!("mark book available failed: {e}"))?;

    tx
    .execute(
      "UPDATE members SET borrowed = CASE WHEN borrowed > 0 THEN borrowed - 1 ELSE 0 END WHERE id = ?1",
      params![member_id],
    )
    .map_err(|e| format!("update member borrowed count failed: {e}"))?;

    tx.commit()
        .map_err(|e| format!("commit return transaction failed: {e}"))?;
    let (member_name, book_title): (String, String) = conn
        .query_row(
            "
      SELECT m.full_name, b.title
      FROM borrow_transactions t
      INNER JOIN members m ON m.id = t.member_id
      INNER JOIN books b ON b.id = t.book_id
      WHERE t.id = ?1
      ",
            params![payload.transaction_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .unwrap_or_else(|_| ("A member".to_string(), "a book".to_string()));
    upsert_notification(
        &conn,
        "return",
        "Book Returned",
        &format!("{member_name} returned \"{book_title}\"."),
        &format!("tx:return:{}", payload.transaction_id),
    )?;
    emit_notifications_refresh(&app);
    Ok(())
}

#[tauri::command]
fn list_book_borrow_transactions(
    app: tauri::AppHandle,
    book_id: i64,
) -> Result<Vec<BorrowTransactionRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let query = "
    SELECT
      t.id,
      t.member_id,
      m.full_name,
      m.member_id,
      m.profile_photo_data,
      t.book_id,
      b.title,
      b.cover_data,
      t.borrow_date,
      t.due_date,
      t.return_date,
      t.notes,
      t.status,
      t.fine,
      t.created_at
    FROM borrow_transactions t
    INNER JOIN members m ON m.id = t.member_id
    INNER JOIN books b ON b.id = t.book_id
    WHERE t.book_id = ?1
    ORDER BY t.id DESC
  ";

    let mut stmt = conn
        .prepare(query)
        .map_err(|e| format!("prepare list book borrow transactions failed: {e}"))?;

    let rows = stmt
        .query_map(params![book_id], |row| {
            Ok(BorrowTransactionRow {
                id: row.get(0)?,
                member_id: row.get(1)?,
                member_name: row.get(2)?,
                member_code: row.get(3)?,
                member_profile_photo_data: row.get(4)?,
                book_id: row.get(5)?,
                book_title: row.get(6)?,
                book_cover_data: row.get(7)?,
                borrow_date: row.get(8)?,
                due_date: row.get(9)?,
                return_date: row.get(10)?,
                notes: row.get(11)?,
                status: row.get(12)?,
                fine: row.get(13)?,
                created_at: row.get(14)?,
            })
        })
        .map_err(|e| format!("query_map failed: {e}"))?;

    let mut transactions = Vec::new();
    for row_result in rows {
        transactions.push(row_result.map_err(|e| format!("row error: {e}"))?);
    }

    Ok(transactions)
}

#[tauri::command]
fn list_borrow_transactions(
    app: tauri::AppHandle,
    status: Option<String>,
    limit: Option<i64>,
) -> Result<Vec<BorrowTransactionRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 2000);
    let status_filter = status.unwrap_or_else(|| "All".to_string());

    let base_query = "
    SELECT
      t.id,
      t.member_id,
      m.full_name,
      m.member_id,
      m.profile_photo_data,
      t.book_id,
      b.title,
      b.cover_data,
      t.borrow_date,
      t.due_date,
      t.return_date,
      t.notes,
      t.status,
      t.fine,
      t.created_at
    FROM borrow_transactions t
    INNER JOIN members m ON m.id = t.member_id
    INNER JOIN books b ON b.id = t.book_id
  ";

    let query_with_filter = if status_filter.eq_ignore_ascii_case("all") {
        format!("{base_query} ORDER BY t.id DESC LIMIT ?1")
    } else {
        format!("{base_query} WHERE t.status = ?1 ORDER BY t.id DESC LIMIT ?2")
    };

    let mut stmt = conn
        .prepare(&query_with_filter)
        .map_err(|e| format!("prepare list borrow transactions query failed: {e}"))?;

    if status_filter.eq_ignore_ascii_case("all") {
        let rows = stmt
            .query_map(params![max_rows], |row| {
                Ok(BorrowTransactionRow {
                    id: row.get(0)?,
                    member_id: row.get(1)?,
                    member_name: row.get(2)?,
                    member_code: row.get(3)?,
                    member_profile_photo_data: row.get(4)?,
                    book_id: row.get(5)?,
                    book_title: row.get(6)?,
                    book_cover_data: row.get(7)?,
                    borrow_date: row.get(8)?,
                    due_date: row.get(9)?,
                    return_date: row.get(10)?,
                    notes: row.get(11)?,
                    status: row.get(12)?,
                    fine: row.get(13)?,
                    created_at: row.get(14)?,
                })
            })
            .map_err(|e| format!("list borrow transactions failed: {e}"))?;

        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("collect borrow transactions failed: {e}"))
    } else {
        let rows = stmt
            .query_map(params![status_filter, max_rows], |row| {
                Ok(BorrowTransactionRow {
                    id: row.get(0)?,
                    member_id: row.get(1)?,
                    member_name: row.get(2)?,
                    member_code: row.get(3)?,
                    member_profile_photo_data: row.get(4)?,
                    book_id: row.get(5)?,
                    book_title: row.get(6)?,
                    book_cover_data: row.get(7)?,
                    borrow_date: row.get(8)?,
                    due_date: row.get(9)?,
                    return_date: row.get(10)?,
                    notes: row.get(11)?,
                    status: row.get(12)?,
                    fine: row.get(13)?,
                    created_at: row.get(14)?,
                })
            })
            .map_err(|e| format!("list borrow transactions failed: {e}"))?;

        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("collect borrow transactions failed: {e}"))
    }
}

#[tauri::command]
fn create_reservation(
    app: tauri::AppHandle,
    payload: CreateReservationPayload,
) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let member_exists = conn
        .query_row(
            "SELECT COUNT(1) FROM members WHERE id = ?1",
            params![payload.member_id],
            |row| row.get::<_, i64>(0),
        )
        .map_err(|e| format!("validate member failed: {e}"))?;
    if member_exists == 0 {
        return Err("Selected member does not exist.".to_string());
    }

    let book_exists = conn
        .query_row(
            "SELECT COUNT(1) FROM books WHERE id = ?1",
            params![payload.book_id],
            |row| row.get::<_, i64>(0),
        )
        .map_err(|e| format!("validate book failed: {e}"))?;
    if book_exists == 0 {
        return Err("Selected book does not exist.".to_string());
    }

    conn.execute(
        "
      INSERT INTO reservations (
        member_id,
        book_id,
        reservation_date,
        expires_on,
        status,
        branch,
        priority,
        notes,
        notify_email,
        notify_sms,
        created_at
      )
      VALUES (?1, ?2, ?3, ?4, 'Pending', ?5, ?6, ?7, ?8, ?9, ?10)
      ",
        params![
            payload.member_id,
            payload.book_id,
            payload.reservation_date,
            payload.expires_on,
            payload
                .branch
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty())
                .unwrap_or_else(|| "Central Library".to_string()),
            payload
                .priority
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty())
                .unwrap_or_else(|| "Normal".to_string()),
            payload
                .notes
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            if payload.notify_email.unwrap_or(true) {
                1
            } else {
                0
            },
            if payload.notify_sms.unwrap_or(true) {
                1
            } else {
                0
            },
            Utc::now().to_rfc3339()
        ],
    )
    .map_err(|e| format!("create reservation failed: {e}"))?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn list_reservations(
    app: tauri::AppHandle,
    status: Option<String>,
    limit: Option<i64>,
) -> Result<Vec<ReservationRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 2000);
    let status_filter = status.unwrap_or_else(|| "All".to_string());

    let base_query = "
    SELECT
      r.id,
      r.member_id,
      m.full_name,
      m.member_id,
      r.book_id,
      b.title,
      b.author,
      r.reservation_date,
      r.expires_on,
      r.status,
      r.branch,
      r.priority,
      r.notes,
      r.notify_email,
      r.notify_sms,
      r.created_at
    FROM reservations r
    INNER JOIN members m ON m.id = r.member_id
    INNER JOIN books b ON b.id = r.book_id
  ";

    let query = if status_filter.eq_ignore_ascii_case("all") {
        format!("{base_query} ORDER BY r.id DESC LIMIT ?1")
    } else {
        format!("{base_query} WHERE r.status = ?1 ORDER BY r.id DESC LIMIT ?2")
    };

    let mut stmt = conn
        .prepare(&query)
        .map_err(|e| format!("prepare list reservations query failed: {e}"))?;

    let map_row = |row: &rusqlite::Row<'_>| -> rusqlite::Result<ReservationRow> {
        Ok(ReservationRow {
            id: row.get(0)?,
            member_id: row.get(1)?,
            member_name: row.get(2)?,
            member_code: row.get(3)?,
            book_id: row.get(4)?,
            book_title: row.get(5)?,
            book_author: row.get(6)?,
            reservation_date: row.get(7)?,
            expires_on: row.get(8)?,
            status: row.get(9)?,
            branch: row.get(10)?,
            priority: row.get(11)?,
            notes: row.get(12)?,
            notify_email: row.get::<_, i64>(13)? == 1,
            notify_sms: row.get::<_, i64>(14)? == 1,
            created_at: row.get(15)?,
        })
    };

    if status_filter.eq_ignore_ascii_case("all") {
        let rows = stmt
            .query_map(params![max_rows], map_row)
            .map_err(|e| format!("list reservations failed: {e}"))?;
        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("collect reservations failed: {e}"))
    } else {
        let rows = stmt
            .query_map(params![status_filter, max_rows], map_row)
            .map_err(|e| format!("list reservations failed: {e}"))?;
        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("collect reservations failed: {e}"))
    }
}

#[tauri::command]
fn update_reservation_status(
    app: tauri::AppHandle,
    payload: UpdateReservationStatusPayload,
) -> Result<(), String> {
    let status = payload.status.trim();
    if status.is_empty() {
        return Err("status is required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "UPDATE reservations SET status = ?1 WHERE id = ?2",
        params![status, payload.id],
    )
    .map_err(|e| format!("update reservation status failed: {e}"))?;
    emit_notifications_refresh(&app);
    Ok(())
}

#[tauri::command]
fn update_reservation(
    app: tauri::AppHandle,
    payload: UpdateReservationPayload,
) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let member_exists = conn
        .query_row(
            "SELECT COUNT(1) FROM members WHERE id = ?1",
            params![payload.member_id],
            |row| row.get::<_, i64>(0),
        )
        .map_err(|e| format!("validate member failed: {e}"))?;
    if member_exists == 0 {
        return Err("Selected member does not exist.".to_string());
    }

    let book_exists = conn
        .query_row(
            "SELECT COUNT(1) FROM books WHERE id = ?1",
            params![payload.book_id],
            |row| row.get::<_, i64>(0),
        )
        .map_err(|e| format!("validate book failed: {e}"))?;
    if book_exists == 0 {
        return Err("Selected book does not exist.".to_string());
    }

    conn.execute(
        "
      UPDATE reservations
      SET member_id = ?1,
          book_id = ?2,
          reservation_date = ?3,
          expires_on = ?4,
          status = ?5,
          branch = ?6,
          priority = ?7,
          notes = ?8,
          notify_email = ?9,
          notify_sms = ?10
      WHERE id = ?11
      ",
        params![
            payload.member_id,
            payload.book_id,
            payload.reservation_date,
            payload.expires_on,
            payload.status.trim(),
            payload.branch.trim(),
            payload.priority.trim(),
            payload
                .notes
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            if payload.notify_email { 1 } else { 0 },
            if payload.notify_sms { 1 } else { 0 },
            payload.id,
        ],
    )
    .map_err(|e| format!("update reservation failed: {e}"))?;
    emit_notifications_refresh(&app);
    Ok(())
}

#[tauri::command]
fn delete_reservation(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM reservations WHERE id = ?1", params![id])
        .map_err(|e| format!("delete reservation failed: {e}"))?;
    emit_notifications_refresh(&app);
    Ok(())
}

#[tauri::command]
fn create_staff(app: tauri::AppHandle, payload: CreateStaffPayload) -> Result<i64, String> {
    let full_name = payload.full_name.trim();
    let email = payload.email.trim();
    let role = payload.role.trim();
    let branch = payload.branch.trim();
    let status = payload.status.trim();
    if full_name.is_empty()
        || email.is_empty()
        || role.is_empty()
        || branch.is_empty()
        || status.is_empty()
    {
        return Err("fullName, email, role, branch and status are required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let staff_code = payload
        .staff_code
        .map(|v| v.trim().to_string())
        .filter(|v| !v.is_empty())
        .unwrap_or_else(|| format!("ST-{}", Utc::now().timestamp_millis()));

    conn
    .execute(
      "
      INSERT INTO staff_members (
        staff_code, full_name, email, role, branch, status, phone, emergency_contact,
        employee_type, start_date, username, temp_password, require_password_reset, profile_photo_data, created_at
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
      ",
      params![
        staff_code,
        full_name,
        email,
        role,
        branch,
        status,
        payload.phone.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.emergency_contact.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.employee_type.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.start_date.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.username.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.temp_password.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        if payload.require_password_reset.unwrap_or(true) { 1 } else { 0 },
        payload.profile_photo_data,
        Utc::now().to_rfc3339(),
      ],
    )
    .map_err(|e| format!("create staff failed: {e}"))?;

    let new_id = conn.last_insert_rowid();
    let normalized_code = format!("ST-{new_id:03}");
    conn.execute(
        "UPDATE staff_members SET staff_code = ?1 WHERE id = ?2",
        params![normalized_code, new_id],
    )
    .map_err(|e| format!("normalize staff code failed: {e}"))?;

    Ok(new_id)
}

#[tauri::command]
fn list_staff(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<StaffRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(500).clamp(1, 2000);
    let mut stmt = conn
    .prepare(
      "
      SELECT id, staff_code, full_name, email, role, branch, status, phone, emergency_contact,
             employee_type, start_date, username, temp_password, require_password_reset, profile_photo_data, created_at
      FROM staff_members
      ORDER BY id DESC
      LIMIT ?1
      ",
    )
    .map_err(|e| format!("prepare list staff query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(StaffRow {
                id: row.get(0)?,
                staff_code: row.get(1)?,
                full_name: row.get(2)?,
                email: row.get(3)?,
                role: row.get(4)?,
                branch: row.get(5)?,
                status: row.get(6)?,
                phone: row.get(7)?,
                emergency_contact: row.get(8)?,
                employee_type: row.get(9)?,
                start_date: row.get(10)?,
                username: row.get(11)?,
                temp_password: row.get(12)?,
                require_password_reset: row.get::<_, i64>(13)? == 1,
                profile_photo_data: row.get(14)?,
                created_at: row.get(15)?,
            })
        })
        .map_err(|e| format!("list staff failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect staff failed: {e}"))
}

#[tauri::command]
fn update_staff(app: tauri::AppHandle, payload: UpdateStaffPayload) -> Result<(), String> {
    let full_name = payload.full_name.trim();
    let email = payload.email.trim();
    let role = payload.role.trim();
    let branch = payload.branch.trim();
    let status = payload.status.trim();
    if full_name.is_empty()
        || email.is_empty()
        || role.is_empty()
        || branch.is_empty()
        || status.is_empty()
    {
        return Err("fullName, email, role, branch and status are required".to_string());
    }

    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "
      UPDATE staff_members
      SET staff_code = ?1,
          full_name = ?2,
          email = ?3,
          role = ?4,
          branch = ?5,
          status = ?6,
          phone = ?7,
          emergency_contact = ?8,
          employee_type = ?9,
          start_date = ?10,
          username = ?11,
          temp_password = ?12,
          require_password_reset = ?13,
          profile_photo_data = ?14
      WHERE id = ?15
      ",
        params![
            payload
                .staff_code
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty())
                .unwrap_or_else(|| format!("ST-{:03}", payload.id)),
            full_name,
            email,
            role,
            branch,
            status,
            payload
                .phone
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .emergency_contact
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .employee_type
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .start_date
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .username
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            payload
                .temp_password
                .map(|v| v.trim().to_string())
                .filter(|v| !v.is_empty()),
            if payload.require_password_reset { 1 } else { 0 },
            payload.profile_photo_data,
            payload.id
        ],
    )
    .map_err(|e| format!("update staff failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn delete_staff(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("DELETE FROM staff_members WHERE id = ?1", params![id])
        .map_err(|e| format!("delete staff failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn send_email_smtp(app: tauri::AppHandle, to: String, subject: String, body: String) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    match send_email_from_settings(&conn, &to, &subject, &body) {
        Ok(()) => {
            log_email(
                &conn,
                None,
                "Manual Email",
                &to,
                "Custom Notification",
                "Manual",
                "Sent",
                None,
                None,
            )?;
            Ok("Email sent successfully".to_string())
        }
        Err(e) => {
            log_email(
                &conn,
                None,
                "Manual Email",
                &to,
                "Custom Notification",
                "Manual",
                "Failed",
                Some(&e),
                None,
            )?;
            Err(e)
        }
    }
}

#[tauri::command]
fn send_manual_email_reminder(
    app: tauri::AppHandle,
    transaction_id: i64,
) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    match send_reminder_for_transaction(&conn, transaction_id, "Manual", None) {
        Ok(message) => {
            upsert_notification(
                &conn,
                "email",
                "Email Reminder Sent",
                &message,
                &format!("email:manual:{}", Utc::now().timestamp_millis()),
            )?;
            emit_notifications_refresh(&app);
            Ok(message)
        }
        Err(error) => {
            upsert_notification(
                &conn,
                "email",
                "Email Reminder Failed",
                &error,
                &format!("email:manual_failed:{}", Utc::now().timestamp_millis()),
            )?;
            emit_notifications_refresh(&app);
            Err(error)
        }
    }
}

#[tauri::command]
fn run_automatic_email_reminders(app: tauri::AppHandle) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    if !setting_bool(&conn, "email.enabled", false)
        || !setting_bool(&conn, "email.automatic_reminders", false)
    {
        return Ok(0);
    }

    let today = Utc::now().date_naive();
    let tomorrow = today + Duration::days(1);
    let mut stmt = conn
        .prepare(
            "
      SELECT t.id, t.due_date
      FROM borrow_transactions t
      WHERE t.return_date IS NULL
        AND t.status IN ('Active', 'Borrowed')
      ",
        )
        .map_err(|e| format!("prepare auto reminders failed: {e}"))?;
    let rows = stmt
        .query_map([], |row| {
            Ok((row.get::<_, i64>(0)?, row.get::<_, String>(1)?))
        })
        .map_err(|e| format!("query auto reminders failed: {e}"))?;

    let mut attempted = 0;
    for row in rows {
        let (tx_id, due_date) = row.map_err(|e| format!("read auto reminder row failed: {e}"))?;
        let due = NaiveDate::parse_from_str(&due_date[..due_date.len().min(10)], "%Y-%m-%d");
        let Ok(due) = due else { continue };
        let (email_type, key_date) = if due == tomorrow {
            ("Due Tomorrow", today)
        } else if due == today {
            ("Due Today", today)
        } else if due < today {
            ("Overdue", today)
        } else {
            continue;
        };
        let key = format!("auto:{tx_id}:{email_type}:{key_date}");
        let exists: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM email_logs WHERE automatic_key = ?1",
                params![key],
                |row| row.get(0),
            )
            .unwrap_or(0);
        if exists > 0 {
            continue;
        }
        attempted += 1;
        let _ = send_reminder_for_transaction(&conn, tx_id, email_type, Some(key));
    }

    if attempted > 0 {
        emit_notifications_refresh(&app);
    }
    Ok(attempted)
}

#[tauri::command]
fn list_email_logs(
    app: tauri::AppHandle,
    search: Option<String>,
    status: Option<String>,
    limit: Option<i64>,
) -> Result<Vec<EmailLogRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let q = format!("%{}%", search.unwrap_or_default().trim());
    let status_filter = status.unwrap_or_default();
    let max_rows = limit.unwrap_or(200).clamp(1, 1000);
    let mut stmt = conn
    .prepare(
      "
      SELECT id, borrower_name, email_address, book_title, email_type, status, sent_at, error_message
      FROM email_logs
      WHERE (?1 = '%' OR ?1 = '%%' OR borrower_name LIKE ?1 OR email_address LIKE ?1 OR book_title LIKE ?1 OR email_type LIKE ?1)
        AND (?2 = '' OR status = ?2)
      ORDER BY sent_at DESC, id DESC
      LIMIT ?3
      ",
    )
    .map_err(|e| format!("prepare email logs failed: {e}"))?;
    let rows = stmt
        .query_map(params![q, status_filter, max_rows], |row| {
            Ok(EmailLogRow {
                id: row.get(0)?,
                borrower_name: row.get(1)?,
                email_address: row.get(2)?,
                book_title: row.get(3)?,
                email_type: row.get(4)?,
                status: row.get(5)?,
                sent_at: row.get(6)?,
                error_message: row.get(7)?,
            })
        })
        .map_err(|e| format!("list email logs failed: {e}"))?;
    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect email logs failed: {e}"))
}

#[tauri::command]
fn get_email_log_stats(app: tauri::AppHandle) -> Result<EmailLogStats, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let today = Utc::now().date_naive().to_string();
    let sent_today = conn
        .query_row(
            "SELECT COUNT(*) FROM email_logs WHERE status = 'Sent' AND substr(sent_at, 1, 10) = ?1",
            params![today],
            |row| row.get(0),
        )
        .unwrap_or(0);
    let failed = conn
        .query_row(
            "SELECT COUNT(*) FROM email_logs WHERE status = 'Failed'",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);
    let pending = conn
        .query_row(
            "SELECT COUNT(*) FROM email_logs WHERE status = 'Pending'",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);
    Ok(EmailLogStats {
        sent_today,
        failed,
        pending,
    })
}

#[tauri::command]
fn test_email_configuration(app: tauri::AppHandle, to: String) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    send_email_from_settings(
        &conn,
        &to,
        "Library Email Configuration Test",
        "This is a test email from Library Management System.",
    )?;
    log_email(
        &conn,
        None,
        "Test Recipient",
        &to,
        "Configuration Test",
        "Manual",
        "Sent",
        None,
        None,
    )?;
    Ok("Test email sent.".to_string())
}

#[tauri::command]
fn send_sms_gateway(phone: String, message: String) -> Result<String, String> {
    let summary = format!(
        "SMS gateway stub queued. Phone: {phone}, Message chars: {}",
        message.chars().count()
    );
    Ok(summary)
}

#[tauri::command]
fn export_report(format: String, name: String) -> Result<String, String> {
    let normalized = format.to_ascii_lowercase();
    if normalized != "pdf" && normalized != "excel" {
        return Err("format must be either 'pdf' or 'excel'".to_string());
    }
    Ok(format!("report export stub for {name}.{normalized}"))
}

#[tauri::command]
fn login(app: tauri::AppHandle, payload: LoginPayload) -> Result<bool, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let username = payload.username.trim();
    let password = payload.password.trim();
    if username.is_empty() || password.is_empty() {
        return Ok(false);
    }

    let mut stmt = conn
        .prepare(
            "
      SELECT role
      FROM users
      WHERE username = ?1
        AND password = ?2
        AND is_active = 1
      ",
        )
        .map_err(|e| format!("prepare login query failed: {e}"))?;

    let mut role = stmt.query_row(params![username, password], |row| row.get::<_, String>(0));

    if matches!(role, Err(rusqlite::Error::QueryReturnedNoRows)) {
        // Fallback: check staff_members table
        let mut staff_stmt = conn
            .prepare(
                "
        SELECT role
        FROM staff_members
        WHERE username = ?1
          AND temp_password = ?2
          AND status = 'Active'
        ",
            )
            .map_err(|e| format!("prepare staff login query failed: {e}"))?;
        role = staff_stmt.query_row(params![username, password], |row| row.get::<_, String>(0));
    }

    match role {
        Ok(role) => {
            conn.execute(
                "UPDATE sessions SET is_active = 0, logout_at = ?1 WHERE is_active = 1",
                params![Utc::now().to_rfc3339()],
            )
            .map_err(|e| format!("close previous sessions failed: {e}"))?;
            conn.execute(
                "INSERT INTO sessions (username, role, login_at, is_active) VALUES (?1, ?2, ?3, 1)",
                params![username, role, Utc::now().to_rfc3339()],
            )
            .map_err(|e| format!("create session failed: {e}"))?;
            Ok(true)
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(false),
        Err(e) => Err(format!("execute login query failed: {e}")),
    }
}

#[tauri::command]
fn logout(app: tauri::AppHandle) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "UPDATE sessions SET is_active = 0, logout_at = ?1 WHERE is_active = 1",
        params![Utc::now().to_rfc3339()],
    )
    .map_err(|e| format!("logout failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn get_active_session(app: tauri::AppHandle) -> Result<Option<SessionUser>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let mut stmt = conn
        .prepare(
            "
      SELECT username, role, login_at
      FROM sessions
      WHERE is_active = 1
      ORDER BY id DESC
      LIMIT 1
      ",
        )
        .map_err(|e| format!("prepare session query failed: {e}"))?;

    let row = stmt.query_row([], |row| {
        Ok(SessionUser {
            username: row.get(0)?,
            role: row.get(1)?,
            login_at: row.get(2)?,
        })
    });

    match row {
        Ok(session) => Ok(Some(session)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(format!("execute session query failed: {e}")),
    }
}

#[tauri::command]
fn list_login_trail(
    app: tauri::AppHandle,
    limit: Option<i64>,
) -> Result<Vec<LoginTrailRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(20).clamp(1, 200);
    let mut stmt = conn
        .prepare(
            "
      SELECT username, role, login_at, logout_at, is_active
      FROM sessions
      ORDER BY id DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare login trail query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(LoginTrailRow {
                username: row.get(0)?,
                role: row.get(1)?,
                login_at: row.get(2)?,
                logout_at: row.get(3)?,
                is_active: row.get::<_, i64>(4)? == 1,
            })
        })
        .map_err(|e| format!("list login trail failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect login trail failed: {e}"))
}

#[tauri::command]
fn change_password(app: tauri::AppHandle, payload: ChangePasswordPayload) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let current_password = payload.current_password.trim();
    let new_password = payload.new_password.trim();
    if current_password.is_empty() || new_password.is_empty() {
        return Err("Current and new password are required.".to_string());
    }
    if new_password.len() < 8 {
        return Err("New password must be at least 8 characters.".to_string());
    }

    let active_user = conn
        .query_row(
            "SELECT username FROM sessions WHERE is_active = 1 ORDER BY id DESC LIMIT 1",
            [],
            |row| row.get::<_, String>(0),
        )
        .map_err(|_| "No active session found.".to_string())?;

    let updated = conn
        .execute(
            "
      UPDATE users
      SET password = ?1
      WHERE username = ?2
        AND password = ?3
        AND is_active = 1
      ",
            params![new_password, active_user, current_password],
        )
        .map_err(|e| format!("change password failed: {e}"))?;

    if updated == 0 {
        return Err("Current password is incorrect.".to_string());
    }

    conn.execute(
        "
      INSERT INTO settings (key, value, updated_at)
      VALUES (?1, ?2, ?3)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      ",
        params![
            "security.password_last_changed",
            Utc::now().to_rfc3339(),
            Utc::now().to_rfc3339()
        ],
    )
    .map_err(|e| format!("log password activity failed: {e}"))?;

    Ok(())
}

#[tauri::command]
fn sync_notifications(app: tauri::AppHandle) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;

    let now = Utc::now().to_rfc3339();

    let overdue_count: i64 = conn
        .query_row(
            "
      SELECT COUNT(*)
      FROM borrow_transactions
      WHERE return_date IS NULL
        AND due_date < ?1
      ",
            params![now],
            |row| row.get(0),
        )
        .map_err(|e| format!("count overdue transactions failed: {e}"))?;

    if overdue_count > 0 {
        upsert_notification(
            &conn,
            "overdue",
            "Overdue Books Alert",
            &format!("{overdue_count} borrowed book(s) are overdue."),
            "system:overdue:current",
        )?;
    }

    let due_today_count: i64 = conn
        .query_row(
            "
      SELECT COUNT(*)
      FROM reservations
      WHERE status IN ('Pending', 'Approved')
        AND substr(expires_on, 1, 10) = substr(?1, 1, 10)
      ",
            params![now],
            |row| row.get(0),
        )
        .map_err(|e| format!("count due-today reservations failed: {e}"))?;

    if due_today_count > 0 {
        upsert_notification(
            &conn,
            "reservation",
            "Reservations Expiring Today",
            &format!("{due_today_count} reservation(s) expire today."),
            "system:reservations:today",
        )?;
    }

    let new_members_today: i64 = conn
        .query_row(
            "
      SELECT COUNT(*)
      FROM members
      WHERE substr(created_at, 1, 10) = substr(?1, 1, 10)
      ",
            params![now],
            |row| row.get(0),
        )
        .map_err(|e| format!("count new members today failed: {e}"))?;

    if new_members_today > 0 {
        upsert_notification(
            &conn,
            "member",
            "New Members Registered",
            &format!("{new_members_today} new member(s) registered today."),
            "system:members:today",
        )?;
    }

    Ok(())
}

#[tauri::command]
fn list_notifications(
    app: tauri::AppHandle,
    limit: Option<i64>,
) -> Result<Vec<NotificationRow>, String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    let max_rows = limit.unwrap_or(20).clamp(1, 200);
    let mut stmt = conn
        .prepare(
            "
      SELECT id, notification_type, title, message, is_read, created_at
      FROM notifications
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT ?1
      ",
        )
        .map_err(|e| format!("prepare list notifications query failed: {e}"))?;

    let rows = stmt
        .query_map(params![max_rows], |row| {
            Ok(NotificationRow {
                id: row.get(0)?,
                notification_type: row.get(1)?,
                title: row.get(2)?,
                message: row.get(3)?,
                is_read: row.get::<_, i64>(4)? == 1,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| format!("list notifications failed: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("collect notifications failed: {e}"))
}

#[tauri::command]
fn mark_notification_as_read(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute(
        "UPDATE notifications SET is_read = 1 WHERE id = ?1",
        params![id],
    )
    .map_err(|e| format!("mark notification as read failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn mark_all_notifications_read(app: tauri::AppHandle) -> Result<(), String> {
    let conn = open_db(&database_path(&app)?)?;
    init_schema(&conn)?;
    conn.execute("UPDATE notifications SET is_read = 1 WHERE is_read = 0", [])
        .map_err(|e| format!("mark all notifications read failed: {e}"))?;
    Ok(())
}

#[tauri::command]
fn expand_main_window(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;

    window
        .unminimize()
        .map_err(|e| format!("unminimize failed: {e}"))?;
    window
        .maximize()
        .map_err(|e| format!("maximize failed: {e}"))?;
    window
        .set_fullscreen(false)
        .map_err(|e| format!("exit fullscreen failed: {e}"))?;

    Ok(())
}

#[tauri::command]
fn restore_login_window(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;

    window
        .set_fullscreen(false)
        .map_err(|e| format!("exit fullscreen failed: {e}"))?;
    window
        .unmaximize()
        .map_err(|e| format!("unmaximize failed: {e}"))?;
    window
        .set_size(tauri::Size::Logical(tauri::LogicalSize::new(820.0, 560.0)))
        .map_err(|e| format!("set size failed: {e}"))?;
    window.center().map_err(|e| format!("center failed: {e}"))?;

    Ok(())
}


async fn send_sms_txtbox(
    api_key: &str,
    to: &str,
    message: &str,
) -> Result<(), String> {
    let client = reqwest::Client::new();
    
    let params = [
        ("number", to),
        ("message", message),
    ];

    let res = client.post("https://ws-v2.txtbox.com/messaging/v1/sms/push")
        .header("X-TXTBOX-Auth", api_key)
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {e}"))?;

    if res.status().is_success() {
        Ok(())
    } else {
        let text = res.text().await.unwrap_or_default();
        Err(format!("TxtBox Error: {}", text))
    }
}

#[tauri::command]
async fn test_sms_configuration(
    app: tauri::AppHandle,
    to: String,
) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    let api_key: String = conn.query_row("SELECT value FROM settings WHERE key = 'sms.txtbox_api_key'", [], |row| row.get(0)).unwrap_or_default();
    
    if api_key.trim().is_empty() {
        return Err("TxtBox API key is missing.".to_string());
    }

    send_sms_txtbox(&api_key, &to, "Test SMS").await?;
    
    conn.execute(
        "INSERT INTO email_logs (borrower_name, email_address, book_title, email_type, status, sent_at, error_message) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), ?)",
        ["Admin Test", &to, "N/A", "SMS Test", "Sent", ""],
    ).map_err(|e| format!("db error: {e}"))?;

    Ok("Test SMS sent successfully!".to_string())
}

#[tauri::command]
async fn send_manual_sms(
    app: tauri::AppHandle,
    member_id: i64,
    message: String,
) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    
    let enabled = setting_bool(&conn, "sms.enabled", false);
    if !enabled {
        return Err("SMS notifications are disabled in settings.".to_string());
    }

    let api_key: String = conn.query_row("SELECT value FROM settings WHERE key = 'sms.txtbox_api_key'", [], |row| row.get(0)).unwrap_or_default();
    if api_key.trim().is_empty() {
        return Err("TxtBox API key is missing.".to_string());
    }

    let phone_data: Option<(String, String)> = conn.query_row(
        "SELECT contact_number, first_name || ' ' || last_name FROM members WHERE id = ?",
        [member_id],
        |row| Ok((row.get(0).unwrap_or_default(), row.get(1).unwrap_or_default()))
    ).ok();

    let (phone_number, member_name) = match phone_data {
        Some((p, n)) if !p.trim().is_empty() && p != "n/a" => (p, n),
        _ => return Err("Member does not have a valid contact number.".to_string()),
    };

    send_sms_txtbox(&api_key, &phone_number, &message).await?;

    conn.execute(
        "INSERT INTO email_logs (borrower_name, email_address, book_title, email_type, status, sent_at, error_message) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), ?)",
        [&member_name, &phone_number, "Manual SMS", "Custom SMS", "Sent", ""],
    ).map_err(|e| format!("db error: {e}"))?;

    Ok("SMS sent successfully!".to_string())
}



fn is_valid_license(key: &str) -> bool {
    let clean_key = key.replace("-", "").to_uppercase();
    if !clean_key.starts_with("LIB") || clean_key.len() != 15 {
        return false;
    }
    let payload = &clean_key[3..13];
    let expected_checksum = &clean_key[13..15];
    
    let mut sum: u32 = 0;
    for (i, c) in payload.chars().enumerate() {
        let val = c.to_digit(36).unwrap_or(0);
        sum += val * (i as u32 + 1);
    }
    
    let checksum = format!("{:02X}", sum % 256);
    checksum == expected_checksum
}

#[tauri::command]
fn verify_license_key(app: tauri::AppHandle, key: String) -> Result<bool, String> {
    if is_valid_license(&key) {
        let conn = open_db(&database_path(&app)?)?;
        conn.execute("INSERT INTO settings (key, value, updated_at) VALUES ('license.status', 'active', datetime('now', 'localtime')) ON CONFLICT(key) DO UPDATE SET value = 'active'", [])
            .map_err(|e| format!("db error: {}", e))?;
        Ok(true)
    } else {
        Ok(false)
    }
}

#[tauri::command]
fn get_license_status(app: tauri::AppHandle) -> Result<String, String> {
    let conn = open_db(&database_path(&app)?)?;
    let status: String = conn.query_row("SELECT value FROM settings WHERE key = 'license.status'", [], |r| r.get(0)).unwrap_or_else(|_| "trial".to_string());
    
    if status == "active" {
        return Ok("active".to_string());
    }
    
    let install_date: Option<String> = conn.query_row("SELECT value FROM settings WHERE key = 'license.install_date'", [], |r| r.get(0)).ok();
    
    let now = Utc::now();
    
    if let Some(date_str) = install_date {
        if let Ok(parsed_date) = chrono::DateTime::parse_from_rfc3339(&date_str) {
            let parsed_utc = parsed_date.with_timezone(&Utc);
            let diff = now.signed_duration_since(parsed_utc).num_days();
            if diff >= 7 {
                return Ok("expired".to_string());
            } else {
                return Ok("trial".to_string());
            }
        }
    } else {
        let date_str = now.to_rfc3339();
        let _ = conn.execute("INSERT INTO settings (key, value, updated_at) VALUES ('license.install_date', ?, datetime('now', 'localtime')) ON CONFLICT(key) DO NOTHING", [&date_str]);
        let _ = conn.execute("INSERT INTO settings (key, value, updated_at) VALUES ('license.status', 'trial', datetime('now', 'localtime')) ON CONFLICT(key) DO NOTHING", []);
    }
    
    Ok("trial".to_string())
}

#[tauri::command]
fn get_trial_days_remaining(app: tauri::AppHandle) -> Result<i64, String> {
    let conn = open_db(&database_path(&app)?)?;
    let install_date: Option<String> = conn.query_row("SELECT value FROM settings WHERE key = 'license.install_date'", [], |r| r.get(0)).ok();
    
    if let Some(date_str) = install_date {
        if let Ok(parsed_date) = chrono::DateTime::parse_from_rfc3339(&date_str) {
            let parsed_utc = parsed_date.with_timezone(&Utc);
            let now = Utc::now();
            let diff = now.signed_duration_since(parsed_utc).num_days();
            let remaining = 7 - diff;
            return Ok(if remaining < 0 { 0 } else { remaining });
        }
    }
    Ok(7)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_trial_days_remaining,
            verify_license_key,
            get_license_status,
            init_db,
            set_setting,
            get_setting,
            list_system_users,
            create_system_user,
            update_system_user,
            delete_system_user,
            reset_system_user_password,
            list_settings_activity,
            create_book,
            list_books,
            search_books,
            update_book,
            delete_book,
            create_member,
            list_members,
            search_members,
            update_member,
            create_author,
            list_authors,
            search_authors,
            delete_author,
            create_category,
            list_categories,
            update_category,
            delete_category,
            create_borrow_transaction,
            extend_borrow_due_date,
            return_borrow_transaction,
            list_borrow_transactions,
            list_book_borrow_transactions,
            create_reservation,
            list_reservations,
            update_reservation_status,
            update_reservation,
            delete_reservation,
            create_staff,
            list_staff,
            update_staff,
            delete_staff,
            login,
            logout,
            get_active_session,
            list_login_trail,
            change_password,
            expand_main_window,
            restore_login_window,
            send_email_smtp,
            send_manual_email_reminder,
            run_automatic_email_reminders,
            list_email_logs,
            get_email_log_stats,
            test_email_configuration,
            test_sms_configuration,
            send_manual_sms,
            send_sms_gateway,
            export_report,
            sync_notifications,
            list_notifications,
            mark_notification_as_read,
            mark_all_notifications_read
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
