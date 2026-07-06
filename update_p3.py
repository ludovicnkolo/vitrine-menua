import re

files = {
    'page.tsx': [
        "Des données fiabilisées pour un pilotage éclairé.",
        "Une maîtrise accrue des coûts et de la performance.",
        "Des opérations fluides et des données structurées.",
        "Un support administratif réactif pour vos conseillers.",
        "Vos méthodes, vos outils, vos procédures. Nous nous adaptons à votre organisation pour un renfort immédiatement opérationnel.",
        "Une supervision continue et un contrôle à quatre yeux sur chaque livrable, garantissant une fiabilité et une traçabilité sans faille.",
        "Une capacité d'intervention en français et en anglais pour une gestion fluide de vos opérations et reportings dans un contexte international",
        "Mobilisation rapide de ressources pour absorber un pic d'activité ou un besoin immédiat.",
        "De la mission ponctuelle à l'externalisation continue, la flexibilité contractuelle que vous attendez.",
        "Un dimensionnement d'équipe ajusté à la charge de travail, pour une efficacité optimale.",
        "Intégration dédiée, prise en charge de processus métiers spécifiques, selon vos besoins."
    ],
    'nous-connaitre/page.tsx': [
        "Notre approche repose sur la continuité des opérations, garantissant une exécution ininterrompue et fiable pour vos équipes.",
        "Chaque intervention est documentée, tracée et conforme aux procédures internes et aux circuits de validation de votre organisation.",
        "Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges et des reportings dans un contexte international.",
        "Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.",
        "Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l'entrée en relation.",
        "Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.",
        "Déploiement des équipes et intégration aux outils, process et standards de votre organisation.",
        "Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables."
    ]
}

base_path = '/home/kratos-financials-inc/Documents/kratos/site_web/src/app/'

for filename, texts in files.items():
    filepath = base_path + filename
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for text in texts:
        # We need to find the <p className="..."> tag before the text and replace the className with "p-3"
        # The text might be inside a map() function. Let's check how they are stored.
        # Most of them are in arrays: `desc: t("...", "...")`
        # We should just search for className="..." next to the text, OR modify the className of the <p> that renders item.desc.
        pass
