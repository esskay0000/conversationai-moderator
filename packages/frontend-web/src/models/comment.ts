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

import { fromJS, List, Record } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';

export interface IAuthorAttributes {
  email: string;
  location: string;
  avatar: string;
  name: string;
}

export type IAuthorModel = Readonly<IAuthorAttributes>;

export interface IAuthorCountsAttributes {
  approvedCount: number;
  rejectedCount: number;
}

export type IAuthorCountsModel = Readonly<IAuthorCountsAttributes>;

export interface ICommentAttributes {
  id: string;
  sourceId: string | number;
  replyToSourceId: string | number | undefined;
  replyId: string | undefined;
  replyTo?: ICommentModel;
  authorSourceId: string | number;
  text: string;
  author: IAuthorModel;
  isScored: boolean;
  isModerated: boolean;
  isAccepted: boolean;
  isDeferred: boolean;
  isHighlighted: boolean;
  isBatchResolved: boolean;
  isAutoResolved: boolean;
  sourceCreatedAt: string;
  updatedAt: string;
  unresolvedFlagsCount: number;
  flagsSummary?: Map<string, List<number>>;
  sentForScoring: boolean;
  articleId: string;
  replies?: Array<ICommentModel>;
  maxSummaryScore?: number;
  maxSummaryScoreTagId?: string;
}

export interface ICommentModel extends TypedRecord<ICommentModel>, ICommentAttributes {}

const CommentModelRecord = Record({
  id: null,
  sourceId: null,
  replyToSourceId: null,
  replyId: null,
  replyTo: null,
  authorSourceId: null,
  text: null,
  author: null,
  isScored: null,
  isModerated: null,
  isAccepted: null,
  isDeferred: null,
  isHighlighted: null,
  isBatchResolved: null,
  isAutoResolved: null,
  unresolvedFlagsCount: null,
  flagsSummary: null,
  sourceCreatedAt: null,
  updatedAt: null,
  sentForScoring: null,
  articleId: null,
  article: null,
  replies: null,
  commentScores: null,
  commentFlags: null,
  maxSummaryScore: null,
  maxSummaryScoreTagId: null,
});

export function CommentModel(keyValuePairs?: ICommentAttributes | Map<string, any>): ICommentModel {
  let author: any = (keyValuePairs as ICommentAttributes).author  || (keyValuePairs as Map<string, any>).get('author');

  if (typeof author === 'string') {
    author = JSON.parse(author);
  }

  if (author.user_name) {
    author.name = author.user_name;
  }

  if (author.image_uri) {
    author.avatar = author.image_uri;
  }

  const immutableKeyValuePairs = fromJS(keyValuePairs).set('author', author);
  return new CommentModelRecord(immutableKeyValuePairs) as ICommentModel;
}
