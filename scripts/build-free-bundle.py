#!/usr/bin/env python3
"""Build one portable starter ZIP using only Python's standard library."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "web-design-os-free-starter"
FORBIDDEN_NAME = re.compile(r"^(?:\.git|\.aws|node_modules|artifacts|test-results|credentials|auth\.json|\.env(?:\..*)?)$|\.(?:pem|key)$", re.I)
SECRET_SIGNATURE = re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|\bAKIA[A-Z0-9]{16}\b|\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}")


def package_files():
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    files = set()
    for item in ["package.json", *package["files"]]:
        relative = PurePosixPath(item)
        if relative.is_absolute() or ".." in relative.parts or "\\" in item:
            raise ValueError(f"Unsafe package path: {item}")
        source = ROOT / relative
        if not source.exists():
            raise ValueError(f"Missing package source: {item}")
        candidates = [source, *source.rglob("*")] if source.is_dir() else [source]
        for candidate in candidates:
            if candidate.is_symlink():
                raise ValueError(f"Unsupported package symlink: {candidate.relative_to(ROOT)}")
            rel = candidate.relative_to(ROOT)
            if any(FORBIDDEN_NAME.search(part) for part in rel.parts):
                raise ValueError(f"Forbidden package path: {rel}")
            if candidate.is_file():
                files.add(rel.as_posix())
    return sorted(files)


def build(output):
    output = output.resolve()
    if output.exists():
        raise ValueError(f"Output already exists; choose a new path: {output}")
    source_files = package_files()
    payload = {f"assets/web-design-os/{name}": (ROOT / name).read_bytes() for name in source_files}
    entry = """---
name: web-design-os-free-starter
description: Use this free starter to install and run one complete web-design workflow with 17 routed skills, local CLI tools, critique references, and browser QA examples without a repository checkout.
---

# Web Design OS Free Starter

This is one free bundle containing the existing orchestrator and 16 specialists. Preserve the complete scripts/references/assets tree. Read references/INSTALL.md before installing, and references/LIMITATIONS.md before interpreting checks.

Run `node scripts/web-design-os.mjs install --agent codex` and then `node scripts/web-design-os.mjs doctor --agent codex`. For a project-local installation, use the same absolute `--root` on both commands. Restart the agent session and use `$web-design-orchestrator`.

Before installation, the complete OS root is `assets/web-design-os`. Read its `.codex/skills/web-design-orchestrator/SKILL.md` and load at most three relevant specialists from that tree for the current phase. After installation, shared tools live at `<root>/.web-design-os/runtime`; use absolute tool paths from your project. A skills-only copy is incomplete.

The CLI's doctor checks package files, not agent performance or design quality. No new agent-generated site or independent-user study is demonstrated by packaging. Existing examples are fictional and historical report scores remain internal declarations. Do not promise a world-class result, conversion improvement, revenue, or field performance.

Do not publish, create accounts, accept terms, configure payments, grant new security permissions, or schedule integrations merely because this bundle is present. Follow the user's actual authorization.

Source and attribution: https://github.com/Lrinvl1203/world-class-web-design-os. MIT, Copyright (c) 2026 Lrinvl1203. Preserve LICENSE and NOTICE.md. This portable starter includes repairs based on c2ef97775dfbca42b83b964227fc00cd8779f0c8. Record the exact reviewed source version used for the build; this is not a tagged upstream release.
"""
    payload["SKILL.md"] = entry.encode()
    payload["scripts/web-design-os.mjs"] = b"#!/usr/bin/env node\nawait import('../assets/web-design-os/cli/web-design-os.mjs');\n"
    payload["references/INSTALL.md"] = (ROOT / "docs/free-starter.md").read_bytes()
    payload["references/AGENSI-LISTING-DRAFT.md"] = (ROOT / "docs/agensi-free-listing-draft.md").read_bytes()
    payload["references/LIMITATIONS.md"] = b"# Verification limits\n\nDoctor: bundled file presence and recorded SHA-256 integrity. CLI smoke: execution and reference access. Browser reproduction: the existing Sequence Desk example on local Chromium. None establishes actual agent design performance, independent-user effects, publisher authenticity, revenue, or field Core Web Vitals. See INSTALL.md for local reproduction and verification limits. Packaging establishes neither marketplace compatibility nor a tagged upstream release.\n"
    for name in ["LICENSE", "NOTICE.md"]:
        payload[name] = (ROOT / name).read_bytes()
    for name, data in payload.items():
        if SECRET_SIGNATURE.search(data):
            raise ValueError(f"Potential credential/private-key signature in {name}; inspect before packaging")
    manifest = {"schemaVersion": 1, "package": PREFIX, "price": "free",
                "source": "https://github.com/Lrinvl1203/world-class-web-design-os",
                "baseCommit": "c2ef97775dfbca42b83b964227fc00cd8779f0c8",
                "auditBaseline": "4c5f30c5c3989a34fea17f5a54fb2c29f1583b44",
                "publicationStatus": "portable starter build; not a tagged upstream release",
                "files": [{"path": name, "size": len(data), "sha256": hashlib.sha256(data).hexdigest()}
                          for name, data in sorted(payload.items())]}
    payload["BUNDLE-MANIFEST.json"] = (json.dumps(manifest, indent=2) + "\n").encode()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(payload.items()):
            info = zipfile.ZipInfo(f"{PREFIX}/{name}", (2026, 10, 2, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100755 if name.endswith((".sh", ".py", ".mjs")) else 0o100644) << 16
            archive.writestr(info, data)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip():
            raise ValueError("ZIP CRC check failed")
    result = {"path": str(output), "sizeBytes": output.stat().st_size,
              "sha256": hashlib.sha256(output.read_bytes()).hexdigest(), "files": len(payload),
              "credentialSignatureScan": "no matching signature; this is not a complete security audit"}
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    build(args.output)
