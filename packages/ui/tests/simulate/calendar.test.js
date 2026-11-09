const { mount } = require('./helpers/mount.cjs');

const JAN = { defaultMonth: '2024-01', today: '2024-01-15' };

/** addEventListener spies receive the re-emitted event wrapper — pull the
    triggerEvent detail out of it. */
const payloadOf = (spy, i = 0) => {
  const arg = spy.mock.calls[i][0];
  return arg && arg.detail !== undefined ? arg.detail : arg;
};

function cellOf(comp, iso) {
  for (const mo of comp.instance.data.months) {
    for (const wk of mo.weeks) {
      for (const day of wk.days) if (day.iso === iso) return day;
    }
  }
  return null;
}

describe('ll-calendar', () => {
  test('builds the month matrix: caption, weeks, outside days', () => {
    const comp = mount('calendar/calendar', JAN);
    const mo = comp.instance.data.months[0];
    expect(mo.caption).toBe('January 2024');
    expect(comp.instance.data.monthValue).toBe('2024-01');
    // Jan 1 2024 is a Monday → 1 leading cell with Sunday week start; 31 days → 5 week rows
    expect(mo.weeks).toHaveLength(5);
    expect(mo.weekdays[0]).toBe('Su');
    expect(mo.weekdays).toHaveLength(7);
    const first = cellOf(comp, '2023-12-31');
    expect(first.outside).toBe(true);
    expect(first.btnCls).toContain('ll-cal__btn--out');
    expect(cellOf(comp, '2024-01-31').label).toBe('31');
  });

  test('today wears the blue underline', () => {
    const comp = mount('calendar/calendar', JAN);
    const today = cellOf(comp, '2024-01-15');
    expect(today.today).toBe(true);
    expect(today.todayStyle).toContain('background:#2c4f9e');
    expect(cellOf(comp, '2024-01-16').today).toBeUndefined();
  });

  test('single mode: tapping a day selects it; tapping again clears', () => {
    const comp = mount('calendar/calendar', JAN);
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-10', disabled: false } } });
    expect(comp.instance.data.value).toBe('2024-01-10');
    expect(payloadOf(change)).toEqual({ value: '2024-01-10' });
    expect(cellOf(comp, '2024-01-10').sel).toBe(true);
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-10', disabled: false } } });
    expect(comp.instance.data.value).toBe('');
  });

  test('multiple mode: taps toggle days into a sorted set', () => {
    const comp = mount('calendar/calendar', { ...JAN, mode: 'multiple' });
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-20', disabled: false } } });
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-05', disabled: false } } });
    expect(comp.instance.data.value).toEqual(['2024-01-05', '2024-01-20']);
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-20', disabled: false } } });
    expect(comp.instance.data.value).toEqual(['2024-01-05']);
  });

  test('range mode: first tap sets from, second sets to and swipes the band', () => {
    const comp = mount('calendar/calendar', { ...JAN, mode: 'range' });
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-08', disabled: false } } });
    expect(comp.instance.data.value).toEqual(['2024-01-08', '']);
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-12', disabled: false } } });
    expect(comp.instance.data.value).toEqual(['2024-01-08', '2024-01-12']);
    const mid = cellOf(comp, '2024-01-10');
    expect(mid.btnCls).toContain('ll-cal__btn--range');
    expect(mid.bandStyle).toContain('background:rgba(248,220,76,0.62)');
  });

  test('disabled rules hatch days out and gate their taps', () => {
    const comp = mount('calendar/calendar', { ...JAN, disabled: [{ before: '2024-01-10' }, { dayOfWeek: [0, 6] }] });
    const early = cellOf(comp, '2024-01-05');
    expect(early.disabled).toBe(true);
    expect(early.btnCls).toContain('ll-cal__btn--dis');
    expect(early.hatchStyle).toContain('opacity:0.55');
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.instance.onDayTap({ currentTarget: { dataset: { iso: '2024-01-05', disabled: true } } });
    expect(change).not.toHaveBeenCalled();
    // a Sunday inside the allowed span is hatched too
    expect(cellOf(comp, '2024-01-14').disabled).toBe(true);
  });

  test('prev/next navigate months and emit monthchange', () => {
    const comp = mount('calendar/calendar', JAN);
    const changed = jest.fn();
    comp.addEventListener('monthchange', changed);
    comp.instance.onNext();
    expect(comp.instance.data.monthValue).toBe('2024-02');
    expect(payloadOf(changed)).toEqual({ month: '2024-02' });
    comp.instance.onPrev();
    comp.instance.onPrev();
    expect(comp.instance.data.monthValue).toBe('2023-12');
    expect(payloadOf(changed, changed.mock.calls.length - 1)).toEqual({ month: '2023-12' });
  });

  test('startMonth/endMonth clamp navigation and disable the arrows', () => {
    const comp = mount('calendar/calendar', { ...JAN, startMonth: '2024-01', endMonth: '2024-03' });
    expect(comp.instance.data.prevDis).toBe(true);
    expect(comp.instance.data.nextDis).toBe(false);
    comp.instance.onPrev();
    expect(comp.instance.data.monthValue).toBe('2024-01'); // clamped, no move
    comp.instance.onNext();
    comp.instance.onNext();
    expect(comp.instance.data.nextDis).toBe(true);
    comp.instance.onNext();
    expect(comp.instance.data.monthValue).toBe('2024-03'); // clamped
  });
});
