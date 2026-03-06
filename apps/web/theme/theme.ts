import { recipes } from './recipes'
import { slotRecipes } from './slot-recipes'

export const theme = {
  extend: {
    tokens: {
      colors: {
        primary: {
          value: '#000000',
        },
        secondary: {
          value: '#FFFFFF',
        },
        grey: {
          value: '#808080',
        },
      },
    },
    recipes,
    slotRecipes,
  },
}
