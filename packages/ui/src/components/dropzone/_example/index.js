Page({
  data: {
    limit2MB: 2 * 1024 * 1024,
    limit3MB: 3 * 1024 * 1024,
    limit1MB: 1024 * 1024,
    footer1: '',
    // 02 — attach with progress: the page drives each row's status.
    files2: [],
    rows2: [],
    busy2: false,
    footer2: 'Nothing attached.',
    // 03 — one file: a profile picture.
    files3: [],
    // 04 — required, in a form.
    touched4: false,
    count4: 0,
    result4: '',
  },
  onUnload() {
    if (this.__timers) for (const id of this.__timers.values()) clearInterval(id);
  },
  /** 01 — the zone keeps its own files; the page just counts. */
  onFiles1(e) {
    this.setData({ footer1: `${(e.detail.files || []).length} attached.` });
  },
  onReject1(e) {
    const n = (e.detail.rejections || []).length;
    this.setData({ footer1: `${n} file${n === 1 ? '' : 's'} turned away.` });
  },
  onReject2(e) {
    /* rejections render themselves under the zone */
  },
  onRemove2(e) {
    const dropped = e.detail.file;
    const files = this.data.files2.filter(
      (f) => !(f.name === dropped.name && f.size === dropped.size && f.time === dropped.time)
    );
    this.__sync2(files);
  },
  /** 02 — a timer stands in for the network: rows fill their line, finish
      with a green tick, and a file with "fail" in its name fails. */
  onFiles2(e) {
    const files = e.detail.files || [];
    const prev = this.__status2 || {};
    const next = {};
    for (const f of files) next[f.name + ':' + f.size] = prev[f.name + ':' + f.size] || { progress: 0, state: 'uploading' };
    this.__status2 = next;
    if (this.__timers) for (const [k, id] of this.__timers.entries()) if (!next[k]) { clearInterval(id); this.__timers.delete(k); }
    this.__timers = this.__timers || new Map();
    for (const f of files) {
      const k = f.name + ':' + f.size;
      if (this.__timers.has(k)) continue;
      const id = setInterval(() => {
        const s = this.__status2[k];
        s.progress = Math.min(100, s.progress + 8 + (f.size % 7));
        s.state = s.progress >= 100 ? (f.name.indexOf('fail') > -1 ? 'error' : 'done') : 'uploading';
        if (s.progress >= 100) { clearInterval(id); this.__timers.delete(k); }
        this.__sync2(files);
      }, 240);
      this.__timers.set(k, id);
    }
    this.__sync2(files);
  },
  __sync2(files) {
    const rows = files.map((f, i) => {
      const s = this.__status2[f.name + ':' + f.size] || { progress: 0, state: 'idle' };
      return {
        ...f,
        key: f.name + ':' + f.size,
        status: s.state,
        progress: s.state === 'uploading' ? s.progress : null,
        error: s.state === 'error' ? 'The upload failed. Remove it and try again.' : '',
        _i: i,
      };
    });
    const busy = rows.some((r) => r.status === 'uploading');
    this.setData({
      files2: files,
      rows2: rows,
      busy2: busy,
      footer2: files.length === 0 ? 'Nothing attached.' : busy ? 'Sending...' : `${files.length} attached.`,
    });
  },
  /** 03 — one file; a new pick replaces the old. */
  onFiles3(e) {
    this.setData({ files3: e.detail.files || [] });
  },
  /** 04 — the zone is a form field: submit empty and it turns invalid. */
  onFiles4(e) {
    this.setData({ count4: (e.detail.files || []).length });
  },
  onWho(e) {
    this.__who = e.detail.value;
  },
  sendClaim() {
    const count = this.data.count4;
    this.setData({
      touched4: true,
      result4: count === 0 ? 'Not sent.' : `${this.__who || 'Someone'} sent ${count} receipt${count === 1 ? '' : 's'} (held by the zone).`,
    });
  },
});
