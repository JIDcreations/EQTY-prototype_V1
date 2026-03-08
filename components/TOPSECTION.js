import React from 'react';
import StepHeader from './StepHeader';

export default function TOPSECTION({
  step,
  total,
  title,
  onBack,
  onOpenGlossary,
  glossaryLabel,
  onPressTerm,
  stepLabel,
  subtitle,
  showTitle = true,
}) {
  return (
    <StepHeader
      step={step}
      total={total}
      title={title}
      onBack={onBack}
      onOpenGlossary={onOpenGlossary}
      glossaryLabel={glossaryLabel}
      onPressTerm={onPressTerm}
      stepLabel={stepLabel}
      helperText={subtitle}
      helperTextBelowTitle={Boolean(subtitle)}
      showTitle={showTitle}
    />
  );
}
