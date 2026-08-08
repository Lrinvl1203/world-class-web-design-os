#!/usr/bin/env python3
from pathlib import Path
import json, sys

root = Path(__file__).resolve().parents[1]
rubric = json.loads((root/'config/wdx-rubric.json').read_text())
report_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root/'examples/wdx-score.sample.json'
report = json.loads(report_path.read_text())
errors=[]
total=0
for name, rule in rubric['categories'].items():
    if name not in report['scores']:
        errors.append(f'missing score: {name}')
        continue
    score=report['scores'][name]
    if score < 0 or score > rule['max']:
        errors.append(f'{name}: {score} outside 0..{rule["max"]}')
    if score < rule['floor']:
        errors.append(f'{name}: {score} below floor {rule["floor"]}')
    total += score
if total < rubric['release_threshold']:
    errors.append(f'total {total} below release threshold {rubric["release_threshold"]}')
for gate in ['functional','critical_accessibility','responsive_matrix','reduced_motion','no_horizontal_overflow','no_console_errors']:
    if report.get('hard_gates',{}).get(gate) is not True:
        errors.append(f'hard gate failed: {gate}')
metrics=report.get('hard_gates',{}).get('core_web_vitals',{})
limits=rubric['hard_gates']['core_web_vitals']
if metrics.get('lcp_ms', 10**9) > limits['lcp_ms_max']: errors.append('LCP gate failed')
if metrics.get('inp_ms', 10**9) > limits['inp_ms_max']: errors.append('INP gate failed')
if metrics.get('cls', 10**9) > limits['cls_max']: errors.append('CLS gate failed')
print(f'WDX total: {total}/100')
if errors:
    for e in errors: print(' -', e)
    sys.exit(1)
print('All configured WDX and hard gates pass.')
