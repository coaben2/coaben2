import { getBank, getCharacters, getMaterials } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { useItemRecommendationsStore } from '@/stores/itemRecommendationsStore'

// Variables globales nécessaires
const itemCounts = {}
const partialStacks = {}
const itemPlacements = {}

// Utilisation du store user
const userStore = useUserStore()

// Fonction principale modifiée pour utiliser le store user
async function initializeInventory() {
    try {
        // Récupération des données via le store user
        const bankData = await userStore.getBank()
        const materialsData = await userStore.getMaterials()
        const charactersData = await userStore.getCharacters()

        // Traitement des données de la banque
        if (bankData) {
            bankData.forEach(item => {
                addItem(item, 'Account bank')
            })
        }

        // Traitement des matériaux
        if (materialsData) {
            materialsData.forEach(item => {
                addItem(item, 'Material storage')
            })
        }

        // Traitement des personnages
        if (charactersData) {
            processCharactersInventory(charactersData)
        }

        return true
    } catch (error) {
        console.error('Error initializing inventory:', error)
        return false
    }
}

/* Ancien code commenté
function getBankListings(apiKey) {
    var bankURL = 'https://api.guildwars2.com/v2/account/bank?access_token=' + apiKey;
    message("Accessing bank...");
    $.getJSON(bankURL, function (json) {
        for (var i = 0; i < json.length; i++) {
            var item = json[i];
            addItem(item, 'Account bank');
        };
        getInventoryListings(apiKey);
    })
}
*/

// Fonction de traitement des inventaires des personnages
function processCharactersInventory(characters) {
    characters.forEach(async (characterName) => {
        try {
            const characterData = await userStore.getCharacterNames(characterName)
            if (characterData && characterData.bags) {
                characterData.bags.forEach(bag => {
                    if (bag) {
                        processBagContents(bag, characterName)
                    }
                })
            }
        } catch (error) {
            console.error(`Error processing character ${characterName}:`, error)
        }
    })
}

// Garder la fonction addItem d'origine car elle fonctionne bien
function addItem(item, source) {
    if (item) {
        if (itemCounts[item.id]) {
            itemCounts[item.id] = itemCounts[item.id] + item.count
        } else {
            itemCounts[item.id] = item.count
        }
        
        if (item.count % 250 > 0 && item.count > 0) {
            const itemSource = {
                count: item.count,
                source: source
            }
            if (!partialStacks[item.id]) {
                partialStacks[item.id] = []
            }
            partialStacks[item.id].push(itemSource)
        }

        const itemSource = {
            count: item.count,
            source: source
        }
        if (!itemPlacements[item.id]) {
            itemPlacements[item.id] = []
        }
        itemPlacements[item.id].push(itemSource)
    }
}

function getBankListings(apiKey) {
    var bankURL = 'https://api.guildwars2.com/v2/account/bank?access_token=' + apiKey;
    message("Accessing bank...");
    $.getJSON(bankURL, function (json) {
        for (var i = 0; i < json.length; i++) {
            var item = json[i];
            addItem(item, 'Account bank');
        };
        getInventoryListings(apiKey);

    })
}

/*function getMaterials(apiKey) {

    var materialsURL = 'https://api.guildwars2.com/v2/account/materials?access_token=' + apiKey;
    message("Accessing materials...");
    $.getJSON(materialsURL, function (json) {
        for (var i = 0; i < json.length; i++) {
            var item = json[i];
            addItem(item, 'Material storage');
            if (item.count > collections) {
                collections = item.count;
            }
        };

        collections = Math.ceil(collections / 250) * 250;
        if (collections == 0) {
            collections = 250;
        }

        getBankListings(apiKey);

    }).fail(function (jqxhr, textStatus, error) {
        message("Failed to access materials.");
    });
}*/

