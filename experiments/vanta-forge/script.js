const families = {
  aero: {
    position: '0',
    kicker: 'High-load concentric geometry',
    title: 'Impellers + blisks',
    description: 'Five-axis roughing and finishing with controlled datum transfer for nickel, titanium, and stainless rotating parts.',
    envelope: 'Ø 80–1,600 mm',
    tolerance: '±0.008 mm',
    inspection: '5-axis CMM + scan',
    lot: '1–24 serialized'
  },
  energy: {
    position: '1',
    kicker: 'Large-envelope flow surfaces',
    title: 'Vaned flow paths',
    description: 'Stable workholding and surface verification for compressor, pump, and turbine geometries across low-volume programs.',
    envelope: 'Ø 250–2,200 mm',
    tolerance: '±0.015 mm',
    inspection: 'CMM + optical scan',
    lot: '1–12 project lots'
  },
  robotics: {
    position: '2',
    kicker: 'Repeatable motion interfaces',
    title: 'Housings + carriers',
    description: 'Bore, bearing, and mounting-datum control for lightweight robotic structures and precision drive assemblies.',
    envelope: '40–900 mm',
    tolerance: '±0.012 mm',
    inspection: 'CMM + air gauge',
    lot: '4–120 controlled'
  }
};

const stage = document.querySelector('.capability-stage');
const familyButtons = [...document.querySelectorAll('[data-family]')];

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

familyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const family = families[button.dataset.family];
    familyButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    stage.dataset.position = family.position;
    setText('[data-family-kicker]', family.kicker);
    setText('[data-family-title]', family.title);
    setText('[data-family-description]', family.description);
    setText('[data-family-envelope]', family.envelope);
    setText('[data-family-tolerance]', family.tolerance);
    setText('[data-family-inspection]', family.inspection);
    setText('[data-family-lot]', family.lot);

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.querySelector('.capability-copy').animate(
        [{ opacity: .55, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
  });
});

const rfqForm = document.querySelector('[data-rfq-form]');
rfqForm?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(rfqForm);
  const quantity = Math.max(1, Number(form.get('quantity')) || 1);
  setText('[data-rfq-heading]', `${quantity}-part first-lot brief`);
  setText(
    '[data-rfq-summary]',
    `${form.get('part')} / ${form.get('material')} / quantity ${quantity} / ${form.get('tolerance')}. Add the drawing revision, neutral CAD, CTQs, and documentation scope before supplier review. Nothing was transmitted.`
  );
  document.querySelector('.rfq-output')?.focus({ preventScroll: true });
});
