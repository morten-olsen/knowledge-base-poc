// import { Builder } from "./builder/builder.mjs";
// import { Store } from "./store/store.mjs";
//
// type Document = {
//   id: string;
//   body: string;
// };
//
// class MyBuilder extends Builder<Document> {
//   public process(item: Document) {
//     return {
//       id: item.id,
//       chunks: [item.body],
//     }
//   }
//
//   public async *fetch() {
//     yield [{
//       id: 'cow',
//       body: 'The cow says muh',
//     }, {
//       id: 'cat',
//       body: 'The cat says miauw',
//     }, {
//       id: 'kangaru',
//       body: 'The kangaru says hello',
//     }];
//   }
// }
// const store = new Store({
//   builder: new MyBuilder(),
// });
//
// await store.update();
//
// const [answer1] = await store.search({
//   prompt: 'Which animal greets when you meet it?',
//   limit: 1,
// });
//
// const [answer2] = await store.search({
//   prompt: 'What does the animal which makes the milk say?',
//   limit: 1,
// });
//
// console.log('done', answer1);
// console.log('done', answer2);
//
// await store.close();
