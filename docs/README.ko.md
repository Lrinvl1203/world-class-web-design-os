# World-Class Web Design OS

**관점이 있는 디자인. 증거가 있는 출시.**

Web Design OS는 프런트엔드는 생성할 수 있지만 왜 UI가 어색한지 판단하기 어려운 비개발자·바이브코더를 위한 17개 전문 스킬과 품질 게이트의 운영체제입니다. 스타일 프롬프트 모음이 아니라 발견 → 아트 디렉션 → 컴포넌트·모션·필요한 3D → 구현 → 독립 비평 → 접근성·성능 → 실제 렌더 QA까지의 의사결정 구조를 제공합니다.

[English README](../README.md) · [런치 페이지](https://lrinvl1203.github.io/world-class-web-design-os/) · [60초 시작](#60초-시작) · [동일 브리프 챌린지](../BENCHMARK.md) · [기여 안내](../CONTRIBUTING.md)

## 60초 시작

1. 스킬을 설치합니다.

```bash
npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex
```

다른 호환 에이전트에는 [범용 Agent Skills CLI](https://github.com/vercel-labs/skills)를 사용할 수도 있습니다.

```bash
npx --yes skills add Lrinvl1203/world-class-web-design-os -g
```

2. 스킬 검색이 갱신되도록 새 에이전트 세션을 시작합니다.

3. 한 문장으로 요청합니다.

> $web-design-orchestrator를 사용해서 [대상 사용자]를 위한 이 웹사이트를 리디자인하고 구현한 뒤, 모바일과 데스크톱에서 검증해줘.

기존 설치를 갱신할 때는 `--overwrite`, 지원 대상 전체에 설치할 때는 `--agent all`을 사용합니다.

```bash
npx --yes github:Lrinvl1203/world-class-web-design-os doctor --agent codex
```

두 설치 방식 모두 공개 GitHub 저장소를 직접 읽습니다. 범용 CLI가 중복 `skills/` 디렉터리 없이 현재 17개 스킬을 모두 발견하는 것도 확인했습니다.

지원 대상은 Codex, Claude Code, Cursor, GitHub Copilot, OpenCode와 공용 `.agents/skills` 규칙입니다.

## 저장소에 실제로 포함된 것

| 구성 | 의미 |
|---|---|
| 오케스트레이터 1개 + 전문 스킬 16개 | 필요한 역할만 활성화하면서 전체 디자인 과정을 유지합니다 |
| 증거 등급이 표시된 레퍼런스 100개 | 스타일 형용사 대신 검색 가능한 디자인·기술 근거를 제공합니다 |
| 서로 다른 실행형 웹사이트 실험 5개 | 하나의 하우스 스타일을 강요하지 않음을 직접 보여줍니다 |
| Playwright·axe·반응형·오버플로·콘솔·모션 감소 게이트 | 완성 여부를 실제 브라우저 증거로 확인합니다 |
| 다중 에이전트 설치기와 진단 명령 | 여러 에이전트가 하나의 관리되는 원본을 사용합니다 |

## 무엇이 다른가

- 스타일링 전에 사용자, 비즈니스 목적, 핵심 행동을 정의합니다.
- 레퍼런스의 외형을 복제하지 않고 원리를 분해해 재조합합니다.
- 방향이 열려 있으면 색상 변형이 아닌 서로 다른 세 가지 아트 디렉션을 검토합니다.
- 데스크톱을 축소하지 않고 모바일의 우선순위와 구성을 다시 설계합니다.
- 구현자와 비평자의 역할을 분리합니다.
- 실제 화면 캡처, 키보드, axe, 오버플로, 콘솔 오류를 완료 조건으로 둡니다.
- 매일 수집한 신호는 검토 가능한 제안서만 만들며 핵심 스킬을 자동 수정하지 않습니다.

## 직접 열어볼 수 있는 결과물

<table>
  <tr>
    <td width="50%"><a href="https://lrinvl1203.github.io/world-class-web-design-os/experiments/nocturne-concierge/"><img src="../site/assets/nocturne.jpg" alt="Nocturne Concierge 에디토리얼 호스피탈리티 실험"></a></td>
    <td width="50%"><a href="https://lrinvl1203.github.io/world-class-web-design-os/experiments/linehold-forge/"><img src="../site/assets/linehold.jpg" alt="Linehold Forge 산업형 커머스 실험"></a></td>
  </tr>
  <tr>
    <td><strong>Nocturne Concierge</strong><br>에디토리얼 호스피탈리티 · 절제된 분위기</td>
    <td><strong>Linehold Forge</strong><br>산업형 커머스 · 고밀도 유틸리티</td>
  </tr>
</table>

<table>
  <tr>
    <td width="33%"><a href="https://lrinvl1203.github.io/world-class-web-design-os/experiments/afterimage-atlas/"><img src="../site/assets/afterimage.jpg" alt="Afterimage Atlas 에디토리얼 문화 실험"></a></td>
    <td width="33%"><a href="https://lrinvl1203.github.io/world-class-web-design-os/experiments/sequence-desk/"><img src="../site/assets/sequence-desk.jpg" alt="Sequence Desk 제품 UI 실험"></a></td>
    <td width="33%"><a href="https://lrinvl1203.github.io/world-class-web-design-os/experiments/orbital-commons/"><img src="../site/assets/orbital-commons.jpg" alt="Orbital Commons 시민 데이터와 의도 있는 3D 실험"></a></td>
  </tr>
  <tr>
    <td><strong>Afterimage Atlas</strong><br>에디토리얼 문화 · 오브젝트 검사</td>
    <td><strong>Sequence Desk</strong><br>제품 UI · 상태 기반 워크플로</td>
    <td><strong>Orbital Commons</strong><br>시민 데이터 · 의도 있는 유사 3D</td>
  </tr>
</table>

| 실험 | 유형 | 내부 점수 | 현장 증거 | 상태 |
|---|---|---:|---|---|
| [Nocturne Concierge](../experiments/nocturne-concierge/) | 에디토리얼 호스피탈리티 | 92.8 | 대기 | 내부 목표 통과 |
| [Linehold Forge](../experiments/linehold-forge/) | 산업형 커머스 | 91.8 | 대기 | 92 미만 보류 |
| [Afterimage Atlas](../experiments/afterimage-atlas/) | 에디토리얼 문화 | 92.7 | 대기 | 내부 목표 통과 |
| [Sequence Desk](../experiments/sequence-desk/) | 제품 인터페이스 | 92.8 | 대기 | 내부 목표 통과 |
| [Orbital Commons](../experiments/orbital-commons/) | 시민 데이터·유사 3D | 94.3 | 대기 | 내부 목표 통과 |

Design Quality 점수는 내부 루브릭 평가입니다. 사용자 조사, 전환율, 어워드 결과, 외부 전문가 평가를 뜻하지 않습니다. 증거 체계는 [공개 벤치마크 문서](public-benchmark.md)를 참고하세요.

## 공개 배포 현황

다음 링크는 프로젝트가 실제로 소개된 채널의 기록이며 외부 품질 인증이나 추천을 뜻하지 않습니다.

- [Product Hunt 출시 페이지](https://www.producthunt.com/products/world-class-web-design-os)
- [X 공개 글](https://x.com/lrinvl1203/status/2086859489001738289)
- [Threads 공개 글](https://www.threads.com/@lrinvl1203/post/Db3bx0OkuRD)
- [Reddit 아키텍처 토론](https://www.reddit.com/r/OpenaiCodex/comments/1vkpgyr/i_turned_my_webdesign_workflow_into_17_codex/)
- [GitHub 시작·피드백 토론](https://github.com/Lrinvl1203/world-class-web-design-os/discussions/6)

배포 상태의 기준 데이터는 [`config/distribution.json`](../config/distribution.json)이며, 문서와 상태가 어긋나면 CI가 실패합니다.

## 주요 명령어

```bash
web-design-os route "에디토리얼 제품 사이트와 스크롤 스토리텔링"
web-design-os search "typography motion" --limit 8
web-design-os setup .
web-design-os install --agent codex
web-design-os doctor --agent codex
web-design-os evolve --offline
web-design-os eval
```

전체 구조는 [아키텍처](architecture.md), 운영 원칙은 루트의 [`AGENTS.md`](../AGENTS.md), 개선 참여 방법은 [기여 안내](../CONTRIBUTING.md)에 있습니다.

MIT © 2026 Lrinvl1203
