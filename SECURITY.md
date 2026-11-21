# Security Policy

Security and privacy considerations for **Intelly Clinical Suite** are documented below.

---

## 1. Secret Management & API Isolation

- **Server-Side Only Secrets**: `GEMINI_API_KEY` is read exclusively inside `server.ts` (`process.env.GEMINI_API_KEY`) and is never bundled into client-side Vite output.
- **No Client-Side API Key Prompts**: The UI does not ask users to enter or store API keys in `localStorage` or browser forms.
- **Safe Templates**: `.env.example` contains placeholder keys only. Never commit `.env` or `.env.local` files containing real credentials.

---

## 2. Client-Side Data & Report Export Privacy

- **Local Browser Export**: Structured PDF (`jsPDF`) and CSV exports in `src/utils/reportExporter.ts` are generated entirely inside the user's browser memory and downloaded directly as Blobs. No third-party document conversion server receives financial or patient records.
- **CSV Formula & Delimiter Escaping**: Cell values exported via CSV follow RFC-4180 quoting rules with UTF-8 BOM encoding.
- **Demo / In-Memory State Notice**: By default, clinical records in `src/store.ts` are initialized in-memory for demonstration and evaluation. Do not enter real Protected Health Information (PHI) into an unauthenticated local demo instance without first provisioning an encrypted, access-controlled backend database and authentication provider compliant with applicable healthcare regulations (e.g., HIPAA / GDPR).

---

## 3. Input Validation & Safe Rendering

- Express API routes validate incoming payloads (`message` presence and type checks) before calling `@google/genai`.
- React rendering avoids unsafe raw HTML injection (`dangerouslySetInnerHTML`) across notes, invoices, chat messages, and chart tooltips.
- All D3.js SVG text nodes are populated via `.text()` rather than `.html()` to prevent XSS in dynamic labels or tooltips.

---

## 4. Dependency Hygiene

Keep dependencies current and audit advisories periodically:

```bash
npm audit
npm run lint
npm run build
```

---

## 5. Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. Do **not** open a public GitHub issue disclosing exploit details.
2. Report the finding privately to the repository maintainers with:
   - Affected file path or endpoint
   - Steps to reproduce
   - Potential impact and suggested remediation
3. Maintainers will acknowledge receipt, assess severity, and coordinate a patched release before public disclosure.