/*function getInventoryListings(apiKey) {

    var characterListURL = 'https://api.guildwars2.com/v2/characters?access_token=' + apiKey;
    message("Getting character list...");
    $.getJSON(characterListURL, function (json) {
        recurseCharacter(json, apiKey);
    }).fail(function (jqxhr, textStatus, error) {
        message("Failed to get character list.");
    });

}*/

function recurseCharacter(characterList, apiKey) {
    if (characterList.length > 0) {
        var character = characterList.splice(0, 1);
        var characterURL = 'https://api.guildwars2.com/v2/characters/' + encodeURIComponent(character) + '?access_token=' + apiKey;
        message("Getting character " + character + "...");
        $.getJSON(characterURL, function (json) {
            for (var i = 0; i < json.bags.length; i++) {
                var bag = json.bags[i];
                if (bag) {
                    if (bag.id == 67176) {
                        canner = true;
                    }
                    if (bag.id == 67518) {
                        bandit = true;
                    }
                    for (var j = 0; j < bag.inventory.length; j++) {
                        var item = bag.inventory[j];
                        addItem(item, character);
                    };
                }
            };
            recurseCharacter(characterList, apiKey);
        }).fail(function (jqxhr, textStatus, error) {
            message("Failed to get character " + character + ".");
        });

    } else {
        processItems();
    }
}

function addItemSource(itemSource, t) {
    for (index = 0; index < itemSource.length; ++index) {
        if (index > 0) {
            t.push('<tr>');
        }
        t.push('<td class="cost">');
        t.push(itemSource[index].count);
        t.push('</td>');
        t.push('<td class="cost">');
        t.push(itemSource[index].source);
        t.push('</td>');
        t.push('</tr>');
    }
}

function processItems() {
    getEctoCalc()
    const c = []
    recurseBuildItemEntry(c, Object.keys(partialStacks))
    const r = []
    recurseBuildCraftingEntry(r, Object.keys(itemCounts))
    
    // Utilisation du store de recommandations
    const itemRecommendationsStore = useItemRecommendationsStore()
    const recommendations = itemRecommendationsStore.generateRecommendations(itemCounts, itemPlacements)
    $('#tips tbody').html(recommendations)
    $('#tips').show()
    
    message("Done with misc tips.")
}

function recipeItemInfo(r, keys, recipes, itemIds) {
    var itemURL = 'https://api.guildwars2.com/v2/items?ids=' + itemIds.join(',');
    message("Getting details for items " + itemIds.join(',') + "...");
    $.getJSON(itemURL, function (json) {
        for (var i = 0; i < json.length; i++) {
            r.push('<tr><td class="icon"><img src="');
            r.push(json[i].icon);
            r.push('" /><td class="name">');
            r.push(json[i].name);
            r.push('</td></tr>');
        };
        recurseRecipeList(r, keys, recipes);
    }).fail(function (jqxhr, textStatus, error) {
        message("Failed to get details for item " + itemIds.join(',') + ".");
        r.push('<tr><td class="icon">?<td class="name">');
        r.push('Mystery items ' + itemIds.join(','));
        r.push('</td></tr>');
        recurseRecipeList(r, keys, recipes);
    });
}

function recurseRecipeList(r, keys, recipes) {
    if (recipes.length > 0) {
        var recipeIds = recipes.splice(0, 199);
        var recipeURL = 'https://api.guildwars2.com/v2/recipes?ids=' + recipeIds.join(',');
        message("Getting recipes " + recipeIds.join(',') + "...");
        $.getJSON(recipeURL, function (json) {
            var itemIds = [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].ingredients.length < 2) {
                    itemIds.push(json[i].output_item_id);
                }
            };
            if (itemIds.length > 0) {
                recipeItemInfo(r, keys, recipes, itemIds);
            } else {
                recurseRecipeList(r, keys, recipes);
            }
        }).fail(function (jqxhr, textStatus, error) {
            message("Failed to get recipes " + recipeIds.join(',') + ".");
        });
    } else {
        recurseBuildCraftingEntry(r, keys);
    }
}

