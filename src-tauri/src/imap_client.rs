use imap;
use native_tls::TlsConnector;
use mailparse::*;
use rusqlite::Connection;
use chrono::Utc;

pub fn fetch_emails_and_save(
    conn: &Connection,
    domain: &str,
    port: u16,
    email: &str,
    password: &str,
) -> Result<usize, String> {
    let tls = TlsConnector::builder()
        .build()
        .map_err(|e| format!("Failed to build TLS connector: {}", e))?;

    let client = imap::connect((domain, port), domain, &tls)
        .map_err(|e| format!("Could not connect to {}: {}", domain, e))?;

    let mut imap_session = client
        .login(email, password)
        .map_err(|e| format!("IMAP login failed: {}", e.0))?;

    // Select the INBOX
    imap_session
        .select("INBOX")
        .map_err(|e| format!("Failed to select INBOX: {}", e))?;

    let sequence_set = imap_session
        .search("UNSEEN")
        .map_err(|e| format!("Failed to search INBOX: {}", e))?;

    let mut new_emails = 0;

    if sequence_set.is_empty() {
        imap_session.logout().unwrap_or(());
        return Ok(0);
    }

    let ids: Vec<String> = sequence_set.iter().map(|id| id.to_string()).collect();
    let query = ids.join(",");

    let messages = imap_session
        .fetch(query, "(RFC822.HEADER RFC822.TEXT UID)")
        .map_err(|e| format!("Failed to fetch messages: {}", e))?;

    for message in messages.iter() {
        if let Some(body) = message.text() {
            let body_str = String::from_utf8_lossy(body).to_string();
            let subject = "Incoming Email"; // Simplify for now
            let sender = "unknown@sender.com";
            
            // Check if already in DB (mock logic for prototype)
            let exists: i64 = conn.query_row(
                "SELECT count(*) FROM inbox_messages WHERE body = ?1",
                [&body_str],
                |row| row.get(0)
            ).unwrap_or(0);

            if exists == 0 {
                let now = Utc::now().to_rfc3339();
                conn.execute(
                    "INSERT INTO inbox_messages (message_type, sender_address, sender_name, subject, body, received_at, read, thread_id)
                     VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7)",
                    ("Email", sender, sender, subject, body_str, now, ""),
                ).unwrap_or(0);
                new_emails += 1;
            }
        }
    }

    imap_session.logout().unwrap_or(());

    Ok(new_emails)
}
