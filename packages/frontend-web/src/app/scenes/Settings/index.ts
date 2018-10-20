/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { List } from 'immutable';
import { connect } from 'react-redux';
import { InjectedRouter, withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';
import {
  IPreselectModel,
  IRuleModel,
  ITaggingSensitivityModel,
  ITagModel,
  IUserModel,
} from '../../../models';
import { IAppDispatch, IAppState } from '../../stores';
import { getCategories } from '../../stores/categories';
import { getPreselects } from '../../stores/preselects';
import { getRules } from '../../stores/rules';
import { getTaggingSensitivities } from '../../stores/taggingSensitivities';
import { getTags } from '../../stores/tags';
import { getUsers } from '../../stores/users';
import { ISettingsProps, Settings as PureSettings } from './Settings';

import {
  updatePreselects,
  updateRules,
  updateTaggingSensitivities,
  updateTags,
  updateUsers,
} from './store';

export type ISettingsOwnProps = Pick<
  ISettingsProps,
  'submitForm'
>;

export type ISettingsStateProps = Pick<
  ISettingsProps,
  'users' |
  'tags' |
  'categories' |
  'rules' |
  'preselects' |
  'taggingSensitivities' |
  'onCancel'
>;

export type ISettingsDispatchProps = Pick<
  ISettingsProps,
  'updatePreselects' |
  'updateRules' |
  'updateTaggingSensitivities' |
  'updateTags' |
  'updateUsers'
>;

const mapStateToProps = createStructuredSelector({
  users: getUsers,
  tags: getTags,
  categories: getCategories,
  rules: getRules,
  preselects: getPreselects,
  taggingSensitivities: getTaggingSensitivities,
  onCancel: (_: IAppState, { router }: { router: InjectedRouter }) => router.goBack,
  onSearchClick: (_: IAppState, { router }: { router: InjectedRouter }) => () => router.push('/search'),
  onAuthorSearchClick: (_: IAppState, { router }: { router: InjectedRouter }) => () => router.push('/search?searchByAuthor=true'),
}) as (state: IAppState, props: ISettingsOwnProps) => ISettingsStateProps;

function mapDispatchToProps(dispatch: IAppDispatch): ISettingsDispatchProps {
  return {
    updatePreselects: (oldPreselects, newPreselects) => dispatch(updatePreselects(oldPreselects, newPreselects)),
    updateRules: (oldRules, newRules) => dispatch(updateRules(oldRules, newRules)),
    updateTaggingSensitivities: (oldTaggingSensitivities, newTaggingSensitivities) => dispatch(updateTaggingSensitivities(oldTaggingSensitivities, newTaggingSensitivities)),
    updateTags: (oldTags, newTags) => dispatch(updateTags(oldTags, newTags)),
    updateUsers: (oldUsers, newUsers) => dispatch(updateUsers(oldUsers, newUsers)),
  };
}

function mergeProps(
  stateProps: ISettingsStateProps,
  dispatchProps: ISettingsDispatchProps,
  ownProps: ISettingsOwnProps,
): ISettingsStateProps & ISettingsDispatchProps & ISettingsOwnProps {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    submitForm: (
      newPreselects: List<IPreselectModel>,
      newRules: List<IRuleModel>,
      newTaggingSensitivities: List<ITaggingSensitivityModel>,
      newTags: List<ITagModel>,
      newUsers: List<IUserModel>,
    ) => {
      try {
        Promise.all([
          dispatchProps.updatePreselects(stateProps.preselects, newPreselects),
          dispatchProps.updateRules(stateProps.rules, newRules),
          dispatchProps.updateTaggingSensitivities(stateProps.taggingSensitivities, newTaggingSensitivities),
          dispatchProps.updateTags(stateProps.tags, newTags),
          dispatchProps.updateUsers(stateProps.users, newUsers),
        ]);
      } catch (exception) {
        return exception as Error;
      }
    },
  };
}

// Manually wrapping without `compose` so types stay correct.

// Add Redux data.
const ConnectedSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(PureSettings);

// Add `router` prop.
export const Settings: React.ComponentType = withRouter(ConnectedSettings);
