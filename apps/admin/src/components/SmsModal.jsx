import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";

const SmsModal = ({ isOpen, onClose, contextData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [file, setFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("adminUser");
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const token = sessionStorage.getItem("adminToken");

          const res = await fetch(getSafeApiUrl(`/api/crm/users`), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setUsers(await res.json());
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contextData && currentUser) {
      if (contextData.assignedToId && contextData.createdById) {
        if (currentUser.id === contextData.assignedToId)
          setTargetUserId(contextData.createdById);
        else setTargetUserId(contextData.assignedToId);
      }
      if (contextData.reference) {
        setSubject(`Message concernant ${contextData.reference}`);
      }
    }
  }, [isOpen, contextData, currentUser]);

  const isAutoAssigned = !!(
    contextData?.assignedToId && contextData?.createdById
  );
  const isAutoSubject = !!contextData?.reference;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUserId || !content || !subject) {
      window.customAlert(
        "Veuillez remplir l'objet, le contenu et le destinataire.",
      );
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");

      let attachmentStr = null;
      if (file) {
        const formData = new FormData();
        formData.append("bucket", "formulaires");
        formData.append("file", file);
        const uploadRes = await fetch(getSafeApiUrl(`/api/files/upload`), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          attachmentStr = uploadData.fileData.filename;
        }
      }

      // Find selected user name
      const targetUser = users.find((u) => u.id === targetUserId);
      const recipientName = targetUser ? targetUser.name : "Inconnu";

      // Send to messages endpoint
      const payload = {
        type: "INTERNE",
        subType: `SMS Collaborateur pour ${recipientName}`,
        objet: subject,
        bodyText: content,
        attachment: attachmentStr,
        dossierId: contextData?.dossierId || null,
        missionId: contextData?.missionId || null,
        tacheId: contextData?.tacheId || null,
        assignedToId: targetUserId,
      };

      const res = await fetch(getSafeApiUrl(`/api/crm/messages/interne`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.customAlert("SMS envoyé avec succès !");
        onClose();
        setSubject("");
        setContent("");
        setTargetUserId("");
        setFile(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert(
          `Erreur lors de l'envoi du SMS: ${errData.details || errData.error || res.statusText}`,
        );
      }
    } catch (err) {
      console.error(err);
      window.customAlert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)",zIndex:1000}}
    >
      <div
        className="fade-in p-8" style={{background:"#FFF",width:"90%",maxWidth:"600px",borderRadius:"12px",boxShadow:"0 10px 25px rgba(0,0,0,0.2)"}}
      >
        <div
          className="flex justify-between items-center mb-6" style={{borderBottom:"1px solid var(--border)",paddingBottom:"1rem"}}
        >
          <h2 className="font-semibold" style={{fontSize:"1.25rem"}}>
            Envoyer un SMS Collaborateur
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer" style={{background:"transparent",border:"none",color:"var(--text-muted)"}}
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {!isAutoAssigned && (
            <div>
              <label
                htmlFor="smsDestinataire"
                className="block mb-2 font-medium"
              >
                Destinataire (Collaborateur)
              </label>
              <select
                id="smsDestinataire"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
              >
                <option value="">-- Sélectionner un collaborateur --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role?.name || "Sans rôle"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isAutoSubject && (
            <div>
              <label
                htmlFor="smsSubject"
                className="block mb-2 font-medium"
              >
                Objet
              </label>
              <input
                id="smsSubject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Sujet du SMS"
                className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="smsContent"
              className="block mb-2 font-medium"
            >
              Contenu du message
            </label>
            <textarea
              id="smsContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Tapez votre message ici..."
              rows={5}
              className="input-field w-full" style={{padding:"0.75rem",borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF",resize:"vertical"}}
            />
          </div>

          <div>
            <label
              htmlFor="smsFile"
              className="block mb-2 font-medium"
            >
              Fichier joint (Optionnel)
            </label>
            <input
              id="smsFile"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-field w-full p-2" style={{borderRadius:"8px",border:"1px solid var(--border)",background:"#FFF"}}
            />
          </div>

          <div
            className="flex justify-end gap-4 mt-4"
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: "0.75rem 1.5rem" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2" style={{padding:"0.75rem 1.5rem"}}
            >
              <Send size={16} />
              {loading ? "Envoi..." : "Envoyer SMS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmsModal;
