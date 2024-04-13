import { ref } from 'vue';
import { defineStore } from 'pinia';

const APIURL = 'https://api.guildwars2.com/v2';

export const getAPI = defineStore('user', () => {
    const apiKey = ref(null);

    const getBank = () => {
        return fetch(`${APIURL}/bank?access_token=${apiKey.value}&`).then((res) => res.json());
    };

    const getMatérials = () => {
        return fetch(`${APIURL}/account/materials?access_token=${apiKey.value}&`).then((res) => res.json());
    };

    const getItems = () => {
        return fetch(`${APIURL}/items?`).then((res) => res.json());
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
    return { getBank, getMatérials, getItems, getRecipes, getSkins, getColors };
});