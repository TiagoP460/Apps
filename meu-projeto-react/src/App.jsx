import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hp, setHp] = useState(100);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventory] = useState(['espada', 'poção', 'mapa']);
  const [missions, setMissions] = useState([]);
  const [newMission, setNewMission] = useState('');
  const [missionCategory, setMissionCategory] = useState('Principal');
  const [completedCount, setCompletedCount] = useState(0);
  const [spellInput, setSpellInput] = useState('');
  const [generatedSpell, setGeneratedSpell] = useState('');
  const [heroes, setHeroes] = useState([
    { id: 1, name: 'Aragorn', level: 15, class: 'Guerreiro' },
    { id: 2, name: 'Gandalf', level: 20, class: 'Mago' }
  ]);
  const [availablePoints, setAvailablePoints] = useState(10);
  const [attributes, setAttributes] = useState({
    strength: 0,
    resistance: 0,
    intelligence: 0,
    luck: 0
  });
  const [characterName, setCharacterName] = useState('Herói');
  const [race, setRace] = useState('Humano');
  const [characterClass, setCharacterClass] = useState('Guerreiro');
  const [showStatusEffects, setShowStatusEffects] = useState(false);
  const [gold, setGold] = useState(50);
  const [shopOpen, setShopOpen] = useState(false);
  useEffect(() => {
    if (xp >= level * 300) {
      setLevel(level + 1);
    }
  }, [xp, level]);
  const heal = () => setHp(Math.min(hp + 10, 100));
  const takeDamage = () => setHp(Math.max(hp - 15, 0));

  const getHPColor = () => {
    if (hp > 70) return 'green';
    if (hp >= 30) return 'yellow';
    return 'red';
  };
  const completeMission = () => {
    setXp(xp + 100);
    setGold(gold + 25);
  };

  const defeatEnemy = () => setXp(xp + 50);
  const addMission = () => {
    if (newMission.trim()) {
      setMissions([...missions, {
        id: Date.now(),
        text: newMission,
        category: missionCategory,
        completed: false
      }]);
      setNewMission('');
    }
  };

  const toggleMission = (id) => {
    setMissions(missions.map(m => {
      if (m.id === id) {
        if (!m.completed) setCompletedCount(completedCount + 1);
        else setCompletedCount(completedCount - 1);
        return { ...m, completed: !m.completed };
      }
      return m;
    }));
  };
  const generateSpell = () => {
    const reversed = spellInput.split('').reverse().join('');
    setGeneratedSpell(reversed.toUpperCase());
  };
  const getSortedHeroes = () => {
    return [...heroes].sort((a, b) => b.level - a.level);
  };

  const updateHeroLevel = (id, change) => {
    setHeroes(heroes.map(h => 
      h.id === id ? { ...h, level: h.level + change } : h
    ));
  };
  const incrementAttribute = (attr) => {
    if (availablePoints > 0) {
      setAttributes({ ...attributes, [attr]: attributes[attr] + 1 });
      setAvailablePoints(availablePoints - 1);
    }
  };

  const decrementAttribute = (attr) => {
    if (attributes[attr] > 0) {
      setAttributes({ ...attributes, [attr]: attributes[attr] - 1 });
      setAvailablePoints(availablePoints + 1);
    }
  };
  const buyItem = (price) => {
    if (gold >= price) {
      setGold(gold - price);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>{characterName.toUpperCase()}</h1>
        <div>
          <span>{race}</span> | <span>{characterClass}</span>
        </div>
      </header>

      <div className="grid">
        <div>
          <section className="card">
            <h2>⚔️ Sistema de Combate</h2>
            <div>HP: {hp} / 100</div>
            <div className="bar">
              <div 
                className={`bar-fill ${hp < 30 ? 'critical' : ''}`}
                style={{ 
                  width: `${hp}%`,
                  backgroundColor: getHPColor()
                }}
              ></div>
            </div>
            <button onClick={heal}>🧪 Curar (+10 HP)</button>
            <button onClick={takeDamage}>💥 Dano (-15 HP)</button>
          </section>
          <section className="card">
            <h2>⭐ Experiência e Níveis</h2>
            <div>Nível: {level}</div>
            <div>XP: {xp} / {level * 300}</div>
            <div className="bar">
              <div 
                className="bar-fill"
                style={{ 
                  width: `${(xp % (level * 300)) / (level * 300) * 100}%`,
                  backgroundColor: 'gold'
                }}
              ></div>
            </div>
            <button onClick={completeMission}>📜 Completar Missão (+100 XP)</button>
            <button onClick={defeatEnemy}>⚔️ Derrotar Inimigo (+50 XP)</button>
          </section>
          <section className="card">
            <h2>💪 Atributos</h2>
            <div>Pontos Disponíveis: {availablePoints}</div>
            
            <div className="attr-row">
              <span>💪 Força: {attributes.strength}</span>
              <button onClick={() => decrementAttribute('strength')}>-</button>
              <button onClick={() => incrementAttribute('strength')}>+</button>
            </div>
            
            <div className="attr-row">
              <span>🛡️ Resistência: {attributes.resistance}</span>
              <button onClick={() => decrementAttribute('resistance')}>-</button>
              <button onClick={() => incrementAttribute('resistance')}>+</button>
            </div>
            
            <div className="attr-row">
              <span>🧠 Inteligência: {attributes.intelligence}</span>
              <button onClick={() => decrementAttribute('intelligence')}>-</button>
              <button onClick={() => incrementAttribute('intelligence')}>+</button>
            </div>
            
            <div className="attr-row">
              <span>🍀 Sorte: {attributes.luck}</span>
              <button onClick={() => decrementAttribute('luck')}>-</button>
              <button onClick={() => incrementAttribute('luck')}>+</button>
            </div>

            <div className="attr-effects">
              <div>Força afeta dano</div>
              <div>Resistência afeta vida</div>
              <div>Inteligência afeta mana</div>
              <div>Sorte afeta críticos</div>
            </div>
          </section>
          <section className="card">
            <h2>👤 Personagem</h2>
            <label>
              Nome:
              <input 
                type="text" 
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </label>
            
            <label>
              Raça:
              <select value={race} onChange={(e) => setRace(e.target.value)}>
                <option>Humano</option>
                <option>Elfo</option>
                <option>Anão</option>
                <option>Orc</option>
              </select>
            </label>
            
            <label>
              Classe:
              <select value={characterClass} onChange={(e) => setCharacterClass(e.target.value)}>
                <option>Guerreiro</option>
                <option>Mago</option>
                <option>Arqueiro</option>
              </select>
            </label>
            
            <button onClick={() => setShowStatusEffects(!showStatusEffects)}>
              {showStatusEffects ? '▼' : '►'} Efeitos de Status
            </button>
            
            {showStatusEffects && (
              <div>
                <div>✨ Força Aumentada (+5)</div>
                <div>✨ Regeneração Lenta</div>
              </div>
            )}
          </section>
        </div>
        <div>
          <section className="card">
            <h2>🎒 Inventário</h2>
            <button onClick={() => setInventoryOpen(!inventoryOpen)}>
              {inventoryOpen ? '📭 Fechar Mochila' : '📬 Abrir Mochila'}
            </button>
            
            {inventoryOpen && (
              <div>
                {inventory.map((item, i) => (
                  <div key={i}>🎁 {item}</div>
                ))}
              </div>
            )}
          </section>
          <section className="card">
            <h2>📖 Diário de Missões</h2>
            <div>Missões Completas: {completedCount}</div>
            
            <input 
              type="text"
              value={newMission}
              onChange={(e) => setNewMission(e.target.value)}
              placeholder="Nova missão..."
            />
            
            <select 
              value={missionCategory}
              onChange={(e) => setMissionCategory(e.target.value)}
            >
              <option>Principal</option>
              <option>Secundária</option>
              <option>Urgente</option>
            </select>
            
            <button onClick={addMission}>➕ Adicionar</button>
            
            <div>
              {missions.map(mission => (
                <div key={mission.id} className="mission-item">
                  <input 
                    type="checkbox"
                    checked={mission.completed}
                    onChange={() => toggleMission(mission.id)}
                  />
                  <span className={`badge ${mission.category.toLowerCase()}`}>
                    {mission.category}
                  </span>
                  <span className={mission.completed ? 'completed' : ''}>
                    {mission.text}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="card">
            <h2>🔮 Gerador de Encantamentos</h2>
            <input 
              type="text"
              value={spellInput}
              onChange={(e) => setSpellInput(e.target.value)}
              placeholder="Palavra mágica..."
            />
            <button onClick={generateSpell}>✨ Encantar</button>
            
            {generatedSpell && (
              <div className="spell-result">
                ✨ {generatedSpell} ✨
              </div>
            )}
          </section>
        </div>
        <div>
          <section className="card">
            <h2>🏆 Ranking dos Heróis</h2>
            
            {getSortedHeroes().map((hero, index) => (
              <div key={hero.id} className="hero-item">
                <span>#{index + 1}</span>
                <span>{hero.name}</span>
                <span>{hero.class}</span>
                <span>Nível {hero.level}</span>
                <button onClick={() => updateHeroLevel(hero.id, 1)}>+</button>
                <button onClick={() => updateHeroLevel(hero.id, -1)}>-</button>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>💰 Sistema Econômico</h2>
            <div>Ouro: {gold} 🪙</div>
            
            <button onClick={() => setShopOpen(!shopOpen)}>
              {shopOpen ? '🚪 Fechar Loja' : '🏪 Abrir Loja'}
            </button>
            
            {shopOpen && (
              <div>
                <div className="shop-item">
                  <span>Poção de Vida</span>
                  <button onClick={() => buyItem(15)}>Comprar (15 🪙)</button>
                </div>
                <div className="shop-item">
                  <span>Poção de Mana</span>
                  <button onClick={() => buyItem(15)}>Comprar (15 🪙)</button>
                </div>
                <div className="shop-item">
                  <span>Elixir Raro</span>
                  <button onClick={() => buyItem(30)}>Comprar (30 🪙)</button>
                </div>
                <div className="shop-item">
                  <span>Pergaminho</span>
                  <button onClick={() => buyItem(25)}>Comprar (25 🪙)</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;