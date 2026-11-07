Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    tickets: [
      { no: '0042', event: 'Book fair', when: 'Sat 27 Sep - 10:00', used: false },
      { no: '0043', event: 'Print workshop', when: 'Sun 28 Sep - 14:00', used: false },
      { no: '0017', event: 'Opening night', when: 'Fri 19 Sep - 19:30', used: true },
    ],
  },
  methods: {
    onScan(e) {
      const no = e.currentTarget.dataset.no;
      const tickets = this.data.tickets.map((t) => (t.no === no ? { ...t, used: true } : t));
      this.setData({ tickets });
      return { no, used: true };
    },
    /** Verification hook: scan a ticket by number. */
    scanTicket(no) {
      const t = this.data.tickets.find((x) => x.no === no);
      if (!t) return { ok: false };
      this.onScan({ currentTarget: { dataset: { no } } });
      return { ok: true, used: true };
    },
  },
});
