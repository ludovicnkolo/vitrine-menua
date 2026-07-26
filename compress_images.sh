#!/bin/bash

IMG_DIR="apps/vitrine/public/img"

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null
then
    echo "L'outil 'convert' d'ImageMagick n'est pas installé."
    exit 1
fi

echo "Début de la compression des images dans $IMG_DIR..."

for img in "$IMG_DIR"/*.{jpg,jpeg,png}; do
    # Vérifier si le fichier existe (au cas où il n'y a pas d'image de ce type)
    if [[ -f "$img" ]]; then
        # Extraire le nom de fichier sans l'extension
        filename="${img%.*}"
        
        # Convertir en webp avec une qualité de 80% (excellent ratio qualité/poids)
        # On réduit aussi la taille max à 1920px de large si c'est plus grand
        convert "$img" -resize '1920x>' -quality 80 "$filename.webp"
        
        # Afficher la différence de taille
        old_size=$(du -h "$img" | cut -f1)
        new_size=$(du -h "$filename.webp" | cut -f1)
        
        echo "✅ Converti : $(basename "$img") ($old_size) -> $(basename "$filename.webp") ($new_size)"
        
        # Optionnel: supprimer l'ancienne image pour nettoyer le dossier
        rm "$img"
    fi
done

echo "Toutes les images ont été compressées au format WebP !"
