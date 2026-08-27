# Eryx MCP plugin

Eryx connects Cursor and Grok Build to an authorized B2B lead-discovery workspace through the Model Context Protocol.

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

MIT
