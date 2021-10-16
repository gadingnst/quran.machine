/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

require('dotenv').config();
import InstagramSetup from './src/app/utils/InstagramSetup';

console.info('> Conecting to Instagram Account..');
InstagramSetup(true).then(() => {
  console.info(`> Bot served.\n`);
});

// import { QuranJSON } from './src/quran'
// import { get } from 'axios'

// (async () => {
//   await generateDataSurah()
//   await generateShortTafsir()
//   console.log('We were done!')
// })();

// const sleep = (delay = 500) => new Promise(resolve => {
//   setTimeout(resolve, delay)
// })

// async function generateShortTafsir() {
//   let index: number = 1;
//   let data: any = {};

//   for (const [key, value] of Object.entries(quran)) {
//     const { surah, text, tafsir } = value
//     const apiUrl = `https://quran.kemenag.go.id/api/v1/tafsirbyayat/${index}`

//     const run = async () => {
//       try {
//         console.log(`> Getting Tafsir on ayat: ${index} (QS. ${key})`)

//         const {
//           data: {
//             tafsir: [shortTafsir]
//           }
//         } = await get(apiUrl, { withCredentials: true })

//         data[key] = {
//           surah,
//           text,
//           tafsir: {
//             short: shortTafsir.text.replace(/(<([^>]+)>)/gi, ""),
//             long: tafsir
//           }
//         }

//         index++
//         console.log('> Done!\n')
//       } catch (err) {
//         if (err?.response?.status === 429) {
//           console.log(`Too many request on ayat: ${index} (QS. ${key})! Let's take a break 20s... \n`)
//           await sleep(20000)
//           await run()
//         } else {
//           console.trace(err)
//         }
//       }
//     }

//     await run()
//   }

//   await require('fs').promises.writeFile('./quran-tafsir.json', JSON.stringify(data, null, 2))
// }

// async function generateDataSurah() {
//   const data = Object.entries(quran).reduce((acc, [key, id]) => {
//     const [numberSurah, numberAyat] = key.split('.')

//     const {
//       [numberSurah]: {
//         name: surahArab,
//         name_latin: surahLatin,
//         text: { [numberAyat]: arab },
//         translations: {
//           id: { name: surahId }
//         },
//         tafsir: {
//           id: {
//             kemenag: {
//               text: {
//                 [numberAyat]: tafsir
//               }
//             }
//           }
//         }
//       }
//     } = require(`./surah/${numberSurah}.json`)
//     // https://github.com/rioastamal/quran-json

//     return {
//       ...acc,
//       [key]: {
//         surah: {
//           arab: surahArab,
//           latin: surahLatin,
//           id: surahId
//         },
//         text: {
//           arab,
//           id,
//         },
//         tafsir
//       }
//     }
//   }, {})

//   await require('fs').promises.writeFile('./quran.json', JSON.stringify(data, null, 2))
// }
