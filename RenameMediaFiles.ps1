# Définir le dossier racine du projet
$rootFolder = (Get-Location).Path

# Extensions ciblées (vous pouvez en ajouter si nécessaire)
$fileExtensions = @("jpg", "jpeg", "png", "gif", "mp4", "mov")

# Fonction pour renommer les fichiers
function Rename-MediaFiles {
    param (
        [string]$folder
    )

    Get-ChildItem -Path $folder -Recurse -File | Where-Object {
        $fileExtensions -contains $_.Extension.TrimStart(".").ToLower()
    } | ForEach-Object {
        $oldPath = $_.FullName

        # Appliquer les remplacements au nom du fichier
        $newName = $_.BaseName -replace "\s", "-"      # Remplace les espaces par des tirets
        $newName = $newName -replace "[^\w\-.]", ""    # Supprime les caractères non valides
        $newName = $newName.ToLower()                 # Mettre en minuscule
        $newPath = Join-Path -Path $_.DirectoryName -ChildPath ("$newName$($_.Extension)")

        # Renommer le fichier si nécessaire
        if ($oldPath -ne $newPath) {
            Rename-Item -Path $oldPath -NewName $newPath -Force
            Write-Host "Renommé : $oldPath -> $newPath" -ForegroundColor Green
        } else {
            Write-Host "Aucun changement pour : $oldPath" -ForegroundColor Yellow
        }
    }
}

# Appeler la fonction sur le dossier racine
Rename-MediaFiles -folder $rootFolder

Write-Host "Renommage terminé." -ForegroundColor Cyan
