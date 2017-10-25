export const drawArcs = c => {
  const bend = 1.3;
  const d = {source: c[0], target: c[1]};
  const dx = d.target[0] - d.source[0];
  const dy = d.target[1] - d.source[1];
  const dr = Math.sqrt(dx * dx + dy * dy)*bend;
  // to avoid whirlpool effect do a flip if needed
  if (d.target[0] - d.source[0] < 0) {
    return `M${d.target[0]},${d.target[1]}A${dr},${dr} 0 0,1 ${d.source[0]},${d.source[1]}`;
  }
  return `M${d.source[0]},${d.source[1]}A${dr},${dr} 0 0,1 ${d.target[0]},${d.target[1]}`;
}
