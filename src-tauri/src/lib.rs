use chrono::Utc;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Book {
  id: i64,
  title: String,
  author: String,
  category: Option<String>,
  isbn: Option<String>,
  cover_data: Option<String>,
  available: bool,
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
  available: bool,
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
  conn
    .execute_batch(
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
        available INTEGER NOT NULL DEFAULT 1,
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
      ",
    )
    .map_err(|e| format!("init schema failed: {e}"))?;

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

  conn
    .execute(
      "
      INSERT INTO users (username, password, role, is_active, created_at)
      VALUES (?1, ?2, 'Admin', 1, ?3)
      ON CONFLICT(username) DO NOTHING
      ",
      params!["admin", "admin", Utc::now().to_rfc3339()],
    )
    .map_err(|e| format!("seed admin user failed: {e}"))?;

  Ok(())
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
  conn
    .execute(
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
fn create_book(app: tauri::AppHandle, payload: CreateBookPayload) -> Result<i64, String> {
  let conn = open_db(&database_path(&app)?)?;
  init_schema(&conn)?;
  conn
    .execute(
      "INSERT INTO books (title, author, category, isbn, cover_data, available, created_at) VALUES (?1, ?2, ?3, ?4, ?5, 1, ?6)",
      params![
        payload.title,
        payload.author,
        payload.category.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.isbn,
        payload.cover_data,
        Utc::now().to_rfc3339()
      ],
    )
    .map_err(|e| format!("create book failed: {e}"))?;
  Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn list_books(app: tauri::AppHandle, limit: Option<i64>) -> Result<Vec<Book>, String> {
  let conn = open_db(&database_path(&app)?)?;
  init_schema(&conn)?;
  let max_rows = limit.unwrap_or(50).clamp(1, 500);
  let mut stmt = conn
    .prepare(
      "SELECT id, title, author, category, isbn, cover_data, available, created_at
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
        available: row.get::<_, i64>(6)? == 1,
        created_at: row.get(7)?,
      })
    })
    .map_err(|e| format!("list books failed: {e}"))?;

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| format!("collect rows failed: {e}"))
}

#[tauri::command]
fn update_book(app: tauri::AppHandle, payload: UpdateBookPayload) -> Result<(), String> {
  let conn = open_db(&database_path(&app)?)?;
  init_schema(&conn)?;
  conn
    .execute(
      "
      UPDATE books
      SET title = ?1,
          author = ?2,
          category = ?3,
          isbn = ?4,
          cover_data = ?5,
          available = ?6
      WHERE id = ?7
      ",
      params![
        payload.title,
        payload.author,
        payload.category.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.isbn,
        payload.cover_data,
        if payload.available { 1 } else { 0 },
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
  conn
    .execute("DELETE FROM books WHERE id = ?1", params![id])
    .map_err(|e| format!("delete book failed: {e}"))?;
  Ok(())
}

#[tauri::command]
fn create_member(app: tauri::AppHandle, payload: CreateMemberPayload) -> Result<i64, String> {
  let full_name = payload.full_name.trim();
  let member_type = payload.member_type.trim();
  let member_id = payload.member_id.trim();
  if full_name.is_empty() || member_type.is_empty() || member_id.is_empty() {
    return Err("fullName, memberType, and memberId are required".to_string());
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
        payload.email.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
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

  rows
    .collect::<Result<Vec<_>, _>>()
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
  conn
    .execute(
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
        payload.department.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.contact_number.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.email.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
        payload.address.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
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

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| format!("collect authors failed: {e}"))
}

#[tauri::command]
fn delete_author(app: tauri::AppHandle, id: i64) -> Result<(), String> {
  let conn = open_db(&database_path(&app)?)?;
  init_schema(&conn)?;
  conn
    .execute("DELETE FROM authors WHERE id = ?1", params![id])
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
  conn
    .execute(
      "
      INSERT INTO categories (name, description, status, created_at)
      VALUES (?1, ?2, ?3, ?4)
      ",
      params![
        name,
        payload.description.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
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

  rows
    .collect::<Result<Vec<_>, _>>()
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
  conn
    .execute(
      "
      UPDATE categories
      SET name = ?1,
          description = ?2,
          status = ?3
      WHERE id = ?4
      ",
      params![
        name,
        payload.description.map(|v| v.trim().to_string()).filter(|v| !v.is_empty()),
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
  conn
    .execute("DELETE FROM categories WHERE id = ?1", params![id])
    .map_err(|e| format!("delete category failed: {e}"))?;
  Ok(())
}

#[tauri::command]
fn send_email_smtp(to: String, subject: String, body: String) -> Result<String, String> {
  let summary = format!(
    "SMTP stub queued. To: {to}, Subject: {subject}, Body chars: {}",
    body.chars().count()
  );
  Ok(summary)
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

  let role = stmt.query_row(params![username, password], |row| row.get::<_, String>(0));

  match role {
    Ok(role) => {
      conn
        .execute("UPDATE sessions SET is_active = 0, logout_at = ?1 WHERE is_active = 1", params![Utc::now().to_rfc3339()])
        .map_err(|e| format!("close previous sessions failed: {e}"))?;
      conn
        .execute(
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
  conn
    .execute(
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
      init_db,
      set_setting,
      get_setting,
      create_book,
      list_books,
      update_book,
      delete_book,
      create_member,
      list_members,
      update_member,
      create_author,
      list_authors,
      delete_author,
      create_category,
      list_categories,
      update_category,
      delete_category,
      login,
      logout,
      get_active_session,
      expand_main_window,
      restore_login_window,
      send_email_smtp,
      send_sms_gateway,
      export_report
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
