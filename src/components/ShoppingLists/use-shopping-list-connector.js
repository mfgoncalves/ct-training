import React from 'react';
import {GRAPHQL_TARGETS} from '@commercetools-frontend/constants'
import FetchShoppingLists from './fetch-shopping-lists.ctp.graphql'
import DeleteShoppingList from './delete-shopping-list.ctp.graphql'
import UpdateShoppingList from './update-shopping-list.ctp.graphql'
import CreateShoppingList from './create-shopping-list.ctp.graphql'
import { useMutation, useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { shoppingListToForm } from '../../utils/conversions';

export const useShoppingListFetcher = () => {
  const query = useQuery(FetchShoppingLists, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM
    },
    // fetchPolicy: "cache-and-network"
  })

  if(query?.data?.shoppingLists?.results){
    return {
      ...query,
      data: {
        ...query.data,
        shoppingLists: {
          ...query.data.shoppingLists,
          results: query.data.shoppingLists.results.map(item => shoppingListToForm(item))
        }
      },
    }
  } else {
    return query
  }
}

export const useShoppingListCreator = () => {
  return useMutation(CreateShoppingList, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM
    },  
  })
}

export const useShoppingListDeleter = () => {
  return useMutation(DeleteShoppingList, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM
    },  
  })
}

export const useShoppingListUpdater = () => {
  return useMutation(UpdateShoppingList, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM
    },  
  })
}