function recurseBuildCraftingEntry(r, keys) {
    if (keys.length > 0) {
        var itemId = keys.splice(0, 1);
        if (itemCounts[itemId] > collections) {
            var recipeURL = 'https://api.guildwars2.com/v2/recipes/search?input=' + itemId;
            message("Getting recipes for item " + itemId + "...");
            $.getJSON(recipeURL, function (json) {
                if (json.length > 0) {
                    recurseRecipeList(r, keys, json);
                } else {
                    recurseBuildCraftingEntry(r, keys);
                }
            }).fail(function (jqxhr, textStatus, error) {
                message("Failed to get recipes for item " + itemId + ".");
            });
        } else {
            recurseBuildCraftingEntry(r, keys);
        }
    } else {
        $('#crafts tbody').html(r.join(""));
        $('#crafts').show();
        message("Done with crafting tips.");
    }
}

function recurseBuildItemEntry(c, keys) {
    if (keys.length > 0) {
        var itemIds = keys.splice(0, 199); // 200 items limit per api call
        var itemURL = 'https://api.guildwars2.com/v2/items?ids=' + itemIds.join(",");
        message("Getting details for items " + itemIds.join(",") + "...");
        $.getJSON(itemURL, function (json) {
            for (var i = 0; i < json.length; i++) {
                var itemId = json[i].id;
                var itemSource = partialStacks[itemId];
                if (itemSource.length > 1) {
                    if ($.inArray(json[i].type, ['Armor', 'Back', 'Gathering', 'Tool', 'Trinket', 'Weapon', 'Bag']) == -1) {
                        if ($('#consumables').is(':checked') && $.inArray(json[i].type, ['Consumable']) > -1 && $.inArray(json[i].details.type, ['Food', 'Utility']) > -1) {
                            continue;
                        }
                        var total = 0;
                        for (index = 0; index < itemSource.length; ++index) {
                            total += itemSource[index].count;
                        }
                        c.push('<tr><td class="icon" rowspan="' + itemSource.length + '"><img src="');
                        c.push(json[i].icon);
                        c.push('" /><td class="name" rowspan="' + itemSource.length + '">');
                        c.push(total + ' ' + json[i].name);
                        c.push('</td>');
                        for (index = 0; index < itemSource.length; ++index) {
                            if (index > 0) {
                                c.push('<tr>');
                            }
                            c.push('<td class="cost">');
                            c.push(itemSource[index].count);
                            c.push('</td>');
                            c.push('<td class="cost">');
                            c.push(itemSource[index].source);
                            c.push('</td>');
                            c.push('</tr>');
                        }
                    }
                }
            }
            recurseBuildItemEntry(c, keys);
        }).fail(function (jqxhr, textStatus, error) {
            //alert( itemId + "@" + JSON.stringify(itemSource) );
            message("Failed to get details for items " + itemIds.join(",") + ".");
            recurseBuildItemEntry(c, keys);
        });


    } else {
        $('#items tbody').html(c.join(""));
        $('#items').show();
        message("Done with stacking tips.");
    }
}


function getEctoCalc(c) {
    ectoPrice = 0;
    message('Querying ecto price on Trading post.');
    $.getJSON("https://api.guildwars2.com/v2/commerce/prices/19721", function (data) {
        var salvage_price = 0.10496;
        var ecto_chance = 0.875;
        var tp_tax = 0.85;

        ectoPrice = (data.sells.unit_price * tp_tax * ecto_chance - salvage_price) / tp_tax;

        var gold = Math.floor(ectoPrice / 10000);
        var silver = Math.floor((ectoPrice - 10000 * gold) / 100);
        var copper = Math.floor(ectoPrice - 10000 * gold - 100 * silver);

        $("#price .gold").text(gold);
        $("#price .silver").text(silver);
        $("#price .copper").text(copper);

        recurseBuildRareItemEntry([], itemPlacements);
    }).fail(function (jqxhr, textStatus, error) {
        message('Failed to query ecto price on Trading post.');
    });
}

