type LayoutChild = (
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | EllipseNode
  | FrameNode
  | GroupNode
  | HighlightNode
  | InstanceNode
  | LineNode
  | PolygonNode
  | RectangleNode
  | SliceNode
  | StampNode
  | StarNode
  | TextNode
  | VectorNode
  | WashiTapeNode
) & { parent: FrameNode | ComponentNode | InstanceNode };

function logLayout(node: LayoutChild) {
  console.log(`${node.name}
layoutMode: ${node.layoutMode}
layoutGrow: ${node.layoutGrow}
layoutAlign: ${node.layoutAlign}
primaryAxisSizingMode: ${node.primaryAxisSizingMode}
counterAxisSizingMode: ${node.counterAxisSizingMode}
`);
}

/* function cycleWidth(node: LayoutChild, direction: "NONE" | "HORIZONTAL" | "VERTICAL") {
  console.log(direction);
  return new Promise<void>(async (resolve, reject) => {
    if (direction === "VERTICAL") {
      const resizing = node.layoutAlign === "STRETCH" ? "hug" : "fill";
      node.layoutAlign = opts.VERTICAL[resizing].layoutAlign;
      if ("counterAxisSizingMode" in node) {
        node.counterAxisSizingMode = opts.VERTICAL[resizing].counterAxisSizingMode;
      }
      if (node.type === "TEXT" && node.fontName !== figma.mixed) {
        await figma.loadFontAsync(node.fontName);
        node.textAutoResize = opts.VERTICAL[resizing].textAutoResize;
      }
      resolve(undefined);
    } else {
      const resizing = opts.HORIZONTAL[node.layoutGrow ? "hug" : "fill"];
      node.layoutGrow = resizing.layoutGrow;
      if ("primaryAxisSizingMode" in node && node.primaryAxisSizingMode) {
        node.primaryAxisSizingMode = resizing.primaryAxisSizingMode;
      }
      if (node.type === "TEXT" && node.fontName !== figma.mixed) {
        await figma.loadFontAsync(node.fontName);
        node.textAutoResize = resizing.textAutoResize;
      }
      resolve(undefined);
    }
  });
} */

function _resizePrimaryAxis(
  node: LayoutChild,
  mode: "hug" | "fill",
  axis: "HORIZONTAL" | "VERTICAL" | "NONE"
) {
  node.layoutGrow = mode === "hug" ? 0 : 1;
  if ("layoutMode" in node) {
    const axisSizingMode =
      node.layoutMode === axis ? "primaryAxisSizingMode" : "counterAxisSizingMode";
    node[axisSizingMode] = mode === "hug" ? "AUTO" : "FIXED";
  }
}

function _resizeCounterAxis(
  node: LayoutChild,
  mode: "hug" | "fill",
  axis: "HORIZONTAL" | "VERTICAL" | "NONE"
) {
  node.layoutAlign = mode === "hug" ? "INHERIT" : "STRETCH";
  if ("layoutMode" in node) {
    const axisSizingMode =
      node.layoutMode === axis ? "counterAxisSizingMode" : "primaryAxisSizingMode";
    node[axisSizingMode] = mode === "hug" ? "AUTO" : "FIXED";
  }
}

// TODO: Promise for TEXT
// if fixed width if not auto-layout?
function resizeWidth(
  node: LayoutChild,
  mode: "hug" | "fill",
  axis: "HORIZONTAL" | "VERTICAL" | "NONE"
) {
  if (axis === "HORIZONTAL") {
    _resizePrimaryAxis(node, mode, axis);
  } else if (axis === "VERTICAL") {
    _resizeCounterAxis(node, mode, axis);
  } else {
  }
}

function resizeHeight(
  node: LayoutChild,
  mode: "hug" | "fill",
  axis: "HORIZONTAL" | "VERTICAL" | "NONE"
) {
  if (axis === "HORIZONTAL") {
    _resizeCounterAxis(node, mode, axis);
  } else if (axis === "VERTICAL") {
    _resizePrimaryAxis(node, mode, axis);
  } else {
  }
}

console.clear();

// figma.on("run", async ({ command }) => {
figma.on("run", ({ command }) => {
  const selection = <LayoutChild[]>figma.currentPage.selection.filter(({ parent }) => {
    return parent && "layoutMode" in parent;
  });

  // TODO: set all the same layout
  // count nodes for their layouts and then decide what to do
  let layoutMode = <"hug" | "fill" | "">figma.currentPage.getPluginData("layoutMode");
  if (!layoutMode.length) {
    layoutMode = "fill";
    figma.currentPage.setPluginData("layoutMode", "fill");
  }

  if (!selection.length) return figma.closePlugin();

  let first = true;
  for (const node of selection) {
    if (first) {
      console.log(node.parent.layoutMode);
      first = false;
    }
    logLayout(node);
    if (command === "width") {
      // await cycleWidth(node, node.parent.layoutMode);
      resizeWidth(node, <Exclude<"hug" | "fill" | "", "">>layoutMode, node.parent.layoutMode);
    } else if (command === "height") {
      resizeHeight(node, <Exclude<"hug" | "fill" | "", "">>layoutMode, node.parent.layoutMode);
    }
    figma.currentPage.setPluginData("layoutMode", layoutMode === "fill" ? "hug" : "fill");
  }
  figma.closePlugin(layoutMode);
});
