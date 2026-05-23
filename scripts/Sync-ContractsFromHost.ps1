param(
    [Parameter(Mandatory = $true)]
    [string]$WidgetWorkshopRepo
)

$ErrorActionPreference = 'Stop'

function Fail([string]$Message) { throw $Message }
function Assert-File([string]$Path) { if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { Fail "Missing file: $Path" } }
function Read-Json([string]$Path) { Assert-File $Path; return Get-Content -Raw -Encoding UTF8 -LiteralPath $Path | ConvertFrom-Json }
function Extract-ConstMap([string]$Source, [string]$ClassName) {
    $classMatch = [regex]::Match($Source, "public static class $ClassName[\s\S]*?public static bool IsKnown")
    if (-not $classMatch.Success) { Fail "Could not find $ClassName in WidgetPackageModels.cs" }
    $map = @{}
    foreach ($match in [regex]::Matches($classMatch.Value, 'public const string\s+(?<name>\w+)\s+=\s+"(?<value>[^"]+)"')) {
        $map[$match.Groups['name'].Value] = $match.Groups['value'].Value
    }
    return $map
}

$repoRoot = (Resolve-Path -LiteralPath $WidgetWorkshopRepo).Path
$modelsPath = Join-Path $repoRoot 'widget_workshop\WidgetWorkshop.Core\Packages\WidgetPackageModels.cs'
$hostApiPath = Join-Path $repoRoot 'widget_workshop\Services\WidgetWorkshopHostApiService.cs'
Assert-File $modelsPath
Assert-File $hostApiPath

$toolRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$permissionContract = Read-Json (Join-Path $toolRoot 'contracts\permission-categories.json')
$categoryContract = Read-Json (Join-Path $toolRoot 'contracts\component-categories.json')
$hostTypesPath = Join-Path $toolRoot 'contracts\host-api.d.ts'
Assert-File $hostTypesPath
$hostTypes = Get-Content -Raw -Encoding UTF8 -LiteralPath $hostTypesPath

$modelsSource = Get-Content -Raw -Encoding UTF8 -LiteralPath $modelsPath
$hostSource = Get-Content -Raw -Encoding UTF8 -LiteralPath $hostApiPath
$permissionConstMap = Extract-ConstMap $modelsSource 'WidgetPermissionCategories'
$categoryConstMap = Extract-ConstMap $modelsSource 'WidgetPackageCategories'

$expectedPermissions = @($permissionContract.categories | ForEach-Object { $_.key })
$expectedCategories = @($categoryContract.categories | ForEach-Object { $_.key })

foreach ($key in $expectedPermissions) { if ($permissionConstMap.Values -notcontains $key) { Fail "Host source missing permission category '$key'." } }
foreach ($key in $permissionConstMap.Values) { if ($expectedPermissions -notcontains $key) { Fail "contracts/permission-categories.json missing host category '$key'." } }
foreach ($key in $expectedCategories) { if ($categoryConstMap.Values -notcontains $key) { Fail "Host source missing component category '$key'." } }
foreach ($key in $categoryConstMap.Values) { if ($expectedCategories -notcontains $key) { Fail "contracts/component-categories.json missing host category '$key'." } }

foreach ($entry in $permissionConstMap.GetEnumerator()) {
    $pattern = '\[WidgetPermissionCategories\.' + [regex]::Escape($entry.Key) + '\][\s\S]*?\{(?<methods>[\s\S]*?)\}'
    $match = [regex]::Match($hostSource, $pattern)
    if (-not $match.Success) { Fail "Host API method table missing category '$($entry.Value)'." }
    foreach ($methodMatch in [regex]::Matches($match.Groups['methods'].Value, '"(?<method>[^"]+)"')) {
        $method = $methodMatch.Groups['method'].Value
        if ($hostTypes.IndexOf($method, [StringComparison]::Ordinal) -lt 0) {
            Fail "contracts/host-api.d.ts missing method '$($entry.Value).$method'."
        }
    }
}

Write-Host "Host contract sync check passed against $repoRoot"