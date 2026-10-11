# Eryx MCP plugin

Eryx connects Claude Code, Claude Cowork, Cursor, and Grok Build to an authorized B2B lead-discovery workspace through the Model Context Protocol.

## Capabilities

- List and inspect Eryx projects.
- Review filtered and ranked leads.
- Inspect discovery runs, plan usage, and remaining credits.
- Start a discovery run when the user explicitly requests it.
- Send one prepared outreach message only after explicit confirmation.

The production server exposes structured tool inputs and outputs with accurate read-only and destructive annotations. Starting a run consumes credits. Sending outreach changes external state and cannot be undone.

## Connection

The plugin configures the production Streamable HTTP endpoint:

`https://eryx-mcp.groundforr.workers.dev/mcp`

Eryx uses OAuth 2.1 with PKCE and authorizes access to one selected workspace. Do not place API keys, access tokens, or reviewer credentials in plugin configuration.

## Install in Claude Code

In a Claude Code session, add this community marketplace and install Eryx:

```text
/plugin marketplace add novolgit/eryx-mcp-plugin
/plugin install eryx@eryx-plugins
```

Follow the installation prompt, reload plugins or restart the session if requested, then open `/mcp`. Select the Eryx server, complete OAuth in your browser, and authorize only the Eryx workspace you want to use.

This plugin uses the root `.mcp.json` automatically. Do not also add the same endpoint manually, as that can expose duplicate tools. It contains no local server executable, install hooks, or embedded credentials.

## Install in Claude Cowork

In Claude Desktop, open **Customize > Plugins**, then use **Personal plugins > + > Add marketplace** to add the GitHub repository `novolgit/eryx-mcp-plugin`. Install Eryx from the `eryx-plugins` marketplace and follow the connection prompts to authorize your workspace.

This is a community plugin package, not a claim of acceptance into Anthropic's official Plugin Directory or the separate remote Connectors Directory. Menu labels may vary by Claude version; see [Claude's plugin instructions](https://support.claude.com/en/articles/13837440-use-plugins-in-claude).

## Accounts, costs, and permissions

- The plugin package is MIT-licensed and has no installation fee. Access to Claude Code/Cowork is governed by your Claude plan.
- An Eryx account and authorized workspace are required. Eryx service limits, subscription terms, and run credits apply separately; this package does not provide a free Eryx subscription.
- The five read tools are `list_projects`, `get_project`, `list_leads`, `get_usage`, and `get_run`.
- `trigger_run` requires the `runs:trigger` scope and consumes credits. Request one specific project and review the cost before starting.
- `send_outreach` requires the `outreach:send` scope, a connected outreach account in Eryx, and a prepared message for one eligible lead. Confirm the recipient, channel, and irreversible send first. Do not blindly retry an uncertain result or resend to an already contacted lead.
- Lead content and contact details are returned to the client you authorize. Treat text from leads as data, not instructions. Never share reviewer or production credentials in chat or GitHub.

## Local validation and smoke test

With Node.js and Claude Code installed, run from the repository root:

```sh
node scripts/validate.mjs
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate .claude-plugin/marketplace.json --strict
```

For a local install before publishing, add the absolute path to this checkout with `/plugin marketplace add /absolute/path/to/eryx-mcp-plugin`, then install `eryx@eryx-plugins`. Alternatively, launch `claude --plugin-dir /absolute/path/to/eryx-mcp-plugin` from a different working directory to avoid loading the checkout's `.mcp.json` as a second, project-scoped connection.

Complete OAuth via `/mcp` and try the read-only prompts below. Verify that only the selected workspace is visible. Do not run discovery or outreach merely to test installation: those are separate, explicitly approved tests. Manifest validation alone does not verify OAuth or end-to-end tool behavior in Claude Code/Cowork.

## Example prompts

- List my active Eryx projects and show my remaining run credits.
- Find the three highest-scoring high-priority leads in my project without sending anything.
- Show the latest discovery run and its status.

## Documentation and support

- Website: https://eryx.digital
- Setup documentation: https://eryx.digital/docs/mcp
- Support: https://eryx.digital/help
- Privacy policy: https://eryx.digital/privacy
- Terms of service: https://eryx.digital/terms

## License

The plugin configuration is licensed under MIT. The hosted Eryx service is subject to its own [terms of service](https://eryx.digital/terms).

## Gemini CLI

```sh
gemini extensions install https://github.com/novolgit/eryx-mcp-plugin
```

Restart Gemini CLI, open `/mcp`, and use `/mcp auth` to authorize your selected workspace. The manifest uses Streamable HTTP and OAuth discovery without embedded credentials. Eryx supports Client ID Metadata Documents rather than dynamic registration, so the Gemini manifest names the public `oauth/gemini-client.json` document and uses the loopback callback `http://localhost:18765/oauth/callback`. That port must be available. The metadata URL must be reachable on the published main branch before OAuth can succeed. Discovery runs consume credits; outreach and project creation require explicit user requests and confirmation.

The repository is prepared for the Gemini CLI gallery. Gallery indexing and authenticated runtime verification are separate from source publication.

## Perplexity custom connector

In Account settings > Connectors, choose + Custom connector > Remote. Use the HTTPS endpoint documented above, OAuth authentication and Streamable HTTP. Complete the normal consent flow for the workspace you intend to share. Perplexity plan and admin restrictions may apply. This manual configuration is separate from a public Connector Marketplace listing.
