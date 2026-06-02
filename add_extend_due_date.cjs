const fs = require('fs');
let rsContent = fs.readFileSync('src-tauri/src/lib.rs', 'utf8');

const rsPayload = `
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExtendDueDatePayload {
  transaction_id: i64,
  new_due_date: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReturnBorrowPayload {
`;

rsContent = rsContent.replace(
  `#[derive(Debug, Deserialize)]\r\n#[serde(rename_all = "camelCase")]\r\nstruct ReturnBorrowPayload {`,
  rsPayload.trim()
);

const rsFunction = `
#[tauri::command]
fn extend_borrow_due_date(app: tauri::AppHandle, payload: ExtendDueDatePayload) -> Result<(), String> {
  let conn = open_db(&database_path(&app)?)?;
  init_schema(&conn)?;

  let mut stmt = conn.prepare("UPDATE borrow_transactions SET due_date = ?1 WHERE id = ?2 AND return_date IS NULL")
    .map_err(|e| format!("prepare extend due date failed: {e}"))?;

  stmt.execute(params![payload.new_due_date, payload.transaction_id])
    .map_err(|e| format!("execute extend due date failed: {e}"))?;

  Ok(())
}

#[tauri::command]
fn return_borrow_transaction(
`;

rsContent = rsContent.replace(
  `#[tauri::command]\r\nfn return_borrow_transaction(`,
  rsFunction.trim()
);

rsContent = rsContent.replace(
  `create_borrow_transaction,\r\n        return_borrow_transaction,`,
  `create_borrow_transaction,\r\n        extend_borrow_due_date,\r\n        return_borrow_transaction,`
);

fs.writeFileSync('src-tauri/src/lib.rs', rsContent);
