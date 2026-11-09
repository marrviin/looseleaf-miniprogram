const { mount } = require('./helpers/mount.cjs');

describe('ll-chart', () => {
  test('bar chart: builds an xy spec from rows and writes a plain-language summary', () => {
    const comp = mount('chart/chart', {
      type: 'bar',
      data: [
        { month: 'Jan', revenue: 10 },
        { month: 'Feb', revenue: 30 },
      ],
    });
    expect(comp.instance.__spec.type).toBe('xy');
    expect(comp.instance.__spec.series).toHaveLength(1);
    expect(comp.instance.__spec.series[0].values).toEqual([10, 30]);
    expect(comp.instance.__spec.cats).toEqual(['Jan', 'Feb']);
    expect(comp.instance.data.summary).toContain('Bar chart with 1 series (revenue)');
    expect(comp.instance.data.summary).toContain('2 categories from Jan to Feb');
  });

  test('an empty dataset lands in the empty state', () => {
    const comp = mount('chart/chart', { type: 'bar', data: [] });
    expect(comp.instance.__spec.state).toBe('empty');
    expect(comp.instance.data.summary).toContain('No data');
  });

  test('pie chart: slices keyed by name, total in the summary', () => {
    const comp = mount('chart/chart', {
      type: 'pie',
      data: [
        { name: 'A', value: 60 },
        { name: 'B', value: 40 },
      ],
    });
    const spec = comp.instance.__spec;
    expect(spec.type).toBe('pie');
    expect(spec.slices.map((s) => s.key)).toEqual(['A', 'B']);
    expect(spec.slices.map((s) => s.value)).toEqual([60, 40]);
    expect(comp.instance.data.summary).toContain('Pie chart of 2 slices, total 100');
    expect(comp.instance.data.summary).toContain('A 60 (60%)');
  });

  test('two xy series get legend rows; tapping one hides the series and rebuilds', () => {
    const comp = mount('chart/chart', {
      type: 'line',
      data: [
        { m: 'A', a: 1, b: 2 },
        { m: 'B', a: 3, b: 4 },
      ],
    });
    expect(comp.instance.data.legendRows).toHaveLength(2);
    const changed = jest.fn();
    comp.addEventListener('legendchange', changed);
    comp.instance.onLegendTap({ currentTarget: { dataset: { key: 'b' } } });
    const arg = changed.mock.calls[0][0];
    expect(arg && arg.detail ? arg.detail : arg).toEqual({ hidden: ['b'] });
    expect(comp.instance.data.hiddenSeries).toEqual(['b']);
    expect(comp.instance.__spec.series.map((s) => s.key)).toEqual(['a']);
    expect(comp.instance.data.legendRows.find((r) => r.key === 'b').off).toBe(true);
  });

  test('sparkline: plain-number rows become the values; the summary reports the trend', () => {
    const comp = mount('chart/chart', { type: 'sparkline', data: [2, 4, 3, 8] });
    const spec = comp.instance.__spec;
    expect(spec.type).toBe('spark');
    expect(spec.values).toEqual([2, 4, 3, 8]);
    expect(comp.instance.data.summary).toContain('4 points from 2 to 8');
    expect(comp.instance.data.summary).toContain('rising');
  });

  test('loading state wins over data', () => {
    const comp = mount('chart/chart', { type: 'bar', data: [{ m: 'A', v: 1 }], loading: true });
    expect(comp.instance.__spec.state).toBe('loading');
    expect(comp.instance.data.summary).toContain('Loading');
  });
});
