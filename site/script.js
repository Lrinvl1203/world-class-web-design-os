const stages = [
  { kicker: 'DESIGN DISCOVERY', title: 'Find the job before the style.', copy: 'Define the audience, primary action, content hierarchy, constraints, and questions that must be true before visual work begins.', gate: 'A testable brief with one primary action' },
  { kicker: 'ART DIRECTION + SYSTEM', title: 'Choose a point of view—and a refusal.', copy: 'Develop materially different directions, select one, state the anti-direction, and translate the decision into tokens and composition rules.', gate: 'A direction distinct enough to critique' },
  { kicker: 'FRONTEND + RECOMPOSITION', title: 'Build meaning first, enhancement second.', copy: 'Implement semantic structure, intentional component boundaries, native-capable motion, and a dedicated hierarchy for every target viewport.', gate: 'Critical content works before animation' },
  { kicker: 'CRITIC + AI SMELL DETECTOR', title: 'Separate authorship from judgment.', copy: 'Audit macro composition, meso rhythm, micro craft, generic AI patterns, and unjustified effects in an independent pass.', gate: 'Root causes ranked by leverage' },
  { kicker: 'VISUAL QA + A11Y / PERFORMANCE', title: 'Render the claim and try to break it.', copy: 'Capture representative viewports, test keyboard paths, reduced motion, overflow, axe violations, console errors, and performance risk.', gate: 'Hard gates pass with evidence' }
];

const installModes = {
  codex: {
    command: 'npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex',
    prompt: '“이 제품의 웹사이트를 디자인하고 구현해줘.”',
    note: 'The skill system is installed to your global Codex skills directory. Add --overwrite when updating an existing installation.'
  },
  all: {
    command: 'npx --yes github:Lrinvl1203/world-class-web-design-os install --agent all',
    prompt: '“이 브랜드의 웹사이트를 처음부터 완성해줘.”',
    note: 'Installs the same validated skill set for every agent target declared in config/agent-targets.json.'
  },
  project: {
    command: 'npx --yes github:Lrinvl1203/world-class-web-design-os setup .',
    prompt: '“프로젝트 컨텍스트를 읽고 이 페이지를 리디자인해줘.”',
    note: 'Creates .web-design-os/project-context.md in the current project without overwriting an existing brief.'
  }
};

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    const status = document.getElementById(button.dataset.statusTarget || 'hero-copy-status');
    const value = source?.textContent?.trim() ?? '';
    try {
      await navigator.clipboard.writeText(value);
      const previous = button.textContent;
      button.textContent = 'Copied';
      if (status) status.textContent = source?.tagName === 'BLOCKQUOTE' ? 'Prompt copied. Paste it into a new agent session.' : 'Command copied. Paste it into your terminal.';
      window.setTimeout(() => { button.textContent = previous; }, 1600);
    } catch {
      if (source) window.getSelection()?.selectAllChildren(source);
      if (status) status.textContent = 'Clipboard was unavailable. The text is selected for manual copying.';
    }
  });
});

document.querySelectorAll('[data-stage]').forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.stage);
    const stage = stages[index];
    document.querySelectorAll('[data-stage]').forEach(tab => {
      tab.setAttribute('aria-selected', String(tab === button));
      tab.tabIndex = tab === button ? 0 : -1;
    });
    document.getElementById('stage-panel').setAttribute('aria-labelledby', button.id);
    document.getElementById('stage-kicker').textContent = stage.kicker;
    document.getElementById('stage-title').textContent = stage.title;
    document.getElementById('stage-copy').textContent = stage.copy;
    document.getElementById('stage-gate').textContent = stage.gate;
  });
});

document.querySelectorAll('[data-install]').forEach(button => {
  button.addEventListener('click', () => {
    const mode = installModes[button.dataset.install];
    document.querySelectorAll('[data-install]').forEach(tab => {
      tab.setAttribute('aria-selected', String(tab === button));
      tab.tabIndex = tab === button ? 0 : -1;
    });
    document.getElementById('install-panel').setAttribute('aria-labelledby', button.id);
    document.getElementById('install-command').textContent = mode.command;
    document.getElementById('install-prompt').textContent = mode.prompt;
    document.getElementById('install-note').textContent = mode.note;
  });
});

document.querySelectorAll('[role="tablist"]').forEach(list => {
  list.addEventListener('keydown', event => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0 || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  });
});
