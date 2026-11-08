Page({
  data: {
    code: "import { useState } from \"react\"\n\ntype Props = { tags: string[] } // one per note\n\nexport function TagChips({ tags }: Props) {\n  const [on, setOn] = useState(new Set<string>())\n  return (\n    <ul className=\"flex gap-2\">\n      {tags.map((t) => (\n        <li key={t}>{t}</li>\n      ))}\n    </ul>\n  )\n}",
    patch: "-const shown = notes;\n+const shown = picked.size\n+  ? notes.filter((n) => picked.has(n.tag))\n+  : notes;\n export const count = shown.length;\n-export const label = \"all\";\n+export const label = picked.size ? \"filtered\" : \"all\";",
    chatPatch: "-export const label = \"all\";\n+export const label = picked.size ? \"filtered\" : \"all\";",
    css: ".ll-tag-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 2px 10px;\n  border-radius: 999px;\n  --chip-ink: var(--ll-ink-muted);\n}",
    json: "{\n  \"note\": \"one per tag\",\n  \"tags\": [\"ink\", \"tape\", \"sticker\"],\n  \"pinned\": true,\n  \"count\": 3\n}",
  },
});
