$ErrorActionPreference = "SilentlyContinue"

$port = 5173
$pids = Get-NetTCPConnection -LocalPort $port -State Listen | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($pidValue in $pids) {
  if ($pidValue -and $pidValue -ne $PID) {
    Stop-Process -Id $pidValue -Force
  }
}

$runningApp = Get-Process app | Where-Object { $_.Path -like "*\\src-tauri\\target\\debug\\app.exe" }
foreach ($proc in $runningApp) {
  if ($proc.Id -ne $PID) {
    Stop-Process -Id $proc.Id -Force
  }
}

$ErrorActionPreference = "Continue"

npm run dev -- --host 127.0.0.1 --port 5173
