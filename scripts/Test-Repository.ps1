$ErrorActionPreference = 'Stop'

function Fail([string]$Message) { throw $Message }
function Assert-File([string]$Path) { if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { Fail "Missing file: $Path" } }
function Read-Json([string]$Path) { Assert-File $Path; return Get-Content -Raw -Encoding UTF8 -LiteralPath $Path | ConvertFrom-Json }
function Assert-Contains([string]$Text, [string]$Needle, [string]$Path) { if ($Text.IndexOf($Needle, [StringComparison]::Ordinal) -lt 0) { Fail "Expected '$Needle' in $Path" } }
function Assert-NotContains([string]$Text, [string]$Needle, [string]$Path) { if ($Text.IndexOf($Needle, [StringComparison]::Ordinal) -ge 0) { Fail "Unexpected '$Needle' in $Path" } }

$repoRoot = Split-Path -Parent $PSScriptRoot

$requiredFiles = @(
    'README.md', 'AGENTS.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'RELEASING.md', 'SECURITY.md', 'SUPPORT.md', 'CODE_OF_CONDUCT.md', 'THIRD_PARTY_NOTICES.md',
    '.github\plugin\marketplace.json', '.github\workflows\pr-validation.yml', '.github\workflows\release-policy.yml',
    'contracts\host-api.d.ts', 'contracts\permission-categories.json', 'contracts\component-categories.json',
    'schemas\manifest.schema.json', 'schemas\settings.schema.json',
    'examples\minimal-clock\manifest.json', 'examples\minimal-clock\index.html', 'examples\minimal-clock\preview.png'
)
foreach ($relative in $requiredFiles) { Assert-File (Join-Path $repoRoot $relative) }

& (Join-Path $repoRoot 'scripts\Test-Plugin.ps1') -PluginPath (Join-Path $repoRoot 'plugins\widget-workshop')
& (Join-Path $repoRoot 'scripts\Test-ComponentPackage.ps1') -Path (Join-Path $repoRoot 'examples\minimal-clock')

Get-ChildItem -Path $repoRoot -Recurse -File -Filter '*.json' | Where-Object { $_.FullName -notmatch '\\.git\\' } | ForEach-Object {
    [void](Get-Content -Raw -Encoding UTF8 -LiteralPath $_.FullName | ConvertFrom-Json)
}

$enDocs = Get-ChildItem -Path (Join-Path $repoRoot 'docs\en-US') -File -Filter '*.md' | ForEach-Object { $_.Name } | Sort-Object
$zhDocs = Get-ChildItem -Path (Join-Path $repoRoot 'docs\zh-CN') -File -Filter '*.md' | ForEach-Object { $_.Name } | Sort-Object
if (($enDocs -join '|') -ne ($zhDocs -join '|')) { Fail 'docs/en-US and docs/zh-CN Markdown files must mirror each other.' }

$marketplace = Read-Json (Join-Path $repoRoot '.github\plugin\marketplace.json')
$plugin = Read-Json (Join-Path $repoRoot 'plugins\widget-workshop\plugin.json')
$codex = Read-Json (Join-Path $repoRoot 'plugins\widget-workshop\.codex-plugin\plugin.json')
$claude = Read-Json (Join-Path $repoRoot 'plugins\widget-workshop\.claude-plugin\plugin.json')
$versions = @($marketplace.metadata.version, $marketplace.plugins[0].version, $plugin.version, $codex.version, $claude.version)
if (($versions | Select-Object -Unique).Count -ne 1) { Fail "Version mismatch: $($versions -join ', ')" }

Get-ChildItem -Path $repoRoot -Recurse -File -Include *.md,*.json,*.yaml,*.yml,*.ps1,*.ts,*.html | Where-Object { $_.FullName -notmatch '\\.git\\' } | ForEach-Object {
    $text = Get-Content -Raw -Encoding UTF8 -LiteralPath $_.FullName
    Assert-NotContains $text ('dev/' + 'plugin/widget-workshop') $_.FullName
    Assert-NotContains $text ('dev/' + 'docs') $_.FullName
    Assert-NotContains $text ('WidgetWorkshop' + '.csproj') $_.FullName
    Assert-NotContains $text ('steamworks' + '_sdk') $_.FullName
}

$linkPattern = [regex]'\[[^\]]+\]\((?<target>[^)]+)\)'
Get-ChildItem -Path $repoRoot -Recurse -File -Filter '*.md' | Where-Object { $_.FullName -notmatch '\\.git\\' } | ForEach-Object {
    $file = $_.FullName
    $source = Get-Content -Raw -Encoding UTF8 -LiteralPath $file
    foreach ($match in $linkPattern.Matches($source)) {
        $rawTarget = $match.Groups['target'].Value.Trim()
        if ([string]::IsNullOrWhiteSpace($rawTarget) -or $rawTarget.StartsWith('#') -or $rawTarget.StartsWith('http://') -or $rawTarget.StartsWith('https://') -or $rawTarget.StartsWith('mailto:')) { continue }
        $targetNoAnchor = $rawTarget.Trim('<', '>')
        $anchorIndex = $targetNoAnchor.IndexOf('#')
        if ($anchorIndex -ge 0) { $targetNoAnchor = $targetNoAnchor.Substring(0, $anchorIndex) }
        if ([string]::IsNullOrWhiteSpace($targetNoAnchor)) { continue }
        $resolved = [System.IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $file) ($targetNoAnchor.Replace('/', [System.IO.Path]::DirectorySeparatorChar))))
        if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) { Fail "Broken Markdown link '$rawTarget' in $file" }
    }
}

$hostTypes = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot 'contracts\host-api.d.ts')
foreach ($needle in @('WidgetWorkshopApi', 'WidgetWorkshopScreenApi', 'fetch: WidgetWorkshopFetchApi', 'getPermissionGrants')) {
    Assert-Contains $hostTypes $needle 'contracts/host-api.d.ts'
}

Write-Host "Repository validation passed: $repoRoot"