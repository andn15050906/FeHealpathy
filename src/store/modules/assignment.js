import { getAssignment } from '@/services/assignmentService'; 

const state = {
  assignment: null,
  loading: false,
  error: null,
};

const mutations = {
  SET_ASSIGNMENT(state, assignment) {
    state.assignment = assignment;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchAssignment({ commit }, id) {
    commit('SET_LOADING', true);
    try {
      const data = await getAssignment(id);
      commit('SET_ASSIGNMENT', data);
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const getters = {
  assignment: (state) => state.assignment,
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
