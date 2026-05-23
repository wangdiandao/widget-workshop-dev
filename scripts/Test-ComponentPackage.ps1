param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

$ErrorActionPreference = 'Stop'

function Fail([string]$Message) { throw $Message }
function Assert-File([string]$Path) { if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { Fail "Missing file: $Path" } }
function Read-Json([string]$Path) { Assert-File $Path; return Get-Content -Raw -Encoding UTF8 -LiteralPath $Path | ConvertFrom-Json }
function Has-Property($Object, [string]$Name) { return $null -ne $Object.PSObject.Properties[$Name] }

$packageRoot = (Resolve-Path -LiteralPath $Path).Path
$manifestPath = Join-Path $packageRoot 'manifest.json'
$manifest = Read-Json $manifestPath

foreach ($field in @('packageId', 'displayName', 'version', 'preview', 'windowSize', 'hasCustomSettings')) {
    if (-not (Has-Property $manifest $field)) { Fail "manifest.json missing required field '$field'." }
}

if ($manifest.packageId -notmatch '^[a-z0-9][a-z0-9.-]*[a-z0-9]$') { Fail 'manifest.packageId must use lowercase letters, digits, dots, and hyphens.' }
if ([string]::IsNullOrWhiteSpace([string]$manifest.displayName)) { Fail 'manifest.displayName must not be empty.' }
if ($manifest.version -notmatch '^[A-Za-z0-9.+-]+$') { Fail 'manifest.version contains unsupported characters.' }
if (-not (Has-Property $manifest.windowSize 'width') -or -not (Has-Property $manifest.windowSize 'height')) { Fail 'manifest.windowSize requires width and height.' }
if ([double]$manifest.windowSize.width -le 0 -or [double]$manifest.windowSize.height -le 0) { Fail 'manifest.windowSize width and height must be positive.' }

foreach ($field in @('schemaVersion', 'entry', 'initEntry', 'defaultSize', 'sizeLimits', 'capabilities', 'settingsEntry', 'author')) {
    if (Has-Property $manifest $field) { Fail "manifest.json uses removed field '$field'." }
}
if ((Has-Property $manifest 'locales') -and (Has-Property $manifest.locales 'resources')) { Fail 'manifest.locales.resources is removed.' }

if ([string]$manifest.preview -match '(^[A-Za-z]:|^/|\\|(^|/)\.\.(/|$))') { Fail 'manifest.preview must be a safe package-relative path.' }
if (@('.png', '.jpg', '.jpeg') -notcontains [System.IO.Path]::GetExtension([string]$manifest.preview).ToLowerInvariant()) { Fail 'manifest.preview must be .png, .jpg, or .jpeg.' }
Assert-File (Join-Path $packageRoot ([string]$manifest.preview).Replace('/', [System.IO.Path]::DirectorySeparatorChar))
Assert-File (Join-Path $packageRoot 'index.html')

$allowedCategories = @('dashboard', 'productivity', 'desktop_personalization', 'workflow_integrations', 'device_environment', 'lifestyle')
$allowedPermissions = @('app', 'host', 'process', 'system', 'screen', 'theme', 'power', 'shell', 'dialog', 'clipboard', 'storage', 'files', 'fetch')
if (Has-Property $manifest 'categories') {
    foreach ($category in @($manifest.categories)) { if ($allowedCategories -notcontains [string]$category) { Fail "Unknown manifest category '$category'." } }
}
if (Has-Property $manifest 'permissions') {
    foreach ($permission in @($manifest.permissions)) {
        if ($allowedPermissions -notcontains [string]$permission) { Fail "Unknown permission category '$permission'." }
        if ([string]$permission -match '\.') { Fail "Permissions must be categories, not methods: '$permission'." }
    }
}

if ($manifest.hasCustomSettings -eq $true) {
    $settingsPath = Join-Path $packageRoot 'scripts\settings.json'
    $settings = Read-Json $settingsPath
    if ($settings.schemaVersion -ne 1) { Fail 'scripts/settings.json schemaVersion must be 1.' }
    if (-not (Has-Property $settings 'fields')) { Fail 'scripts/settings.json requires fields.' }
    $seenKeys = @{}
    foreach ($field in @($settings.fields)) {
        foreach ($requiredField in @('key', 'label', 'type', 'control', 'default')) {
            if (-not (Has-Property $field $requiredField)) { Fail "settings field missing '$requiredField'." }
        }
        if ($seenKeys.ContainsKey([string]$field.key)) { Fail "Duplicate settings key '$($field.key)'." }
        $seenKeys[[string]$field.key] = $true
        if ($field.control -in @('select', 'segmented') -and -not (Has-Property $field 'options')) { Fail "settings field '$($field.key)' requires options." }
    }
    $defaultsPath = Join-Path $packageRoot 'scripts\settings.default.json'
    if (Test-Path -LiteralPath $defaultsPath -PathType Leaf) { [void](Read-Json $defaultsPath) }
} else {
    if (Test-Path -LiteralPath (Join-Path $packageRoot 'scripts\settings.json')) { Fail 'hasCustomSettings is false but scripts/settings.json exists.' }
}

if (Has-Property $manifest 'locales') {
    if (-not (Has-Property $manifest.locales 'default') -or -not (Has-Property $manifest.locales 'supported')) { Fail 'manifest.locales requires default and supported.' }
    $supported = @($manifest.locales.supported)
    if ($supported -notcontains [string]$manifest.locales.default) { Fail 'manifest.locales.supported must include locales.default.' }
    foreach ($locale in $supported) { Assert-File (Join-Path $packageRoot "locales\$locale.json") }
}

Write-Host "Component package validation passed: $packageRoot"