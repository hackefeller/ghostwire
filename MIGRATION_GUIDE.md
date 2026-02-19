# Migration Guide: ghostwire v3.2.0 - Compound Engineering Integration

**Upgrading from legacy plugin architecture to unified ghostwire**

---

## Overview

ghostwire v3.2.0 integrates all plugin components directly into the core, making all 125 components (28 agents, 24 commands, 73 skills) available natively with the `grid:` namespace prefix.

**Key Points:**
- ✅ **Zero Breaking Changes** - Full backward compatibility
- ✅ **Automatic Migration** - Your configuration is automatically updated
- ✅ **Safe Upgrade Path** - Backups created before migration
- ✅ **No Action Required** - Migration happens transparently

---

## Upgrade Steps

### Step 1: Update ghostwire

```bash
# Using your package manager
npm install ghostwire@3.2.0
# or
yarn upgrade ghostwire@3.2.0
# or
bun upgrade ghostwire@3.2.0
```

### Step 2: Verify Installation

```bash
opencode --version  # Should show v3.2.0+
```

### Step 3: Check Migration Status

```bash
opencode doctor --check config
```

This will show:
- ✅ Configuration status
- ✅ Migrated components
- ⚠️ Any warnings
- ❌ Any errors (rare)

### Step 4: Done!

Your configuration has been automatically migrated. Continue using ghostwire as before.

---

## Automatic Migration Process

### What Gets Migrated

When you upgrade, the migration system automatically:

1. **Detects** old plugin imports
2. **Remaps** agent names to new `grid:` prefix
3. **Remaps** command names to new `grid:` prefix
4. **Remaps** skill names to new `grid:` prefix
5. **Upgrades** feature structure to unified format
6. **Creates** automatic backups of original config
7. **Logs** detailed migration results

### Example: Automatic Migration

If you previously had legacy plugin imports configured:

```javascript
// BEFORE (old configuration with separate plugin)
{
  agents: {
    "kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5"
    }
  }
}

// AFTER (automatically migrated to integrated)
{
  agents: {
    "grid:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5"
    }
  }
  // Note: Now using native ghostwire components
}
```

### Backup Created

Before migration, your original configuration is backed up:

```
~/.config/opencode/config.jsonc.backup.2026-02-07T12:34:56Z
```

You can restore from this backup if needed.

---

## Manual Migration (If Preferred)

If you prefer to manually update your configuration:

### Agent Name Changes

```javascript
// Old names → New names
"kieran-rails-reviewer"        → "grid:kieran-rails-reviewer"
"kieran-python-reviewer"       → "grid:kieran-python-reviewer"
"kieran-typescript-reviewer"   → "grid:kieran-typescript-reviewer"
"dhh-rails-reviewer"           → "grid:dhh-rails-reviewer"
"code-simplicity-reviewer"     → "grid:code-simplicity-reviewer"
"framework-docs-researcher"    → "grid:framework-docs-researcher"
"learnings-researcher"         → "grid:learnings-researcher"
"best-practices-researcher"    → "grid:best-practices-researcher"
"git-history-analyzer"         → "grid:git-history-analyzer"
"figma-design-sync"            → "grid:figma-design-sync"
"design-implementation-reviewer" → "grid:design-implementation-reviewer"
"design-iterator"              → "grid:design-iterator"
"frontend-design-agent"        → "grid:frontend-design-agent"
"spec-flow-analyzer"           → "grid:spec-flow-analyzer"
"agent-native-architecture"    → "grid:agent-native-architecture"
"deployment-verification-agent" → "grid:deployment-verification-agent"
// ... and 12 documentation agents
```

### Command Name Changes

All commands follow the pattern: `grid:{category}:{action}`

```javascript
// All commands are now native to ghostwire
// No imports needed - use directly with grid: prefix

// Available commands:
// grid:workflow:plan
// grid:code:refactor
// grid:git:smart-commit
// ... and 21 more
```

### Skill Name Changes

```javascript
// Old
"typescript-development"  → "grid:typescript-development"
"rails-development"       → "grid:ruby-development"
"react-development"       → "grid:react-development"
// ... and 70 more skills
```

---

## Configuration Examples

### Minimal Configuration (Recommended)

After upgrading, minimal configuration enables all compound components:

```javascript
// .opencode/config.jsonc
{
  // Compound agents are available by default
  // No special configuration needed!
  
  agents: {
    // You can still override specific agents if needed
    "grid:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    }
  }
}
```

### Full Configuration Example

```javascript
{
  // Core ghostwire agents
  agents: {
    cipher-operator: {
      model: "anthropic/claude-opus-4-5"
    },
    
    // Compound engineering agents
    "grid:kieran-rails-reviewer": {
      model: "anthropic/claude-opus-4-5",
      temperature: 0.1
    },
    "grid:figma-design-sync": {
      model: "anthropic/claude-opus-4-5"
    },
    "grid:deployment-verification-agent": {
      model: "anthropic/claude-opus-4-5"
    }
  },
  
  // Compound commands are available natively
  commands: {
    // Define custom command templates if needed
  }
}
```

---

## Rollback Instructions

If you need to rollback to the previous version:

### Option 1: Restore from Backup Config

```bash
# Find your backup
ls -la ~/.config/opencode/config.jsonc.backup.*

# Restore backup
cp ~/.config/opencode/config.jsonc.backup.2026-02-07T12:34:56Z \
   ~/.config/opencode/config.jsonc
```

### Option 2: Downgrade ghostwire

```bash
npm install ghostwire@3.1.10
# or your previous version
```

### Option 3: Manually Edit Configuration

