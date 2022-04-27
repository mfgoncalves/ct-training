import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PageUnauthorized } from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import Channels from './components/channels';
import ShoppingLists from './components/shopping-lists';
import Welcome from './components/welcome';
import { PERMISSIONS } from './constants';

const ApplicationRoutes = () => {
  const match = useRouteMatch();

  // We can evaluate the user permissions and use the information to restrict
  // certain parts of the application.
  // For example, we can show an unauthorized page if the user does not have
  // the permission to `view` products.
  const canView = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.View],
  });

  if (!canView) {
    return <PageUnauthorized />;
  }

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/channels`}>
          <Channels linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/shopping-lists`}>
          <ShoppingLists linkToWelcome={match.url} />
        </Route>
        <Route>
          <Welcome />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
