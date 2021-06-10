import { request } from "~/plugins/request.js";

export const getProfiles = (username) =>
  request({
    url: `/profiles/${username}`,
  });

export const followProfiles = (username) =>
  request({
    method: "post",
    url: `/profiles/${username}/follow`,
  });

export const unfollowProfiles = (username) =>
  request({
    method: "delete",
    url: `/profiles/${username}/follow`,
  });
