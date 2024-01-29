import axios from 'axios';

const tokenStore = {
  accessToken: undefined,
  refreshToken: undefined,
  email: undefined,
};

function ClearTokenStore() {
  tokenStore.accessToken = undefined;
  tokenStore.refreshToken = undefined;
  tokenStore.email = undefined;
}

const baseInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${tokenStore.accessToken}`,
  },
});

// request interceptor to add auth token header to requests (if it exists)
baseInstance.interceptors.request.use(
  function (config) {
    if (tokenStore.accessToken) {
      config.headers.Authorization = 'Bearer ' + tokenStore.accessToken;
    }
    return config;
  },
  function (error) {
    Promise.reject(error);
  }
);

// response interceptor to refresh token on receiving token expired error
baseInstance.interceptors.response.use(
  function (response) {
    if (response.data.tokens) {
      const { user, tokens } = response.data;
      tokenStore.accessToken = tokens.accessToken;
      tokenStore.refreshToken = tokens.refreshToken;
      tokenStore.email = user.email;
    }
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      originalRequest.url === `${process.env.EXPO_PUBLIC_API_URL}/users/refresh`
    ) {
      ClearTokenStore();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data: tokens } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/users/refresh`,
          {
            email: tokenStore.email,
            refreshToken: tokenStore.refreshToken,
          }
        );

        tokenStore.accessToken = tokens.accessToken;
        tokenStore.refreshToken = tokens.refreshToken;
        baseInstance.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;

        return baseInstance(originalRequest);
      } catch (err) {
        //TODO: handle error regarding token refresh
        console.log(err);
        ClearTokenStore();
      }
    }
    return Promise.reject(error);
  }
);

export default baseInstance;
