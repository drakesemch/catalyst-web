"use client";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { InlineMath } from "react-katex";
import { type BoxedExpression, ComputeEngine } from "@cortex-js/compute-engine";
import { Input } from "@/components/ui/input";
import Fraction from 'fraction.js';
import { ArrowDown, ArrowUp, ChartLine, MoreVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import functionPlot from 'function-plot';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";


type PrecisionMode = "exact" | "approx";
type FractionMode = "mixed" | "improper";
type TrigEvalMode = "deg" | "rad";

export default function CalculatorPage() {
  const [expressions, setExpressions] = useState<string[]>([""]);
  const [precisionModes, setPrecisionModes] = useState<PrecisionMode[]>(["exact"]);
  const [fractionsModes, setFractionsModes] = useState<FractionMode[]>(["improper"]);
  const [defaultPrecisionMode, setDefaultPrecisionMode] = useState<PrecisionMode>("exact");
  const [defaultFractionsMode, setDefaultFractionsMode] = useState<FractionMode>("improper");
  const [trigEvalMode, setTrigEvalMode] = useState<TrigEvalMode>("deg");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    let ce: ComputeEngine | undefined = new ComputeEngine();
    const newExpressions = expressions;
    if (expressions[expressions.length - 1] != "") {
      newExpressions.push("");
      precisionModes.push(defaultPrecisionMode);
      fractionsModes.push(defaultFractionsMode);
    }
    if (JSON.stringify(newExpressions) != JSON.stringify(expressions)) {
      setExpressions(newExpressions);
      setResults([]);
      setPrecisionModes((prev) => {
        const newModes = prev.filter((_, index) => expressions[index]! != "");
        newModes.push("exact");
        return newModes;
      });
      setFractionsModes((prev) => {
        const newModes = prev.filter((_, index) => expressions[index]! != "");
        newModes.push("improper");
        return newModes;
      });
    }
    setTimeout(() => {
      expressions.forEach((expression, index) => {
        const actualExpression = expression;
        const degreeRegex = /(\b(sin|cos|tan|asin|acos|atan)\()\s*([0-9A-Za-z.]+)\s*(\))/g;

        function convertDegreesToRadians(expression: string): string {
          return expression.replace(degreeRegex, (_match, pLeft: string, _fn: string, pCalc: string, pRight: string) => {
            return `${pLeft}${pCalc}*(\\pi/180)${pRight}`;
          });
        }

        if (trigEvalMode === 'deg') {
          expression = convertDegreesToRadians(expression);
        }

        const precisionMode = precisionModes[index];
        const fractionMode = fractionsModes[index];

        if (expression.includes("=")) {
          const [lhs, rhs] = expression.split("=");
          if (lhs && rhs) {
            try {
              let result = ce!.parse(rhs).evaluate();
              const isFunction = /^[a-zA-Z]+\([a-zA-Z]+\)$/.test(lhs);
              ce!.assign(lhs, isFunction ? ["Function", result.toMathJson()] : result);
              if (precisionMode === "approx") {
                result = ce!.parse(actualExpression.split("=")[1]!).N();
              } else {
                result = ce!.parse(actualExpression.split("=")[1]!).evaluate();
              }
              if (fractionMode == "mixed") {
                try {
                  const mixed = new Fraction((result.toMathJson() as unknown as number[])[1]!, (result.toMathJson() as unknown as number[])[2]!).toFraction(true);
                  result = { latex: mixed } as BoxedExpression;
                } catch (err) {
                  console.warn(err);
                }
              }
              setResults((prev) => {
                const newResults = [...prev];
                newResults[index] = result.latex;
                return newResults;
              });
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          try {
            let result: BoxedExpression;
            switch (precisionMode) {
              default:
              case "exact":
                result = ce!.parse(expression).evaluate();
                if (fractionMode === "mixed") {
                  try {
                    const replacements: Record<string, string> = {};
                    function replaceFraction(result: string | string[]): string | string[] {
                      if (result[0] === "Rational") {
                        result = result as string[];
                        replacements[`${result[1]!}/${result[2]!}`] = new Fraction(Number(result[1])).div(Number(result[2])).toFraction(true);
                      }
                      for (let i = 1; i < result.length; i++) {
                        if (Array.isArray(result[i])) {
                          replaceFraction(result[i]!);
                        }
                      }
                      return result;
                    }
                    replaceFraction(result.toMathJson() as unknown as string[]);
                    const mixed = result.toString().replace(/(\d+)\/(\d+)/g, (match) => replacements[match] ?? match);
                    result = { toString: () => mixed } as BoxedExpression;
                  } catch (err) {
                    console.warn(err);
                  }
                }
                break;
              case "approx":
                result = ce!.parse(expression).N();
                break;
            }
            setResults((prev) => {
              const newResults = [...prev];
              newResults[index] = result.toString();
              return newResults;
            });
          } catch (e) {
            console.error(e);
          }
        }
      });
      ce = undefined;
    });
  }, [expressions, precisionModes, fractionsModes, trigEvalMode, defaultPrecisionMode, defaultFractionsMode]);

  return (
    <>
      <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="h1">Calculator</h1>
          <Tabs value={trigEvalMode} onClick={() => setTrigEvalMode(trigEvalMode == "deg" ? "rad" : "deg")} className="w-max origin-right scale-75">
            <TabsList>
              <TabsTrigger value="deg">DEG</TabsTrigger>
              <TabsTrigger value="rad">RAD</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-1 gap-2 h-full">
          {expressions.map((expression, idx) => {
            return (
              <Expression
                precisionModes={precisionModes}
                fractionsModes={fractionsModes}
                key={`expr-${idx}`}
                expression={expression}
                idx={idx}
                setExpressions={setExpressions}
                setPrecisionModes={setPrecisionModes}
                setFractionsModes={setFractionsModes}
                result={results[idx] ?? ""}
                setDefaultFractionsMode={setDefaultFractionsMode}
                setDefaultPrecisionMode={setDefaultPrecisionMode}
                isLast={idx === expressions.length - 1}
              />
            )
          })}
        </div>
      </main>
    </>
  );
}

function Expression({
  expression,
  setExpressions,
  precisionModes,
  setPrecisionModes,
  fractionsModes,
  setFractionsModes,
  result,
  idx,
  setDefaultPrecisionMode,
  setDefaultFractionsMode,
  isLast,
}: {
  expression: string;
  setExpressions: Dispatch<SetStateAction<string[]>>;
  precisionModes: PrecisionMode[];
  setPrecisionModes: Dispatch<SetStateAction<PrecisionMode[]>>;
  fractionsModes: FractionMode[];
  setFractionsModes: Dispatch<SetStateAction<FractionMode[]>>;
  result: string;
  idx: number;
  setDefaultPrecisionMode: Dispatch<SetStateAction<PrecisionMode>>;
  setDefaultFractionsMode: Dispatch<SetStateAction<FractionMode>>;
  isLast: boolean;
}) {
  const [value, setValue] = useState(expression);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(expression);
  }, [expression]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setValue(newValue);
    if (newValue == "") {
      setExpressions((prev) => {
        const newExpressions = [...prev];
        newExpressions.splice(idx, 1);
        return newExpressions;
      });
      return;
    }
    setExpressions((prev) => {
      const newExpressions = [...prev];
      newExpressions[idx] = newValue;
      return newExpressions;
    });
  };

  const setPrecisionMode = () => {
    setPrecisionModes((prev) => {
      const newModes = [...prev];
      newModes[idx] = prev[idx] == "exact" ? "approx" : "exact";
      return newModes;
    });
    if (isLast) {
      setDefaultPrecisionMode((prev) => prev == "exact" ? "approx" : "exact");
    }
  };

  const setFractionMode = () => {
    setFractionsModes((prev) => {
      const newModes = [...prev];
      newModes[idx] = prev[idx] == "improper" ? "mixed" : "improper";
      return newModes;
    });
    if (isLast) {
      setDefaultFractionsMode((prev) => prev == "improper" ? "mixed" : "improper");
    }
  };

  const exact = precisionModes[idx] === "exact";
  const approx = precisionModes[idx] === "approx";
  const mixed = fractionsModes[idx] === "mixed";
  const improper = fractionsModes[idx] === "improper";
  result = result == '"Nothing"' ? "" : result.replace(/(?<!\\)pi/g, "\\pi")
    .replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}")
    .replace(/(\w+)\^\(-(\d+)\)/g, "$1^{-$2}")
    .replace(/\*/g, "")
    .replace(/root\((\d+)\)\((\d+)\)/g, (_, base, radicand) => `\\sqrt[${base}]{${radicand}}`)
    .replace(/sqrt\((\d+)\)/g, "\\sqrt{$1}");

  useEffect(() => {
    setTimeout(() => {
      functionPlot({
        target: `#chart-${idx}`,
        width: 200,
        height: 200,
        grid: true,
        xDomain: [-10, 10],
        yDomain: [-10, 10],
        data: [{
          fn: value.split("=").at(-1)?.replaceAll("\\", "").replaceAll("pi", Math.PI.toString())
            .replace(/log_{(\d+)}\(([^)]+)\)/g, (_, base, arg) => `log(${arg})/log(${base})`) ?? "",
          color: 'blue',
        }]
      })
    })
  }, [value, idx, open]);

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => {
            setExpressions((prev) => {
              if (idx === 0) return prev;
              const newExpressions = [...prev];
              newExpressions[idx - 1] = newExpressions[idx - 1]!;
              newExpressions[idx] = newExpressions[idx]!;
              [newExpressions[idx - 1], newExpressions[idx]] = [newExpressions[idx], newExpressions[idx - 1]!];
              return newExpressions;
            });
            setPrecisionModes((prev) => {
              if (idx === 0) return prev;
              const newModes = [...prev];
              [newModes[idx - 1], newModes[idx]] = [newModes[idx]!, newModes[idx - 1]!];
              [newModes[idx - 1], newModes[idx]] = [newModes[idx], newModes[idx - 1]!];
              return newModes;
            });
            setFractionsModes((prev) => {
              if (idx === 0) return prev;
              const newModes = [...prev];
              [newModes[idx - 1], newModes[idx]] = [newModes[idx]!, newModes[idx - 1]!];
              [newModes[idx - 1], newModes[idx]] = [newModes[idx], newModes[idx - 1]!];
              return newModes;
            });
          }}><ArrowUp /> Move Up</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setExpressions((prev) => {
              if (idx === prev.length - 1) return prev;
              const newExpressions = [...prev];
              newExpressions[idx + 1] = newExpressions[idx + 1]!;
              newExpressions[idx] = newExpressions[idx]!;
              [newExpressions[idx + 1], newExpressions[idx]] = [newExpressions[idx], newExpressions[idx + 1]!];
              return newExpressions;
            });
            setPrecisionModes((prev) => {
              if (idx === prev.length - 1) return prev;
              const newModes = [...prev];
              newModes[idx + 1] = newModes[idx + 1]!;
              newModes[idx] = newModes[idx]!;
              [newModes[idx + 1], newModes[idx]] = [newModes[idx], newModes[idx + 1]!];
              return newModes;
            });
            setFractionsModes((prev) => {
              if (idx === prev.length - 1) return prev;
              const newModes = [...prev];
              newModes[idx + 1] = newModes[idx + 1]!;
              newModes[idx] = newModes[idx]!;
              [newModes[idx + 1], newModes[idx]] = [newModes[idx], newModes[idx + 1]!];
              return newModes;
            });
          }}><ArrowDown /> Move Down</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            setExpressions((prev) => {
              const newExpressions = [...prev];
              newExpressions.splice(idx, 1);
              return newExpressions;
            });
            setPrecisionModes((prev) => {
              const newModes = [...prev];
              newModes.splice(idx, 1);
              return newModes;
            });
            setFractionsModes((prev) => {
              const newModes = [...prev];
              newModes.splice(idx, 1);
              return newModes;
            });
          }}><Trash /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <label className="group relative h-12 w-full text-2xl ml-4">
        <Input value={value} onChange={handleChange} key={`expr-inp-${idx}`} className="flex-1 font-serif absolute inset-0 opacity-0 group-active:opacity-100 group-focus-within:opacity-100 h-10 border-0 text-2xl px-4 py-6" />
        {value == "" ? (
          <div className="group-active:opacity-0 group-focus-within:opacity-0 relative top-0 left-0 h-10 flex px-4 py-2 cursor-text font-serif text-muted-foreground">
            Enter an expression
          </div>
        ) : (
          <div className="group-active:opacity-0 group-focus-within:opacity-0 relative top-0 left-0 h-10 flex px-4 py-2 cursor-text">
            <InlineMath>{value.replaceAll("*", "\\cdot ")}</InlineMath>
          </div>
        )}
      </label>
      <div className="flex gap-4">
        {result && (
          <span className="text-2xl font-serif text-accent-foreground text-end w-full flex justify-end px-2">
            <InlineMath>
              {result}
            </InlineMath>
          </span>
        )}
        <div className="flex flex-col items-end justify-center ml-4">
          <button className="flex flex-col items-end w-full cursor-pointer" onClick={setPrecisionMode}>
            <div className="flex text-[0.5rem] gap-2">
              <span className={exact ? "text-primary" : "text-muted-foreground"}>EXACT</span>
              <span className={approx ? "text-primary" : "text-muted-foreground"}>APPROX</span>
            </div>
          </button>
          <button className="flex flex-col items-end w-full cursor-pointer" disabled={!exact} onClick={setFractionMode}>
            <div className="flex text-[0.5rem] gap-2">
              <span className={exact && improper ? "text-primary" : "text-muted-foreground"}>IMPROPER</span>
              <span className={exact && mixed ? "text-primary" : "text-muted-foreground"}>MIXED</span>
            </div>
          </button>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" className="text-muted-foreground flex-shrink-0">
              <ChartLine />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[200px] h-[200px]">
            <div id={`chart-${idx}`}></div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
