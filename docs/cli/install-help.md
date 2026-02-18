# Install Help

## Examples

```bash
$ bunx ruach install
$ bunx ruach install --no-tui --claude=max20 --openai=yes --gemini=yes --copilot=no
$ bunx ruach install --no-tui --claude=no --gemini=no --copilot=yes --ruach-zen=yes
```

## Model Providers (Priority: Native > Copilot > Ruach Zen > Z.ai > Kimi)

- **Claude** — Native anthropic/ models (Opus, Sonnet, Haiku)
- **OpenAI** — Native openai/ models (GPT-5.2 for Oracle)
- **Gemini** — Native google/ models (Gemini 3 Pro, Flash)
- **Copilot** — github-copilot/ models (fallback)
- **Ruach Zen** — ruach/ models (ruach/claude-opus-4-5, etc.)
- **Z.ai** — zai-coding-plan/glm-4.7 (Librarian priority)
- **Kimi** — kimi-for-coding/k2p5 (Sisyphus/Prometheus fallback)
