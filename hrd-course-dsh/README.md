# HRD-AI course Q&A · Local DSH sample

English | [中文](README.zh.md)

Use the Node.js and pnpm versions required by DSH. From the repository root, run `pnpm install` and `pnpm run build:artifacts`. The sample needs a local copy of the HRD-AI source. By default it looks for a sibling directory named `hrd-ai---`. Set `HRD_AI_ROOT` to use another absolute path.

From the repository root, run `node hrd-course-dsh/run-local.mjs install` once, then start the sample with `node hrd-course-dsh/run-local.mjs`. Open the local sign-in link printed in the terminal. Sessions and configuration are stored under `hrd-course-dsh/.local/` by default. Set `DSH_HOME` to use another directory.

The sample serves on 127.0.0.1:3081 and uses DSH local sign-in. One plugin provides the five course assistants. Their DSH presets are declared in `cordis.patch.yml`, and their names, descriptions and example questions live in `client.js`.

The launcher reads DeepSeek and GetNote configuration from HRD-AI's `.env.local`. The five modules use `GETNOTE_KNOWLEDGE_ID_MODULE_ONE` through `GETNOTE_KNOWLEDGE_ID_MODULE_FIVE` respectively. Modules can share a knowledge base ID. To give a module its own knowledge base, set its ID and restart the sample. A module with a missing ID reports that its course materials are unavailable and skips retrieval from other modules.

The default local account receives 20,000 credits when the ledger is first created. The ledger is stored as `hrd-credits.sqlite` in the DSH data directory. Set `initialCredits` in `cordis.patch.yml` to change the initial grant for new ledgers. Open **My account (我的)** at the bottom left to see available credits, total credits used in the current session and credit history. A request reserves credits based on the estimated input and the model's output limit. Each completed turn settles once based on actual usage. Failed or canceled turns release the reservation.
