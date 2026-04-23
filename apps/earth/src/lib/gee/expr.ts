/**
 * Minimal helpers to build Earth Engine "serialized expression" JSON
 * for the REST `value:compute` endpoint. This avoids pulling in the
 * heavyweight `@google/earthengine` Node client.
 *
 * An Expression looks like:
 *   { values: { "0": <ValueNode> }, result: "0" }
 *
 * A ValueNode is one of:
 *   - { constantValue: <JSON> }
 *   - { functionInvocationValue: { functionName, arguments: { ... } } }
 *
 * Each argument is itself a ValueNode.
 */

export type ValueNode =
  | { constantValue: unknown }
  | {
      functionInvocationValue: {
        functionName: string;
        arguments: Record<string, ValueNode>;
      };
    };

export function v(constantValue: unknown): ValueNode {
  return { constantValue };
}

export function fn(
  functionName: string,
  args: Record<string, ValueNode>,
): ValueNode {
  return { functionInvocationValue: { functionName, arguments: args } };
}

export function expression(root: ValueNode) {
  return { values: { "0": root }, result: "0" };
}

// ------- Common EE function wrappers -------

export function point(lng: number, lat: number): ValueNode {
  return fn("GeometryConstructors.Point", { coordinates: v([lng, lat]) });
}

export function buffer(geometry: ValueNode, distanceMeters: number): ValueNode {
  return fn("Geometry.buffer", {
    geometry,
    distance: v(distanceMeters),
  });
}

export function loadImage(id: string): ValueNode {
  return fn("Image.load", { id: v(id) });
}

export function selectBands(image: ValueNode, bands: string[]): ValueNode {
  return fn("Image.select", { input: image, bandSelectors: v(bands) });
}

export function updateMask(image: ValueNode, mask: ValueNode): ValueNode {
  return fn("Image.updateMask", { image, mask });
}

export function reduceRegion(args: {
  image: ValueNode;
  reducer: ValueNode;
  geometry: ValueNode;
  scale: number;
  maxPixels?: number;
}): ValueNode {
  return fn("Image.reduceRegion", {
    image: args.image,
    reducer: args.reducer,
    geometry: args.geometry,
    scale: v(args.scale),
    maxPixels: v(args.maxPixels ?? 1e9),
  });
}

export const Reducer = {
  sum: () => fn("Reducer.sum", {}),
  frequencyHistogram: () => fn("Reducer.frequencyHistogram", {}),
};
