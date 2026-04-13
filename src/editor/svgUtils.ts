/**
 * Split a multi-page typst SVG into one SVG string per page.
 * Falls back to a single fixed-dimension SVG if splitting isn't possible.
 */
export function splitPages(svg: string): string[] {
  // Parse as HTML since typst SVG may not be valid XML
  const doc = new DOMParser().parseFromString(svg, "text/html");
  const root = doc.querySelector("svg");
  if (!root) {
    return [svg];
  }

  const vb = root.viewBox.baseVal;
  if (!vb.width || !vb.height) {
    return [svg];
  }

  const pageGroups = Array.from(root.children).filter(
    (el): el is SVGGElement => el.tagName === "g" && el.hasAttribute("transform")
  );

  if (pageGroups.length <= 1) {
    // Single page — just fix dimensions so it doesn't scale to fill container
    root.setAttribute("width", String(vb.width));
    root.setAttribute("height", String(vb.height));
    return [root.outerHTML];
  }

  // Shared elements (defs, style, etc.) needed by every page
  const shared = Array.from(root.children)
    .filter((el) => el.tagName !== "g")
    .map((el) => el.outerHTML)
    .join("");

  // Copy all attributes from the root SVG except sizing ones
  const attrs = Array.from(root.attributes)
    .filter((a) => !["width", "height", "viewBox"].includes(a.name))
    .map((a) => `${a.name}="${a.value}"`)
    .join(" ");

  // Extract Y offsets to compute per-page heights
  const yOffsets = pageGroups.map((g) => {
    const m = g.getAttribute("transform")?.match(/translate\(\s*[\d.]+[\s,]+([\d.]+)\s*\)/);
    return m ? Number(m[1]) : 0;
  });

  return pageGroups.map((g, i) => {
    const nextY = i + 1 < yOffsets.length ? yOffsets[i + 1] : vb.height;
    const pageHeight = nextY - yOffsets[i];

    // Content inside each group is in local coordinates — remove the page-positioning transform
    const clone = g.cloneNode(true) as Element;
    clone.removeAttribute("transform");

    const w = String(vb.width);
    const h = String(pageHeight);
    return `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shared}${clone.outerHTML}</svg>`;
  });
}
