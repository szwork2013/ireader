import db from 'localforage';

// db.clear();

export async function save({ payload }) {
  let temp = [payload];
  const data = await db.getItem('bookshelf');
  if (data && data.length > 0) {
    let isInArr = false;
    let arrIndex = 0;
    data.map((i, index) => {
      if (i.id === payload.id) {
        isInArr = true;
        arrIndex = index;
      }
    });
    if (isInArr) {
      // console.log(`${payload.title} 已存在列表中，已更新`);
      const temp2 = data;
      const temp3 = [{ ...temp2[arrIndex], ...payload }];
      temp2.splice(arrIndex, 1);
      temp = temp3.concat(temp2);
      // console.log(temp);
    } else {
      // console.log(`${payload.title} 加入书架`);
      temp = temp.concat(data);
    }
  }
  return db.setItem('bookshelf', temp);
}
export function get() {
  return db.getItem('bookshelf');
}
export async function del({ payload }) {
  console.log(payload);
  const data = await db.getItem('bookshelf');
  const temp = data;
  if (data && data.length > 0) {
    let isInArr = false;
    let arrIndex = 0;
    data.map((i, index) => {
      if (i.id === payload.id) {
        isInArr = true;
        arrIndex = index;
      }
    });
    if (isInArr) {
      temp.splice(arrIndex, 1);
    }
  }
  return db.setItem('bookshelf', temp);
}

export async function getBookById({ query }) {
  const data = await db.getItem('bookshelf');
  if (data) {
    let book;
    data.map((i) => {
      if (query.id === i.id) {
        book = i;
      }
    });
    return book;
  } else {
    return null;
  }
}
