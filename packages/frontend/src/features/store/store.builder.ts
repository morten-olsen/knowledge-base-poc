import { Builder } from "@morten-olsen/knowledge-base";

type Document = {
  id: string;
  body: string;
};

class MyBuilder extends Builder<Document> {
  public process(item: Document) {
    return {
      id: item.id,
      chunks: [item.body],
    }
  }

  public async *fetch() {
    yield [{
      id: 'cow',
      body: 'The cow says muh',
    }, {
      id: 'cat',
      body: 'The cat says miauw',
    }, {
      id: 'kangaru',
      body: 'The kangaru says hello',
    }];
  }
}

export { MyBuilder };
