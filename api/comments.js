import {request} from '~/plugins/request.js'

export const createComments = (slug, data) =>
  request({
    method: "post",
    url: `/articles/${slug}/comments`,
    data,
  });

export const getComments = (slug) =>
  request({
    url: `/articles/${slug}/comments`,
  });

export const delComments = (slug, id) =>
  request({
    method: "delete",
    url: `/articles/${slug}/comments/${id}`
  });
