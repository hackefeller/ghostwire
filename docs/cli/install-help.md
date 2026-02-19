# Install Help

## Examples

```bash
$ bunx ghostwire install
$ bunx ghostwire install --no-tui --claude=max20 --openai=yes --gemini=yes --copilot=no
$ bunx ghostwire install --no-tui --claude=no --gemini=no --copilot=yes --ghostwire-zen=yes
```

## Model Providers (Priority: Native > Copilot > Ghostwire Zen > Z.ai > Kimi)

- **Claude** — Native anthropic/ models (Opus, Sonnet, Haiku)
- **OpenAI** — Native openai/ models (GPT-5.2 for Seer Advisor)
- **Gemini** — Native google/ models (Gemini 3 Pro, Flash)
- **Copilot** — github-copilot/ models (fallback)
- **Ghostwire Zen** — ghostwire/ models (ghostwire/claude-opus-4-5, etc.)
- **Z.ai** — zai-coding-plan/glm-4.7 (Archive Researcher priority)
- **Kimi** — kimi-for-coding/k2p5 (Cipher Operator/Augur Planner fallback)
