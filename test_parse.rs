use chrono::DateTime;
fn main() {
    let date_str = "2026-05-28T08:01:34.333Z";
    match DateTime::parse_from_rfc3339(date_str) {
        Ok(d) => println!("Parsed: {:?}", d),
        Err(e) => println!("Error: {:?}", e),
    }
}
