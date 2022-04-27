import { useShowApiErrorNotification } from '@commercetools-frontend/actions-global';
import { FormModalPage } from '@commercetools-frontend/application-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import Spacings from '@commercetools-uikit/spacings';
import { useFormik } from 'formik';
import React from 'react';
import { useShoppingListContext } from '../ShoppingLists';
import { useShoppingListCreator, useShoppingListFetcher, useShoppingListUpdater } from '../use-shopping-list-connector';

const ShoppingListForm = () => {
  const dataLocale = useApplicationContext((context) => context.dataLocale);
  const languages = useApplicationContext((context) => context.project.languages);

  const [addShoppingList] = useShoppingListCreator()
  const [updateShoppingList] = useShoppingListUpdater()

  const { refetch } = useShoppingListFetcher()
  const showApiErrorNotification = useShowApiErrorNotification();

  const { setShoppingList, shoppingList, isOpen, dialog } = useShoppingListContext()

  const name = {}

  languages.forEach(language => {
    const value = shoppingList ? shoppingList.name[language] ?? '' : ''
    name[language] = value
  })

  const formik = useFormik({
    // Pass initial values from the parent component.
    initialValues: {
      name
    },
    // Handle form submission in the parent component.
    onSubmit: async (values) => {
      try {
        const names = []
        languages.forEach(locale => {
          const value = values.name[locale]
          if(value){
            names.push({
              locale, value
            })
          }
        })

        if(shoppingList){
          await updateShoppingList({ variables: {
            version: shoppingList.version,
            id: shoppingList.id,
            actions: [{
              changeName: {
                name: names
              }
            }]
          }})
        } else {
          await addShoppingList({variables: {
            draft: {
              name: names
            }
          }})
        }

        refetch()
        handleClose()
      } catch(err) {
        showApiErrorNotification("An error has ocurred: " + err.message)
      }
    },
    enableReinitialize: true,
  });

  const handleClose = () => {
    setShoppingList(null)
    dialog.off()
  }

  return (
    <FormModalPage 
        title={`${shoppingList ? "Edit" : "Add"} shopping list`}
        onClose={handleClose} 
        isPrimaryButtonDisabled={formik.isSubmitting} 
        onSecondaryButtonClick={handleClose} 
        onPrimaryButtonClick={formik.submitForm} 
        isOpen={isOpen}
      >
      <form onSubmit={formik.submitForm}>
        <Spacings.Stack>
          <LocalizedTextField
            title="Name"
            name="name"
            isRequired
            value={formik.values.name}
            touched={formik.touched.name}
            onChange={formik.handleChange}
            errors={formik.errors.name}
            onBlur={formik.handleBlur}
            selectedLanguage={dataLocale}
          />
        </Spacings.Stack>
      </form>
    </FormModalPage>
  )
}

export default ShoppingListForm