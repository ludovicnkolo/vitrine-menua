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
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
            Interne
          </h3>
          <button
            onClick={() => setShowNewChat(true)}
            className="btn btn-primary"
            style={{
              padding: "0.4rem 0.6rem",
              display: "flex",
              gap: "0.25rem",
              alignItems: "center",
              fontSize: "0.85rem",
            }}
          >
            <Plus size={16} /> Écrire
          </button>
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
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <h4 style={{ margin: 0 }}>À qui ?</h4>
            </div>
            {users
              .filter(
                (u) => u.id !== currentUser?.id && u.id !== "MASTER-ADMIN",
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
                      background: "var(--primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
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
            {conversations.length === 0 ? (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                }}
              >
                Aucune conversation. Cliquez sur "Écrire" pour commencer.
              </div>
            ) : (
              conversations.map((conv, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedContact(conv.contact)}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background:
                      selectedContact?.email === conv.contact.email
                        ? "#E2E8F0"
                        : conv.unreadCount > 0
                        ? "#FEF9C3"
                        : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      flexShrink: 0,
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
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: conv.unreadCount > 0 ? 700 : 600,
                          color: conv.unreadCount > 0 ? "#854D0E" : "inherit",
                          fontSize: "0.95rem",
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: conv.unreadCount > 0 ? "#854D0E" : "var(--text-muted)",
                          fontWeight: conv.unreadCount > 0 ? 600 : 400,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {conv.lastMessage.bodyText || "Document joint"}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            background: "#EAB308",
                            color: "white",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            padding: "0.1rem 0.4rem",
                            borderRadius: "10px",
                          }}
                        >
                          {conv.unreadCount} non consulté(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
                background: "#F8FAFC",
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
                  background: "var(--primary)",
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
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                  {selectedContact.name}
                </h3>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {selectedContact.email}
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
                background: "#F1F5F9",
              }}
            >
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
                        borderRadius: "12px",
                        background: isMine ? "var(--primary)" : "#FFF",
                        color: isMine ? "#FFF" : "var(--text-main)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        borderBottomRightRadius: isMine ? "0" : "12px",
                        borderBottomLeftRadius: !isMine ? "0" : "12px",
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
                      {new Date(msg.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid var(--border)",
                background: "#FFF",
              }}
            >
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "24px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    fontSize: "0.95rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={isSending || !messageText.trim()}
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor:
                      isSending || !messageText.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity: isSending || !messageText.trim() ? 0.7 : 1,
                  }}
                >
                  <Send size={20} style={{ marginLeft: "2px" }} />
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
