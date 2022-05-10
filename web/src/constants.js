const PVEARENA_ADDRESS = '0x6684b520e4e21e7DDe7eE46821c985F8Ab7D45db';
const SECS_MS = 1000; // To check for updates on rolled number

const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.img,
      dna: characterData.dna.toString(),
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

export { PVEARENA_ADDRESS, SECS_MS, transformCharacterData, transformEnemyData };