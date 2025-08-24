import React from 'react';
import TrueFocus from './TrueFocus';

export default function Logo() {
  return (
<TrueFocus 
sentence="Bunk Smart"
manualMode={false}
blurAmount={5}
borderColor="red"
animationDuration={2.5}
pauseBetweenAnimations={1}
/>
  )
}