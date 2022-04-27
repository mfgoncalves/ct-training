import { useMutation, useQuery } from '@apollo/client'
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants'
import { shoppingListToForm } from './conversions'
import CreateShoppingList from './create-shopping-list.ctp.graphql'
import DeleteShoppingList from './delete-shopping-list.ctp.graphql'
import FetchShoppingLists from './fetch-shopping-lists.ctp.graphql'
import UpdateShoppingList from './update-shopping-list.ctp.graphql'

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