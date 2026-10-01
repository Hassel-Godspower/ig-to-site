"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "gòke";

const CODE_LINES = [
  "import { Body, Controller, Get, Post, Delete } from '@nestjs/common';",
  "import { Injectable, Logger, Module, NotFoundException } from '@nestjs/common';",
  "import { NestFactory } from '@nestjs/core';",
  "type UserRole = 'admin' | 'editor' | 'viewer';",
  "interface User { id: number; name: string; email: string; role: UserRole; }",
  "@Injectable()",
  "export class UsersService {",
  "  private readonly logger = new Logger(UsersService.name);",
  "  private users: User[] = [];",
  "  private nextId = 1;",
  "  findAll(search?: string): User[] {",
  "    if (!search) return [...this.users];",
  "    return this.users.filter((u) => u.name.toLowerCase().includes(search));",
  "  }",
  "  findOne(id: number): User {",
  "    const user = this.users.find((item) => item.id === id);",
  "    if (!user) throw new NotFoundException(`User ${id} not found`);",
  "    return { ...user };",
  "  }",
  "}",
  "@Controller('users')",
  "export class UsersController {",
  "  constructor(private readonly usersService: UsersService) {}",
  "  @Get() findAll() { return this.usersService.findAll(); }",
  "  @Post() create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }",
  "}",
  "const app = await NestFactory.create(AppModule);",
  "await app.listen(3000);",
  "export default function generateSite(profile) {",
  "  return { html, css, jobId: nanoid() };",
  "}",
];

const CODE_STREAM = CODE_LINES.join("   ┃   ") + "   ┃   ";
const STREAM_LEN = CODE_STREAM.length;
const MIN_DISPLAY_MS = 1800;
const FADE_MS = 500;

type Col = { x: number; scroll: number; start: number };

/**
 * Full-screen preloader: code streams through a "gòke" mask.
 * Dismisses after min time + next frame when ready (or session skip).
 */
export function CodeCascadePreloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    // Skip on client navigations within the same session
    try {
      if (sessionStorage.getItem("goke-preloader-done") === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* private mode */
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols: Col[] = [];
    let fontSize = 16;
    let rowHeight = 20;
    let numRows = 0;
    let last = performance.now();
    const SPEED = 0.0045;
    const start = performance.now();
    let dismissed = false;

    function buildMask(w: number, h: number, glyphSize: number, spacing: number) {
      const strokeW = glyphSize * 0.02;
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
        `<text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' ` +
        `font-family='Arial Black, Arial, Helvetica, sans-serif' font-weight='900' ` +
        `font-size='${glyphSize}' letter-spacing='-${spacing}' ` +
        `fill='white' stroke='white' stroke-width='${strokeW}' stroke-linejoin='round'>${WORD}</text>` +
        `</svg>`;
      const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
      canvas!.style.webkitMaskImage = url;
      canvas!.style.maskImage = url;
      canvas!.style.webkitMaskRepeat = "no-repeat";
      canvas!.style.maskRepeat = "no-repeat";
      canvas!.style.webkitMaskPosition = "center";
      canvas!.style.maskPosition = "center";
      canvas!.style.webkitMaskSize = "100% 100%";
      canvas!.style.maskSize = "100% 100%";
    }

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const glyphSize = Math.min(w * 0.34, 460);
      const spacing = glyphSize * 0.03;
      buildMask(w, h, glyphSize, spacing);

      if (outlineRef.current) {
        outlineRef.current.style.fontSize = glyphSize + "px";
        outlineRef.current.style.letterSpacing = "-" + spacing + "px";
        outlineRef.current.style.webkitTextStroke =
          Math.max(1, glyphSize * 0.004) + "px rgba(255, 255, 255, 0.12)";
      }

      fontSize = Math.max(8, Math.min(w, h) / 100);
      rowHeight = fontSize * 1.15;
      numRows = Math.ceil(h / rowHeight) + 2;
      const colWidth = fontSize * 0.78;
      const numCols = Math.ceil(w / colWidth);
      cols = Array.from({ length: numCols }, (_, i) => ({
        x: i * colWidth,
        scroll: Math.random() * numRows,
        start: Math.floor(Math.random() * STREAM_LEN),
      }));
      ctx!.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx!.textBaseline = "top";
    }

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      try {
        sessionStorage.setItem("goke-preloader-done", "1");
      } catch {
        /* ignore */
      }
      setFading(true);
      window.setTimeout(() => setVisible(false), FADE_MS);
    }

    function frame(now: number) {
      const dt = now - last;
      last = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#ffffff";

      cols.forEach((col) => {
        col.scroll += SPEED * dt;
        for (let r = -1; r <= numRows; r++) {
          const yPos = r * rowHeight - (col.scroll % 1) * rowHeight;
          const rowIndex = Math.floor(col.scroll) + r;
          const charIndex = (((col.start + rowIndex) % STREAM_LEN) + STREAM_LEN) % STREAM_LEN;
          const ch = CODE_STREAM[charIndex];
          if (ch && ch !== " ") {
            ctx!.fillText(ch, col.x, yPos);
          }
        }
      });

      if (now - start >= MIN_DISPLAY_MS && document.readyState === "complete") {
        dismiss();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(frame);

    // Safety: always dismiss after 4s even if load hangs
    const safety = window.setTimeout(dismiss, 4000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.clearTimeout(safety);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`goke-preloader${fading ? " is-fading" : ""}`}
      aria-hidden={fading}
      role="presentation"
    >
      <div className="goke-preloader-outline" ref={outlineRef}>
        gòke
      </div>
      <canvas ref={canvasRef} className="goke-preloader-canvas" />
      <p className="goke-preloader-caption">Scale forward, upward</p>
    </div>
  );
}
