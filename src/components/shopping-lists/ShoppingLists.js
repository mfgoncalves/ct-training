import PropTypes from 'prop-types';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import DataTable from '@commercetools-uikit/data-table';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, EditIcon, BackIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import React, { useContext, useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import ShoppingListForm from './containers/ShoppingListForm';
import { useShoppingListDeleter, useShoppingListFetcher } from './use-shopping-list-connector';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import FlatButton from '@commercetools-uikit/flat-button';
import { Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Text from '@commercetools-uikit/text';
import messages from './messages';

const columns = [
  {key: 'id', label: 'ID'},
  {key: 'name', label: 'Name'},
  {key: 'version', label: 'Version'},
  {key: 'actions', label: 'Actions'}
]

const ItemRenderer = (item, column) => {
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

const ShoppingLists = (props) => {
  const { dialog } = useShoppingListContext()
  const { data, loading, error } = useShoppingListFetcher()
  const intl = useIntl();

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
    <Spacings.Stack scale="l">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      <Spacings.Stack scale="s">
      <div>
        <PrimaryButton onClick={dialog.on} label="Add Shopping List" />
      </div>
      <DataTable columns={columns} rows={data?.shoppingLists?.results ?? []} itemRenderer={ItemRenderer}  />
      <ShoppingListForm />
      </Spacings.Stack>
    </ Spacings.Stack>
  )
};

const ShoppingListContext = React.createContext()

export const useShoppingListContext = () => {
  return useContext(ShoppingListContext)
}

const ShoppingListConnector = (props) => {
  const [shoppingList, setShoppingList] = useState()
  const [isOpen, dialog] = useBoolean()
  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList, isOpen, dialog }}>
      <ShoppingLists linkToWelcome={props.linkToWelcome} />
    </ShoppingListContext.Provider>
  )
}

ShoppingLists.displayName = 'ShoppingLists';
ShoppingLists.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};
ShoppingListConnector.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default ShoppingListConnector;
