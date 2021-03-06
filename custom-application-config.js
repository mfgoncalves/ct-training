import { PERMISSIONS, entryPointUriPath } from './src/constants'

const config = {
  name: 'CT Training App',
  entryPointUriPath,
  cloudIdentifier: 'gcp-us',
  env: {
    development: {
      initialProjectKey: 'mfgoncaves-test'
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: 'https://ct-training-mfgoncalves.vercel.app'
    }
  },

  oAuthScopes: {
    view: [
      "view_types",
      "view_api_clients",
      "view_attribute_groups",
      "view_cart_discounts",
      "view_audit_log",
      "view_categories",
      "view_customer_groups",
      "view_customers",
      "view_discount_codes",
      "view_import_containers",
      "view_key_value_documents",
      "view_messages",
      "view_order_edits",
      "view_orders",
      "view_payments",
      "view_product_selections",
      "view_products",
      "view_project_settings",
      "view_published_products",
      "view_shipping_methods",
      "view_shopping_lists",
      "view_states",
      "view_stores",
      "view_tax_categories"
    ],
    manage: [
      "manage_api_clients",
      "manage_attribute_groups",
      "manage_audit_log",
      "manage_cart_discounts",
      "manage_categories",
      "manage_customer_groups",
      "manage_customers",
      "manage_discount_codes",
      "manage_extensions",
      "manage_import_containers",
      "manage_key_value_documents",
      "manage_order_edits",
      "manage_orders",
      "manage_payments",
      "manage_product_selections",
      "manage_products",
      "manage_project_settings",
      "manage_shipping_methods",
      "manage_shopping_lists",
      "manage_states",
      "manage_stores",
      "manage_subscriptions",
      "manage_tax_categories",
      "manage_types"
    ],
  },

  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Training',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },

  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View, PERMISSIONS.Manage],
    },
    {
      uriPath: 'shopping-lists',
      defaultLabel: 'Shopping Lists',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View, PERMISSIONS.Manage],
    },
  ],
}

export default config;