<template>
  <div class="magic-navigation">
    <div class="nav-header">
      <h2>Magic: The Gathering</h2>
      <p>page encore en construction</p>
    </div>
    
    <nav class="nav-menu">
      <router-link 
        to="/magic" 
        class="nav-item"
        :class="{ active: $route.path === '/magic' }"
      >
        <span class="nav-icon">🎴</span>
        <span class="nav-text">Cartes</span>
      </router-link>
      
      <router-link 
        to="/magic/deck-builder" 
        class="nav-item"
        :class="{ active: $route.path === '/magic/deck-builder' }"
      >
        <span class="nav-icon">🃏</span>
        <span class="nav-text">Constructeur de Deck</span>
      </router-link>
      
      <router-link 
        to="/magic/collection" 
        class="nav-item"
        :class="{ active: $route.path === '/magic/collection' }"
      >
        <span class="nav-icon">📚</span>
        <span class="nav-text">Ma Collection</span>
      </router-link>
    </nav>

    <div class="nav-info">
      <div class="info-item">
        <span class="info-label">Deck actuel:</span>
        <span class="info-value">{{ currentDeckName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Cartes dans le deck:</span>
        <span class="info-value">{{ deckCardCount }}/60</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const currentDeckName = computed(() => {
  const savedDeck = localStorage.getItem('mtgDeck');
  if (savedDeck) {
    try {
      const deck = JSON.parse(savedDeck);
      return deck.name || 'Deck sans nom';
    } catch {
      return 'Aucun deck sauvegardé';
    }
  }
  return 'Aucun deck sauvegardé';
});

const deckCardCount = computed(() => {
  const savedCards = localStorage.getItem('mtgDeckCards');
  if (savedCards) {
    try {
      const cards = JSON.parse(savedCards);
      return cards.length;
    } catch {
      return 0;
    }
  }
  return 0;
});
</script>

<style scoped>
.magic-navigation {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.nav-header {
  margin-bottom: 1rem;
  text-align: center;
}

.nav-header h2 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-item.active {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border-color: #ffd700;
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-text {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.nav-info {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffd700;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-item {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .nav-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 