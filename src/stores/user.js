import { ref } from 'vue';
import { defineStore } from 'pinia';

const APIURL = 'https://api.guildwars2.com/v2';

export const useUserStore = defineStore('user', () => {
  const apiKey = ref(null);
  const newApiKey = ref(null);
  const haveApiKey = ref(false);
  const error = ref(null);

  const checkApiKey = async () => {
    error.value = null;
    if (!newApiKey.value.length) return;
    try {
      const req = await fetch(`${APIURL}/account?access_token=${newApiKey.value}`);
      const res = await req.json();
      if (!req.ok) {
        if (res.text) {
          throw new Error(res.text);
        }
        throw new Error(`GW2 API error ${req.status}`);
      }
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('gw2-api-key', newApiKey.value);
    apiKey.value = newApiKey.value;
    haveApiKey.value = true;
  };

  const initApiKey = () => {
    const localApiKey = localStorage.getItem('gw2-api-key');
    if (localApiKey) {
      apiKey.value = localApiKey;
      haveApiKey.value = true;
    }
  };

  const setApiKey = async (token) => {
    newApiKey.value = token;
    if (await checkApiKey()) {
      saveApiKey();
    }
  };

  const getApiKey = () => {
    return apiKey.value;
  };

  const getCharacters = () => {
    return fetch(`${APIURL}/characters?access_token=${apiKey.value}`).then((res) => res.json());
  };

  const getCharacter = (name) => {
    return fetch(`${APIURL}/characters/${name}?access_token=${apiKey.value}`).then((res) =>
      res.json(),
    );
  };

  initApiKey();

  return { setApiKey, haveApiKey, error, getApiKey, getCharacters, getCharacter };
});
