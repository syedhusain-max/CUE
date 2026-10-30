// Settings that used to be editable in the Claude Design panel.
// They are fixed here now; change a value and redeploy to switch it.
export const CUE_CONFIG = {
  cardRotation: 'hover', // 'hover' | 'always' | 'off'  (Library card image rotation)
  unlocked: false, // true shows every Premium template as unlocked
  typeVoice: 'Grotesk', // 'Grotesk' | 'Editorial' | 'Terminal'  (Home headings)
  depth: 'Cinematic', // 'Flat' | 'Cinematic' | 'Vertigo'  (Home 3D strength)
  mediaMood: 'Color', // 'Color' | 'Muted' | 'Mono'  (Home media filter)
  brandName: 'Cue', // 'Cue' | 'Motif' | 'Kinetic' | 'Reel'
  customName: '', // overrides brandName when set
  wordmark: 'Caret', // 'Caret' | 'Period' | 'Pill' | 'Italic'
};
