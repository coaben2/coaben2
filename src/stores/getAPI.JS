import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const APIURL = 'https://api.guildwars2.com/v2';

export const getAPI = defineStore('user', () => {
    const apiKey = ref(null);



    const getMaterials = async () => {
        try {
            const response = await axios.get(`${APIURL}/account/materials`, {
                params: {
                    access_token: apiKey.value
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching materials data:', error);
            return null;
        }
    };

    const getItems = async () => {
        try {
            const response = await axios.get(`${APIURL}/items`);
            return response.data;
        } catch (error) {
            console.error('Error fetching items data:', error);
            return null;
        }
    };

    const getRecipes = async () => {
        try {
            const response = await axios.get(`${APIURL}/recipes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recipes data:', error);
            return null;
        }
    };

    const getSkins = async () => {
        try {
            const response = await axios.get(`${APIURL}/skins`);
            return response.data;
        } catch (error) {
            console.error('Error fetching skins data:', error);
            return null;
        }
    };

    const getColors = async () => {
        try {
            const response = await axios.get(`${APIURL}/colors`);
            return response.data;
        } catch (error) {
            console.error('Error fetching colors data:', error);
            return null;
        }
    };

    return { apiKey, getBank, getMaterials, getItems, getRecipes, getSkins, getColors };
});
