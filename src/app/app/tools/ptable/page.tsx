"use client";

import { cn } from "@/lib/utils";
import { elements } from "./elements.json";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const categoryColors = {
  "diatomic nonmetal": "bg-green-100 dark:bg-green-900",
  "noble gas": "bg-blue-100 dark:bg-blue-900",
  "alkali metal": "bg-yellow-100 dark:bg-yellow-900",
  "alkaline earth metal": "bg-yellow-200 dark:bg-yellow-800",
  "metalloid": "bg-purple-100 dark:bg-purple-900",
  "polyatomic nonmetal": "bg-green-200 dark:bg-green-800",
  "post-transition metal": "bg-red-100 dark:bg-red-900",
  "transition metal": "bg-red-200 dark:bg-red-800",
  "lanthanide": "bg-pink-100 dark:bg-pink-900",
  "actinide": "bg-pink-200 dark:bg-pink-800",
  "unknown, probably transition metal": "bg-red-300 dark:bg-red-700",
  "unknown, probably post-transition metal": "bg-red-400 dark:bg-red-600",
  "unknown, probably metalloid": "bg-purple-200 dark:bg-purple-800",
  "unknown, predicted to be noble gas": "bg-blue-200 dark:bg-blue-800",
  "unknown, but predicted to be an alkali metal": "bg-yellow-300 dark:bg-yellow-700",
} as Record<string, string>;

export default function PTable() {
  const [wide, setWide] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="w-screen">
      <div className="pt-4 flex items-center gap-2 px-16">
        <h1 className="h1">Periodic Table</h1>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="ml-auto w-[40ch]" />
        <Tabs value={wide ? "wide" : "trunc"} onClick={() => setWide(!wide)} className="w-auto">
          <TabsList>
            <TabsTrigger value="trunc">Truncated</TabsTrigger>
            <TabsTrigger value="wide">Wide</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid gap-2 p-16 mx-auto max-w-min overflow-auto">
        {elements.map((el) => {
          const matches = search.length == 0 || el.name.toLowerCase().includes(search.toLowerCase()) || el.symbol.toLowerCase().includes(search.toLowerCase()) || el.number.toString() == search || el.category.toLowerCase().includes(search.toLowerCase());
          return (
            <HoverCard key={el.number}>
              <HoverCardTrigger asChild>
                <div style={{ gridRow: wide ? el.wypos : el.ypos, gridColumn: wide ? el.wxpos : el.xpos }}>
                  <div className={cn("relative p-2 rounded-sm w-16 h-16 transition-opacity", categoryColors[el.category], !matches && "opacity-10")}>
                    <div className="text-xs absolute right-1 top-1">{el.number}</div>
                    <div className="text-lg font-bold">{el.symbol}</div>
                    <div className="text-[.5rem] truncate">{el.name}</div>
                    <div className="text-[.5rem]">{el.atomic_mass.toFixed(2)}</div>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="border-0 p-0 w-96">
                <ElementInfo el={el} />
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </div>
    </div>
  );
}

function ElementInfo({ el }: { el: typeof elements[0] }) {
  return (
    <div className="overflow-hidden relative rounded">
      <div className={cn("absolute inset-0 opacity-30 z-0 pointer-events-none", categoryColors[el.category])} />
      <div className="p-2">
        <div className={cn("w-full rounded h-16 mb-0 flex justify-start items-end", categoryColors[el.category])}>
          <div className="pl-24 flex flex-col">
            <div className="text-2xl font-bold -my-1">{el.symbol}</div>
            <div className="text-sm">{el.name}</div>
          </div>
        </div>
      </div>
      <div className="rounded-tr-lg bg-background w-24 h-16 flex items-center justify-center -mt-16">
        <ElementRenderer el={el} />
      </div>
      <div className="px-2">
        <img src={el.image.url} alt={el.name} className="w-full h-24 object-cover rounded" />
      </div>
      <p className="p-2 text-xs mt-0">
        {el.summary}
      </p>
      <div className="absolute top-3 right-4">{el.number}</div>
      <table className="w-full text-left mt-4 table rounded-none">
        <tbody>
          <tr>
            <th className="pr-4">Atomic Mass</th>
            <td className="text-right">{el.atomic_mass}</td>
          </tr>
          <tr>
            <th className="pr-4">Category</th>
            <td className="text-right">{el.category}</td>
          </tr>
          <tr>
            <th className="pr-4">Phase</th>
            <td className="text-right">{el.phase}</td>
          </tr>
          <tr>
            <th className="pr-4">Density</th>
            <td className="text-right">{el.density}</td>
          </tr>
          <tr>
            <th className="pr-4">Melting Point</th>
            <td className="text-right">{el.melt}</td>
          </tr>
          <tr>
            <th className="pr-4">Boiling Point</th>
            <td className="text-right">{el.boil}</td>
          </tr>
          <tr>
            <th className="pr-4">Discovered</th>
            <td className="text-right">{el.discovered_by}</td>
          </tr>
        </tbody>
      </table>
      <Button variant="link" href={el.source} target="_blank">
        Source <ExternalLink />
      </Button>
    </div>
  );
}

function ElementRenderer({ el }: { el: typeof elements[0] }) {
  const renderEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!el.bohr_model_3d) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 0.5;
    camera.position.y = -0.1;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    if (renderEl.current) {
      renderEl.current.innerHTML = "";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderEl.current.appendChild(renderer.domElement);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 5);
    scene.add(light);

    const loader = new GLTFLoader();
    console.log("loading");

    loader.load(el.bohr_model_3d, function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.rotation.x = Math.PI / 4;
      function animate() {
        gltf.scene.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      renderer.setAnimationLoop(animate);
      renderer.render(scene, camera);
    }, undefined, function (error) {
      console.error(error);
    });
  }, []);

  return (<div ref={renderEl} className="w-16 aspect-square" />);
}