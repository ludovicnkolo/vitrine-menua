import base64

with open('apps/vitrine/public/img/logo-clean-light.webp', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Site en maintenance | Menua Consulting</title>
    <style>
        body {{ 
            font-family: 'Inter', sans-serif; 
            background-color: #141824; 
            color: #ffffff; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
            text-align: center; 
        }}
        .logo-container {{
            margin-bottom: 50px;
        }}
        .logo {{ 
            max-width: 250px; 
            height: auto;
        }}
        .icon-container {{
            margin-bottom: 30px;
        }}
        .icon-container svg {{
            width: 80px;
            height: 80px;
            stroke: #ffffff;
            stroke-width: 1.5;
            fill: none;
        }}
        p {{ 
            font-size: 1.1rem; 
            color: #ffffff; 
            max-width: 600px; 
            line-height: 1.6; 
            margin-bottom: 40px;
        }}
        .divider {{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 40px 0;
            width: 300px;
        }}
        .divider::before, .divider::after {{
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }}
        .divider-dot {{
            width: 6px;
            height: 6px;
            background-color: #ffffff;
            border-radius: 50%;
            margin: 0 15px;
        }}
        .contact-container {{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
        }}
        .contact-container svg {{
            width: 30px;
            height: 30px;
            stroke: #ffffff;
            stroke-width: 1.5;
            fill: none;
            margin-bottom: 15px;
        }}
        .contact-text {{
            font-size: 1rem;
            color: #ffffff;
        }}
    </style>
</head>
<body>
    <div class="logo-container">
        <img src="data:image/webp;base64,{img_b64}" alt="Menua Consulting" class="logo">
    </div>
    
    <div class="icon-container">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 3"></path>
        </svg>
    </div>

    <p>Notre site fait actuellement l'objet d'une opération de maintenance<br>pour mieux vous servir. Nous serons de retour dans quelques minutes.</p>
    
    <div class="divider">
        <div class="divider-dot"></div>
    </div>

    <div class="contact-container">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
            <polyline points="3 7 12 13 21 7"></polyline>
        </svg>
        <div class="contact-text">Pour toute urgence : contact@menua-consulting.com</div>
    </div>
</body>
</html>
"""

with open('docker_nginx/maintenance.html', 'w') as f:
    f.write(html_content)

print("Maintenance page generated.")