function recurseBuildRareItemEntry(c, itemSources) {

    if (itemSources.length > 0) {
        var itemSourceSlice = itemSources.splice(0, 199); // 200 items limit per api call
        var itemIds = [];
        for (var i = 0; i < itemSourceSlice.length; i++) {
            itemIds.push(itemSourceSlice[i].itemId);
        };
        var itemURL = 'https://api.guildwars2.com/v2/items?ids=' + itemIds.join(",");
        message("Getting details for items " + itemIds.join(",") + "...");

        $.getJSON(itemURL, function (json) {
            for (var j = 0; j < itemSourceSlice.length; j++) {
                for (var i = 0; i < json.length; i++) {
                    if (json[i].id == itemSourceSlice[j].itemId) {
                        if ($.inArray(json[i].type, ['Armor', 'Back', 'Trinket', 'Weapon']) != -1 && json[i].rarity == 'Rare' && json[i].level > 77 && $.inArray('NoSalvage', json[i].flags) == -1) {
                            c.push('<tr><td class="icon"><img src="');
                            c.push(json[i].icon);
                            c.push('" /><td class="name">');
                            c.push(json[i].name);
                            c.push('</td>');
                            c.push('<td class="cost">');
                            c.push(itemSourceSlice[j].source);
                            c.push('</td>');
                            c.push('<td class="name ' + itemSourceSlice[j].itemId + '" class="cost">?</td>');
                            addItemSource(itemPlacements[itemSourceSlice[j].itemId], c);
                            itemsToCheckRarePrices.push(itemSourceSlice[j].itemId);
                        }
                    }
                }
            };
            recurseBuildRareItemEntry(c, itemSources);
        }).fail(function (jqxhr, textStatus, error) {
            //alert( itemId + "@" + JSON.stringify(itemSource) );
            message("Failed to get details for items " + itemIds.join(",") + ".");
            recurseBuildRareItemEntry(c, itemSources);
        });
    } else {
        if (c.length == 0) {
            $('#raresalvage tbody').html('<tr><td class="cost">Nothing</td></tr>');
        } else {
            $('#raresalvage tbody').html(c.join(""));
        }
        $('#raresalvage').show();

        fetchItemPricesRarePrices(itemsToCheckRarePrices);
    }
}

function fetchItemPricesRarePrices(items) {

    if (items.length > 0) {

        var itemSlice = items.splice(0, 199);
        var itemURL = 'https://api.guildwars2.com/v2/commerce/prices?ids=' + itemSlice.join(",");
        message("Getting prices for items " + itemSlice.join(",") + "...");
        $.getJSON(itemURL, function (json) {
            for (var j = 0; j < json.length; j++) {
                $("." + json[j].id).each(function () {
                    var gold = Math.floor(json[j].sells.unit_price / 10000);
                    var silver = Math.floor((json[j].sells.unit_price - 10000 * gold) / 100);
                    var copper = Math.floor(json[j].sells.unit_price - 10000 * gold - 100 * silver);

                    var todo = '';

                    if (ectoPrice > json[j].sells.unit_price) {
                        todo = 'Salvage!'
                    } else {
                        todo = 'Sell!'
                    }

                    $(this).html(
                        todo + ' <span class="gold">' + gold + '</span> <img src="../common/gold.png" /> <span class="silver">' + silver + '</span> <img src="../common/silver.png" /> <span class="copper">' + copper + '</span> <img src="../common/copper.png" />'
                    );
                });
            };
            fetchItemPricesRarePrices(items);
        }).fail(function (jqxhr, textStatus, error) {
            //alert( itemId + "@" + JSON.stringify(itemSource) );
            message("Failed to get prices for items " + itemSlice.join(",") + ".");
            fetchItemPricesRarePrices(items);
        });
    } else {
        message("Done with salvaging tips.");
    }
}

export {
    initializeInventory,
    itemCounts,
    partialStacks,
    itemPlacements,
    addItem
}