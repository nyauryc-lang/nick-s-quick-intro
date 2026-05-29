// Wrecking ball physics scene. Mounts on a <canvas> within a container.
// Returns a cleanup function.
// @ts-nocheck
export async function mountWreckingBall(
  canvas: HTMLCanvasElement,
  resetBtn?: HTMLButtonElement | null,
) {
  const Matter = await import("matter-js");
  const {
    Engine, World, Bodies, Composite, Composites,
    Constraint, Mouse, MouseConstraint, Events, Runner, Bounds, Vertices
  } = Matter as any;

  const THEME = {
    palette: ["#ff3f70", "#ff7626", "#ffe600", "#33ff66", "#00f0ff", "#4a7dff", "#d645ff"],
    ground: "#1a1a24",
    chain: { shadow: "rgba(0,0,0,0.5)", stroke: "#2a2a2a", inner: "#6a6a72", highlight: "rgba(200,200,210,0.55)" },
  };
  const PHYSICS = {
    brick: { restitution: 0, friction: 1, frictionAir: 0.09, frictionStatic: 10, density: 0.03, slop: 0 },
    ball:  { density: 1.2, friction: 0.6, frictionStatic: 10, frictionAir: 0.005, restitution: 0.04, slop: 0 },
  };
  const GEO = {
    brickWidth: 45, brickHeight: 20, towerCols: 5,
    anchorX: 0.35, anchorY: -50, linkLen: 18,
    floorPadding: 40, floorThickness: 200,
  };

  const container = canvas.parentElement as HTMLElement;
  const state: any = { engine: null, world: null, canvas, ctx: null, mouseConstraint: null, ball: null, chain: null, width: 0, height: 0 };

  const dist = (p1: any, p2: any) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const withCtx = (ctx: any, fn: any) => { ctx.save(); fn(); ctx.restore(); };
  const getRelativePt = (body: any, offset: any) =>
    body ? { x: body.position.x + offset.x, y: body.position.y + offset.y } : offset;

  const createWall = (x: number, y: number, w: number, h: number, opts: any = {}) =>
    Bodies.rectangle(x, y, w, h, { isStatic: true, ...opts });
  const createBrick = (x: number, y: number, w: number, h: number, row: number) =>
    Bodies.rectangle(x, y, w, h, { ...PHYSICS.brick, label: "brick", renderColor: THEME.palette[row % THEME.palette.length] });
  const createBall = (x: number, y: number, radius: number) =>
    Bodies.circle(x, y, radius, { ...PHYSICS.ball, label: "ball", collisionFilter: { category: 0x0002, mask: 0xffffffff } }, 64);
  const createChain = (x: number, y: number, body: any, length: number) =>
    Constraint.create({ pointA: { x, y }, bodyB: body, stiffness: 1, damping: 0.05, length, render: { visible: true } });

  const buildScene = () => {
    const { width, height } = state;
    const { brickWidth, brickHeight } = GEO;
    const anchorXPos = width * GEO.anchorX;
    const initialChainLength = height * 0.7;
    const ballRadius = Math.min(width * 0.08, 60);
    const floorTop = height - GEO.floorPadding;
    const floorY = floorTop + GEO.floorThickness / 2;
    const ground = createWall(width / 2, floorY, width * 2, GEO.floorThickness, { friction: 1, frictionStatic: 10, renderColor: THEME.ground });
    const bounds = [
      createWall(-50, height / 2, 100, height * 2),
      createWall(width + 50, height / 2, 100, height * 2),
      createWall(width / 2, -150, width * 2, 100),
    ];
    const ball = createBall(anchorXPos, GEO.anchorY + initialChainLength, ballRadius);
    const chain = createChain(anchorXPos, GEO.anchorY, ball, initialChainLength);
    const maxTowerHeight = height * 0.6;
    const towerRows = Math.max(1, Math.floor(maxTowerHeight / brickHeight));
    const towerWidth = GEO.towerCols * brickWidth;
    const towerHeight = towerRows * brickHeight;
    const startX = width * 0.6 - towerWidth / 2 + brickWidth / 2;
    const startY = floorTop - towerHeight + brickHeight / 2;
    const tower = Composites.stack(startX, startY, GEO.towerCols, towerRows, 0, 0, (x: number, y: number, _col: number, row: number) =>
      createBrick(x, y, brickWidth, brickHeight, row),
    );
    World.add(state.world, [ground, ...bounds, ball, chain, tower]);
    Object.assign(state, { ball, chain });
  };

  const attachInteractivity = () => {
    if (!state.mouseConstraint) {
      state.mouseConstraint = MouseConstraint.create(state.engine, {
        mouse: Mouse.create(state.canvas),
        collisionFilter: { mask: 0x0002 },
        constraint: { stiffness: 0.9, angularStiffness: 0.9, render: { visible: false } },
      });
      Events.on(state.engine, "beforeUpdate", () => {
        const body = state.mouseConstraint.body;
        if (body?.label !== "ball") return;
        const anchorXPos = state.width * GEO.anchorX;
        const dragDist = dist({ x: anchorXPos, y: GEO.anchorY }, body.position);
        const maxLen = state.height - GEO.floorPadding - GEO.anchorY - body.circleRadius - 15;
        state.chain.length = Math.min(dragDist, maxLen);
        state.chain.pointA = { x: anchorXPos, y: GEO.anchorY };
      });
    }
    World.add(state.world, state.mouseConstraint);
  };

  let runner: any;
  const init = () => {
    const ctx = canvas.getContext("2d", { alpha: true })!;
    if (!state.engine) {
      state.engine = Engine.create({ enableSleeping: false, positionIterations: 12, velocityIterations: 6, constraintIterations: 8 });
      state.world = state.engine.world;
      runner = Runner.create();
      Runner.run(runner, state.engine);
    }
    state.width = canvas.width = container.clientWidth;
    state.height = canvas.height = container.clientHeight;
    state.ctx = ctx;
    Engine.clear(state.engine);
    World.clear(state.world);
    state.engine.gravity.y = 1.2;
    buildScene();
    attachInteractivity();
  };

  const getCursorState = () => {
    if (state.mouseConstraint.body) return "grabbing";
    const pos = state.mouseConstraint.mouse.position;
    const isHover = pos && Bounds.contains(state.ball.bounds, pos) && Vertices.contains(state.ball.vertices, pos);
    return isHover ? "grab" : "default";
  };

  const drawLink = (ctx: any, isEven: boolean) => {
    const radiusY = isEven ? 1 : 3.5;
    const drawEllipse = (yOffset: number, stroke: string, lineWidth: number) => {
      ctx.beginPath();
      ctx.ellipse(0, yOffset, 8, radiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke();
    };
    drawEllipse(1.5, THEME.chain.shadow, 5);
    drawEllipse(0, THEME.chain.stroke, 5);
    drawEllipse(0, THEME.chain.inner, 3);
    withCtx(ctx, () => {
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, radiusY, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = THEME.chain.highlight; ctx.lineWidth = 1.5; ctx.stroke();
    });
  };

  const drawChains = () => {
    const constraints = Composite.allConstraints(state.world).filter((c: any) => c.render.visible);
    constraints.forEach((c: any) => {
      const p1 = getRelativePt(c.bodyA, c.pointA);
      const p2 = getRelativePt(c.bodyB, c.pointB ?? { x: 0, y: 0 });
      const length = dist(p1, p2);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const linksCount = Math.max(1, Math.round(length / GEO.linkLen));
      const step = length / linksCount;
      withCtx(state.ctx, () => {
        state.ctx.translate(p1.x, p1.y); state.ctx.rotate(angle);
        [0, 1].forEach((offset) => {
          for (let i = offset; i < linksCount; i += 2) {
            withCtx(state.ctx, () => {
              state.ctx.translate((i + 0.5) * step, 0);
              drawLink(state.ctx, i % 2 === 0);
            });
          }
        });
      });
    });
  };

  const drawBall = (body: any) => {
    withCtx(state.ctx, () => {
      state.ctx.translate(body.position.x, body.position.y);
      state.ctx.rotate(body.angle);
      state.ctx.beginPath();
      body.vertices.forEach((v: any, i: number) => state.ctx[i ? "lineTo" : "moveTo"](v.x - body.position.x, v.y - body.position.y));
      state.ctx.closePath();
      const radius = body.circleRadius;
      const gradient = state.ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
      gradient.addColorStop(0, "#999"); gradient.addColorStop(0.5, "#333"); gradient.addColorStop(1, "#0a0a0a");
      state.ctx.fillStyle = gradient; state.ctx.fill();
    });
  };

  const drawPolygon = (body: any) => {
    withCtx(state.ctx, () => {
      state.ctx.beginPath();
      body.vertices.forEach((v: any, i: number) => state.ctx[i ? "lineTo" : "moveTo"](v.x, v.y));
      state.ctx.closePath();
      state.ctx.fillStyle = body.renderColor; state.ctx.fill();
      if (body.label === "brick") {
        state.ctx.clip();
        state.ctx.strokeStyle = "rgba(0,0,0,0.4)"; state.ctx.lineWidth = 4; state.ctx.stroke();
        state.ctx.strokeStyle = "rgba(255,255,255,0.3)"; state.ctx.lineWidth = 2; state.ctx.stroke();
      }
    });
  };

  const drawInteractionLine = () => {
    const { mouse, body, pointA } = state.mouseConstraint;
    if (!body || mouse.button !== 0) return;
    withCtx(state.ctx, () => {
      state.ctx.beginPath();
      state.ctx.moveTo(mouse.position.x, mouse.position.y);
      state.ctx.lineTo(body.position.x + (pointA?.x || 0), body.position.y + (pointA?.y || 0));
      state.ctx.strokeStyle = "rgba(255,255,255,0.8)"; state.ctx.lineWidth = 2; state.ctx.setLineDash([5, 5]); state.ctx.stroke();
    });
  };

  let rafId = 0;
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    rafId = requestAnimationFrame(tick);
    state.ctx.clearRect(0, 0, state.width, state.height);
    canvas.style.cursor = getCursorState();
    drawChains();
    Composite.allBodies(state.world).forEach((body: any) =>
      body.label === "ball" ? drawBall(body) : body.renderColor && drawPolygon(body),
    );
    drawInteractionLine();
  };

  const onResize = () => init();
  const onReset = () => init();
  window.addEventListener("resize", onResize);
  resetBtn?.addEventListener("click", onReset);

  init();
  rafId = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    resetBtn?.removeEventListener("click", onReset);
    if (runner) Runner.stop(runner);
    if (state.engine) Engine.clear(state.engine);
    if (state.world) World.clear(state.world, false);
  };
}
