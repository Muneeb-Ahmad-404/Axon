
### Axon Project Roadmap

**Phase 1: Identity & Authorization (The Handshake)**

* [x] LinkedIn App Registration: Verified and linked to Company Page.
* [x] Product Activation: "Sign In with LinkedIn (OIDC)" and "Share on LinkedIn" enabled.
* [x] OAuth Flow Implementation:
* [x] `/auth/linkedin` redirect route.
* [x] `/auth/linkedin/callback` exchange route with controller separation.


* [ ] Identity Mapping: Fetch `sub` from `/userinfo` and convert to `urn:li:person:[ID]`.
* [ ] Encryption Layer: Implement AES-256 for `access_token` security before storage.

**Phase 2: Ingress & Validation (The Signal)**

* [ ] GitHub Webhook Setup: Point repository events to `/api/webhook/github`.
* [ ] Public Exposure: Secure tunnel setup via ngrok for local development.
* [ ] HMAC Security: Middleware to verify `x-hub-signature-256` using webhook secrets.
* [ ] Event Filtering: Logic to trigger exclusively on `push` events to the main branch.

**Phase 3: The Intelligence Engine (The Brain)**

* [ ] Commit Parsing: Extraction of commit messages and code diffs.
* [ ] LLM Integration: Connection to Gemini or OpenAI API.
* [ ] Prompt Engineering: Persona-based prompting for professional engineering narratives.
* [ ] Draft Management: Store generated content in a "Pending" database collection.

**Phase 4: Egress & Human-in-the-Loop (The Publish)**

* [ ] Approval Workflow: Dashboard or CLI command to review and edit drafts.
* [ ] LinkedIn Post Logic: Implementation of the modern `/rest/posts` endpoint.
* [ ] Rate Limiting: Protection against spam flags and API throttling.
* [ ] Success Logging: Persistence of live post URLs for historical tracking.

**Phase 5: Research & Optimization**

* [ ] A/B Testing: Comparative analysis of AI-generated vs. manual engagement metrics.
* [ ] Persona Testing: Experimentation with "Technical Detail" vs. "Story-driven" prompt styles.
