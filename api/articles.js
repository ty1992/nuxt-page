import { request } from "~/plugins/request.js";

export const getArticles = (params = { limit: 10, offset: 0 }) =>
  request({
    url: "/articles",
    params,
  });

export const feedArticles = (params) =>
  request({
    url: "/articles/feed",
    params,
  });

export const slugArticles = (slug) =>
  request({
    url: `/articles/${slug}`,
  });

export const createArticles = data =>
  request({
    method: "post",
    url: `/articles`,
    data,
  });

export const updataArticles = (slug, data) =>
  request({
    method: "put",
    url: `/articles/${slug}`,
    data,
  });

export const delArticles = (slug) =>
  request({
    method: "delete",
    url: `/articles/${slug}`,
  });

export const favoriteArticles = (slug) =>
  request({
    method: "post",
    url: `/articles/${slug}/favorite`,
  });

export const unfavoriteArticles = (slug) =>
  request({
    method: "delete",
    url: `/articles/${slug}/favorite`,
  });
