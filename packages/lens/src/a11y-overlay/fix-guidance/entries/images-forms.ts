import type { FixGuidance } from '../types';

export const imagesFormsEntries: Record<string, FixGuidance> = {
  'image-alt': {
    title: 'Image has no description',
    why: "Screen reader users can't perceive this image. They won't know what it shows or why it's there.",
    fix: 'Add alt text that describes the image. If the image is decorative, use an empty alt="".',
    codeExample: `<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4" />

<!-- Decorative image -->
<img src="divider.png" alt="" />`,
    avoid: [
      'Don\'t start with "Image of..." or "Picture of..." - screen readers already say "image"',
      "Don't describe decorative images - use empty alt instead",
    ],
    voiceOver: {
      goal: 'Verify the image is described or properly hidden',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Use VO + Right Arrow to navigate to this image',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear a description of what the image shows, or nothing if it\'s decorative',
    },
  },

  label: {
    title: 'Input has no label',
    why: "Screen reader users won't know what to enter in this field. They'll just hear the input type.",
    fix: 'Add a visible <label> element connected to the input, or use aria-label if a visible label is not possible.',
    codeExample: `<!-- With visible label (preferred) -->
<label for="email">Email address</label>
<input type="email" id="email" />

<!-- With aria-label (when visible label not possible) -->
<input type="search" aria-label="Search products" />`,
    avoid: [
      "Don't use placeholder as the only label - it disappears when typing",
      "Don't rely on surrounding text to explain the field",
    ],
    voiceOver: {
      goal: 'Verify the input announces its purpose',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this input',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear the field\'s purpose, like "Email address, text field"',
    },
  },

  'select-name': {
    title: 'Select has no label',
    why: "Screen reader users won't know what this dropdown is for.",
    fix: 'Add a visible <label> element connected to the select.',
    codeExample: `<label for="country">Country</label>
<select id="country">
  <option>Norway</option>
  <option>Sweden</option>
</select>`,
    voiceOver: {
      goal: 'Verify the select announces its purpose',
      steps: [
        'Press Cmd + F5 to start VoiceOver',
        'Press Tab until you reach this select',
        'Listen to what VoiceOver announces',
      ],
      expect: 'You should hear what the dropdown is for, like "Country, popup button"',
    },
  },

  'color-contrast': {
    title: 'Text is hard to read',
    why: 'The contrast between text and background is too low. Users with low vision may not be able to read it.',
    fix: 'Increase the contrast ratio. For normal text, aim for at least 4.5:1. For large text, 3:1 is acceptable.',
    codeExample: `/* Low contrast - hard to read */
.bad { color: #999; background: #fff; } /* 2.8:1 ratio */

/* Good contrast */
.good { color: #595959; background: #fff; } /* 4.5:1 ratio */`,
    avoid: [
      "Don't rely on color alone to convey information",
      "Don't use light gray text on white backgrounds",
    ],
  },
};
