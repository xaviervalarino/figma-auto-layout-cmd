type AutoLayoutChild = LayoutChild extends infer U ? (U extends BaseFrameMixin ? U : never) : never;

class AutoLayoutNode {
  node: AutoLayoutChild;
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

  #getDimension(dimension: "HORIZONTAL" | "VERTICAL") {
    return this.node.parent.layoutMode === dimension
      ? this.#primaryAxisMode
      : this.#counterAxisMode;
  }

  #setDimension(dimension: "HORIZONTAL" | "VERTICAL", mode: LayoutMode) {
    if (this.node.parent.layoutMode === dimension) {
      this.#primaryAxisMode = mode;
    } else {
      this.#counterAxisMode = mode;
    }
  }

  get width() {
    return this.#getDimension("HORIZONTAL");
  }

  set width(mode: LayoutMode) {
    this.#setDimension("HORIZONTAL", mode);
  }

  get height() {
    return this.#getDimension("VERTICAL");
  }

  set height(mode: LayoutMode) {
    this.#setDimension("VERTICAL", mode);
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

type EverythingElseChild = Exclude<LayoutChild, TextFrameChild | AutoLayoutChild>;

class EverythingElseNode {
  node: EverythingElseChild;
  constructor(node: EverythingElseChild) {
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

export default class AutoLayoutSizing {
  node: AutoLayoutNode | TextFrameNode | EverythingElseNode;
  constructor(node: LayoutChild) {
    if ("layoutMode" in node) {
      this.node = new AutoLayoutNode(node);
    } else if (node.type === "TEXT") {
      this.node = new TextFrameNode(node);
    } else {
      this.node = new EverythingElseNode(node);
    }
  }

  get width() {
    return <"hug" | "fill" | "fixed">this.node.width;
  }

  set width(mode: LayoutMode) {
    this.node.width = mode;
  }

  get height() {
    return <"hug" | "fill" | "fixed">this.node.height;
  }

  set height(mode: LayoutMode) {
    this.node.height = mode;
  }
}
