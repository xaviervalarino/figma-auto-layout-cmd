import { BaseLayoutSizer, AutoLayoutSizer } from "./AutoLayoutSizing";

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function logLayout(node: LayoutChild) {
  console.log(`${node.name}
layoutGrow: ${node.layoutGrow}
layoutAlign: ${node.layoutAlign}
layoutMode: ${node.layoutMode}
primaryAxisSizingMode: ${node.primaryAxisSizingMode}
counterAxisSizingMode: ${node.counterAxisSizingMode}
`);
}

console.clear();

figma.on("run", ({ command }) => {
  if (command === "horizontal" || command === "vertical") {
    const selection: LayoutSizer[] = [];
    const modes: LayoutMode[] = ["fixed", "fill", "hug"];
    const modeCounts = { hug: 0, fill: 0, fixed: 0 };

    for (const node of figma.currentPage.selection) {
      if (node.parent && "layoutMode" in node.parent) {
        let layoutNode: LayoutSizer;
        if ("layoutMode" in node) {
          layoutNode = new AutoLayoutSizer(node);
        } else {
          layoutNode = new BaseLayoutSizer(node);
        }
        modeCounts[layoutNode[command]] += 1;
        selection.push(layoutNode);
      }
    }

    if (!selection.length) return figma.closePlugin();

    const [mode] = <[LayoutMode, number]>Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0];

    let nextMode: LayoutMode;
    const i = modes.indexOf(mode);
    if (i === modes.length - 1) {
      nextMode = modes[0];
    } else {
      nextMode = modes[i + 1];
    }

    console.log(mode, nextMode);
    const modesSet = { fixed: 0, fill: 0, hug: 0 };
    for (const layoutNode of selection) {
      logLayout(layoutNode.node);
      if (layoutNode instanceof BaseLayoutSizer && nextMode === "hug") {
        layoutNode[command] = "fixed";
        modesSet.fixed += 1;
      } else if (layoutNode instanceof AutoLayoutSizer && nextMode === "fixed") {
        layoutNode[command] = "fill";
        modesSet.fill += 1;
      } else {
        layoutNode[command] = nextMode;
        modesSet[nextMode] += 1;
      }
    }

    const outcome = Object.entries(modesSet)
      .map(([k, v]: [string, number]) => {
        if (!v) return;
        return v + " " + capitalize(k);
      })
      .join(" ");
    const direction = command === "horizontal" ? "Width" : "Height";
    console.log(nextMode);
    figma.closePlugin(`${direction}: ${outcome}`);
  }
});
