import { applyTransformedLocalizedFields } from '@commercetools-frontend/l10n';

export const shoppingListToForm = (shoppingList) => {
  return applyTransformedLocalizedFields(shoppingList, [
    { from: "nameAllLocales", to: "name" }
  ])
}

