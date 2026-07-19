const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add isProcessed to mock data
content = content.replace(
  /{ id: 'MSG-001', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Nouveau besoin de conseil', date: 'Aujourd\\'hui 10:30', status: 'NOUVEAU', isAnonyme: false, client: 'ACME Corp' }/,
  "{ id: 'MSG-001', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Nouveau besoin de conseil', date: 'Aujourd\\'hui 10:30', status: 'NOUVEAU', isAnonyme: false, client: 'ACME Corp', isProcessed: false }"
);
content = content.replace(
  /{ id: 'MSG-002', from: 'unknown@gmail.com', name: 'Paul Inconnu', subject: 'Candidature Spontanée', date: 'Hier 15:45', status: 'ATTRIBUE', isAnonyme: true, assignedTo: 'Alice Martin' }/,
  "{ id: 'MSG-002', from: 'unknown@gmail.com', name: 'Paul Inconnu', subject: 'Candidature Spontanée', date: 'Hier 15:45', status: 'ATTRIBUE', isAnonyme: true, assignedTo: 'Alice Martin', isProcessed: true }"
);
content = content.replace(
  /{ id: 'C-001', name: 'ACME Corp', email: 'contact@acme.com', phone: '\+33 1 23 45 67 89', type: 'Société', degree: 'Chaud', need: 'Accompagnement fiscal', date: 'Aujourd\\'hui 10:30', message: "Bonjour,\\n\\nNous souhaitons être accompagnés pour notre prochaine déclaration fiscale.\\n\\nCordialement,\\nDirection", attachment: 'bilan_2025\.pdf' }/,
  "{ id: 'C-001', name: 'ACME Corp', email: 'contact@acme.com', phone: '+33 1 23 45 67 89', type: 'Société', degree: 'Chaud', need: 'Accompagnement fiscal', date: 'Aujourd\\'hui 10:30', message: \"Bonjour,\\n\\nNous souhaitons être accompagnés pour notre prochaine déclaration fiscale.\\n\\nCordialement,\\nDirection\", attachment: 'bilan_2025.pdf', isProcessed: false }"
);
content = content.replace(
  /{ id: 'C-002', name: 'Paul Dupont', email: 'paul.d@gmail.com', phone: '\+33 6 12 34 56 78', type: 'Particulier', degree: 'Tiède', need: 'Création d\\'entreprise', date: 'Hier 15:45', message: "Bonjour,\\n\\nJe souhaite créer une SASU et j\\'aimerais connaître vos tarifs et l\\'accompagnement proposé." }/,
  "{ id: 'C-002', name: 'Paul Dupont', email: 'paul.d@gmail.com', phone: '+33 6 12 34 56 78', type: 'Particulier', degree: 'Tiède', need: 'Création d\\'entreprise', date: 'Hier 15:45', message: \"Bonjour,\\n\\nJe souhaite créer une SASU et j\\'aimerais connaître vos tarifs et l\\'accompagnement proposé.\", isProcessed: true }"
);
content = content.replace(
  /{ id: 'R-001', name: 'Sophie Martin', email: 'sophie.m@yahoo.fr', phone: '\+33 6 98 76 54 32', type: 'Candidat', skills: 'Expert Comptable', languages: 'Français, Anglais', date: '11:15', message: "Madame, Monsieur,\\n\\nJe suis très motivée pour rejoindre votre cabinet en tant qu\\'Expert Comptable.\\nVous trouverez mon CV ci-joint.", linkedin: 'linkedin.com\/in\/sophiemartin' }/,
  "{ id: 'R-001', name: 'Sophie Martin', email: 'sophie.m@yahoo.fr', phone: '+33 6 98 76 54 32', type: 'Candidat', skills: 'Expert Comptable', languages: 'Français, Anglais', date: '11:15', message: \"Madame, Monsieur,\\n\\nJe suis très motivée pour rejoindre votre cabinet en tant qu\\'Expert Comptable.\\nVous trouverez mon CV ci-joint.\", linkedin: 'linkedin.com/in/sophiemartin', isProcessed: false }"
);
content = content.replace(
  /{ id: 'R-002', name: 'Marc Leroi', email: 'm.leroi@outlook.com', phone: '\+33 6 11 22 33 44', type: 'Indépendant', skills: 'Juriste Fiscal', languages: 'Français', date: 'Il y a 2 jours', message: "Disponible pour des missions ponctuelles en droit fiscal.", cv: 'cv_marc_leroi\.pdf', linkedin: '' }/,
  "{ id: 'R-002', name: 'Marc Leroi', email: 'm.leroi@outlook.com', phone: '+33 6 11 22 33 44', type: 'Indépendant', skills: 'Juriste Fiscal', languages: 'Français', date: 'Il y a 2 jours', message: \"Disponible pour des missions ponctuelles en droit fiscal.\", cv: 'cv_marc_leroi.pdf', linkedin: '', isProcessed: true }"
);

// 2. Add useState to InboxPage
// find: const [tab, setTab] = useState('contact');
content = content.replace(
  "const [tab, setTab] = useState('contact');",
  "const [tab, setTab] = useState('contact');\n  const [filterTraite, setFilterTraite] = useState('all');"
);

// 3. Update the UI for Tabs to include the filter dropdown
const oldTabsUI = `<div style={{display: 'flex', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          {['contact', 'recrutement', 'interne', 'personnel'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)} 
              style={{
                background: tab === t ? 'var(--primary)' : 'transparent', 
                color: tab === t ? '#FFF' : 'var(--text-muted)', 
                border: tab === t ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                padding: '0 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '28px', fontSize: '0.875rem', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>`;

const newTabsUI = `<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          {['contact', 'recrutement', 'interne', 'personnel'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)} 
              style={{
                background: tab === t ? 'var(--primary)' : 'transparent', 
                color: tab === t ? '#FFF' : 'var(--text-muted)', 
                border: tab === t ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                padding: '0 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '28px', fontSize: '0.875rem', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div>
          <select 
            value={filterTraite}
            onChange={(e) => setFilterTraite(e.target.value)}
            style={{padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: '#FFF', fontSize: '0.875rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer'}}
          >
            <option value="all">Tous (Traitement)</option>
            <option value="non_traite">Non Traités</option>
            <option value="traite">Traités</option>
          </select>
        </div>
      </div>`;

content = content.replace(oldTabsUI, newTabsUI);

// 4. Update the render loops
// contact
content = content.replace(
  "{tab === 'contact' ? mockContactInbox.map(m => (",
  "{tab === 'contact' ? mockContactInbox.filter(m => filterTraite === 'all' ? true : filterTraite === 'traite' ? m.isProcessed === true : m.isProcessed !== true).map(m => ("
);
// recrutement
content = content.replace(
  ") : tab === 'recrutement' ? mockRecrutementInbox.map(m => (",
  ") : tab === 'recrutement' ? mockRecrutementInbox.filter(m => filterTraite === 'all' ? true : filterTraite === 'traite' ? m.isProcessed === true : m.isProcessed !== true).map(m => ("
);
// interne/personnel
content = content.replace(
  ")) : mockInbox.map(m => (",
  ")) : mockInbox.filter(m => filterTraite === 'all' ? true : filterTraite === 'traite' ? m.isProcessed === true : m.isProcessed !== true).map(m => ("
);

fs.writeFileSync(file, content);
console.log('Added filter!');
