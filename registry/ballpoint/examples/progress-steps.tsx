"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

const steps = ["Pick a pen", "Pick a paper", "Write something", "Done"];

export default function ProgressSteps() {
  const [step, setStep] = useState(1);
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Progress value={(step / steps.length) * 100} size="sm" seed="ps-steps">
        <ProgressLabel>
          Step {step} of {steps.length}: {steps[step - 1]}
        </ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" seed="ps-back" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button size="sm" seed="ps-next" disabled={step === steps.length} onClick={() => setStep((s) => s + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
