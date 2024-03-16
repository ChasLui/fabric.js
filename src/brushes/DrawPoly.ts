import { Point } from '../Point';
import { Polygon } from '../shapes/Polygon';
import { Polyline } from '../shapes/Polyline';
import { DrawShapeBase } from './DrawShapeBase';

export class DrawPoly extends DrawShapeBase<Polyline> {
  builder = Polygon;

  private addPoint(pointer: Point) {
    this.shape!.points.push(pointer);
  }

  private replacePoint(pointer: Point) {
    this.shape!.points.pop();
    this.addPoint(pointer);
    this.render();
  }

  create() {
    return new this.builder();
  }

  protected finalizeShape() {
    const shape = super.finalizeShape();
    if (shape) {
      shape.setBoundingBox(true);
      const r = this.width / 2;
      shape.set({
        left: shape.left + r,
        top: shape.top + r,
      });
    }
    return shape;
  }

  onMouseDown(pointer: Point, ev: TBrushEventData) {
    super.onMouseDown(pointer, ev);
    if (this.shape) {
      this.addPoint(pointer);
    } else {
      this.build();
      this.addPoint(pointer);
      this.addPoint(pointer);
    }
  }

  onMouseMove(pointer: Point) {
    this.replacePoint(pointer);
  }

  onMouseUp({ pointer }: { pointer: Point }) {
    this.replacePoint(pointer);
    this.addPoint(pointer);
    return true;
  }

  onDoubleClick(pointer: Point) {
    this.shape && this.replacePoint(pointer);
    this.finalize();
  }
}
