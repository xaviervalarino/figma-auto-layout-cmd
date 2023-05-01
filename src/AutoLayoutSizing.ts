export class BaseLayoutSizer implements LayoutSizer {
  node;
  #width;
  #height;
  constructor(node: LayoutChild) {
    this.node = node;
    const prevWidth = node.getPluginData("width");
    const prevHeight = node.getPluginData("height");
    if (this.horizontal === "fixed" || !prevWidth.length) {
      node.setPluginData("width", node.width.toString());
      this.#width = node.width;
    } else {
      this.#width = +prevWidth;
    }
    if (this.vertical === "fixed" || !prevHeight.length) {
      node.setPluginData("height", node.height.toString());
      this.#height = node.height;
    } else {
      this.#height = +prevHeight;
    }
  }

  get horizontal() {
    if (this.node.parent.layoutMode === "HORIZONTAL") {
      return this.node.layoutGrow ? "fill" : "fixed";
    } else {
      return this.node.layoutAlign === "STRETCH" ? "fill" : "fixed";
    }
  }

  get vertical() {
    if (this.node.parent.layoutMode === "VERTICAL") {
      return this.node.layoutGrow ? "fill" : "fixed";
    } else {
      return this.node.layoutAlign === "STRETCH" ? "fill" : "fixed";
    }
  }

  set horizontal(mode: LayoutMode) {
    if (this.node.parent.layoutMode === "HORIZONTAL") {
      this.node.layoutGrow = mode === "fill" ? 1 : 0;
    } else {
      this.node.layoutAlign = mode === "fill" ? "STRETCH" : "INHERIT";
    }
    if (mode === "fixed") {
      this.node.resize(this.#width, this.node.height);
    }
  }

  set vertical(mode: LayoutMode) {
    if (this.node.parent.layoutMode === "VERTICAL") {
      this.node.layoutGrow = mode === "fill" ? 1 : 0;
    } else {
      this.node.layoutAlign = mode === "fill" ? "STRETCH" : "INHERIT";
    }
    if (mode === "fixed") {
      this.node.resize(this.node.width, this.#height);
    }
  }
}

export class AutoLayoutSizer implements LayoutSizer {
  node: AutoLayoutChild;
  // primary and counter axis as it relates to the parent node
  #primarySizingAxis: "primaryAxisSizingMode" | "counterAxisSizingMode";
  #counterSizingAxis: "primaryAxisSizingMode" | "counterAxisSizingMode";
  constructor(node: AutoLayoutChild) {
    this.node = node;
    const matchingLayout = node.layoutMode === node.parent.layoutMode;
    this.#primarySizingAxis = matchingLayout ? "primaryAxisSizingMode" : "counterAxisSizingMode";
    this.#counterSizingAxis = matchingLayout ? "counterAxisSizingMode" : "primaryAxisSizingMode";
  }

  get #primaryAxisMode() {
    const childSizingAxis = this.node[this.#primarySizingAxis];
    if (this.node.layoutGrow === 0 && childSizingAxis === "AUTO") {
      return "hug";
    }
    if (this.node.layoutGrow === 1 && childSizingAxis === "FIXED") {
      return "fill";
    }
    return "fixed";
  }

  set #primaryAxisMode(mode: LayoutMode) {
    const childSizingAxis = this.#primarySizingAxis;
    this.node.layoutGrow = mode === "fill" ? 1 : 0;
    this.node[childSizingAxis] = mode === "hug" ? "AUTO" : "FIXED";
  }

  get #counterAxisMode() {
    const childSizingAxis = this.node[this.#counterSizingAxis];
    if (this.node.layoutAlign === "INHERIT" && childSizingAxis === "AUTO") {
      return "hug";
    }
    if (this.node.layoutAlign === "STRETCH" && childSizingAxis === "FIXED") {
      return "fill";
    }
    return "fixed";
  }

  set #counterAxisMode(mode: LayoutMode) {
    const childSizingAxis = this.#counterSizingAxis;
    this.node.layoutAlign = mode === "fill" ? "STRETCH" : "INHERIT";
    this.node[childSizingAxis] = mode === "hug" ? "AUTO" : "FIXED";
  }

  get horizontal() {
    return this.node.parent.layoutMode === "HORIZONTAL"
      ? this.#primaryAxisMode
      : this.#counterAxisMode;
  }

  get vertical() {
    return this.node.parent.layoutMode === "VERTICAL"
      ? this.#primaryAxisMode
      : this.#counterAxisMode;
  }

  set horizontal(mode: LayoutMode) {
    if (this.node.parent.layoutMode === "HORIZONTAL") {
      this.#primaryAxisMode = mode;
    } else {
      this.#counterAxisMode = mode;
    }
  }
  set vertical(mode: LayoutMode) {
    if (this.node.parent.layoutMode === "VERTICAL") {
      this.#primaryAxisMode = mode;
    } else {
      this.#counterAxisMode = mode;
    }
  }
}

type TextFrameChild = Extract<LayoutChild, TextNode>;

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

class TextFrameNode {
  node: TextFrameChild;
  constructor(node: TextFrameChild) {
    this.node = node;
  }

  get width() {
    return "unimplemented";
  }

  set width(mode: LayoutMode) {
    console.log("unimplemented");
  }

  get height() {
    return "unimplemented";
  }

  set height(mode: LayoutMode) {
    console.log("unimplemented");
  }
}
