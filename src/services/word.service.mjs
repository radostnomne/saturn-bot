import got from "got";
import translate from "@vitalets/google-translate-api";

export const getRandomWord = async () => {
  try {
    const RANDOM_WORD_API_URL = "https://random-word-api.herokuapp.com/word";

    const [randomWord] = await got.get(RANDOM_WORD_API_URL).json();
    console.log(`Random word: [${randomWord}]`);

    const plWord = await translate(randomWord, { to: "pl" });
    const ruWord = await translate(randomWord, { to: "ru" });
    const byWord = await translate(randomWord, { to: "be" });

    const translatedWord = {
      en: randomWord,
      pl: plWord.text,
      ru: ruWord.text,
      by: byWord.text,
    };

    return translatedWord;
  } catch (e) {
    console.error(`Error while getting random word: [${e.message}]`);
  }
};
