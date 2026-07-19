const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace all X size=20 buttons with 'Retour' exactly.
const pattern1 = `<button onClick={() => setProcessMsg(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern1, `<button onClick={() => setProcessMsg(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern2 = `<button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern2, `<button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern3 = `<button onClick={() => setShowRoleModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern3, `<button onClick={() => setShowRoleModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern4 = `<button onClick={() => setEditRole(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern4, `<button onClick={() => setEditRole(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern5 = `<button onClick={() => setConsultRole(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern5, `<button onClick={() => setConsultRole(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern6 = `<button onClick={() => setShowExternalModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern6, `<button onClick={() => setShowExternalModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern7 = `<button onClick={() => setEditExternal(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern7, `<button onClick={() => setEditExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern8 = `<button onClick={() => setConsultExternal(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern8, `<button onClick={() => setConsultExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern9 = `<button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern9, `<button onClick={() => setShowModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern10 = `<button onClick={() => setEditUser(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern10, `<button onClick={() => setEditUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

const pattern11 = `<button onClick={() => setConsultUser(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>`;
content = content.replace(pattern11, `<button onClick={() => setConsultUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`);

fs.writeFileSync(file, content);
console.log('Fixed X buttons.');
