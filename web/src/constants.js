const PVEARENA_ADDRESS = '0xE5F3dF0ce0a74e9558A1a254E0a177BBC96d0A97';

const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.img,
      dna: characterData.dna.toNumber(),
      level: characterData.level,
      exp: characterData.exp
    };
  };

export { PVEARENA_ADDRESS, transformCharacterData };