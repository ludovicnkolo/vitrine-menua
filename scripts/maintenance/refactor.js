const fs = require('fs');

const file = 'apps/admin/src/components/GenericTaskPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// The functions are between line 209 and 296 roughly. 
// We will replace `const renderTaskField = ...` with nothing.
const renderTaskFieldStart = content.indexOf('const renderTaskField =');
const renderTaskFieldEnd = content.indexOf('const renderSubTaskModal =');
const renderTaskFieldContent = content.substring(renderTaskFieldStart, renderTaskFieldEnd);

const renderSubTaskModalStart = renderTaskFieldEnd;
const renderSubTaskModalEnd = content.indexOf('const renderDropdown =');
const renderSubTaskModalContent = content.substring(renderSubTaskModalStart, renderSubTaskModalEnd);

const renderDropdownStart = renderSubTaskModalEnd;
const renderDropdownEnd = content.indexOf('if (createTaskModal) {');
const renderDropdownContent = content.substring(renderDropdownStart, renderDropdownEnd);

// Instead of removing them, let's extract them as standalone components.
const taskFieldComponent = `
const TaskField = ({ label, value, readOnly = true, onChange = null, isTextarea = false }) => {
  const id = \`field-\${label.replace(/\\s+/g, '-')}\`;
  return (
    <div>
      <label htmlFor={id} style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{label}</label>
      {isTextarea ? (
        <textarea 
          id={id}
          value={value || ''} 
          onChange={onChange} 
          readOnly={readOnly}
          style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: readOnly ? '1px solid var(--border)' : '1px solid var(--primary)', minHeight: '120px', resize: readOnly ? 'none' : 'vertical', fontFamily: 'inherit', background: readOnly ? '#F8FAFC' : '#FFF', color: 'var(--text-main)'}}
        />
      ) : (
        <input 
          id={id}
          type="text" 
          value={value || ''} 
          onChange={onChange} 
          readOnly={readOnly}
          className="input-field" 
          style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: readOnly ? '1px solid var(--border)' : '1px solid var(--primary)', background: readOnly ? '#F8FAFC' : '#FFF', color: 'var(--text-main)'}}
        />
      )}
    </div>
  );
};
`;

const subTaskModalComponent = `
const SubTaskModal = ({ localConsultSubTask, setLocalConsultSubTask }) => {
  if (!localConsultSubTask) return null;
  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="fade-in" style={{background: '#FFF', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Tâche: {localConsultSubTask.reference || localConsultSubTask.id}</h2>
          <button type="button" onClick={() => setLocalConsultSubTask(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <TaskField label="Objet" value={getSubjectFromTask(localConsultSubTask.description)} />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <TaskField label="Créé par" value={localConsultSubTask.createdBy?.name || 'Inconnu'} />
            <TaskField label="Assigné à" value={localConsultSubTask.assignedTo?.name || 'Non assigné'} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <TaskField label="Date de création" value={new Date(localConsultSubTask.createdAt).toLocaleDateString('fr-FR')} />
            <TaskField label="Échéance" value={localConsultSubTask.echeance ? new Date(localConsultSubTask.echeance).toLocaleDateString('fr-FR') : 'Non définie'} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>{getStatusBadge(localConsultSubTask.status)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

const taskDropdownComponent = `
const TaskDropdown = ({ taskId, openMenuId, setOpenMenuId, menuRef, tasks, setConsultTask, setEditTask, setEditFormData, fetchData }) => {
  return (
    <ActionDropdown isOpen={openMenuId === taskId} menuRef={menuRef} width="130px">
      <button type="button" className="dropdown-item" onClick={() => { setOpenMenuId(null); setConsultTask(tasks.find(t => t.id === taskId)); }}>
        <Eye size={14} /> Consulter
      </button>
      <button type="button" className="dropdown-item" onClick={() => { 
        setOpenMenuId(null); 
        const task = tasks.find(t => t.id === taskId);
        setEditTask(task);
        const subj = getSubjectFromTask(task.description);
        const msg = getMessageFromTask(task.description);
        setEditFormData({ subject: subj, message: msg, status: task.status, attachment: task.attachment || '' });
      }}>
        <Pencil size={14} color="#D97706" /> Modifier
      </button>
      <button type="button" className="dropdown-item" onClick={async () => { 
        setOpenMenuId(null); 
        if(window.confirm("Supprimer cette mission ?")) {
           try {
             const token = localStorage.getItem('adminToken');
             const res = await fetch(new URL(getSafeApiUrl(\`/api/crm/tasks/\${encodeURIComponent(taskId)}\`)).toString(), { method: 'DELETE', headers: { 'Authorization': \`Bearer \${token}\` }});
             if (res.ok) fetchData();
           } catch(e) { console.error("Erreur suppr mission:", e); }
        }
      }} style={{color: 'var(--danger)'}}>
        <Trash size={14} /> Supprimer
      </button>
    </ActionDropdown>
  );
};
`;

content = content.replace(renderTaskFieldContent, '');
content = content.replace(renderSubTaskModalContent, '');
content = content.replace(renderDropdownContent, '');

// Insert components before GenericTaskPage
const genericTaskPageStart = content.indexOf('const GenericTaskPage =');
content = content.substring(0, genericTaskPageStart) + taskFieldComponent + subTaskModalComponent + taskDropdownComponent + content.substring(genericTaskPageStart);

// Now replace usages of renderTaskField
content = content.replace(/\{renderTaskField\(([^,]+),\s*([^,]+)\)\}/g, '<TaskField label={$1} value={$2} />');
content = content.replace(/\{renderTaskField\(([^,]+),\s*([^,]+),\s*(false),\s*\(([^)]+)\)\s*=>\s*([^}]+)\)\}/g, '<TaskField label={$1} value={$2} readOnly={false} onChange={($4) => $5} />');
content = content.replace(/\{renderTaskField\(([^,]+),\s*([^,]+),\s*(true),\s*(null),\s*(true)\)\}/g, '<TaskField label={$1} value={$2} readOnly={true} isTextarea={true} />');
content = content.replace(/\{renderTaskField\(([^,]+),\s*([^,]+),\s*(false),\s*\(([^)]+)\)\s*=>\s*([^,]+),\s*(true)\)\}/g, '<TaskField label={$1} value={$2} readOnly={false} onChange={($4) => $5} isTextarea={true} />');

// Usage of renderSubTaskModal
content = content.replace(/\{renderSubTaskModal\(\)\}/g, '<SubTaskModal localConsultSubTask={localConsultSubTask} setLocalConsultSubTask={setLocalConsultSubTask} />');

// Usage of renderDropdown
content = content.replace(/\{renderDropdown\(([^)]+)\)\}/g, '<TaskDropdown taskId={$1} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} menuRef={menuRef} tasks={tasks} setConsultTask={setConsultTask} setEditTask={setEditTask} setEditFormData={setEditFormData} fetchData={fetchData} />');

fs.writeFileSync(file, content, 'utf8');
console.log('Done refactoring');
