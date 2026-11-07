/**
 * ll-ticket properties — upstream Ticket (ticket.tsx): a faced sheet recipe
 * drawing the whole silhouette — concave corners, a bite out of both edges
 * where the stub tears off, a row of holes along the tear, and the pressed
 * frame around body and stub.
 */
export const props = {
  /** StockName — what the ticket is printed on (default kraft). */
  stock: {
    type: String,
    value: 'kraft',
  },
  /** TicketStub — which end the stub tears off: 'end' | 'start' | 'none'. */
  stub: {
    type: String,
    value: 'end',
  },
  /** Stub width in px (upstream stubWidth, shared with ll-ticket-stub). */
  stubWidth: {
    type: Number,
    value: 88,
  },
  /** Punch a scan hole (upstream `punched` — the ticket has been used). */
  punched: {
    type: Boolean,
    value: false,
  },
  /** true = seeded tilt (max 1.2deg); number = degrees; false = flat. */
  tilt: {
    type: null,
    optionalTypes: [Boolean, Number, String],
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: String,
  customStyle: String,
};

export const validators = {
  stub: ['end', 'start', 'none'],
};
