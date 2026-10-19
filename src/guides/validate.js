export function validateGuide({ slug, cards, edges }) {
  const ids = new Set();
  for (const { id } of cards) {
    if (ids.has(id)) throw new Error(`${slug}: duplicate card ID "${id}"`);
    ids.add(id);
  }
  for (const { from, to } of edges) {
    for (const id of [from, to]) {
      if (!ids.has(id)) throw new Error(`${slug}: ${from} → ${to} references unknown card "${id}"`);
    }
  }
}
