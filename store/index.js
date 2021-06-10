const cookieparser = process.server ? require("cookieparser") : undefined;

export const state = () => {
  return {
    user: null,
  };
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    let user = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {}
    }
    commit('setUser', user)
  }
};
