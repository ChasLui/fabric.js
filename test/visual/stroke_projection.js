QUnit.module('stroke projection', (hooks) => {
  const tests = [];

  const casesToTest = {
    noMiterAfterMiterLimit2: [
      { x: 0, y: 0 },
      { x: 10, y: 30 },
      { x: 43, y: 0 },
    ],
    acuteAngle: [
      { x: 3, y: -10 },
      { x: 18, y: 16 },
      { x: 123, y: -26 },
    ],
    obtuseAngle: [
      { x: 16, y: -29 },
      { x: 187, y: 50 },
      { x: 123, y: -26 },
    ],
    rightAngle: [
      { x: 0, y: 0 },
      { x: 0, y: -30 },
      { x: 30, y: -30 },
    ],
    straightAngle: [
      { x: 1, y: 1 },
      { x: 6, y: 6 },
      { x: 36, y: 36 },
    ],
    twoPointsClose: [
      { x: 0, y: 0 },
      { x: 2, y: -0.98 },
      { x: 100, y: 0 },
    ],
    convex: [
      { x: 20, y: 4 },
      { x: 20, y: 27 },
      { x: 60, y: 27 },
      { x: 60, y: 4 },
      { x: 40, y: -10 },
    ],
    concave: [
      { x: 23.23027292144134, y: -20.710253258520993 },
      { x: 20, y: 27 },
      { x: 68, y: 37 },
      { x: 90, y: -4 },
      { x: 48, y: 12 },
    ],
    complex: [
      { x: 20, y: 4 },
      { x: 10, y: 27 },
      { x: 60, y: 27 },
      { x: 70, y: 4 },
      { x: 40, y: 37 },
    ],
    star: [
      { x: 0, y: 0 },
      { x: 72, y: 36 },
      { x: 36, y: -18 },
      { x: 0, y: 36 },
      { x: 72, y: 0 },
    ],
    plus: [
      { x: 0, y: 0 },
      { x: 0, y: 20 },
      { x: 20, y: 20 },
      { x: 20, y: 0 },
      { x: 40, y: 0 },
      { x: 40, y: -20 },
      { x: 20, y: -20 },
      { x: 20, y: -40 },
      { x: 0, y: -40 },
      { x: 0, y: -20 },
      { x: -20, y: -20 },
      { x: -20, y: 0 },
    ],
    spikes: [
      { x: 97.39086147549884, y: 204.072360524695 },
      { x: 52, y: 203 },
      { x: 87.75101187636338, y: 196.11948460540825 },
      { x: 32.56287292131242, y: 200.6984131649976 },
      { x: 108.71768475448265, y: 205.27734172458693 },
      { x: 60.03644427884856, y: 191.78155228579726 },
      { x: 76.18319235740043, y: 192.98653348568922 },
      { x: 70.64027883789757, y: 253.23559348028593 },
      { x: 109.92266595437465, y: 237.08884540173398 },
      { x: 26.53796692185277, y: 218.77313116337686 },
      { x: 70.15828635794081, y: 177.08078164711569 },
      { x: 21.236049642328275, y: 242.87275516121528 },
      { x: 97.63185771547685, y: 232.26892060216653 },
      { x: 105.82572987474202, y: 221.18309356316072 },
      { x: 78, y: 242 },
      { x: 98.35484643541207, y: 186.72063124625117 },
      { x: 113.77860579402882, y: 220.46010484322534 },
      { x: 84, y: 251 },
      { x: 42.68471500040471, y: 189.3715898860134 },
      { x: 88, y: 257 },
    ],
  };

  fabric.Object.prototype.noScaleCache = false;

  function renderStrokeTest(canvas, testOptions, polyOptions) {
    const scale = new fabric.Point(2, 3),
      poly = new testOptions.builder(testOptions.points, {
        fill: `rgb(255, 0, 0)`,
        strokeWidth: 10,
        stroke: 'rgb(120, 0, 0)',
        cornerColor: 'white',
        objectCaching: false,
        exactBoundingBox: true,
        ...polyOptions,
      });
    poly.scaleX = scale.x;
    poly.scaleY = scale.y;
    poly.setDimensions();
    const size = poly._getTransformedDimensions(),
      bg = new fabric.Rect({
        width: size.x,
        height: size.y,
        left: poly.left,
        top: poly.top,
        originX: poly.originX,
        originY: poly.originY,
        fill: 'blue',
      });
    canvas.add(bg, poly);
    canvas.setActiveObject(poly);
    canvas.setViewportTransform([canvas.width/size.x*0.9, 0, 0, canvas.height/size.y*0.9, 0, 0]);
    bg.viewportCenter();
    poly.viewportCenter();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
  }

  for (let [caseName, casePoints] of Object.entries(casesToTest)) {
    [fabric.Polyline, fabric.Polygon].forEach((builder) => {
      const builderType = builder.prototype.type,
        isPolygon = builderType === 'polygon',
        strokes = isPolygon
          ? ['miter', 'round', 'bevel']
          : ['butt', 'square', 'round'],
        strokeLineType = isPolygon ? 'strokeLineJoin' : 'strokeLineCap';
      strokes.forEach((strokeLineTypeCase) => {
        [true, false].forEach((strokeUniform) => {
          [
            [0, 30],
            [20, 0],
            [25, 35],
          ].forEach(([skewX, skewY]) => {
            if (strokeLineTypeCase === 'round' && (skewX !== 0) & (skewY !== 0))
              return; // TODO: remove this line when fix strokeLineJoins equals `round` with `skewX`and `skewY` applied at sametime
            tests.push({
              test: `${caseName} of type ${builderType} with ${strokeLineType}=${strokeLineTypeCase}, strokeUniform=${strokeUniform}, skewX=${skewX} and skewY=${skewY} values`,
              code: function (canvas, callback) {
                renderStrokeTest(
                  canvas,
                  {
                    builder,
                    points: casePoints,
                  },
                  {
                    [strokeLineType]: strokeLineTypeCase,
                    strokeUniform,
                    skewX,
                    skewY,
                  }
                );
                callback(canvas.lowerCanvasEl);
              },
              golden: `stroke-projection/${strokeLineType}/${strokeLineTypeCase}/${caseName}-${
                strokeUniform ? 'uniform-' : ''
              }${builderType}-${skewX}skewX-${skewY}skewY.png`,
              percentage: 0.001,
              width: 600,
              height: 900,
              fabricClass: 'Canvas',
            });
          });
        });
      });
    });
  }

  // Test only miter limit
  for (let [caseName, casePoints] of Object.entries(casesToTest)) {
    const builder = fabric.Polygon;
    [5, 20, 120].forEach((strokeMiterLimit) => {
      [true, false].forEach((strokeUniform) => {
        [
          [0, 30],
          [20, 0],
          [25, 35],
        ].forEach(([skewX, skewY]) => {
          tests.push({
            test: `${caseName} with strokeMiterLimit=${strokeMiterLimit}, strokeUniform=${strokeUniform}, skewX=${skewX} and skewY=${skewY} values`,
            code: function (canvas, callback) {
              renderStrokeTest(
                canvas,
                {
                  builder,
                  points: casePoints,
                },
                {
                  strokeLineJoin: 'miter',
                  strokeUniform,
                  strokeMiterLimit,
                }
              );
              callback(canvas.lowerCanvasEl);
            },
            golden: `stroke-projection/strokeLineJoin/miter-limit/${
              strokeUniform ? 'uniform-' : ''
            }${caseName}-${strokeMiterLimit}miterLimit-${skewX}skewX-${skewY}skewY.png`,
            percentage: 0.001,
            width: 600,
            height: 900,
            fabricClass: 'Canvas',
          });
        });
      });
    });
  }

  tests.forEach(visualTestLoop(QUnit));
});
