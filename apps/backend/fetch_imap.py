import imaplib
import email
from email.header import decode_header

username = "contact@menuaconsulting.com"
password = "Menua2026?consulting"
imap_server = "ssl0.ovh.net"

try:
    mail = imaplib.IMAP4_SSL(imap_server)
    mail.login(username, password)
    mail.select("inbox")
    status, messages = mail.search(None, "ALL")
    
    if status == "OK":
        email_ids = messages[0].split()
        if email_ids:
            oldest_id = email_ids[0:1]
            print(f"--- Récupération du plus ancien e-mail ---")
            
            for index, email_id in enumerate(oldest_id, start=1):
                status, msg_data = mail.fetch(email_id, "(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8", errors="replace")
                        
                        print(f"\n[Message #{index}]")
                        print(f"Date: {msg.get('Date')}")
                        print(f"De: {msg.get('From')}")
                        print(f"Sujet: {subject}")
                        print("-" * 50)
                        
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    try:
                                        body = part.get_payload(decode=True).decode('utf-8', errors="replace")
                                        break
                                    except: pass
                        else:
                            try:
                                body = msg.get_payload(decode=True).decode('utf-8', errors="replace")
                            except: pass
                        
                        print(body)
        else:
            print("Boite vide.")
    mail.logout()
except Exception as e:
    print(f"Erreur: {e}")
