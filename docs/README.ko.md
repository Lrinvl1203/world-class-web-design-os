# WDX — 웹 디자인 운영체제

**관점이 있는 디자인. 증거가 있는 출시.**

WDX는 AI 코딩 에이전트가 웹사이트를 만들 때 사용하는 17개 전문 스킬과 품질 게이트의 운영체제입니다. 스타일 프롬프트 모음이 아니라 발견 → 아트 디렉션 → 시스템 → 구현 → 독립 비평 → 접근성·성능 → 실제 렌더 QA까지의 의사결정 구조를 제공합니다.

[English README](../README.md) · [런치 페이지](https://lrinvl1203.github.io/world-class-web-design-os/) · [기여 안내](../CONTRIBUTING.md)

## 한 줄 설치

```bash
npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex
```

설치 뒤에는 평소처럼 한 문장으로 요청하면 됩니다.

> 이 제품의 개성이 분명한 웹사이트를 디자인하고 구현해줘.

기존 설치를 갱신할 때는 `--overwrite`, 지원 대상 전체에 설치할 때는 `--agent all`을 사용합니다.

```bash
npx --yes github:Lrinvl1203/world-class-web-design-os doctor --agent codex
```

저장소가 비공개인 동안에는 로컬에서 `npm run wdx -- install --agent codex`를 실행해야 합니다.

## 무엇이 다른가

- 스타일링 전에 사용자, 비즈니스 목적, 핵심 행동을 정의합니다.
- 레퍼런스의 외형을 복제하지 않고 원리를 분해해 재조합합니다.
- 방향이 열려 있으면 색상 변형이 아닌 서로 다른 세 가지 아트 디렉션을 검토합니다.
- 데스크톱을 축소하지 않고 모바일의 우선순위와 구성을 다시 설계합니다.
- 구현자와 비평자의 역할을 분리합니다.
- 실제 화면 캡처, 키보드, axe, 오버플로, 콘솔 오류를 완료 조건으로 둡니다.
- 매일 수집한 신호는 검토 가능한 제안서만 만들며 핵심 스킬을 자동 수정하지 않습니다.

## 검증 결과의 정확한 의미

| 실험 | 유형 | 내부 WDX | 현장 증거 | 상태 |
|---|---|---:|---|---|
| [Nocturne Concierge](../experiments/nocturne-concierge/) | 에디토리얼 호스피탈리티 | 92.8 | 대기 | 내부 목표 통과 |
| [VANTA Forge](../experiments/vanta-forge/) | 산업형 커머스 | 91.8 | 대기 | 92 미만 보류 |

WDX 점수는 내부 루브릭 평가입니다. 사용자 조사, 전환율, 어워드 결과, 외부 전문가 평가를 뜻하지 않습니다. 증거 체계는 [공개 벤치마크 문서](public-benchmark.md)를 참고하세요.

## 주요 명령어

```bash
wdx route "에디토리얼 제품 사이트와 스크롤 스토리텔링"
wdx search "typography motion" --limit 8
wdx setup .
wdx install --agent codex
wdx doctor --agent codex
wdx evolve --offline
wdx eval
```

전체 구조는 [아키텍처](architecture.md), 운영 원칙은 루트의 [`AGENTS.md`](../AGENTS.md), 개선 참여 방법은 [기여 안내](../CONTRIBUTING.md)에 있습니다.

MIT © 2026 Lrinvl1203

