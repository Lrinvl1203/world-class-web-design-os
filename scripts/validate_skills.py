#!/usr/bin/env python3
from pathlib import Path
import re, sys

root = Path(__file__).resolve().parents[1]
skills = root / '.codex' / 'skills'
errors = []
count = 0
for skill in sorted(skills.iterdir()):
    if not skill.is_dir():
        continue
    count += 1
    f = skill / 'SKILL.md'
    if not f.exists():
        errors.append(f'{skill.name}: missing SKILL.md')
        continue
    text = f.read_text(encoding='utf-8')
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        errors.append(f'{skill.name}: missing YAML frontmatter')
        continue
    fm = m.group(1)
    name = re.search(r'^name:\s*(.+)$', fm, re.M)
    desc = re.search(r'^description:\s*(.+)$', fm, re.M)
    if not name or name.group(1).strip().strip('"\'') != skill.name:
        errors.append(f'{skill.name}: frontmatter name must match directory')
    if not desc or len(desc.group(1).strip()) < 25:
        errors.append(f'{skill.name}: description too short or missing')
    if len(text.splitlines()) > 500:
        errors.append(f'{skill.name}: SKILL.md exceeds 500 lines; use references')
    agent = skill / 'agents' / 'openai.yaml'
    if not agent.exists():
        errors.append(f'{skill.name}: missing recommended agents/openai.yaml')
    else:
        a = agent.read_text(encoding='utf-8')
        if f'${skill.name}' not in a:
            errors.append(f'{skill.name}: openai.yaml default_prompt should mention ${skill.name}')

if count == 0:
    errors.append('no skills found')

if errors:
    print('Skill validation failed:')
    for e in errors: print(' -', e)
    sys.exit(1)
print(f'Validated {count} Codex skills.')
