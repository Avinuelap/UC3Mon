const PVEARENA_ADDRESS = '0x131e4c58c1F110515ffF442069806F0FC6713889';

const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.img,
      level: characterData.level,
      exp: characterData.exp
    };
  };

  const transformEnemyData = (enemyData) => {
    return {
      name: enemyData.name,
      imageURI: enemyData.img,
      chance: enemyData.chance
    };
  };

export { PVEARENA_ADDRESS, transformCharacterData, transformEnemyData };