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
        return fetch(`${APIURL}/characters?access_token=${apiKey.value}&`).then((res) => res.json());
    };

    const getCharacterNames = (name) => {
        return fetch(`${APIURL}/characters/${name}?access_token=${apiKey.value}`).then((res) =>
            res.json(),
        );
    };

    const getBank = () => {
        return fetch(`${APIURL}/bank?access_token=${apiKey.value}&`).then((res) => res.json());
    };

    const getMatérials = () => {
        return fetch(`${APIURL}/account/materials?access_token=${apiKey.value}&`).then((res) => res.json());
    };

    const getItems = () => {
        return fetch(`${APIURL}/items?`).then((res) => res.json());
    };

    const getItemsDetails = function (itemIds) {
        const baseUrl = 'https://api.guildwars2.com/v2/items?lang=fr&ids=';
        const itemLinks = $("#itemLinks").val();
        fetch(baseUrl + itemIds.toString())
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const element = document.querySelector(`tr[data-itemid='${item.id}']`);
                    if (element) {
                        const img = element.querySelector('.icon img');
                        if (img) {
                            img.setAttribute('data-src', item.icon);
                        }

                        const itemName = element.querySelector('.item-name');
                        if (itemName) {
                            itemName.classList.add(item.rarity);
                            itemName.innerHTML = `<a href="${itemLinks}${item.id}" target="_blank">${item.name}</a>`;
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const getRecipes = () => {
        return fetch(`${APIURL}/recipes?`).then((res) => res.json());
    };

    const getSkins = () => {
        return fetch(`${APIURL}/skins?`).then((res) => res.json());
    };

    const getColors = () => {
        return fetch(`${APIURL}/colors?`).then((res) => res.json());
    };

    initApiKey();

    return { setApiKey, haveApiKey, error, getApiKey, getCharacters, getCharacterNames, getBank, getMatérials, getItems, getItemsDetails, getRecipes, getSkins, getColors };
});