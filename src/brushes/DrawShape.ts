import { fabric } from '../../HEADER';
import { ModifierKey } from '../EventTypeDefs';
import { Point } from '../point.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { Rect } from '../shapes/rect.class';
import { TBrushEventData } from './base_brush.class';
import { DrawShapeBase } from './DrawShapeBase';

export class DrawShape<
  T extends typeof FabricObject<any> = typeof Rect
> extends DrawShapeBase<InstanceType<T>> {
  /**
   * class to build shape from
   */
  builder: T = Rect as unknown as T;

  /**
   * set to `true` for the shape to be centered on mouse/touch down
   */
  centered = false;

  /**
   * The event modifier key that makes the brush symmetric.
   */
  modifierKey?: ModifierKey = 'shiftKey';

  /**
   * set to `true` for the shape to be symmetric
   */
  symmetric?: boolean;

  protected start: Point;

  create() {
    return new this.builder() as InstanceType<T>;
  }

  protected setBounds(a: Point, b: Point) {
    const v = b.subtract(a);
    const shape = this.shape!;
    const d = new Point(Math.abs(v.x), Math.abs(v.y));
    // size
    if (this.symmetric) {
      const side =
        (d.distanceFrom(new Point()) / Math.SQRT2) * (this.centered ? 2 : 1);
      shape.set({ width: side, height: side });
    } else {
      shape.set({ width: d.x, height: d.y });
    }
    // position
    if (this.centered) {
      shape.setPositionByOrigin(a, 0.5, 0.5);
    } else {
      // keep a in place
      shape.setPositionByOrigin(
        a,
        -Math.sign(v.x) * 0.5 + 0.5,
        -Math.sign(v.y) * 0.5 + 0.5
      );
    }
  }

  onMouseDown(pointer: Point) {
    this.build();
    this.start = pointer;
  }

  onMouseMove(pointer: Point, ev: TBrushEventData) {
    this.symmetric = this.modifierKey && ev.e[this.modifierKey];
    this.setBounds(this.start, pointer);
    this._render();
  }

  onMouseUp(ev: TBrushEventData) {
    this.setBounds(this.start, ev.pointer);
    this.finalize();
  }
}

fabric.DrawShape = DrawShape;
