# Convierte las siglas <text> de los iconos generados a paths, para que no
# dependan de las fuentes instaladas en cada equipo.
#
# Uso: powershell -ExecutionPolicy Bypass -File scripts/convert-text.ps1
$ErrorActionPreference = 'Stop'
$inkscape = 'C:\Program Files\Inkscape\bin\inkscape.com'
if (-not (Test-Path $inkscape)) {
  throw "No se encontró Inkscape en $inkscape"
}
$base = Join-Path $PSScriptRoot '..\icons'
$files = Get-ChildItem (Join-Path $base 'lang-*.svg')
$converted = 0
foreach ($file in $files) {
  $tmp = "$($file.FullName).tmp.svg"
  & $inkscape $file.FullName '--actions=select-all;object-to-path' '--export-plain-svg' "--export-filename=$tmp" 2>&1 | Out-Null
  if (-not (Test-Path $tmp)) {
    throw "Inkscape no generó $tmp"
  }
  Move-Item $tmp $file.FullName -Force
  $converted++
}
Write-Output "Convertidos $converted SVG a paths"
