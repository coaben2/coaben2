<template>
    <div id="container">
        <h3 id="tips_label">Conseils divers:</h3>
        <p>Voici divers conseils sur la façon de faire de la place dans votre inventaire.</p>
        <table id="tips">
            <tbody>
                <tr>
                    <td class="cost">En construction...</td>
                </tr>
            </tbody>
        </table>
        <h3 id="items_label">Empiler ces objets:</h3>
        <p>Ces articles ont des piles incomplètes et peuvent être empilés ensemble.</p>
        <table id="items">
            <tbody>
                <tr>
                    <td class="cost">En construction...</td>
                </tr>
            </tbody>
        </table>
        <h3 id="crafts_label">fabriquer les objets:</h3>
        <p>Vous pouvez fabriquer ces objets pour réduire nombre de piles.</p>
        <table id="crafts">
            <tbody>
                <tr>
                    <td class="cost">En construction...</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
/*import axios from 'axios';
import { getApiKey } from '@/stores/user';

const organize = async () => {
    try {
        const apiKey = getApiKey();

        const config = {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        };

        const requests = [
            axios.get('https://api.guildwars2.com/v2/items', config),
            axios.get('https://api.guildwars2.com/v2/items', config),
            axios.get('https://api.guildwars2.com/v2/items', config),
            axios.get('https://api.guildwars2.com/v2/items', config)
        ];

        const responses = await Promise.all(requests);

        responses.forEach(response => {
            console.log(response.data);
        });

        const itemsTable = document.getElementById('items');
        if (itemsTable) {
            itemsTable.querySelector('tbody').innerHTML = '<tr><td class="cost">en construction...</td></tr>';
            itemsTable.style.display = 'block';
        }

        const craftsTable = document.getElementById('crafts');
        if (craftsTable) {
            craftsTable.querySelector('tbody').innerHTML = '<tr><td class="cost">en construction...</td></tr>';
            craftsTable.style.display = 'block';
        }

        const tipsTable = document.getElementById('tips');
        if (tipsTable) {
            tipsTable.querySelector('tbody').innerHTML = '<tr><td class="cost">en construction...</td></tr>';
            tipsTable.style.display = 'block';
        }

        const raresalvageTable = document.getElementById('raresalvage');
        if (raresalvageTable) {
            raresalvageTable.querySelector('tbody').innerHTML = '<tr><td class="cost">en construction...</td></tr>';
            raresalvageTable.style.display = 'block';
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
};

organize();*/

</script>