const el = document.querySelector('a[href="/"]');
if (el) {
  const rect = el.getBoundingClientRect();
  const topEl = document.elementFromPoint(rect.x + rect.width/2, rect.y + rect.height/2);
  console.log("Top element covering home link:", topEl.tagName, topEl.className);
}
