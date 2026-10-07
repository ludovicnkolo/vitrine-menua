import React, { useState, useEffect, useRef } from "react";
import { getSafeApiUrl, apiFetch } from "../utils/helpers";
import { Send, User, MessageSquare, Plus, ArrowLeft } from "lucide-react";

export default function InternalChatTab({ currentUser, users, showToast }) {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await apiFetch("/api/crm/messages/interne/conversations");
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des conversations", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (contactEmail) => {
    try {
      const res = await apiFetch(
        `/api/crm/messages/interne/conversations/${contactEmail}`,
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des messages", "error");
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedContact) {
        fetchThread(selectedContact.email);
      }
    }, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      fetchThread(selectedContact.email);
    } else {
      setMessages([]);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;

    setIsSending(true);
    try {
      const res = await apiFetch("/api/crm/messages/interne", "POST", {
        bodyText: messageText,
        assignedToId: selectedContact.id,
        subType: "Message direct",
        objet: "Message Interne",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessageText("");
        await fetchThread(selectedContact.email);
        await fetchConversations();
      } else {
        showToast(data.error || "Erreur lors de l'envoi", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de l'envoi", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectNewContact = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const existing = conversations.find((c) => c.contact.email === user.email);
    if (existing) {
      setSelectedContact(existing.contact);
    } else {
      setSelectedContact({
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      });
      setMessages([]);
    }
    setShowNewChat(false);
  };

  if (loading && conversations.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Chargement...</div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "70vh",
        background: "#FFF",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        marginTop: "1rem",
      }}
    >
      {/* Sidebar: Conversations List */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          background: "#F8FAFC",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            Interne
          </h3>
          <button
            onClick={() => setShowNewChat(true)}
            style={{
              padding: "0.45rem 0.85rem",
              display: "flex",
              gap: "0.3rem",
              alignItems: "center",
              fontSize: "0.85rem",
              background: "#1E3A8A",
              color: "#FFF",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Écrire
          </button>
        </div>

        {/* Filter Input */}
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <input
            type="text"
            placeholder="Filtrer les collègues..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.45rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "#FFF",
              fontSize: "0.85rem",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {showNewChat ? (
          <div style={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <button
                onClick={() => setShowNewChat(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  color: "var(--text-main)",
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <h4 style={{ margin: 0, color: "var(--text-main)", fontSize: "0.95rem" }}>À qui ?</h4>
            </div>
            {users
              .filter(
                (u) => u.id !== currentUser?.id && u.id !== "MASTER-ADMIN",
              )
              .filter(
                (u) =>
                  !filterQuery ||
                  (u.name || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
                  (u.email || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
                  (u.role?.name || u.role || "").toLowerCase().includes(filterQuery.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectNewContact(u.id)}
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "0.25rem",
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#1E3A8A",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                      {u.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {u.role?.name || u.role}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations
              .filter(
                (conv) =>
                  !filterQuery ||
                  (conv.contact?.name || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
                  (conv.contact?.email || "").toLowerCase().includes(filterQuery.toLowerCase())
              )
              .length === 0 ? (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                }}
              >
                {filterQuery
                  ? "Aucun collègue ne correspond à votre recherche."
                  : 'Aucune conversation. Cliquez sur "Écrire" pour commencer.'}
              </div>
            ) : (
              conversations
                .filter(
                  (conv) =>
                    !filterQuery ||
                    (conv.contact?.name || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
                    (conv.contact?.email || "").toLowerCase().includes(filterQuery.toLowerCase())
                )
                .map((conv, idx) => {
                  const isSelected = selectedContact?.email === conv.contact.email;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedContact(conv.contact)}
                      style={{
                        padding: "0.85rem 1rem",
                        margin: "0.35rem 0.5rem",
                        borderRadius: "6px",
                        border: isSelected ? "1px solid #93C5FD" : "1px solid transparent",
                        borderLeft: isSelected ? "4px solid #1E3A8A" : "4px solid transparent",
                        cursor: "pointer",
                        background: isSelected
                          ? "#EFF6FF"
                          : conv.unreadCount > 0
                          ? "#FEF9C3"
                          : "#FFF",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        transition: "all 0.2s",
                        boxShadow: isSelected ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: "#1E3A8A",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        {conv.contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.15rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: isSelected ? 700 : 600,
                              color: "var(--text-main)",
                              fontSize: "0.9rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {conv.contact.name}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            {new Date(
                              conv.lastMessage.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: conv.unreadCount > 0 ? "#854D0E" : "#64748B",
                            fontWeight: conv.unreadCount > 0 ? 600 : 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: isSelected ? "0.3rem" : "0",
                          }}
                        >
                          {conv.lastMessage.bodyText || "Document joint"}
                        </div>
                        {isSelected && (
                          <div style={{ marginTop: "0.2rem" }}>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                color: "#2563EB",
                                letterSpacing: "0.03em",
                              }}
                            >
                              CONVERSATION ACTIVE
                            </span>
                          </div>
                        )}
                        {conv.unreadCount > 0 && !isSelected && (
                          <span
                            style={{
                              background: "#EAB308",
                              color: "white",
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "10px",
                              display: "inline-block",
                              marginTop: "0.25rem",
                            }}
                          >
                            {conv.unreadCount} non lu
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedContact ? (
          <>
            <div
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                background: "#FFF",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#1E3A8A",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {selectedContact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {selectedContact.name}
                </h3>
                <span
                  style={{ fontSize: "0.8rem", color: "#64748B" }}
                >
                  <span style={{ color: "#16A34A" }}>● En ligne</span> • Vos messages internes
                </span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: "#F8FAFC",
              }}
            >
              <div
                style={{
                  maxWidth: "380px",
                  margin: "0.5rem auto 1rem",
                  padding: "1rem 1.5rem",
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "0.35rem" }}>
                  Vos messages internes
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
                  Sélectionnez une conversation ou écrivez un nouveau message.
                </div>
              </div>

              {messages.map((msg) => {
                const isMine = msg.email === currentUser?.email;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        background: isMine ? "#1E3A8A" : "#F1F5F9",
                        color: isMine ? "#FFF" : "var(--text-main)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        border: isMine ? "none" : "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.95rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.bodyText}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleDateString([], {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border)",
                background: "#FFF",
              }}
            >
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Écrivez votre message à ${selectedContact.name}... (Entrée pour envoyer)`}
                  style={{
                    flex: 1,
                    padding: "0.65rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    outline: "none",
                    fontSize: "0.9rem",
                    background: "#FFF",
                  }}
                />
                <button
                  type="submit"
                  disabled={isSending || !messageText.trim()}
                  style={{
                    padding: "0.65rem 1.5rem",
                    borderRadius: "6px",
                    background: "#1E3A8A",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor:
                      isSending || !messageText.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity: isSending || !messageText.trim() ? 0.7 : 1,
                  }}
                >
                  Envoyer
                </button>
              </form>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            <MessageSquare
              size={48}
              style={{ marginBottom: "1rem", opacity: 0.5 }}
            />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 500, margin: 0 }}>
              Vos messages internes
            </h2>
            <p style={{ marginTop: "0.5rem" }}>
              Sélectionnez une conversation ou écrivez un nouveau message.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
