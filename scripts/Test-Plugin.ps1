param(
    [Parameter(Mandatory = $true)]
    [string]$PluginPath
)

$ErrorActionPreference = 'Stop'

function Fail([string]$Message) { throw $Message }
function Assert-File([string]$Path) { if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { Fail "Missing file: $Path" } }
function Assert-Directory([string]$Path) { if (-not (Test-Path -LiteralPath $Path -PathType Container)) { Fail "Missing directory: $Path" } }
function Read-Json([string]$Path) { Assert-File $Path; return Get-Content -Raw -Encoding UTF8 -LiteralPath $Path | ConvertFrom-Json }
function Assert-Contains([string]$Text, [string]$Needle, [string]$Path) { if ($Text.IndexOf($Needle, [StringComparison]::Ordinal) -lt 0) { Fail "Expected '$Needle' in $Path" } }
function Assert-NotContains([string]$Text, [string]$Needle, [string]$Path) { if ($Text.IndexOf($Needle, [StringComparison]::Ordinal) -ge 0) { Fail "Unexpected '$Needle' in $Path" } }

$pluginRoot = (Resolve-Path -LiteralPath $PluginPath).Path
$expectedSkills = @(
    'widget-workshop-setup',
    'widget-workshop-component-authoring',
    'widget-workshop-host-api',
    'widget-workshop-validation',
    'widget-workshop-troubleshooting',
    'widget-workshop-review'
)

Assert-File (Join-Path $pluginRoot 'plugin.json')
Assert-File (Join-Path $pluginRoot '.codex-plugin\plugin.json')
Assert-File (Join-Path $pluginRoot '.claude-plugin\plugin.json')
Assert-File (Join-Path $pluginRoot 'agents\widget-workshop-dev.agent.md')
Assert-Directory (Join-Path $pluginRoot 'skills')

$manifestPaths = @(
    (Join-Path $pluginRoot 'plugin.json'),
    (Join-Path $pluginRoot '.codex-plugin\plugin.json'),
    (Join-Path $pluginRoot '.claude-plugin\plugin.json')
)
foreach ($manifestPath in $manifestPaths) {
    $manifest = Read-Json $manifestPath
    if ($manifest.name -ne 'widget-workshop') { Fail "Unexpected plugin name in $manifestPath" }
    if ($manifest.version -ne '0.1.0') { Fail "Unexpected plugin version in $manifestPath" }
    if (-not $manifest.description -or $manifest.description -notmatch 'Widget Workshop') { Fail "Plugin description should mention Widget Workshop in $manifestPath" }
    if (-not $manifest.license -or $manifest.license -ne 'MIT') { Fail "Plugin manifest should declare MIT license in $manifestPath" }
}

$agentPath = Join-Path $pluginRoot 'agents\widget-workshop-dev.agent.md'
$agent = Get-Content -Raw -Encoding UTF8 -LiteralPath $agentPath
Assert-Contains $agent 'user-invocable: true' $agentPath
Assert-Contains $agent 'docs/en-US' $agentPath
Assert-Contains $agent 'contracts/' $agentPath
foreach ($skillName in $expectedSkills) { Assert-Contains $agent $skillName $agentPath }
Assert-NotContains $agent ('dev/' + 'plugin/widget-workshop') $agentPath
Assert-NotContains $agent ('dev/' + 'docs') $agentPath

foreach ($skillName in $expectedSkills) {
    $skillPath = Join-Path $pluginRoot "skills\$skillName\SKILL.md"
    $metadataPath = Join-Path $pluginRoot "skills\$skillName\agents\openai.yaml"
    Assert-File $skillPath
    Assert-File $metadataPath
    $skill = Get-Content -Raw -Encoding UTF8 -LiteralPath $skillPath
    Assert-Contains $skill "name: $skillName" $skillPath
    Assert-Contains $skill 'description:' $skillPath
    Assert-NotContains $skill '[TODO' $skillPath
    Assert-NotContains $skill ('dev/' + 'plugin/widget-workshop') $skillPath
    Assert-NotContains $skill ('dev/' + 'docs') $skillPath

    $metadata = Get-Content -Raw -Encoding UTF8 -LiteralPath $metadataPath
    Assert-Contains $metadata 'interface:' $metadataPath
    Assert-Contains $metadata 'display_name:' $metadataPath
    Assert-Contains $metadata 'short_description:' $metadataPath
    Assert-Contains $metadata 'default_prompt:' $metadataPath
    Assert-Contains $metadata "`$$skillName" $metadataPath
    Assert-NotContains $metadata "`t" $metadataPath
}

Write-Host "Plugin validation passed: $pluginRoot"