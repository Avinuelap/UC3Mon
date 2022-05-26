const PVEARENA_ADDRESS = '0x4f1Ab9c7Fb8ecc5e2B28fb9F60cAF18B64E26e19';

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