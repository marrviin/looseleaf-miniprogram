const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');
const { hashSeed } = require('../../src/common/ink');
const { SKELETON_FRAMES } = require('../../src/common/ink-engine');

function phaseOf(comp) {
  const m = /--ll-sk-phase:(\d+)/.exec(comp.querySelector('.ll-skeleton').dom.getAttribute('style') || '');
  return m ? Number(m[1]) : null;
}

describe('ll-skeleton', () => {
  test('attaches the boil-frame tile vars, the phase and the shade background', () => {
    const comp = mount('skeleton/skeleton');
    const style = comp.querySelector('.ll-skeleton').dom.getAttribute('style') || '';
    for (let i = 0; i < SKELETON_FRAMES; i++) {
      expect(style).toContain(`--ll-sk-eh${i}:`);
      expect(style).toContain(`--ll-sk-ha${i}:`);
    }
    expect(style).toMatch(/--ll-sk-phase:\d+/);
    expect(style).toContain('background-color:rgba(');
  });

  test('the phase is the seed hash modulo the frame count; same seed, same phase', () => {
    const a = mount('skeleton/skeleton', { seed: 'note-1' });
    const b = mount('skeleton/skeleton', { seed: 'note-1' });
    expect(phaseOf(a)).toBe(hashSeed('note-1') % SKELETON_FRAMES);
    expect(phaseOf(a)).toBe(phaseOf(b));
  });

  test('round turns the outline into a looped circle', async () => {
    const comp = mount('skeleton/skeleton');
    expect(comp.querySelector('.ll-skeleton__outline--round')).toBeFalsy();
    comp.setData({ round: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-skeleton__outline--round')).toBeTruthy();
    const style = comp.querySelector('.ll-skeleton').dom.getAttribute('style') || '';
    expect(style).toContain('border-radius:9999px');
  });

  test('customStyle is appended to the inline root style', () => {
    const comp = mount('skeleton/skeleton', { customStyle: 'width:120px;height:12px;' });
    const style = comp.querySelector('.ll-skeleton').dom.getAttribute('style') || '';
    expect(style).toContain('width:120px;height:12px;');
  });
});
