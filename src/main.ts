import { BaseLayoutSizer, AutoLayoutSizer } from "./AutoLayoutSizing";
import LayoutAligner from "./LayoutAlignment";

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
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

  if (command.match("column$")) {
    const parents = new Map<string, LayoutAligner>();
    const rows: AlignmentPosition[1][] = ["top", "middle", "bottom"];
    const nextColumn = <AlignmentPosition[0]>command.split(" ")[0];
    const columnCounts = { left: 0, center: 0, right: 0 };
    const rowCounts = { top: 0, middle: 0, bottom: 0 };

    for (const node of figma.currentPage.selection) {
      if ("layoutMode" in node && node.layoutMode !== "NONE") {
        const aligner = new LayoutAligner(node);
        columnCounts[aligner.position[0]] += 1
        rowCounts[aligner.position[1]] += 1;
        if (!parents.get(node.id)) parents.set(node.id, aligner);
      }
    }

    const [currentColumn] = <[AlignmentPosition[0], number]>(
      Object.entries(columnCounts).sort((a, b) => b[1] - a[1])[0]
    );
    const [currentRow] = <[AlignmentPosition[1], number]>(
      Object.entries(rowCounts).sort((a, b) => b[1] - a[1])[0]
    );

    let nextPosition: AlignmentPosition;

    console.log(currentColumn, nextColumn, currentColumn === nextColumn);
    if (currentColumn !== nextColumn) {
      nextPosition = [nextColumn, currentRow];
      console.log('!==', nextPosition)
    } else {
      const i = rows.indexOf(currentRow);
      if (i === rows.length - 1) {
        nextPosition = [nextColumn, rows[0]];
      } else {
        nextPosition = [nextColumn, rows[i + 1]];
      }
      console.log('===', nextPosition)
    }

    for (const aligner of parents.values()) {
      logLayout(aligner.node);
      aligner.position = nextPosition;
    }
    figma.closePlugin(`Alignment set to ${nextPosition.join(" ")}`);
  }

  if (command === "direction") {
    const selection: AutoLayoutNode[] = [];
    const directionCounts = { HORIZONTAL: 0, VERTICAL: 0, NONE: 0 };
    for (const node of figma.currentPage.selection) {
      if ("layoutMode" in node) {
        directionCounts[node.layoutMode] += 1;
        selection.push(node);
      }
    }

    const [currentDirection] = <["HORIZONTAL" | "VERTICAL" | "NONE", number]>(
      Object.entries(directionCounts).sort((a, b) => b[1] - a[1])[0]
    );
    const nextDirection = currentDirection === "HORIZONTAL" ? "VERTICAL" : "HORIZONTAL";

    for (const node of selection) {
      node.layoutMode = nextDirection
    }
    figma.closePlugin(`${capitalize(nextDirection)} layout`)
  }
});
