import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import DataTable from '@commercetools-uikit/data-table';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import React, { useContext, useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import ShoppingListForm from './containers/ShoppingListForm';
import { useShoppingListDeleter, useShoppingListFetcher } from './use-shopping-list-connector';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';

const columns = [
  {key: 'id', label: 'ID'},
  {key: 'name', label: 'Name'},
  {key: 'version', label: 'Version'},
  {key: 'actions', label: 'Actions'}
]

const itemRenderer = (item, column) => {
  const dataLocale = useApplicationContext((context) => context.dataLocale);
  const [deleteShoppingList] = useShoppingListDeleter()
  const { setShoppingList, dialog } = useContext(ShoppingListContext)

  switch(column.key){
    case 'id':
      return item.id;
    case 'name':
      return formatLocalizedString(item, { key: 'name', locale: dataLocale });
    case 'version':
      return item.version;
    case 'actions':
      return (
        <Spacings.Inline>
          <IconButton 
            icon={<EditIcon/>}
            label="Edit"
            onClick={() => {
              setShoppingList(item)
              dialog.on()
            }}
          />
          <IconButton 
            icon={<BinLinearIcon />}
            label="Delete"
            onClick={() => {
              deleteShoppingList({
                variables: {
                  id: item.id,
                  version: item.version
                },
                update(cache) {
                  const normalizedId = cache.identify({id: item.id, __typename: 'ShoppingList'})
                  cache.evict({id: normalizedId})
                  // cache.gc()
                }
              })
            }}
          />
        </Spacings.Inline>
      );
    default: 
      return ''
  }
}

const ShoppingLists = () => {
  const { dialog } = useShoppingListContext()
  const { data, loading, error } = useShoppingListFetcher()

  if(loading){
    return (
      <LoadingSpinner>
        Loading
      </LoadingSpinner>
    )
  }

  if(error){
    return (
      <ContentNotification type="error">
        An error has ocurred
      </ContentNotification>
    )
  }

  return (
    <>
      <div>
        <PrimaryButton onClick={dialog.on} label="Add Shopping List" />
      </div>
      <DataTable columns={columns} rows={data?.shoppingLists?.results ?? []} itemRenderer={itemRenderer}  />
      <ShoppingListForm />
    </>
  )
};

const ShoppingListContext = React.createContext()

export const useShoppingListContext = () => {
  return useContext(ShoppingListContext)
}

const ShoppingListConnector = () => {
  const [shoppingList, setShoppingList] = useState()
  const [isOpen, dialog] = useBoolean()
  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList, isOpen, dialog }}>
      <ShoppingLists />
    </ShoppingListContext.Provider>
  )
}

ShoppingLists.displayName = 'ShoppingLists';

export default ShoppingListConnector;