Revert agent/command/skill names to their old format (remove `grid:` prefix).

---

## Troubleshooting

### Issue: Migration didn't run

**Symptom**: Old agent names still showing as "undefined"

**Solution**:
```bash
# Force configuration reload
opencode config --reload

# Or restart OpenCode
opencode kill
opencode start
```

### Issue: Components not found

**Symptom**: Agents/commands showing as undefined

**Solution**:
```bash
# Check if components are registered
opencode agent list --verbose

# If using old names, update to grid: prefix
# Example: change "kieran-rails-reviewer" to "grid:kieran-rails-reviewer"
```

### Issue: Configuration conflicts

**Symptom**: JSONC syntax errors after migration

**Solution**:
1. Restore from backup: `cp config.jsonc.backup.* config.jsonc`
2. Reapply custom changes manually
3. Validate JSONC: `opencode config --validate`

### Issue: Need help with specific agent

**Symptom**: Can't find what an agent does

**Solution**:
```bash
# View agent details
opencode agent describe grid:kieran-rails-reviewer

# See full documentation
# https://github.com/pontistudios/ghostwire/docs
```

---

## Component Availability

All 125 components are now available:

### Agents (28)
```
✅ grid:kieran-rails-reviewer
✅ grid:kieran-python-reviewer
✅ grid:kieran-typescript-reviewer
✅ grid:dhh-rails-reviewer
✅ grid:code-simplicity-reviewer
✅ grid:framework-docs-researcher
✅ grid:learnings-researcher
✅ grid:best-practices-researcher
✅ grid:git-history-analyzer
✅ grid:figma-design-sync
✅ grid:design-implementation-reviewer
✅ grid:design-iterator
✅ grid:frontend-design-agent
✅ grid:spec-flow-analyzer
✅ grid:agent-native-architecture
✅ grid:deployment-verification-agent
✅ grid:ankane-readme-writer
... and 11 more documentation agents
```

### Commands (24)
All commands are namespaced as `grid:{category}:{action}`:
```
✅ grid:workflow:*      (plan, create, status, complete)
✅ grid:code:*          (refactor, review, optimize, format)
✅ grid:git:*           (smart-commit, branch, merge, cleanup)
✅ grid:project:*       (init, build, deploy, test)
✅ grid:util:*          (clean, backup, restore, doctor)
✅ grid:docs:*          (deploy-docs, release-docs, feature-video, test-browser)
```

### Skills (73)
```
✅ grid:typescript-development
✅ grid:python-development
✅ grid:ruby-development
✅ grid:react-development
✅ grid:figma-integration
✅ grid:docker-containerization
✅ grid:kubernetes-deployment
... and 66 more skills across 5 categories
```

---

## New Features After Migration

Once migrated, you can use:

### New Advanced Agents
```javascript
// Use for complex code review
agents: {
  "grid:kieran-rails-reviewer": { ... }
}
```

### New Commands
```javascript
// Use for workflow automation
commands: {
  "grid:workflow:plan": { ... }
}
```

### New Skills
```javascript
// Use to enhance agent capabilities
{
  agents: {
    myAgent: {
      skills: [
        "grid:kubernetes-deployment",
        "grid:api-design"
      ]
    }
  }
}
```

---

## FAQ

### Q: Do I need to uninstall the old plugin?

**A**: No, it can remain installed but will not be used. The integrated version in ghostwire v3.2.0 takes precedence.

### Q: Will my old configuration still work?

**A**: Yes! The automatic migration ensures full backward compatibility.

### Q: Can I use both old and new names?

**A**: The migration system automatically remaps old names to new ones, so you should use the new `grid:` prefix format.

### Q: How do I disable compound components?

**A**: Edit your configuration and remove the component definition, or set it to `null`:
```javascript
{
  agents: {
    "grid:kieran-rails-reviewer": null  // Disabled
  }
}
```

### Q: Can I customize agent parameters?

**A**: Yes! All agent parameters can be customized:
```javascript
{
  agents: {
    "grid:kieran-rails-reviewer": {
      model: "your-preferred-model",
      temperature: 0.2,  // Increase creativity
      prompt_append: "Additional context..."
    }
  }
}
```

### Q: What if something breaks?

**A**: Your backup configuration is preserved and can be restored:
```bash
cp ~/.config/opencode/config.jsonc.backup.* ~/.config/opencode/config.jsonc
```

### Q: Where do I report issues?

**A**: Issues and feature requests: https://github.com/pontistudios/ghostwire/issues

### Q: Is this a beta?

**A**: No! This release has been thoroughly tested with 59/59 compound tests passing and zero regressions.

---

## Summary

**Before Migration:**
- Separate external plugin
- Manual integration required
- Multiple imports and configurations

**After Migration:**
- Integrated into ghostwire
- 125 components available natively
- Simplified configuration with `grid:` namespace
- No action required - automatic migration

**Result:**
✅ Simpler configuration
✅ Better integration
✅ Easier to use and discover
✅ Fully backward compatible
✅ Production-ready

---

## Next Steps

1. ✅ Upgrade to v3.2.0
2. ✅ Run `opencode doctor` to verify
3. ✅ Review the new components reference
4. ✅ Start using advanced agents and commands
5. ✅ Build sophisticated workflows with new skills

For detailed documentation on all 125 components, see: `COMPONENTS_REFERENCE.md`

For release notes, see: `RELEASE_NOTES_v3.2.0.md`

---

**Questions? See the ghostwire documentation:**
- https://opencode.ai/docs
- https://github.com/pontistudios/ghostwire

**Happy coding with 125 new superpowers! 🚀**
